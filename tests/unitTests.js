/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
(function(w, undefined) {
    var z = w.util;
    var sw = z.sw;

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
            sw.push("Testing Array.aggregate()");
            var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            z.assert(function() { return numbers.aggregate(function(x, y) { return x + y; }) === 55; });
            var letters = ["a", "b", "c", "d", "e"];
            z.assert(function() { return letters.aggregate(function(x, y) { return x + ", " + y; }) === "a, b, c, d, e"; });
            z.assert(function() { return letters.aggregate("x, y => x + ', ' + y") === "a, b, c, d, e"; });
            var sentence = ["we", "are", "going", "to", "build", "a", "sentence"];
            z.assert(function() { return sentence.aggregate(function(x, y) { return x + " " + y; }) === "we are going to build a sentence"; });
            var factorial = [5, 4, 3, 2, 1];
            z.assert(function() { return factorial.aggregate(function(x, y) { return x*y; }) === 120; });
            z.assert(function() { return [1].aggregate(function(x, y) { return "whatever you want, single items are returned as themselves"; }) === 1 });
            z.assert(
                function() {
                    var func = function(x, y) {
                        return x + y;
                    };
                    return [1, 2, 3, 4, 5].aggregate(func) === [2, 3, 4, 5].aggregate(func, 1);
                }
            );
            z.assert(
                function() {
                    var func = function(x, y) {
                        return x + y;
                    };
                    return [1, 2, 3, 4, 5].aggregate(func) === [2, 3, 4, 5].aggregate(func, 1);
                }
            );

            sw.pop();
        }

        function testAny() {
            sw.push("Testing Array.any()");
            z.assert(queryable.any() === true);
            z.assert(function() { return queryable.any(function(obj) { return obj.id === 7; }) === true });
            z.assert(function() { return queryable.any(function(obj) { return obj.data === 1; }) === true });
            z.assert(function() { return queryable.any(function(obj) { return obj.data === 3; }) === false });
            z.assert(function() { return queryable.any(function(obj) { return obj.data.equals([7,8,9]); }) === true });
            z.assert(function() { return queryable.any(function(obj) { return obj.other === "test property"; }) === true });
            z.assert(function() { return [].any() === false });
            z.assert(function() { return [].any(function(obj) { return obj.id === 0; }) === false });

            z.assert(function() { return queryable.any("obj => obj.id === 7") === true });
            z.assert(function() { return queryable.any("obj => obj.data === 1") === true });
            z.assert(function() { return queryable.any("obj => obj.data === 3") === false });
            z.assert(function() { return queryable.any("obj => obj.data.equals([7, 8, 9])") === true });
            z.assert(function() { return queryable.any("obj => obj.other === 'test property'") === true });
            z.assert(function() { return [].any("obj => obj.id === 0") === false });
            sw.pop();
        }

        function testAverage() {
            sw.push("Testing Array.average()");
            z.assert(function() { return [1, 2, 3, 4, 5].average() === 3 });
            z.assert(function() { return [1.0, 2.0, 3.0, 4.0, 5.0].average() === 3 });
            z.assert(function() { return [1.0, 2, 3, 4, 5.0].average() === 3 });
            var numbers = [
                  { number: 1 }
                , { number: 2 }
                , { number: 3 }
                , { number: 4 }
                , { number: 5 }
            ];
            z.assert(function() { return numbers.average("x => x.number") === 3; });
            var numbers2 = [
                  { number: 1, other: "something" }
                , { number: 2, other: "something" }
                , { number: 3, other: "something" }
                , { number: 4, other: "something" }
                , { number: 5, other: "something" }
            ];
            z.assert(function() { return numbers2.average("x => x.number") === 3; });
            sw.pop();
        }

        function testContains() {
            sw.push("Testing Array.contains()");
            var container = [
                  { id: 1, numbers: [1, 2, 3, 4, 5], obj: { data: "data1" } }
                , { id: 2, numbers: [3, 4, 5, 6, 7], obj: { data: "data2" } }
                , { id: 3, numbers: [5, 6, 7, 8, 9], obj: { data: "data3" } }
            ];
            z.assert(function() { return [1, 2, 3].contains(1); });
            z.assert(function() { return [1, 2, 3].contains(2); });
            z.assert(function() { return [1, 2, 3].contains(3); });
            z.assert(function() { return ![1, 2, 3].contains(4); });
            z.assert(function() { return ![1, 2, 3].contains(null); });
            z.assert(function() { return ![1, 2, 3].contains(undefined); });

            z.assert(function() { return ["The", "quick", "brown", "fox"].contains("The"); });
            z.assert(function() { return ["The", "quick", "brown", "fox"].contains("quick"); });
            z.assert(function() { return ["The", "quick", "brown", "fox"].contains("brown"); });
            z.assert(function() { return ["The", "quick", "brown", "fox"].contains("fox"); });
            z.assert(function() { return !["The", "quick", "brown", "fox"].contains("THE"); });
            z.assert(function() { return !["The", "quick", "brown", "fox"].contains("the"); });
            z.assert(function() { return !["The", "quick", "brown", "fox"].contains(undefined); });
            z.assert(function() { return !["The", "quick", "brown", "fox"].contains(null); });

            z.assert(function() { return [null, undefined, null, null, undefined].contains(undefined); });
            z.assert(function() { return [null, undefined, null, null, undefined].contains(null); });

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
            z.assert(function() { return container.contains(obj1); });
            z.assert(function() { return container.contains(obj2); });
            z.assert(function() { return container.contains(obj3); });
            z.assert(function() { return container.contains(obj4); });
            z.assert(function() { return container.contains(obj5); });
            z.assert(function() { return container.contains(obj6); });
            z.assert(function() { return container.contains(obj7); });

            z.assert(function() { return container.contains(1, function(x) { return x.id; }); });
            z.assert(function() { return container.contains(1, "x => x.id"); });
            z.assert(function() { return container.contains({ numbers: [1, 2, 3], data2: null, data3: undefined}, function(x) { return x.data; }); });
            z.assert(function() { return container.contains([1, 2, 3], function(x) { return x.data.numbers; }); });

            z.assert(function() { return container.contains({ id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }, func: function(a) { this.id = a; }}); });
            z.assert(function() { return !container.contains({ id: 2, data: { numbers: [1, 2, 3], data2: null, data3: undefined }, func: function(a) { this.id = a; }}); });
            z.assert(function() { return !container.contains({ id: 1, data: { numbers: [4, 2, 3], data2: null, data3: undefined }, func: function(a) { this.id = a; }}); });
            z.assert(function() { return !container.contains({ id: 1, data: { numbers: [1, 2, 3], data2: undefined, data3: undefined }, func: function(a) { this.id = a; }}); });
            z.assert(function() { return !container.contains({ id: 1, data: { numbers: [1, 2, 3], data2: null, data3: null }, func: function(a) { this.id = a; }}); });
            z.assert(function() { return !container.contains({ id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }, func: function(b) { this.id = b; }}); }); // note function inequality here
            z.assert(function() { return !container.contains({ id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }, func: function(a) { this.id += a; }}); });
            sw.pop();
        }

        function testDeepCopy() {
            sw.push("Testing Array.deepCopy()");
            var deep = queryable.deepCopy();
            z.assert(function() { return deep !== queryable; });
            z.assert(function() { return deep != queryable; });
            for (var i = 0; i < deep.length; i++) {
                deep[i].id *= 2;
            }
            for (var i = 0; i < deep.length; i++) {
                z.assert(function() {
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
            z.assert(function() { return arr1.equals(arr2); });
            var arr3 = arr1.deepCopy();
            arr3[0].id = 9;
            z.assert(function() { return !arr1.equals(arr3); });
            var arr4 = arr1.deepCopy();
            arr4[1].data.numbers.push(9);
            z.assert(function() { return !arr1.equals(arr4); });
            var arr5 = arr1.deepCopy();
            arr5[2].data.data2 = null;
            z.assert(function() { return !arr1.equals(arr5); });
            var arr6 = arr1.deepCopy();
            arr6[3].data.data3 = undefined;
            z.assert(function() { return !arr1.equals(arr6); });
            var arr7 = arr1.deepCopy();
            arr7[4].data.date.prop = "some extra date property";
            z.assert(function() { return !arr1.equals(arr7); });
            var arr8 = arr1.deepCopy();
            arr8[4].data.regexp.prop = "some extra regexp property";
            z.assert(function() { return !arr1.equals(arr8); });
            sw.pop();
        }

        function testDistinct() {
            sw.push("Testing Array.distinct()");

            var duplicates = [1, 1, 2, 3, 4, 5, 5, 5, 6, 7, 7, 7, 7, 7, 8, 9];
            var distinct = duplicates.distinct();
            for (var i = 0; i < distinct.length; i++) {
                z.assert(function() { return distinct[i] === (i+1); });
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
            z.assert(function() { return distinct.length > 0; });
            for (var i = 0; i < distinct.length; i++) {
                z.assert(function() { return distinct[i].character.charCodeAt(0) === (charCodeOfa+i); });
            }

            distinct = duplicates.distinct("(x) => x.character");
            z.assert(function() { return distinct.length > 0; });
            for (var i = 0; i < distinct.length; i++) {
                z.assert(function() { return distinct[i].character.charCodeAt(0) === (charCodeOfa+i); });
            }

            sw.pop();
        }

        function testEquals() {
            sw.push("Testing Array.equals()");

            z.assert(function() { return [1].equals([1]) });
            z.assert(function() { return [1,2].equals([1,2]) });
            z.assert(function() { return ![2,1].equals([1,2]) });
            z.assert(function() { return ![1].equals([1,2,3]) });
            z.assert(function() { return ![1].equals(null) });
            z.assert(function() { return ![1].equals(undefined) });
            z.assert(function() { return ![1].equals([]) });
            z.assert(function() {
                var arr = [1, 2, 3];
                return arr.equals(arr);
            });
            var arr1 = [1, 2, 3];
            var arr2 = [1, 2, 3];
            z.assert(function() {
                return (arr1.equals(arr2) && arr2.equals(arr1));
            });
            var arr3 = arr2;
            z.assert(function() { return (arr3.equals(arr2) && arr2.equals(arr3)); });

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
            z.assert(function() { return !arr4.equals(arr5); });
            z.assert(function() { return !arr4.equals(arr6); });
            z.assert(function() { return !arr4.equals(arr7); });
            z.assert(function() { return !arr4.equals(arr8); });
            z.assert(function() { return arr4.equals(arr9); });

            sw.pop();
        }

        function testFirst() {
            sw.push("Testing Array.first()");

            z.assert(function() { return [1, 2, 3, 4, 5].first() === 1; });
            z.assert(function() { return [2, 3, 4, 5].first() === 2; });
            z.assert(function() { return [3, 4, 5].first() === 3; });
            z.assert(function() { return [4, 5].first() === 4; });
            z.assert(function() { return [5].first() === 5; });
            z.assert(function() { return [].first() === null; });

            var predicate = function(x) {
                return x > 3;
            };
            z.assert(function() { return [1, 2, 3, 4, 5].first(predicate) === 4; });
            z.assert(function() { return [2, 3, 4, 5].first(predicate) === 4; });
            z.assert(function() { return [3, 4, 5].first(predicate) === 4; });
            z.assert(function() { return [4, 5].first(predicate) === 4; });
            z.assert(function() { return [5].first(predicate) === 5; });
            z.assert(function() { return [].first(predicate) === null; });

            z.assert(function() { return [1, 2, 3, 4, 5].first("x => x > 3") === 4; });
            z.assert(function() { return [2, 3, 4, 5].first("x => x > 3") === 4; });
            z.assert(function() { return [3, 4, 5].first("x => x > 3") === 4; });
            z.assert(function() { return [4, 5].first("x => x > 3") === 4; });
            z.assert(function() { return [5].first("x => x > 3") === 5; });
            z.assert(function() { return [].first("x => x > 3") === null; });
            var obj1 = {id: 1, name: "object 1", func: function(a) { return a === 1; }};
            var obj2 = {id: 2, name: "object 2", func: function(a) { return a === 2; }};
            var obj3 = {id: 3, name: "object 3", func: function(a) { return a === 3; }};
            var obj4 = {id: 4, name: "object 4", func: function(a) { return a === 4; }};

            predicate = function(x) {
                return x.id > 2;
            };
            z.assert(function() { return [obj1, obj2, obj3, obj4].first(predicate).equals(obj3); });
            z.assert(function() { return [obj1, obj2, obj3].first(predicate).equals(obj3); });
            z.assert(function() { return [obj1, obj2].first(predicate) === null; });
            z.assert(function() { return [obj2, obj1, obj4, obj3].first(predicate).equals(obj4); });

            sw.pop();
        }

        function testInnerJoin() {
            sw.push("Testing Array.innerJoin()");

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

            var joined = arr1.innerJoin(arr2).on("x,y => x.a == y.a");
            z.assert(function() { return joined[0].equals({a: 1, b: 3, c: 5 }); });
            z.assert(function() { return joined[1].equals({a: 2, b: 4, c: 6 }); });
            z.assert(function() { return joined[2].equals({a: 2, b: 4, c: 7 }); });
            z.assert(function() { return joined[3].equals({a: 2, b: 4, c: 8 }); });

            var joined1 = arr1.innerJoin(arr2).on("x,y => x.a == y.a").innerJoin(arr3).on("x,y => x.a == y.d");
            z.assert(function() { return joined1[0].equals({a: 2, b: 4, c: 6, d: 2, e: 10 }); });
            z.assert(function() { return joined1[1].equals({a: 2, b: 4, c: 7, d: 2, e: 10 }); });
            z.assert(function() { return joined1[2].equals({a: 2, b: 4, c: 8, d: 2, e: 10 }); });

            var joined2 = arr2.innerJoin(arr1).on("x,y => x.a == y.a").innerJoin(arr3).on("x,y => x.a == y.d");
            z.assert(function() { return z.equals(joined1, joined2); });

            var joined3 = arr3.innerJoin(arr2).on("x,y => x.d == y.a").innerJoin(arr1).on("x,y => x.d == y.a");
            z.assert(function() { return z.equals(joined1, joined3); });
            z.assert(function() { return z.equals(joined2, joined3); });

            var joined4 = arr1.innerJoin(arr2).on("x,y => x.a == x.c");
            z.assert(function() { return joined4 != null; });
            z.assert(function() { return z.getType(joined4) === z.types.array; });
            z.assert(function() { return joined4.length === 0; });

            sw.pop();
        }

        function testLast() {
            sw.push("Testing Array.last()");

            z.assert(function() { return [1, 2, 3, 4, 5].last() === 5; });
            z.assert(function() { return [1, 2, 3, 4].last() === 4; });
            z.assert(function() { return [1, 2, 3].last() === 3; });
            z.assert(function() { return [1, 2].last() === 2; });
            z.assert(function() { return [1].last() === 1; });
            z.assert(function() { return [].last() === null; });

            var predicate = function(x) {
                return x > 3;
            };
            z.assert(function() { return [5, 2, 3, 4, 5].last(predicate) === 5; });
            z.assert(function() { return [5, 2, 3, 4].last(predicate) === 4; });
            z.assert(function() { return [5, 2, 3].last(predicate) === 5; });
            z.assert(function() { return [5, 2].last(predicate) === 5; });
            z.assert(function() { return [5].last(predicate) === 5; });
            z.assert(function() { return [].last(predicate) === null; });

            z.assert(function() { return [5, 2, 3, 4, 5].last("x => x > 3") === 5; });
            z.assert(function() { return [5, 2, 3, 4].last("x => x > 3") === 4; });
            z.assert(function() { return [5, 2, 3].last("x => x > 3") === 5; });
            z.assert(function() { return [5, 2].last("x => x > 3") === 5; });
            z.assert(function() { return [5].last("x => x > 3") === 5; });
            z.assert(function() { return [].last("x => x > 3") === null; });

            var obj1 = {id: 1, name: "object 1", func: function(a) { return a === 1; }};
            var obj2 = {id: 2, name: "object 2", func: function(a) { return a === 2; }};
            var obj3 = {id: 3, name: "object 3", func: function(a) { return a === 3; }};
            var obj4 = {id: 4, name: "object 4", func: function(a) { return a === 4; }};

            predicate = function(x) {
                return x.id > 2;
            };
            z.assert(function() { return [obj1, obj2, obj4, obj3].last(predicate).equals(obj3); });
            z.assert(function() { return [obj1, obj3, obj2].last(predicate).equals(obj3); });
            z.assert(function() { return [obj1, obj2].last(predicate) === null; });
            z.assert(function() { return [obj1].last(predicate) === null; });
            z.assert(function() { return [obj2, obj1, obj4, obj3].last(predicate).equals(obj3); });

            z.assert(function() { return [obj1, obj2, obj4, obj3].last("x => x.id != null && x.id > 2").equals(obj3); });
            z.assert(function() { return [obj1, obj3, obj2].last("x => x.id != null && x.id > 2").equals(obj3); });
            z.assert(function() { return [obj1, obj2].last("x => x.id != null && x.id > 2") === null; });
            z.assert(function() { return [obj1].last("x => x.id != null && x.id > 2") === null; });
            z.assert(function() { return [obj2, obj1, obj4, obj3].last("x => x.id != null && x.id > 2").equals(obj3); });

            sw.pop();
        }

        function testMax() {
            sw.push("Testing Array.max()");
            z.assert(function() { return [1, 2, 4, 5, 6, 3, 5, 6, 8, 5, 6, 3, 2, 1].max() === 8; });
            z.assert(function() { return [1, 2, 4, 5, -6, 3, 9, 6, -8, 5, 6, 3, 2, 1].max() === 9; });
            z.assert(function() { return [1].max() === 1; });
            z.assert(function() { return [].max() === Number.MIN_VALUE; });
            var numbers = [
                  { number: 1 }
                , { number: 1 }
                , { number: 3 }
                , { number: 4 }
                , { number: -20 }
                , { number: 43.5 }
                , { number: 17 }
            ];
            z.assert(function() { return numbers.max("x => x.number") === 43.5; });
            sw.pop();
        }

        function testMin() {
            sw.push("Testing Array.min()");
            z.assert(function() { return [1, 2, 4, 5, 6, 3, 5, 6, 8, 5, 6, 3, 2, 1].min() === 1; });
            z.assert(function() { return [1, 2, 4, 5, -6, 3, 9, 6, -8, 5, 6, 3, 2, 1].min() === -8; });
            z.assert(function() { return [1].min() === 1; });
            z.assert(function() { return [].min() === Number.MAX_VALUE; });
            var numbers = [
                  { number: 1 }
                , { number: 1 }
                , { number: 3 }
                , { number: 4 }
                , { number: -20 }
                , { number: 43.5 }
                , { number: 17 }
            ];
            z.assert(function() { return numbers.min("x => x.number") === -20; });
            sw.pop();
        }

        function testOrderBy() {
            sw.push("Testing Array.orderBy()");
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
            var ordered = sortable.orderBy("x => x.word");
            z.assert(function() { return ordered.length === 9; });
            z.assert(function() { return ordered[0].word === "The"; });
            z.assert(function() { return ordered[1].word === "brown"; });
            z.assert(function() { return ordered[2].word === "dog."; });
            z.assert(function() { return ordered[3].word === "fox"; });
            z.assert(function() { return ordered[4].word === "jumped"; });
            z.assert(function() { return ordered[5].word === "lazy"; });
            z.assert(function() { return ordered[6].word === "over"; });
            z.assert(function() { return ordered[7].word === "quick"; });
            z.assert(function() { return ordered[8].word === "the"; });

            ordered = queryable.orderBy("x => x.other");
            z.assert(function() { return ordered[0].other === "some property"; });
            z.assert(function() { return ordered[1].other === "test property"; });
            for (var i = 2; i < ordered.length; i++) {
                z.assert(function() { return ordered[i].other === undefined; }); // items which don't contain "other" down to bottom
            }
            sw.pop();
        }

        function testQuicksort() {
            sw.push("Testing Array.quicksort()");
            queryable.quicksort(function(x, y) {
                return (x.id > y.id) ? -1 : (x.id < y.id) ? 1 : 0;
            });
            z.assert(function() { return queryable.length === 9 });
            for (var i = 0; i < queryable.length; i++) {
                z.assert(function() { return queryable[i].id === (9-i); });
            }
            queryable.quicksort(function(x, y) {
                return (x.id > y.id) ? 1 : (x.id < y.id) ? -1 : 0;
            });
            z.assert(function() { return queryable.length === 9 });
            for (var i = 0; i < queryable.length; i++) {
                z.assert(function() { return queryable[i].id === (i+1); });
            }

            queryable.quicksort("x, y => x.id > y.id ? -1 : x.id < y.id ? 1 : 0");
            z.assert(function() { return queryable.length === 9 });
            for (var i = 0; i < queryable.length; i++) {
                z.assert(function() { return queryable[i].id === (9-i); });
            }
            queryable.quicksort("x, y => x.id > y.id ? 1 : x.id < y.id ? -1 : 0");
            z.assert(function() { return queryable.length === 9 });
            for (var i = 0; i < queryable.length; i++) {
                z.assert(function() { return queryable[i].id === (i+1); });
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
            z.assert(function() { return sortable.length === 9; });
            z.assert(function() { return sortable[0] === "The"; });
            z.assert(function() { return sortable[1] === "brown"; });
            z.assert(function() { return sortable[2] === "dog."; });
            z.assert(function() { return sortable[3] === "fox"; });
            z.assert(function() { return sortable[4] === "jumped"; });
            z.assert(function() { return sortable[5] === "lazy"; });
            z.assert(function() { return sortable[6] === "over"; });
            z.assert(function() { return sortable[7] === "quick"; });
            z.assert(function() { return sortable[8] === "the"; });
            sw.pop();
        }

        function testQuicksort3() {
            sw.push("Testing Array.quicksort3()");

            queryable.quicksort3(function(x, y) {
                return (x.id > y.id) ? -1 : (x.id < y.id) ? 1 : 0;
            });
            z.assert(function() { return queryable.length === 9 });
            for (var i = 0; i < queryable.length; i++) {
                z.assert(function() { return queryable[i].id === (9-i); });
            }
            queryable.quicksort3(function(x, y) {
                return (x.id > y.id) ? 1 : (x.id < y.id) ? -1 : 0;
            });
            z.assert(function() { return queryable.length === 9 });
            for (var i = 0; i < queryable.length; i++) {
                z.assert(function() { return queryable[i].id === (i+1); });
            }

            queryable.quicksort3("x, y => x.id > y.id ? -1 : x.id < y.id ? 1 : 0");
            z.assert(function() { return queryable.length === 9 });
            for (var i = 0; i < queryable.length; i++) {
                z.assert(function() { return queryable[i].id === (9-i); });
            }
            queryable.quicksort3("x, y => x.id > y.id ? 1 : x.id < y.id ? -1 : 0");
            z.assert(function() { return queryable.length === 9 });
            for (var i = 0; i < queryable.length; i++) {
                z.assert(function() { return queryable[i].id === (i+1); });
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
            z.assert(function() { return sortable.length === 9; });
            z.assert(function() { return sortable[0] === "The"; });
            z.assert(function() { return sortable[1] === "brown"; });
            z.assert(function() { return sortable[2] === "dog."; });
            z.assert(function() { return sortable[3] === "fox"; });
            z.assert(function() { return sortable[4] === "jumped"; });
            z.assert(function() { return sortable[5] === "lazy"; });
            z.assert(function() { return sortable[6] === "over"; });
            z.assert(function() { return sortable[7] === "quick"; });
            z.assert(function() { return sortable[8] === "the"; });
            sw.pop();
        }

        function testRemoveAll() {
            sw.push("Testing Array.removeAll()");

            var array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            array.removeAll(3);
            z.assert(function() { return array.length === 8; });
            z.assert(function() { return array[0] === 1; });
            z.assert(function() { return array[1] === 2; });
            z.assert(function() { return array[2] === 4; });
            z.assert(function() { return array[3] === 5; });
            z.assert(function() { return array[4] === 6; });
            z.assert(function() { return array[5] === 7; });
            z.assert(function() { return array[6] === 8; });
            z.assert(function() { return array[7] === 9; });

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
            z.assert(function() { return sentence[0] === "The"; });
            z.assert(function() { return sentence[1] === "quick"; });
            z.assert(function() { return sentence[2] === "brown"; });
            z.assert(function() { return sentence[3] === "fox"; });
            z.assert(function() { return sentence[4] === "jumped"; });
            z.assert(function() { return sentence[5] === "over"; });
            z.assert(function() { return sentence[6] === "lazy"; });
            z.assert(function() { return sentence[7] === "dog."; });
            sentence.removeAll(function(x) { return x.indexOf("e") > -1; });
            z.assert(function() { return sentence[0] === "quick"; });
            z.assert(function() { return sentence[1] === "brown"; });
            z.assert(function() { return sentence[2] === "fox"; });
            z.assert(function() { return sentence[3] === "lazy"; });
            z.assert(function() { return sentence[4] === "dog."; });

            var removable = queryable.deepCopy();
            var removed = removable.removeAll("x => x.id % 3 === 0");
            z.assert(function() { return removed === 3; });
            for (var i = 0; i < removable.length; i++) {
                z.assert(function() { return removable[i].id % 3 !== 0; });
            }

            sw.pop();
        }

        function testSelect() {
            sw.push("Testing Array.select()");

            var selected = queryable.select("x => {data: x.data}");
            z.assert(function() { return selected.length === 9; });
            z.assert(function() { return selected[0].data.equals([1,2,3]); });
            z.assert(function() { return selected[0].id === undefined; });
            z.assert(function() { return selected[1].data.equals([4,5,6]); });
            z.assert(function() { return selected[1].id === undefined; });
            z.assert(function() { return selected[2].data.equals([7,8,9]); });
            z.assert(function() { return selected[2].id === undefined; });
            z.assert(function() { return selected[3].data.equals([7,8,9,10]); });
            z.assert(function() { return selected[3].id === undefined; });
            z.assert(function() { return selected[4].data.equals([7,8,9,11]); });
            z.assert(function() { return selected[4].id === undefined; });
            z.assert(function() { return selected[5].data.equals([7,8,12]); });
            z.assert(function() { return selected[5].id === undefined; });

            selected = queryable.select("x => {data: x.data, id: x.id}");
            z.assert(function() { return selected.length === 9; });
            z.assert(function() { return selected[0].data.equals([1,2,3]); });
            z.assert(function() { return selected[0].id === 1; });
            z.assert(function() { return selected[1].data.equals([4,5,6]); });
            z.assert(function() { return selected[1].id === 2; });
            z.assert(function() { return selected[2].data.equals([7,8,9]); });
            z.assert(function() { return selected[2].id === 3; });
            z.assert(function() { return selected[3].data.equals([7,8,9,10]); });
            z.assert(function() { return selected[3].id === 4; });
            z.assert(function() { return selected[4].data.equals([7,8,9,11]); });
            z.assert(function() { return selected[4].id === 5; });
            z.assert(function() { return selected[5].data.equals([7,8,12]); });
            z.assert(function() { return selected[5].id === 6; });

            selected = queryable.select("x => x.data");
            z.assert(function() { return selected.length === 9; });
            z.assert(function() { return selected[0].equals([1,2,3]); });
            z.assert(function() { return selected[0].id === undefined; });
            z.assert(function() { return selected[0].data === undefined; });
            z.assert(function() { return selected[1].equals([4,5,6]); });
            z.assert(function() { return selected[1].id === undefined; });
            z.assert(function() { return selected[1].data === undefined; });
            z.assert(function() { return selected[2].equals([7,8,9]); });
            z.assert(function() { return selected[2].id === undefined; });
            z.assert(function() { return selected[2].data === undefined; });
            z.assert(function() { return selected[3].equals([7,8,9,10]); });
            z.assert(function() { return selected[3].id === undefined; });
            z.assert(function() { return selected[3].data === undefined; });
            z.assert(function() { return selected[4].equals([7,8,9,11]); });
            z.assert(function() { return selected[4].id === undefined; });
            z.assert(function() { return selected[4].data === undefined; });
            z.assert(function() { return selected[5].equals([7,8,12]); });
            z.assert(function() { return selected[5].id === undefined; });
            z.assert(function() { return selected[5].data === undefined; });

            selected = queryable.select(function(x) { return {id: x.id}; });
            z.assert(function() { return selected.length === 9; });
            for (var i = 0; i < selected.length; i++) {
                z.assert(function() { 
                    return (
                            selected[i].id === (i+1)
                        &&  selected[i].data === undefined
                    );
                });
            }
            selected = queryable.select(function(x) { return {doubled_id: x.id * 2}; });
            z.assert(function() { return selected.length === 9; });
            for (var i = 0; i < selected.length; i++) {
                z.assert(function() { 
                    return (
                            selected[i].doubled_id === ((i+1)*2)
                        &&  selected[i].id === undefined
                        &&  selected[i].data === undefined
                    );
                });
            }
            sw.pop();
        }

        function testSkip() {
            sw.push("Testing Array.skip()");
            z.assert(function() { return [1, 2].skip(1).equals([2]); });
            z.assert(function() { return [1, 2, 3].skip(1).equals([2, 3]); });
            z.assert(function() { return [1, 2, 3].skip(2).equals([3]); });
            z.assert(function() { return [1, 2, 3, 4].skip(1).equals([2, 3, 4]); });
            z.assert(function() { return [1, 2, 3, 4].skip(2).equals([3, 4]); });
            z.assert(function() { return [1, 2, 3, 4].skip(3).equals([4]); });
            var obj1 = {id: 1, name: "object 1", func: function(a) { return a === 1; }};
            var obj2 = {id: 2, name: "object 2", func: function(a) { return a === 2; }};
            var obj3 = {id: 3, name: "object 3", func: function(a) { return a === 3; }};
            var obj4 = {id: 4, name: "object 4", func: function(a) { return a === 4; }};
            var arraySkip = [obj1, obj2, obj3, obj4];
            z.assert(function() { return arraySkip.skip(1).equals([obj2, obj3, obj4]); });
            z.assert(function() { return arraySkip.skip(2).equals([obj3, obj4]); });
            z.assert(function() { return arraySkip.skip(3).equals([obj4]); });
            sw.pop();
        }

        function testSum() {
            sw.push("Testing Array.sum()");
            z.assert(function() { return [1, 2, 3, 4, 5].sum() === 15 });
            z.assert(function() { return [1.0, 2.0, 3.0, 4.0, 5.0].sum() === 15.0 });
            var numbers = [
                { number: 1 }
                , { number: 2 }
                , { number: 3 }
                , { number: 4 }
                , { number: 5 }
            ];
            z.assert(function() { return numbers.sum("x => x.number") === 15; });
            var numbers2 = [
                { number: 1, other: "something" }
                , { number: 2, other: "something" }
                , { number: 3, other: "something" }
                , { number: 4, other: "something" }
                , { number: 5, other: "something" }
            ];
            z.assert(function() { return numbers2.sum("x => x.number") === 15; });
            sw.pop();
        }

        function testSwap() {
            sw.push("Testing Array.swap()");
            var numbers1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            var numbers2 = numbers1.deepCopy();
            numbers2.swap(1, 5);
            z.assert(function() { return !numbers1.equals(numbers2); });
            numbers2.swap(1, 5);
            z.assert(function() { return numbers1.equals(numbers2); });
            numbers2.swap(1, 5);
            numbers2.swap(5, 1);
            z.assert(function() { return numbers1.equals(numbers2); });
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
            z.assert(function() { return !numbers1.equals(numbers2); });
            z.assert(function() { return numbers1[0].number === 1; });
            z.assert(function() { return numbers1[1].number === 2; });
            z.assert(function() { return numbers1[2].number === 3; });
            z.assert(function() { return numbers1[3].number === 4; });
            z.assert(function() { return numbers1[4].number === 5; });
            z.assert(function() { return numbers2[0].number === 5; });
            z.assert(function() { return numbers2[1].number === 2; });
            z.assert(function() { return numbers2[2].number === 3; });
            z.assert(function() { return numbers2[3].number === 4; });
            z.assert(function() { return numbers2[4].number === 1; });
            sw.pop();
        }

        function testTake() {
            sw.push("Testing Array.take()");

            var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            z.assert(function() { return array.take(5).equals([1, 2, 3, 4, 5]); });
            z.assert(function() { return array.take(6).equals([1, 2, 3, 4, 5, 6]); });

            var obj1 = {id: 1, name: "object 1", func: function(a) { return a === 1; }};
            var obj2 = {id: 2, name: "object 2", func: function(a) { return a === 2; }};
            var obj3 = {id: 3, name: "object 3", func: function(a) { return a === 3; }};
            var obj4 = {id: 4, name: "object 4", func: function(a) { return a === 4; }};
            var arrayTake = [obj1, obj2, obj3, obj4];
            z.assert(function() { return arrayTake.take(1).equals([obj1]); });
            z.assert(function() { return arrayTake.take(2).equals([obj1, obj2]); });
            z.assert(function() { return arrayTake.take(3).equals([obj1, obj2, obj3]); });
            z.assert(function() { return arrayTake.take(4).equals([obj1, obj2, obj3, obj4]); });

            sw.pop();
        }

        function testWhere() {
            sw.push("Testing Array.where()");

            var result = queryable.where(function(obj) { return obj.id > 5; });
            z.assert(function() { return result.length === 4 });
            z.assert(function() { return result[0].id === 6 && result[0].data.equals([7, 8, 12]) });
            z.assert(function() { return result[1].id === 7 && result[1].data === 1 });
            z.assert(function() { return result[2].id === 8 && result[2].data === 2 });
            z.assert(function() { return result[3].id === 9 && result[3].data.equals([1, 2, 3]) && result[3].other === "test property" });
            result[3].id = -1;
            z.assert(function () { return result[3].id === -1 && queryable[8].id !== -1; }); // ensure a deep copy is being used by where

            result = queryable.where("x => x.id > 5");
            z.assert(function() { return result.length === 4 });
            z.assert(function() { return result[0].id === 6 && result[0].data.equals([7, 8, 12]) });
            z.assert(function() { return result[1].id === 7 && result[1].data === 1 });
            z.assert(function() { return result[2].id === 8 && result[2].data === 2 });
            z.assert(function() { return result[3].id === 9 && result[3].data.equals([1, 2, 3]) && result[3].other === "test property" });
            result[3].id = -1;
            z.assert(function () { return result[3].id === -1 && queryable[8].id !== -1; }); // ensure a deep copy is being used by where
            
            sw.pop();
        }

        (function() {
            z.log.log("Testing Array extension methods");
            z.sw.push("Array extension methods tests");
            testAggregate();
            testAny();
            testAverage();
            testContains();
            testDeepCopy();
            testDistinct();
            testEquals();
            testFirst();
            testInnerJoin();
            testLast();
            testMax();
            testMin();
            testOrderBy();
            testQuicksort();
            testQuicksort3();
            testRemoveAll();
            testSelect();
            testSkip();
            testSum();
            testSwap();
            testTake();
            testWhere();
            z.sw.pop();
        })();   
    }

    function testMiscMethods() {

        function testMatch() {
            sw.push("Testing match(Array, Object)");
            var matchable = [
                  { id: 1, data: [1, 2, 3]}
                , { id: 2, data: [4, 5, 6]}
                , { id: 3, data: [7, 8, 9]}
                , { id: 4, data: [7, 8, 9, 10]}
                , { id: 5, data: [7, 8, 9, 11]}
                , { id: 6, data: [7, 8, 12]}
                , { id: 7, data: 1}
                , { id: 8, data: 2, other: "some property"}
                , { id: 9, data: [1, 2, 3], other: "test property"}
            ];
            z.assert(function() { return z.match(matchable, { data: 1 }).length === 3; }); // 1, 7, 9
            z.assert(function() { return z.match(matchable, { data: [7, 8, 9] }).length === 3; }); // 3, 4, 5
            z.assert(function() { return z.match(matchable, { id: 1 }).length === 1; }); // 1
            z.assert(function() { return z.match(matchable, { id: [1, 2] }).length === 0; }); // N/A
            sw.pop();
        };

        (function() {
            z.log.log("Testing miscellaneous methods");
            sw.push("Testing Misc Methods");
            testMatch();
            sw.pop();
        })();
    }

    function testObjectExtensions() {

        function testDeepCopy() {
            sw.push("Testing Object.deepCopy()");
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
            z.assert(function() { return obj1.equals(obj2); });
            var obj3 = obj1.deepCopy();
            obj3.data.numbers.push(4);
            z.assert(function() { return !obj1.equals(obj3); });
            var obj4 = obj1.deepCopy();
            obj4.id = 4;
            z.assert(function() { return !obj1.equals(obj4); });
            var obj5 = obj1.deepCopy();
            obj5.data.regexp.prop = false;
            z.assert(function() { return !obj1.equals(obj5); });

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
            z.assert(function() { return c1.equals(c2); });
            c2.data.push(4);
            z.assert(function() { return !c1.equals(c2); });

            function cyclical(item) {
                this.item = item;
                this.data = [1, 2, 3];
                this.regexp = new RegExp("RegExp", "g");
                this.date = new Date("1999-12-31");
                this.cycle = this;
            }

            // test self-referencing cyclical objects
            var c1 = new cyclical("item1");
            var c2 = c1.deepCopy();
            z.assert(function() { return c1.equals(c2); });
            c2.item = "item2";
            z.assert(function() { return !c1.equals(c2); });
            var c3 = c1.deepCopy();
            c3.cycle.cycle.cycle.cycle.item = "item3";
            z.assert(function() { return !c1.equals(c3); });

            // test cyclical objects which reference something other than themselves
            c1 = new cyclical("item1")
            c2 = new cyclical("item2");
            c1.cycle = c2;
            c2.cycle = c1;
            var c3 = c1.deepCopy();
            var c4 = c2.deepCopy();
            z.assert(function() { return c1.equals(c3); });
            z.assert(function() { return c2.equals(c4); });
            c3.item = "item3";
            z.assert(function() { return !c1.equals(c3); });
            c1.item = "item3";
            z.assert(function() { return c1.equals(c3); });
            c3.cycle.item = "item4";
            c4.item = "item4";
            c4.cycle.item = "item3";
            z.assert(function() { return !c3.equals(c4); });
            c4.item = "item3";
            c4.cycle.item = "item4";
            z.assert(function() { return c3.equals(c4); });
            c4.date.date = c4.date; // cyclic date reference
            var c5 = c4.deepCopy();
            z.assert(function() { return c4.equals(c5); });
            c5.date.date = new Date("1999-12-30");
            z.assert(function() { return !c4.equals(c5); });
            c5.regexp.regexp = c5.regexp; // cyclic regexp reference
            var c6 = c5.deepCopy();
            z.assert(function() { return c5.equals(c6); });
            c6.regexp.regexp = new RegExp("RegExp2", "g");
            z.assert(function() { return !c5.equals(c6); });
            sw.pop();
        }

        function testEquals() {
            sw.push("Testing Object.equals()");
            var obj1 = { id: 1, data: [1, 2, 3]};
            var obj2 = { id: 1, data: [4, 5, 6]};
            var obj3 = { id: 1, data: [7, 8, 9]};
            var obj4 = { id: 1, data: [1, 2, 3]};
            z.assert(function() { return !obj1.equals(obj2); });
            z.assert(function() { return !obj1.equals(obj3); });
            z.assert(function() { return obj1.equals(obj4); });

            obj1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }};
            obj2 = { id: 1, data: { numbers: [1, 2, 3], data2: undefined, data3: undefined }};
            obj3 = { id: 1, data: { numbers: [1, 2, 3], data2: 1, data3: undefined }};
            obj4 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }};
            z.assert(function() { return !obj1.equals(obj2); });
            z.assert(function() { return !obj1.equals(obj3); });
            z.assert(function() { return obj1.equals(obj4); });

            obj1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }};
            obj2 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: null }};
            obj3 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: 1 }};
            obj4 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }};
            z.assert(function() { return !obj1.equals(obj2); });
            z.assert(function() { return !obj1.equals(obj3); });
            z.assert(function() { return obj1.equals(obj4); });

            obj1 = obj2 = obj3 = obj4;
            z.assert(function() { return obj1.equals(obj2); });
            z.assert(function() { return obj1.equals(obj3); });
            z.assert(function() { return obj1.equals(obj4); });

            obj1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; }};
            obj2 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(b) { this.id = b; }}; // note function inequality here
            obj3 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = !a; }};
            obj4 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; }};
            z.assert(function() { return !obj1.equals(obj2); });
            z.assert(function() { return !obj1.equals(obj3); });
            z.assert(function() { return obj1.equals(obj4); });

            obj1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }, func: function(a) { this.id = a; }};
            obj2 = { id: 1, data: { numbers: 4,         data2: null, data3: undefined}, func: function(a) { this.id = a; }};
            obj3 = { id: 1, data: { numbers: {num: 1},  data2: null, data3: undefined}, func: function(a) { this.id = a; }};
            obj4 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; }};
            z.assert(function() { return !obj1.equals(obj2); });
            z.assert(function() { return !obj1.equals(obj3); });
            z.assert(function() { return obj1.equals(obj4); });

            z.assert(function() { return (new Date("1999-12-31").equals(new Date("1999-12-31"))); });
            z.assert(function() { return !(new Date("1999-12-31").equals(new Date("1999-12-30"))); });
            var d1 = new Date("1999-12-31");
            d1.func = function(a) { this.prop = a; };
            d1.func("something");
            var d2 = new Date("1999-12-31");
            d2.func = function(a) { this.prop = a; };
            d2.func("something");
            z.assert(function() { return d1.equals(d1); });
            z.assert(function() { return d1.equals(d2); });
            z.assert(function() { return d2.equals(d1); });

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
            z.assert(function() { return a.equals(b); });
            z.assert(function() { return !a.equals(c); });
            z.assert(function() { return !c.equals(d); });
            z.assert(function() { return !a.equals(e); });
            z.assert(function() { return f.equals(g); });
            z.assert(function() { return !h.equals(g); });
            z.assert(function() { return i.equals(j); });
            z.assert(function() { return !d.equals(k); });
            z.assert(function() { return !k.equals(l); });

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
            z.assert(function() { return !c1.equals(c2); });
            z.assert(function() { return c1.equals(c3); });
            z.assert(function() { return !c1.equals(c4); });
            z.assert(function() { return !c1.equals(c5); });
            z.assert(function() { return c5.equals(c6); });

            var c7 = new custom();
            c7.recurse = c7; // circular reference to self
            var c8 = new custom();
            var c9 = new custom();
            c8.recurse = c9; // circular reference with multiple objects
            c9.recurse = c8; // circular reference with multiple objects
            z.assert(function() { return c7.equals(c7); });
            z.assert(function() { return c8.equals(c9); });
            z.assert(function() { return c9.equals(c8); });

            // check that we can still get inequality with circular objects
            // especially with properties added after the circular reference
            c8.second = "c8";
            c9.second = "c9";
            z.assert(function() { return !c8.equals(c9); });
            z.assert(function() { return !c9.equals(c8); });

            var shuffled1, shuffled2, shuffled3, shuffled4;
            shuffled1 = { a: 1, b: 2, c: 3 };
            shuffled2 = { b: 2, a: 1, c: 3};
            z.assert(function() { return shuffled1.equals(shuffled2); });
            shuffled1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; } };
            shuffled2 = { data: { numbers: [1, 2, 3], data2: null, data3: undefined}, id: 1, func: function(a) { this.id = a; } };
            shuffled3 = { func: function(a) { this.id = a; }, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, id: 1 };
            shuffled4 = { func: function(a) { this.id = a; }, data: { data2: null, numbers: [1, 2, 3], data3: undefined}, id: 1 };
            z.assert(function() { return shuffled1.equals(shuffled2); });
            z.assert(function() { return shuffled1.equals(shuffled3); });
            z.assert(function() { return shuffled1.equals(shuffled4); });

            sw.pop();
        }

        function testSmash() {
            sw.push("Testing Object.smash()");
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

            z.assert(function() { return z.equals(left.smash(center, right), center.smash(left, right)); });
            z.assert(function() { return z.equals(center.smash(left, right), right.smash(center, left)); });
            z.assert(function() { return z.equals(right.smash(center, left), left.smash(center, right)); });

            // ensure duplicate properties are being overwritten on the smashed object
            z.assert(function() { return !z.equals(left.smash(center, right), center.smash(left, right, duplicates)); });
            z.assert(function() { return !z.equals(center.smash(left, right), right.smash(center, left, duplicates)); });
            z.assert(function() { return !z.equals(right.smash(center, left), left.smash(center, right, duplicates)); });

            var obj1 = { num: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; } };
            var obj2 = { num: 2, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: function(a) { this.id = a; }, func2: function(b) { return this.num === b; } };
            var obj3 = { num: 3, data: { numbers: [1, 2, 3], data2: null, data3: undefined, data4: "data4"}, func: function(a) { this.id = a; } };

            smashed = obj1.smash(obj2);
            z.assert(function() { return smashed.num === 2; });
            z.assert(function() { return z.equals(smashed.data.numbers, [1,2,3]); });
            z.assert(function() { return z.equals(smashed.data.data2, null); });
            z.assert(function() { return z.equals(smashed.data.data3, undefined); });
            z.assert(function() { return z.equals(smashed.func, function(a) { this.id = a; }); });
            z.assert(function() { return z.equals(smashed.func2, function(b) { return this.num === b; }); });
            
            smashed = smashed.smash(obj3);
            z.assert(function() { return smashed.num === 3; });
            z.assert(function() { return z.equals(smashed.data.numbers, [1,2,3]); });
            z.assert(function() { return z.equals(smashed.data.data2, null); });
            z.assert(function() { return z.equals(smashed.data.data3, undefined); });
            z.assert(function() { return z.equals(smashed.data.data4, "data4"); });
            z.assert(function() { return z.equals(smashed.func, function(a) { this.id = a; }); });
            z.assert(function() { return z.equals(smashed.func2, function(b) { return this.num === b; }); });

            sw.pop();
        }

        (function() {
            z.log.log("Testing Object extension methods");
            sw.push("Testing Object extension methods");
            testDeepCopy();
            testEquals();
            testSmash();
            sw.pop();
        })();
    }

    function testEvents() {

        function testSimpleEvent() {
            sw.push("Testing a simple event");
            var events = new z.classes.Events();
            var obj = {};
            events.on("tester", function() { obj["key"] = "value"; });
            events.call("tester");
            z.assert(function() { return obj.key != null && obj.key === "value"; });
            events.clear("tester");
            sw.pop();
        }

        function testChainedEvents() {
            sw.push("Testing chained events");
            var events = new z.classes.Events();
            var arr = [];
            var num = 0;
            events.on("tester", function() { arr.push(++num); });
            events.on("tester", function() { arr.push(++num); });
            events.on("tester", function() { arr.push(++num); });
            events.on("tester", function() { arr.push(++num); });
            for (var i = 0; i < 5; i++) {
                events.call("tester");
            }
            z.assert(function() { return arr.length === 20; });
            for (var i = 0; i < arr.length; i++) {
                z.assert(function() { return arr[i] === i+1; });
            }
            events.clear("tester");

            events.on("1", function(x) { events.call("2"); });
            events.on("2", function(x) { events.call("3"); });
            events.on("3", function(x) { events.call("4"); });
            events.on("4", function(x) { arr.push(arr.max()+1); });
            events.call("1");
            z.assert(function() { return arr.length === 21; });
            for (var i = 0; i < arr.length; i++) {
                z.assert(function() { return arr[i] === i+1; });
            }
            events.clear("tester");
            
            sw.pop();
        }

        function testDeregisterEvent() {
            sw.push("Testing event deregistration");
            var events = new z.classes.Events();
            var obj = {};
            var deregisterFunc = events.on("tester", function() { obj.key = "value"; });
            events.call("tester");
            z.assert(function() { return obj.key && obj.key === "value"; });
            obj.key = "new_value";
            deregisterFunc();
            events.call("tester");
            z.assert(function() { return obj.key && obj.key === "new_value"; });

            var deregister1 = events.on("tester", function() { obj.key = "value1"; });
            var deregister2 = events.on("tester", function() { obj.key = "value2"; });
            var deregister3 = events.on("tester", function() { obj.key = "value3"; });
            events.call("tester");
            z.assert(function() { return obj.key && obj.key === "value3"; });
            deregister3();
            events.call("tester");
            z.assert(function() { return obj.key && obj.key === "value2"; });
            deregister2();
            events.call("tester");
            z.assert(function() { return obj.key && obj.key === "value1"; });
            deregister1();
            events.call("tester");
            z.assert(function() { return obj.key && obj.key === "value1"; });

            events.clear("tester");
            sw.pop();
        }

        function testEmptyEvents() {
            sw.push("Testing empty events");
            var events = new z.classes.Events();
            // just make sure these can be called without any errors
            events.call("something bogus");
            events.call(null);
            events.call(undefined);
            sw.pop();
        }

        function testEventParameters() {
            sw.push("Testing event parameters");
            var events = new z.classes.Events();
            var obj = {};
            var string = "This is my string for testing purposes!";
            var num = 4;
            var num2 = 6;

            events.on("tester", function(x) { obj.upper = "UPPER: " + x.toUpperCase(); });
            events.on("tester", function(x) { obj.lower = "LOWER: " + x.toLowerCase(); });
            events.on("tester", function(x) { obj.original = "ORIGINAL: " + x; });
            events.call("tester", string);
            z.assert(function() { return obj.upper === "UPPER: " + string.toUpperCase(); });
            z.assert(function() { return obj.lower === "LOWER: " + string.toLowerCase(); });
            z.assert(function() { return obj.original === "ORIGINAL: " + string; });
            events.clear("tester");

            events.on("tester", function(x, y) { x.a = y; });
            events.on("tester", function(x, y) { x.b = y+1; });
            events.on("tester", function(x, y) { x.c = y*2; });
            events.call("tester", obj, num);
            z.assert(function() { return obj.upper === "UPPER: " + string.toUpperCase(); });
            z.assert(function() { return obj.lower === "LOWER: " + string.toLowerCase(); });
            z.assert(function() { return obj.original === "ORIGINAL: " + string; });
            z.assert(function() { return obj.a === num; });
            z.assert(function() { return obj.b === num+1; });
            z.assert(function() { return obj.c === num*2; });
            events.clear("tester");

            events.on("tester", function(x, y, z) { x.d = y; });
            events.on("tester", function(x, y, z) { x.e = y+z; });
            events.on("tester", function(x, y, z) { x.f = y*z; });
            events.call("tester", obj, num, num2);
            z.assert(function() { return obj.upper === "UPPER: " + string.toUpperCase(); });
            z.assert(function() { return obj.lower === "LOWER: " + string.toLowerCase(); });
            z.assert(function() { return obj.original === "ORIGINAL: " + string; });
            z.assert(function() { return obj.a === num; });
            z.assert(function() { return obj.b === num+1; });
            z.assert(function() { return obj.c === num*2; });
            z.assert(function() { return obj.d === num; });
            z.assert(function() { return obj.e === num+num2; });
            z.assert(function() { return obj.f === num*num2; });

            sw.pop();
        }

        (function() {
            z.log.log("Testing Events methods");
            sw.push("Testing Events methods");
            testSimpleEvent();
            testChainedEvents();
            testDeregisterEvent();
            testEmptyEvents();
            testEventParameters();
            sw.pop();
        })();
    }

    function runUnitTests() {
        testArrayExtensions();
        testMiscMethods();
        testObjectExtensions();
        testEvents();
    }

    z.runUnitTests = runUnitTests;
    w.util = z;
}(window || this));