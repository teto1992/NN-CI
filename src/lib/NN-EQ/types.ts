export type YourGlobalConfig = Record<string, any>;
export type NNEQGlobalConfig = {
  'servers/count/query': string;
  'servers/power/query': string;
  'time/query': string;
  'pue/query': string;
};

export type NNEQKeys = keyof NNEQGlobalConfig;
