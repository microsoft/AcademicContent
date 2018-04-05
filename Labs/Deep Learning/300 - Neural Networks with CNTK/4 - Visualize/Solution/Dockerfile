FROM microsoft/mmlspark:plus-0.7.91
USER root
RUN curl https://cntk.ai/BinaryDrop/CNTK-2-3-Linux-64bit-CPU-Only.tar.gz  -o /home/mmlspark/CNTK.tar.gz && \
	tar -xzf /home/mmlspark/CNTK.tar.gz && \
	chown -R mmlspark:mmlspark cntk
COPY . /node-app
WORKDIR /node-app
ENV PATH=/home/mmlspark/cntk/cntk/bin:$PATH
ENV LD_LIBRARY_PATH=/home/mmlspark/cntk/cntk/lib:/home/mmlspark/cntk/cntk/dependencies/lib:$LD_LIBRARY_PATH
RUN apt-get update && apt-get install -y curl && \
	curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
	apt-get install -y nodejs && \
	npm install

EXPOSE 3003
CMD npm start