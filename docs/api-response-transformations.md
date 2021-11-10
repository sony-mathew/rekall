# Transforming API Responses in Rekall

Rekall works on top of API endpoints and so it's essential to have the ability to transform the responses returned by endpoints to required shape to process. Rekall has the ability to transform the response of an API to desired form using plain javascript. 

Query Group is the lowest abstraction that represents everything about the API that we are going to hit (query params, auth, request body, request headers etc). The only variable part of the Query Group is the query text which comes from Query Objects linked to the Query Group. You need to write the transformer only once for a Query Group and it works seemlessly with any queries that you add inside the Query Group. 

One of the limitations we have is that Rekall only works with JSON format API responses.

### Examples

Let's walk through some examples to better understand how this works.

Consider you have an API which gives a response like the following:
```
[{
    "score": 1.746502387,
    "document": {
        "name": "test",
        "scope": "unscoped",
        "version": "0.6.0",
        "description": "(Un)CommonJS test runner.",
        "keywords": ["test", "commonjs", "uncommonjs", "unit"],
        "date": "2012-11-24T09:13:06.534Z"
    }
}, {
    "score": 1.7326598,
    "document": {
        "name": "test-console",
        "scope": "unscoped",
        "version": "2.0.0",
        "description": "A simple and pragmatic library for testing Node.js console output.",
        "keywords": ["console", "stdout", "stderr", "test", "spy", "test double"],
        "date": "2021-06-10T05:42:57.785Z"
    }
}, {
    "score": 1.23765787,
    "document": {
        "name": "test-lite",
        "scope": "unscoped",
        "version": "2020.10.27",
        "description": "this zero-dependency package will provide high-level functions to to build, test, and deploy webapps",
        "keywords": ["continuous-integration", "npmdoc", "npmtest", "test-coverage", "travis-ci"],
        "date": "2020-11-03T16:26:48.012Z"
    }
}]
```

Rekall needs an array of documents to list documents, identify unique ids of documents, show the fields that you specified, attribute a score to doc and calculate the ranks etc etc. Here we do have an array of documents, but the problem is the actual document that we are interested in nested inside the first level document in the array. For this we need to flatten this out.

The transformation code to do so is given below:

```
var rawData = data();
rawData.map((doc) => doc['document'] )
```

You can access the JSON parsed API response by simply saying `var x = data();`. Once you have this json response data you can tranform it anyway you want. The output of code you write on the last line of the transfomrer gets passed back and stored as the transformed response.
