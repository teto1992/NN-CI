import {z} from 'zod';

import {ERRORS} from '../util/errors';
import {buildErrorMessage} from '../util/helpers';
import {validate, allDefined} from '../util/validations';
import {NNETGlobalConfig, NNETKeys, YourGlobalConfig} from './types';
import {PluginInterface, PluginParams} from '../types/interface';

const {InputValidationError} = ERRORS;

export const NNET = (globalConfig: YourGlobalConfig): PluginInterface => {
  const errorBuilder = buildErrorMessage(NNET.name);
  const metadata = {
    kind: 'execute',
  };
  const METRICS = [
    'hardware/count/training', // number >= 1
    'hardware/power/training', // watt
    'servers/count/training', // number >= 1
    'servers/power/training', // watt
    'time/training', // time (hours)
    'pue/training', // power usage effectiveness
  ];

  /**
   * Execute's strategy description here, looking at sci-m.
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return inputs.map(input => {
      const safeGlobalConfig = validateGlobalConfig();
      const inputParamenters: NNETGlobalConfig =
        safeGlobalConfig['input-parameters'];
      const outputParameter = safeGlobalConfig['output-parameter'];
      const safeInput = Object.assign(
        {},
        input,
        validateInput(input, inputParamenters)
      );

      return {
        //
        ...safeInput,
        [outputParameter]: calculateEnergyTraining(safeInput, inputParamenters),
        //
      };
    });
  };
  /**
   * Calculate the Energy consumed during the Training.
   * Et = |Ht| * ∆t * PUEt * Power consumedt
   *
   */
  const calculateEnergyTraining = (
    input: PluginParams,
    inputParameters: NNETGlobalConfig
  ) => {
    const hardwareTraining = input[inputParameters['hardware/count/training']];
    const serversTraining = input[inputParameters['servers/count/training']];
    const timeTraining = input[inputParameters['time/training']];
    const pueTraining = input[inputParameters['pue/training']];
    const powerHardwareTraining =
      input[inputParameters['hardware/power/training']];
    const powerServersTraining =
      input[inputParameters['servers/power/training']];

    return (
      (pueTraining *
        (hardwareTraining * powerHardwareTraining +
          serversTraining * powerServersTraining) *
        timeTraining) /
      1000
    );
  };

  const validateGlobalConfig = () => {
    const globalConfigSchema = z
      .object({
        'input-parameters': z.object({
          'hardware/count/training': z.string().min(1),
          'hardware/power/training': z.string().min(1),
          'servers/count/training': z.string().min(1),
          'servers/power/training': z.string().min(1),
          'time/training': z.string().min(1),
          'pue/training': z.string().min(1),
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
    inputParameters: NNETGlobalConfig
  ) => {
    const keys: NNETKeys[] = Object.keys(inputParameters) as NNETKeys[];
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
