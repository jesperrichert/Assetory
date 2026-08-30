FROM golang:1.25.4 AS base
WORKDIR /app

FROM node:latest AS frontend
WORKDIR /Assetory.Frontend

COPY /Assetory.Frontend /Assetory.Frontend

RUN npm install
RUN npm run build

FROM base AS backend
WORKDIR /Assetory.Backend

COPY /Assetory.Backend /Assetory.Backend

RUN go build cmd/main.go 

FROM base AS release
WORKDIR /app

ENV FRONTEND_BUILD=/app/Assetory.Frontend/build

COPY --from=frontend /Assetory.Frontend/build/ /app/Assetory.Frontend/build/
COPY --from=backend /Assetory.Backend/main /app/Assetory.Backend/main

CMD [ "/app/Assetory.Backend/main" ]