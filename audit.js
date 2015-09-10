/*
{
    "doc_type": "audit.http.response",
    "instance_type": "Unknown",
    "tenant_type": "Unknown",
    "raw": {},
    "index": "events_2015-09-09",
    "user_type": "Unknown",
    "instance_name": "Unknown",
    "traits": {
        "typeURI": "http://schemas.dmtf.org/cloud/audit/1.0/event",
        "eventTime": "2015-09-09T23:33:04.846941+0000",
        "initiator_host_address": "172.24.4.100",
        "initiator_typeURI": "service/security/account/user",
        "service": "nova-api",
        "target_name": "nova",
        "eventType": "activity",
        "reason_code": "200",
        "target_id": "openstack:1f73048515c24f469dda3c1f5ecfe834",
        "observer_id": "target",
        "initiator_id": "openstack:144e406cb188435e8fff99f9a3b258db",
        "target_typeURI": "service/compute/os-floating-ips",
        "requestPath": "/v2/31ebe76d822a4c709772ee7f15c14c1d/os-floating-ips",
        "request_id": "req-22d83002-5e3f-4a39-ae5a-831f12b51cc0",
        "action": "read/list",
        "outcome": "success",
        "id": "openstack:b5b93152-9297-49f5-9767-ddbde3f58c87",
        "initiator_name": "ceilometer"
    },
    "timestamp": "2015-09-09T23:33:04.976869",
    "tenant_name": "Unknown",
    "user_name": "Unknown",
    "id": "ffca909e-09f7-457e-aa30-8b93dda9e6b5"
}
*/

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

