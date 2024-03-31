import {NNEQ} from '../../../../lib';

import {ERRORS} from '../../../../lib/util/errors';

const {InputValidationError} = ERRORS;

describe('lib/NNEQ: ', () => {
  describe('NNEQ(): ', () => {
    it('has metadata field.', () => {
      const pluginInstance = NNEQ({});

      expect(pluginInstance).toHaveProperty('metadata');
      expect(pluginInstance).toHaveProperty('execute');
      expect(pluginInstance.metadata).toHaveProperty('kind');
      expect(typeof pluginInstance.execute).toBe('function');
    });

    describe('execute(): ', () => {
      it('applies logic on provided inputs array.', async () => {
        const pluginInstance = NNEQ({});
        const inputs = [
          {
            'servers/query': 3620,
            'time/query': 24, // in hours
            'pue/query': 1.1, //number < 2 && > 1
            'power/query': 250, // Watt
          },
        ];
        const output = [
          {
            'servers/query': 3620,
            'time/query': 24, // in hours
            'pue/query': 1.1, //number < 2 && > 1
            'power/query': 250,
            'energy-consumed-by-query-NN': 23892000.000000004,
          },
        ];

        const response = await pluginInstance.execute(inputs, {});
        expect(response).toStrictEqual(output);
      });

      it('throws an error on missing "servers/query" ', async () => {
        const errorMessage =
          '"servers/query" parameter is required. Error code: invalid_type.';

        const pluginInstance = NNEQ({});
        const inputs = [
          {
            'time/query': 24, // in hours
            'pue/query': 1.1, //number < 2 && > 1
            'power/query': 250, // Watt
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

      it('throws an error on missing "time/query" ', async () => {
        const errorMessage =
          '"time/query" parameter is required. Error code: invalid_type.';

        const pluginInstance = NNEQ({});
        const inputs = [
          {
            'servers/query': 24, // in hours
            'pue/query': 1.1, //number < 2 && > 1
            'power/query': 250, // Watt
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

      it('throws an error on missing "pue/query" ', async () => {
        const errorMessage =
          '"pue/query" parameter is required. Error code: invalid_type.';

        const pluginInstance = NNEQ({});
        const inputs = [
          {
            'servers/query': 24, // in hours
            'time/query': 1.1, //number < 2 && > 1
            'power/query': 250, // Watt
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

      it('throws an error on missing "power/query" ', async () => {
        const errorMessage =
          '"power/query" parameter is required. Error code: invalid_type.';

        const pluginInstance = NNEQ({});
        const inputs = [
          {
            'servers/query': 24, // in hours
            'pue/query': 1.1, //number < 2 && > 1
            'time/query': 250, // Watt
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
