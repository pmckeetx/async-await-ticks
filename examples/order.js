import { log, later } from '../trace.js';

async function loadUser() {
  log('loadUser: start');
  const user = await 'ada';
  log(`loadUser: got ${user}`);
  return user;
}

log('script: start');
later(() => log('timer: fired'));
loadUser().then((user) => log(`script: then(${user})`));
Promise.resolve().then(() => log('script: plain then'));
log('script: end');
