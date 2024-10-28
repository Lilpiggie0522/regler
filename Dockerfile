FROM node:20-alpine

ENV MONGODB_URI="mongodb+srv://cowhorse3900:cowhorse2024@3900.5c8wx.mongodb.net/comp3900CowHorse?retryWrites=true&w=majority&appName=3900"
ENV SMTP_EMAIL="cowhorse3900@gmail.com"
ENV SMTP_PASSWORD="xggj yaih uoli yjtw"
ENV JWT_SECRET="shhhhh, piggie is coming!"
ENV IMAGEKIT_PRIVATE_KEY="private_AtxTa+wbvBHOO8F2lqoql22O2/I="

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "start" ]