FROM node:20

USER root

WORKDIR /home/node/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build:images
RUN npm run build

CMD ["npm", "start"]
EXPOSE 3000