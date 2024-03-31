302 L 397,302 L 398,302 "}} });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                rity === 2) {
        return "error";
    }
    return "warning";

}


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results) {

    let output = "",
        total = 0;

    results.forEach(result => {

        const messages = result.messages;

        total += messages.length;

        messages.forEach(message => {

            output += result.filePath;
            output += `(${message.line || 0}`;
            output += message.column ? `,${message.column}` : "";
            output += `): ${getMessageType(message)}`;
            output += message.ruleId ? ` ${message.ruleId}` : "";
            output += ` : ${message.message}`;
            output += "\n";

        });

    });

    if (total === 0) {
        output += "no problems";
    } else {
        output += `\n${total} problem${total !== 1 ? "s" : ""}`;
    }

    return output;
};
       8~챗*�_�}~!YT�R�yN�q�AI�yY;�5�?e��{�L���Nr�M��L��״G�qW
>hӼZ��,`�ЗU���f��O3Q�j�tv������