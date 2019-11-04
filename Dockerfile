FROM node:alpine

# Also exposing VSCode debug ports
EXPOSE 8004

RUN \
  apk add --no-cache python make g++ && \
  apk add vips-dev fftw-dev --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community --repository http://dl-3.alpinelinux.org/alpine/edge/main && \
  rm -fR /var/cache/apk/*

# RUN npm install -g gatsby-cli yarn

WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]