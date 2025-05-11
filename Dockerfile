FROM node:lts as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN apt-get update && apt-get install -y ffmpeg git
COPY . .
RUN npm run build

FROM node:lts
WORKDIR /app
RUN apt-get update && apt-get install -y ffmpeg
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /app/nest-cli.json ./nest-cli.json

EXPOSE 3000
CMD npx mikro-orm migration:up && npm run start:prod