FROM mhart/alpine-node
MAINTAINER wyvernnot <wyvernnot@gmail.com>
ENV WILDDOG_URL
ENV WILDDOG_SECRET
ENV CLIENT_ID
ENV CLIENT_SECRET
COPY . .
RUN npm install
EXPOSE 8080
CMD ["node","server.js"]