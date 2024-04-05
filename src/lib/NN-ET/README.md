# NN-ET (energy consumed by training a Neural Network)

`nn-et` is a plugin inspired by the work of [Patterson et al.](https://arxiv.org/abs/2104.10350), 
[Faiz et al.](https://arxiv.org/abs/2309.14393) and [Luccioni et al.](https://jmlr.org/papers/v24/23-0069.html) 
The plugin returns `energy-consumed-by-training-NN` which is used as the input to the `nn-ce` plugin that calculates the emissions 
for the training of a Neural Network.


## Parameters
### Plugin config

Not needed

### Inputs
- `hardware/training`: the ammount of hardwers used to train the model
-  `servers/training`: the ammount of servers used to train the model
- `time/training`: for how long the the training has been going (in hours)
- `pue/training`: power usage
effectiveness of the infrastructure
- `power/hardware-training`: power consumption of the hardware (in Watts)
- `power/servers-training`: power consumption of the servers (in Watts)
## Returns
- `energy-consumed-by-training-NN`: the energy consumed training the Neural Network in a given time interval
## Calculation
To calculate the energy consumed during the training period, we follow the formula given by Patterson et al., Faiz et al. and Luccioni et al.
```
Et = |Ht|* Power consumed * ∆t * PUE 
```
Where:

-  `|Ht| * Power consumed` is calculated as (`hardware/training` * `power/hardware-training` + `servers/training` * `power/servers-training`)
- `∆t` is `time/training`
- `PUE` is `pue/training`

## Implementation
To run the plugin, you must first create an instance of NNET method. Then, you can call execute() to return energy-consumed-by-training-NN.
## Usage

The following snippet demonstrates how to call the `nn-et` plugin from Typescript.

```typescript
import {NNET} from '..../NN-CI';

const nnet = NNET();
const results = await nnet.execute([
  {
    'servers/query': 3620, //number of servers used
    'time/query': 24, // in hours
    'pue/query': 1.1, //number < 2 && > 1
    'power/query': 250, // Watt
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
      path: '..../NN-CI'
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

You can run this example `manifest` by executing the following command from the project root:

```sh
npm i -g @grnsft/if
npm i -g @grnsft/if-plugins
npm ........................
ie --manifest ./examples/manifests/test/nn-et.yml --output ./examples/outputs/nn-et.yml
```

The results will be saved to a new `yaml` file in `./examples/outputs`.
