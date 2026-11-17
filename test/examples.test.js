import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const run = (file) =>
  execFileSync(process.execPath, [`examples/${file}`], { encoding: 'utf8' }).trim().split('\n');

test('order.js: sync code, then microtasks, then the timer', () => {
  assert.deepEqual(run('order.js'), [
    'task 0  tick 0  script: start',
    'task 0  tick 0  loadUser: start',
    'task 0  tick 0  script: end',
    'task 0  tick 1  loadUser: got ada',
    'task 0  tick 1  script: plain then',
    'task 0  tick 2  script: then(ada)',
    'task 1  tick 0  timer: fired',
  ]);
});

test('desugared.js prints the same trace as order.js', () => {
  assert.deepEqual(run('desugared.js'), run('order.js'));
});

test('costs.js: ticks per await and return form', () => {
  const ticks = Object.fromEntries(
    run('costs.js').map((line) => {
      const [, tick, label] = line.match(/tick (\d+)  (.+): /);
      return [label, Number(tick)];
    }),
  );
  assert.deepEqual(ticks, {
    'await 42': 1,
    'await promise': 1,
    'await thenable': 2,
    'return value': 1,
    'return await promise': 2,
    'return promise': 3,
  });
});

test('interleave.js: two loops take turns, the sleeper waits for a task', () => {
  assert.deepEqual(run('interleave.js'), [
    'task 0  tick 0  script: end',
    'task 0  tick 1  a: step 1',
    'task 0  tick 1  b: step 1',
    'task 0  tick 2  a: step 2',
    'task 0  tick 2  b: step 2',
    'task 0  tick 3  a: step 3',
    'task 0  tick 3  b: step 3',
    'task 1  tick 1  sleeper: woke up',
  ]);
});

test('starve.js: a microtask chain holds the timer back, yielding lets it through', () => {
  const [chained, yielding] = run('starve.js').map((line) => Number(line.match(/after ([\d.]+) ms/)[1]));
  assert.ok(chained >= 95, `chained ${chained} ms`);
  assert.ok(yielding < 30, `yielding ${yielding} ms`);
});
