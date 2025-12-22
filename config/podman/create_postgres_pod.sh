podman pod create --name postgres-cluster -p 5432:5432 -p 5050:80

podman volume create postgres-data

podman run --pod postgres-cluster -d -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -v postgres-data:/var/lib/postgresql --name postgres docker.io/library/postgres

podman run --pod postgres-cluster -d -e PGADMIN_DEFAULT_EMAIL=user@email.com -e PGADMIN_DEFAULT_PASSWORD=password --name pgadmin4 docker.io/dpage/pgadmin4:latest
