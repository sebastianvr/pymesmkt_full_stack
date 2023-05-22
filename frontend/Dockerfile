FROM node:16-alpine

COPY ["package.json", "package-lock.json", "/web/"]

WORKDIR /web

COPY [".", "/web"]

RUN  npm install \
    && npm install -g @angular/cli

# RUN bash -c "$(curl -fsSL https://raw.githubusercontent.com/ohmybash/oh-my-bash/master/tools/install.sh)"

EXPOSE 4200
# CMD ["npm", "start"]