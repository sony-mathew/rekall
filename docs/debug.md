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