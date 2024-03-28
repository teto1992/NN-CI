
import {YourGlobalConfig} from './types';
import {PluginInterface, PluginParams} from '../types/interface';

export const NNE = (): PluginInterface => {
  //
  const METRICS = ['hardware/training', 'time/training', 'pue/training', 'power/training',
                   'hardware/querying', 'time/querying', 'pue/querying', 'power/querying']; 
  //
  const metadata = {
    kind: 'execute',
  };

  /**
   * Execute's strategy description here.
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => { 
    return inputs.map(input => {
      // your logic here ??
      globalConfig;

      return {
        //
        ... input,
        'energy-consumed-by-NN': calculateenergy(input) ;
        //
      };
    });
  };
  //
 const calculateenergy = (input: PluginParams) => {
    const hardwaretraining= input['hardware/training'];
    const timetraining = input['time/training'];
    const efficencytraining = input['efficency/training'];
    const powertraining= input['power/training'];
    const hardwarequerying= input['hardware/querying'];
    const timequerying = input['time/querying'];
    const efficencyquerying = input['efficency/querying'];
    const powerquerying= input['Hardware/querying'];

    return (
     (hardwaretraining * timetraining * efficencytraining * powertraining + 
      hardwarequerying * timequerying * efficencyquerying * powerquerying)
    );
  };
  //
  return {
    metadata,
    execute,
  };
};
