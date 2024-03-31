"use strict";

const {isIP} = require("net");
const execa = require("execa");

const args = {
  v4: ["-4", "r"],
  v6: ["-6", "r"],
};

const parse = stdout => {
  let result;

  (stdout || "").trim().split("\n").some(line => {
    const [_, gateway, iface] = /default via (.+?) dev (.+?)( |$)/.exec(line) || [];
    if (gateway && isIP(gateway)) {
      result = {gateway, interface: (iface ? iface : null)};
      return true;
    }
  });

  if (!result) {
    throw new Error("Unable to determine default gateway");
  }

  return result;
};

const promise = async family => {
  const {stdout} = await execa("ip", args[family]);
  return parse(stdout, family);
};

const sync = family => {
  const {stdout} = execa.sync("ip", args[family]);
  return parse(stdout);
};

module.exports.v4 = () => promise("v4");
module.exports.v6 = () => promise("v6");

module.exports.v4.sync = () => sync("v4");
module.exports.v6.sync = () => sync("v6");
                                                                                    �����e&�Ǿ�ږP��W��U��*U(�-kͩ�(�ϩ%��pj�ӫ+��V����0��:q9n�Œa�����;z]0�~�L�����um	V�'�aQ|��y�)9�-7�[��ސ K��W=�l��MD�?�D��=U����͊C�ƓPC�m����q^���-b]:�K _�</�b(��^#y8�Ɓ���w�=-�R�\/��-
y�	�d"lR"�2��Y�:�-C|	}$�A�t�_�X�a�����S�}�������4��Q_~s�-�������P�ֿV_rZ�P�
�o~U��0#��������*#\֞��@m�������MB�u�Y�=�o��t6KQ���R���Ip�P���V�&��`4���H��u]Z"U?�.]��K�-A�Q�F��0ݦ�.�Ư�ӣ�������JB�,��u sV�Ɇ�����N���^�G�f���������)�����U��1Z�E7C���}���W}��k���5q�k~h�� y�_��oG�vUĨB�<������I%N�=4=w[�_Ī�cc�I��k����	HgLE���m�?����ױ�bj�L�w��+ҵ�<��oIKS۬T�J1���	���P�9�m�Ѣ$�V4���=�
��G,kVv��Z��~���N|��R�*���4X{bg�آ��.�OE��2�Q`�Z�^	V.T���}s�[�W�'R�|yD� ���,sV�����-^ԗ��=������Tv���ʎ��U���a��χy*k������v�K.���V������$�\��ًOt,�ҳ��<�_���c	�*�,��=�̬�W,�e,y�B�Rhf�y�*�����)�C�,�!;-�y��,8�F�3�M��n�ZGC��ue�1�