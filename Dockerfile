FROM node:16.13.1-alpine3.13

# RUN addgroup app && adduser -S -G app app
# USER app

WORKDIR /app
RUN npm i -g npm@latest


COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000 

CMD ["npm", "start"]