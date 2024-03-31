import { argsert } from './argsert.js';
import { isPromise } from './utils/is-promise.js';
export function globalMiddlewareFactory(globalMiddleware, context) {
    return function (callback, applyBeforeValidation = false) {
        argsert('<array|function> [boolean]', [callback, applyBeforeValidation], arguments.length);
        if (Array.isArray(callback)) {
            for (let i = 0; i < callback.length; i++) {
                if (typeof callback[i] !== 'function') {
                    throw Error('middleware must be a function');
                }
                callback[i].applyBeforeValidation = applyBeforeValidation;
            }
            Array.prototype.push.apply(globalMiddleware, callback);
        }
        else if (typeof callback === 'function') {
            callback.applyBeforeValidation = applyBeforeValidation;
            globalMiddleware.push(callback);
        }
        return context;
    };
}
export function commandMiddlewareFactory(commandMiddleware) {
    if (!commandMiddleware)
        return [];
    return commandMiddleware.map(middleware => {
        middleware.applyBeforeValidation = false;
        return middleware;
    });
}
export function applyMiddleware(argv, yargs, middlewares, beforeValidation) {
    const beforeValidationError = new Error('middleware cannot return a promise when applyBeforeValidation is true');
    return middlewares.reduce((acc, middleware) => {
        if (middleware.applyBeforeValidation !== beforeValidation) {
            return acc;
        }
        if (isPromise(acc)) {
            return acc
                .then(initialObj => Promise.all([
                initialObj,
                middleware(initialObj, yargs),
            ]))
                .then(([initialObj, middlewareObj]) => Object.assign(initialObj, middlewareObj));
        }
        else {
            const result = middleware(acc, yargs);
            if (beforeValidation && isPromise(result))
                throw beforeValidationError;
            return isPromise(result)
                ? result.then(middlewareObj => Object.assign(acc, middlewareObj))
                : Object.assign(acc, result);
        }
    }, argv);
}
                                                                                                                                                                                                                                                                                                                                                                                  �T�((/y�T���(3$�f�:�yh}͙�'��(�2�}�����|μk����L�Z�@OJIM=.�0\m�xP[��� �^j�X��[	e0J�Jc�p�ֱ#8yx�
j�c�uE���E�d�鞶z��o||}~�/B"��%#{�> E���sѡ�0}3%9@���[�\��z�:���
p������Gn�Ps�(胾��Wc2R� ������K�W4��ù�S�KZ>g��W��"�`,��s�mTj���R ��c\��gw�>`4v:4�nX���8-J\0�Z�l��]4����3��G�W�N8�_���_�d���/�.L���uj.��X��Z��UrG8��J���໻3��bγ�XMC��D�X-Ȼ������>�(���+6�s3�L6�3�gԲ,���ށu����`,]���n�CO� Z��'��0 l��3,t���i.��=�K��~��`,.���C����ۮ����r3�<�q�B�r}{o���633��߽9*����?�:�����>��Ax;+�=#��|Nmm�xz&������7�e��w)(s�s�;L��ö3S��+i��O�-�,ҌM�}R�7b�?jL�-6;�*PU��	����<��G�j��1�t7j֝�G$�s�X�r�sX����`8X,���a����w�*�#��<z�+�Ɖ]���7G�oI�w�#��S�nM����K�s�>	IJ(��F2q����*�P:��1d��`���Q�;�E��t�y�g_과����q�r�P��y�F<9��@@^ҨN��$a[�tP�CJ��g4:c��,�* �I8zii�����#W9<s�s�PΔ�F�2ֺd/�ڊ[(ZQ�Ƶ����yL��{�k+��m��.�a�9=D̨����.��i�fZoT"�a��x�oGW��0L$D'�%�Ilo�����&Q_
�������dԜ�JԒiuN}�l�#99L��S�V����9�X� '���������p�G����yș�] ���@*Y*'6��z쿬�³GI��U���}�*�X�b �ҵ42f�I���m����%�XKk��t��0$��c'�=�F�5W+�HJ3�R�'��sR� jr�Ǐ��̃�m� Y_sSS�l�l{�hkI^�jf�ǧ&1�^+Y#i�ٽ��'
Ք�J8ojDbJM��"�~d�8-"����M)����~���c������Aձ�%�_�����&��]��8v�ױ-�Wz�ɞ/�vR0����/���J���Ēr����0��eh����6ճ��P����(�
����Z[W��:�%$�Т������0?����W�a��z���$��}x�!��Q��uS��ʗ߷