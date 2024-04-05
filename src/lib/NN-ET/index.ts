import {z} from 'zod';

import {YourGlobalConfig} from './types';
import {PluginInterface, PluginParams} from '../types/interface';

import {validate, allDefined} from '../util/validations';

export const NNET = (globalConfig: YourGlobalConfig): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };
  const METRICS = [
    'hardware/training', //number >= 1
    'servers/training',
    'time/training', // in hours
    'pue/training', //number < 1 && > 0
    'power/hardware-training', // Watt
    'power/servers-training',
  ];

  /**
   * Execute's strategy description here, looking at sci-m.
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return inputs.map(input => {
      // your logic here ??
      globalConfig; //nothing??
      const safeInput = Object.assign({}, input, validateInput(input));

      return {
        //
        ...input,
        'energy-consumed-by-training-NN': calculateenergyTraining(safeInput),
        //
      };
    });
  };
  /**
   * Calculate the Energy consumed during the Training.
   * Et = |Ht| * ∆t * PUEt * Power consumedt
   *
   */
  const calculateenergyTraining = (input: PluginParams) => {
    const hardwareTraining = input['hardware/training'];
    const serversTraining = input['servers/training'];
    const timeTraining = input['time/training'];
    const pueTraining = input['pue/training'];
    const powerHardwareTraining = input['power/hardware-training'];
    const powerServersTraining = input['power/servers-training'];

    return (
      (pueTraining *
        (hardwareTraining * powerHardwareTraining +
          serversTraining * powerServersTraining) *
        timeTraining) /
      1000
    );
  };
  //HELP PLS validation function
  const validateInput = (input: PluginParams) => {
    //do not know what it dose

    const schema = z
      .object({
        'hardware/training': z.number().gte(1),
        'servers/training': z.number().gte(1),
        'time/training': z.number().gt(0),
        'pue/training': z.number().gte(1),
        'power/hardware-training': z.number().gte(1),
        'power/servers-training': z.number().gte(1),
      })
      .refine(allDefined, {message: `All ${METRICS} should be present.`});
    return validate<z.infer<typeof schema>>(schema, input);
  };
  return {
    metadata,
    execute,
  };
};
