FROM gcr.io/distroless/nodejs:18
WORKDIR /app
COPY node_modules node_modules
COPY dist .
EXPOSE 8001
ENV NODE_ENV production
CMD [ "--enable-source-maps", "-r", "dotenv/config", "index.js" ]
