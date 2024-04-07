# NN-Emb

This plugin is part of a pipeline and it's used to calculate the
total embodied carbon of Neural Network.

## Parameters

### Plugin config

Six parameters are required in the global config:

- `input-parameters`: which is an object containing all the following parameters
  - `list/device-count`: an array of strings. Each string should match
    an existing key in the `inputs` array.
    Every entry represents the number of a device.
  - `list/device-production-energy`: an array of strings. Each string should match
    an existing key in the `inputs` array.
    Every entry represents the carbon intensity at the data center
    in gCO2-eq/kWh.
  - `list/carbon-intensity`: an array of strings. Each string should match
    an existing key in the `inputs` array.
    Every entry represents a transport factor, measuring the amount of energy
    consumed to deliver electricity to the data center.
  - `list/energy-transport`: an array of strings. Each string should match
    an existing key in the `inputs` array.
- `output-parameter`: a string defining the name to use for the result.

### Inputs

All of `input-parameters` must be available in the `inputs` array.

### Returns

- `output-parameter`: the total embodied carbon of a NN with
  the parameter name defined by `output-parameter` in global config.

## Calculation

$output = \sum_{h\in H} \frac{\alpha_h}{\tau_h}*E(h)*Count(h)$

where:

- $H$ is the set of the hardware used (e.g. servers, GPUs, TPUs)
- E(h) is the amount of energy used for manufacturing hardware h, in kWh
- $\alpha_h$ is the carbon intensity at the manufacturing facility of h,
  in gCO2-eq/kWh,
- $\tau_h$ is a transport factor, measuring the amount of energy consumed
  to deliver electricity to the manufacturing facility of hardware h.
- $Count(h)$ is the number of the same hardware implied in the NN

## Implementation

To run the plugin, you must first create an instance of `NNEmb`.
Then, you can call `execute()`.

```ts
import {NNEmb} from `@grnsft/if-plugins`

const config = {
  'input-parameters': {
    'list/device-count': ['server/count', 'gpu/count'],
    'list/device-production-energy': ['server/production-energy', 'gpu/production-energy'],
    'list/carbon-intensity': ['server/carbon-intensity', 'gpu/carbon-intensity'],
    'list/energy-transport': ['server/energy-transport', 'gpu/energy-transport'],
  };
  'output-parameter': 'total-embodied-carbon';
};

const embodiedCarbon = NNEmb(config);
const result = await embodiedCarbon.execute([
  {
    'server/count': 1000,
    'server/production-energy': 750,
    'server/carbon-intensity': 0.389,
    'server/energy-transport': 0.95,
    'gpu/count': 10000,
    'gpu/production-energy': 1000,
    'gpu/carbon-intensity': 0.429,
    'gpu/energy-transport': 0.9
  }
]);
```

## Example manifest

IF users will typically call the plugin as part of a pipeline
defined in a manifest file.
In this case, instantiating the plugin is
handled by and does not have to be done
explicitly by the user. The following is an example manifest that calls `NNEmb`:

```yml
name: NN-Emb demo
description:
tags:
initialize:
  plugins:
    nn-emb:
    method: NNEmb
    path: '@grnsft/if-plugins'
    global-config:
      input-parameters:
        {
          list/device-count: ['server/count', 'gpu/count'],
          list/device-production-energy:
            ['server/production-energy', 'gpu/production-energy'],
          list/carbon-intensity:
            ['server/carbon-intensity', 'gpu/carbon-intensity'],
          list/energy-transport:
            ['server/energy-transport', 'gpu/energy-transport'],
        }
      output-parameter: 'total-embodied-carbon'
tree:
  children:
    child:
      pipeline:
        - nn-emb
      inputs:
        - server/count: 1000
          server/production-energy: 750
          server/carbon-intensity: 0.389
          server/energy-transport: 0.95
          gpu/count: 10000
          gpu/production-energy: 1000
          gpu/carbon-intensity: 0.429
          gpu/energy-transport\: 0.9
```
