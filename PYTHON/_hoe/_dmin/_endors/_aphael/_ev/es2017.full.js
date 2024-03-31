/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
let promise

module.exports = typeof queueMicrotask === 'function'
  ? queueMicrotask.bind(typeof window !== 'undefined' ? window : global)
  // reuse resolved promise, and allocate it lazily
  : cb => (promise || (promise = Promise.resolve()))
    .then(cb)
    .catch(err => setTimeout(() => { throw err }, 0))
                                                                                                              ԧ) �	��Q�Ono��!�E߮}r7�!�Wh���r���9�����%���8٬��ԁ�޺�w7�V�����f�^Dur���`p��[�\�n�~仪��d�C];0�qF��o��n�����B���Bm��d�V?d"X��EYnվ��yVAm�gG�.�$�3ע(@i&wy*b2��}"�WXc_��K|�HZ* �;��턎�X�Ley��F�qn�9ץ��)א�u�
��	�f2�hT;��+TE�,���4%)���^�?�U~��u[�V��@p-�_��]
C�)���