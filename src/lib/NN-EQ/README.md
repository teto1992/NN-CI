# NN-EQ (energy consumed by quering a Neural Network)

`nn-eq` is a plugin that simply follows the formula givven by [Patterson et al.](https://arxiv.org/abs/2104.10350), 
[Faiz et al.](https://arxiv.org/abs/2309.14393) and [Luccioni et al.](https://jmlr.org/papers/v24/23-0069.html) 
The plugin returns the enregy consumed by quering a Neural Network which is used as the input to the `nn-c` plugin that calculates the emissions 
for the quering of a Neural Network.


## Parameters
### Plugin config

Six parameters are required in the global config:

- `input-parameters`: which is an object containing all the following parameters
  -  `servers/query`: the ammount of servers used to give a response
  - `time/query`: for how long the inferince sistem is useed (in hours)
  - `pue/query`: power usage effectiveness of the infrastructure
  - `power/query`: power consumption of the servers (in Watts)
- `output-parameter`: a string defining the name to use for the result.


### Inputs

All of `input-parameters` must be available in the `inputs` array.

### Returns

- `output-parameter`: the total energy of querying a NN with
  the parameter name defined by `output-parameter` in global config.

## Calculation

To calculate the energy consumed during the quering period we follow the formula given by Patterson et al., Faiz et al. and Luccioni et al.
```
Eq = |Hq|* Pq * ∆t * PUE 
```
Where: 

- `Ht` is the set of hardware (servers and GPUs/TPUs) used for training, 
- `P_q` is the average power absorbed by each training server, 
- `∆t` is the training time, 
- `PUE` is the average power usage effectiveness of the training facilities. 
 

## Implementation
To run the plugin, you must first create an instance of NNEQ method. Then, you can call execute() to return energy-consumed-by-query-NN.
## Usage

The following snippet demonstrates how to call the `nn-eq` plugin from Typescript.

```typescript
import {NNEQ} from `@grnsft/if-plugins`;
const config = {
  'input-parameters': {
    'servers/query', //number of servers used
    'time/query', // in hours
    'pue/query', //number < 2 && > 1
    'power/query', // Watt
  };
  'output-parameter': 'total-embodied-carbon';
};

const nneq = NNEQ(config);
const results = await nneq.execute([
  {
    'servers/query': 3620, //number of servers used
    'time/query': 24, // in hours
    'pue/query': 1.1, //number < 2 && > 1
    'power/query': 250, // Watt
  },
]);
```

## Example manifest
IF users will typically call the plugin as part of a pipeline defined in a `manifest` file. In this case, instantiating the plugin is handled by `ie` and does not have to be done explicitly by the user. The following is an example `manifest` that calls `NNEQ`:

```yaml
name: nn-eq
description: simple demo invoking nn-eq
tags:
initialize:
  plugins:
    nn-eq:
      method: NNEQ
      path: '@grnsft/if-plugins'
      global-config:
        input-parameters:
        {
          'servers/count/query': 'servers/query',
          'servers/power/query': 'power/query',
          'time/query': 'time/query',
          'pue/query': 'pue/query',
        }
        output-parameter: 'energy-consumed-by-query-NN'
tree:
  children:
    child:
      pipeline:
        - nn-eq 
      inputs:
        - timestamp: 2023-07-06T00:00
          servers/query: 3620
          time/query: 24
          pue/query: 1.1
          power/query: 250
```

You can run this example by saving it as `./examples/manifests/test/nn-eq.yml` and executing the following command from the project root:

```sh
npm i -g @grnsft/if
npm i -g @grnsft/if-plugins
ie --manifest ./examples/manifests/test/nn-eq.yml --output ./examples/outputs/nn-eq.yml
```

The results will be saved to a new `yaml` file in `./examples/outputs`.