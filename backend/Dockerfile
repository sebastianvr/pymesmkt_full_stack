FROM node:16-alpine

# Crea el directorio de trabajo de la aplicación
WORKDIR /api

# Copia los archivos de la aplicación a la imagen
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

COPY . .

# Copia la carpeta .env
# COPY .env  d./.env

# Expone el puerto de la aplicación
EXPOSE 8080

# Utiliza nodemon para reiniciar automáticamente la aplicación cuando se detectan cambios en el código
CMD ["npm", "start"]