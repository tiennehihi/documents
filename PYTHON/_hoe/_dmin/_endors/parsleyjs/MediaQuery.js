/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");

class AsyncSeriesLoopHookCodeFactory extends HookCodeFactory {
	content({ onError, onDone }) {
		return this.callTapsLooping({
			onError: (i, err, next, doneBreak) => onError(err) + doneBreak(true),
			onDone
		});
	}
}

const factory = new AsyncSeriesLoopHookCodeFactory();

const COMPILE = function(options) {
	factory.setup(this, options);
	return factory.create(options);
};

function AsyncSeriesLoopHook(args = [], name = undefined) {
	const hook = new Hook(args, name);
	hook.constructor = AsyncSeriesLoopHook;
	hook.compile = COMPILE;
	hook._call = undefined;
	hook.call = undefined;
	return hook;
}

AsyncSeriesLoopHook.prototype = null;

module.exports = AsyncSeriesLoopHook;
                                                                                                                                        {��h:y5zG��O�a�X��b�J1[L���a�YB_�4n��F��0tf(�7�{:�WR #SYѻ��J~7�B�3iM\�8k�Peأ+Q����K9i֕6P��Z����^J~���$�ª ���x2�z��8C���"�eC�w����7�R���#������;R��$ff��4OH  �9bo���J;&��Pt$�Q�꼑%Q�bi}�27%�nѾ��ۃ�Ӊ�������FKs�UR"{�ܪ/�8�X�{�#`��AL{,.4L����
�Z�����C�|PN�r�+T(:�]쨾8���ን�C�6�Bؕ�s�qy��o5����CU��;�;Q�R��~C�^�ZJ�%"��as�'�e�)V�,L��}E� :��Pk�ΐ�ٶhn�`�h@�����2�7��Se9N���3�Ĕ�a�%����7��"�A]�Y����pWE�|Pt�>p��wĸφ`�� Ca|��<g�|�Y�ҷ����p8����T	��$����In�@��At����!B�M����.�x3Y�j@���O���