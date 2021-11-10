### Debugging

Commands and resources to help you debug when you run into probelms in dev environment.

To remove all assets and force precompile:

```
rake assets:clobber assets:precompile
```

To reset the assets cache:

```
rake tmp:cache:clear
```

#### Build images without using cache

While re-building images, docker tries to find its layers in the cache, which might bring in stale layers.

```bash
# this forces docker to not use cached image layers
docker-compose build --no-cache
```

More expressive docker build command with logging (for debugging purposes):

```
docker build -f ./Dockerfile.dev -t rekall-dev:1.0 --no-cache . | tee rekall.build.log
```

### Steps to nuke all data and start fresh

If you want to try out something slightly more daring, yet effective, then run the following single line command to wipe all of the docker data including containers, images, volumes. 

**Warning: The following command will wipe all of docker data of all local docker projects and containers:**

```bash
docker rm -f $(docker ps -a -q) && docker rmi -f $(docker images -q) && docker volume rm -f $(docker volume ls -q)
docker-compose up --build
```
Run `docker system prune -a -f --volumes` to remove all containers, networks, images (both dangling and unreferenced), and volumes.
