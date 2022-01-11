# Simple child_process.fork() example

My first approach to [child_process.fork()](https://nodejs.org/api/child_process.html#child_processforkmodulepath-args-options).

## To run

Install all dependencies

```bash
npm install
```
Then you have two run options:
```bash
node index.js --fork
node index.js
```
In the first one (--fork), a child process is spawned to calculate a set of "cant" (see below) number of random numbers between 1 to 1000.

You can test the two routes (see below) to check for "concurrent" responses from server.

On the other hand (no --fork), regular "single thread" execution is launched.

## These are the routes

```bash
localhost:8080/api/randoms?cant=   (whatever number you like. If no number is passed, it is assing 100000 by default))

localhost:8080/info
```


## Enjoy this next saturday night
