import {z} from 'zod';

import {ERRORS} from '../util/errors';
import {buildErrorMessage} from '../util/helpers';
import {validate, allDefined} from '../util/validations';
import {NNEQConfig, NNEQKeys, NNEQParameters} from './types';
import {PluginInterface, PluginParams} from '../types/interface';

const {InputValidationError} = ERRORS;

export const NNEQ = (globalConfig: NNEQConfig): PluginInterface => {
  const errorBuilder = buildErrorMessage(NNEQ.name);
  const metadata = {
    kind: 'execute',
  };
  const METRICS = [
    'servers/count/query', //number >= 1
    'servers/power/query', // Watt
    'time/query', // in hours
    'pue/query', //number < 1 && > 0
  ];

  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return inputs.map(input => {
      const safeGlobalConfig = validateGlobalConfig();
      const inputParameters: NNEQParameters =
        safeGlobalConfig['input-parameters'];
      const outputParameter = safeGlobalConfig['output-parameter'];
      const safeInput = Object.assign(
        {},
        input,
        validateInput(input, inputParameters)
      );

      return {
        ...safeInput,
        [outputParameter]: calculateenergyQ(safeInput, inputParameters),
      };
    });
  };

  /**
   * Calculate the Energy consumed during the Training.
   * Eq = |Hq| * ∆t * PUEq * Power consumed
   */
  const calculateenergyQ = (
    input: PluginParams,
    inputParameters: NNEQParameters
  ) => {
    const serversQuery = input[inputParameters['servers/count/query']];
    const timeQuery = input[inputParameters['time/query']];
    const pueQuery = input[inputParameters['pue/query']];
    const powerQuery = input[inputParameters['servers/power/query']];
    return (serversQuery * timeQuery * pueQuery * powerQuery) / 1000;
  };

  const validateGlobalConfig = () => {
    const globalConfigSchema = z
      .object({
        'input-parameters': z.object({
          'servers/count/query': z.string().min(1),
          'servers/power/query': z.string().min(1),
          'time/query': z.string().min(1),
          'pue/query': z.string().min(1),
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
    inputParameters: NNEQParameters
  ) => {
    const keys: NNEQKeys[] = Object.keys(inputParameters) as NNEQKeys[];
    for (const parameter of keys) {
      if (!input[inputParameters[parameter]]) {
        throw new InputValidationError(
          errorBuilder({
            message: `${inputParameters[parameter]} is missing from the input array`,
          })
        );
      }
      if (typeof input[inputParameters[parameter]] !== 'number') {
        throw new InputValidationError(
          errorBuilder({
            message: `${inputParameters[parameter]} is not a number`,
          })
        );
      }
    }
    return input;
  };
  return {
    metadata,
    execute,
  };
};
