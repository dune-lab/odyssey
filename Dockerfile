FROM node:24-alpine

WORKDIR /app

COPY odyssey/package.json ./package.json
COPY odyssey/package-lock.json ./package-lock.json
RUN npm ci

COPY odyssey/src ./src
COPY odyssey/tsconfig.json ./tsconfig.json
COPY odyssey/student-journey.json ./student-journey.json

RUN npx tsc

CMD ["node", "dist/src/server.js"]
