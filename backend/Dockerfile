FROM node:16

# Crea el directorio de trabajo de la aplicación
WORKDIR /api

# Copia los archivos de la aplicación a la imagen
COPY package*.json ./
COPY . .

# Instala las dependencias de la aplicación
RUN npm install

# Expone el puerto de la aplicación
EXPOSE 8080

# Inicia la aplicación
CMD ["npm", "start"]