# nn-ci plugin

This project implements a set of plugins to calculate the carbon emissions produced during neural network (NN) training and inference phases, accounting for embodied carbon and carbon intensity of different energy mixes powering up the different Cloud facilities at hand. 
Overall, we implemented 4 plug-ins inspired by the state of the art, to estimate:
- embodied carbon emissions of the training & querying phase (`nn-emb`),
- energy consumption of NN training phase (`nn-et`),
- energy consumption of NN querying phase (`nn-eq`), and
- carbon emissions of NN training & querying phase (`nn-c`, combining `nn-et` and `nn-eq`).

Please refer to the documentation of each plugin to know about its functioning.
