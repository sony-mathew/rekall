# Scorers

Search relevance in general means how relevant a result is for a user for a particular query. It is not typically a binary measure, but a continuous one. From human perspective this is not easy to judge because it’s subjective and can change depending on context, situations, behaviour etc.

Relevance judgments are how we quantify the quality of search results. It can come from human experts, user interactions or even crowd-sourcing, but regardless of the source, they measure how relevant a result item is to a given search query. 

Ensuring search relevance is tricky but essential for a good search experience. We use various evaluation metrics to measure the performance of a search engine.

The first step to picking a metric is deciding on the relevance grading scale you will use. There are two major types of scale: binary (relevant/ not-relevant) and graded (degrees of relevance).

Binary metrics assume that all relevant results are equally useful to the searcher. Graded metrics provides more advanced view of relevance, where in each result can have a varying degree of relevance to the searcher.

Two most common binary metrics are Precision and Average Precision.
Cumulative Gain (CG), Discounted Cumulative Gain (DCG) and normalized DCG (nDCG) are some of the common graded metrics.

After you rank the docs in the results of a query, you run a scoring algorithm to come up with a relevance score.

In Rekall there are four scorers available out of the box. This comes with the seed data and is available to everyone.
1. Average Precision (AP)
2. Cumulative Gain (CG)
3. Discounted Cumulative Gain (DCG)
4. Normalized Discounted Cumulative Gain (NDCG)


## Custom Scorers

Rekall provides the ability to write your own scorers. Other than the four provided you can add custom scorers and write the scoring algorithm in plain javascript.

The input that you get for the scorer snippet that you write is the doc's position and it's rank (graded scale value or binary value). 

To get the doc position and values, 

```
    var allDocPositionAndValues = docPositionAndValues();
```

The `docPositionAndValues()` is an inbuilt interface that supplies these values.

After you receive the docs' position and the rank values associated, you can use custom algorithms to calculate the score. Every time you rank a doc from the query results, this algorithm is run and the score is recalculated.

### Examples

Code for DCG scorer:

```
    // Discounted Cumulative Gain (DCG)
    var allDocPositionAndValues = docPositionAndValues();
    
    // first approach - ( relevance / log2(i + 1) )
    // second approach (better penalizing of relevant results appearing lower) - ( (pow2(relevance) - 1) / log2(i + 1) )
    function findDcgFor(positionAndValues) {
        var individualDCGs = [];
        var positions = Object.keys(positionAndValues);
        for(var i = 0; i < positions.length; ++i) {
            var numerator = Math.pow(2, positionAndValues[positions[i]]) - 1;
            individualDCGs.push(parseFloat(numerator) / Math.log2(positions[i] + 1));
        }
        dcg = individualDCGs.reduce((a, b) => a + b, 0);
        return dcg;
    };
    findDcgFor(allDocPositionAndValues)
```

Code for nDCG scorer:

```
    // normalized Discounted Cumulative Gain (nDCG)
    var allDocPositionAndValues = docPositionAndValues();
    
    function findDcgFor(positionAndValues) {
        var individualDCGs = [];
        var positions = Object.keys(positionAndValues);
        for(var i = 0; i < positions.length; ++i) {
            var numerator = Math.pow(2, positionAndValues[positions[i]]) - 1;
            individualDCGs.push(parseFloat(numerator) / Math.log2(positions[i] + 1));
        }
        dcg = individualDCGs.reduce((a, b) => a + b, 0);
        return dcg;
    };
    
    function findNdcgFor(positionAndValues) {
        var allValues = Object.keys(positionAndValues).map((pos) => (positionAndValues[pos]));
        var topValues = allValues.sort((a, b) => (b - a)),
            idealPositionAndValues = {};
    
        var sortedPositions = Object.keys(positionAndValues).sort();
        for(var i = 0; i < sortedPositions.length; i++){
            idealPositionAndValues[sortedPositions[i]] = topValues[i];
        }
        var dcg = findDcgFor(positionAndValues),
            idcg = findDcgFor(idealPositionAndValues);
        var ndcg = (dcg / idcg);
        return ndcg;
    }
    
    findNdcgFor(allDocPositionAndValues)
```
