# Next.js Space Shop App

Necessary consider these following instructions step by step 👋

Running locally we need database, use following command:

```
docker-compose up -d
```

- Flag -d means **detashed**

* MongoDB URL local:
  ```
  mongodb://localhost:27017/spacedb
  ```

# Rebuild node nodules and start next:

```
yarn install
yarn dev
```

# Setting environment variables:

Rename the field **.env.template** to **.env**

## Fill database with this command:

Request 'POST':

```
http://localhost:3000/api/seed
```
