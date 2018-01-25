(function () {
    'use strict';

    angular.module('openVPNStatusMonitor').controller('ViewController', function ($scope, $timeout) {
        var LZW = {
            compress: function (uncompressed) {
                var i,
                    dictionaryBase = [],
                    dictionary = {},
                    c,
                    wc,
                    w = "",
                    result = [],
                    dictSize,
                    baseDictSize;
                dictionaryBase = uncompressed.split('').filter(function onlyUnique(value, index, self) {
                    return self.indexOf(value) === index;
                });
                for (i = 0; i < dictionaryBase.length; i += 1) {
                    dictionary[dictionaryBase[i]] = i;
                }
                baseDictSize = dictionaryBase.length;
                dictSize = dictionaryBase.length;
                for (i = 0; i < uncompressed.length; i += 1) {
                    c = uncompressed.charAt(i);
                    wc = w + c;
                    if (dictionary.hasOwnProperty(wc)) {
                        w = wc;
                    } else {
                        result.push(dictionary[w]);
                        // Add wc to the dictionary.
                        dictionary[wc] = dictSize++;
                        w = String(c);
                    }
                }
                if (w !== "") {
                    result.push(dictionary[w]);
                }
                return {
                    result:       result,
                    dictionary:   dictionary,
                    baseDictSize: baseDictSize
                };
            }
        };
        $scope.data = 'AABBBBAACCDDDDDDDCC';
        $scope.genEntryStyle = function (entry) {
            return {
                display: 'inline-block',
                width:   ((Math.floor(entry.value.length / 4) + 1) * 48) + 'px'
            }
        };
        $scope.compress = function () {
            if ($scope.data && $scope.data.length > 0) {
                var result = LZW.compress($scope.data);
                var dictionary = [];
                for (var key in result['dictionary']) {
                    // noinspection JSUnfilteredForInLoop
                    dictionary.push({
                        id:    result['dictionary'][key],
                        value: key
                    })
                }
                $scope.result = {
                    result:     result.result,
                    dictionary: {
                        base:     dictionary.slice(0, result.baseDictSize),
                        extended: dictionary.slice(result.baseDictSize)
                    }
                };
                console.log($scope.result);
            }
        };
    });

})();
