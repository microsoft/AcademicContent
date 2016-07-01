::Builds the docker image on ACS
docker -H 127.0.0.1:22375 build --no-cache --tag=slurm-docker .

::Creates a network on Docker for the SLURM cluster.
docker -H 127.0.0.1:22375 network create slurm

::Creates the master for the SLURM cluster.
docker -H 127.0.0.1:22375 run -dit --net=slurm -h linux0 --name=linux0 slurm-docker /start-master.sh

::Creates 8 nodes on the SLURM cluster.
for /l %%x in (1, 1, 8) do (
	docker -H 127.0.0.1:22375 run -dit --net=slurm -h linux%%x --name=linux%%x slurm-docker /start-node.sh
)

