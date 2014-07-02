/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
(function(z, undefined) {

    // set these up when runUnitTests is called, not before
    var log; 
    var sw;
    var assert;

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

            var letters = ["a", "b", "c", "d", "e"];
            assert(() => letters.aggregate((x,y) => x + ", " + y) === "a, b, c, d, e");

            var sentence = ["we", "are", "going", "to", "build", "a", "sentence"];
            assert(() => sentence.aggregate((x,y) => x + " " + y) === "we are going to build a sentence");

            var factorial = [5, 4, 3, 2, 1];
            assert(() => factorial.aggregate((x, y) => x*y) === 120);
            assert(() => [1].aggregate((x, y) => "whatever you want, single items are returned as themselves") === 1);
            
            var func = (x,y) => x+y;
            assert(() => [1,2,3,4,5].aggregate(func) === [2,3,4,5].aggregate(func, 1));

            sw.pop();
        }

        function testAny() {
            sw.push("Testing Array.any()");
            assert(queryable.any() === true);
            assert(() => queryable.any(x => x.id === 7) === true);
            assert(() => queryable.any(x => x.data === 1) === true);
            assert(() => queryable.any(x => x.data === 3) === false);
            assert(() => queryable.any(x => x.data.equals([7,8,9])) === true);
            assert(() => queryable.any(x => x.other === "test property") === true);
            assert(() => [].any() === false);
            assert(() => [].any(x => x.id === 0) === false);
            sw.pop();
        }

        function testAverage() {
            sw.push("Testing Array.average()");
            assert(() => [1, 2, 3, 4, 5].average() === 3);
            assert(() => [1.0, 2.0, 3.0, 4.0, 5.0].average() === 3);
            assert(() => [1.0, 2, 3, 4, 5.0].average() === 3);
            var numbers = [
                  { number: 1 }
                , { number: 2 }
                , { number: 3 }
                , { number: 4 }
                , { number: 5 }
            ];
            assert(() => numbers.average(x => x.number) === 3);
            var numbers2 = [
                  { number: 1, other: "something" }
                , { number: 2, other: "something" }
                , { number: 3, other: "something" }
                , { number: 4, other: "something" }
                , { number: 5, other: "something" }
            ];
            assert(() => numbers2.average(x => x.number) === 3);
            sw.pop();
        }

        function testContains() {
            sw.push("Testing Array.contains()");
            var container = [
                  { id: 1, numbers: [1, 2, 3, 4, 5], obj: { data: "data1" } }
                , { id: 2, numbers: [3, 4, 5, 6, 7], obj: { data: "data2" } }
                , { id: 3, numbers: [5, 6, 7, 8, 9], obj: { data: "data3" } }
            ];
            assert(() => [1, 2, 3].contains(1));
            assert(() => [1, 2, 3].contains(2));
            assert(() => [1, 2, 3].contains(3));
            assert(() => ![1, 2, 3].contains(4));
            assert(() => ![1, 2, 3].contains(null));
            assert(() => ![1, 2, 3].contains(undefined));

            assert(() => ["The", "quick", "brown", "fox"].contains("The"));
            assert(() => ["The", "quick", "brown", "fox"].contains("quick"));
            assert(() => ["The", "quick", "brown", "fox"].contains("brown"));
            assert(() => ["The", "quick", "brown", "fox"].contains("fox"));
            assert(() => !["The", "quick", "brown", "fox"].contains("THE"));
            assert(() => !["The", "quick", "brown", "fox"].contains("the"));
            assert(() => !["The", "quick", "brown", "fox"].contains(undefined));
            assert(() => !["The", "quick", "brown", "fox"].contains(null));

            assert(() => [null, undefined, null, null, undefined].contains(undefined));
            assert(() => [null, undefined, null, null, undefined].contains(null));

            var obj1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: a => { this.id = a; }};
            var obj2 = { id: 1, data: { numbers: 4,         data2: null, data3: undefined}, func: a => { this.id = a; }};
            var obj3 = { id: 1, data: { numbers: {num: 1},  data2: null, data3: undefined}, func: a => { this.id = a; }};
            var obj4 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: a => { this.id = a; }};
            var obj5 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: a => { this.id = a; }};
            var obj6 = { id: 1, data: { numbers: [1, 2, 3], data2: 2, data3: 3}, func: a => { this.id = a; }};
            var obj7 = obj6.deepCopy();
            container = [
                obj1
                , obj2
                , obj3
                , obj4
                , obj6
            ];
            assert(() => container.contains(obj1));
            assert(() => container.contains(obj2));
            assert(() => container.contains(obj3));
            assert(() => container.contains(obj4));
            assert(() => container.contains(obj5));
            assert(() => container.contains(obj6));
            assert(() => container.contains(obj7));

            assert(() => container.contains(1, x => x.id));
            assert(() => container.contains({ numbers: [1, 2, 3], data2: null, data3: undefined}, x => x.data));
            assert(() => container.contains([1, 2, 3], x => x.data.numbers));

            assert(() => container.contains({ id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }, func: a => { this.id = a; }}));
            assert(() => !container.contains({ id: 2, data: { numbers: [1, 2, 3], data2: null, data3: undefined }, func: a => { this.id = a; }}));
            assert(() => !container.contains({ id: 1, data: { numbers: [4, 2, 3], data2: null, data3: undefined }, func: a => { this.id = a; }}));
            assert(() => !container.contains({ id: 1, data: { numbers: [1, 2, 3], data2: undefined, data3: undefined }, func: a => { this.id = a; }}));
            assert(() => !container.contains({ id: 1, data: { numbers: [1, 2, 3], data2: null, data3: null }, func: a => { this.id = a; }}));
            assert(() => !container.contains({ id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }, func: a => { this.id = b; }})); // note function inequality here
            assert(() => !container.contains({ id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }, func: a => { this.id += a; }}));
            sw.pop();
        }

        function testDeepCopy() {
            sw.push("Testing Array.deepCopy()");
            var deep = queryable.deepCopy();
            assert(() => deep !== queryable);
            assert(() => deep != queryable);
            for (var i = 0; i < deep.length; i++) {
                deep[i].id *= 2;
            }
            for (var i = 0; i < deep.length; i++) {
                assert(() => queryable[i].id === (i+1) && deep[i].id === ((i+1)*2));
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
            assert(() => arr1.equals(arr2));
            var arr3 = arr1.deepCopy();
            arr3[0].id = 9;
            assert(() => !arr1.equals(arr3));
            var arr4 = arr1.deepCopy();
            arr4[1].data.numbers.push(9);
            assert(() => !arr1.equals(arr4));
            var arr5 = arr1.deepCopy();
            arr5[2].data.data2 = null;
            assert(() => !arr1.equals(arr5));
            var arr6 = arr1.deepCopy();
            arr6[3].data.data3 = undefined;
            assert(() => !arr1.equals(arr6));
            var arr7 = arr1.deepCopy();
            arr7[4].data.date.prop = "some extra date property";
            assert(() => !arr1.equals(arr7));
            var arr8 = arr1.deepCopy();
            arr8[4].data.regexp.prop = "some extra regexp property";
            assert(() => !arr1.equals(arr8));
            sw.pop();
        }

        function testDistinct() {
            sw.push("Testing Array.distinct()");

            var duplicates = [1, 1, 2, 3, 4, 5, 5, 5, 6, 7, 7, 7, 7, 7, 8, 9];
            var distinct = duplicates.distinct().toArray();
            for (var i = 0; i < distinct.length; i++) {
                assert(() => distinct[i] === i+1);
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
            var distinct = duplicates.distinct(x => x.character).toArray();
            var charCodeOfa = 'a'.charCodeAt(0);
            assert(() => distinct.length > 0);
            for (var i = 0; i < distinct.length; i++) {
                assert(() => distinct[i].character.charCodeAt(0) === (charCodeOfa+i));
            }

            sw.pop();
        }

        function testEquals() {
            sw.push("Testing Array.equals()");

            assert(() => [1].equals([1]));
            assert(() => [1,2].equals([1,2]));
            assert(() => ![2,1].equals([1,2]));
            assert(() => ![1].equals([1,2,3]));
            assert(() => ![1].equals(null));
            assert(() => ![1].equals(undefined));
            assert(() => ![1].equals([]));
            var arr1 = [1,2,3];
            var arr2 = [1,2,3];
            assert(() => arr1.equals(arr1));
            assert(() => arr2.equals(arr1));
            assert(() => arr1.equals(arr2));
            assert(() => arr2.equals(arr2));
            var arr3 = arr2;
            assert(() => arr3.equals(arr2) && arr2.equals(arr3));
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
            assert(() => !arr4.equals(arr5));
            assert(() => !arr4.equals(arr6));
            assert(() => !arr4.equals(arr7));
            assert(() => !arr4.equals(arr8));
            assert(() => arr4.equals(arr9));

            sw.pop();
        }

        function testFirst() {
            sw.push("Testing Array.first()");

            assert(() => [1, 2, 3, 4, 5].first() === 1);
            assert(() => [2, 3, 4, 5].first() === 2);
            assert(() => [3, 4, 5].first() === 3);
            assert(() => [4, 5].first() === 4);
            assert(() => [5].first() === 5);
            assert(() => [].first() === null);

            assert(() => [1, 2, 3, 4, 5].first(x => x > 3) === 4);
            assert(() => [2, 3, 4, 5].first(x => x > 3) === 4);
            assert(() => [3, 4, 5].first(x => x > 3) === 4);
            assert(() => [4, 5].first(x => x > 3) === 4);
            assert(() => [5].first(x => x > 3) === 5);
            assert(() => [].first(x => x > 3) === null);

            var obj1 = {id: 1, name: "object 1", func: a => a === 1 };
            var obj2 = {id: 2, name: "object 2", func: a => a === 2 };
            var obj3 = {id: 3, name: "object 3", func: a => a === 3 };
            var obj4 = {id: 4, name: "object 4", func: a => a === 4 };

            assert(() => [obj1, obj2, obj3, obj4].first(x => x.id > 2).equals(obj3));
            assert(() => [obj1, obj2, obj3].first(x => x.id > 2).equals(obj3));
            assert(() => [obj1, obj2].first(x => x.id > 2) === null);
            assert(() => [obj2, obj1, obj4, obj3].first(x => x.id > 2).equals(obj4));

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

            var joined = arr1.innerJoin(arr2).on((x,y) => x.a == y.a).toArray();
            assert(() => joined[0].equals({a: 1, b: 3, c: 5 }));
            assert(() => joined[1].equals({a: 2, b: 4, c: 6 }));
            assert(() => joined[2].equals({a: 2, b: 4, c: 7 }));
            assert(() => joined[3].equals({a: 2, b: 4, c: 8 }));

            var joined1 = arr1.innerJoin(arr2).on((x,y) => x.a == y.a).innerJoin(arr3).on((x,y) => x.a == y.d).toArray();
            assert(() => joined1[0].equals({a: 2, b: 4, c: 6, d: 2, e: 10 }));
            assert(() => joined1[1].equals({a: 2, b: 4, c: 7, d: 2, e: 10 }));
            assert(() => joined1[2].equals({a: 2, b: 4, c: 8, d: 2, e: 10 }));

            var joined2 = arr2.innerJoin(arr1).on((x,y) => x.a == y.a).innerJoin(arr3).on((x,y) => x.a == y.d).toArray();
            assert(() => z.equals(joined1, joined2));

            var joined3 = arr3.innerJoin(arr2).on((x,y) => x.d == y.a).innerJoin(arr1).on((x,y) => x.d == y.a).toArray();
            assert(() => z.equals(joined1, joined3));
            assert(() => z.equals(joined2, joined3));

            var joined4 = arr1.innerJoin(arr2).on((x,y) => x.a == x.c).toArray();
            assert(() => joined4 != null);
            assert(() => z.getType(joined4) === z.types.array);
            assert(() => joined4.length === 0);

            sw.pop();
        }

        function testLast() {
            sw.push("Testing Array.last()");

            assert(() => [1, 2, 3, 4, 5].last() === 5);
            assert(() => [1, 2, 3, 4].last() === 4);
            assert(() => [1, 2, 3].last() === 3);
            assert(() => [1, 2].last() === 2);
            assert(() => [1].last() === 1);
            assert(() => [].last() === null);

            assert(() => [5, 2, 3, 4, 5].last(x => x > 3) === 5);
            assert(() => [5, 2, 3, 4].last(x => x > 3) === 4);
            assert(() => [5, 2, 3].last(x => x > 3) === 5);
            assert(() => [5, 2].last(x => x > 3) === 5);
            assert(() => [5].last(x => x > 3) === 5);
            assert(() => [].last(x => x > 3) === null);

            var obj1 = {id: 1, name: "object 1", func: a => a === 1};
            var obj2 = {id: 2, name: "object 2", func: a => a === 2};
            var obj3 = {id: 3, name: "object 3", func: a => a === 3};
            var obj4 = {id: 4, name: "object 4", func: a => a === 4};

            assert(() => [obj1, obj2, obj4, obj3].last(x => x.id > 2).equals(obj3));
            assert(() => [obj1, obj3, obj2].last(x => x.id > 2).equals(obj3));
            assert(() => [obj1, obj2].last(x => x.id > 2) === null);
            assert(() => [obj1].last(x => x.id > 2) === null);
            assert(() => [obj2, obj1, obj4, obj3].last(x => x.id > 2).equals(obj3));

            sw.pop();
        }

        function testMax() {
            sw.push("Testing Array.max()");
            assert(() => [1, 2, 4, 5, 6, 3, 5, 6, 8, 5, 6, 3, 2, 1].max() === 8);
            assert(() => [1, 2, 4, 5, -6, 3, 9, 6, -8, 5, 6, 3, 2, 1].max() === 9);
            assert(() => [1].max() === 1);
            assert(() => [].max() === Number.MIN_VALUE);
            var numbers = [
                  { number: 1 }
                , { number: 1 }
                , { number: 3 }
                , { number: 4 }
                , { number: -20 }
                , { number: 43.5 }
                , { number: 17 }
            ];
            assert(() => numbers.max(x => x.number) === 43.5);
            sw.pop();
        }

        function testMin() {
            sw.push("Testing Array.min()");
            assert(() => [1, 2, 4, 5, 6, 3, 5, 6, 8, 5, 6, 3, 2, 1].min() === 1);
            assert(() => [1, 2, 4, 5, -6, 3, 9, 6, -8, 5, 6, 3, 2, 1].min() === -8);
            assert(() => [1].min() === 1);
            assert(() => [].min() === Number.MAX_VALUE);
            var numbers = [
                  { number: 1 }
                , { number: 1 }
                , { number: 3 }
                , { number: 4 }
                , { number: -20 }
                , { number: 43.5 }
                , { number: 17 }
            ];
            assert(() => numbers.min(x => x.number) === -20);
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
            var ordered = sortable.orderBy(x => x.word).toArray();
            assert(() => ordered.length === 9);
            assert(() => ordered[0].word === "The");
            assert(() => ordered[1].word === "brown");
            assert(() => ordered[2].word === "dog.");
            assert(() => ordered[3].word === "fox");
            assert(() => ordered[4].word === "jumped");
            assert(() => ordered[5].word === "lazy");
            assert(() => ordered[6].word === "over");
            assert(() => ordered[7].word === "quick");
            assert(() => ordered[8].word === "the");

            ordered = queryable.orderBy(x => x.other).toArray();
            assert(() => ordered[0].other === "some property");
            assert(() => ordered[1].other === "test property");
            for (var i = 2; i < ordered.length; i++) {
                assert(() => ordered[i].other === undefined); // items which don't contain "other" down to bottom
            }
            sw.pop();
        }

        function testQuicksort() {
            sw.push("Testing Array.quicksort()");

            queryable.quicksort((x, y) => x.id > y.id ? -1 : x.id < y.id ? 1 : 0);
            assert(() => queryable.length === 9);
            for (var i = 0; i < queryable.length; i++) {
                assert(() => queryable[i].id === (9-i));
            }
            queryable.quicksort((x, y) => x.id > y.id ? 1 : x.id < y.id ? -1 : 0);
            assert(() => queryable.length === 9);
            for (var i = 0; i < queryable.length; i++) {
                assert(() => queryable[i].id === (i+1));
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
            assert(() => sortable.length === 9);
            assert(() => sortable[0] === "The");
            assert(() => sortable[1] === "brown");
            assert(() => sortable[2] === "dog.");
            assert(() => sortable[3] === "fox");
            assert(() => sortable[4] === "jumped");
            assert(() => sortable[5] === "lazy");
            assert(() => sortable[6] === "over");
            assert(() => sortable[7] === "quick");
            assert(() => sortable[8] === "the");
            sw.pop();
        }

        function testQuicksort3() {
            sw.push("Testing Array.quicksort3()");

            queryable.quicksort3((x, y) => x.id > y.id ? -1 : x.id < y.id ? 1 : 0);
            assert(() => queryable.length === 9);
            for (var i = 0; i < queryable.length; i++) {
                assert(() => queryable[i].id === (9-i));
            }
            queryable.quicksort3((x, y) => x.id > y.id ? 1 : x.id < y.id ? -1 : 0);
            assert(() => queryable.length === 9);
            for (var i = 0; i < queryable.length; i++) {
                assert(() => queryable[i].id === (i+1));
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
            assert(() => sortable.length === 9);
            assert(() => sortable[0] === "The");
            assert(() => sortable[1] === "brown");
            assert(() => sortable[2] === "dog.");
            assert(() => sortable[3] === "fox");
            assert(() => sortable[4] === "jumped");
            assert(() => sortable[5] === "lazy");
            assert(() => sortable[6] === "over");
            assert(() => sortable[7] === "quick");
            assert(() => sortable[8] === "the");
            sw.pop();
        }

        function testRemoveAll() {
            sw.push("Testing Array.removeAll()");

            var array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            array.removeAll(3);
            assert(() => array.length === 8);
            assert(() => array[0] === 1);
            assert(() => array[1] === 2);
            assert(() => array[2] === 4);
            assert(() => array[3] === 5);
            assert(() => array[4] === 6);
            assert(() => array[5] === 7);
            assert(() => array[6] === 8);
            assert(() => array[7] === 9);

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
            assert(() => sentence[0] === "The");
            assert(() => sentence[1] === "quick");
            assert(() => sentence[2] === "brown");
            assert(() => sentence[3] === "fox");
            assert(() => sentence[4] === "jumped");
            assert(() => sentence[5] === "over");
            assert(() => sentence[6] === "lazy");
            assert(() => sentence[7] === "dog.");
            sentence.removeAll(x => x.indexOf("e") > -1);
            assert(() => sentence[0] === "quick");
            assert(() => sentence[1] === "brown");
            assert(() => sentence[2] === "fox");
            assert(() => sentence[3] === "lazy");
            assert(() => sentence[4] === "dog.");

            var removable = queryable.deepCopy();
            var removed = removable.removeAll(x => x.id % 3 === 0);
            assert(() => removed === 3);
            for (var i = 0; i < removable.length; i++) {
                assert(() => removable[i].id % 3 !== 0);
            }

            sw.pop();
        }

        function testSelect() {
            sw.push("Testing Array.select()");

            var selected = queryable.select(x => ({data: x.data})).toArray();
            assert(() => selected.length === 9);
            assert(() => selected[0].data.equals([1,2,3]));
            assert(() => selected[0].id === undefined);
            assert(() => selected[1].data.equals([4,5,6]));
            assert(() => selected[1].id === undefined);
            assert(() => selected[2].data.equals([7,8,9]));
            assert(() => selected[2].id === undefined);
            assert(() => selected[3].data.equals([7,8,9,10]));
            assert(() => selected[3].id === undefined);
            assert(() => selected[4].data.equals([7,8,9,11]));
            assert(() => selected[4].id === undefined);
            assert(() => selected[5].data.equals([7,8,12]));
            assert(() => selected[5].id === undefined);

            selected = queryable.select(x => ({data: x.data, id: x.id})).toArray();
            assert(() => selected.length === 9);
            assert(() => selected[0].data.equals([1,2,3]));
            assert(() => selected[0].id === 1);
            assert(() => selected[1].data.equals([4,5,6]));
            assert(() => selected[1].id === 2);
            assert(() => selected[2].data.equals([7,8,9]));
            assert(() => selected[2].id === 3);
            assert(() => selected[3].data.equals([7,8,9,10]));
            assert(() => selected[3].id === 4);
            assert(() => selected[4].data.equals([7,8,9,11]));
            assert(() => selected[4].id === 5);
            assert(() => selected[5].data.equals([7,8,12]));
            assert(() => selected[5].id === 6);

            selected = queryable.select(x => x.data).toArray();
            assert(() => selected.length === 9);
            assert(() => selected[0].equals([1,2,3]));
            assert(() => selected[0].id === undefined);
            assert(() => selected[0].data === undefined);
            assert(() => selected[1].equals([4,5,6]));
            assert(() => selected[1].id === undefined);
            assert(() => selected[1].data === undefined);
            assert(() => selected[2].equals([7,8,9]));
            assert(() => selected[2].id === undefined);
            assert(() => selected[2].data === undefined);
            assert(() => selected[3].equals([7,8,9,10]));
            assert(() => selected[3].id === undefined);
            assert(() => selected[3].data === undefined);
            assert(() => selected[4].equals([7,8,9,11]));
            assert(() => selected[4].id === undefined);
            assert(() => selected[4].data === undefined);
            assert(() => selected[5].equals([7,8,12]));
            assert(() => selected[5].id === undefined);
            assert(() => selected[5].data === undefined);

            selected = queryable.select(x => ({id: x.id})).toArray();
            assert(() => selected.length === 9);
            for (var i = 0; i < selected.length; i++) {
                assert(() => selected[i].id === i+1 && selected[i].data === undefined);
            }
            selected = queryable.select(x => ({doubled_id: x.id * 2})).toArray();
            assert(() => selected.length === 9);
            for (var i = 0; i < selected.length; i++) {
                assert(() => selected[i].doubled_id === (i+1)*2 && selected[i].id === undefined && selected[i].data === undefined);
            }
            sw.pop();
        }

        function testSkip() {
            sw.push("Testing Array.skip()");
            assert(() => [].skip(-9).toArray().equals([]));
            assert(() => [].skip(0).toArray().equals([]));
            assert(() => [].skip(9).toArray().equals([]));
            assert(() => [1, 2, 3, 4, 5].skip(-1).toArray().equals([1, 2, 3, 4, 5]));
            assert(() => [1, 2, 3, 4, 5].skip(0).toArray().equals([1, 2, 3, 4, 5]));
            assert(() => [1, 2].skip(1).toArray().equals([2]));
            assert(() => [1, 2, 3].skip(1).toArray().equals([2, 3]));
            assert(() => [1, 2, 3].skip(2).toArray().equals([3]));
            assert(() => [1, 2, 3, 4].skip(1).toArray().equals([2, 3, 4]));
            assert(() => [1, 2, 3, 4].skip(2).toArray().equals([3, 4]));
            assert(() => [1, 2, 3, 4].skip(3).toArray().equals([4]));
            var obj1 = {id: 1, name: "object 1", func: a => a === 1};
            var obj2 = {id: 2, name: "object 2", func: a => a === 2};
            var obj3 = {id: 3, name: "object 3", func: a => a === 3};
            var obj4 = {id: 4, name: "object 4", func: a => a === 4};
            var arraySkip = [obj1, obj2, obj3, obj4];
            assert(() => arraySkip.skip(1).toArray().equals([obj2, obj3, obj4]));
            assert(() => arraySkip.skip(2).toArray().equals([obj3, obj4]));
            assert(() => arraySkip.skip(3).toArray().equals([obj4]));
            sw.pop();
        }

        function testSum() {
            sw.push("Testing Array.sum()");
            assert(() => [1, 2, 3, 4, 5].sum() === 15);
            assert(() => [1.0, 2.0, 3.0, 4.0, 5.0].sum() === 15.0);
            var numbers = [
                { number: 1 }
                , { number: 2 }
                , { number: 3 }
                , { number: 4 }
                , { number: 5 }
            ];
            assert(() => numbers.sum(x => x.number) === 15);
            var numbers2 = [
                { number: 1, other: "something" }
                , { number: 2, other: "something" }
                , { number: 3, other: "something" }
                , { number: 4, other: "something" }
                , { number: 5, other: "something" }
            ];
            assert(() => numbers2.sum(x => x.number) === 15);
            sw.pop();
        }

        function testSwap() {
            sw.push("Testing Array.swap()");
            var numbers1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            var numbers2 = numbers1.deepCopy();
            numbers2.swap(1, 5);
            assert(() => !numbers1.equals(numbers2));
            numbers2.swap(1, 5);
            assert(() => numbers1.equals(numbers2));
            numbers2.swap(1, 5);
            numbers2.swap(5, 1);
            assert(() => numbers1.equals(numbers2));
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
            assert(() => !numbers1.equals(numbers2));
            assert(() => numbers1[0].number === 1);
            assert(() => numbers1[1].number === 2);
            assert(() => numbers1[2].number === 3);
            assert(() => numbers1[3].number === 4);
            assert(() => numbers1[4].number === 5);
            assert(() => numbers2[0].number === 5);
            assert(() => numbers2[1].number === 2);
            assert(() => numbers2[2].number === 3);
            assert(() => numbers2[3].number === 4);
            assert(() => numbers2[4].number === 1);
            sw.pop();
        }

        function testTake() {
            sw.push("Testing Array.take()");

            assert(() => [].take(-9).toArray().equals([]));
            assert(() => [].take(0).toArray().equals([]));
            assert(() => [].take(9).toArray().equals([]));

            var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            assert(() => array.take(-1).toArray().equals([]));
            assert(() => array.take(0).toArray().equals([]));
            assert(() => array.take(5).toArray().equals([1, 2, 3, 4, 5]));
            assert(() => array.take(6).toArray().equals([1, 2, 3, 4, 5, 6]));

            var obj1 = {id: 1, name: "object 1", func: a => a === 1};
            var obj2 = {id: 2, name: "object 2", func: a => a === 2};
            var obj3 = {id: 3, name: "object 3", func: a => a === 3};
            var obj4 = {id: 4, name: "object 4", func: a => a === 4};
            var arrayTake = [obj1, obj2, obj3, obj4];
            assert(() => arrayTake.take(1).toArray().equals([obj1]));
            assert(() => arrayTake.take(2).toArray().equals([obj1, obj2]));
            assert(() => arrayTake.take(3).toArray().equals([obj1, obj2, obj3]));
            assert(() => arrayTake.take(4).toArray().equals([obj1, obj2, obj3, obj4]));

            sw.pop();
        }

        function testWhere() {
            sw.push("Testing Array.where()");

            var result = queryable.where(x => x.id > 5).toArray();
            assert(() => result.length === 4);
            assert(() => result[0].id === 6 && result[0].data.equals([7, 8, 12]));
            assert(() => result[1].id === 7 && result[1].data === 1);
            assert(() => result[2].id === 8 && result[2].data === 2);
            assert(() => result[3].id === 9 && result[3].data.equals([1, 2, 3]) && result[3].other === "test property");
            result[3].id = -1;
            assert(() => result[3].id === -1 && queryable[8].id === -1); // ensure a shallow copy is being used by where

            result = queryable.where(x => x.id > 5).toArray(); // testing lambda string syntax
            assert(() => result.length === 3);
            assert(() => result[0].id === 6 && result[0].data.equals([7, 8, 12]));
            assert(() => result[1].id === 7 && result[1].data === 1);
            assert(() => result[2].id === 8 && result[2].data === 2);
            
            sw.pop();
        }

        function testZip() {
            sw.push("Testing Array.zip()");

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

            var zipped1 = arr1.zip(arr2, (x,y) => ({a: x.a, b: y.b})).toArray();
            assert(() => zipped1[0].a === 1);
            assert(() => zipped1[0].b === 4);
            assert(() => zipped1[1].a === 2);
            assert(() => zipped1[1].b === 5);
            assert(() => zipped1[2].a === 3);
            assert(() => zipped1[2].b === 6);

            var zipped2 = arr1.zip(arr2, (x,y) => x.smash(y)).toArray();
            assert(() => zipped1.equals(zipped2));

            sw.pop();
        }

        (function() {
            log("Testing Array extension methods");
            sw.push("Array extension methods tests");
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
            testZip();
            sw.pop();
        })();   
    }

    function testGeneratorExtensions() {

        var naturals = z.generators.numbers(0, 1).take(10);
        var evens = z.generators.numbers(0, 2).take(10);
        var odds = z.generators.numbers(1, 2).take(10);
        var letters = function*() {
            yield "a";
            yield "b";
            yield "c";
            yield "d";
            yield "e";
        };
        var factorial = z.generators.numbers(5, -1).take(5);
        var sentence = [
            "This",
            "is",
            "going",
            "to",
            "be",
            "a",
            "sentence!"
        ].asEnumerable();
        var objects = [
            { a: 1, b: "b", c: [1,2,3], d: null, e: undefined, f: () => true }
            , { a: 2, b: "b", c: [2,3,4], d: null, e: undefined, f: () => true }
            , { a: 3, b: "b", c: [3,4,5], d: null, e: undefined, f: () => true }
            , { a: 4, b: "b", c: [4,5,6], d: null, e: undefined, f: () => true }
            , { a: 5, b: "b", c: [5,6,7], d: null, e: undefined, f: () => true }
        ].asEnumerable();
        function* circular1() {
            yield { a: 1, b: "b", c: circular2 };
            yield { a: 2, b: "b", c: circular2 };
            yield { a: 3, b: "b", c: circular2 };
            yield { a: 4, b: "b", c: circular2 };
            yield { a: 5, b: "b", c: circular2 };
        }
        function* circular2() {
            yield {a: 1, b: "b", c: circular1 };
            yield {a: 2, b: "b", c: circular1 };
            yield {a: 3, b: "b", c: circular1 };
            yield {a: 4, b: "b", c: circular1 };
            yield {a: 5, b: "b", c: circular1 };
        }
        function* circular3() {
            yield {a: 1, b: "b", c: circular1 };
            yield {a: 2, b: "b", c: circular1 };
            yield {a: 3, b: "b", c: circular1 };
            yield {a: 4, b: "b", c: circular1 };
            yield {a: 6, b: "b", c: circular1 };
        }
        function* circular4() {
            yield {a: 1, b: "b", c: circular1 };
            yield {a: 2, b: "b", c: circular1 };
            yield {a: 3, b: "b", c: circular1 };
            yield {a: 4, b: "b", c: circular1 };
            yield {a: 6, b: "b", c: circular3 }; // note c: circular3
        }

        function* circularSelf(gen) {

            this.ref = gen;

            return function*() {
                yield {a: 1, b: "b", c: this.ref };
                yield {a: 2, b: "b", c: this.ref };
                yield {a: 3, b: "b", c: this.ref };
                yield {a: 4, b: "b", c: this.ref };
                yield {a: 8, b: "b", c: this.ref };
            }
        }

        function testAggregate() {
            sw.push("Testing Generator.aggregate()");
            assert(() => naturals.aggregate((x, y) => x + y) === 45);
            assert(() => naturals.aggregate((x, y) => x + y, 20) === 65);
            assert(() => letters.aggregate((x, y) => x + ", " + y) === "a, b, c, d, e");
            assert(() => sentence.aggregate((x, y) => x + " " + y) === "This is going to be a sentence!");
            assert(() => factorial.aggregate((x, y) => x * y) === 120);
            assert(() => 
                    [1, 2, 3, 4, 5].asEnumerable().aggregate((x, y) => x + y) 
                === [2, 3, 4, 5].asEnumerable().aggregate((x, y) => x + y, 1)
            );
            sw.pop();
        }

        function testAny() {
            sw.push("Testing Generator.any()");

            assert(() => naturals.any());
            assert(() => naturals.any(x => x > 8));
            assert(() => !naturals.any(x => x > 9));
            assert(() => !odds.any(x => x % 2 === 0));
            assert(() => odds.any(x => x % 2 === 1));
            assert(() => evens.any(x => x % 2 === 0));
            assert(() => !evens.any(x => x % 2 === 1));
            assert(() => !z.generators.empty.any());
            assert(() => !z.generators.empty.any(x => true));

            sw.pop();
        }

        function testConcat() {
            sw.push("Testing Generator.concat()");

            assert(() => z.generators.numbers(0,1).take(5).concat(z.generators.numbers(5,1).take(5)).equals(naturals));
            assert(() => evens.concat(odds).toArray().equals([0,2,4,6,8,10,12,14,16,18,1,3,5,7,9,11,13,15,17,19]));
            assert(() => objects.concat(objects).equals(objects.toArray().concat(objects.toArray()).asEnumerable())); // compare generator concat vs built in array concat
            assert(() => objects.concat(objects).toArray().equals(objects.toArray().concat(objects.toArray()))); // compare generator concat vs built in array concat

            sw.pop();
        }

        function testDeepCopy() {
            sw.push("Testing Generator.deepCopy()");

            var naturals2 = naturals.deepCopy();
            assert(() => naturals.equals(naturals2));
            assert(() => naturals2.equals(naturals));
            assert(() => naturals2.equals(naturals2));
            var objects2 = objects.deepCopy();
            assert(() => objects.equals(objects2));
            assert(() => objects2.equals(objects));
            assert(() => objects2.equals(objects2));

            var c1 = circular1.deepCopy();
            var c2 = circular2.deepCopy();
            var c3 = circular3.deepCopy();
            var c4 = circular4.deepCopy();
            assert(() => c1.equals(circular1));
            assert(() => c2.equals(circular2));
            assert(() => c3.equals(circular3));
            assert(() => c4.equals(circular4));
            assert(() => c1.equals(circular2));
            assert(() => !c1.equals(circular3));
            assert(() => !c1.equals(circular4));
            assert(() => c2.equals(circular1));
            assert(() => !c2.equals(circular3));
            assert(() => !c2.equals(circular4));
            assert(() => !c3.equals(circular1));
            assert(() => !c3.equals(circular2));
            assert(() => !c3.equals(circular4));
            assert(() => !c4.equals(circular1));
            assert(() => !c4.equals(circular2));
            assert(() => !c4.equals(circular3));
            assert(() => c1.equals(c2));
            assert(() => !c1.equals(c3));
            assert(() => !c1.equals(c4));
            assert(() => c2.equals(c1));
            assert(() => !c2.equals(c3));
            assert(() => !c2.equals(c4));
            assert(() => !c3.equals(c1));
            assert(() => !c3.equals(c2));
            assert(() => !c3.equals(c4));
            assert(() => !c4.equals(c1));
            assert(() => !c4.equals(c2));
            assert(() => !c4.equals(c3));
            sw.pop();
        }

        function testDistinct() {
            sw.push("Testing Generator.distinct()");

            assert(() => naturals.distinct().equals(naturals));
            assert(() => naturals.distinct(x => x).equals(naturals));
            assert(() => odds.distinct().equals(odds));
            assert(() => odds.distinct(x => x).equals(odds));
            assert(() => evens.distinct().equals(evens));
            assert(() => evens.distinct(x => x).equals(evens));
            assert(() => z.generators.numbers(1, 0).take(99).distinct().toArray().equals([1]));
            assert(() => objects.distinct(x => x.b).toArray().equals([{a: 1, b: "b", c: [1,2,3], d: null, e: undefined, f: () => true }]));
            assert(() => objects.distinct(x => x.a).equals(objects));

            sw.pop();
        }

        function testEquals() {
            sw.push("Testing Generator.equals()");

            var iter1 = [1,2,3,4,5].asEnumerable();
            assert(() => iter1.equals(iter1));
            assert(() => iter1().equals(iter1())); // test the self-reference expanded version

            var iter2 = [1,2,3,4,5].asEnumerable();
            assert(() => iter1.equals(iter2));
            assert(() => iter1().equals(iter2())); // test the non-self-reference expanded version

            var iter3 = [1,2,3,4].asEnumerable();
            assert(() => !iter3.equals(iter1));
            assert(() => !iter3.equals(iter2));
            assert(() => iter3.equals(iter3));

            var iter4 = [1,2,3,4,6].asEnumerable();
            assert(() => !iter4.equals(iter1));
            assert(() => !iter4.equals(iter2));
            assert(() => !iter4.equals(iter3));
            assert(() => iter4.equals(iter4));

            var iter5 = [
                { a: 1, b: "b", c: [1,2,3], d: null, e: undefined, f: () => true }
                , { a: 2, b: "b", c: [2,3,4], d: null, e: undefined, f: () => true }
                , { a: 3, b: "b", c: [3,4,5], d: null, e: undefined, f: () => true }
                , { a: 4, b: "b", c: [4,5,6], d: null, e: undefined, f: () => true }
                , { a: 5, b: "b", c: [5,6,7], d: null, e: undefined, f: () => true }
            ].asEnumerable();
            var iter6 = [
                { a: 1, b: "b", c: [1,2,3], d: null, e: undefined, f: () => true }
                , { a: 2, b: "b", c: [2,3,4], d: null, e: undefined, f: () => true }
                , { a: 3, b: "b", c: [3,4,5], d: null, e: undefined, f: () => true }
                , { a: 4, b: "b", c: [4,5,6], d: null, e: undefined, f: () => true }
                , { a: 5, b: "b", c: [5,6,7], d: null, e: undefined, f: () => true }
            ].asEnumerable();
            assert(() => iter5.equals(iter5));
            assert(() => iter6.equals(iter6));
            assert(() => iter5.equals(iter6));
            assert(() => iter5().equals(iter5()));
            assert(() => iter6().equals(iter6()));
            assert(() => iter5().equals(iter6()));

            sw.pop();
        }

        function testFirst() {
            sw.push("Testing Generator.first()");

            assert(() => z.generators.empty.first() === null);
            for (var i = 0; i < 1000; i++) {
                var start = z.generators.numbers.random(0, 100).first();
                var step = z.generators.numbers.random(0, 100).first();
                assert(() => z.generators.numbers(start, step).first() === start);                
            }
            assert(() => (objects.first().equals({ a: 1, b: "b", c: [1,2,3], d: null, e: undefined, f: () => true })));
            assert(() => (circular1.first().equals({ a: 1, b: "b", c: circular2 })));

            sw.pop();
        }

        function testInnerJoin() {
            // same tests as Array.innerJoin, just starting from the generator prototype extension
            sw.push("Testing Generator.innerJoin()");

            var gen1 = [
                {a: 1, b: 3 }
                , {a: 2, b: 4 }
            ].asEnumerable();
            var gen2 = [
                {a: 1, c: 5 }
                , {a: 2, c: 6 }
                , {a: 2, c: 7 }
                , {a: 2, c: 8 }
                , {a: 3, c: 9 }
            ].asEnumerable();
            var gen3 = [
                {d: 2, e: 10 }
                , {d: 3, e: 11 }
            ].asEnumerable();

            var joined = gen1.innerJoin(gen2).on((x,y) => x.a == y.a).toArray();
            assert(() => joined[0].equals({a: 1, b: 3, c: 5 }));
            assert(() => joined[1].equals({a: 2, b: 4, c: 6 }));
            assert(() => joined[2].equals({a: 2, b: 4, c: 7 }));
            assert(() => joined[3].equals({a: 2, b: 4, c: 8 }));

            var joined1 = gen1.innerJoin(gen2).on((x,y) => x.a == y.a).innerJoin(gen3).on((x,y) => x.a == y.d).toArray();
            assert(() => joined1[0].equals({a: 2, b: 4, c: 6, d: 2, e: 10 }));
            assert(() => joined1[1].equals({a: 2, b: 4, c: 7, d: 2, e: 10 }));
            assert(() => joined1[2].equals({a: 2, b: 4, c: 8, d: 2, e: 10 }));

            var joined2 = gen2.innerJoin(gen1).on((x,y) => x.a == y.a).innerJoin(gen3).on((x,y) => x.a == y.d).toArray();
            assert(() => z.equals(joined1, joined2));

            var joined3 = gen3.innerJoin(gen2).on((x,y) => x.d == y.a).innerJoin(gen1).on((x,y) => x.d == y.a).toArray();
            assert(() => z.equals(joined1, joined3));
            assert(() => z.equals(joined2, joined3));

            var joined4 = gen1.innerJoin(gen2).on((x,y) => x.a == x.c).toArray();
            assert(() => joined4 != null);
            assert(() => z.getType(joined4) === z.types.array);
            assert(() => joined4.length === 0);

            sw.pop();
        }

        function testLast() {
            sw.push("Testing Generator.last()");

            assert(() => naturals.last() === 9);
            assert(() => evens.last() === 18);
            assert(() => odds.last() === 19);
            assert(() => naturals.last(x => x < 8) === 7);
            assert(() => naturals.last(x => x < 9) === 8);
            assert(() => naturals.last(x => x % 2 === 0) === 8);
            assert(() => objects.last(x => x.a < 3).equals({ a: 2, b: "b", c: [2,3,4], d: null, e: undefined, f: () => true }));

            sw.pop();
        }

        function testMax() {
            sw.push("Testing Generator.max()");

            assert(() => naturals.max() === 9);
            assert(() => naturals.take(5).max() === 4);
            assert(() => naturals.skip(5).max() === 9);
            assert(() => z.generators.numbers.random(0,50).take(1000).max() <= 50);

            sw.pop();
        }

        function testMin() {
            sw.push("Testing Generator.min()");

            assert(() => naturals.min() === 0);
            assert(() => naturals.take(5).min() === 0);
            assert(() => naturals.skip(5).min() === 5);
            assert(() => z.generators.numbers.random(50,100).take(1000).min() >= 50);

            sw.pop();
        }

        function testOrderBy() {
            sw.push("Testing Generator.orderBy()");

            assert(() => naturals.orderBy(x => x).equals(naturals));
            assert(() => evens.orderBy(x => x).equals(evens));
            assert(() => odds.orderBy(x => x).equals(odds));
            assert(() => objects.orderBy(x => x.b).equals(objects)); // ensure stable sort
            assert(() => objects.reverse().orderBy(x => x.a).equals(objects));

            for (var i = 0; i < 100; i++) {
                var randoms = z.generators.numbers.random(0, 100).take(20).orderBy(x => x).toArray(); // note - the generators version of random is slower than the array version
                for (var k = 0; k < randoms.length-1; k++) {
                    assert(() => randoms[k] <= randoms[k+1]);
                }
            }
            var randoms = z.generators.numbers.random(0, 100).take(100).toArray();
            var ordered = [];
            for (var i = 0; i < 100; i++) {
                ordered.push({
                    id: randoms[i],
                    data: "data " + randoms[randoms[i]]
                });
            }
            ordered = ordered.asEnumerable().orderBy(x => x.id).toArray();
            for (var i = 0; i < 99; i++) {
                assert(() => ordered[i].id <= ordered[i+1].id);
            }

            sw.pop();
        }

        function testReverse() {
            sw.push("Testing Generator.reverse()");
            assert(() => naturals.reverse().toArray().equals([9,8,7,6,5,4,3,2,1,0]));
            assert(() => naturals.reverse().reverse().toArray().equals([0,1,2,3,4,5,6,7,8,9]));
            assert(() => naturals.reverse().reverse().reverse().toArray().equals([9,8,7,6,5,4,3,2,1,0]));
            assert(() => circular1.reverse().equals(circular1.reverse()));
            assert(() => circular1.reverse().equals(circular2.reverse()));
            assert(() => !circular1.reverse().equals(circular3.reverse()));
            assert(() => !circular1.reverse().equals(circular4.reverse()));
            sw.pop();
        }

        function testSelect() {
            sw.push("Testing Generator.select()");

            assert(() => naturals.select(x => x).equals(naturals));
            assert(() => naturals.select(x => x*2).equals(evens));
            assert(() => naturals.select(x => x*2+1).equals(odds));
            var newObjects = naturals.take(5).select(x => (// object literals as returns need parentheses in arrow functions
                { // build the objects generator by manipulating the naturals generator
                    a: x+1,
                    b: "b",
                    c: [x+1, x+2, x+3],
                    d: null,
                    e: undefined,
                    f: () => true
                }
            ));
            assert(() => newObjects.equals(objects));

            sw.pop();
        }

        function testSkip() {
            sw.push("Testing Generator.skip()");

            assert(() => z.generators.empty.skip(-9).toArray().equals([]));
            assert(() => z.generators.empty.skip(0).toArray().equals([]));
            assert(() => z.generators.empty.skip(9).toArray().equals([]));
            assert(() => naturals.skip(-1).toArray().equals(naturals.toArray()));
            assert(() => naturals.skip(0).toArray().equals(naturals.toArray()));
            assert(() => naturals.skip(5).toArray().equals([5,6,7,8,9]));
            assert(() => z.generators.numbers.whole.take(9999999).skip(5).take(3).toArray().equals([5,6,7]));
            assert(() => naturals.skip(5).equals(naturals.skip(1).skip(1).skip(1).skip(1).skip(1)));

            sw.pop();
        }

        function testSum() {
            sw.push("Testing Generator.sum()");

            assert(() => naturals.sum() === 45);
            assert(() => odds.sum() === 100);
            assert(() => evens.sum() === 90);
            assert(() => objects.sum() === 0); // can't sum objects without a selector
            assert(() => objects.sum(x => x.a) === 15);
            assert(() => objects.sum(x => x.c) === 0); // no recursive sum for array properties (yet?)

            sw.pop();
        }

        function testTake() {
            sw.push("Testing Generator.take()");

            assert(() => z.generators.empty.take(-9).toArray().equals([]));
            assert(() => z.generators.empty.take(0).toArray().equals([]));
            assert(() => z.generators.empty.take(9).toArray().equals([]));
            assert(() => naturals.take(-1).toArray().equals([]));
            assert(() => naturals.take(0).toArray().equals([]));
            assert(() => naturals.take(3).toArray().equals([0,1,2]));
            assert(() => z.generators.numbers.whole.take(9999999).take(3).toArray().equals([0,1,2]));
            assert(() => naturals.take(5).equals(naturals.take(9).take(8).take(7).take(6).take(5).take(5)));

            sw.pop();
        }

        function testThenBy() {
            sw.push("Testing Generator.thenBy()");

            var original = [
                { id: 0,  a: 1, b: "b", c: 3, d: 8 },
                { id: 1,  a: 1, b: "b", c: 3, d: 8 },
                { id: 2,  a: 1, b: "b", c: 6, d: 9 },
                { id: 3,  a: 1, b: "b", c: 3, d: 9 },
                { id: 4,  a: 1, b: "b", c: 3, d: 9 },
                { id: 5,  a: 2, b: "b", c: 6, d: 8 },
                { id: 6,  a: 2, b: "b", c: 4, d: 9 },
                { id: 7,  a: 2, b: "b", c: 6, d: 9 },
                { id: 8,  a: 2, b: "b", c: 6, d: 9 },
                { id: 9, a: 2, b: "b", c: 4, d: 8 },
                { id: 10, a: 2, b: "b", c: 3, d: 9 },
                { id: 11, a: 2, b: "b", c: 4, d: 9 },
                { id: 12, a: 2, b: "b", c: 3, d: 8 },
                { id: 13, a: 2, b: "b", c: 4, d: 8 },
                { id: 14, a: 1, b: "b", c: 6, d: 8 },
                { id: 15, a: 1, b: "b", c: 6, d: 9 },
                { id: 16, a: 1, b: "b", c: 6, d: 9 },
                { id: 17, a: 1, b: "b", c: 4, d: 9 },
                { id: 18, a: 1, b: "b", c: 3, d: 8 },
            ].asEnumerable();
            var ordered;

            ordered = original.orderBy(x => x.a).toArray();
            assert(() => ordered[0].a  === 1);
            assert(() => ordered[1].a  === 1);
            assert(() => ordered[2].a  === 1);
            assert(() => ordered[3].a  === 1);
            assert(() => ordered[4].a  === 1);
            assert(() => ordered[5].a  === 1);
            assert(() => ordered[6].a  === 1);
            assert(() => ordered[7].a  === 1);
            assert(() => ordered[8].a  === 1);
            assert(() => ordered[9].a  === 1);
            assert(() => ordered[10].a === 2);
            assert(() => ordered[11].a === 2);
            assert(() => ordered[12].a === 2);
            assert(() => ordered[13].a === 2);
            assert(() => ordered[14].a === 2);
            assert(() => ordered[15].a === 2);
            assert(() => ordered[16].a === 2);
            assert(() => ordered[17].a === 2);
            assert(() => ordered[18].a === 2);

            ordered = original.orderBy(x => x.a).thenBy(x => x.b).toArray();
            assert(() => ordered[0].a  === 1 && ordered[0].b  === "b");
            assert(() => ordered[1].a  === 1 && ordered[1].b  === "b");
            assert(() => ordered[2].a  === 1 && ordered[2].b  === "b");
            assert(() => ordered[3].a  === 1 && ordered[3].b  === "b");
            assert(() => ordered[4].a  === 1 && ordered[4].b  === "b");
            assert(() => ordered[5].a  === 1 && ordered[5].b  === "b");
            assert(() => ordered[6].a  === 1 && ordered[6].b  === "b");
            assert(() => ordered[7].a  === 1 && ordered[7].b  === "b");
            assert(() => ordered[8].a  === 1 && ordered[8].b  === "b");
            assert(() => ordered[9].a  === 1 && ordered[9].b  === "b");
            assert(() => ordered[10].a === 2 && ordered[10].b === "b");
            assert(() => ordered[11].a === 2 && ordered[11].b === "b");
            assert(() => ordered[12].a === 2 && ordered[12].b === "b");
            assert(() => ordered[13].a === 2 && ordered[13].b === "b");
            assert(() => ordered[14].a === 2 && ordered[14].b === "b");
            assert(() => ordered[15].a === 2 && ordered[15].b === "b");
            assert(() => ordered[16].a === 2 && ordered[16].b === "b");
            assert(() => ordered[17].a === 2 && ordered[17].b === "b");
            assert(() => ordered[18].a === 2 && ordered[18].b === "b");

            ordered = original.orderBy(x => x.a).thenBy(x => x.b).thenBy(x => x.c).toArray();
            assert(() => ordered[0].a  === 1 && ordered[0].b  === "b" && ordered[0].c  === 3);
            assert(() => ordered[1].a  === 1 && ordered[1].b  === "b" && ordered[1].c  === 3);
            assert(() => ordered[2].a  === 1 && ordered[2].b  === "b" && ordered[2].c  === 3);
            assert(() => ordered[3].a  === 1 && ordered[3].b  === "b" && ordered[3].c  === 3);
            assert(() => ordered[4].a  === 1 && ordered[4].b  === "b" && ordered[4].c  === 3);
            assert(() => ordered[5].a  === 1 && ordered[5].b  === "b" && ordered[5].c  === 4);
            assert(() => ordered[6].a  === 1 && ordered[6].b  === "b" && ordered[6].c  === 6);
            assert(() => ordered[7].a  === 1 && ordered[7].b  === "b" && ordered[7].c  === 6);
            assert(() => ordered[8].a  === 1 && ordered[8].b  === "b" && ordered[8].c  === 6);
            assert(() => ordered[9].a  === 1 && ordered[9].b  === "b" && ordered[9].c  === 6);
            assert(() => ordered[10].a === 2 && ordered[10].b === "b" && ordered[10].c === 3);
            assert(() => ordered[11].a === 2 && ordered[11].b === "b" && ordered[11].c === 3);
            assert(() => ordered[12].a === 2 && ordered[12].b === "b" && ordered[12].c === 4);
            assert(() => ordered[13].a === 2 && ordered[13].b === "b" && ordered[13].c === 4);
            assert(() => ordered[14].a === 2 && ordered[14].b === "b" && ordered[14].c === 4);
            assert(() => ordered[15].a === 2 && ordered[15].b === "b" && ordered[15].c === 4);
            assert(() => ordered[16].a === 2 && ordered[16].b === "b" && ordered[16].c === 6);
            assert(() => ordered[17].a === 2 && ordered[17].b === "b" && ordered[17].c === 6);
            assert(() => ordered[18].a === 2 && ordered[18].b === "b" && ordered[18].c === 6);

            ordered = original.orderBy(x => x.a).thenBy(x => x.b).thenBy(x => x.c).thenBy(x => x.d).toArray();
            assert(() => ordered[0].a  === 1 && ordered[0].b  === "b" && ordered[0].c  === 3 && ordered[0].d  === 8);
            assert(() => ordered[1].a  === 1 && ordered[1].b  === "b" && ordered[1].c  === 3 && ordered[1].d  === 8);
            assert(() => ordered[2].a  === 1 && ordered[2].b  === "b" && ordered[2].c  === 3 && ordered[2].d  === 8);
            assert(() => ordered[3].a  === 1 && ordered[3].b  === "b" && ordered[3].c  === 3 && ordered[3].d  === 9);
            assert(() => ordered[4].a  === 1 && ordered[4].b  === "b" && ordered[4].c  === 3 && ordered[4].d  === 9);
            assert(() => ordered[5].a  === 1 && ordered[5].b  === "b" && ordered[5].c  === 4 && ordered[5].d  === 9);
            assert(() => ordered[6].a  === 1 && ordered[6].b  === "b" && ordered[6].c  === 6 && ordered[6].d  === 8);
            assert(() => ordered[7].a  === 1 && ordered[7].b  === "b" && ordered[7].c  === 6 && ordered[7].d  === 9);
            assert(() => ordered[8].a  === 1 && ordered[8].b  === "b" && ordered[8].c  === 6 && ordered[8].d  === 9);
            assert(() => ordered[9].a  === 1 && ordered[9].b  === "b" && ordered[9].c  === 6 && ordered[9].d  === 9);
            assert(() => ordered[10].a === 2 && ordered[10].b === "b" && ordered[10].c === 3 && ordered[10].d === 8);
            assert(() => ordered[11].a === 2 && ordered[11].b === "b" && ordered[11].c === 3 && ordered[11].d === 9);
            assert(() => ordered[12].a === 2 && ordered[12].b === "b" && ordered[12].c === 4 && ordered[12].d === 8);
            assert(() => ordered[13].a === 2 && ordered[13].b === "b" && ordered[13].c === 4 && ordered[13].d === 8);
            assert(() => ordered[14].a === 2 && ordered[14].b === "b" && ordered[14].c === 4 && ordered[14].d === 9);
            assert(() => ordered[15].a === 2 && ordered[15].b === "b" && ordered[15].c === 4 && ordered[15].d === 9);
            assert(() => ordered[16].a === 2 && ordered[16].b === "b" && ordered[16].c === 6 && ordered[16].d === 8);
            assert(() => ordered[17].a === 2 && ordered[17].b === "b" && ordered[17].c === 6 && ordered[17].d === 9);
            assert(() => ordered[18].a === 2 && ordered[18].b === "b" && ordered[18].c === 6 && ordered[18].d === 9);

            sw.pop();
        }

        function testWhere() {
            sw.push("Testing Generator.where()");
            
            assert(() => naturals.where(x => x > 3).toArray().equals([4, 5, 6, 7, 8, 9]));
            assert(() => naturals.where(x => x > 3).where(x => x < 8).toArray().equals([4, 5, 6, 7]));
            assert(() => odds.where(x => x % 2 === 0).toArray().equals([]));
            assert(() => odds.where(x => x % 2 === 1).equals(odds));
            assert(() => circular1.where(x => x.a === 1).equals(function*() { yield { a: 1, b: "b", c: circular2 }; } ));

            sw.pop();
        }

        function testZip() {
            sw.push("Testing Generator.zip()");

            var zipped, i;

            i = 1;
            for (var v of evens.zip(odds, (x, y) => x + y)) {
                assert(() => v === i);
                i += 4;
            }

            i = 0;
            for (var v of naturals.zip(naturals, (x,y) => x*y)) {
                assert(() => v === Math.pow(i, 2));
                i += 1;
            }

            i = 1
            for (var v of objects.zip(objects, (x,y) => ({xa: x.a, ya: y.a, xb: x.b, yb: y.b, xya: x.a + y.a, xyb: x.b + y.b}) )) {
                assert(
                    () =>
                            v.xa === i
                        &&  v.ya === i
                        &&  v.xb === "b"
                        &&  v.yb === "b"
                        &&  v.xya === i+i
                        &&  v.xyb === "bb"
                );
                i += 1;
            }

            sw.pop();
        }

        (function() {
            log("Testing Generator extension methods");
            sw.push("Generator extension methods tests");
            testAggregate();
            testAny();
            testConcat();
            testDeepCopy();
            testDistinct();
            testEquals();
            testFirst();
            testInnerJoin();
            testLast();
            testMax();
            testMin();
            testOrderBy();
            testReverse();
            testSelect();
            testSkip();
            testSum();
            testTake();
            testThenBy();
            testWhere();
            testZip();
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
            assert(() => obj1.equals(obj2));
            var obj3 = obj1.deepCopy();
            obj3.data.numbers.push(4);
            assert(() => !obj1.equals(obj3));
            var obj4 = obj1.deepCopy();
            obj4.id = 4;
            assert(() => !obj1.equals(obj4));
            var obj5 = obj1.deepCopy();
            obj5.data.regexp.prop = false;
            assert(() => !obj1.equals(obj5));

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
            assert(() => c1.equals(c2));
            c2.data.push(4);
            assert(() => !c1.equals(c2));

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
            assert(() => c1.equals(c2));
            c2.item = "item2";
            assert(() => !c1.equals(c2));
            var c3 = c1.deepCopy();
            c3.cycle.cycle.cycle.cycle.item = "item3";
            assert(() => !c1.equals(c3));

            // test cyclical objects which don't contain a direct self-reference
            c1 = new cyclical("item1")
            c2 = new cyclical("item2");
            c1.cycle = c2;
            c2.cycle = c1;
            var c3 = c1.deepCopy();
            var c4 = c2.deepCopy();
            assert(() => c1.equals(c3));
            assert(() => !c1.equals(c2));
            assert(() => c2.equals(c4));
            assert(() => !c3.equals(c4));
            c3.item = "item3";
            assert(() => !c1.equals(c3));
            c1.item = "item3";
            assert(() => c1.equals(c3));
            c3.cycle.item = "item4";
            c4.item = "item4";
            c4.cycle.item = "item3";
            assert(() => !c3.equals(c4));
            c4.item = "item3";
            c4.cycle.item = "item4";
            assert(() => c3.equals(c4));
            c4.date.date = c4.date; // cyclic date reference
            var c5 = c4.deepCopy();
            assert(() => c4.equals(c5));
            c5.date.date = new Date("1999-12-30");
            assert(() => !c4.equals(c5));
            c5.regexp.regexp = c5.regexp; // cyclic regexp reference
            var c6 = c5.deepCopy();
            assert(() => c5.equals(c6));
            c6.regexp.regexp = new RegExp("RegExp2", "g");
            assert(() => !c5.equals(c6));

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
            assert(() => c3.equals(c4));

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
            assert(() => c1.equals(c2));
            assert(() => c1.equals(c3));
            assert(() => c1.equals(c4));

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
            assert(() => !c1.equals(c2));
            assert(() => c1.equals(c3));
            assert(() => !c2.equals(c3));
            assert(() => c2.equals(c4));
            assert(() => c5.equals(c3));
            assert(() => !c5.equals(c6));
            assert(() => c4.equals(c6));

            sw.pop();
        }

        function testEquals() {
            sw.push("Testing Object.equals()");
            var obj1 = { id: 1, data: [1, 2, 3]};
            var obj2 = { id: 1, data: [4, 5, 6]};
            var obj3 = { id: 1, data: [7, 8, 9]};
            var obj4 = { id: 1, data: [1, 2, 3]};
            assert(() => !obj1.equals(obj2));
            assert(() => !obj1.equals(obj3));
            assert(() => obj1.equals(obj4));

            obj1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }};
            obj2 = { id: 1, data: { numbers: [1, 2, 3], data2: undefined, data3: undefined }};
            obj3 = { id: 1, data: { numbers: [1, 2, 3], data2: 1, data3: undefined }};
            obj4 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }};
            assert(() =>!obj1.equals(obj2));
            assert(() =>!obj1.equals(obj3));
            assert(() =>obj1.equals(obj4));

            obj1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }};
            obj2 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: null }};
            obj3 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: 1 }};
            obj4 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }};
            assert(() => !obj1.equals(obj2));
            assert(() => !obj1.equals(obj3));
            assert(() => obj1.equals(obj4));

            obj1 = obj2 = obj3 = obj4;
            assert(() => obj1.equals(obj2));
            assert(() => obj1.equals(obj3));
            assert(() => obj1.equals(obj4));

            obj1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: a => { this.id = a; }};
            obj2 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: b => { this.id = b; }}; // note function inequality here
            obj3 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: a => { this.id = !a; }};
            obj4 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: a => { this.id = a; }};
            assert(() => !obj1.equals(obj2));
            assert(() => !obj1.equals(obj3));
            assert(() => obj1.equals(obj4));

            obj1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined }, func: a => { this.id = a; }};
            obj2 = { id: 1, data: { numbers: 4,         data2: null, data3: undefined}, func: a => { this.id = a; }};
            obj3 = { id: 1, data: { numbers: {num: 1},  data2: null, data3: undefined}, func: a => { this.id = a; }};
            obj4 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: a => { this.id = a; }};
            assert(() => !obj1.equals(obj2));
            assert(() => !obj1.equals(obj3));
            assert(() => obj1.equals(obj4));

            assert(() => (new Date("1999-12-31").equals(new Date("1999-12-31"))));
            assert(() => !(new Date("1999-12-31").equals(new Date("1999-12-30"))));
            var d1 = new Date("1999-12-31");
            d1.func = a => { this.prop = a; };
            d1.func("something");
            var d2 = new Date("1999-12-31");
            d2.func = a => { this.prop = a; };
            d2.func("something");
            assert(() => d1.equals(d1));
            assert(() => d1.equals(d2));
            assert(() => d2.equals(d1));

            var a = {a: 'text', b:[0,1]};
            var b = {a: 'text', b:[0,1]};
            var c = {a: 'text', b: 0};
            var d = {a: 'text', b: false};
            var e = {a: 'text', b:[1,0]};
            var f = {a: 'text', b:[1,0], f: () => { this.f = this.b; }};
            var g = {a: 'text', b:[1,0], f: () => { this.f = this.b; }};
            var h = {a: 'text', b:[1,0], f: () => { this.a = this.b; }};
            var i = {
                a: 'text',
                c: {
                    b: [1, 0],
                    f: () => { this.a = this.b; }
                }
            };
            var j = {
                a: 'text',
                c: {
                    b: [1, 0],
                    f: () => { this.a = this.b; }
                }
            };
            var k = {a: 'text', b: null};
            var l = {a: 'text', b: undefined};
            assert(() => a.equals(b));
            assert(() => !a.equals(c));
            assert(() => !c.equals(d));
            assert(() => !a.equals(e));
            assert(() => f.equals(g));
            assert(() => !h.equals(g));
            assert(() => i.equals(j));
            assert(() => !d.equals(k));
            assert(() => !k.equals(l));

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
            assert(() => !c1.equals(c2));
            assert(() => c1.equals(c3));
            assert(() => !c1.equals(c4));
            assert(() => !c1.equals(c5));
            assert(() => c5.equals(c6));

            var c7 = new custom();
            c7.recurse = c7; // circular reference to self
            var c8 = new custom();
            var c9 = new custom();
            c8.recurse = c9; // circular reference with multiple objects
            c9.recurse = c8; // circular reference with multiple objects
            assert(() => c7.equals(c7));
            assert(() => c8.equals(c9));
            assert(() => c9.equals(c8));

            // check that we can still get inequality with circular objects
            // especially with properties added after the circular reference
            c8.second = "c8";
            c9.second = "c9";
            assert(() => !c8.equals(c9));
            assert(() => !c9.equals(c8));

            var shuffled1, shuffled2, shuffled3, shuffled4;
            shuffled1 = { a: 1, b: 2, c: 3 };
            shuffled2 = { b: 2, a: 1, c: 3};
            assert(() => shuffled1.equals(shuffled2));
            shuffled1 = { id: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: a => { this.id = a; } };
            shuffled2 = { data: { numbers: [1, 2, 3], data2: null, data3: undefined}, id: 1, func: a => { this.id = a; } };
            shuffled3 = { func: a => { this.id = a; }, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, id: 1 };
            shuffled4 = { func: a => { this.id = a; }, data: { data2: null, numbers: [1, 2, 3], data3: undefined}, id: 1 };
            assert(() => shuffled1.equals(shuffled2));
            assert(() => shuffled1.equals(shuffled3));
            assert(() => shuffled1.equals(shuffled4));

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
            assert(() => !c1.equals(c2));
            assert(() => c1.equals(c3));
            assert(() => !c2.equals(c3));
            assert(() => c2.equals(c4));
            assert(() => c5.equals(c3));
            assert(() => !c5.equals(c6));
            assert(() => c4.equals(c6));
            assert(() => !c4.equals(c5));

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
            assert(() => !c1.equals(c2));
            assert(() => !c1.equals(c3));
            assert(() => c1.equals(c4));
            assert(() => !c1.equals(c5));
            assert(() => !c1.equals(c6));

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
            assert(() => c1.equals(c2));
            assert(() => c1.equals(c3));
            assert(() => c1.equals(c4));
            assert(() => c1.equals(c5));
            assert(() => c1.equals(c6));

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

            assert(() => z.equals(left.smash(center, right), center.smash(left, right)));
            assert(() => z.equals(center.smash(left, right), right.smash(center, left)));
            assert(() => z.equals(right.smash(center, left), left.smash(center, right)));

            // ensure duplicate properties are being overwritten on the smashed object
            assert(() => !z.equals(left.smash(center, right), center.smash(left, right, duplicates)));
            assert(() => !z.equals(center.smash(left, right), right.smash(center, left, duplicates)));
            assert(() => !z.equals(right.smash(center, left), left.smash(center, right, duplicates)));

            var obj1 = { num: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: a => this.id = a };
            var obj2 = { num: 2, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: a => this.id = a, func2: b => this.num === b };
            var obj3 = { num: 3, data: { numbers: [1, 2, 3], data2: null, data3: undefined, data4: "data4"}, func: a => this.id = a };

            smashed = obj1.smash(obj2);
            assert(() => smashed.num === 2);
            assert(() => z.equals(smashed.data.numbers, [1,2,3]));
            assert(() => z.equals(smashed.data.data2, null));
            assert(() => z.equals(smashed.data.data3, undefined));
            assert(() => z.equals(smashed.func, a => this.id = a));
            assert(() => z.equals(smashed.func2, b => this.num === b));
            
            smashed = smashed.smash(obj3);
            assert(() => smashed.num === 3);
            assert(() => z.equals(smashed.data.numbers, [1,2,3]));
            assert(() => z.equals(smashed.data.data2, null));
            assert(() => z.equals(smashed.data.data3, undefined));
            assert(() => z.equals(smashed.data.data4, "data4"));
            assert(() => z.equals(smashed.func, a => this.id = a));
            assert(() => z.equals(smashed.func2, b => this.num === b));

            var obj4 = {
                arr1: [
                    {a: 1}
                    , {a: 2}
                    , {a: 3}
                ],
                arr2: [
                    { num: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: a => this.id = a }
                    , { num: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: a => this.id = a }
                    , { num: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: a => this.id = a }
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
                    { num: 1, data: { numbers: [1, 2, 3], data2: null, data3: undefined}, func: a => this.id = a }
                    , { num: 1, data: { numbers: [4, 5, 6, 7, 8], data2: null, data3: undefined}, func: a => this.id = a }
                    , { num: 1, data: { numbers: [9, 10], data2: undefined, data3: null, data4: "data4"}, func: a => this.id = a }
                ]
            };
            smashed = obj4.smash(obj5, obj4, obj5, obj4, obj4, obj5);
            assert(() => smashed.arr1[0].a === 1);
            assert(() => smashed.arr1[1].a === 2);
            assert(() => smashed.arr1[2].a === 3);
            assert(() => smashed.arr1[0].b === 4);
            assert(() => smashed.arr1[1].b === 5);
            assert(() => smashed.arr1[2].b === 6);
            assert(() => smashed.arr2[0].num === 1);
            assert(() => smashed.arr2[1].num === 1);
            assert(() => smashed.arr2[2].num === 1);
            assert(() => smashed.arr2[0].data.numbers.equals([1,2,3]));
            assert(() => smashed.arr2[1].data.numbers.equals([4,5,6,7,8]));
            assert(() => smashed.arr2[2].data.numbers.equals([9,10,3])); // note the 3: is this the functionality we want? editing arrays, but not overwriting the whole thing?
            assert(() => smashed.arr2[0].data.data2 === null);
            assert(() => smashed.arr2[1].data.data2 === null);
            assert(() => smashed.arr2[2].data.data2 === undefined);
            assert(() => smashed.arr2[0].data.data3 === undefined);
            assert(() => smashed.arr2[1].data.data3 === undefined);
            assert(() => smashed.arr2[2].data.data3 === null);
            assert(() => smashed.arr2[0].data.data4 === undefined);
            assert(() => smashed.arr2[1].data.data4 === undefined);
            assert(() => smashed.arr2[2].data.data4 === "data4");
            assert(() => z.equals(smashed.arr2[0].func, a => this.id = a));
            assert(() => z.equals(smashed.arr2[1].func, a => this.id = a));
            assert(() => z.equals(smashed.arr2[2].func, a => this.id = a));
            assert(() => smashed.arr2[3].num === 2); // ensure this doesn't get overwritten? or should it?

            sw.pop();
        }

        (function() {
            log.log("Testing Object extension methods");
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
            events.on("tester", () => { obj["key"] = "value"});
            events.call("tester");
            assert(() => obj.key != null && obj.key === "value");
            events.clear("tester");
            sw.pop();
        }

        function testChainedEvents() {
            sw.push("Testing chained events");
            var events = new z.classes.Events();
            var arr = [];
            var num = 0;
            events.on("tester", () => { arr.push(++num) });
            events.on("tester", () => { arr.push(++num) });
            events.on("tester", () => { arr.push(++num) });
            events.on("tester", () => { arr.push(++num) });
            for (var i = 0; i < 5; i++) {
                events.call("tester");
            }
            assert(() => arr.length === 20);
            for (var i = 0; i < arr.length; i++) {
                assert(() => arr[i] === i+1);
            }
            events.clear("tester");

            events.on("1", (x) => { events.call("2")});
            events.on("2", (x) => { events.call("3")});
            events.on("3", (x) => { events.call("4")});
            events.on("4", (x) => { arr.push(arr.max()+1)});
            events.call("1");
            assert(() => arr.length === 21);
            for (var i = 0; i < arr.length; i++) {
                assert(() => arr[i] === i+1);
            }
            events.clear("tester");
            
            sw.pop();
        }

        function testDeregisterEvent() {
            sw.push("Testing event deregistration");
            var events = new z.classes.Events();
            var obj = {};
            var deregisterFunc = events.on("tester", () => { obj.key = "value" } );
            events.call("tester");
            assert(() => obj.key && obj.key === "value");
            obj.key = "new_value";
            deregisterFunc();
            events.call("tester");
            assert(() => obj.key && obj.key === "new_value");

            var deregister1 = events.on("tester", () => { obj.key = "value1" } );
            var deregister2 = events.on("tester", () => { obj.key = "value2" } );
            var deregister3 = events.on("tester", () => { obj.key = "value3" } );
            events.call("tester");
            assert(() => obj.key && obj.key === "value3");
            deregister3();
            events.call("tester");
            assert(() => obj.key && obj.key === "value2");
            deregister2();
            events.call("tester");
            assert(() => obj.key && obj.key === "value1");
            deregister1();
            events.call("tester");
            assert(() => obj.key && obj.key === "value1");

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

            events.on("tester", (x) => { obj.upper = "UPPER: " + x.toUpperCase() });
            events.on("tester", (x) => { obj.lower = "LOWER: " + x.toLowerCase() });
            events.on("tester", (x) => { obj.original = "ORIGINAL: " + x });
            events.call("tester", string);
            assert(() => obj.upper === "UPPER: " + string.toUpperCase());
            assert(() => obj.lower === "LOWER: " + string.toLowerCase());
            assert(() => obj.original === "ORIGINAL: " + string);
            events.clear("tester");

            events.on("tester", (x, y) => { x.a = y });
            events.on("tester", (x, y) => { x.b = y+1 });
            events.on("tester", (x, y) => { x.c = y*2 });
            events.call("tester", obj, num);
            assert(() => obj.upper === "UPPER: " + string.toUpperCase());
            assert(() => obj.lower === "LOWER: " + string.toLowerCase());
            assert(() => obj.original === "ORIGINAL: " + string);
            assert(() => obj.a === num);
            assert(() => obj.b === num+1);
            assert(() => obj.c === num*2);
            events.clear("tester");

            events.on("tester", (x, y, z) => { x.d = y });
            events.on("tester", (x, y, z) => { x.e = y+z });
            events.on("tester", (x, y, z) => { x.f = y*z });
            events.call("tester", obj, num, num2);
            assert(() => obj.upper === "UPPER: " + string.toUpperCase());
            assert(() => obj.lower === "LOWER: " + string.toLowerCase());
            assert(() => obj.original === "ORIGINAL: " + string);
            assert(() => obj.a === num);
            assert(() => obj.b === num+1);
            assert(() => obj.c === num*2);
            assert(() => obj.d === num);
            assert(() => obj.e === num+num2);
            assert(() => obj.f === num*num2);

            sw.pop();
        }

        (function() {
            log("Testing Events methods");
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
        log = z.log;
        assert = z.assert;
        sw = z.sw;

        log("Running Unit Tests");
        sw.push("Running Unit Tests");

        testArrayExtensions();
        testGeneratorExtensions();
        testObjectExtensions();
        testEvents();

        sw.pop();

        // var promise = new Promise(function(resolve, reject) {
        //     reject("rejection!");
        //     resolve("resolution!");
        // });
        // promise
        // .then(function(newvar) {
        //     log(newvar1);
        // })
        // .catch(function(errvar) {
        //     log(errvar);
        // });
    }

    z.runUnitTests = runUnitTests;
}(zUtil.prototype));