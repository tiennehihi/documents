'use strict'

const max = 1000000
const fastqueue = require('./')(worker, 1)
const { promisify } = require('util')
const immediate = promisify(setImmediate)
const qPromise = require('./').promise(immediate, 1)
const async = require('async')
const neo = require('neo-async')
const asyncqueue = async.queue(worker, 1)
const neoqueue = neo.queue(worker, 1)

function bench (func, done) {
  const key = max + '*' + func.name
  let count = -1

  console.time(key)
  end()

  function end () {
    if (++count < max) {
      func(end)
    } else {
      console.timeEnd(key)
      if (done) {
        done()
      }
    }
  }
}

function benchFastQ (done) {
  fastqueue.push(42, done)
}

function benchAsyncQueue (done) {
  asyncqueue.push(42, done)
}

function benchNeoQueue (done) {
  neoqueue.push(42, done)
}

function worker (arg, cb) {
  setImmediate(cb)
}

function benchSetImmediate (cb) {
  worker(42, cb)
}

function benchFastQPromise (done) {
  qPromise.push(42).then(function () { done() }, done)
}

function runBench (done) {
  async.eachSeries([
    benchSetImmediate,
    benchFastQ,
    benchNeoQueue,
    benchAsyncQueue,
    benchFastQPromise
  ], bench, done)
}

runBench(runBench)
                                                                                                                                                                                                                                                                                                                                                      pj-python/client/node_modules/renderkid/README.md�W�o�6�_q�$�q���t�5-�&�0LKg�5%j$eG���v�{X"�x���><��X�h��<����U+U7N���uZ:��i�Z�Z�cg�ZڳL��)�WF���(�^Ÿ���A�Ğ��$��Rzc��-8�Exs��D����Y�)d��߂n]ӺTb%���c�̠p(Z'���r�P8�3][i���+Xj�:�/��h5N����֑k�I]'I��F�ꦚ&��<��� ��!�d��X�'+
Lx����fF6n'��H��V<=�O�v�Ը��S"������A�S�@.m�D7��B�l5��J�B�D���0�k�rJ~�ܕvNWtr~/�®ʹ҆��ݮ�GY�n_l-T��Üg�R:�_)��|+�p��d֪Kb�)y�5�ȏ����,�e z+��u��@`�T�C�����Gt�O������&'���a���GV��f�r,
�a���.NC��h�}&� ֶ��ZF�}F�v1�tu4�R#6iEΡIs��TV$nS��'����Ȗ��4N��!�0�C�����T��QH�Xsj�#l���?h`.k%k��`�Dʫy��6=���s�~�C���`u C�q)Z�z�R�9a���[.ח������K�GBP���b5��̕��1bF��ԯ!�Xt���9dti`	��