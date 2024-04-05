import {z} from 'zod';

import {ERRORS} from '../util/errors';
import {buildErrorMessage} from '../util/helpers';
import {validate, allDefined} from '../util/validations';
import {NNCEGlobalConfig} from './types';
import {PluginInterface, PluginParams} from '../types/interface';

const {InputValidationError} = ERRORS;

export const NNCE = (globalConfig: NNCEGlobalConfig): PluginInterface => {
  const errorBuilder = buildErrorMessage(NNCE.name);
  const metadata = {
    kind: 'execute',
  };
  const METRICS = [
    'location/servers-energy', // Array of servers energy consumption
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
        inputParameters['location/servers-energy'],
        inputParameters['location/carbon-intensity'],
        inputParameters['location/energy-transport']
      );

      return {
        ...safeInput,
        [outputParamter]: calculateNNCE(
          safeInput,
          inputParameters['location/servers-energy'],
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
          'location/servers-energy': z.array(z.string()),
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
    servers.forEach(server => {
      if (!input[server]) {
        throw new InputValidationError(
          errorBuilder({
            message: `${server} is missing from the input array`,
          })
        );
      }
    });
    carbonIntensityList.forEach(carbonIntensity => {
      if (!input[carbonIntensity]) {
        throw new InputValidationError(
          errorBuilder({
            message: `${carbonIntensity} is missing from the input array`,
          })
        );
      }
    });
    energyTransportList.forEach(energyTransport => {
      if (!input[energyTransport]) {
        throw new InputValidationError(
          errorBuilder({
            message: `${energyTransport} is missing from the input array`,
          })
        );
      }
    });
    return input;
  };

  return {
    metadata,
    execute,
  };
};
