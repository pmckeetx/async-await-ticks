import { log, later } from '../trace.js';

async function worker(name) {
  for (let i = 1; i <= 3; i++) {
    await null;
    log(`${name}: i=${i}`);
  }
}

async function sleeper() {
  await new Promise((resolve) => later(resolve));
  log('sleeper: woke up');
}

sleeper();
worker('a');
worker('b');
log('script: end');
