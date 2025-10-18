## Ejecutar en Desarrollo

1. Clonar el repositorio
2. Ejecutar 
```
yarn install
```
3. Tener Nest CLI instalado 
```
npm i -g @nestjs/cli
```
4. Levantar la base de datos
```
docker-compose up -d
```
5. Clonar el archivo `.env.template` y renombrar a `.env`
6. Llenar las variables de entorno `.env`
7. Ejecutar la aplicacion en dev:
```
yarn start:dev
```
5.Reconstruir DB
```
localhost:3000/api/v2/seed
```