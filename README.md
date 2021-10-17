# Rekall

Rekall is an open source tool to measure search relevance. This is highly inspired from [Quepid](https://github.com/o19s/quepid). Quepid is one the most amazing open source tools out there to measure and tune search relevance for Elastic Search and Solr. 

Often times real world search systems have multiple moving parts and pipelines to support query understanding, spell correction, merging results from multiple indices on application layer etc. The final search results are only seen as the output of an application API endpoint. Rekall was born out of this particular need to integrate application endpoints to measure search quality and relevance.

# Features
* Ability to integrate API sources to fetch search results from application endpoints
* Supports GET and POST API calls with custom headers
* Ability to transform the response of an API to desired form (using javascript)
* Supports custom algorithms for ranking (You can write your own algorithms in javascript)
* Ships with four default scorers: Average Precision (AP), Cumulative Gain (CG), Discounted Cumulative Gain (DCG) and Normlaized Cumulative Gain (nDCG)

# Wiki
This project is bootstrapped with [bigbinary/wheel](https://github.com/bigbinary/wheel).
You can find the high level architecture of Rekall [here](https://github.com/sony-mathew/rekall/blob/main/docs/high-level-architecture.png).

(More coming soon)

# Development
## Local Development Setup

Install the latest [Node.js](https://nodejs.org) version.
Make sure that [npm](https://www.npmjs.com/) is installed with it as well.

```
./bin/setup
```

Start the server by executing following command.

```
bundle exec rails server
```

Visit http://localhost:3000 and login with email `oliver@example.com` and password `welcome`.


## Docker for development environment

* Install [Docker](https://docs.docker.com/get-docker/).
* If using it for the first time, run `docker-compose build` to build the images.
* Run `docker-compose run --rm web rails setup` to create and seed the database.
* Run `docker-compose up` to start the application and get things up and running.
* From now onwards, we can just run `docker-compose up` from within the root of the this directory to bring up the application.


#### Build images without using cache

While re-building images, docker tries to find it's layers in the cache, which might bring-in stale layers.

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
