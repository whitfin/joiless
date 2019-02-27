# Joiless [![Build Status](https://travis-ci.org/whitfin/joiless.svg?branch=master)](https://travis-ci.org/whitfin/joiless)

Utility functions for using Joi without using Joi.

### Installation

Joiless lives on npm, so just install it via the command line and you're good to go.

```
$ npm install --save joi joiless
```

You need to install `joi` itself as this module does not include it as a production dependency (so you can use your own `joi` version). If you try a version which has an issue caused by the module, please file an issue.

### Example

I love [Joi](https://github.com/hapijs/joi)'s validation, and I love [Hapi](https://github.com/hapijs/hapi), so I use Joi all the time. Unfortunately I hate Joi's chaining, so I wrote Joiless to assist. Basically, it's Joi using JSON.

Here's an example (both of these are identical, and are in fact a test case in this repo):

```javascript
const Joi = require('joi');
const Joiless = require('joiless');

// Joi version
let joiSpec = Joi
  .date()
  .description('The date (in milliseconds) that this crash last appeared')
  .timestamp('javascript')
  .default(Date.now, 'Current timestamp generation');

// Joiless version
let joilessSpec = Joiless.spec('date', {
  description: 'The date (in milliseconds) that this crash last appeared',
  timestamp: 'javascript',
  default: [ Date.now, 'Current timestamp generation' ]
});
```

The translation is simple; the key is the function called on the Joi chain, and the value is the value passed into the Joi chain call.

- If you pass an Array as a value, it's applied to the Joi function - if you wish to pass an Array as an argument, use `[ [ <your_array> ] ]`.
- If you want to call a function with no arguments, either pass `undefined` as the value, or you can use the `after` hook (whichever you prefer):

```javascript
const Joiless = require('joiless');

// via undefined
Joiless.spec('string', {
  after: function (spec) {
    spec.strip();
    spec.insensitive();
  }
});

// via after
Joiless.spec('string', {
  strip: undefined,
  insensitive: undefined
})
```

### Other Usage

#### Attaching Child References

If you make a complex schema, you can use `attach` to hook the child keys onto the parent.

For example, in the snippet below you can reference `Record.Username` to pull back the username spec. This is done using `get`, it doesn't store the value twice.

```javascript
const Joiless = require('joiless');

// define the spec
const Record = Joiless.spec({

  type: 'object',

  description: 'A database model',

  keys: {

    username: Joiless.spec({
      type: 'string',
      description: 'The username for this record',
      required: true
    })

  }

});

// attach the children
Joiless.attach(Record);
```

#### Extending Schemas

Sometimes you wish to define a base schema, and then extend it to override some of the parent stuff. Naturally, the `spec` API doesn't fit here, so I added an `extend` in `v1.1`.

Extension is easy, you just pass the schema to extend as first arg, and your spec overrides in the second argument.

```javascript
const Joi = require('joi');
const Joiless = require('joiless');

// define the base spec
let base = Joiless.spec('object', {
  keys: {
    a: Joiless.spec('number'),
    b: Joiless.spec('string')
  }
});

// define our extension
let extended = Joiless.extend(base, {
  keys: {
    a: Joiless.spec('string')
  }
});

// run validation
Joi.validate({ a: 'hello' }, base);     // fails
Joi.validate({ a: 'hello' }, extended); // passes
```
