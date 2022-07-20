import { task } from 'gulp';
import { resolve } from 'path';
import { createEntitiesIndex } from './tools/database/base.crei';
const log = require('fancy-log'), argv = require('yargs').argv;
require('dotenv').config();

//* config
const pkg = require('./package.json');

const env = argv['env'];
if (env === undefined) {
  require('dotenv').config();
} else {
  log('Using custom .env');
  require('dotenv').config({ path: resolve(process.cwd(), env) });
}
process.env.VERSION = pkg.version;

/**
 * expose port to external internet
 */
task('start-ngrok', async (cb) => {
  const port = argv.port;
  const authtoken = argv.authtoken ?? '';
  const region = argv.region ?? 'ap';
  const proto = argv.proto ?? 'http';

  if(!port || port == '') {
    log('Please specify port!');
    return;
  }

  log(`[NGROK] starting ngrok for port ${port}...`);
  const ngrok = require('ngrok');

  const conf = {
    addr: port,
    authtoken: authtoken,
    region: region,
    proto: proto,
  };

  try {
    await ngrok.disconnect(conf);

    const url = await ngrok.connect(conf);

    log('[NGROK] Url: ' + url);
    if (!conf.authtoken) {
      log(
        '[NGROK] You have been assigned a random ngrok URL that will only be available for this session. You wil need to re-upload the Teams manifest next time you run this command.'
      );
    }
    let hostName = url.replace('http://', '');
    hostName = hostName.replace('https://', '');

    log('[NGROK] HOSTNAME: ' + hostName);
    process.env.HOSTNAME = hostName;

    cb();
  } catch (err) {
    cb(err.msg);
  }
});

/**
 * collect all entity file for service
 */
task('create-entities-index', async (cb) => {
  const service = argv.service;
  if(!service || service == '') {
    log('Please specify service name!');
    return;
  }

  log(`[ENTITY INDEX] starting index entities for service ${service}`);
  createEntitiesIndex(service);
  log(`[ENTITY INDEX] Finished index entities for service ${service}`);
});
