# Rekall

An open source tool to measure search relevance.

# Features
TBD


# Wiki
TBD

# Self Host
TBD


# Development
#TBD

Current docker build command

```
docker build -f ./Dockerfile.dev -t rekall-dev:1.0 --no-cache . | tee rekall.build.log
```

To remove all assets and force precompile:

```
rake assets:clobber assets:precompile
```

You can reset the assets cache with

```
rake tmp:cache:clear
```