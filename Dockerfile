# NodeJS Version 16
FROM node:18.17.1-bullseye-slim

# Copy Dir
COPY . ./app

# Work to Dir
WORKDIR /app

# Install Node Package
RUN yarn install

# Set Env
ENV NODE_ENV development

EXPOSE 6080

# Cmd script
CMD ["yarn", "run", "dev"]
