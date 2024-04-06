import {NNEQ} from '../../../../lib';
import {NNEQConfig} from '../../../../lib/NN-EQ/types';

import {ERRORS} from '../../../../lib/util/errors';

const {InputValidationError} = ERRORS;

describe('lib/NNEQ: ', () => {
  describe('NNEQ(): ', () => {
    it('has metadata field.', () => {
      const pluginInstance = NNEQ({} as NNEQConfig);

      expect(pluginInstance).toHaveProperty('metadata');
      expect(pluginInstance).toHaveProperty('execute');
      expect(pluginInstance.metadata).toHaveProperty('kind');
      expect(typeof pluginInstance.execute).toBe('function');
    });

    describe('execute(): ', () => {
      it('applies logic on provided inputs array.', async () => {
        const globalConfig: NNEQConfig = {
          'input-parameters': {
            'servers/count/query': 'servers/query',
            'servers/power/query': 'power/query',
            'time/query': 'time/query',
            'pue/query': 'pue/query',
          },
          'output-parameter': 'energy-consumed-by-query-NN',
        };
        const pluginInstance = NNEQ(globalConfig);
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
            'energy-consumed-by-query-NN': 23892.000000000004,
          },
        ];

        const response = await pluginInstance.execute(inputs, {});
        expect(response).toStrictEqual(output);
      });

      it('throw an error on a wrong input type', async () => {
        const globalConfig = {
          'input-parameters': {
            'servers/count/query': 'servers/query',
            'servers/power/query': 'power/query',
            'time/query': 'time/query',
            'pue/query': 'pue/query',
          },
          'output-parameter': 'energy-consumed-by-query-NN',
        };
        const errorMessage = 'NNEQ: servers/query is not a number.';
        const pluginInstance = NNEQ(globalConfig);
        const inputs = [
          {
            'servers/query': '3620',
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

      it('throws an error on missing "servers/query" ', async () => {
        const globalConfig = {
          'input-parameters': {
            'servers/count/query': 'servers/query',
            'servers/power/query': 'power/query',
            'time/query': 'time/query',
            'pue/query': 'pue/query',
          },
          'output-parameter': 'energy-consumed-by-query-NN',
        };
        const errorMessage =
          'NNEQ: servers/query is missing from the input array.';

        const pluginInstance = NNEQ(globalConfig);
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
        const globalConfig = {
          'input-parameters': {
            'servers/count/query': 'servers/query',
            'servers/power/query': 'power/query',
            'time/query': 'time/query',
            'pue/query': 'pue/query',
          },
          'output-parameter': 'energy-consumed-by-query-NN',
        };
        const errorMessage =
          'NNEQ: time/query is missing from the input array.';

        const pluginInstance = NNEQ(globalConfig);
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
        const globalConfig = {
          'input-parameters': {
            'servers/count/query': 'servers/query',
            'servers/power/query': 'power/query',
            'time/query': 'time/query',
            'pue/query': 'pue/query',
          },
          'output-parameter': 'energy-consumed-by-query-NN',
        };
        const errorMessage = 'NNEQ: pue/query is missing from the input array.';

        const pluginInstance = NNEQ(globalConfig);
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
        const globalConfig = {
          'input-parameters': {
            'servers/count/query': 'servers/query',
            'servers/power/query': 'power/query',
            'time/query': 'time/query',
            'pue/query': 'pue/query',
          },
          'output-parameter': 'energy-consumed-by-query-NN',
        };
        const errorMessage =
          'NNEQ: power/query is missing from the input array.';

        const pluginInstance = NNEQ(globalConfig);
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
