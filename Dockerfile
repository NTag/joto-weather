FROM node:13-alpine

# Create app directory
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/app
WORKDIR /usr/src/app

COPY package.json package-lock.json /usr/src/app/
RUN npm install

COPY app/package.json app/package-lock.json /usr/src/app/app/
RUN cd app && npm install && cd ../

COPY . /usr/src/app
RUN cd app && npm run build && cd ../

EXPOSE 3100
CMD ["node", "."]
