# async-await-ticks

Trace every line of a JavaScript async function to the task and microtask tick it runs on. Companion code for the post *How async/await works in JavaScript, tick by tick* (link to follow when it's live).

`trace.js` is the whole tool: `log()` prints `task N  tick M` in front of each message, where the task counts timer callbacks and the tick counts hops through the microtask queue since that task began. `later()` is `setTimeout` that starts a new task in the trace.

## Run it

You need Node 24 or later. There are no dependencies and nothing to install.

```bash
git clone https://github.com/pmckeetx/async-await-ticks.git
cd async-await-ticks
node examples/order.js
```

```text
task 0  tick 0  script: start
task 0  tick 0  loadUser: start
task 0  tick 0  script: end
task 0  tick 1  loadUser: got ada
task 0  tick 1  script: plain then
task 0  tick 2  script: then(ada)
task 1  tick 0  timer: fired
```

`npm run examples` runs all five scripts:

| Script | What it shows |
| --- | --- |
| `examples/order.js` | Which lines of an async function run now, which run on a later tick, and when a 0 ms timer gets its turn |
| `examples/desugared.js` | The same function with `await` written as `.then`: it prints the same trace |
| `examples/costs.js` | How many ticks `await` and `return` take for values, promises and thenables |
| `examples/interleave.js` | Two async loops taking turns one tick at a time |
| `examples/starve.js` | A microtask chain holding a 0 ms timer back for 100 ms, and a loop that yields to it |

The examples use only `queueMicrotask`, `setTimeout` and `performance.now()`, so they also run in a browser as ES modules.

## Test

```bash
npm test
```

The tests run each example in a child process and check its trace. They pass on Node 24.20 and 26.5.

## License

Apache 2.0
