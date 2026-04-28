FROM node:24-alpine

WORKDIR /app

COPY enxoval/auth/package.json ./enxoval/auth/package.json
COPY enxoval/auth/dist ./enxoval/auth/dist

COPY enxoval/http/package.json ./enxoval/http/package.json
COPY enxoval/http/dist ./enxoval/http/dist

COPY enxoval/types/package.json ./enxoval/types/package.json
COPY enxoval/types/dist ./enxoval/types/dist

WORKDIR /app/odyssey

COPY odyssey/package.json odyssey/package-lock.json ./
RUN npm install

COPY odyssey/src ./src
COPY odyssey/tsconfig.json ./

RUN npx tsc

CMD ["node", "dist/src/server.js"]
