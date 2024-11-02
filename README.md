<<<<<<< HEAD
This template should help get you started developing with Vue 3 in Vite.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
=======
# Getting Started with Create Express Server and React App 

Proyecto base en node express sequelize mysql

1. Instalar las dependencias del proyecto 

    ``` npm install```

2. Configuracion archivo env.example  copiar y pegar en el directorio raiz y cambiar de nombre a .env

```
    PORT=5001
    HOST=0.0.0.0

    MYSQL_PORT=3307
    MYSQL_USER=chelo
    MYSQL_PASSWORD=password
    MYSQL_DB_NAME=database_node
    MYSQL_HOST=localhost

    DIALECT=mysql

    SECRET_KEY=mi_clave_secreta

```

3. Configuracion con docker si esta usando docker para la base de datos 
    ``` docker compose up -d```
    esto creara lon bind volume con el nombre de database en la ruta raiz

4. Si esta usando docker puede se instalo phpmyadmin en un contenedor se vizualiza en http://localhost:8070
las credenciales estan definidas por el archivo .env  servidor = MYSQL_HOST   user = MYSQL_USER  pass = MYSQL_PASSWORD


5. Si no usa docker Ejecutar el comando para crear la base de datos y correr los seeders que existen 

    ``` npm run db```

6. Ejecutar la aplicacion cuando se quiera compilar y crear los archivos

    ``` node app ```

7. Ejecutar la aplicacion para entrar en modo desarrollo 

    ``` npm run dev ```

>>>>>>> 6f726bdc5e83d4b150cac16be6866e2cd909a6db
