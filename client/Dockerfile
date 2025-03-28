
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .


RUN echo "DB_HOST=postgres" > .env && \
    echo "DB_USER=postgres" >> .env && \
   echo "DB_PASSWORD=yourpassword" >> .env && \
 echo "DB_NAME=usersaccs" >> .env && \
   echo "DB_PORT=5432" >> .env && \
    echo "CLIENT_API_KEY=superSecretClientKey12345" >> .env && \
   echo "SESSION_SECRET=yourSecretKey" >> .env

EXPOSE 5173

CMD ["npm", "start"]