'use strict';

let Wit = null;
let interactive = null;

try {
  // if running from repo
  Wit = require('../').Wit;
  interactive = require('../').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  interactive = require('node-wit').interactive;
}

const accessToken = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node examples/basic.js <wit-access-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;

    console.log(
      '[PM]: ', 
      JSON.stringify(response.text)
    );
  },
  getChargeData({ context, entities }) {
    console.info('Get charge data...');
    let phoneNumber = firstEntityValue(entities, 'phoneNumber');
    console.info('phoneNumber: ', phoneNumber);
    let chargeAmount = firstEntityValue(entities, 'chargeAmount');
    console.info('chargeAmount: ', chargeAmount);
    
    if (phoneNumber && chargeAmount) {
      context.phoneNumber = phoneNumber;
      context.chargeAmount = chargeAmount;
    }

    return context;
  }
};

const client = new Wit({ accessToken, actions });
interactive(client);
