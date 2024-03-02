FROM node

RUN npm install -g ts-node

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]