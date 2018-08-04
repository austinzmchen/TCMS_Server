FROM ubuntu:latest

ENV PORT 3001
EXPOSE 3001

RUN apt-get update -q;	\
	apt-get install -y sudo; \
	apt-get install -y npm; \
	apt-get install -y mysql-server; \
	npm i -g typescript; \
	npm i -g ts-node;

# Create app directory
WORKDIR /TCMS_Server

COPY . /TCMS_Server
RUN npm install

CMD ts-node src/app.ts