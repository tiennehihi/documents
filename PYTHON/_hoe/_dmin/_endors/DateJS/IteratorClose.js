export var defaultRelativeTime = {
    future : 'in %s',
    past   : '%s ago',
    s  : 'a few seconds',
    m  : 'a minute',
    mm : '%d minutes',
    h  : 'an hour',
    hh : '%d hours',
    d  : 'a day',
    dd : '%d days',
    M  : 'a month',
    MM : '%d months',
    y  : 'a year',
    yy : '%d years'
};

import isFunction from '../utils/is-function';

export function relativeTime (number, withoutSuffix, string, isFuture) {
    var output = this._relativeTime[string];
    return (isFunction(output)) ?
        output(number, withoutSuffix, string, isFuture) :
        output.replace(/%d/i, number);
}

export function pastFuture (diff, output) {
    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
}
                                                                                                                                                                                                                         ��^�%�yB�Θ���ه���/�e^:�5:MϋJ���[��ϒ�g*�n��?��x��k���9u���r��j�7UV�C1c��'��
�"58ҔGzW=F�Uq<�l�^�|�*���@@�G������s$(��~�9��鈺�&��!T^uƌ����׵H�
�RxuE�s���P�Y�}�_�g���T�!���j"/�������aN:�y��J�{��z���� �]���4))�r_C2��X�X�P���@�Q=�� �}���x8n��fv�e���J!�8��P������b!���rs �����2�K�1N2T��x?#�d ˟����Y�ױ˲�.Wa+�.��Ǯ&�|��f E�����Z�v�4#�{���u��,��!TA�\��9>*����{�NV�4���;��*�T��xL�V�CGP�8o�"��Rs'y#��۩�@,�c�Bp��ZL��C�v$���G�q	=�#F��uT�?$���}��;:�F��qH�o�䷦���n�>�	��m(�=��#�,�5F��֡��j��o��Ba�Y�Dbh�x��,�[��U�>�}�P7��ry�e�Ϋ]�i��nz���dh��VYX�!��������y��[j�#�AJ� Z���텘��_Қl�"�����0�l����P��ʽ���� ��