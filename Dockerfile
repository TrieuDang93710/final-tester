FROM node:18

WORKDIR /usr/index

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
# CMD ["npm", "run", "dev"]
