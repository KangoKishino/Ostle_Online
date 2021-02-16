FROM node:14.15.0-alpine

WORKDIR /app

COPY ./frontend/package*.json ./

RUN npm install -g @vue/cli

RUN npm install

COPY . /frontend/

CMD ["npm", "run", "serve"]