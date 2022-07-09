FROM node:16.16.0
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . ./app
CMD ["npm", "start"]