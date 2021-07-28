Default Scorers provided out of the box

```
// Example
var docPositionAndValues = () => ({ 1: 1, 2: 0, 3: 1, 4: 0, 5: 1})
var docPositionAndValues = () => ({1: 3, 2: 2, 3: 3, 4: 0, 5: 1, 6: 2})
```

## Average Precision

```
// Average Precision

var positionAndValues = docPositionAndValues();
var largestPosition = Math.max(...Object.keys(positionAndValues));
var countRelevantDocuments = 0, 
    allDocPrecisions = [],
    relevantDocsPrecisions = [];
for(var i = 1; i <= largestPosition; ++i) {
    console.log(i, positionAndValues[i])
    if(positionAndValues[i] === 1) {
        countRelevantDocuments += 1
        relevantDocsPrecisions.push(parseFloat(countRelevantDocuments) / i)
    }
    allDocPrecisions.push(parseFloat(countRelevantDocuments) / i);
}
var numerator = relevantDocsPrecisions.reduce((a, b) => a + b, 0),
    denominator = Math.max(relevantDocsPrecisions.length, 1);
averagePrecison = numerator / denominator;
averagePrecison
```

## Cumulative Gain (CG)

```
// Cumulative Gain (CG)
var positionAndValues = docPositionAndValues();
var allValues = Object.keys(positionAndValues).map((pos) => positionAndValues[pos]);
var cg = allValues.reduce((a, b) => a + b, 0);
cg
```

## Discounted Cumulative Gain (DCG)

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

## normalized Discounted Cumulative Gain (nDCG) 

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