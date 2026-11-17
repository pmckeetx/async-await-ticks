// How long does a 0 ms timer wait behind 100 ms of work?

const WORK_MS = 100;
const CHUNK_MS = 5;

function busy(ms) {
  const end = performance.now() + ms;
  while (performance.now() < end);
}

function timerDelay(runWork) {
  return new Promise((resolve) => {
    const start = performance.now();
    setTimeout(() => resolve(performance.now() - start), 0);
    runWork();
  });
}

// Every chunk queues the next one as a microtask: the timer waits for all of them.
function microtaskChain(left = WORK_MS) {
  busy(CHUNK_MS);
  if (left > CHUNK_MS) queueMicrotask(() => microtaskChain(left - CHUNK_MS));
}

// Every chunk awaits a 0 ms timer: the waiting timer gets a turn between chunks.
async function yieldingLoop() {
  for (let left = WORK_MS; left > 0; left -= CHUNK_MS) {
    busy(CHUNK_MS);
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

const chained = await timerDelay(microtaskChain);
console.log(`microtask chain: the 0 ms timer fired after ${chained.toFixed(1)} ms`);
const yielding = await timerDelay(yieldingLoop);
console.log(`yielding loop:   the 0 ms timer fired after ${yielding.toFixed(1)} ms`);
