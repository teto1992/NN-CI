import {NNCE} from '../../../../lib';
import {ERRORS} from '../../../../lib/util/errors';

const {InputValidationError} = ERRORS;

describe('lib/NNCE: ', () => {
  describe('NNCE(): ', () => {
    it('is a valid plugin', () => {
      const pluginInstance = NNCE({});
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
          'location/servers-energy': ['server/italy'],
          'location/carbon-intensity': ['alpha/italy'],
          'location/energy-transport': ['tau/italy'],
        },
        'output-parameter': 'carbon-emission',
      };
      const pluginInstance = NNCE(globalConfig);
      const inputs = [
        {
          'server/italy': 100,
          'alpha/italy': 0.389,
          'tau/italy': 1,
        },
      ];
      const output = [
        {
          'server/italy': 100,
          'alpha/italy': 0.389,
          'tau/italy': 1,
          'carbon-emission': 38.9,
        },
      ];
      const response = await pluginInstance.execute(inputs, {});
      expect(response).toStrictEqual(output);
    });
  });

  it('throw an error on a wrong globalConfig', async () => {
    const errorMessage =
      '"input-parameters" parameter is required. Error code: invalid_type.,"output-parameter" parameter is required. Error code: invalid_type.';
    const globalConfig = {};
    const pluginInstance = NNCE(globalConfig);
    const inputs = [
      {
        'server/italy': 100,
        'alpha/italy': 0.389,
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
    const errorMessage = 'NNCE: the provided lists have different length.';
    const globalConfig = {
      'input-parameters': {
        'location/servers-energy': ['server/italy'],
        'location/carbon-intensity': [],
        'location/energy-transport': ['tau/italy'],
      },
      'output-parameter': 'carbon-emission',
    };
    const pluginInstance = NNCE(globalConfig);
    const inputs = [
      {
        'server/italy': 100,
        'alpha/italy': 0.389,
        'tau/italy': 1,
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
    const errorMessage = 'NNCE: tau/italy is not a number.';
    const globalConfig = {
      'input-parameters': {
        'location/servers-energy': ['server/italy'],
        'location/carbon-intensity': ['alpha/italy'],
        'location/energy-transport': ['tau/italy'],
      },
      'output-parameter': 'carbon-emission',
    };
    const pluginInstance = NNCE(globalConfig);
    const inputs = [
      {
        'server/italy': 100,
        'alpha/italy': 0.389,
        'tau/italy': 'foo',
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

  it('throw an error on a missing server energy', async () => {
    const errorMessage = 'NNCE: server/italy is missing from the input array.';
    const globalConfig = {
      'input-parameters': {
        'location/servers-energy': ['server/italy'],
        'location/carbon-intensity': ['alpha/italy'],
        'location/energy-transport': ['tau/italy'],
      },
      'output-parameter': 'carbon-emission',
    };
    const pluginInstance = NNCE(globalConfig);
    const inputs = [
      {
        'alpha/italy': 0.389,
        'tau/italy': 1,
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

  it('throw an error on a missing carbon-intensity', async () => {
    const errorMessage = 'NNCE: alpha/italy is missing from the input array.';
    const globalConfig = {
      'input-parameters': {
        'location/servers-energy': ['server/italy'],
        'location/carbon-intensity': ['alpha/italy'],
        'location/energy-transport': ['tau/italy'],
      },
      'output-parameter': 'carbon-emission',
    };
    const pluginInstance = NNCE(globalConfig);
    const inputs = [
      {
        'server/italy': 100,
        'tau/italy': 1,
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

  it('throw an error on a missing energy-transport', async () => {
    const errorMessage = 'NNCE: tau/italy is missing from the input array.';
    const globalConfig = {
      'input-parameters': {
        'location/servers-energy': ['server/italy'],
        'location/carbon-intensity': ['alpha/italy'],
        'location/energy-transport': ['tau/italy'],
      },
      'output-parameter': 'carbon-emission',
    };
    const pluginInstance = NNCE(globalConfig);
    const inputs = [
      {
        'server/italy': 100,
        'alpha/italy': 0.389,
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
