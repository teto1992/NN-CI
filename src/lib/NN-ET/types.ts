export type NNETConfig = {
  'input-parameters': NNETParameters;
  'output-parameter': string;
};
export type NNETParameters = {
  'hardware/count/training': string;
  'hardware/power/training': string;
  'servers/count/training': string;
  'servers/power/training': string;
  'time/training': string;
  'pue/training': string;
};

export type NNETKeys = keyof NNETParameters;
