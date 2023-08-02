FROM node:10.16-alpine

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 5000

CMD ["npm","start"]