// requestAnimFrame polyfill
(<any>window).requestAnimFrame = (function () {
    return (<any>window).requestAnimationFrame ||
        (<any>window).webkitRequestAnimationFrame ||
        (<any>window).mozRequestAnimationFrame ||
        function (callback) {
            (<any>window).setTimeout(callback, 1000 / 60);
        };
})();
