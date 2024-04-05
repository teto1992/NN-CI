export type YourGlobalConfig = Record<string, any>;
export type NNETGlobalConfig = {
  'hardware/count/training': string;
  'hardware/power/training': string;
  'servers/count/training': string;
  'servers/power/training': string;
  'time/training': string;
  'pue/training': string;
};

export type NNETKeys = keyof NNETGlobalConfig;
