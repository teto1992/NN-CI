import {z} from 'zod';

import {ERRORS} from '../util/errors';
import {buildErrorMessage} from '../util/helpers';
import {validate, allDefined} from '../util/validations';
import {NNECGlobalConfig} from './types';
import {PluginInterface, PluginParams} from '../types/interface';

const {InputValidationError} = ERRORS;

export const NNEC = (globalConfig: NNECGlobalConfig): PluginInterface => {
  const errorBuilder = buildErrorMessage(NNEC.name);
  const metadata = {
    kind: 'execute',
  };
  const METRICS = [
    'list/device-count', // number of device (ex: 1000 GPU)
    'list/device-production-energy', // energy required for a production af a single device (kwh)
    'list/carbon-intensity', // carbon intensity for each device type
    'list/energy-transport', // energy transport factor for each device type
  ];

  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return inputs.map(input => {
      const safeGlobalConfig = validateGlobalConfig();
      const inputParameters = safeGlobalConfig['input-parameters'];
      const outputParamter = safeGlobalConfig['output-parameter'];
      const safeInput = validateInput(
        input,
        inputParameters['list/device-count'],
        inputParameters['list/device-production-energy'],
        inputParameters['list/carbon-intensity'],
        inputParameters['list/energy-transport']
      );
      return {
        ...safeInput,
        [outputParamter]: calculateNNEC(
          safeInput,
          inputParameters['list/device-count'],
          inputParameters['list/device-production-energy'],
          inputParameters['list/carbon-intensity'],
          inputParameters['list/energy-transport']
        ),
      };
    });
  };

  const calculateNNEC = (
    input: PluginParams,
    deviceCountList: string[],
    deviceProductionEnergyList: string[],
    carbonIntensityList: string[],
    energyFactorList: string[]
  ) => {
    let totalEmbodiedCarbon = 0;
    for (let i = 0; i < deviceCountList.length; i++) {
      const deviceCount: number = input[deviceCountList[i]];
      const deviceProductionEnergy: number =
        input[deviceProductionEnergyList[i]];
      const carbonIntensity: number = input[carbonIntensityList[i]];
      const energyFactor: number = input[energyFactorList[i]];
      totalEmbodiedCarbon +=
        (carbonIntensity / energyFactor) *
        (deviceProductionEnergy * deviceCount);
    }
    return totalEmbodiedCarbon;
  };

  const validateGlobalConfig = () => {
    const globalConfigSchema = z
      .object({
        'input-parameters': z.object({
          'list/device-count': z.array(z.string()),
          'list/device-production-energy': z.array(z.string()),
          'list/carbon-intensity': z.array(z.string()),
          'list/energy-transport': z.array(z.string()),
        }),
        'output-parameter': z.string().min(1),
      })
      .refine(allDefined, {message: `All ${METRICS} should be present`});

    return validate<z.infer<typeof globalConfigSchema>>(
      globalConfigSchema,
      globalConfig
    );
  };

  const validateInput = (
    input: PluginParams,
    deviceCountList: string[],
    deviceProductionEnergyList: string[],
    carbonIntenstyList: string[],
    energyFactorList: string[]
  ) => {
    if (
      deviceCountList.length !== deviceProductionEnergyList.length ||
      deviceCountList.length !== carbonIntenstyList.length ||
      deviceCountList.length !== energyFactorList.length
    ) {
      throw new InputValidationError(
        errorBuilder({
          message: 'the provided lists have different length',
        })
      );
    }

    const validator = (element: string) => {
      if (!input[element]) {
        throw new InputValidationError(
          errorBuilder({
            message: `${element} is missing from the input array`,
          })
        );
      }
      if (typeof input[element] !== 'number') {
        throw new InputValidationError(
          errorBuilder({
            message: `${element} is not a number`,
          })
        );
      }
    };
    deviceCountList.forEach(validator);
    deviceProductionEnergyList.forEach(validator);
    carbonIntenstyList.forEach(validator);
    energyFactorList.forEach(validator);
    return input;
  };

  return {
    metadata,
    execute,
  };
};
