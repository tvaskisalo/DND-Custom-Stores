FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN cd frontend && npm run build && cd ..

RUN rm -rf frontend

RUN npm install

USER node 

CMD npm run dev