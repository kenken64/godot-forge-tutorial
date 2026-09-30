FROM docker:29-cli AS docker-cli
FROM node:22-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates unzip zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=docker-cli /usr/local/bin/docker /usr/local/bin/docker

WORKDIR /app
COPY service.mjs ./service.mjs
EXPOSE 8080
CMD ["node", "service.mjs"]
