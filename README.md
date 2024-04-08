# nn-ci plugin

This project implements a set of plugins to calculate the carbon emissions produced during neural network (NN) training and inference phases, accounting for embodied carbon and carbon intensity of different energy mixes powering up the different Cloud facilities at hand. 
Overall, we implemented 4 plug-ins inspired by the state of the art, to estimate:
- embodied carbon emissions of the training & querying phase (`nn-emb`),
- energy consumption of NN training phase (`nn-et`),
- energy consumption of NN querying phase (`nn-eq`), and
- carbon emissions of NN training & querying phase (`nn-c`, combining `nn-et` and `nn-eq`).

Please refer to the documentation of each plugin to know about its functioning.

## Considered problem

The training of neural networks (NN) occurs distributedly among thousands of
servers with GPUs/TPUs, requires processing large amounts of data, and can
take up to more than a month to complete. NNs are then deployed to Cloud
datacenters, where they are used to continuously perform inference tasks, i.e.
to reply to user queries. Datacenters involved in NN training and querying
phases consume a considerable amount of electricity and can cause high
greenhouse gas emissions. Those emissions very much depend on the different
carbon intensities of the energy mixes that power up those distributed
facilities. Last, hardware for training and querying (which is regularly
updated by Cloud providers) comes with embodied emissions that further
increase those figures.

The problem we consider is how to holistically estimate the environmental
footprint of NNs, also considering embodied carbon emissions and the
possibility of different datacenters being powered up by different energy
mixes. Particularly, our plugins answer the following questions:

- What are the embodied carbon emissions related to training and querying a
  system based on NNs?
- How much energy do the training and querying phases of NNs consume?
- How much carbon emissions do the training and querying of NNs produce?


## Demo

Please refer to the `manifest.yml` file for a full-fledged example of our plugin pipeline, based on data from the training and querying of GPT-3. The demo is run in this [video presentation](https://youtu.be/sWv5F_T9B6o).

## References

Our solution was inspired by different estimate models available in the
literature. For the calculations of energy and carbon emissions of training and
querying:

- David A. Patterson, Joseph Gonzalez, Quoc V. Le, Chen Liang, Lluis-Miquel
  Munguia, Daniel Rothchild, David R. So, Maud Texier, and Jeff Dean. Carbon
  emissions and large neural network training. 2021.
- Ahmad Faiz, Sotaro Kaneda, Ru- han Wang, Rita Osi, Parteek Sharma, Fan Chen,
  and Lei Jiang. Llm- carbon: Modeling the end-to-end carbon footprint of large
  language models. 2023.
- Alexandra Sasha Luccioni, Sylvain Viguier, and Anne-Laure Ligozat.
  Estimating the carbon footprint of bloom, a 176b parameter language model. J.
  Mach. Learn. Res., 24:253:1– 253:15, 2023.

For the computation of embodied carbon emissions and the general framework:

- Nicolas Drouant, Éric Rondeau, Jean- Philippe Georges, and Francis Lepage. Designing green network architectures using the ten commandments for a mature ecosystem. Computer Communications, 42:38–46, 2014


