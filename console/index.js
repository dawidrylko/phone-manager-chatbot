'use strict';

const chalk = require('chalk');
const log = console.log;

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
    log('token: <wit-access-token>');
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

    log(chalk.magenta('[PM]'), '\t', chalk.magenta(response.text));
  },
  getChargeData({ context, entities }) {
    log(chalk.blue(' [i]'), '\t', chalk.blue('Get charge data...'));

    let phoneNumber = firstEntityValue(entities, 'phoneNumber');
    log(chalk.gray(' [v]'), '\t', chalk.gray('phoneNumber:\t'), chalk.green(phoneNumber));
    let chargeAmount = firstEntityValue(entities, 'chargeAmount');
    log(chalk.gray(' [v]'), '\t', chalk.gray('chargeAmount:\t'), chalk.green(chargeAmount));
    
    if (phoneNumber && chargeAmount) {
      context.phoneNumber = phoneNumber;
      context.chargeAmount = chargeAmount;
    } else {
      context.getChargeData = true;
    }

    return context;
  },
  getSMSData({ context, entities }) {
    log(chalk.blue(' [i]'), '\t', chalk.blue('Get sms data...'));

    let phoneNumber = firstEntityValue(entities, 'phoneNumber');
    log(chalk.gray(' [v]'), '\t', chalk.gray('phoneNumber:\t'), chalk.green(phoneNumber));
    let textMessage = firstEntityValue(entities, 'textMessage');
    log(chalk.gray(' [v]'), '\t', chalk.gray('textMessage:\t'), chalk.green(textMessage));

    if (phoneNumber && textMessage) {
      context.phoneNumber = phoneNumber;
      context.textMessage = textMessage;
    } else {
      log('ERROR... brak danych');
    }

    return context;
  }
};

const client = new Wit({ accessToken, actions });
interactive(client);
