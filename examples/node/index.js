var z = require('../../bin/node/zana.js');
z.setup({
    useArrayExtensions: true,
    useFunctionExtensions: true,
    useNumberExtensions: true,
    useObjectExtensions: true,
    defaultLogger: console
});
var log = z.log;

var data = [
      { _id: 12345, a: 'a', b: 1, c: "string!" }
    , { _id: 12343, a: 'b', b: 2, c: "string!" }
    , { _id: 12342, a: 'c', b: 3, c: "string!" }
    , { _id: 12349, a: 'd', b: 4, c: "string!" }
    , { _id: 12347, a: 'e', b: 5, c: "string!" }
    , { _id: 12341, a: 'f', b: 6, c: "string!" }
    , { _id: 12346, a: 'g', b: 7, c: "string!" }
    , { _id: 12344, a: 'h', b: 8, c: "string!" }
    , { _id: 12348, a: 'i', b: 9, c: "string!" }
];

var data2 = [
      { _id: 22341, _dataid: 12345, d: [1, 2, 3, 4, 5] }
    , { _id: 22342, _dataid: 12343, d: [2, 2, 3, 4, 5] }
    , { _id: 22344, _dataid: 12349, d: [1, 2, 4, 4, 5] }
    , { _id: 22345, _dataid: 12347, d: [1, 2, 3, 5, 5] }
    , { _id: 22348, _dataid: 12344, d: [4, 2, 3, 4, 1] }
    , { _id: 22349, _dataid: 12348, d: [3, 2, 3, 4, 1] }
];

var modified = data
    .innerJoin(data2)
    .on(function(x, y) { return x._id === y._dataid; })
    .select(function(x) {
        return {
            e: x.c + ' ' + x.a,
            f: x.d.sum() - x.b,
            g: x.d.average()
        };
    })
    .orderBy(function(x) { return x.f; })
    .where(function(x) { return x.g === 3.2; });

log(modified);