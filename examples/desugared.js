import { log, later } from '../trace.js';

// loadUser from order.js with the await written out by hand.
function loadUser() {
  return new Promise((resolve, reject) => {
    log('loadUser: start');
    Promise.resolve('ada').then((user) => {
      log(`loadUser: got ${user}`);
      resolve(user);
    }, reject);
  });
}

log('script: start');
later(() => log('timer: fired'));
loadUser().then((user) => log(`script: then(${user})`));
Promise.resolve().then(() => log('script: plain then'));
log('script: end');
