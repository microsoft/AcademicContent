::Copies the demo script to each SLURM node and master.
for /l %%x in (0, 1, 8) do (
	docker -H 127.0.0.1:22375 cp slurmdemo.py linux%%x:/slurmdemo.py
	docker -H 127.0.0.1:22375 cp slurmdemo.sh linux%%x:/slurmdemo.sh
)

