docker build -t aseerkt/devconnector:latest .
docker ps

# docker stop $ID

docker run -p 49160:8080 -d aseerkt/devconnector:latest

echo "heroku app name to deploy?"
read app

heroku container:push --app=$app web
heroku container:release --app=$app web