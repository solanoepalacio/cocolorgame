FROM node:12.2.0

WORKDIR /app
COPY ./client /app

RUN npm install

CMD [ "npm", "start" ]