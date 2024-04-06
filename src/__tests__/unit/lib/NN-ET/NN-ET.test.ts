import {NNET} from '../../../../lib';
import {NNETConfig} from '../../../../lib/NN-ET/types';

import {ERRORS} from '../../../../lib/util/errors';

const {InputValidationError} = ERRORS;

describe('lib/NNET: ', () => {
  describe('NNET(): ', () => {
    it('has metadata field.', () => {
      const pluginInstance = NNET({} as NNETConfig);

      expect(pluginInstance).toHaveProperty('metadata');
      expect(pluginInstance).toHaveProperty('execute');
      expect(pluginInstance.metadata).toHaveProperty('kind');
      expect(typeof pluginInstance.execute).toBe('function');
    });

    describe('execute(): ', () => {
      it('applies logic on provided inputs array.', async () => {
        const globalConfig = {
          'input-parameters': {
            'hardware/count/training': 'hardware/training',
            'hardware/power/training': 'power/hardware-training',
            'servers/count/training': 'servers/training',
            'servers/power/training': 'power/servers-training',
            'time/training': 'time/training',
            'pue/training': 'pue/training',
          },
          'output-parameter': 'energy-consumed-by-training-NN',
        };
        const pluginInstance = NNET(globalConfig);
        const inputs = [
          {
            'hardware/training': 10000, //number >= 1
            'servers/training': 625,
            'time/training': 360, // in hours
            'pue/training': 1.1, //number < 2 && > 1
            'power/hardware-training': 300, // Watt
            'power/servers-training': 250,
          },
        ];
        const output = [
          {
            'hardware/training': 10000, //number >= 1
            'servers/training': 625,
            'time/training': 360, // in hours
            'pue/training': 1.1, //number < 2 && > 1
            'power/hardware-training': 300, // Watt
            'power/servers-training': 250,
            'energy-consumed-by-training-NN': 1249875.0000000002,
          },
        ];

        const response = await pluginInstance.execute(inputs);
        expect(response).toStrictEqual(output);
      });

      it('throw an error on a wrong input type', async () => {
        const globalConfig = {
          'input-parameters': {
            'hardware/count/training': 'hardware/training',
            'hardware/power/training': 'power/hardware-training',
            'servers/count/training': 'servers/training',
            'servers/power/training': 'power/servers-training',
            'time/training': 'time/training',
            'pue/training': 'pue/training',
          },
          'output-parameter': 'energy-consumed-by-training-NN',
        };
        const errorMessage = 'NNET: servers/training is not a number.';
        const pluginInstance = NNET(globalConfig);
        const inputs = [
          {
            'hardware/training': 10000, //number >= 1
            'servers/training': '625',
            'time/training': 360, // in hours
            'pue/training': 1.1, //number < 2 && > 1
            'power/hardware-training': 300, // Watt
            'power/servers-training': 250,
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

      it('throws an error on missing "hardware/training" ', async () => {
        const globalConfig = {
          'input-parameters': {
            'hardware/count/training': 'hardware/training',
            'hardware/power/training': 'power/hardware-training',
            'servers/count/training': 'servers/training',
            'servers/power/training': 'power/servers-training',
            'time/training': 'time/training',
            'pue/training': 'pue/training',
          },
          'output-parameter': 'energy-consumed-by-training-NN',
        };
        const errorMessage =
          'NNET: hardware/training is missing from the input array.';

        const pluginInstance = NNET(globalConfig);
        const inputs = [
          {
            'servers/training': 625,
            'time/training': 360, // in hours
            'pue/training': 1.1, //number < 2 && > 1
            'power/hardware-training': 300, // Watt
            'power/servers-training': 250,
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

      it('throws an error on missing "servers/training" ', async () => {
        const globalConfig = {
          'input-parameters': {
            'hardware/count/training': 'hardware/training',
            'hardware/power/training': 'power/hardware-training',
            'servers/count/training': 'servers/training',
            'servers/power/training': 'power/servers-training',
            'time/training': 'time/training',
            'pue/training': 'pue/training',
          },
          'output-parameter': 'energy-consumed-by-training-NN',
        };
        const errorMessage =
          'NNET: servers/training is missing from the input array.';

        const pluginInstance = NNET(globalConfig);
        const inputs = [
          {
            'hardware/training': 10000, //number >= 1
            'time/training': 360, // in hours
            'pue/training': 1.1, //number < 2 && > 1
            'power/hardware-training': 300, // Watt
            'power/servers-training': 250,
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

      it('throws an error on missing "time/training" ', async () => {
        const globalConfig = {
          'input-parameters': {
            'hardware/count/training': 'hardware/training',
            'hardware/power/training': 'power/hardware-training',
            'servers/count/training': 'servers/training',
            'servers/power/training': 'power/servers-training',
            'time/training': 'time/training',
            'pue/training': 'pue/training',
          },
          'output-parameter': 'energy-consumed-by-training-NN',
        };
        const errorMessage =
          'NNET: time/training is missing from the input array.';

        const pluginInstance = NNET(globalConfig);
        const inputs = [
          {
            'hardware/training': 10000, //number >= 1
            'servers/training': 360, // in hours
            'pue/training': 1.1, //number < 2 && > 1
            'power/hardware-training': 300, // Watt
            'power/servers-training': 250,
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

      it('throws an error on missing "pue/training" ', async () => {
        const globalConfig = {
          'input-parameters': {
            'hardware/count/training': 'hardware/training',
            'hardware/power/training': 'power/hardware-training',
            'servers/count/training': 'servers/training',
            'servers/power/training': 'power/servers-training',
            'time/training': 'time/training',
            'pue/training': 'pue/training',
          },
          'output-parameter': 'energy-consumed-by-training-NN',
        };
        const errorMessage =
          'NNET: pue/training is missing from the input array.';

        const pluginInstance = NNET(globalConfig);
        const inputs = [
          {
            'hardware/training': 10000, //number >= 1
            'servers/training': 360, // in hours
            'time/training': 1.1, //number < 2 && > 1
            'power/hardware-training': 300, // Watt
            'power/servers-training': 250,
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

      it('throws an error on missing "power/hardware-training" ', async () => {
        const globalConfig = {
          'input-parameters': {
            'hardware/count/training': 'hardware/training',
            'hardware/power/training': 'power/hardware-training',
            'servers/count/training': 'servers/training',
            'servers/power/training': 'power/servers-training',
            'time/training': 'time/training',
            'pue/training': 'pue/training',
          },
          'output-parameter': 'energy-consumed-by-training-NN',
        };
        const errorMessage =
          'NNET: power/hardware-training is missing from the input array.';

        const pluginInstance = NNET(globalConfig);
        const inputs = [
          {
            'hardware/training': 10000,
            'servers/training': 360,
            'pue/training': 1.1,
            'time/training': 300,
            'power/servers-training': 250,
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
      it('throws an error on missing "power/servers-training" ', async () => {
        const globalConfig = {
          'input-parameters': {
            'hardware/count/training': 'hardware/training',
            'hardware/power/training': 'power/hardware-training',
            'servers/count/training': 'servers/training',
            'servers/power/training': 'power/servers-training',
            'time/training': 'time/training',
            'pue/training': 'pue/training',
          },
          'output-parameter': 'energy-consumed-by-training-NN',
        };
        const errorMessage =
          'NNET: power/servers-training is missing from the input array.';

        const pluginInstance = NNET(globalConfig);
        const inputs = [
          {
            'hardware/training': 10000, //number >= 1
            'servers/training': 360, // in hours
            'pue/training': 1.1, //number < 2 && > 1
            'power/hardware-training': 300, // Watt
            'time/training': 250,
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
  });
});
