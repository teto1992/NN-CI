import {z} from 'zod';

import {ERRORS} from '../util/errors';
import {buildErrorMessage} from '../util/helpers';
import {validate, allDefined} from '../util/validations';
import {NNCConfig} from './types';
import {PluginInterface, PluginParams} from '../types/interface';

const {InputValidationError} = ERRORS;

export const NNC = (globalConfig: NNCConfig): PluginInterface => {
  const errorBuilder = buildErrorMessage(NNC.name);
  const metadata = {
    kind: 'execute',
  };
  const METRICS = [
    'location/datacenter-energy', // Array of datacenter energy consumption
    'location/carbon-intensiy', // Array of carbon intensity (gCO2-eq/kwh)
    'location/energy-transport', // Array of energy transport factor
  ];

  /**
   * Execute's strategy description here.
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return inputs.map(input => {
      const safeGlobalConfig = validateGlobalConfig();
      const inputParameters = safeGlobalConfig['input-parameters'];
      const outputParamter = safeGlobalConfig['output-parameter'];
      const safeInput = validateInput(
        input,
        inputParameters['location/datacenter-energy'],
        inputParameters['location/carbon-intensity'],
        inputParameters['location/energy-transport']
      );

      return {
        ...safeInput,
        [outputParamter]: calculateNNCE(
          safeInput,
          inputParameters['location/datacenter-energy'],
          inputParameters['location/carbon-intensity'],
          inputParameters['location/energy-transport']
        ),
      };
    });
  };

  /**
   * Calcualte the Equivalent Carbon Emission
   * CE = Sum((carbon-intensiy/energy-transport) * servers-energy)
   */
  const calculateNNCE = (
    input: PluginParams,
    servers: string[],
    carbonIntensityList: string[],
    energyTransportList: string[]
  ) => {
    let ce = 0;
    for (let i = 0; i < servers.length; i++)
      ce +=
        input[servers[i]] *
        (input[carbonIntensityList[i]] / input[energyTransportList[i]]);
    return ce;
  };

  const validateGlobalConfig = () => {
    const globalConfigSchema = z
      .object({
        'input-parameters': z.object({
          'location/datacenter-energy': z.array(z.string()),
          'location/carbon-intensity': z.array(z.string()),
          'location/energy-transport': z.array(z.string()),
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
    servers: string[],
    carbonIntensityList: string[],
    energyTransportList: string[]
  ) => {
    if (
      servers.length !== carbonIntensityList.length ||
      servers.length !== energyTransportList.length
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
    servers.forEach(validator);
    carbonIntensityList.forEach(validator);
    energyTransportList.forEach(validator);
    return input;
  };

  return {
    metadata,
    execute,
  };
};
