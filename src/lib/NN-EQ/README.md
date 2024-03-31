# NN-EQ (energy consumed by quering a Neural Network)

`nn-eq` is a plugin that simply follows the formula givven by [Patterson et al.](https://arxiv.org/abs/2104.10350), 
[Faiz et al.](https://arxiv.org/abs/2309.14393) and [Luccioni et al.](https://jmlr.org/papers/v24/23-0069.html) 
The plugin returns `energy-consumed-by-query-NN` which is used as the input to the `nn-cq` plugin that calculates the emissions 
for the quering of a Neural Network.


## Parameters
### Plugin config

Not needed

### Inputs
-  `servers/query`: the ammount of servers used to give a response
- `time/query`: for how long the inferince sistem is useed (in hours)
- `pue/query`: power usage
effectiveness of the infrastructure
- `power/query`: power consumption of the servers (in Watts)
## Returns
- `energy-consumed-by-query-NN`: the energy consumed quering the Neural Network in a given time interval
## Calculation
To calculate the energy consumed during the quering period we follow the formula given by Patterson et al., Faiz et al. and Luccioni et al.
```
Eq = |Hq|* Power consumed * ∆t * PUE 
```
Where:

-  `|Hq|` is  `servers/query`
- `∆t` is `time/query`
- `PUE` is `pue/query`
- `power consumed` is `power/query`

## Implementation
To run the plugin, you must first create an instance of NNEQ method. Then, you can call execute() to return energy-consumed-by-query-NN.
## Usage

The following snippet demonstrates how to call the `nn-eq` plugin from Typescript.

```typescript
import {NNEQ} from '.../NN-CI';

const nneq = NNEQ();
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
IF users will typically call the plugin as part of a pipeline defined in a `manifest` file. In this case, instantiating the plugin is handled by `ie` and does not have to be done explicitly by the user. The following is an example `manifest` that calls `nn-eq`:

```yaml
name: nn-eq
description: simple demo invoking nn-eq
tags:
initialize:
  plugins:
    nn-eq:
      method: NNEQ
      path: '..../NN-CI'
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

You can run this example `manifest` by executing the following command from the project root:

```sh
npm i -g @grnsft/if
npm i -g @grnsft/if-plugins
npm ........................
ie --manifest ./examples/manifests/test/nn-eq.yml --output ./examples/outputs/nn-eq.yml
```

The results will be saved to a new `yaml` file in `./examples/outputs`.