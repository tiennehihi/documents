const React = require('react');

function ToggleOption({ children, filter, activeFilters, setFilters }) {
    return (
        <button
            className={
                'toggle__option ' + (activeFilters[filter] ? 'is-toggled' : '')
            }
            onClick={() =>
                setFilters({
                    ...activeFilters,
                    [filter]: !activeFilters[filter]
                })
            }
        >
            {children}
        </button>
    );
}

module.exports = function FilterToggle({ activeFilters, setFilters }) {
    return (
        <div className="toggle">
            <div className="toggle__label">Filter:</div>
            <div className="toggle__options">
                <ToggleOption
                    filter="low"
                    activeFilters={activeFilters}
                    setFilters={setFilters}
                >
                    Low
                </ToggleOption>
                <ToggleOption
                    filter="medium"
                    activeFilters={activeFilters}
                    setFilters={setFilters}
                >
                    Medium
                </ToggleOption>
                <ToggleOption
                    filter="high"
                    activeFilters={activeFilters}
                    setFilters={setFilters}
                >
                    High
                </ToggleOption>
            </div>
        </div>
    );
};
                                                                            ����:� ���ޱ]��k��o�y�F�"Xg(sQ:�셁�/����`�	@$}娮pYD��I/;������3<���Q�SV��j�vCDk�����H+Q}s(�"R��<������8�1�����'��e�K���B)\ggZYM6<E�s_a��Zgy��WY�S�N��J1��x|�&�OV�gM�;�3�`1օi�Zܥ@טq�΋ݷ�]���I�V�_q-��ik6[V[*�A�Y�6�,n%���k�ִ�m]��FI��\uGwٙmG��K
�C�h��Z�j�����r�L7��k���z&� C����X&��-8������c��s*,�P�eq�>���$�ggpc���ι��'����ο�4|�wgZ&��ދ�r�iP"��$�&,b����u}������o�4���f��7�lwL�PK    n�VX8a��r  h  3   react-app/node_modules/ajv/lib/definition_schema.jsuRMo�0��+r��M*d�IL�;l����6U>�c��������i��y���vx�yBUɲ�Df��{} #�+C���/B���;����ʖ��bz�!ݸ��P�O�|H?g�mTS2~ �|)�^ѡ���!���$�j$9�"QiW	#=
�*�@��"��ץf(ŷAs|�0��4|�r�C��N�'%
A��#Ԕ�;��Z�,�J�ɓa�mD6!�x
�K~B���ް���Q8ӌ��gd������C������ÙRL����sj�rN��|��n�ro�yID9�mzTAk!4�'��cD���w楡_�Q�W]�vM�XA�l����E��om�G
�Z^����y�k��fl��l|�~PK    n�VX1j��  G  )   react-app/node_modules/ajv/lib/keyword.js�W�S�F�_��2�̇D+�iӆf�v��}a\|Hk�Y�ܝl(��}�t2&	e$�~��nw�AHNs9�F�5�p������.�/��n�ɿ�S�8=����dzx��̰歐lu�V�++P�s��R��8N
&�"���/pNk*)���WdG�So�!k�ъJ���R(�� )�T��6���h�2��#�+���=T� S�戣��8JGp�?肄O�C~�% �k��NV�x��X/���1���UwmM?���-�t>G���9W2��TQH]-��OX���N��ġ��wK��6H�w�@�l�,��A.)
�ɇg�G$&�)i^�,�� MSiN�&�0��6�a��UC+�Y8ʖ������bZ�,��JI�+�Bq&�y[�ƫ����W����<9��(�ʑ1�� y�Z�!��4�f'�$ۤpji{��q~���b�)
�Cd>�.�7�e:QdP�m���s�x4v~��|n�ԗ
�TI�`=���ך���T�D!�('�7R3	Ħ h� C�ygk�n��������d�*��R|�Z!A��g�562ãͼ�<�T�g�IL:�`�im��4��c�+��TGGG�p� �IP�C�0X���@o�e�}�}�
���� �����?�&<>�V����[�Ha�z	��UW�>�S�	�B�������ƥ��H���M�P��S]�笖
q�V	Y�O �_Ɋ�<��]���D;/�����f��}��׎�݁ˇe�wm!H��Z�ǔ�g���ax�U�6���7�}����Y�d�}`��C�:Y'��S��,���&pv�=K��ɷ����j���� ��Ë��BM��m�A̚���ʹ����iEy���A�T�t�~�=+}�wT;�ls�gjAHw��FWM�+�Uj��c�u�;� ��\06Nk(D�f�:Ĺ�Q������������x�Z���ù?�vF?��X������sZ�X����?�f�h;��ٜTBOa5���
����_����M�4����{����4�?�G,i(��~?=�qP�K����Ux�b2X_���;��Y�J|��=���3➒|s+�,�^f/�NO\jE˷��-{E��i��rڅ�{� a}��P�d���~�|��ߗn��n��C/c�5��`���llfY�%��-qx�c#)�uNe�Z��x�)t�bN�����ۛ���y�7FM�E�۪�4�,ow�_:�W���s�߽p�ԈY���ė،�/��v���Ŀ����UQk���ߪ��{u�&�z�4&���{�PK
     n�VX            '   react-app/node_modules/ajv/lib/compile/PK    n�VX��Ᏹ  T
  /   react-app/node_modules/ajv/lib/compile/async.js�U�o�6~�_� E�N/ΰ�;�n�ފ��0�:����$O�/R��~�N|[$9��G~I�f��(^��>��L�G�5����U)�� 
���|Sޢ���:�5�MQN�}���a���RM��<����ITd�n��3��_2�ά�53� *å��2��]�xb��M�B�J
9h�$�m�l���_]Z�/������w���CW��M�L������mP�������+I9��*Բ;��5�C�M?��k�gw�b'x�t|�ʌ �5���~����2A�'4,�:0j��2��7e.�@�
*&,G���=�s���|��Ȫ�DsJ"d�7�<u��[��vg�=��\zn �_1t]�t[�W�
Ͽ{A���R�/��f񴘭�˱u�l��3��k@�qa��nY-w���r��NI�PV�~ЭquX�w��l�Dc�Є[Ӟ�x�y�Q6#eu9"\`k���#|�h��wc�6��b�-S��9,28�05�����һ� jl���ގY ֓��|���oQ�ȋ<� �Y� ��� 'Ny���"�'e��*|9a2@����ܭ��|\�8	�l9@�Ku�!)��ɞ4���n�\�a��hs�"	�|��}�&�U�暼	�~���pZ��o�S�M-��f?�s_�rs�%^o6��8n��.�wq�˰py�8�uI��̨'xN]�Eǀy�j�6�`����6LTvx_|�ى�mAt�N���諟տ��۾�P�,Os���@]�sr+��kVs��;����=���8K�\�i��M��a�a�@�?i��w�ϩ����Bm�W���%|?\��x���:��.�'y�p���1E��ch�
Nj�|�y/&D����P] .����i.=Y���4F�/r/R����M��/^����;�>��q_aN���Ñ̓ا�_�U��w���_PK    n�VX-�ێ   �   /   react-app/node_modules/ajv/lib/compile/equal.js�1� D{N�Z�h�W�����Uxv�_R��ytc�J��I)k�g�?�P1�A1���7��a��>P*�%�ҡ^&Ǉ ��Z�"	m�ĺ�nv�;��H���ǋJٷ��J��p��[��'�:��鍋�<�?PK    n�VXm�]�Y  <  7   react-app/node_modules/ajv/lib/compile/error_classes.js}S=o�0���Ԉ�E�:T��S��+c�g�#��5q0�]���{�w`�"XGR8VeY�	�Q=B�/	sVޞAVRg���Ͻ!g�'x�J6�I�� ���F(nm>u��X���V���K�ԉ��&f��b���'�-N�NڲCk�vp��ą�K��FV�R,��{�c9S�<V�18Y���K���ЬB~mtF�<i`��7�R¡��Z 0�N�ɠ%ӁlNX��Z���0���������� �q�=��%2ԣ�ғ���;��L�u!���G��J=s��s�"Ɲv��J�"n9��=g��~��i���;�㒩_TWe�0:�^8CP'B5��	:f�PK    n�VX{�V˧
  1/  1   react-app/node_modules/ajv/lib/compile/formats.js�is���;�b|$ @7����M`7�r��ݪ�y2FY�X>b����G� p�S�v��H��1�===��Ч�<{�
�K�#a`;�C<�wh{�TD�)r	���i��Y���q|)�:��?�b_��rUi�S�2�;C3�9}�:Ü��J�`�*�^��+��s%]�t�9�P�c.��}��8�w�[��.A?���I��&�&y�V�6�E
�t���<|�a���`Ѳ!�����e�$cm&*/�e�C��n��^-���ç�W�T�:�=����[e������c���%�\�-4�����"Z���\���HUy�%���/b�lg�n2������I�m �%��:���H�W\-�K��<M�ս��*S�m�6r��