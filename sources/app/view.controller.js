(function () {
    'use strict';

    angular.module('openVPNStatusMonitor').controller('ViewController', function ($scope) {
        function LZWW(uncompressed) {
            var i = 0,
                dictionaryBase = [],
                dictionary = {},
                c,
                wc,
                w = "",
                result = [],
                dictSize = 0,
                baseDictSize = 0;
            this.step = function () {
                if (i === 0 && dictSize === 0) {
                    dictionaryBase = uncompressed.split('').filter(function onlyUnique(value, index, self) {
                        return self.indexOf(value) === index;
                    });
                    for (var j = 0; j < dictionaryBase.length; j += 1) {
                        dictionary[dictionaryBase[j]] = j;
                    }
                    baseDictSize = dictionaryBase.length;
                    dictSize = dictionaryBase.length;
                } else if (i < uncompressed.length) {
                    c = uncompressed.charAt(i);
                    wc = w + c;
                    if (dictionary.hasOwnProperty(wc)) {
                        w = wc;
                    } else {
                        result.push(dictionary[w]);
                        dictionary[wc] = dictSize++;
                        w = String(c);
                    }
                    i++;
                } else if (i === uncompressed.length && w !== "") {
                    result.push(dictionary[w]);
                    return null;
                } else {
                    return null;
                }
                return {
                    result:       result,
                    dictionary:   dictionary,
                    dictSize:     dictSize,
                    baseDictSize: baseDictSize,
                    step:         i
                };
            };
        }
        $scope.getDictEntryStyle = function (entry) {
            const style = {
                display: 'inline-block',
                width:   ((Math.floor(entry.value.length / 4) + 1) * 48) + 'px'
            };
            if ($scope.prevResult && entry.id >= $scope.prevResult.raw.dictSize) {
                style['background-color'] = '#96D196';
            }
            return style;
        };
        $scope.getResultEntryStyle = function (index) {
            const style = {
                display: 'inline-block',
                width:   '48px'
            };
            if ($scope.prevResult && (index + 1) >= $scope.prevResult.result.length) {
                style['background-color'] = '#96D196';
            }
            return style;
        };
        $scope.makeStep = function () {
            if ($scope.runnable && $scope.data && $scope.data.length > 0) {
                if ($scope.lzw === null) {
                    $scope.lzw = new LZWW($scope.data)
                }
                var result = $scope.lzw.step();
                if (result === null) {
                    $scope.runnable = false;
                } else {
                    var dictionary = [];
                    for (var key in result['dictionary']) {
                        // noinspection JSUnfilteredForInLoop
                        dictionary.push({
                            id:    result['dictionary'][key],
                            value: key
                        })
                    }
                    $scope.prevResult = $scope.result;
                    $scope.result = {
                        raw:        result,
                        result:     result.result,
                        dictionary: {
                            base:     dictionary.slice(0, result.baseDictSize),
                            extended: dictionary.slice(result.baseDictSize)
                        }
                    };
                }
            }
        };
        $scope.reset = function () {
            $scope.lzw = null;
            $scope.result = null;
            $scope.prevResult = null;
            $scope.runnable = true;
        };
        $scope.data = 'AABBBBAACCDDDDDDDCC';
        $scope.reset();
    });

})();
