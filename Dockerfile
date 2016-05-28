FROM mhart/alpine-node
MAINTAINER wyvernnot <wyvernnot@gmail.com>
ENV WILDDOG_URL url
ENV WILDDOG_SECRET secret
ENV CLIENT_ID id
ENV CLIENT_SECRET secret
COPY . .
RUN npm install
EXPOSE 8080
CMD ["node","server.js"]