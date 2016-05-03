'use strict';

let Q = require('q');

let Qh = exports;

let objProtoToString = x => Object.prototype.toString.call(x);

let isArguments = x => objProtoToString(x) === '[object Arguments]';

Qh.deepWhen = x => {
    if(isArguments(x)) {
        x = Array.from(x);
    }

    return Q.when(x).then(x => {
        if(Array.isArray(x)) {
            let nx = [];

            return Q.all(x).then(xs => {
                return Q.all(xs.map(x => Qh.deepWhen(x)));
            });
        }

        // TODO: Do proper object detection.
        if(typeof x === 'object') {
            let nx = {};

            return Q.all(Object.keys(x).map(k => {
                return Qh.deepWhen(x[k]).then(v => {
                    nx[k] = v;
                });
            })).then(() => nx);
        }

        return x;
    });
};

Qh.call = function(fn) {
    return Qh.deepWhen([...arguments].slice(1)).then(args => {
        return fn.apply(null, args);
    });
};

{
    let consoleLog = console.log.bind(console);

    let consoleErr = console.error.bind(console);

    Qh.console = {
        log: function() {
            return Qh.call(consoleLog, ...arguments);
        },

        error: function() {
            return Qh.call(consoleErr, ...arguments);
        },
    };
}

Qh.callMethod = function(fnName, promise) {
    return Q.when(promise).then(x => {
        return x[fnName].apply(x, [...arguments].slice(2));
    });
};

let argList = args => {
    return Qh.deepWhen(args).then(args => {
        if(args.length === 1 && Array.isArray(args[0])) {
            return args[0];
        }

        return args;
    });
};

Qh.and = function() {
    let args = argList(arguments);

    return Qh.callMethod('every', args, x => !!x);
};

Qh.or = function() {
    return argList(arguments).then(args => {
        if(args.length === 0) {
            return true;
        }

        return Qh.callMethod('some', args, x => !!x);
    });
};

{
    let binaryOps = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
        '%': (a, b) => a % b,

        // TODO: Implement the rest.
    };

    Qh.binaryReduce = function(op) {
        let args = argList([...arguments].slice(1));

        return Qh.callMethod('reduce', args, binaryOps[op]);
    };
}

Qh.add = function() {
    return Qh.binaryReduce('+', arguments);
};

Qh.sub = function() {
    return Qh.binaryReduce('-', arguments);
};

Qh.mult = function() {
    return Qh.binaryReduce('*', arguments);
};

Qh.div = function() {
    return Qh.binaryReduce('/', arguments);
};

Qh.remainder = function() {
    return Qh.binaryReduce('%', arguments);
};
