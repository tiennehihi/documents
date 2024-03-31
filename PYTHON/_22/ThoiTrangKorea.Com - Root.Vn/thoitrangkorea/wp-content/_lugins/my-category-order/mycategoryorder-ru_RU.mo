#!/usr/bin/env node
import { readFile } from 'fs/promises';
import { rimraf } from './index.js';
const pj = fileURLToPath(new URL('../package.json', import.meta.url));
const pjDist = fileURLToPath(new URL('../../package.json', import.meta.url));
const { version } = JSON.parse(await readFile(pjDist, 'utf8').catch(() => readFile(pj, 'utf8')));
const runHelpForUsage = () => console.error('run `rimraf --help` for usage information');
export const help = `rimraf version ${version}

Usage: rimraf <path> [<path> ...]
Deletes all files and folders at "path", recursively.

Options:
  --                   Treat all subsequent arguments as paths
  -h --help            Display this usage info
  --preserve-root      Do not remove '/' recursively (default)
  --no-preserve-root   Do not treat '/' specially
  -G --no-glob         Treat arguments as literal paths, not globs (default)
  -g --glob            Treat arguments as glob patterns
  -v --verbose         Be verbose when deleting files, showing them as
                       they are removed. Not compatible with --impl=native
  -V --no-verbose      Be silent when deleting files, showing nothing as
                       they are removed (default)
  -i --interactive     Ask for confirmation before deleting anything
                       Not compatible with --impl=native
  -I --no-interactive  Do not ask for confirmation before deleting

  --impl=<type>        Specify the implementation to use:
                       rimraf: choose the best option (default)
                       native: the built-in implementation in Node.js
                       manual: the platform-specific JS implementation
                       posix: the Posix JS implementation
                       windows: the Windows JS implementation (falls back to
                                move-remove on ENOTEMPTY)
                       move-remove: a slow reliable Windows fallback

Implementation-specific options:
  --tmp=<path>        Temp file folder for 'move-remove' implementation
  --max-retries=<n>   maxRetries for 'native' and 'windows' implementations
  --retry-delay=<n>   retryDelay for 'native' implementation, default 100
  --backoff=<n>       Exponential backoff factor for retries (default: 1.2)
`;
import { parse, relative, resolve } from 'path';
const cwd = process.cwd();
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
const prompt = async (rl, q) => new Promise(res => rl.question(q, res));
const interactiveRimraf = async (impl, paths, opt) => {
    const existingFilter = opt.filter || (() => true);
    let allRemaining = false;
    let noneRemaining = false;
    const queue = [];
    let processing = false;
    const processQueue = async () => {
        if (processing)
            return;
        processing = true;
        let next;
        while ((next = queue.shift())) {
            await next();
        }
        processing = false;
    };
    const oneAtATime = (fn) => async (s, e) => {
        const p = new Promise(res => {
            queue.push(async () => {
                const result = await fn(s, e);
                res(result);
                return result;
            });
        });
        processQueue();
        return p;
    };
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    opt.filter = oneAtATime(async (path, ent) => {
        if (noneRemaining) {
            return false;
        }
        while (!allRemaining) {
            const a = (await prompt(rl, `rm? ${relative(cwd, path)}\n[(Yes)/No/All/Quit] > `)).t