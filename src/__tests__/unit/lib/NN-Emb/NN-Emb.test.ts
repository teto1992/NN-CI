import {NNEmb} from '../../../../lib';
import {NNEmbConfig} from '../../../../lib/NN-Emb/types';
import {ERRORS} from '../../../../lib/util/errors';

const {InputValidationError} = ERRORS;

describe('lib/NNEmb: ', () => {
  it('is a valid plugin', () => {
    const globalConfig: NNEmbConfig = {
      'input-parameters': {
        'list/carbon-intensity': [],
        'list/device-production-energy': [],
        'list/device-count': [],
        'list/energy-transport': [],
      },
      'output-parameter': 'output',
    };
    const pluginInstance = NNEmb(globalConfig);
    expect(pluginInstance).toHaveProperty('metadata');
    expect(pluginInstance).toHaveProperty('execute');
    expect(pluginInstance.metadata).toHaveProperty('kind');
    expect(typeof pluginInstance.execute).toBe('function');
  });
});

describe('execute(): ', () => {
  it('applies logic on provided inputs array', async () => {
    const globalConfig = {
      'input-parameters': {
        'list/device-count': ['server/count'],
        'list/device-production-energy': ['server/production-energy'],
        'list/carbon-intensity': ['server/carbon-intensity'],
        'list/energy-transport': ['server/energy-factor'],
      },
      'output-parameter': 'total-embodied-carbon',
    };
    const pluginInstance = NNEmb(globalConfig);
    const inputs = [
      {
        'server/count': 100,
        'server/production-energy': 750,
        'server/carbon-intensity': 0.389,
        'server/energy-factor': 0.95,
      },
    ];
    const output = [
      {
        'server/count': 100,
        'server/production-energy': 750,
        'server/carbon-intensity': 0.389,
        'server/energy-factor': 0.95,
        'total-embodied-carbon': 30710.526315789473,
      },
    ];
    const response = await pluginInstance.execute(inputs, {});
    expect(response).toStrictEqual(output);
  });

  it('throw an error on a wrong globalConfig', async () => {
    const errorMessage =
      '"input-parameters" parameter is required. Error code: invalid_type.,"output-parameter" parameter is required. Error code: invalid_type.';
    const pluginInstance = NNEmb({} as NNEmbConfig);
    const inputs = [
      {
        'server/count': 100,
        'server/production-energy': 750,
        'server/carbon-intensity': 0.389,
        'server/energy-factor': 0.95,
      },
    ];
    expect.assertions(2);
    try {
      await pluginInstance.execute(inputs);
    } catch (error) {
      expect(error).toStrictEqual(new InputValidationError(errorMessage));
      expect(error).toBeInstanceOf(InputValidationError);
    }
  });

  it('throw an error on a missing parameter', async () => {
    const errorMessage =
      'NNEmb: server/production-energy is missing from the input array.';
    const globalConfig = {
      'input-parameters': {
        'list/device-count': ['server/count'],
        'list/device-production-energy': ['server/production-energy'],
        'list/carbon-intensity': ['server/carbon-intensity'],
        'list/energy-transport': ['server/energy-factor'],
      },
      'output-parameter': 'total-embodied-carbon',
    };
    const pluginInstance = NNEmb(globalConfig);
    const inputs = [
      {
        'server/count': 100,
        'server/carbon-intensity': 0.389,
        'server/energy-factor': 0.95,
      },
    ];
    expect.assertions(2);
    try {
      await pluginInstance.execute(inputs);
    } catch (error) {
      expect(error).toStrictEqual(new InputValidationError(errorMessage));
      expect(error).toBeInstanceOf(InputValidationError);
    }
  });

  it('throw an error on an invalid input', async () => {
    const errorMessage = 'NNEmb: the provided lists have different length.';
    const globalConfig = {
      'input-parameters': {
        'list/device-count': ['server/count'],
        'list/device-production-energy': [],
        'list/carbon-intensity': ['server/carbon-intensity'],
        'list/energy-transport': ['server/energy-factor'],
      },
      'output-parameter': 'total-embodied-carbon',
    };
    const pluginInstance = NNEmb(globalConfig);
    const inputs = [
      {
        'server/count': 100,
        'server/production-energy': 750,
        'server/carbon-intensity': 0.389,
        'server/energy-factor': 0.95,
      },
    ];
    expect.assertions(2);
    try {
      await pluginInstance.execute(inputs);
    } catch (error) {
      expect(error).toStrictEqual(new InputValidationError(errorMessage));
      expect(error).toBeInstanceOf(InputValidationError);
    }
  });

  it('throw an error on an invalid input type', async () => {
    const errorMessage = 'NNEmb: server/energy-factor is not a number.';
    const globalConfig = {
      'input-parameters': {
        'list/device-count': ['server/count'],
        'list/device-production-energy': ['server/production-energy'],
        'list/carbon-intensity': ['server/carbon-intensity'],
        'list/energy-transport': ['server/energy-factor'],
      },
      'output-parameter': 'total-embodied-carbon',
    };
    const pluginInstance = NNEmb(globalConfig);
    const inputs = [
      {
        'server/count': 100,
        'server/production-energy': 750,
        'server/carbon-intensity': 0.389,
        'server/energy-factor': '0.95',
      },
    ];
    expect.assertions(2);
    try {
      await pluginInstance.execute(inputs);
    } catch (error) {
      expect(error).toStrictEqual(new InputValidationError(errorMessage));
      expect(error).toBeInstanceOf(InputValidationError);
    }
  });
});
