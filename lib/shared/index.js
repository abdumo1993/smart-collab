var ITyped = /** @class */ (function () {
    function ITyped() {
    }
    return ITyped;
}());
var pre = function (word) {
    return word.type;
};
var post = function (word) {
    return word.type;
};
console.log(pre({ type: 'test' }));
console.log(post({ type: 'newTest' }));
