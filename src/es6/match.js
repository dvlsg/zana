/*
    @license
    Copyright (C) 2014 Dave Lesage
    License: MIT
    See license.txt for full license text.
*/
(function(z, undefined) {

    /**
        Searches the array for items which either exist, or match a given predicate.
        Note: This functionality can be replicated more easily with Array.Where(predicate).
        
        @this {Array}
        @param {function} [predicate] A predicate used to find matches for the array. This function should return a truthy value.
        @returns True if at least one item is found which exists or matches the given predicate, else false.
     */
    z.match = function(arr, obj) {
        var r = [];
        if (!obj || z.getType(obj) !== z.types.object) {
            return r;
        }
        if (!arr || z.getType(arr) !== z.types.array || arr.length < 1) {
            return r;
        }
        var givenPropertiesLength = Object.keys(obj).length;
        if (givenPropertiesLength < 1) {
            return r;
        }
        var propertyMatchCount;
        for (var i = 0; i < arr.length; i++) {
            propertyMatchCount = 0;
            for (var p in obj) {
                var arrItem = arr[i][p];
                var objItem = obj[p];
                if (_search(arrItem, objItem)) {
                    propertyMatchCount++;
                }
            }
            if (propertyMatchCount === givenPropertiesLength) {
                r.push(arr[i]);
            }
        }
        return r;
    }

    var _search = function (item1, item2) {
        if ((z.getType(item1) === z.types.array)) {
            if (!(z.getType(item2) === z.types.array)) {
                // convert to array
                // allow users to enter in items such as this -- { data: 1 }
                // to match arrays such as this -- { data: [ 1, 2, 3, ] }
                item2 = [item2];
            }
            return _searchArrayByArray(item1, item2);
        }
        return (item1 === item2);
    }

    var _searchArrayByArray = function(arrToSearch, arrToMatch) {
        for (var i = 0; i < arrToMatch.length; i++) {
            if (!arrToSearch.contains(arrToMatch[i])) {
                return false;
            }
        }
        return true;
    }

}(zUtil.prototype));