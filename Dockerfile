FROM debian:latest

ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 24.12.0

RUN apt update && apt install -y tor curl
RUN echo "ExitNodes {us}" >> /etc/tor/torrc && echo "StrictNodes 1" >> /etc/tor/torrc
RUN tor &

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
RUN . $NVM_DIR/nvm.sh && nvm install $NODE_VERSION

ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]