FROM mhart/alpine-node
MAINTAINER wyvernnot <wyvernnot@gmail.com>
ENV WILDDOG_URL=url WILDDOG_SECRET=secret CLIENT_ID=id CLIENT_SECRET=secret
COPY . .
RUN npm install
EXPOSE 8080
CMD ["node","server.js"]