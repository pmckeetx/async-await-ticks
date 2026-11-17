// Label every log line with the task and the microtask tick it ran on.
//
// A tick is one trip through the microtask queue. The counter queues a
// microtask at the start of each task; when it runs it bumps the tick and
// queues itself again. Anything queued during tick N runs after the counter's
// tick N + 1 is queued, so it sees tick N + 1. It stops after MAX_TICKS:
// a counter that re-queued itself forever would never let the next task run.

const MAX_TICKS = 8;
let task = 0;
let tick = 0;

function count(n = 1) {
  tick = n;
  if (n < MAX_TICKS) queueMicrotask(() => count(n + 1));
}

export function startTask() {
  tick = 0;
  queueMicrotask(() => count());
}

export function later(fn, ms = 0) {
  setTimeout(() => {
    task += 1;
    startTask();
    fn();
  }, ms);
}

export function log(message) {
  console.log(`task ${task}  tick ${tick}  ${message}`);
}

startTask();
