# Street Mandarin for any host that runs containers. Needs DATABASE_URL and APP_SECRET (see README).
FROM node:22-slim
WORKDIR /app
COPY server/package.json server/package-lock.json server/
RUN cd server && npm ci --omit=dev
COPY index.html client.js scenes.js why.js voices.js daily.js journey.js people.js ./
COPY server/src server/src
ENV NODE_ENV=production PORT=8080
EXPOSE 8080
USER node
CMD ["node", "server/src/index.js"]
