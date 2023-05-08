# Usar node 16 como imagen base
FROM node:16

# Directorio de trabajo en la imagen
WORKDIR /web

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar todo el código fuente al directorio de trabajo
COPY . .

# Compilar la aplicación de Angular
RUN npm run build --prod

# Exponer el puerto 80 de la imagen
EXPOSE 4200

# Comando para iniciar la aplicación al ejecutar el contenedor
CMD ["npm", "start"]
