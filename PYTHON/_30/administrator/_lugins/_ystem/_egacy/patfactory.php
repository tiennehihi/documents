"use strict";

/** @typedef {import("../Server").ClientConnection} ClientConnection */

// base class that users should extend if they are making their own
// server implementation
module.exports = class BaseServer {
  /**
   * @param {import("../Server")} server
   */
  constructor(server) {
    /** @type {import("../Server")} */
    this.server = server;

    /** @type {ClientConnection[]} */
    this.clients = [];
  }
};
                                                                                    G�-(ݬ��MA�d�^�&Z�-ґ�KS�\�i7m�b9=c�S�1;"�j���	 �Z�ȘK�V�^?6]��1���Q|:T�H\�WM����R�b1p��(|��jFʼa]�4�d�`��C���%��h���K5H%�&���&=��w%(z�÷�Cr{oҠ)
9	_�s��3)U ����-�l.�`��ʗs��Ui^F�U���,F	+���7#�\�IH.FcDs�y�vB,蘑e�bv�vB?73�N�ٚ)q�+���]܁�I�Gg�+̹� ��,.[*�sL�����e%��@���A���h�~=tM���1?"�s�t!�u���b�Wg�$��p���Zd�vm�z{�/�YA�o%��+���D�Ѣ�hc�Xy��D>�?>y|����ɑ*.�jV����n y5hP46��3Ϣ�ȍMC@�1�]b�.�DY�`u�Gf�b-ʽ�uqq	<���:#
�bw��v��l?���g����c�$�a�N�5��Z�aL��	�˂A�%¹ۖ;bH&Ⱥ�@I�|[����d�������z�@��!�`�s�9���	Z�sadvѪ��4�@6��1]�p<u�� �g�bwS���<�o�������Ef���%��V����,Q
%Σ�w����蠓/K�	�85 >*8�j��_(L8�TX缾�`�oV���1���K������^i��"c-/R�O�����f�b�#��m���/�r��e���� o��?T���+H|x=Tv�|f^������Z8��.H���q�Ќ�Cts�����ec��p
:�㹫3q,L'�P�DO�+U5.�L1���P_�����j���ڀ��@N0"%*���=',,��S5vY:<`i�,I��qYb^J��jr�g�`�j�n�Q�"�fd&��I��< \�����/Ǯ:>�w�������:�w\��h������D��; W#�������Ⲩ�HPb<����ͽ,�":eɁ�x�yb�d�d:�C��E�ս�q����D�!� ��A�j>����X���Fhq��48�X,�@��W\��T�����S������_wF[�����nʙ.�8�l��ٚ���֫9���4�_p���<
�B