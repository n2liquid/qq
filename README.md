# Qhell

Helpers for treating promises more like the values they resolve to.

## Installation

    npm install --save qhell

## Examples

```js
let util = require('util');

let Qh = require('qhell');
let Q = require('q');

// Output: [1, 2, { a: 3, b: [4, { c: 5 }] }]
Qh.deepWhen([1, Q.when(2), { a: 3, b: Q.when([4, { c: Q.when(5) }]) }]).then(
    result => console.log(util.inspect(result, { depth: null })
);

// Output: 1 2 [ 3, 4, { a: 5, b: 6 } ]
Qh.console.log(1, 2, [3, Q.when(4), { a: 5, b: Q.when(6) }]);

// Output: 24
Qh.console.log(Qh.mult(2, Q.when(3), Q.when(4)));

// Output: Bar
Qh.ifElse(
    Qh.and(1, 2, Q.when(0), Q.when(3)),
        () => console.log('Foo'),
        () => console.log('Bar')
);
```

## License

![](https://www.gnu.org/graphics/agplv3-155x51.png)

Qhell is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

## Exclusion of warranty

Qhell is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

A copy of AGPLv3 can be found in [COPYING.](COPYING)
