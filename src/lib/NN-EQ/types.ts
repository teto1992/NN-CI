export type NNEQConfig = {
  'input-parameters': NNEQParameters;
  'output-parameter': string;
};

export type NNEQParameters = {
  'servers/count/query': string;
  'servers/power/query': string;
  'time/query': string;
  'pue/query': string;
};
export type NNEQKeys = keyof NNEQParameters;
