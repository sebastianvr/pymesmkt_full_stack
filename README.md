# **Funcionalidades del proyecto**

Este proyecto cuenta con tres perfiles de usuarios diferentes:

**Usuario Visitante**: Este perfil tiene acceso limitado a ciertas funcionalidades del sitio web. Las acciones permitidas incluyen la visualización de publicaciones, la búsqueda de las mismas y el registro de un nuevo usuario.

  1. **Visualización y búsqueda de publicaciones**:  
      [![Visualización y búsqueda](https://img.youtube.com/vi/-bSTxQ5WlcA/maxresdefault.jpg)](https://www.youtube.com/watch?v=-bSTxQ5WlcA)

  2. **Registro y login un nuevo usuario**: El usuario visitante puede registrarse en la plataforma para obtener acceso a funcionalidades adicionales como usuario Pyme.  
      [![Registro de usuario](https://img.youtube.com/vi/4wyy5c12e34/maxresdefault.jpg)](https://www.youtube.com/watch?v=4wyy5c12e34)

**Usuario Pyme**: Una vez registrado, el usuario tiene acceso a las siguientes funcionalidades:

  1. **Creación de Publicaciones**: La pyme puede crear publicaciones, cada una de las cuales representa una necesidad que desea resolver, ya sea la compra de un servicio o un producto(s). Para crear una publicación, el usuario debe completar el formulario de creación de publicaciones.
    [![Creación de publicaciones](https://img.youtube.com/vi/eK0q5APUQ_E/maxresdefault.jpg)](https://www.youtube.com/watch?v=eK0q5APUQ_E)

  2. **Creación de ofertas**: El usuario pyme tiene la posibilidad de crear nuevas ofertas siguiendo un proceso sencillo. Primero, debe identificar una publicación que contenga una necesidad que desea resolver. Una vez seleccionada la publicación, se procede a completar los campos requeridos en el formulario de creación de ofertas.
  Después de crear la oferta, esta se almacenará en la sección "Ofertas creadas", accesible desde el menú de navegación. Aquí, el usuario podrá revisar y gestionar todas las ofertas que ha generado.
    [![Creación de ofertas](https://img.youtube.com/vi/Ez199z9-69k/maxresdefault.jpg)](https://www.youtube.com/watch?v=Ez199z9-69k)

  3. **Compra de ofertas**: El usuario tiene la opción de comprar una oferta y proceder a la pasarela de pagos proporcionada por Transbank. Esta funcionalidad se implementa utilizando la API de Transbank, configurada para pruebas en un **entorno de desarrollo**.
    [![Realizar compra](https://img.youtube.com/vi/XmB8Ap0MdBE/maxresdefault.jpg)](https://www.youtube.com/watch?v=XmB8Ap0MdBE)

  4. **Calificación de compra**: Una vez completado el pago, el usuario puede calificar su compra accediendo a su historial de ventas y seleccionando la transacción correspondiente.
   [![Calificar usuario](https://img.youtube.com/vi/g_ZHBLBApTI/maxresdefault.jpg)](https://www.youtube.com/watch?v=g_ZHBLBApTI)

  5. **Creación de reclamos**: Si el usuario experimenta problemas con productos o servicios adquiridos, puede enviar un reclamo para que sea revisado por el administrador del sitio web.
   [![Crear reclamo](https://img.youtube.com/vi/mFlaNl8xvsg/maxresdefault.jpg)](https://www.youtube.com/watch?v=mFlaNl8xvsg)

**Usuario Administrador**: Este perfil tiene un acceso más amplio con las siguientes funcionalidades:

  1. **Login de acceso**: El administrador debe iniciar sesión a través de un acceso específico.
    [![Login admin](https://img.youtube.com/vi/-KREIgHo590/maxresdefault.jpg)](https://www.youtube.com/watch?v=-KREIgHo590)

  2. **Grafo de relaciones entre PYMEs**: El administrador puede visualizar un grafo que representa las conexiones entre distintas PYMEs, basado en las transacciones de compra y venta realizadas.
      [![Grafo](https://img.youtube.com/vi/dlNd_IM9va8/maxresdefault.jpg)](https://www.youtube.com/watch?v=dlNd_IM9va8)

  3. **Gestión de usuarios Pyme**: El administrador cuenta con funciones para buscar, suspender, y eliminar usuarios PyME accediendo a través del menú desplegable.
      [![Gestión usuarios](https://img.youtube.com/vi/rMyvuWHWOhw/maxresdefault.jpg)](https://www.youtube.com/watch?v=rMyvuWHWOhw)

  4. **Gestión de reclamos**: El administrador puede buscar y visualizar los detalles de los reclamos. Una vez resueltos, tiene la función de archivar el reclamo, trasladándolo a la sección de reclamos revisados.
      [![Gestión reclamos](https://img.youtube.com/vi/yLCcDUswtrw/maxresdefault.jpg)](https://www.youtube.com/watch?v=yLCcDUswtrw)

  5. **Simulación**: El administrador puede simular la creación de usuarios Pyme o administradores, así como la cantidad de publicaciones, ofertas, compras, ventas y reclamos.
    [![Simulación](https://img.youtube.com/vi/PxiDCCWVXvY/maxresdefault.jpg)](https://www.youtube.com/watch?v=PxiDCCWVXvY)

---

## **Ejecución del proyecto usando Docker en modo desarrollo**

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

## **All Tools and Frameworks used**

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

## **Independent Executions**

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

## **Front-end Development**

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

## **Back-end Development**

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
