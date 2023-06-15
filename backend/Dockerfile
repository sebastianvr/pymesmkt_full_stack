FROM node:16-alpine

# Crea el directorio de trabajo de la aplicación
WORKDIR /api

# Copia los archivos de la aplicación a la imagen
COPY package*.json ./
COPY package-lock.json ./

# RUN npm i nodemon 

# Instala las dependencias de la aplicación
RUN npm install

COPY . .

# Expone el puerto de la aplicación
EXPOSE 8080

# Nodemon en modo desarrollo
# CMD ["npm", "run", "dev"]

# Modo produccion
# CMD ["npm", "start"]