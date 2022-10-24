# API-ALUXION


Prueba de git


Requerimientos: Debe tener instaldo docker en su ordenador->https://www.docker.com/

Recuerden que deben de ejecutar:

** Crear el archivo .env y colocar todos lo valores que están en el archivo .example.env

**Comandos para Linux/UBUNTU


sudo docker build -t api-aluxion .  //Constuir Imagen


sudo docker run -it -p 8090:8090 api-aluxion // Crear Contenedor


sudo docker ps -a //Muestra contenedores


sudo docker logs <container id> // Muesta los logs


Running on http://localhost:8090

