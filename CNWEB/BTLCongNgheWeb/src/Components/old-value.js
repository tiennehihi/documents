import { declare } from '@babel/helper-plugin-utils';
import _getTargets, { prettifyTargets, getInclusionReasons, isRequired } from '@babel/helper-compilation-targets';
import * as _babel from '@babel/core';
import path from 'path';
import debounce from 'lodash.debounce';
import requireResolve from 'resolve';
import { createRequire } from 'module';

const {
  types: t$1,
  template: template
} = _babel.default || _babel;
function intersection(a, b) {
  const 