FROM node:10

ARG NODE_ENV=production

WORKDIR /opt/app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install \
  && rm -rf /root/.npm

COPY . /opt/app

ENV PATH /opt/app/node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
EXPOSE 3000

CMD npm start