import {z} from 'zod';

import {YourGlobalConfig} from './types';
import {PluginInterface, PluginParams} from '../types/interface';

import {validate, allDefined} from '../util/validations';

export const NNEQ = (
  globalConfig: YourGlobalConfig
): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };
  const METRICS = [
    'servers/query', //number >= 1
    'time/query', // in hours
    'pue/query', //number < 1 && > 0
    'power/query', // Watt
  ];

  /**
   * Execute's strategy description here, looking at sci-m.
   */
  const execute = async (inputs: PluginParams[]) : Promise<PluginParams[]> => { 
    return inputs.map(input => {
      // your logic here ??
      globalConfig; //nothing??
      const safeInput = Object.assign({}, input, validateInput(input));

      return {
        //
        ... input,
        'energy-consumed-by-query-NN': calculateenergyQ(safeInput),
        //
      };
    });
  };
  /**
   * Calculate the Energy consumed during the Training.
   * Eq = |Hq| * Time duration of the quering * PUEq * Power consumedq
   */
  const calculateenergyQ = (input: PluginParams )=>{
    const serversQuery = input['servers/query'];
    const timeQuery = input['time/query'];
    const pueQuery = input ['pue/query'];
    const powerQuery = input ['power/query'];
    return serversQuery * timeQuery * pueQuery * powerQuery;
  }
  //HELP PLS validation function
  const validateInput = (input: PluginParams) => {
    //do not know what it dose

    const schema = z.object({
      'servers/query': z.number().gte(1),
      'time/query': z.number().gt(0),
      'pue/query': z.number().gte(1),
      'power/query': z.number().gte(1),
    }).refine(allDefined, 
      { message: `All ${METRICS} should be present.`,});;
      return validate<z.infer<typeof schema>>(schema, input);
  }
  return {
    metadata,
    execute,
  };
  
};
