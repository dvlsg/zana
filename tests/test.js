var z       = require('../src/zana-node.js');
var log     = z.log;
var assert  = z.assert;
var equals  = z.equals;
var sw      = z.sw;
log.setDebugLogging(true);

;(function(undefined) {

    function testArrayExtensions() {

        var queryable = [
              { id: 1, data: [1, 2, 3]}
            , { id: 2, data: [4, 5, 6]}
            , { id: 3, data: [7, 8, 9]}
            , { id: 4, data: [7, 8, 9, 10]}
            , { id: 5, data: [7, 8, 9, 11], other: "some property"}
            , { id: 6, data: [7, 8, 12]}
            , { id: 7, data: 1}
            , { id: 8, data: 2}
            , { id: 9, data: [1, 2, 3], other: "test property"}
        ];

        function testAggregate() {
            var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            var letters = ["a", "b", "c", "d", "e"];
            assert(function() { return letters.aggregate(function(x, y) { return x + ", " + y; }) === "a, b, c, d, e"; });
            var sentence = ["we", "are", "going", "to", "build", "a", "sentence"];
            assert(function() { return sentence.aggregate(function(x, y) { return x + " " + y; }) === "we are going to build a sentence"; });
            var factorial = [5, 4, 3, 2, 1];
            assert(function() { return factorial.aggregate(function(x, y) { return x*y; }) === 120; });
            assert(function() { return [1].aggregate(function(x, y) { return "whatever you want, single items are returned as themselves"; }) === 1 });
            assert(
                function() {
                    var func = function(x, y) {
                        return x + y;
                    };
                    return [1, 2, 3, 4, 5].aggregate(func) === [2, 3, 4, 5].aggregate(func, 1);
                }
            );
            assert(
                function() {
                    var func = function(x, y) {
                        return x + y;
                    };
                    return [1, 2, 3, 4, 5].aggregate(func) === [2, 3, 4, 5].aggregate(func, 1);
                }
            );
        }

        function testAny() {
            assert(queryable.any() === true);
            assert(function() { return queryable.any(function(obj) { return obj.id === 7; }) === true });
            assert(function() { return queryable.any(function(obj) { return obj.data === 1; }) === true });
            assert(function() { return queryable.any(function(obj) { return obj.data === 3; }) === false });
            assert(function() { return queryable.any(function(obj) { return obj.data.equals([7,8,9]); }) === true });
            assert(function() { return queryable.any(function(obj) { return obj.other === "test property"; }) === true });
            assert(function() { return [].any() === false });
            assert(function() { return [].any(function(obj) { return obj.id === 0; }) === false });
        }

        function testAverage() {
            assert(function() { return [1, 2, 3, 4, 5].average() === 3 });
            assert(function() { return [1.0, 2.0, 3.0, 4.0, 5.0].average() === 3 });
            assert(function() { return [1.0, 2, 3, 4, 5.0].average() === 3 });
            var numbers = [
                  { number: 1 }
                , { number: 2 }
                , { number: 3 }
                , { number: 4 }
                , { number: 5 }
            ];
            assert(function() { return numbers.average(function(x) { return x.number === 3; }); });
        }

        function testContains() {
            var container = [
                  { id: 1, numbers: [1, 2, 3, 4, 5], obj: { data: "data1" } }
                , { id: 2, numbers: [3, 4, 5, 6, 7], obj: { data: "data2" } }
                , { id: 3, numbers: [5, 6, 7, 8, 9], obj: { data: "data3" } }
            ];
            assert(function() { return [1, 2, 3].contains(1); });
            assert(function() { return [1, 2, 3].contains(2); });
            assert(function() { return [1, 2, 3].contains(3); });
            assert(function() { return ![1, 2, 3].contains(4); });
            assert(function() { return ![1, 2, 3].contains(null); });
            assert(function() { return ![1, 2, 3].contains(undefined); });

            assert(function() { return ["The", "quick", "brown", "fox"].contains("The"); });
            assert(function() { return ["The", "quick", "brown", "fox"].contains("quick"); });
            assert(function() { return ["The", "quick", "brown", "fox"].contains("brown"); });
            assert(function() { return ["The", "quick", "brown", "fox"].contains("fox"); });
            assert(function() { return !["The", "quick", "brown", "fox"].contains("THE"); });
            assert(function() { return !["The", "quick", "brown", "fox"].contains("the"); });
            assert(function() { return !["The", "quick", "brown", "fox"].contains(undefined); });
            assert(function() { return !["The", "quick", "brown", "fox"].contains(null); });

            assert(function() { return [null, undefined, null, null, undefined].contains(undefined); });
            assert(function() { return [null, undefined, null, null, undefined].contains(null); });

            assert(function() { return [1, 2, 3].contains(function(x) { return x > 1; }); });
            assert(function() { return [1, 2, 3].contains(function(x) { return x > 2; }); });
            assert(function() { return [1, 2, 3].contains(function(x) { return !(x > 3); }); });

            var obj1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; }};
            var obj2 = { id: 1, data: { numbers: 4,         data2: null, data3: undefined}, func: function(a) { this.id = a; }};
            var obj3 = { id: 1, data: { numbers: {num: 1},  data2: null, data3: undefined}, func: function(a) { this.id = a; }};
            var obj4 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; }};
            var obj5 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; }};
            var obj6 = { id: 1, data: { numbers: [1, 2, 3], data2: 2, data3: 3}, func: function(a) { this.id = a; }};
            var obj7 = obj6.deepCopy();

            container = [
                obj1
                , obj2
                , obj3
                , obj4
                , obj6
            ];
            assert(function() { return container.contains(obj1); });
            assert(function() { return container.contains(obj2); });
            assert(function() { return container.contains(obj3); });
            assert(function() { return container.contains(obj4); });
            assert(function() { return container.contains(obj5); });
            assert(function() { return container.contains(obj6); });
            assert(function() { return container.contains(obj7); });

            assert(function() { return container.contains(1, function(x) { return x.id; }); });
            assert(function() { return container.contains({ numbers: [1, 2, 3], data2: null, data3: undefined}, function(x) { return x.data; }); });
            assert(function() { return container.contains([1, 2, 3], function(x) { return x.data.numbers; }); });

            assert(function() { return container.contains({ id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }, func: function(a) { this.id = a; }}); });
            assert(function() { return !container.contains({ id: 2, data: { numbers: [1, 2, 3], data2: null, data3: undefined }, func: function(a) { this.id = a; }}); });
            assert(function() { return !container.contains({ id: 1, data: { numbers: [4, 2, 3], data2: null, data3: undefined }, func: function(a) { this.id = a; }}); });
            assert(function() { return !container.contains({ id: 1, data: { numbers: [1, 2, 3], data2: undefined, data3: undefined }, func: function(a) { this.id = a; }}); });
            assert(function() { return !container.contains({ id: 1, data: { numbers: [1, 2, 3], data2: null, data3: null }, func: function(a) { this.id = a; }}); });
            assert(function() { return container.contains({ id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }, func: function(b) { this.id = b; }}); }); // note function equality here (!!!)
            assert(function() { return container.contains({ id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }, func: function(a) { this.id += a; }}); }); // note function equality here (!!!)
            
            assert(function() { return container.contains(function(x) { return x > 1; }, function(x) { return x.data.numbers; }); });
            assert(function() { return container.contains(function(x) { return x > 2; }, function(x) { return x.data.numbers; }); });
            assert(function() { return container.contains(function(x) { return !(x > 4); }, function(x) { return x.data.numbers; }); });
        }

        function testCount() {
            assert(function() { return [].count(undefined) === 0; });
            assert(function() { return [].count(null) === 0; });
            assert(function() { return [1].count(undefined) === 0; });
            assert(function() { return [1].count(null) === 0; });
            assert(function() { return [1].count(1) === 1; });
            assert(function() { return [1,2,3].count(1) === 1; });
            assert(function() { return [1,2,3,1].count(1) === 2; });
            assert(function() { return [1,2,1,3,1].count(1) === 3; });

            var obj1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined, date: new Date("1999-12-31"), regexp: new RegExp("RegExp", "g") }};
            var obj2 = { id: 2, data: { numbers: [4, 5, 6], data2: null, data3: undefined, date: new Date("1999-12-31"), regexp: new RegExp("RegExp", "g") }};
            var obj3 = { id: 3, data: { numbers: [1, 2, 3], data2: undefined, data3: undefined, date: new Date("1999-12-31"), regexp: new RegExp("RegExp", "g") }};
            var obj4 = { id: 4, data: { numbers: [1, 2, 3], data2: null, data3: null, date: new Date("1999-12-31"), regexp: new RegExp("RegExp", "g") }};
            var obj5 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined, date: new Date("1999-12-31"), regexp: new RegExp("RegExp", "g") }}; // equal to obj1
            var arr = [obj1, obj2, obj3, obj4, obj5];
            assert(function() { return arr.count(obj1) === 2; });
            assert(function() { return arr.count(obj2) === 1; });
            assert(function() { return arr.count(obj3) === 1; });
            assert(function() { return arr.count(obj4) === 1; });
            assert(function() { return arr.count(obj5) === 2; });

            assert(function() { return arr.count(1, function(x) { return x.id; }) === 2; });
            assert(function() { return arr.count(2, function(x) { return x.id; }) === 1; });
            assert(function() { return arr.count(3, function(x) { return x.id; }) === 1; });
            assert(function() { return arr.count(4, function(x) { return x.id; }) === 1; });

            assert(function() { return arr.count([1,2,3], function(x) { return x.data.numbers; }) === 4; });
            assert(function() { return arr.count([4,5,6], function(x) { return x.data.numbers; }) === 1; });
            assert(function() { return arr.count([1,2], function(x) { return x.data.numbers; }) === 0; });
            assert(function() { return arr.count([1,2,3,4], function(x) { return x.data.numbers; }) === 0; });
            assert(function() { return arr.count(undefined, function(x) { return x.data.numbers; }) === 0; });
            assert(function() { return arr.count(null, function(x) { return x.data.numbers; }) === 0; });

            assert(function() { return arr.count(function(x) { return x.data.numbers.contains(3); }) === 4; }); 
            assert(function() { return arr.count(function(x) { return x.data.numbers.contains(2); }) === 4; }); 
            assert(function() { return arr.count(function(x) { return x.data.numbers.contains(1); }) === 4; }); 
            assert(function() { return arr.count(function(x) { return x.data.numbers.contains(0); }) === 0; }); 
            assert(function() { return arr.count(function(x) { return x.data.numbers.contains(4); }) === 1; }); 

            assert(function() { return arr.count(function(x) { return x.contains(3); }, function(x) { return x.data.numbers; }) === 4; }); 
            assert(function() { return arr.count(function(x) { return x.contains(2); }, function(x) { return x.data.numbers; }) === 4; }); 
            assert(function() { return arr.count(function(x) { return x.contains(1); }, function(x) { return x.data.numbers; }) === 4; }); 
            assert(function() { return arr.count(function(x) { return x.contains(0); }, function(x) { return x.data.numbers; }) === 0; }); 
            assert(function() { return arr.count(function(x) { return x.contains(4); }, function(x) { return x.data.numbers; }) === 1; }); 
        }

        function testDeepCopy() {
            var deep = queryable.deepCopy();
            assert(function() { return deep !== queryable; });
            assert(function() { return deep != queryable; });
            for (var i = 0; i < deep.length; i++) {
                deep[i].id *= 2;
            }
            for (var i = 0; i < deep.length; i++) {
                assert(function() {
                    return (queryable[i].id === (i+1) && deep[i].id === ((i+1)*2));
                });
            }

            var arr1 = [
                  { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined, date: new Date("1999-12-31"), regexp: new RegExp("RegExp", "g") }}
                , { id: 2, data: { numbers: [4, 5, 6], data2: null, data3: undefined, date: new Date("1999-12-31"), regexp: new RegExp("RegExp", "g") }}
                , { id: 3, data: { numbers: [1, 2, 3], data2: undefined, data3: undefined, date: new Date("1999-12-31"), regexp: new RegExp("RegExp", "g") }}
                , { id: 4, data: { numbers: [1, 2, 3], data2: null, data3: null, date: new Date("1999-12-31"), regexp: new RegExp("RegExp", "g") }}
                , { id: 5, data: { numbers: [1, 2, 3], data2: null, data3: undefined, date: new Date("1999-12-30"), regexp: new RegExp("RegExp", "g") }}
                , { id: 6, data: { numbers: [1, 2, 3], data2: null, data3: undefined, date: new Date("1999-12-31"), regexp: new RegExp("RegExp") }}
            ];
            var arr2 = arr1.deepCopy();
            assert(function() { return arr1.equals(arr2); });
            var arr3 = arr1.deepCopy();
            arr3[0].id = 9;
            assert(function() { return !arr1.equals(arr3); });
            var arr4 = arr1.deepCopy();
            arr4[1].data.numbers.push(9);
            assert(function() { return !arr1.equals(arr4); });
            var arr5 = arr1.deepCopy();
            arr5[2].data.data2 = null;
            assert(function() { return !arr1.equals(arr5); });
            var arr6 = arr1.deepCopy();
            arr6[3].data.data3 = undefined;
            assert(function() { return !arr1.equals(arr6); });
            var arr7 = arr1.deepCopy();
            arr7[4].data.date.prop = "some extra date property";
            assert(function() { return !arr1.equals(arr7); });
            var arr8 = arr1.deepCopy();
            arr8[4].data.regexp.prop = "some extra regexp property";
            assert(function() { return !arr1.equals(arr8); });
        }

        function testDistinct() {
            var duplicates = [1, 1, 2, 3, 4, 5, 5, 5, 6, 7, 7, 7, 7, 7, 8, 9];
            var distinct = duplicates.distinct();
            for (var i = 0; i < distinct.length; i++) {
                assert(function() { return distinct[i] === (i+1); });
            }

            duplicates = [
                { id: 1, character: 'a' }
                , { id: 2, character: 'b' }
                , { id: 3, character: 'b' }
                , { id: 4, character: 'b' }
                , { id: 5, character: 'c' }
                , { id: 6, character: 'd' }
                , { id: 7, character: 'd' }
                , { id: 8, character: 'e' }
                , { id: 9, character: 'f' }
            ];
            var distinct = duplicates.distinct(function(x) { return x.character; });
            var charCodeOfa = 'a'.charCodeAt(0);
            assert(function() { return distinct.length > 0; });
            for (var i = 0; i < distinct.length; i++) {
                assert(function() { return distinct[i].character.charCodeAt(0) === (charCodeOfa+i); });
            }
        }

        function testEquals() {
            assert(function() { return [1].equals([1]) });
            assert(function() { return [1,2].equals([1,2]) });
            assert(function() { return ![2,1].equals([1,2]) });
            assert(function() { return ![1].equals([1,2,3]) });
            assert(function() { return ![1].equals(null) });
            assert(function() { return ![1].equals(undefined) });
            assert(function() { return ![1].equals([]) });
            assert(function() {
                var arr = [1, 2, 3];
                return arr.equals(arr);
            });
            var arr1 = [1, 2, 3];
            var arr2 = [1, 2, 3];
            assert(function() {
                return (arr1.equals(arr2) && arr2.equals(arr1));
            });
            var arr3 = arr2;
            assert(function() { return (arr3.equals(arr2) && arr2.equals(arr3)); });

            var arr4 = [
                  {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
                , {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
                , {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
                , {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
            ];
            var arr5 = [
                  {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
                , {a: "z", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}} // note the "z" for a
                , {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
                , {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
            ];
            var arr6 = [
                  {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
                , {a: "a", b: "b", c: [1, 2, 9], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}} // note the 9 under c
                , {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
                , {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
            ];
            var arr7 = [
                  {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
                , {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
                , {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 9, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}} // note the 9 under d
                , {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
            ];
            var arr8 = [
                  {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
                , {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
                , {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
                , {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "q"}]}} // note the "q" under h
            ];
            var arr9 = [
                  {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
                , {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
                , {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}}
                , {a: "a", b: "b", c: [1, 2, 3], d: [1, 2, [3, 4, 5]], e: { f: 1, g: [1, 2, 3, {h: "h"}]}} // should be equal to arr4
            ];
            assert(function() { return !arr4.equals(arr5); });
            assert(function() { return !arr4.equals(arr6); });
            assert(function() { return !arr4.equals(arr7); });
            assert(function() { return !arr4.equals(arr8); });
            assert(function() { return arr4.equals(arr9); });
        }

        function testFirst() {
            assert(function() { return [1, 2, 3, 4, 5].first() === 1; });
            assert(function() { return [2, 3, 4, 5].first() === 2; });
            assert(function() { return [3, 4, 5].first() === 3; });
            assert(function() { return [4, 5].first() === 4; });
            assert(function() { return [5].first() === 5; });
            assert(function() { return [].first() === null; });

            var predicate = function(x) {
                return x > 3;
            };
            assert(function() { return [1, 2, 3, 4, 5].first(predicate) === 4; });
            assert(function() { return [2, 3, 4, 5].first(predicate) === 4; });
            assert(function() { return [3, 4, 5].first(predicate) === 4; });
            assert(function() { return [4, 5].first(predicate) === 4; });
            assert(function() { return [5].first(predicate) === 5; });
            assert(function() { return [].first(predicate) === null; });

            var obj1 = {id: 1, name: "object 1", func: function(a) { return a === 1; }};
            var obj2 = {id: 2, name: "object 2", func: function(a) { return a === 2; }};
            var obj3 = {id: 3, name: "object 3", func: function(a) { return a === 3; }};
            var obj4 = {id: 4, name: "object 4", func: function(a) { return a === 4; }};

            predicate = function(x) {
                return x.id > 2;
            };
            assert(function() { return [obj1, obj2, obj3, obj4].first(predicate).equals(obj3); });
            assert(function() { return [obj1, obj2, obj3].first(predicate).equals(obj3); });
            assert(function() { return [obj1, obj2].first(predicate) === null; });
            assert(function() { return [obj2, obj1, obj4, obj3].first(predicate).equals(obj4); });
        }

        function testInnerJoin() {
            var arr1 = [
                {a: 1, b: 3 }
                , {a: 2, b: 4 }
            ];
            var arr2 = [
                {a: 1, c: 5 }
                , {a: 2, c: 6 }
                , {a: 2, c: 7 }
                , {a: 2, c: 8 }
                , {a: 3, c: 9 }
            ];
            var arr3 = [
                {d: 2, e: 10 }
                , {d: 3, e: 11 }
            ];

            var joined = arr1.innerJoin(arr2).on(function(x, y) { return x.a == y.a; });
            assert(function() { return joined[0].equals({a: 1, b: 3, c: 5 }); });
            assert(function() { return joined[1].equals({a: 2, b: 4, c: 6 }); });
            assert(function() { return joined[2].equals({a: 2, b: 4, c: 7 }); });
            assert(function() { return joined[3].equals({a: 2, b: 4, c: 8 }); });

            var joined1 = arr1.innerJoin(arr2).on(function(x, y) { return x.a == y.a; }).innerJoin(arr3).on(function(x, y) { return x.a == y.d; });
            assert(function() { return joined1[0].equals({a: 2, b: 4, c: 6, d: 2, e: 10 }); });
            assert(function() { return joined1[1].equals({a: 2, b: 4, c: 7, d: 2, e: 10 }); });
            assert(function() { return joined1[2].equals({a: 2, b: 4, c: 8, d: 2, e: 10 }); });

            var joined2 = arr2.innerJoin(arr1).on(function(x, y) { return x.a == y.a; }).innerJoin(arr3).on(function(x, y) { return x.a == y.d; });
            assert(function() { return equals(joined1, joined2); });

            var joined3 = arr3.innerJoin(arr2).on(function(x, y) { return x.d == y.a; }).innerJoin(arr1).on(function(x, y) { return x.d == y.a; });
            assert(function() { return equals(joined1, joined3); });
            assert(function() { return equals(joined2, joined3); });

            var joined4 = arr1.innerJoin(arr2).on(function(x, y) { return x.a == y.c; });
            assert(function() { return joined4 != null; });
            assert(function() { return z.getType(joined4) === z.types.array; });
            assert(function() { return joined4.length === 0; });
        }

        function testIsEmpty() {
            assert(function() { return [].isEmpty(); });
            assert(function() { return (new Array(99)).isEmpty(); });
            assert(function() { return [null].isEmpty(); });
            assert(function() { return [undefined].isEmpty(); });
            assert(function() { return [undefined, null, null, undefined, undefined, null].isEmpty(); });
            assert(function() { return ![undefined, null, null, undefined, undefined, 0].isEmpty(); });
        }

        function testIsFull() {
            assert(function() { return ![].isFull(); });
            assert(function() { return [1].isFull(); });
            assert(function() { return [1,2].isFull(); });
            assert(function() { return [1,2,3].isFull(); });
            assert(function() { return !(new Array(99)).isFull(); });
            assert(function() { return ![null].isFull(); });
            assert(function() { return ![undefined].isFull(); });
            assert(function() { return ![undefined, null, null, undefined, undefined, null].isFull(); });
            assert(function() { return ![undefined, null, null, undefined, undefined, 0].isFull(); });
        }

        function testLast() {
            assert(function() { return [1, 2, 3, 4, 5].last() === 5; });
            assert(function() { return [1, 2, 3, 4].last() === 4; });
            assert(function() { return [1, 2, 3].last() === 3; });
            assert(function() { return [1, 2].last() === 2; });
            assert(function() { return [1].last() === 1; });
            assert(function() { return [].last() === null; });

            var predicate = function(x) {
                return x > 3;
            };
            assert(function() { return [5, 2, 3, 4, 5].last(predicate) === 5; });
            assert(function() { return [5, 2, 3, 4].last(predicate) === 4; });
            assert(function() { return [5, 2, 3].last(predicate) === 5; });
            assert(function() { return [5, 2].last(predicate) === 5; });
            assert(function() { return [5].last(predicate) === 5; });
            assert(function() { return [].last(predicate) === null; });

            var obj1 = {id: 1, name: "object 1", func: function(a) { return a === 1; }};
            var obj2 = {id: 2, name: "object 2", func: function(a) { return a === 2; }};
            var obj3 = {id: 3, name: "object 3", func: function(a) { return a === 3; }};
            var obj4 = {id: 4, name: "object 4", func: function(a) { return a === 4; }};

            predicate = function(x) {
                return x.id > 2;
            };
            assert(function() { return [obj1, obj2, obj4, obj3].last(predicate).equals(obj3); });
            assert(function() { return [obj1, obj3, obj2].last(predicate).equals(obj3); });
            assert(function() { return [obj1, obj2].last(predicate) === null; });
            assert(function() { return [obj1].last(predicate) === null; });
            assert(function() { return [obj2, obj1, obj4, obj3].last(predicate).equals(obj3); });
        }

        function testMax() {
            assert(function() { return [1, 2, 4, 5, 6, 3, 5, 6, 8, 5, 6, 3, 2, 1].max() === 8; });
            assert(function() { return [1, 2, 4, 5, -6, 3, 9, 6, -8, 5, 6, 3, 2, 1].max() === 9; });
            assert(function() { return [1].max() === 1; });
            assert(function() { return [].max() === Number.MIN_VALUE; });
            var numbers = [
                  { number: 1 }
                , { number: 1 }
                , { number: 3 }
                , { number: 4 }
                , { number: -20 }
                , { number: 43.5 }
                , { number: 17 }
            ];
            assert(function() { return numbers.max(function(x) { return x.number; }) === 43.5; });
        }

        function testMin() {
            assert(function() { return [1, 2, 4, 5, 6, 3, 5, 6, 8, 5, 6, 3, 2, 1].min() === 1; });
            assert(function() { return [1, 2, 4, 5, -6, 3, 9, 6, -8, 5, 6, 3, 2, 1].min() === -8; });
            assert(function() { return [1].min() === 1; });
            assert(function() { return [].min() === Number.MAX_VALUE; });
            var numbers = [
                  { number: 1 }
                , { number: 1 }
                , { number: 3 }
                , { number: 4 }
                , { number: -20 }
                , { number: 43.5 }
                , { number: 17 }
            ];
            assert(function() { return numbers.min(function(x) { return x.number; }) === -20; });
        }

        function testMutate() {
            var arr = [1,2,3,4,5,6,7,8,9];
            arr.mutate(function(x) { return x+1; });
            assert(function() { return arr.equals([2,3,4,5,6,7,8,9,10]); });
            assert(function() { return arr.mutate(function(x) { return x-1; }).equals([1,2,3,4,5,6,7,8,9]); });
        }

        function testOrderBy() {
            var sortable = [
                  { word: "The" }
                , { word: "quick" }
                , { word: "brown" }
                , { word: "fox" }
                , { word: "jumped" }
                , { word: "over" }
                , { word: "the" }
                , { word: "lazy" }
                , { word: "dog." }
            ];
            var ordered = sortable.orderBy(function(x) { return x.word; });
            assert(function() { return ordered.length === 9; });
            assert(function() { return ordered[0].word === "The"; });
            assert(function() { return ordered[1].word === "brown"; });
            assert(function() { return ordered[2].word === "dog."; });
            assert(function() { return ordered[3].word === "fox"; });
            assert(function() { return ordered[4].word === "jumped"; });
            assert(function() { return ordered[5].word === "lazy"; });
            assert(function() { return ordered[6].word === "over"; });
            assert(function() { return ordered[7].word === "quick"; });
            assert(function() { return ordered[8].word === "the"; });

            sortable[5].other = "some property";
            sortable[3].other = "test property";
            var ordered = sortable.orderBy(function(x) { return x.other; });
            assert(function() { return ordered[0].other === "some property"; });
            assert(function() { return ordered[1].other === "test property"; });
            for (var i = 2; i < ordered.length; i++) {
                assert(function() { return ordered[i].other === undefined; }); // items which don't contain "other" down to bottom
            }

            var sortable2 = [
                  { data: 9 }
                , { data: 2 }
                , { data: 4 }
                , { data: 2 }
                , { data: 2 }
                , { data: -3 }
                , { data: 0 }
                , { data: 1 }
                , { data: 8 }
            ];
            var ordered2 = sortable2.orderBy(function(x) { return -1 * x.data; });
            for (var i = 0; i < ordered2.length-1; i++) {
                assert(function() { return ordered2[i].data >= ordered2[i+1].data; });
            }
        }

        function testQuicksort() {
            queryable.quicksort(function(x, y) {
                return (x.id > y.id) ? -1 : (x.id < y.id) ? 1 : 0;
            });
            assert(function() { return queryable.length === 9 });
            for (var i = 0; i < queryable.length; i++) {
                assert(function() { return queryable[i].id === (9-i); });
            }
            queryable.quicksort(function(x, y) {
                return (x.id > y.id) ? 1 : (x.id < y.id) ? -1 : 0;
            });
            assert(function() { return queryable.length === 9 });
            for (var i = 0; i < queryable.length; i++) {
                assert(function() { return queryable[i].id === (i+1); });
            }
            queryable.quicksort(function(x, y) {
                return (x.id > y.id) ? -1 : (x.id < y.id) ? 1 : 0;
            });
            assert(function() { return queryable.length === 9 });
            for (var i = 0; i < queryable.length; i++) {
                assert(function() { return queryable[i].id === (9-i); });
            }
            queryable.quicksort(function(x, y) {
                return (x.id > y.id) ? 1 : (x.id < y.id) ? -1 : 0;
            });
            assert(function() { return queryable.length === 9 });
            for (var i = 0; i < queryable.length; i++) {
                assert(function() { return queryable[i].id === (i+1); });
            }

            var sortable = [
                "The"
                , "quick"
                , "brown"
                , "fox"
                , "jumped"
                , "over"
                , "the"
                , "lazy"
                , "dog."
            ];
            sortable.quicksort();
            assert(function() { return sortable.length === 9; });
            assert(function() { return sortable[0] === "The"; });
            assert(function() { return sortable[1] === "brown"; });
            assert(function() { return sortable[2] === "dog."; });
            assert(function() { return sortable[3] === "fox"; });
            assert(function() { return sortable[4] === "jumped"; });
            assert(function() { return sortable[5] === "lazy"; });
            assert(function() { return sortable[6] === "over"; });
            assert(function() { return sortable[7] === "quick"; });
            assert(function() { return sortable[8] === "the"; });
        }

        function testQuicksort3() {
            queryable.quicksort3(function(x, y) {
                return (x.id > y.id) ? -1 : (x.id < y.id) ? 1 : 0;
            });
            assert(function() { return queryable.length === 9 });
            for (var i = 0; i < queryable.length; i++) {
                assert(function() { return queryable[i].id === (9-i); });
            }
            queryable.quicksort3(function(x, y) {
                return (x.id > y.id) ? 1 : (x.id < y.id) ? -1 : 0;
            });
            assert(function() { return queryable.length === 9 });
            for (var i = 0; i < queryable.length; i++) {
                assert(function() { return queryable[i].id === (i+1); });
            }

            var sortable = [
                "The"
                , "quick"
                , "brown"
                , "fox"
                , "jumped"
                , "over"
                , "the"
                , "lazy"
                , "dog."
            ];
            sortable.quicksort3();
            assert(function() { return sortable.length === 9; });
            assert(function() { return sortable[0] === "The"; });
            assert(function() { return sortable[1] === "brown"; });
            assert(function() { return sortable[2] === "dog."; });
            assert(function() { return sortable[3] === "fox"; });
            assert(function() { return sortable[4] === "jumped"; });
            assert(function() { return sortable[5] === "lazy"; });
            assert(function() { return sortable[6] === "over"; });
            assert(function() { return sortable[7] === "quick"; });
            assert(function() { return sortable[8] === "the"; });
        }

        function testRemoveAll() {
            var array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            array.removeAll(3);
            assert(function() { return array.length === 8; });
            assert(function() { return array[0] === 1; });
            assert(function() { return array[1] === 2; });
            assert(function() { return array[2] === 4; });
            assert(function() { return array[3] === 5; });
            assert(function() { return array[4] === 6; });
            assert(function() { return array[5] === 7; });
            assert(function() { return array[6] === 8; });
            assert(function() { return array[7] === 9; });

            var sentence = [
                "The"
                , "quick"
                , "brown"
                , "fox"
                , "jumped"
                , "over"
                , "the"
                , "lazy"
                , "dog."
            ];
            sentence.removeAll("the");
            assert(function() { return sentence[0] === "The"; });
            assert(function() { return sentence[1] === "quick"; });
            assert(function() { return sentence[2] === "brown"; });
            assert(function() { return sentence[3] === "fox"; });
            assert(function() { return sentence[4] === "jumped"; });
            assert(function() { return sentence[5] === "over"; });
            assert(function() { return sentence[6] === "lazy"; });
            assert(function() { return sentence[7] === "dog."; });
            sentence.removeAll(function(x) { return x.indexOf("e") > -1; });
            assert(function() { return sentence[0] === "quick"; });
            assert(function() { return sentence[1] === "brown"; });
            assert(function() { return sentence[2] === "fox"; });
            assert(function() { return sentence[3] === "lazy"; });
            assert(function() { return sentence[4] === "dog."; });

            var removable = queryable.deepCopy();
            var removed = removable.removeAll(function(x) { return x.id % 3 === 0; });
            assert(function() { return removed === 3; });
            for (var i = 0; i < removable.length; i++) {
                assert(function() { return removable[i].id % 3 !== 0; });
            }
        }

        function testSelect() {
            var selected = queryable.select(function(x) { return { data: x.data }; });
            assert(function() { return selected.length === 9; });
            assert(function() { return selected[0].data.equals([1,2,3]); });
            assert(function() { return selected[0].id === undefined; });
            assert(function() { return selected[1].data.equals([4,5,6]); });
            assert(function() { return selected[1].id === undefined; });
            assert(function() { return selected[2].data.equals([7,8,9]); });
            assert(function() { return selected[2].id === undefined; });
            assert(function() { return selected[3].data.equals([7,8,9,10]); });
            assert(function() { return selected[3].id === undefined; });
            assert(function() { return selected[4].data.equals([7,8,9,11]); });
            assert(function() { return selected[4].id === undefined; });
            assert(function() { return selected[5].data.equals([7,8,12]); });
            assert(function() { return selected[5].id === undefined; });

            var selected = queryable.select(function(x) { return { data: x.data, id: x.id }; });
            assert(function() { return selected.length === 9; });
            assert(function() { return selected[0].data.equals([1,2,3]); });
            assert(function() { return selected[0].id === 1; });
            assert(function() { return selected[1].data.equals([4,5,6]); });
            assert(function() { return selected[1].id === 2; });
            assert(function() { return selected[2].data.equals([7,8,9]); });
            assert(function() { return selected[2].id === 3; });
            assert(function() { return selected[3].data.equals([7,8,9,10]); });
            assert(function() { return selected[3].id === 4; });
            assert(function() { return selected[4].data.equals([7,8,9,11]); });
            assert(function() { return selected[4].id === 5; });
            assert(function() { return selected[5].data.equals([7,8,12]); });
            assert(function() { return selected[5].id === 6; });

            var selected = queryable.select(function(x) { return x.data; });
            assert(function() { return selected.length === 9; });
            assert(function() { return selected[0].equals([1,2,3]); });
            assert(function() { return selected[0].id === undefined; });
            assert(function() { return selected[0].data === undefined; });
            assert(function() { return selected[1].equals([4,5,6]); });
            assert(function() { return selected[1].id === undefined; });
            assert(function() { return selected[1].data === undefined; });
            assert(function() { return selected[2].equals([7,8,9]); });
            assert(function() { return selected[2].id === undefined; });
            assert(function() { return selected[2].data === undefined; });
            assert(function() { return selected[3].equals([7,8,9,10]); });
            assert(function() { return selected[3].id === undefined; });
            assert(function() { return selected[3].data === undefined; });
            assert(function() { return selected[4].equals([7,8,9,11]); });
            assert(function() { return selected[4].id === undefined; });
            assert(function() { return selected[4].data === undefined; });
            assert(function() { return selected[5].equals([7,8,12]); });
            assert(function() { return selected[5].id === undefined; });
            assert(function() { return selected[5].data === undefined; });

            selected = queryable.select(function(x) { return {id: x.id}; });
            assert(function() { return selected.length === 9; });
            for (var i = 0; i < selected.length; i++) {
                assert(function() { 
                    return (
                            selected[i].id === (i+1)
                        &&  selected[i].data === undefined
                    );
                });
            }
            selected = queryable.select(function(x) { return {doubled_id: x.id * 2}; });
            assert(function() { return selected.length === 9; });
            for (var i = 0; i < selected.length; i++) {
                assert(function() { 
                    return (
                            selected[i].doubled_id === ((i+1)*2)
                        &&  selected[i].id === undefined
                        &&  selected[i].data === undefined
                    );
                });
            }
        }

        function testSkip() {
            assert([].skip(-9).equals([]));
            assert([].skip(0).equals([]));
            assert([].skip(9).equals([]));
            assert(function() { return [].skip(-1).equals([]); });
            assert(function() { return [].skip(0).equals([]); });
            assert(function() { return [].skip(5).equals([]); });
            assert(function() { return [1, 2].skip(1).equals([2]); });
            assert(function() { return [1, 2, 3].skip(1).equals([2, 3]); });
            assert(function() { return [1, 2, 3].skip(2).equals([3]); });
            assert(function() { return [1, 2, 3, 4].skip(1).equals([2, 3, 4]); });
            assert(function() { return [1, 2, 3, 4].skip(2).equals([3, 4]); });
            assert(function() { return [1, 2, 3, 4].skip(3).equals([4]); });
            var obj1 = {id: 1, name: "object 1", func: function(a) { return a === 1; }};
            var obj2 = {id: 2, name: "object 2", func: function(a) { return a === 2; }};
            var obj3 = {id: 3, name: "object 3", func: function(a) { return a === 3; }};
            var obj4 = {id: 4, name: "object 4", func: function(a) { return a === 4; }};
            var arraySkip = [obj1, obj2, obj3, obj4];
            assert(function() { return arraySkip.skip(1).equals([obj2, obj3, obj4]); });
            assert(function() { return arraySkip.skip(2).equals([obj3, obj4]); });
            assert(function() { return arraySkip.skip(3).equals([obj4]); });
        }

        function testSum() {
            assert(function() { return [1, 2, 3, 4, 5].sum() === 15 });
            assert(function() { return [1.0, 2.0, 3.0, 4.0, 5.0].sum() === 15.0 });
            var numbers = [
                { number: 1 }
                , { number: 2 }
                , { number: 3 }
                , { number: 4 }
                , { number: 5 }
            ];
            assert(function() { return numbers.sum(function(x) { return x.number; }) === 15; });
            var numbers2 = [
                { number: 1, other: "something" }
                , { number: 2, other: "something" }
                , { number: 3, other: "something" }
                , { number: 4, other: "something" }
                , { number: 5, other: "something" }
            ];
            assert(function() { return numbers2.sum(function(x) { return x.number; }) === 15; });
        }

        function testSwap() {
            var numbers1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            var numbers2 = numbers1.deepCopy();
            numbers2.swap(1, 5);
            assert(function() { return !numbers1.equals(numbers2); });
            numbers2.swap(1, 5);
            assert(function() { return numbers1.equals(numbers2); });
            numbers2.swap(1, 5);
            numbers2.swap(5, 1);
            assert(function() { return numbers1.equals(numbers2); });
            numbers1 = [
                { number: 1 }
                , { number: 2 }
                , { number: 3 }
                , { number: 4 }
                , { number: 5 }
            ];
            numbers2 = [
                { number: 1 }
                , { number: 2 }
                , { number: 3 }
                , { number: 4 }
                , { number: 5 }
            ];
            numbers2.swap(0, 4);
            assert(function() { return !numbers1.equals(numbers2); });
            assert(function() { return numbers1[0].number === 1; });
            assert(function() { return numbers1[1].number === 2; });
            assert(function() { return numbers1[2].number === 3; });
            assert(function() { return numbers1[3].number === 4; });
            assert(function() { return numbers1[4].number === 5; });
            assert(function() { return numbers2[0].number === 5; });
            assert(function() { return numbers2[1].number === 2; });
            assert(function() { return numbers2[2].number === 3; });
            assert(function() { return numbers2[3].number === 4; });
            assert(function() { return numbers2[4].number === 1; });
        }

        function testTake() {
            assert(function() { return [].take(-9).equals([]); });
            assert(function() { return [].take(0).equals([]); });
            assert(function() { return [].take(9).equals([]); });

            var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            assert(function() { return array.take(-1).equals([]); });
            assert(function() { return array.take(0).equals([]); });
            assert(function() { return array.take(5).equals([1, 2, 3, 4, 5]); });
            assert(function() { return array.take(6).equals([1, 2, 3, 4, 5, 6]); });

            var obj1 = {id: 1, name: "object 1", func: function(a) { return a === 1; }};
            var obj2 = {id: 2, name: "object 2", func: function(a) { return a === 2; }};
            var obj3 = {id: 3, name: "object 3", func: function(a) { return a === 3; }};
            var obj4 = {id: 4, name: "object 4", func: function(a) { return a === 4; }};
            var arrayTake = [obj1, obj2, obj3, obj4];
            assert(function() { return arrayTake.take(1).equals([obj1]); });
            assert(function() { return arrayTake.take(2).equals([obj1, obj2]); });
            assert(function() { return arrayTake.take(3).equals([obj1, obj2, obj3]); });
            assert(function() { return arrayTake.take(4).equals([obj1, obj2, obj3, obj4]); });
        }

        function testWhere() {
            var result = queryable.where(function(obj) { return obj.id > 5; });
            assert(function() { return result.length === 4 });
            assert(function() { return result[0].id === 6 && result[0].data.equals([7, 8, 12]) });
            assert(function() { return result[1].id === 7 && result[1].data === 1 });
            assert(function() { return result[2].id === 8 && result[2].data === 2 });
            assert(function() { return result[3].id === 9 && result[3].data.equals([1, 2, 3]) && result[3].other === "test property" });
            result[3].id = -1;
            assert(function () { return result[3].id === -1 && queryable[8].id === -1; }); // ensure a shallow copy is being used by where
        }

        function testZip() {
            var arr1 = [
                { a: 1 }
                , { a: 2 }
                , { a: 3 }
            ];
            var arr2 = [
                { b: 4 }
                , { b: 5 }
                , { b: 6 }
            ];

            var zipped1 = arr1.zip(arr2, function(a, b) { return { a: a.a, b: b.b }; });
            assert(function() { return zipped1[0].a === 1; });
            assert(function() { return zipped1[0].b === 4; });
            assert(function() { return zipped1[1].a === 2; });
            assert(function() { return zipped1[1].b === 5; });
            assert(function() { return zipped1[2].a === 3; });
            assert(function() { return zipped1[2].b === 6; });

            var zipped2 = arr1.zip(arr2, function(a, b) { return a.smash(b); });
            assert(function() { return zipped1.equals(zipped2); });
        }

        describe("Testing Array extension methods", function() {
            it('aggregate', testAggregate);
            it('any', testAny);
            it('average', testAverage);
            it('contains', testContains);
            it('count', testCount);
            it('deep copy', testDeepCopy);
            it('distinct', testDistinct);
            it('equals', testEquals);
            it('first', testFirst);
            it('inner join', testInnerJoin);
            it('is empty', testIsEmpty);
            it('is full', testIsFull);
            it('last', testLast);
            it('max', testMax);
            it('min', testMin);
            it('mutate', testMutate);
            it('order by', testOrderBy);
            it('quicksort', testQuicksort);
            it('quicksort3', testQuicksort3);
            it('remove all', testRemoveAll);
            it('select', testSelect);
            it('skip', testSkip);
            it('sum', testSum);
            it('swap', testSwap);
            it('take', testTake);
            it('where', testWhere);
            it('zip', testZip);
        });  
    }

    function testConvertMethods() {
    }

    function testFunctionMethods() {

        function testCurry() {
            var f = function(a, b, c) {
                return a + b + c;
            }
            var curry1 = f.curry(1);
            assert.isFunction(curry1);
            var curry2 = curry1.curry(2);
            assert.isFunction(curry2);
            var curry3 = curry2.curry(3);
            assert.isNumber(curry3);
            assert(function() { return z.equals(curry3, 6); });
        }

        function testDeepCopy() {
            var f = function() {};
            assert(function() { return equals(f, f); });
            var f2 = z.deepCopy(f);
            assert(function() { return equals(f, f2); });
            f.prop = "property!";
            assert(function() { return !equals(f, f2); });
            f2.prop = "property!";
            assert(function() { return equals(f, f2); });
            var f3 = z.deepCopy(f2);
            assert(function() { return equals(f, f3); });
            assert(function() { return equals(f2, f3); });
            
            f = function(a, b, c) { 
                return a + b + c;
            }
            assert(function() { return equals(f, f); });
            f2 = z.deepCopy(f);
            assert(function() { return equals(f, f2); });
            assert(function() { return !equals(f, f3); });
            assert(function() { return !equals(f2, f3); });
            f3 = z.deepCopy(f3);

            f = function(ab, cd) {
                return ab+cd;
            }
            f.prop = function(c, d) {
                var something = "something";
                return c - d*c + something;
            }
            f.prop2 = [
                function(x) { x += 1; return x; },
                function(y) { y += 1; return y; }
            ];

            assert(function() { return equals(f, f); });
            f2 = z.deepCopy(f);
            assert(function() { return equals(f, f2); });
            assert(function() { return !equals(f, f3); });
            assert(function() { return !equals(f2, f3); });
            f2.prop2[2] = function(q) { q+= 1; return q; };
            assert(function() { return !equals(f, f2); });
        }

        function testEquals() {
            // todo
        }

        function testExtend() {
            // todo
        }

        function testSmash() {
            // todo
        }

        describe('Testing Function methods', function() {
            it('curry', testCurry);
            it('deep copy', testDeepCopy);
            it('equals', testEquals);
            it('extend', testExtend);
            it('smash', testSmash);

        });
    }

    function testNumberMethods() {
        var zero = 0;
        var one = 1;
        var two = 2;
        var three = 3;
        var four = 4;
        var fifteen = 15;
        var negative = -46;
        var large = 1290098126;
        var decimal = 23.576438;

        function testFactors() {
            // log(zero.factors());
            // log(one.factors());
            // log(two.factors());
            // log(three.factors());
            // log(four.factors());
            // log(fifteen.factors());
            // log(negative.factors());
            // log(large.factors());
            // log(decimal.factors());
        }

        function testRound() {
        }

        function testRoundDown() {
        }

        function testRoundUp() {
        }

        describe('Testing Number methods', function() {
            it('factors', testFactors);
            it('round', testRound);
            it('round down', testRoundDown);
            it('round up', testRoundUp);
        });
    }

    function testObjectExtensions() {

        function testDeepCopy() {
            var obj1 = { 
                id: 1
                , data: { 
                    numbers: [1, 2, 3]
                    , data2: null
                    , data3: undefined
                    , date: new Date("1999-12-31")
                    , regexp: new RegExp("RegExp", "g")
                }
            };
            obj1.data.date.prop = 'something';
            obj1.data.regexp.prop = 'something2';
            var obj2 = obj1.deepCopy();
            assert(function() { return obj1.equals(obj2); });
            var obj3 = obj1.deepCopy();
            obj3.data.numbers.push(4);
            assert(function() { return !obj1.equals(obj3); });
            var obj4 = obj1.deepCopy();
            obj4.id = 4;
            assert(function() { return !obj1.equals(obj4); });
            var obj5 = obj1.deepCopy();
            obj5.data.regexp.prop = false;
            assert(function() { return !obj1.equals(obj5); });

            function custom(item) {
                this.item = item;
                this.data = [1, 2, 3];
                this.regexp = new RegExp("RegExp", "g");
                this.date = new Date("1999-12-31");
                this.regexp.prop = "regexp prop";
                this.date.prop = "date prop";
            }
            var c1 = new custom("item1");
            var c2 = c1.deepCopy();
            assert(function() { return c1.equals(c2); });
            c2.data.push(4);
            assert(function() { return !c1.equals(c2); });

            // test self-referencing cyclical objects
            function cyclical(item) {
                this.item = item;
                this.data = [1, 2, 3];
                this.regexp = new RegExp("RegExp", "g");
                this.date = new Date("1999-12-31");
                this.cycle = this;
            }
            var c1 = new cyclical("item1");
            var c2 = c1.deepCopy();
            assert(function() { return c1.equals(c2); });
            c2.item = "item2";
            assert(function() { return !c1.equals(c2); });
            var c3 = c1.deepCopy();
            c3.cycle.cycle.cycle.cycle.item = "item3";
            assert(function() { return !c1.equals(c3); });

            // test cyclical objects which reference something other than themselves
            c1 = new cyclical("item1")
            c2 = new cyclical("item2");
            c1.cycle = c2;
            c2.cycle = c1;
            var c3 = c1.deepCopy();
            var c4 = c2.deepCopy();
            assert(function() { return c1.equals(c3); });
            assert(function() { return !c1.equals(c2); });
            assert(function() { return c2.equals(c4); });
            assert(function() { return !c3.equals(c4); });
            c3.item = "item3";
            assert(function() { return !c1.equals(c3); });
            c1.item = "item3";
            assert(function() { return c1.equals(c3); });
            c3.cycle.item = "item4";
            c4.item = "item4";
            c4.cycle.item = "item3";
            assert(function() { return !c3.equals(c4); });
            c4.item = "item3";
            c4.cycle.item = "item4";
            assert(function() { return c3.equals(c4); });
            c4.date.date = c4.date; // cyclic date reference
            var c5 = c4.deepCopy();
            assert(function() { return c4.equals(c5); });
            c5.date.date = new Date("1999-12-30");
            assert(function() { return !c4.equals(c5); });
            c5.regexp.regexp = c5.regexp; // cyclic regexp reference
            var c6 = c5.deepCopy();
            assert(function() { return c5.equals(c6); });
            c6.regexp.regexp = new RegExp("RegExp2", "g");
            assert(function() { return !c5.equals(c6); });

            c1 = new cyclical("item1");
            c1.innerCyclical1 = c1;
            c2 = new cyclical("item2");
            c2.innerCyclical1 = c1;
            c2.innerCyclical2 = c2;
            c2.cycle = c1;
            c1.cycle = c2;
            c3 = new cyclical("item3");
            c3.innerCyclical1 = c1;
            c3.innerCyclical2 = c2;
            c3.innerCyclical3 = c3;
            c3.cycle = c2;
            c4 = c3.deepCopy();
            assert(function() { return c3.equals(c4); });

            c1 = new cyclical("item1");
            c2 = new cyclical("item1");
            c3 = new cyclical("item1");
            c4 = new cyclical("item1");
            c5 = c4.deepCopy();
            c1.cycle = c3;
            c1.cycle2 = c4;
            c2.cycle = c3;
            c2.cycle2 = c4;
            c3.cycle = c1;
            c3.cycle2 = c2;
            c4.cycle = c1;
            c4.cycle2 = c2;
            c4.cycle.cycle = c3;
            c4.cycle.cycle2 = c4;
            c4.cycle2.cycle = c3;
            c4.cycle2.cycle2 = c4;
            assert(function() { return c1.equals(c2); });
            assert(function() { return c1.equals(c3); });
            assert(function() { return c1.equals(c4); });

            c1 = new cyclical("item1");
            c2 = new cyclical("item2");
            c3 = new cyclical("item1");
            c4 = new cyclical("item2");
            c5 = new cyclical("item1");
            c6 = new cyclical("item2");
            c1.cycle = c1;
            c1.cycle2 = c2;
            c2.cycle = c1;
            c2.cycle2 = c2;
            c3.cycle = c1;
            c3.cycle2 = c2;
            c4.cycle = c1.deepCopy();
            c4.cycle2 = c2.deepCopy();
            c4.cycle2.cycle = c3.deepCopy();
            c4.cycle2.cycle2 = c4.deepCopy();
            c6 = c4.deepCopy();
            c4.cycle.cycle2.cycle2.cycle.cycle2.cycle = c1.deepCopy();
            c4.cycle2.cycle.cycle.cycle2.cycle.cycle2 = c2.deepCopy();
            c5.cycle = c5;
            c5.cycle2 = c6;
            assert(function() { return !c1.equals(c2); });
            assert(function() { return c1.equals(c3); });
            assert(function() { return !c2.equals(c3); });
            assert(function() { return c2.equals(c4); });
            assert(function() { return c5.equals(c3); });
            assert(function() { return !c5.equals(c6); });
            assert(function() { return c4.equals(c6); });
        }

        function testEquals() {
            var obj1 = { id: 1, data: [1, 2, 3]};
            var obj2 = { id: 1, data: [4, 5, 6]};
            var obj3 = { id: 1, data: [7, 8, 9]};
            var obj4 = { id: 1, data: [1, 2, 3]};
            assert(function() { return !obj1.equals(obj2); });
            assert(function() { return !obj1.equals(obj3); });
            assert(function() { return obj1.equals(obj4); });

            obj1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }};
            obj2 = { id: 1, data: { numbers: [1, 2, 3], data2: undefined, data3: undefined }};
            obj3 = { id: 1, data: { numbers: [1, 2, 3], data2: 1, data3: undefined }};
            obj4 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }};
            assert(function() { return !obj1.equals(obj2); });
            assert(function() { return !obj1.equals(obj3); });
            assert(function() { return obj1.equals(obj4); });

            obj1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }};
            obj2 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: null }};
            obj3 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: 1 }};
            obj4 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }};
            assert(function() { return !obj1.equals(obj2); });
            assert(function() { return !obj1.equals(obj3); });
            assert(function() { return obj1.equals(obj4); });

            obj1 = obj2 = obj3 = obj4;
            assert(function() { return obj1.equals(obj2); });
            assert(function() { return obj1.equals(obj3); });
            assert(function() { return obj1.equals(obj4); });

            obj1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; }};
            obj2 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(b) { this.id = b; }}; // note function "equality" here (!!!)
            obj3 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = !a; }}; // note function "equality" here (!!!)
            obj4 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; }};
            assert(function() { return obj1.equals(obj2); });
            assert(function() { return obj1.equals(obj3); });
            assert(function() { return obj1.equals(obj4); });

            obj1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }, func: function(a) { this.id = a; }};
            obj2 = { id: 1, data: { numbers: 4,         data2: null, data3: undefined}, func: function(a) { this.id = a; }};
            obj3 = { id: 1, data: { numbers: {num: 1},  data2: null, data3: undefined}, func: function(a) { this.id = a; }};
            obj4 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; }};
            assert(function() { return !obj1.equals(obj2); });
            assert(function() { return !obj1.equals(obj3); });
            assert(function() { return obj1.equals(obj4); });

            assert(function() { return (new Date("1999-12-31").equals(new Date("1999-12-31"))); });
            assert(function() { return !(new Date("1999-12-31").equals(new Date("1999-12-30"))); });
            var d1 = new Date("1999-12-31");
            d1.func = function(a) { this.prop = a; };
            d1.func("something");
            var d2 = new Date("1999-12-31");
            d2.func = function(a) { this.prop = a; };
            d2.func("something");
            assert(function() { return d1.equals(d1); });
            assert(function() { return d1.equals(d2); });
            assert(function() { return d2.equals(d1); });

            var a = {a: 'text', b:[0,1]};
            var b = {a: 'text', b:[0,1]};
            var c = {a: 'text', b: 0};
            var d = {a: 'text', b: false};
            var e = {a: 'text', b:[1,0]};
            var f = {a: 'text', b:[1,0], f: function(){ this.f = this.b; }};
            var g = {a: 'text', b:[1,0], f: function(){ this.f = this.b; }};
            var h = {a: 'text', b:[1,0], f: function(){ this.a = this.b; }};
            var i = {
                a: 'text',
                c: {
                    b: [1, 0],
                    f: function(){
                        this.a = this.b;
                    }
                }
            };
            var j = {
                a: 'text',
                c: {
                    b: [1, 0],
                    f: function(){
                        this.a = this.b;
                    }
                }
            };
            var k = {a: 'text', b: null};
            var l = {a: 'text', b: undefined};
            assert(function() { return a.equals(b); });
            assert(function() { return !a.equals(c); });
            assert(function() { return !c.equals(d); });
            assert(function() { return !a.equals(e); });
            assert(function() { return f.equals(g); }); // note function "equality" here (!!!)
            assert(function() { return h.equals(g); }); // note function "equality" here (!!!)
            assert(function() { return i.equals(j); });
            assert(function() { return !d.equals(k); });
            assert(function() { return !k.equals(l); });

            function custom(c) {
                this.a = "a";
                this.b = "b";
                this.c = c;
            }
            var c1 = new custom("c");
            var c2 = new custom("d");
            var c3 = new custom("c");
            var c4 = new custom(null);
            var c5 = new custom(undefined);
            var c6 = new custom();
            assert(function() { return !c1.equals(c2); });
            assert(function() { return c1.equals(c3); });
            assert(function() { return !c1.equals(c4); });
            assert(function() { return !c1.equals(c5); });
            assert(function() { return c5.equals(c6); });

            var c7 = new custom();
            c7.recurse = c7; // circular reference to self
            var c8 = new custom();
            var c9 = new custom();
            c8.recurse = c9; // circular reference with multiple objects
            c9.recurse = c8; // circular reference with multiple objects
            assert(function() { return c7.equals(c7); });
            assert(function() { return c8.equals(c9); });
            assert(function() { return c9.equals(c8); });

            // check that we can still get inequality with circular objects
            // especially with properties added after the circular reference
            c8.second = "c8";
            c9.second = "c9";
            assert(function() { return !c8.equals(c9); });
            assert(function() { return !c9.equals(c8); });

            var shuffled1, shuffled2, shuffled3, shuffled4;
            shuffled1 = { a: 1, b: 2, c: 3 };
            shuffled2 = { b: 2, a: 1, c: 3};
            assert(function() { return shuffled1.equals(shuffled2); });
            shuffled1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; } };
            shuffled2 = { data: { numbers: [1, 2, 3], data2: null, data3: undefined}, id: 1, func: function(a) { this.id = a; } };
            shuffled3 = { func: function(a) { this.id = a; }, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, id: 1 };
            shuffled4 = { func: function(a) { this.id = a; }, data: { data2: null, numbers: [1, 2, 3], data3: undefined}, id: 1 };
            assert(function() { return shuffled1.equals(shuffled2); });
            assert(function() { return shuffled1.equals(shuffled3); });
            assert(function() { return shuffled1.equals(shuffled4); });

            function cyclical(item) {
                this.item = item;
                this.data = [1, 2, 3];
                this.regexp = new RegExp("RegExp", "g");
                this.date = new Date("1999-12-31");
                this.cycle = this;
            }
            c1 = new cyclical("item1");
            c2 = new cyclical("item2");
            c3 = new cyclical("item1");
            c4 = new cyclical("item2");
            c5 = new cyclical("item1");
            c6 = new cyclical("item2");
            c1.cycle = c1;
            c1.cycle2 = c2;
            c2.cycle = c1;
            c2.cycle2 = c2;
            c3.cycle = c1;
            c3.cycle2 = c2;
            c4.cycle = c1.deepCopy();
            c4.cycle2 = c2.deepCopy();
            c4.cycle2.cycle = c3.deepCopy();
            c4.cycle2.cycle2 = c4.deepCopy();
            c6 = c4.deepCopy();
            c4.cycle.cycle2.cycle2.cycle.cycle2.cycle = c1.deepCopy();
            c4.cycle2.cycle.cycle.cycle2.cycle.cycle2 = c2.deepCopy();
            c5.cycle = c5;
            c5.cycle2 = c6;
            assert(function() { return !c1.equals(c2); });
            assert(function() { return c1.equals(c3); });
            assert(function() { return !c2.equals(c3); });
            assert(function() { return c2.equals(c4); });
            assert(function() { return c5.equals(c3); });
            assert(function() { return !c5.equals(c6); });
            assert(function() { return c4.equals(c6); });
            assert(function() { return !c4.equals(c5); });

            c1 = new cyclical("item1");
            c2 = new cyclical("item2");
            c3 = new cyclical("item3");
            c4 = new cyclical("item1");
            c5 = new cyclical("item2");
            c6 = new cyclical("item3");
            c1.cycle = c2;
            c2.cycle = c3;
            c3.cycle = c1;
            c4.cycle = c5;
            c5.cycle = c6;
            c6.cycle = c4;
            assert(function() { return !c1.equals(c2); });
            assert(function() { return !c1.equals(c3); });
            assert(function() { return c1.equals(c4); });
            assert(function() { return !c1.equals(c5); });
            assert(function() { return !c1.equals(c6); });

            c1 = new cyclical("item1");
            c2 = new cyclical("item1");
            c3 = new cyclical("item1");
            c4 = new cyclical("item1");
            c5 = new cyclical("item1");
            c6 = new cyclical("item1");
            c1.cycle = c2;
            c2.cycle = c3;
            c3.cycle = c1;
            c4.cycle = c5;
            c5.cycle = c6;
            c6.cycle = c4;
            assert(function() { return c1.equals(c2); });
            assert(function() { return c1.equals(c3); });
            assert(function() { return c1.equals(c4); });
            assert(function() { return c1.equals(c5); });
            assert(function() { return c1.equals(c6); });
        }

        function testIsEmpty() {
            var empty = {};
            assert(function() { return empty.isEmpty(); });
            var notEmpty = {
                a: null
            };
            assert(function() { return !notEmpty.isEmpty(); });
            
            // note that if the property is set, even if it is undefined, we are considered it to be not empty
            notEmpty.a = undefined;
            assert(function() { return !notEmpty.isEmpty(); });

            // if the property is deleted (not just set to undefined), we expect isEmpty to be true
            delete notEmpty.a;
            assert(function() { return notEmpty.isEmpty(); }); 
        }

        function testSmash() {
            var smashed;
            var left = {
                a: 1,
                b: 2,
                c: 3
            };
            var center = {
                d: 4,
                e: 5,
                f: 6
            };
            var right = {
                g: 7,
                h: 8,
                i: 9
            };
            var duplicates = {
                a: 100,
                d: 200,
                i: 300
            };

            assert(function() { return equals({}.smash(left, center, right), {}.smash(center, left, right)); });
            assert(function() { return equals({}.smash(center, left, right), {}.smash(right, center, left)); });
            assert(function() { return equals({}.smash(right, center, left), {}.smash(left, center, right)); });

            // ensure duplicate properties are being overwritten on the smashed object
            assert(function() { return !equals({}.smash(left, center, right), {}.smash(center, left, right, duplicates)); });
            assert(function() { return !equals({}.smash(center, left, right), {}.smash(right, center, left, duplicates)); });
            assert(function() { return !equals({}.smash(right, center, left), {}.smash(left, center, right, duplicates)); });

            var obj1 = { num: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; } };
            var obj2 = { num: 2, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; }, func2: function(b) { return this.num === b; } };
            var obj3 = { num: 3, data: { numbers: [1, 2, 3], data2: null, data3: undefined, data4: "data4"}, func: function(a) { this.id = a; } };

            smashed = {}.smash(obj1, obj2);
            assert(function() { return smashed.num === 2; });
            assert(function() { return equals(smashed.data.numbers, [1,2,3]); });
            assert(function() { return equals(smashed.data.data2, null); });
            assert(function() { return equals(smashed.data.data3, undefined); });
            assert(function() { return equals(smashed.func, function(a) { this.id = a; }); });
            assert(function() { return equals(smashed.func2, function(b) { return this.num === b; }); });
            
            smashed.smash(obj3);
            assert(function() { return smashed.num === 3; });
            assert(function() { return equals(smashed.data.numbers, [1,2,3]); });
            assert(function() { return equals(smashed.data.data2, null); });
            assert(function() { return equals(smashed.data.data3, undefined); });
            assert(function() { return equals(smashed.data.data4, "data4"); });
            assert(function() { return equals(smashed.func, function(a) { this.id = a; }); });
            assert(function() { return equals(smashed.func2, function(b) { return this.num === b; }); });

            var obj4 = {
                arr1: [
                    {a: 1}
                    , {a: 2}
                    , {a: 3}
                ],
                arr2: [
                    { num: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; } }
                    , { num: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; } }
                    , { num: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; } }
                    , { num: 2 }
                ]
            };
            var obj5 = {
                arr1: [
                    {b: 4}
                    , {b: 5}
                    , {b: 6}
                ],
                arr2: [
                    { num: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; } }
                    , { num: 1, data: { numbers: [4, 5, 6, 7, 8], data2: null, data3: undefined}, func: function(a) { this.id = a; } }
                    , { num: 1, data: { numbers: [9, 10], data2: undefined, data3: null, data4: "data4"}, func: function(a) { this.id = a; } }
                ]
            };

            smashed = {}.smash(obj5, obj4, obj5, obj4, obj4, obj5);
            assert(function() { return smashed.arr1[0].a === 1; });
            assert(function() { return smashed.arr1[1].a === 2; });
            assert(function() { return smashed.arr1[2].a === 3; });
            assert(function() { return smashed.arr1[0].b === 4; });
            assert(function() { return smashed.arr1[1].b === 5; });
            assert(function() { return smashed.arr1[2].b === 6; });
            assert(function() { return smashed.arr2[0].num === 1; });
            assert(function() { return smashed.arr2[1].num === 1; });
            assert(function() { return smashed.arr2[2].num === 1; });
            assert(function() { return smashed.arr2[0].data.numbers.equals([1,2,3]); });
            assert(function() { return smashed.arr2[1].data.numbers.equals([4,5,6,7,8]); });
            assert(function() { return smashed.arr2[2].data.numbers.equals([9,10,3]); }); // note the 3: is this the functionality we want? editing arrays, but not overwriting the whole thing?
            assert(function() { return smashed.arr2[0].data.data2 === null });
            assert(function() { return smashed.arr2[1].data.data2 === null });
            assert(function() { return smashed.arr2[2].data.data2 === undefined });
            assert(function() { return smashed.arr2[0].data.data3 === undefined });
            assert(function() { return smashed.arr2[1].data.data3 === undefined });
            assert(function() { return smashed.arr2[2].data.data3 === null });
            assert(function() { return smashed.arr2[0].data.data4 === undefined });
            assert(function() { return smashed.arr2[1].data.data4 === undefined });
            assert(function() { return smashed.arr2[2].data.data4 === "data4" });
            assert(function() { return equals(smashed.arr2[0].func, function(a) { this.id = a; }) });
            assert(function() { return equals(smashed.arr2[1].func, function(a) { this.id = a; }) });
            assert(function() { return equals(smashed.arr2[2].func, function(a) { this.id = a; }) });
            assert(function() { return smashed.arr2[3].num === 2; }); // ensure this doesn't get overwritten? or should it?
        }

        describe('Testing Object extension methods', function() {
            it('deep copy', testDeepCopy);
            it('equals', testEquals);
            it('isEmpty', testIsEmpty);
            it('smash', testSmash);
        });
    }

    function testEvents() {

        function testSimpleEvent() {
            var events = new z.classes.Events();
            var obj = {};
            events.on("tester", function() { obj["key"] = "value"; });
            events.emit("tester");
            assert(function() { return obj.key != null && obj.key === "value"; });
            events.clear("tester");
        }

        function testChainedEvents() {
            var events = new z.classes.Events();
            var arr = [];
            var num = 0;
            events.on("tester", function() { arr.push(++num); });
            events.on("tester", function() { arr.push(++num); });
            events.on("tester", function() { arr.push(++num); });
            events.on("tester", function() { arr.push(++num); });
            for (var i = 0; i < 5; i++) {
                events.emit("tester");
            }
            assert(function() { return arr.length === 20; });
            for (var i = 0; i < arr.length; i++) {
                assert(function() { return arr[i] === i+1; });
            }
            events.clear("tester");

            events.on("1", function(x) { events.emit("2"); });
            events.on("2", function(x) { events.emit("3"); });
            events.on("3", function(x) { events.emit("4"); });
            events.on("4", function(x) { arr.push(arr.max()+1); });
            events.emit("1");
            assert(function() { return arr.length === 21; });
            for (var i = 0; i < arr.length; i++) {
                assert(function() { return arr[i] === i+1; });
            }
            events.clear("tester");
        }

        function testDeregisterEvent() {
            var events = new z.classes.Events();
            var obj = {};
            var deregisterFunc = events.on("tester", function() { obj.key = "value"; });
            events.emit("tester");
            assert(function() { return obj.key && obj.key === "value"; });
            obj.key = "new_value";
            deregisterFunc();
            events.emit("tester");
            assert(function() { return obj.key && obj.key === "new_value"; });

            var deregister1 = events.on("tester", function() { obj.key = "value1"; });
            var deregister2 = events.on("tester", function() { obj.key = "value2"; });
            var deregister3 = events.on("tester", function() { obj.key = "value3"; });
            events.emit("tester");
            assert(function() { return obj.key && obj.key === "value3"; });
            deregister3();
            events.emit("tester");
            assert(function() { return obj.key && obj.key === "value2"; });
            deregister2();
            events.emit("tester");
            assert(function() { return obj.key && obj.key === "value1"; });
            deregister1();
            events.emit("tester");
            assert(function() { return obj.key && obj.key === "value1"; });
            events.clear("tester");
        }

        function testEmptyEvents() {
            var events = new z.classes.Events();
            // just make sure these can be called without any errors
            events.emit("something bogus");
            events.emit(null);
            events.emit(undefined);
        }

        function testEventParameters() {
            var events = new z.classes.Events();
            var obj = {};
            var string = "This is my string for testing purposes!";
            var num = 4;
            var num2 = 6;

            events.on("tester", function(x) { obj.upper = "UPPER: " + x.toUpperCase(); });
            events.on("tester", function(x) { obj.lower = "LOWER: " + x.toLowerCase(); });
            events.on("tester", function(x) { obj.original = "ORIGINAL: " + x; });
            events.emit("tester", string);
            assert(function() { return obj.upper === "UPPER: " + string.toUpperCase(); });
            assert(function() { return obj.lower === "LOWER: " + string.toLowerCase(); });
            assert(function() { return obj.original === "ORIGINAL: " + string; });
            events.clear("tester");

            events.on("tester", function(x, y) { x.a = y; });
            events.on("tester", function(x, y) { x.b = y+1; });
            events.on("tester", function(x, y) { x.c = y*2; });
            events.emit("tester", obj, num);
            assert(function() { return obj.upper === "UPPER: " + string.toUpperCase(); });
            assert(function() { return obj.lower === "LOWER: " + string.toLowerCase(); });
            assert(function() { return obj.original === "ORIGINAL: " + string; });
            assert(function() { return obj.a === num; });
            assert(function() { return obj.b === num+1; });
            assert(function() { return obj.c === num*2; });
            events.clear("tester");

            events.on("tester", function(x, y, z) { x.d = y; });
            events.on("tester", function(x, y, z) { x.e = y+z; });
            events.on("tester", function(x, y, z) { x.f = y*z; });
            events.emit("tester", obj, num, num2);
            assert(function() { return obj.upper === "UPPER: " + string.toUpperCase(); });
            assert(function() { return obj.lower === "LOWER: " + string.toLowerCase(); });
            assert(function() { return obj.original === "ORIGINAL: " + string; });
            assert(function() { return obj.a === num; });
            assert(function() { return obj.b === num+1; });
            assert(function() { return obj.c === num*2; });
            assert(function() { return obj.d === num; });
            assert(function() { return obj.e === num+num2; });
            assert(function() { return obj.f === num*num2; });
        }

        describe('Testing Events methods', function() {
            it('simple event',      testSimpleEvent);
            it('chained events',    testChainedEvents);
            it('deregister events', testDeregisterEvent);
            it('empty events',      testEmptyEvents);
            it('event parameters',  testEventParameters);
        });
    }

    function runUnitTests() {
        testArrayExtensions();
        testConvertMethods();
        testFunctionMethods();
        testNumberMethods();
        testObjectExtensions();
        testEvents();
    }
    runUnitTests();
}());