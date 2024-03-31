# BFJ

[![Build status](https://gitlab.com/philbooth/bfj/badges/master/pipeline.svg)](https://gitlab.com/philbooth/bfj/pipelines)
[![Package status](https://img.shields.io/npm/v/bfj.svg)](https://www.npmjs.com/package/bfj)
[![Downloads](https://img.shields.io/npm/dm/bfj.svg)](https://www.npmjs.com/package/bfj)
[![License](https://img.shields.io/npm/l/bfj.svg)](https://opensource.org/licenses/MIT)

Big-Friendly JSON. Asynchronous streaming functions for large JSON data sets.

* [Why would I want those?](#why-would-i-want-those)
* [Is it fast?](#is-it-fast)
* [What functions does it implement?](#what-functions-does-it-implement)
* [How do I install it?](#how-do-i-install-it)
* [How do I read a JSON file?](#how-do-i-read-a-json-file)
* [How do I parse a stream of JSON?](#how-do-i-parse-a-stream-of-json)
* [How do I selectively parse individual items from a JSON stream?](#how-do-i-selectively-parse-individual-items-from-a-json-stream)
* [How do I write a JSON file?](#how-do-i-write-a-json-file)
* [How do I create a stream of JSON?](#how-do-i-create-a-stream-of-json)
* [How do I create a JSON string?](#how-do-i-create-a-json-string)
* [What other methods are there?](#what-other-methods-are-there)
  * [bfj.walk (stream, options)](#bfjwalk-stream-options)
  * [bfj.eventify (data, options)](#bfjeventify-data-options)
* [What options can I specify?](#what-options-can-i-specify)
  * [Options for p