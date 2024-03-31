import {NNET} from '../../../../lib';

import {ERRORS} from '../../../../lib/util/errors';

const {InputValidationError} = ERRORS;

describe('lib/NNET: ', () => {
  describe('NNET(): ', () => {
    it('has metadata field.', () => {
      const pluginInstance = NNET({});

      expect(pluginInstance).toHaveProperty('metadata');
      expect(pluginInstance).toHaveProperty('execute');
      expect(pluginInstance.metadata).toHaveProperty('kind');
      expect(typeof pluginInstance.execute).toBe('function');
    });

    describe('execute(): ', () => {
      it('applies logic on provided inputs array.', async () => {
        const pluginInstance = NNET({});
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
            'energy-consumed-by-training-NN': 1249875000.0000002,
          },
        ];

        const response = await pluginInstance.execute(inputs, {});
        expect(response).toStrictEqual(output);
      });

      it('throws an error on missing "hardware/training" ', async () => {
        const errorMessage =
          '"hardware/training" parameter is required. Error code: invalid_type.';

        const pluginInstance = NNET({});
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
        const errorMessage =
          '"servers/training" parameter is required. Error code: invalid_type.';

        const pluginInstance = NNET({});
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
        const errorMessage =
          '"time/training" parameter is required. Error code: invalid_type.';

        const pluginInstance = NNET({});
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
        const errorMessage =
          '"pue/training" parameter is required. Error code: invalid_type.';

        const pluginInstance = NNET({});
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
        const errorMessage =
          '"power/hardware-training" parameter is required. Error code: invalid_type.';

        const pluginInstance = NNET({});
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
        const errorMessage =
          '"power/servers-training" parameter is required. Error code: invalid_type.';

        const pluginInstance = NNET({});
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
