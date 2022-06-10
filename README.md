# Next.js Space Shop App

It's necessary consider the following instructions step by step 👋

Para correr localmente se necesita la base de datos

```
docker-compose up -d
```

- El -d significa **detashed**

* MongoDB URL local:
  ```
  mongodb://localhost:27017/spacedb
  ```

# Reconstruir los modulos de node e iniciar next

```
yarn install
yarn dev
```

# Configurar las variables de entorno

Renombrar el archivo **.env.template** a **.env**

## Llenar la base de datos

Llamar a:

```
http://localhost:3000/api/seed
```
