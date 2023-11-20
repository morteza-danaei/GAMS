FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod --omit=dev
COPY . .

CMD ["npm", "start"]