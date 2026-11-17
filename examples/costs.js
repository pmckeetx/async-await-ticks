import { log } from '../trace.js';

const done = Promise.resolve('done');
const thenable = { then(resolve) { resolve('done'); } };

async function awaitValue() { await 42; log('await 42: resumed'); }
async function awaitPromise() { await done; log('await promise: resumed'); }
async function awaitThenable() { await thenable; log('await thenable: resumed'); }
async function returnValue() { return 'done'; }
async function returnAwait() { return await done; }
async function returnPromise() { return done; }

awaitValue();
awaitPromise();
awaitThenable();
returnValue().then(() => log('return value: caller resumed'));
returnAwait().then(() => log('return await promise: caller resumed'));
returnPromise().then(() => log('return promise: caller resumed'));
