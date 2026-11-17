// Label every log line with the task and the microtask tick it ran on.
//
// A tick is one hop through the microtask queue. The counter queues a
// microtask at the start of each task; when it runs it bumps the tick and
// queues itself again. Anything queued during tick N runs after the counter's
// hop N + 1 is queued, so it sees tick N + 1. It stops after HOPS hops:
// a counter that re-queued itself forever would never let the next task run.

const HOPS = 8;
let task = 0;
let tick = 0;

function count(hop = 1) {
  tick = hop;
  if (hop < HOPS) queueMicrotask(() => count(hop + 1));
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
