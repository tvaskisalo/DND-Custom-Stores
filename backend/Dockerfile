FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

ENV PORT=PORT:4000
ENV SECRET=SECRET:*
ENV MONGODB_URI=MONGODB_URI:*

RUN npm run build

USER node

CMD npm start