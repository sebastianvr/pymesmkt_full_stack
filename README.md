# **Ejecución de Docker en modo desarrollo**

Este proyecto adopta un enfoque para la ejecución Full-Stack, abarcando todos los servicios necesarios a través del uso de Docker. La implementación de Docker simplifica significativamente la configuración del entorno de desarrollo. A continuación, se describe paso a paso los procedimientos para ejecutar el proyecto en modo de desarrollo.

### Requisitos previos

- Asegúrate de contar con las instalaciones de Docker y Docker Compose en tu máquina.

## **Instrucciones**

1. Clona el repositorio en tu máquina local.

```bash
git clone git@github.com:sebastianvr/pymesmkt_full_stack.git
```

2. Accede al directorio raíz del proyecto.

```bash
cd .../path/pymesmkt_full_stack
```

3. Pega el siguiente comando para construir y ejecutar los contenedores.

```bash
docker-compose up
```

# **All Tools and Frameworks used**

- ***Angular CLI : `v13.3.9`***
- ***Bootstrap : `v5.2.0`***
- ***NgBootstrap : `v12.1.2`***
- ***Node js : `v16.14.2`***
- ***Express : `v4.17.3`***
- ***Sequelize : `v6.19.0`***
- ***Mysql : `v8.0`***

<div style="display: flex; justify-content: center; align-items: center;">
  <a href="https://v13.angular.io/docs" style="width: 200px; margin: 0 10px;">
    <img src="https://angular.io/assets/images/logos/angular/angular.svg" alt="LogoAngular" width="200">
  </a>
  
  <a href="https://getbootstrap.com/docs/5.2/getting-started/introduction/" style="width: 200px; margin: 0 10px;">
    <img src="https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png" alt="logoBootstrap" width="200">
  </a>
  
  <a href="https://ng-bootstrap.github.io/releases/12.x/#/home" style="width: 200px; margin: 0 10px;">
    <img src="https://ng-bootstrap.github.io/img/logo-stack.svg" alt="logoNgBootstrap" width="200">
  </a>

  <a href="https://nodejs.org/docs/latest-v16.x/api/index.html" style="width: 200px; margin: 0 10px;">
    <img src="https://nodejs.org/static/images/logo.svg" alt="logoNode.js" width="200">
  </a>

  <a href="https://expressjs.com/" style="width: 200px; margin: 0 10px;">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2wAu6kbXwYKlPPMZd2IseY6dUkKpNbU0fg4smLTw8EHYgc1IJHH3S-cdqJUB66jW8jg&usqp=CAU" alt="LogoExpress" width="200">
  </a>
  
  <a href="https://sequelize.org/docs/v6/" style="width: 200px; margin: 0 10px;">
    <img src="https://sequelize.org/img/logo.svg" alt="logoSequelize.svg" width="200">
  </a>
  
  <a href="https://nodejs.org/" style="width: 200px; margin: 0 10px;">
    <img src="https://d1.awsstatic.com/asset-repository/products/amazon-rds/1024px-MySQL.ff87215b43fd7292af172e2a5d9b844217262571.png" alt="logoMySql.svg" width="200">
  </a>
</div>

# **Independent Executions**

It's possible to run this project independently if you're working solely on the frontend or backend.

## **Prerequisites**

Make sure you have Node.js installed in version 16.14.2 before proceeding.

```bash
nvm install 16.14.2
```

1. Clone repository
2. Make sure you are using the correct version of npm

```bash
  nvm use 16.14.2
```

# **Front-end Development**

1. Navigate to the frontend directory

  ```bash
    cd frontend
  ```

2. Install dependencies by running:
  
  ```bash
    npm install
  ```

  4. Make sure you have Angular CLI installed:

  ```bash
    npm install -g @angular/cli@13.3.9
  ```

  4. Launch the front-end by running:

  ```bash
    ng serve -o
  ```
  
  5. Go to link:

  ```url
    http://localhost:5700
  ```

# **Back-end Development**

Before executing the project, ensure that the local server is running.

 1. Navigate to the backend directory:

```bash
  cd backend
```

 2. Install dependencies by running:
  
  ```bash
    npm install
  ```

  3. Add the **`.env`** file to the project.
  4. To run with nodemon:
  
  ```bash
    npm run dev
  ```

5. Or run the project without nodemon, using:

  ```bash
    npm start
  ```
