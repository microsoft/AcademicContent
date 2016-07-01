::Copies the demo script to each SLURM node and master
for /l %%x in (0, 1, 8) do (
	docker -H 127.0.0.1:22375 stop linux%%x
)

