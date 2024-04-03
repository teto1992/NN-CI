import {z} from 'zod';

import {ERRORS} from '../util/errors';
import {buildErrorMessage} from '../util/helpers';
import {validate, allDefined} from '../util/validations';
import {YourGlobalConfig} from './types';
import {PluginInterface, PluginParams} from '../types/interface';

const {InputValidationError} = ERRORS;

export const NNCE = (globalConfig: YourGlobalConfig): PluginInterface => {
  const errorBuilder = buildErrorMessage(NNCE.name);
  const metadata = {
    kind: 'execute',
  };
  const METRICS = [
    'location/servers-energy', // Array of servers energy consumption
    'location/alpha', // Array of alpha (gCO2-eq)
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
        inputParameters['location/alpha']
      );

      return {
        ...safeInput,
        [outputParamter]: calculateNNCE(
          safeInput,
          inputParameters['location/servers-energy'],
          inputParameters['location/alpha']
        ),
      };
    });
  };

  /**
   * Calcualte the Equivalent Carbon Emission
   * CE = Sum(alphal * El)
   */
  const calculateNNCE = (
    input: PluginParams,
    servers: string[],
    alphaList: string[]
  ) => {
    let ce = 0;
    for (let i = 0; i < servers.length; i++)
      ce += input[servers[i]] * input[alphaList[i]];
    return ce;
  };

  const validateGlobalConfig = () => {
    const globalConfigSchema = z
      .object({
        'input-parameters': z.object({
          'location/servers-energy': z.array(z.string()),
          'location/alpha': z.array(z.string()),
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
    alphaList: string[]
  ) => {
    if (servers.length !== alphaList.length) {
      throw new InputValidationError(
        errorBuilder({
          message: 'server list and alpha list have different length',
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
    alphaList.forEach(alpha => {
      if (!input[alpha]) {
        throw new InputValidationError(
          errorBuilder({
            message: `${alpha} is missing from the input array`,
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
