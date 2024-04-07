# NN-ET (energy consumed by training a Neural Network)

`nn-et` is a plugin inspired by the work of [Patterson et al.](https://arxiv.org/abs/2104.10350), 
[Faiz et al.](https://arxiv.org/abs/2309.14393) and [Luccioni et al.](https://jmlr.org/papers/v24/23-0069.html) 
The plugin returns `energy-consumed-by-training-NN` which is used as the input to the `nn-c` plugin that calculates the emissions 
for the training of a Neural Network.


## Parameters
### Plugin config

Six parameters are required in the global config:

- `input-parameters`: which is an object containing all the following parameters
   - `hardware/training`: the ammount of hardwers used to train the model
  -  `servers/training`: the ammount of servers used to train the model
  - `time/training`: for how long the the training has been going (in hours)
  - `pue/training`: power usage
effectiveness of the infrastructure
  - `power/hardware-training`: power consumption of the hardware (in Watts)
  - `power/servers-training`: power consumption of the servers (in Watts) 
- `output-parameter`: a string defining the name to use for the result.


### Inputs

All of `input-parameters` must be available in the `inputs` array.

### Returns

- `output-parameter`: the total energy of querying a NN with
  the parameter name defined by `output-parameter` in global config.


## Calculation
To calculate the energy consumed during the training period, we follow the formula given by Patterson et al., Faiz et al. and Luccioni et al.
```
Et = |Ht| x P_t * ∆t * PUE  
```
Where:
- `Ht` is the set of hardware (servers and GPUs/TPUs) used for training, 
- `P_t` is the average power absorbed by each training server, 
- `∆t` is the training time, 
- `PUE` is the average power usage effectiveness of the training facilities. 

## Implementation
To run the plugin, you must first create an instance of NNET method. Then, you can call execute() to return energy-consumed-by-training-NN.
## Usage

The following snippet demonstrates how to call the `nn-et` plugin from Typescript.

```typescript
import {NNET} from '@grnsft/if-plugins';
const config = {
  'input-parameters': {
      'hardware/training',
      'servers/training',
      'time/training',
      'pue/training',
      'power/hardware-training',
      'power/servers-training',
  };
  'output-parameter': 'total-embodied-carbon';
};


const nnet = NNET(config);
const results = await nnet.execute([
  {
    'hardware/training': 10000
    'servers/training': 625
    'time/training': 360
    'pue/training': 1.1
    'power/hardware-training': 300
    'power/servers-training': 250
  },
]);
```

## Example manifest
IF users will typically call the plugin as part of a pipeline defined in a `manifest` file. In this case, instantiating the plugin is handled by `ie` and does not have to be done explicitly by the user. The following is an example `manifest` that calls `nn-et`:

```yaml
name: nn-et
description: simple demo invoking nn-et
tags:
initialize:
  plugins:
    nn-et:
      method: NNET
      path: '@grnsft/if-plugins'
      global-config:
        input-parameters:
        {
          hardware/training,
          servers/training,
          time/training,
          pue/training,
          power/hardware-training,
          power/servers-training,
        }
        output-parameter: 'energy-consumed-by-query-NN'
tree:
  children:
    child:
      pipeline:
        - nn-et 
      inputs:
        - timestamp: 2023-07-06T00:00
          hardware/training: 10000
          servers/training: 625
          time/training: 360
          pue/training: 1.1
          power/hardware-training: 300
          power/servers-training: 250
          
```

You can run this example by saving it as `./examples/manifests/test/nn-et.yml` and executing the following command from the project root:

```sh
npm i -g @grnsft/if
npm i -g @grnsft/if-plugins
ie --manifest ./examples/manifests/test/nn-et.yml --output ./examples/outputs/nn-et.yml
```

The results will be saved to a new `yaml` file in `./examples/outputs`.
