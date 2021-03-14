echo What is the container id
read ID

docker build -t aseerkt/devconnector:latest .
docker ps


docker stop $ID

docker run -p 49160:8080 -d aseerkt/devconnector:latest

heroku container:push --app=dev-connector-plus web
heroku container:release --app=dev-connector-plus web