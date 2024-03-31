'use strict';
const singleComment = Symbol('singleComment');
const multiComment = Symbol('multiComment');
const stripWithoutWhitespace = () => '';
const stripWithWhitespace = (string, start, end) => string.slice(start, end).replace(/\S/g, ' ');

const isEscaped = (jsonString, quotePosition) => {
	let index = quotePosition - 1;
	let backslashCount = 0;

	while (jsonString[index] === '\\') {
		index -= 1;
		backslashCount += 1;
	}

	return Boolean(backslashCount % 2);
};

module.exports = (jsonString, options = {}) => {
	if (typeof jsonString !== 'string') {
		throw new TypeError(`Expected argument \`jsonString\` to be a \`string\`, got \`${typeof jsonString}\``);
	}

	const strip = options.whitespace === false ? stripWithoutWhitespace : stripWithWhitespace;

	let insideString = false;
	let insideComment = false;
	let offset =