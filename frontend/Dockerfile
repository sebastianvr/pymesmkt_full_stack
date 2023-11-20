FROM node:18-alpine 

COPY ["package.json", "package-lock.json", "/web/"]

WORKDIR /web

COPY [".", "/web"]

RUN npm install && npm install -g @angular/cli

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]

# PROD MODE
# CMD ["npm", "start"]