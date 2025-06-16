# backend/Dockerfile
# Usamos una imagen oficial de Node.js
FROM node:18-alpine

# Creamos el directorio de trabajo
WORKDIR /app

# Copiamos el package.json y package-lock.json
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto de los archivos de la aplicación
COPY . .

# Exponemos el puerto en el que correrá la app
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["npm", "start"]