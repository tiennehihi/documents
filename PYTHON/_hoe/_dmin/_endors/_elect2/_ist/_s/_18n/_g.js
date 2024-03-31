import expect from 'expect';
import getElementType from '../../../src/util/getElementType';
import JSXElementMock from '../../../__mocks__/JSXElementMock';
import JSXAttributeMock from '../../../__mocks__/JSXAttributeMock';

describe('getElementType', () => {
  describe('no settings in context', () => {
    const elementType = getElementType({ settings: {} });

    it('should return the exact tag name for a DOM element', () => {
      expect(elementType(JSXElementMock('input').openingElement)).toBe('input');
    });

    it('should return the exact tag name for a custom element', () => {
      expect(elementType(JSXElementMock('CustomInput').openingElement)).toBe('CustomInput');
    });

    it('should return the exact tag name for names that are in Object.prototype', () => {
      expect(elementType(JSXElementMock('toString').openingElement)).toBe('toString');
    });

    it('should return t