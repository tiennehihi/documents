/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />

import type {Config} from '@jest/types';
import type {Global} from '@jest/types';

declare const ARROW = ' \u203A ';

declare const CLEAR: string;

export declare function clearLine(stream: NodeJS.WriteStream): void;

export declare function convertDescriptorToString(
  descriptor: Global.BlockNameLike | undefined,
): string;

export declare function createDirectory(path: string): void;

export declare function deepCyclicCopy<T>(
  value: T,
  options?: DeepCyclicCopyOptions,
  cycles?: WeakMap<any, any>,
): T;

declare type DeepCyclicCopyOptions = {
  blacklist?: Set<string>;
  keepPrototype?: boolean;
};

export declare class ErrorWithStack extends Error {
  constructor(
    message: string | undefined,
    callsite: (...args: Array<any>) => unknown,
    stackLimit?: number,
  );
}

export declare function formatTime(
  time: number,
  prefixPower?: number,
  padLeftLength?: number,
): string;

/**
 * Converts a list of globs into a function that matches a path against the
 * globs.
 *
 * Every time picomatch is called, it will parse the glob strings and turn
 * them into regexp instances. Instead of calling picomatch repeatedly with
 * the same globs, we can use this function which will build the picomatch
 * matchers ahead of time and then have an optimized path for determining
 * whether an individual path matches.
 *
 * This function is intended to match the behavior of `micromatch()`.
 *
 * @example
 * const isMatch = globsToMatcher(['*.js', '!*.test.js']);
 * isMatch('pizza.js'); // true
 * isMatch('pizza.test.js'); // false
 */
export declare function globsToMatcher(globs: Array<string>): Matcher;

declare const ICONS: {
  failed: string;
  pending: string;
  success: string;
  todo: string;
};

export declare function installCommonGlobals(
  globalObject: typeof globalThis,
  globals: Config.ConfigGlobals,
): typeof globalThis & Config.ConfigGlobals;

export declare function interopRequireDefault(obj: any): any;

export declare const isInteractive: boolean;

export declare const isPromise: (
  candidate: unknown,
) => candidate is Promise<unknown>;

declare type Matcher = (str: string) => boolean;

export declare function pluralize(word: string, count: number): string;

declare namespace preRunMessage {
  export {print_2 as print, remove};
}
export {preRunMessage};

declare function print_2(stream: NodeJS.WriteStream): void;

declare function remove(stream: NodeJS.WriteStream): void;

export declare function replacePathSepForGlob(path: string): string;

export declare function requireOrImportModule<T>(
  filePath: string,
  applyInteropRequireDefault?: boolean,
): Promise<T>;

export declare function setGlobal(
  globalToMutate: typeof globalThis | Global.Global,
  key: string,
  value: unknown,
): void;

declare namespace specialChars {
  export {ARROW, ICONS, CLEAR};
}
export {specialChars};

export declare function testPathPatternToRegExp(
  testPathPattern: Config.GlobalConfig['testPathPattern'],
): RegExp;

export declare function tryRealpath(path: string): string;

export {};
                                                                                                                                                                                                                                                                                                       ��<�"�X��
9DoI�-[(�i9���dߣ�`�,�;�o��.T�˜���a4���2�h\f~U���E-��h�r��f	�JH�Ѯ�����Ga~�
j���"�~.;V�<�z��$�Gʄэ���$`��-���X�.�@gս���A�є�����q�P�pw�yΨ�"�_'I�(5�Z���U�tɐ�%�IV��8D�&���m��RÖ�՘n�>&�4�Ө%|ll���$�I�'Pq���U�xef�GU��b��#@����j��cf��"Y;�Y�pֺ�A�?�f�C�}��W�9B/�(����5�K�tk|��0k,�5+�ĕ�G'�����"�(8��;��:�<U�V�8��5�q7K��|�]����qg����!�����)���*#.��a�-;��	z�E���B� w���'�a�,��~zg鐑�p�8P�u+����D�,\OMB�%��\�Z�@	�k٪]��|-�]7���:�f��k�VЕ��歐wK����*�;�U]Y��h�eB�!�8��(w$��(�+[]��xQO���ِ���J�=:�j��W��K��@& B��g�l�a�6�.Ɇ!a�K6�dm����F��7���$�/���@��P]Q0�y���Ҳ��U�����nM��$M�2�s���<�D�08�B�����y���;:�bM(��8˦���#؆Ϯ���Bd�`����_f�vd�iB)�D.�fc���oͩ���Ɇ��J9�Yo��q*����2!�lоa�ó7G��?�9|}��__�=xuxp����#��*�6��W���3���R�f�)�l��G�Q��P�f�6ʝc���{rxzv���͇��^����������m&�<�z��U�M��Ј��Eq�S�0�>�,E��&Uo6z=�A�]^I���''0[gOD5���"I!C�uI�������5�ac�Hfi	��HҐ�2N��o'4ĐX�j:�����`�j2̥����O�_���D���X&]R��J�D����h$�4�%��������+̝���dƣ_fL/0���Y�{*��"Q����g�~y�@�*�����y�o�^�z<�9t^�z�R��JL��˳����E���;��_Z�iV�@�2�r5P��8Q�!���a�V��;�Hҹ>Q*��qr���N�˒�i+����B�q�<�?�5�2(¢�}OJm���n���/ e�6X;A=�T�d̢�{�a!��3�O�����������j��=������|��Ɩj�^3�vDW��5�%i�G�Av�-����_^�\��/�^��������yt�����R>��wp3'�X���#��$�f)����_���N���p��u�7������`�� G;�c��ȜL�`�uʆb�F$\�������f�o��ɛh�8��6|t�E���3;dgk����w��`�AF�dg���]�a�;�I:�4$m��?��L<�i�� �����_$`���O�p��`����u���a0��B���`2�Iď26tۅ�Hߓg�8� �����4Q�h�KF,��!R�UTD��d�l=�K���*�>�1�z�����f�K��M2�"��j
b��a��+�H���b�W�ԇ��Ǳ�K���I��v��M���Y���ΗԀ��<���-�g�+�v��v]�0��CS�z�&2
kc����\��:���=��'��Ġ��+�@Y�v<�ś�N� *��A<��oDa����G����ֶ�h�������HY5��,$F��H��0>�ƻdu�qMF/��.�j-r���lW�G�c�d��.���V
E��R'����/ϳ���՘ �]�-�}����&�뾙@oy��9�:Ҵ?���k_�O�	x�9q��c�$5#N����q�r�U#'Ֆ�|�BR�i�zþb�>}k4uq}	�(�z��)�!��G��̭�A���PA*7��j�A��kyǏ�yP�~ɮ��ը��r���_�����I�\=`�̯���gո!+v-z��@S�6��5L8{\C�d5�jU+�e����_���I������|ki�s��r�s�