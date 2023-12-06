FROM node:20

USER root

WORKDIR /home/node/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["npm", "run", "build:images-and-start"]
EXPOSE 3000