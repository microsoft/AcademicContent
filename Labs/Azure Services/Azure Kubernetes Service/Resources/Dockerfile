FROM ubuntu:16.04
WORKDIR minecraft
COPY nukkit.yml .
COPY server.properties .
RUN apt-get update && \
    apt-get install -y openjdk-8-jre-headless wget && \
    wget https://ci.nukkitx.com/job/NukkitX/job/Nukkit/job/master/lastSuccessfulBuild/artifact/target/nukkit-1.0-SNAPSHOT.jar
EXPOSE 19132
CMD java -jar nukkit-1.0-SNAPSHOT.jar