FROM node:12

WORKDIR /app

COPY ./app/package*.json ./

RUN npm install

RUN npm install -g express

COPY . /app/

CMD [ "npm", "run", "watch" ]