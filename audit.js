var resultsLen = results.length;

// transform openstack:1234  ==>  1234
var stripOpenstack = function(key) {

    if (key === undefined) {
        return 'undefined';
    }

    var i = key.lastIndexOf(':');
    if (i > -1) {
        return key.slice(i + 1);
    } else {
        return key;
    }
};

var count = 0;
var listOfIds = {};

var trait1 = 'initiator_id';
var trait2 = 'target_id';

_.each(results, function(item) {
    var init = stripOpenstack(item.traits[trait1]);
    var target = stripOpenstack(item.traits[trait2]);


    if (listOfIds[init] === undefined) {
        listOfIds[init] = count++;
    }

    if (listOfIds[target] === undefined) {
        listOfIds[target] = count++;
    }
});

var matrix = [];

var listLen = _.keys(listOfIds).length;
for (var i = 0; i < listLen; i++) {
    var result = [];
    for (var j = 0; j < listLen; j++) {
        result.push(0);
    }
    matrix.push(result);
}

_.each(results, function(item) {
    var init = stripOpenstack(item.traits[trait1]);
    var target = stripOpenstack(item.traits[trait2]);

    matrix[listOfIds[init]][listOfIds[target]]++;
});
var cities = [];

var idColor = d3.scale.category20c();

_.each(listOfIds, function(item, i) {
    cities.push({
        name: i,
        color: idColor(item)
    });
});

_.each(matrix, function(item, i) {
    _.each(item, function(line, j) {
        matrix[i][j] = line / resultsLen;
    });
});

