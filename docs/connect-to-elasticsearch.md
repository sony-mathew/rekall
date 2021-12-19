# Connect to ElasticSearch with Rekall

Rekall can connect to Elastic Search system as it has a REST based endpoint for searching. 

Here are the steps to do so (for local):

* Step 1. Create an API Source
  * Go to Query groups tab. Click on `Create API Source` button on top right.
  * Give a name and environment to your API Source
  * Set the host as `http://localhost:9200/` (for local ES, for any remote ones, set this accordingly)
  * Leave request headers empty for default local ES setup. Add approriate headers as necessary fro any other ES installations.

* Step 2: Create a Query Group
  * Go to Query groups tab. Click on `Create Query Group` button on top right.
  * Give a name to your query group. Select the source we created in the first step.
  * Select a scorer for the query group.
  * Set the required page size (number of results to be fetched)
  * Change the request type to `POST`
  * Set the query string to match the index your are searching. For example if my ES index is called twitter, change this query string to be `twitter/_search`
  * Set the request body to reflect ES querying syntax. For example the basic one would look like:
    ```
    {
      "query": {
        "query_string": {
          "query": "{{ query }}"
        }
      },
      "size": 10,
      "from": 0,
      "sort": []
    }
    ```

  * Set the Unique field as `_id`. An example ES record on twitter index would look like the following:
    ```
    {
      "_index": "twitter",
      "_type": "tweet",
      "_id": "rqfuEngBZa58yEPEUFn3",
      "_score": 1.0,
      "_source": {
        "author_id": 69,
        "author_name": "Edgar Brush",
        "message": "Geology rocks, but Geography is where it's at!",
        "created_at": "2009-11-15T14:12:12"
      }
    }
    ```

  * Now let's write the code to transform response data from the API before the jump into fields to display.
  Consider the API response to look like this:
    ```
    {
      "took": 3,
      "timed_out": false,
      "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
      },
      "hits": {
        "total": {
          "value": 100,
          "relation": "eq"
        },
        "max_score": 1.0,
        "hits": [{
          "_index": "twitter",
          "_type": "tweet",
          "_id": "rqfuEngBZa58yEPEUFn3",
          "_score": 1.0,
          "_source": {
            "author_id": 69,
            "author_name": "Edgar Brush",
            "message": "Geology rocks, but Geography is where it's at!",
            "created_at": "2009-11-15T14:12:12"
          }
        }, {
          "_index": "twitter",
          "_type": "tweet",
          "_id": "tKfuEngBZa58yEPEUFn4",
          "_score": 1.0,
          "_source": {
            "author_id": 64,
            "author_name": "Glenna Pizarro",
            "message": "What’s the advantage of living in Switzerland? Well, the flag is a big plus.",
            "created_at": "2009-11-15T14:12:12"
          }
        }, {
          "_index": "twitter",
          "_type": "tweet",
          "_id": "t6fuEngBZa58yEPEUFn4",
          "_score": 1.0,
          "_source": {
            "author_id": 99,
            "author_name": "Jules Basch",
            "message": "Two peanuts were walking down the street. One was a salted.",
            "created_at": "2009-11-15T14:12:12"
          }
        }]
      }
    }
    ```

    
    Here the the array of results that we are interested in resides in `data['hits']['hits']` (if the whole object is called data). And since we might need the actual document details and `_id`, we can merge both together to form a single document and store it in Rekall and use this in results page.

    Here is the transform code to do so:

    ```
    var rawData = data();
    rawData['hits']['hits'].map((doc) => Object.assign(doc, doc['_source']))
    ```
    
  * Now we know the structure of the final array of documents we have. If we want to display the `author_name` and `message`, we can give the fields to dispaly as `author_name, message` as comma separated values.
  * Click Submit.

* Step 3: Create queries inside query group
  * In the query groups tab, from the list of query groups, click on the one we just created.
  * Click on the `Add New Query` button on the top right.
  * Add a query text that you want to hit the ES/API with. (This will be substituted in request during runtime)
  * Add any notes you want for this Query.
  * Select the Query group we just created.
  * Click Submit.
  * Click on the query listed on the left hand side.
  * Now you can click on the button which says `Refetch Results` on the top right or if this is the first time you are fetching results you should see a `Fetch Results from Source` button on the center right half of the page.
  * Voila. You should see the results fetched from ES on the page.
