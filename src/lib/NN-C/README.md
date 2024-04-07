# NN-C

This plugin is part of a pipeline and it's used to calculate the total
carbon emissions of a Neural Network.

## Parameters

### Plugin config

Five parameters are required in the global config:

- `input-parameters`: which is an object containing all the following parameters
  - `location/datacenter-energy`: an array of strings. Each string should match
    an existing key in the `inputs` array.
    Every entry represents the power usage of a given data center in kWh.
  - `location/carbon-intensity`: an array of strings. Each string should match
    an existing key in the `inputs` array.
    Every entry represents the carbon intensity at the data center
    in gCO2-eq/kWh.
  - `location/energy-transport`: an array of strings. Each string should match
    an existing key in the `inputs` array.
    Every entry represents a transport factor, measuring the amount of energy
    consumed to deliver electricity to the data center.
- `output-parameter`: a string defining the name to use for the result.

### Inputs

All of `input-parameters` must be available in the `inputs` array.

### Returns

- `output-parameter`: the total carbon emissions during the usage of a NN with
  the parameter name defined by `output-parameter` in global config.

## Calculation

$output = \sum_{d\in D} \frac{\alpha_d}{\tau_d}*E(d)$

where:
- $D$ is the set of all Datacenters
- $E(d)$ is an entry of `location/datacenter-energy`

- $\alpha_d$ is an entry of `location/carbon-intensity`

- $\tau_d$ is an entry of `location/energy-transport`

## Implementation

To run the plugin, you must first create an instance of `NNC`.
Then, you can call `execute()`.

```ts
import {NNC} from '@grnsft/if-plugins'

const config = {
  'input-parameters': {
    'location/datacenter-energy': ['italy/energy'],
    'location/carbon-intensity': ['italy/carbon-intensity'],
    'location/energy-transport': ['italy/energy-transport'],
  };
  'output-parameter': 'carbon-emissions'
}

const ce = NNC(config);
const result = await ce.execute([
  {
    'italy/energy': 5000,
    'italy/carbon-intensity': 0.389,
    'italy/energy-transport': 0.95,
  }
]);
```

## Example manifest

IF users will typically call the plugin as part of a pipeline
defined in a manifest file.
In this case, instantiating the plugin is handled by and does not have to be done
explicitly by the user. The following is an example manifest that calls `NNC`:

```yml
name: NN-C demo
description:
tags:
initialize:
  plugins:
    nn-c:
    method: NNC
    path: '@grnsft/if-plugins'
    global-config:
      input-parameters:
        {
          location/datacenter-energy: ['italy/energy'],
          location/carbon-intensity: ['italy/carbon-intensity'],
          location/energy-transport: ['italy/energy-transport'],
        }
      output-parameter: 'carbon-emissions'
tree:
  children:
    child:
      pipeline:
        - nn-c
      inputs:
        - italy/energy: 5000
          italy/carbon-intensity: 0.389
          italy/energy-transport: 0.95
```
You can run this example by saving it as `./examples/manifests/test/nn-eq.c` and executing the following command from the project root:

```sh
npm i -g @grnsft/if
npm i -g @grnsft/if-plugins
ie --manifest ./examples/manifests/test/nn-c.yml --output ./examples/outputs/nn-c.yml
```

The results will be saved to a new `yaml` file in `./examples/outputs`.