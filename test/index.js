const joi = require('joi');
const should = require('should');

const joiless = require('../');

suite('joiless', function () {

  test('attaching child references to a schema', function () {
    let Schema = joi.object().keys({
      username: joi.string(),
      password: joi.string()
    });

    should(Schema.Username).be.undefined();
    should(Schema.Password).be.undefined();

    joiless.attach(Schema);

    should(Schema.Username).be.an.Object();
    should(Schema.Password).be.an.Object();

    should(Schema.Username._type).equal('string');
    should(Schema.Password._type).equal('string');
  });

  test('generating specifications from parameters', function () {
    let joiSpec = joi
      .date()
      .description('The date (in milliseconds) that this crash last appeared')
      .timestamp('javascript')
      .default(Date.now, 'Current timestamp generation');

    let ourSpec1 = joiless.spec({
      type: 'date',
      description: 'The date (in milliseconds) that this crash last appeared',
      timestamp: 'javascript',
      default: [ Date.now, 'Current timestamp generation' ]
    });

    let ourSpec2 = joiless.spec('date', {
      description: 'The date (in milliseconds) that this crash last appeared',
      timestamp: 'javascript',
      default: [ Date.now, 'Current timestamp generation' ]
    });

    should(ourSpec1).deepEqual(joiSpec);
    should(ourSpec2).deepEqual(joiSpec);
  });

  test('extending schemas using parameters', function () {
    let base = joiless.spec('object', {
      keys: {
        a: joiless.spec('number'),
        b: joiless.spec('string')
      }
    });

    let extended = joiless.extend(base, {
      keys: {
        a: joiless.spec('string')
      }
    });

    let result1 = joi.validate({ a: 'hello' }, base);
    let result2 = joi.validate({ a: 'hello' }, extended);

    should(result1).have.property('error');
    should(result1.error).be.an.Error();

    should(result2).have.property('error');
    should(result2.error).be.null();
  });

});
