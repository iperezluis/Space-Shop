# Install dependencies only when needed
# FROM node:16-alpine AS deps
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile 
# RUN yarn install --frozen-lockfile --ignore-engines

# Build the app with cache dependencies
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build


# Production image, copy all the files and run next
FROM node:16-alpine  AS runner

# Set working directory
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --prod 
# RUN yarn install --prod --ignore-engines
COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/dist ./dist

# # Copiar el directorio y su contenido
# RUN mkdir -p ./pokedex

# COPY --from=builder ./app/dist/ ./app
# COPY ./.env ./app/.env

# # Dar permiso para ejecutar la applicación
# RUN adduser --disabled-password pokeuser
# RUN chown -R pokeuser:pokeuser ./pokedex
# USER pokeuser

# EXPOSE 3000

CMD [ "yarn","start" ]