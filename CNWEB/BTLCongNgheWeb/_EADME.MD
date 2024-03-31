: 'utf-8' }), { a: 'Ã¸' });
        st.end();
    });

    t.test('should ignore an utf8 sentinel with an unknown value', function (st) {
        st.deepEqual(qs.parse('utf8=foo&' + urlEncodedOSlashInUtf8 + '=' + urlEncodedOSlashInUtf8, { charsetSentinel: true, charset: 'utf-8' }), { ø: 'ø' });
        st.end();
    });

    t.test('uses the utf8 sentinel to switch to utf-8 when no default charset is given', function (st) {
        st.deepEqua