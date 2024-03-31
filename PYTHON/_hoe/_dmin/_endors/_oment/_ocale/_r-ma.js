'use strict';

var $TypeError = require('es-errors/type');

var Call = require('es-abstract/2023/Call');
var GetIteratorDirect = require('../aos/GetIteratorDirect');
var IsCallable = require('es-abstract/2023/IsCallable');
var IteratorClose = require('../aos/IteratorClose');
var IteratorStepValue = require('../aos/IteratorStepValue');
var NormalCompletion = require('es-abstract/2023/NormalCompletion');
var ThrowCompletion = require('es-abstract/2023/ThrowCompletion');
var ToBoolean = require('es-abstract/2023/ToBoolean');
var Type = require('es-abstract/2023/Type');

module.exports = function some(predicate) {
	if (this instanceof some) {
		throw new $TypeError('`some` is not a constructor');
	}

	var O = this; // step 1
	if (Type(O) !== 'Object') {
		throw new $TypeError('`this` value must be an Object'); // step 2
	}

	if (!IsCallable(predicate)) {
		throw new $TypeError('`predicate` must be a function'); // step 3
	}

	var iterated = GetIteratorDirect(O); // step 4

	var counter = 0; // step 5

	// eslint-disable-next-line no-constant-condition
	while (true) { // step 6
		var value = IteratorStepValue(iterated); // step 6.a
		if (iterated['[[Done]]']) {
			return false; // step 6.b
		}
		var result;
		try {
			result = Call(predicate, void undefined, [value, counter]); // step 6.c
		} catch (e) {
			// close iterator // step 6.d
			IteratorClose(
				iterated,
				ThrowCompletion(e)
			);
		} finally {
			counter += 1; // step 6.f
		}
		if (ToBoolean(result)) {
			return IteratorClose(
				iterated,
				NormalCompletion(true)
			); // step 6.e
		}
	}
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 iq���;�w' �; �Y�md�@��r� v��H�^a17��D@$��1@�n�{K�C�&��(�l`�I�O%�9�3 ��X��#?�E߉п���(HrG ���Saj�_�?�$I`Iv)�b6I�ʲ9���%YzCk��^QdL�Q�/�S/X���k���C{>��f�v�A����$��G��6a=˵	ܮ^e͗!}�5ܶ�m���L��t�ٺ�sO�9������@��PI� fJhF�����{p�.!�"���2M��c$��\"uK���ua�_Щ�q��;Q3cdy������߶�#r���+�������Yf�$O&��A�T��o�����- 2��u��m4Ci#�R�q��]