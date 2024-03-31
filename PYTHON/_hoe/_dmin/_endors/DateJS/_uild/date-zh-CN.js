nt = {};
var didWarnAboutContextTypeOnFunctionComponent = {};
var didWarnAboutGetDerivedStateOnFunctionComponent = {};
var didWarnAboutReassigningProps = false;
var didWarnAboutGenerators = false;
var didWarnAboutMaps = false;
var hasWarnedAboutUsingContextAsConsumer = false; // This would typically be a function component but we still support module pattern
// components for some reason.

function renderIndeterminateComponent(request, task, Component, props) {
  var legacyContext;

  {
    legacyContext = getMaskedContext(Component, task.legacyContext);
  }

  pushFunctionComponentStackInDEV(task, Component);

  {
    if (Component.prototype && typeof Component.prototype.render === 'function') {
      var componentName = getComponentNameFromType(Component) || 'Unknown';

      if (!didWarnAboutBadClass[componentName]) {
        error("The <%s /> component appears to have a render method, but doesn't extend React.Component. " + 'This is likely to cause errors. Change %s to extend React.Component instead.', componentName, componentName);

        didWarnAboutBadClass[componentName] = true;
      }
    }
  }

  var value = renderWithHooks(request, task, Component, props, legacyContext);
  var hasId = checkDidRenderIdHook();

  {
    // Support for module components is deprecated and is removed behind a flag.
    // Whether or not it would crash later, we want to show a good message in DEV first.
    if (typeof value === 'object' && value !== null && typeof value.render === 'function' && value.$$typeof === undefined) {
      var _componentName = getComponentNameFromType(Component) || 'Unknown';

      if (!didWarnAboutModulePatternComponent[_componentName]) {
        error('The <%s /> component appears to be a function component that returns a class instance. ' + 'Change %s to a class that extends React.Component instead. ' + "If you can't use a class try assigning the prototype on the function as a workaround. " + "`%s.prototype = React.Component.prototype`. Don't use an arrow function since it " + 'cannot be called with `new` by React.', _componentName, _componentName, _componentName);

        didWarnAboutModulePatternComponent[_componentName] = true;
      }
    }
  }

  if ( // Run these checks in production only if the flag is off.
  // Eventually we'll delete this branch altogether.
   typeof value === 'object' && value !== null && typeof value.render === 'function' && value.$$typeof === undefined) {
    {
      var _componentName2 = getComponentNameFromType(Component) || 'Unknown';

      if (!didWarnAboutModulePatternComponent[_componentName2]) {
        error('The <%s /> component appears to be a function component that returns a class instance. ' + 'Change %s to a class that extends React.Component instead. ' + "If you can't use a class try assigning the prototype on the function as a workaround. " + "`%s.prototype = React.Component.prototype`. Don't use an arrow function since it " + 'cannot be called with `new` by React.', _componentName2, _componentName2, _componentName2);

        didWarnAboutModulePatternComponent[_componentName2] = true;
      }
    }

    mountClassInstance(value, Component, props, legacyContext);
    finishClassComponent(request, task, value, Component, props);
  } else {

    {
      validateFunctionComponentInDev(Component);
    } // We're now successfully past this task, and we don't have to pop back to
    // the previous task every again, so we can use the destructive recursive form.


    if (hasId) {
      // This component materialized an id. We treat this as its own level, with
      // a single "child" slot.
      var prevTreeContext = task.treeContext;
      var totalChildren = 1;
      var index = 0;
      task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);

      try {
        renderNodeDestructive(request, task, value);
      } finally {
        task.treeContext = prevTreeContext;
      }
    } else {
      renderNodeDestructive(request, task, value);
    }
  }

  popComponentStackInDEV(task);
}

function validateFunctionComponentInDev(Component) {
  {
    if (Component) {
      if (Component.childContextTypes) {
        error('%s(...): childContextTypes cannot be defined on a function component.', Component.displayName || Component.name || 'Component');
      }
    }

    if (typeof Component.getDerivedStateFromProps === 'function') {
      var _componentName3 = getComponentNameFromType(Component) || 'Unknown';

      if (!didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3]) {
        error('%s: Function components do not support getDerivedStateFromProps.', _componentName3);

        didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3] = true;
      }
    }

    if (typeof Component.contextType === 'object' && Component.contextType !== null) {
      var _componentName4 = getComponentNameFromType(Component) || 'Unknown';

      if (!didWarnAboutContextTypeOnFunctionComponent[_componentName4]) {
        error('%s: Function components do not support contextType.', _componentName4);

        didWarnAboutContextTypeOnFunctionComponent[_componentName4] = true;
      }
    }
  }
}

function resolveDefaultProps(Component, baseProps) {
  if (Component && Component.defaultProps) {
    // Resolve default props. Taken from ReactElement
    var props = assign({}, baseProps);
    var defaultProps = Component.defaultProps;

    for (var propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }

    return props;
  }

  return baseProps;
}

function renderForwardRef(request, task, type, props, ref) {
  pushFunctionComponentStackInDEV(task, type.render);
  var children = renderWithHooks(request, task, type.render, props, ref);
  var hasId = checkDidRenderIdHook();

  if (hasId) {
    // This component materialized an id. We treat this as its own level, with
    // a single "child" slot.
    var prevTreeContext = task.treeContext;
    var totalChildren = 1;
    var index = 0;
    task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);

    try {
      renderNodeDestructive(request, task, children);
    } finally {
      task.treeContext = prevTreeContext;
    }
  } else {
    renderNodeDestructive(request, task, children);
  }

  popComponentStackInDEV(task);
}

function renderMemo(request, task, type, props, ref) {
  var innerType = type.type;
  var resolvedProps = resolveDefaultProps(innerType, props);
  renderElement(request, task, innerType, resolvedProps, ref);
}

function renderContextConsumer(request, task, context, props) {
  // The logic below for Context differs depending on PROD or DEV mode. In
  // DEV mode, we create a separate object for Context.Consumer that acts
  // like a proxy to Context. This proxy object adds unnecessary code in PROD
  // so we use the old behaviour (Context.Consumer references Context) to
  // reduce size and overhead. The separate object references context via
  // a property called "_context", which also gives us the ability to check
  // in DEV mode if this property exists or not and warn if it does not.
  {
    if (context._context === undefined) {
      // This may be because it's a Context (rather than a Consumer).
      // Or it may be because it's older React where they're the same thing.
      // We only want to warn if we're sure it's a new React.
      if (context !== context.Consumer) {
        if (!hasWarnedAboutUsingContextAsConsumer) {
          hasWarnedAboutUsingContextAsConsumer = true;

          error('Rendering <Context> directly is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
        }
      }
    } else {
      context = context._context;
    }
  }

  var render = props.children;

  {
    if (typeof render !== 'function') {
      error('A context consumer was rendered with multiple children, or a child ' + "that isn't a function. A context consumer expects a single child " + 'that is a function. If you did pass a function, make sure there ' + 'is no trailing or leading whitespace around it.');
    }
  }

  var newValue = readContext(context);
  var newChildren = render(newValue);
  renderNodeDestructive(request, task, newChildren);
}

function renderContextProvider(request, task, type, props) {
  var context = type._context;
  var value = props.value;
  var children = props.children;
  var prevSnapshot;

  {
    prevSnapshot = task.context;
  }

  task.context = pushProvider(context, value);
  renderNodeDestructive(request, task, children);
  task.context = popProvider(context);

  {
    if (prevSnapshot !== task.context) {
      error('Popping the context provider did not return back to the original snapshot. This is a bug in React.');
    }
  }
}

function renderLazyComponent(request, task, lazyComponent, props, ref) {
  pushBuiltInComponentStackInDEV(task, 'Lazy');
  var payload = lazyComponent._payload;
  var init = lazyComponent._init;
  var Component = init(payload);
  var resolvedProps = resolveDefaultProps(Component, props);
  renderElement(request, task, Component, resolvedProps, ref);
  popComponentStackInDEV(task);
}

function renderElement(request, task, type, props, ref) {
  if (typeof type === 'function') {
    if (shouldConstruct$1(type)) {
      renderClassComponent(request, task, type, props);
      return;
    } else {
      renderIndeterminateComponent(request, task, type, props);
      return;
    }
  }

  if (typeof type === 'string') {
    renderHostElement(request, task, type, props);
    return;
  }

  switch (type) {
    // TODO: LegacyHidden acts the same as a fragment. This only works
    // because we currently assume that every instance of LegacyHidden is
    // accompanied by a host component wrapper. In the hidden mode, the host
    // component is given a `hidden` attribute, which ensures that the
    // initial HTML is not visible. To support the use of LegacyHidden as a
    // true fragment, without an extra DOM node, we would have to hide the
    // initial HTML in some other way.
    // TODO: Add REACT_OFFSCREEN_TYPE here too with the same capability.
    case REACT_LEGACY_HIDDEN_TYPE:
    case REACT_DEBUG_TRACING_MODE_TYPE:
    case REACT_STRICT_MODE_TYPE:
    case REACT_PROFILER_TYPE:
    case REACT_FRAGMENT_TYPE:
      {
        renderNodeDestructive(request, task, props.children);
        return;
      }

    case REACT_SUSPENSE_LIST_TYPE:
      {
        pushBuiltInComponentStackInDEV(task, 'SuspenseList'); // TODO: SuspenseList should control the boundaries.

        renderNodeDestructive(request, task, props.children);
        popComponentStackInDEV(task);
        return;
      }

    case REACT_SCOPE_TYPE:
      {

        throw new Error('ReactDOMServer does not yet support scope components.');
      }
    // eslint-disable-next-line-no-fallthrough

    case REACT_SUSPENSE_TYPE:
      {
        {
          renderSuspenseBoundary(request, task, props);
        }

        return;
      }
  }

  if (typeof type === 'object' && type !== null) {
    switch (type.$$typeof) {
      case REACT_FORWARD_REF_TYPE:
        {
          renderForwardRef(request, task, type, props, ref);
          return;
        }

      case REACT_MEMO_TYPE:
        {
          renderMemo(request, task, type, props, ref);
          return;
        }

      case REACT_PROVIDER_TYPE:
        {
          renderContextProvider(request, task, type, props);
          return;
        }

      case REACT_CONTEXT_TYPE:
        {
          renderContextConsumer(request, task, type, props);
          return;
        }

      case REACT_LAZY_TYPE:
        {
          renderLazyComponent(request, task, type, props);
          return;
        }
    }
  }

  var info = '';

  {
    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and " + 'named imports.';
    }
  }

  throw new Error('Element type is invalid: expected a string (for built-in ' + 'components) or a class/function (for composite components) ' + ("but got: " + (type == null ? type : typeof type) + "." + info));
}

function validateIterable(iterable, iteratorFn) {
  {
    // We don't support rendering Generators because it's a mutation.
    // See https://github.com/facebook/react/issues/12995
    if (typeof Symbol === 'function' && // $FlowFixMe Flow doesn't know about toStringTag
    iterable[Symbol.toStringTag] === 'Generator') {
      if (!didWarnAboutGenerators) {
        error('Using Generators as children is unsupported and will likely yield ' + 'unexpected results because enumerating a generator mutates it. ' + 'You may convert it to an array with `Array.from()` or the ' + '`[...spread]` operator before rendering. Keep in mind ' + 'you might need to polyfill these features for older browsers.');
      }

      didWarnAboutGenerators = true;
    } // Warn about using Maps as children


    if (iterable.entries === iteratorFn) {
      if (!didWarnAboutMaps) {
        error('Using Maps as children is not supported. ' + 'Use an array of keyed ReactElements instead.');
      }

      didWarnAboutMaps = true;
    }
  }
}

function renderNodeDestructive(request, task, node) {
  {
    // In Dev we wrap renderNodeDestructiveImpl in a try / catch so we can capture
    // a component stack at the right place in the tree. We don't do this in renderNode
    // becuase it is not called at every layer of the tree and we may lose frames
    try {
      return renderNodeDestructiveImpl(request, task, node);
    } catch (x) {
      if (typeof x === 'object' && x !== null && typeof x.then === 'function') ; else {
        // This is an error, stash the component stack if it is null.
        lastBoundaryErrorComponentStackDev = lastBoundaryErrorComponentStackDev !== null ? lastBoundaryErrorComponentStackDev : getCurrentStackInDEV();
      } // rethrow so normal suspense logic can handle thrown value accordingly


      throw x;
    }
  }
} // This function by it self renders a node and consumes the task by mutating it
// to update the current execution state.


function renderNodeDestructiveImpl(request, task, node) {
  // Stash the node we're working on. We'll pick up from this task in case
  // something suspends.
  task.node = node; // Handle object types

  if (typeof node === 'object' && node !== null) {
    switch (node.$$typeof) {
      case REACT_ELEMENT_TYPE:
        {
          var element = node;
          var type = element.type;
          var props = element.props;
          var ref = element.ref;
          renderElement(request, task, type, props, ref);
          return;
        }

      case REACT_PORTAL_TYPE:
        throw new Error('Portals are not currently supported by the server renderer. ' + 'Render them conditionally so that they only appear on the client render.');
      // eslint-disable-next-line-no-fallthrough

      case REACT_LAZY_TYPE:
        {
          var lazyNode = node;
          var payload = lazyNode._payload;
          var init = lazyNode._init;
          var resolvedNode;

          {
            try {
              resolvedNode = init(payload);
            } catch (x) {
              if (typeof x === 'object' && x !== null && typeof x.then === 'function') {
                // this Lazy initializer is suspending. push a temporary frame onto the stack so it can be
                // popped off in spawnNewSuspendedTask. This aligns stack behavior between Lazy in element position
                // vs Component position. We do not want the frame for Errors so we exclusively do this in
                // the wakeable branch
                pushBuiltInComponentStackInDEV(task, 'Lazy');
              }

              throw x;
            }
          }

          renderNodeDestructive(request, task, resolvedNode);
          return;
        }
    }

    if (isArray(node)) {
      renderChildrenArray(request, task, node);
      return;
    }

    var iteratorFn = getIteratorFn(node);

    if (iteratorFn) {
      {
        validateIterable(node, iteratorFn);
      }

      var iterator = iteratorFn.call(node);

      if (iterator) {
        // We need to know how many total children are in this set, so tha// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var common = require('./common');
var assert = require('assert');
var EventEmitter = require('../');

var listener1 = function listener1() {};
var listener2 = function listener2() {};

{
  var ee = new EventEmitter();
  ee.on('hello', listener1);
  ee.on('removeListener', common.mustCall(function(name, cb) {
    assert.strictEqual(name, 'hello');
    assert.strictEqual(cb, listener1);
  }));
  ee.removeListener('hello', listener1);
  var listeners = ee.listeners('hello');
  assert.ok(Array.isArray(listeners));
  assert.strictEqual(listeners.length, 0);
}

{
  var ee = new EventEmitter();
  ee.on('hello', listener1);
  ee.on('removeListener', common.mustNotCall());
  ee.removeListener('hello', listener2);

  var listeners = ee.listeners('hello');
  assert.ok(Array.isArray(listeners));
  assert.strictEqual(listeners.length, 1);
  assert.strictEqual(listeners[0], listener1);
}

{
  var ee = new EventEmitter();
  ee.on('hello', listener1);
  ee.on('hello', listener2);

  var listeners;
  ee.once('removeListener', common.mustCall(function(name, cb) {
    assert.strictEqual(name, 'hello');
    assert.strictEqual(cb, listener1);
    listeners = ee.listeners('hello');
    assert.ok(Array.isArray(listeners));
    assert.strictEqual(listeners.length, 1);
    assert.strictEqual(listeners[0], listener2);
  }));
  ee.removeListener('hello', listener1);
  listeners = ee.listeners('hello');
  assert.ok(Array.isArray(listeners));
  assert.strictEqual(listeners.length, 1);
  assert.strictEqual(listeners[0], listener2);
  ee.once('removeListener', common.mustCall(function(name, cb) {
    assert.strictEqual(name, 'hello');
    assert.strictEqual(cb, listener2);
    listeners = ee.listeners('hello');
    assert.ok(Array.isArray(listeners));
    assert.strictEqual(listeners.length, 0);
  }));
  ee.removeListener('hello', listener2);
  listeners = ee.listeners('hello');
  assert.ok(Array.isArray(listeners));
  assert.strictEqual(listeners.length, 0);
}

{
  var ee = new EventEmitter();

  function remove1() {
    assert.fail('remove1 should not have been called');
  }

  function remove2() {
    assert.fail('remove2 should not have been called');
  }

  ee.on('removeListener', common.mustCall(function(name, cb) {
    if (cb !== remove1) return;
    this.removeListener('quux', remove2);
    this.emit('quux');
  }, 2));
  ee.on('quux', remove1);
  ee.on('quux', remove2);
  ee.removeListener('quux', remove1);
}

{
  var ee = new EventEmitter();
  ee.on('hello', listener1);
  ee.on('hello', listener2);

  var listeners;
  ee.once('removeListener', common.mustCall(function(name, cb) {
    assert.strictEqual(name, 'hello');
    assert.strictEqual(cb, listener1);
    listeners = ee.listeners('hello');
    assert.ok(Array.isArray(listeners));
    assert.strictEqual(listeners.length, 1);
    assert.strictEqual(listeners[0], listener2);
    ee.once('removeListener', common.mustCall(function(name, cb) {
      assert.strictEqual(name, 'hello');
      assert.strictEqual(cb, listener2);
      listeners = ee.listeners('hello');
      assert.ok(Array.isArray(listeners));
      assert.strictEqual(listeners.length, 0);
    }));
    ee.removeListener('hello', listener2);
    listeners = ee.listeners('hello');
    assert.ok(Array.isArray(listeners));
    assert.strictEqual(listeners.length, 0);
  }));
  ee.removeListener('hello', listener1);
  listeners = ee.listeners('hello');
  assert.ok(Array.isArray(listeners));
  assert.strictEqual(listeners.length, 0);
}

{
  var ee = new EventEmitter();
  var listener3 = common.mustCall(function() {
    ee.removeListener('hello', listener4);
  }, 2);
  var listener4 = common.mustCall();

  ee.on('hello', listener3);
  ee.on('hello', listener4);

  // listener4 will still be called although it is removed by listener 3.
  ee.emit('hello');
  // This is so because the interal listener array at time of emit
  // was [listener3,listener4]

  // Interal listener array [listener3]
  ee.emit('hello');
}

{
  var ee = new EventEmitter();

  ee.once('hello', listener1);
  ee.on('removeListener', common.mustCall(function(eventName, listener) {
    assert.strictEqual(eventName, 'hello');
    assert.strictEqual(listener, listener1);
  }));
  ee.emit('hello');
}

{
  var ee = new EventEmitter();

  assert.strictEqual(ee, ee.removeListener('foo', function() {}));
}

// Verify that the removed listener must be a function
assert.throws(function() {
  var ee = new EventEmitter();

  ee.removeListener('foo', null);
}, /^TypeError: The "listener" argument must be of type Function\. Received type object$/);

{
  var ee = new EventEmitter();
  var listener = function() {};
  ee._events = undefined;
  var e = ee.removeListener('foo', listener);
  assert.strictEqual(e, ee);
}

{
  var ee = new EventEmitter();

  ee.on('foo', listener1);
  ee.on('foo', listener2);
  var listeners = ee.listeners('foo');
  assert.ok(Array.isArray(listeners));
  assert.strictEqual(listeners.length, 2);
  assert.strictEqual(listeners[0], listener1);
  assert.strictEqual(listeners[1], listener2);

  ee.removeListener('foo', listener1);
  assert.strictEqual(ee._events.foo, listener2);

  ee.on('foo', listener1);
  listeners = ee.listeners('foo');
  assert.ok(Array.isArray(listeners));
  assert.strictEqual(listeners.length, 2);
  assert.strictEqual(listeners[0], listener2);
  assert.strictEqual(listeners[1], listener1);

  ee.removeListener('foo', listener1);
  assert.strictEqual(ee._events.foo, listener2);
}
                                                           ,�^�QG����'����{&�h����U���<�x	0�n���&���.�ٕ$=�
���F�;5�s���[�� ��3 X|U=��g���2߄CG���9�~�&����
w�8#��2h��^)�@U��~��M:�ձ_d�8���&�e.�W��O+�,�I�x-���6MH���/]����kpYS�Y?0�zN���p>氾�zh@A%M~yj1��N��O
��9���G71�DV�a���*s�7k.�;��E�|_���<Y��?;����;A0��9ʹ
O}!{2���?,޻��*�����$��{K��G��,#8��F�� 倛  >R�|�2�O����/9���L�@#��	u)��J26=�������as+�>t��2�s��-��W�2�)��he�~5I��
J�z5���ߠk2O��ؤ��)��5R�.�{?W};����� 6��[}΁�V��!��(�둍�K����u:W"+��χx?.>e/O���kpU��zU.��D�z���jz�����+X��Xp������jޅ|f[ynN(&	D@E
��z�`M/� �y>�%�~n�f4}@�M��������l��sp��wAȥp뭞3�!?٨��zE�v�l�.�AJ�\�[ޒ<ꟳL�)!G�D�S�ud��73���ua�ʹ�d?�[Y��}L� }��=f�3g{2;�����y�
(�5�uc�L�,Tb�j����g��\L
8��Hk�`����V��JA�y�&��&C#�(��|��	�e�2�P�|I�	nYT�E�U�uC��_
���oTy������������x/]�kˮ������y�%�u_e�lU?���/�	���IL	��s�5財��+��)��$\�Èb�Z��Cn1��^�%hX�4�����q �T��!���/lI�����^����Tꨤ�lPp3yq��ʞ��ߥͽ�F]�{`ߴ�0�p����i
>�Sg$�;/I��Nq2&�Q1��u/e
���"F��+�9b��1�f-�A�L�*"ybw?�<hѱ�������5 7���e������NkS�L�0�`D���A�W����h�ͳ4l�g�Ȟ����P�'���H dStEP龫iy�L�Eu�[0J�Un��W�Ʀ%x��x�=��f�5I+�"vv�+��4
P�K�ᅎ���� M�E�y���:�3|u2�\�B/�s�1����i�r�ރ������L�Ns��u�-�U��P#�jik�� �'��=x�}����ZP�U�-��b�[���c�E�5o����>p|�1�b�I	��+kA)M<�c��i˒���:Z�a�H��~��s
Q�@��rdOCjBTPqv3���=~��v���h4�]] �(B�0���?�ݖ&3�}h
�����7�`1��j�|%���
@f��5��M?*�����h�:-$t4�S�Q9(���[ſ�x �|�	zaOi:C���А�74 ��$a��N1#e٢z�.��Hhh�E�>��]�9o҃�eXC��""	�8�Nz�o�u��l�jzB����r�`�5'�x�͂X=/4l��|��J�qu8C��R/Й���䳤{��	4z3����%���"�K��5�*n�:�6)��۸y���<HK�o��� W�H}Eqp�T�OS���FTPx�$�VS��(n�-�������K:D���9^�z@t�{KŊ�{�u����F���
�x���Pg��}C�ݻ*�ԐM�������p](��bAF�ӝ2v�5��\�����٩6�����A�LV�`s*����w¸'ˮ4(�ˤ���L,Ǿ�=�yp/
)ř�4W�l�rbuc�<�Z������̭��P����Ԕ�";�R$���qT��%���J�#�Kf�-1I��X����I�$p�AlѸ?�6���Sr9	)����O����-��uG{L��b��@5�� �,��O���RK����L�<׿�&dݘ�	�l�u��4mU���ܢ�*~� �z4�l��S[=H��?k�u��Ѷ鮛��wh~٠�d�c�Rl�/f�!����77r_-�O4А�+V1a���l�<`�5d8��ҍqG�������ʍ}�8;�_�f @�?�q'�����zt��*R8B�P OO_��L �j����Kn�lt,,�I!���\Ne�;�͠��I����������-K�ɢe?|�[
>L�2��Z��:r>��N�(
�1�
���[��qyʻ3V���h�?�<�"nGD�N�X��j.�l���Z4[�[�Q{5�qһ攩'彤��h�n�A��լu��g
���.
<s������� �
�O��>����c���a�9ՒWY,MK��(kA7���6������7ͭR�"��Tj_��m��H�K��R� �p�䡼|7�6�����R����x�:hV��4��w����2��4�7eo����:k,�K�Id���0�c.�)�
K~/ea� �Вj�������>������w����SMc��a^A& ����Yg/�[�׏�@a>#�PfY�z�/��K��d�8�l޹m����|�2��v�� ���ͳ��SD_�y�kH�l�Ok#㓿@�[�;>gu�g�&?�u�37����ŵ<�\��?A��EX'�Mt9Ff�MsH�N�6��z����	�g��Z�h�N!�N�]���+���xq�z�KY��2�P<A-�x(��tg���ƅ�͝��d���1���7g�QT �Ђd��kj���+%u����e5񰹤���_�]���p U�(�����+��0�Y�߯!��2`�=�W�4�? ��<Ĺ��#�m�$���I��ō�������P@�Ь�N���o��Nփ���~ۏU�=ζ���bA�)�����um'=X��(�e|,S	�^j�
��M�n�/doN�~��&d���r����ޥ#4�z�}n��{�I�*���v��^5���΅ݏc����u���
�1e6�/���Qu�I׺�D�������lP��kX��!��FN���*���%��Q�O2�N��yq��&<6|&k�`�q{�o�p��`�^����3�n϶d�1_�)l�?	�o h�10�0�L����J��o��i�Y�HڑݝI��nDJ����y�#m��IN/�Dy{`����j����a�p�O��)
3o���"�(ľ����H��ڕQڹ�bC�@������ss�O�U�=K4LV�{d=������ӳ$��n3�-$ﮔ��-�P��u�^y<��.�R�d��ݫc���
��)B܉����IL��B1�jU�R��٬�]��� x��//Z1��a1;���+��{$����$�˷�x�b�.�yj�d,%��Kc�T�c���v3Y:4�s�x��!�p�3"˴�U��y�a��f�_ �Ѯ
���Н�0b�yi����9m*���r����>��+�M��ptB|(����1 �����X(�So|Q����%�"}�|�T��>�X�	(�^�u�NB��t��*����U��>�Ee��|w�q&��`�B�a�'5I��B���[,��4 ��ܱ�e�]B�x������j�z|վ`��+����Z$LoUF�import { Rule, Scope } from 'eslint';

declare function declaredScope(
    context: Rule.RuleContext,
    name: string
): Scope.Scope['type'] | undefined;

export default declaredScope;
                                                                                                                                                                                                                                                                                                                                      nAM��]ޣT:8|{�Y�H�=����@f
@<��$�v�f6�I���q"��r��??�]p�0��v��p���b�
NU�
��J%1� Ϳ�� ����]<�����f�c�s{�c��Ag[��%O�V������N����<�Z�5���K�i�k+x����	b$5�@=�/Y�Q5�=��~o�<��}0f��L<k�*�����h��uq���
+$V�|�0���]�i]�Ż�W�A����6�,̜L+�dG���:6Nz@y}��r���2I"��]�B�FBiծ�0t̂�=b��Ҝ5G�p�Q
�ZV}�4�K�R�>y�~I~�8L��S�>#l�A�K���{��o���YPEۧ��R�<�к�&���U����k��sr�����Dӌm#Vօ�ׇw��&��ã8��FT=S�������$��,z��h�N
��,ѽ��G#B[�l��/�;$���t��Emh�~[�o:�������zϯ��&n�^Z����>J�h�+R��/Hxv��6P�����6dA�k7%�Jzgt�rp  A�x<!�2�O�@ ���>=p�N��߽Q5��Ü!DāóT���+�a�d�y��NvFw�V#�c����: rES*ݲ4+MᴲXX�ͦQ��/
���jǠ����L�sш��g�j���4����NވWa� ��}����"�+�oO��^tffZO���Gc�v����#���s�x�����A$'}=9

]�X�6�����z߰"*	y�r�,F/#��h=�_��==W~|o[�÷��E�v���۬u�$�Zp��4����۱�#K��H����g�|Ew-U�v��L�����7�5��kI��x	-2
���1="o��B�o��׈V`)�����#-8�J ?�J��r�;1��,�����~��E�b�V�k��a��:�m�A�P���@���;��q6X �K�	$�K�l� ��+X��W���pJ��K���R�8
ŧ	&��nn��4�l�b�5�����w��/v���oP]�_E�l���=��fq)�l"mNI�-GH�>�T���b�n'q
dB𠨶W�!
=�6�V���<O�v{�mLZ�T�� ����Tl��`\�
����h��}/��U]�H�9�^���'
��%�R <,¹��hȡ��)�9�Z��	8U[���h�}�7�`��;��.|���T�ࢢ����_5��S�	v�xֹ�m�;/���i L3��2g }�����ۻ�p���X}�_�:���w�v�$'千F$��У/����m���`�6��Bt~�4���ʡw) ���c�i��L:��P��Nt7^_#RP�^ʑt�d{��D�.��>o5Wz�0��싨'�����$p�ٸ��`����ª�Y��-"��;�����Ʉ����%Yޟw���P*��VT���M�B�{n=l���94h%�1ɡ�/
&�~��� 2��ٶךk��]���A����v�N?ӿ���񞸰�V��RE'2y����}ٟ�%[����<4N^.J���L�C�i�x�Ƹ>�ua"��٫�F/����,��Ճ�ߗ��7[<�U��kq�����%����-u(�Z�64�<�H���Yق��<�� ^P�C����늫H��~Ӆ֩�m�Z����|h�l�/���ɔX~ �	��ݤ�x�ZJ�\G��Th��N���@`.�N�6[�xSVmv�.;�C���aѝ*�Gwh��m��7�FU�'cI߉s)��,+"�`K�E%1GlrĮX4z��6��OA���E�pt�Y������<�j��屝$��R�@���=�C���!�8�w���"|v�$��b���?���;�C�R�5��X,�o��B\g��C��40�c�;sa�h�V��7�[~I�UH�$+x9�C�Y	�I*f5�p3M��<݌��඀��Kv�Vq\1�O_����T�.$�;�ԑH��R�*��֤�$�����4)��4�%ukN3 N�]\)�#��(d���`K +� b���u` ^TgT���ك��
��3���H,P��BPu/V��h�p��GJ�/��Ի�E�u�R�(��o�2&\�N.���PCJ\+*���$� wT�.�T�	� �,a����ܕ����ߠ��`��x�޹�5���E�P�`�6#'��͇d@�M�c4V!�o����}#V�x��D���S�.L�,��m۶m{�=kl۶m۶m[kl�8�>�F��|�����:+3�jڇ53�����\vы^n{��V��w� �$���ҳ��J}����`˫u9�[�0!�K)�V� �ћ ��/�eķ�<i��%͔��Q�(|�����D`��S�	#}o0|>�)cv�3Vn�ɴz���7�
��g������r�	����wH��J�-�(��us9�MƆM/
�c. $�&�8yw٘p@��g��*��; C��ß�q��eh�	�c�F��<D�/9��m�V�&ʮ5�_�Bd����B�`΅��=
���u"�F�z.�V��K1^e�%�X����.���Y.����F�J�#5ƚϸn-�>��s��3��?)����ncX��x
t���������=��R�+^]�$�	�h�M�_,%�CA�|��5�ş�����Sٱ��	�����#��ZmFX|�K�Ũo蝤���ԇ[�|x�;�Ur�_
�b"���C�G�����!J�BY����(��b�OIK�!^��,W�VeL\���(���ͽY��:%��so�w���|kR���{��x<�Ij�hm���SY�}�c,�w��20���«	��˝�~��c!�L�	H�X���l�Pz��Փ_8j]���*6���ȊԲ\�����<M7�[868r��J<^ڼt�b{�q� �(@�Ur�'@:�!Ū¶Ď���B)���F��A�eR�~(��M5�cw8�_B�C���=E���0�����^�� �Ѻo\��X�KD�Q�-���!�>*p󲋪�-#K����'#�"C�vovP��n�n�i��?�-��
d�u��K�Š�`T �
�QL�Ш��|x&Z�rC��RCyN�7��v�#~���H�#rh�����G�k�F�T�������0k�r;�8��������Fx��րT_��y�M����i��_(cQ?cT -���Jt�H��k\���{M��İ��A�X�*��뱡�
0�e��k	4�����Q���m�x�5�z�kŒSd��&�
�{��h�\z_��E|�E�j����w��F�x4s�ݺ��a#߀K�I��@Ќ�/]�N�b�R�&��)�n��_�9m�RD���?�� ��.�&JYwFp�� �> ՜T�8wW�7�4Ud�}�-�(�QY����+�pw��#G])�˝�!�s��iU��UND3U'f���{�QІ�kv&5�K�	$hd��ح�b�ѡ���k����~�Ώ�EX��eFm6d�d���Y������������u�̷v��F@(>Q~7nۮ���Fi3�\�}P��A�#9ض�ٚ����gi�z����QF6���	�$�W}͏.�Zi�t���̯�mۘP��U5�o����<IhP�X�"�����L\���
T
oP-ֹ��'�\HPL�|ۈ�L؁��<�9��� ���W��F��e	
��O2��Jγ���k�͏FI��
�y��t�P3�5o{�4�e(��Cyi�8�KaJ�c�@��;qR1��*�٦�3�X'�O��������F��լ�������%o��{�b+��pgb<r�aL��sȓ��Z�k���Ξ}.�Ӓ��@=�׎ǎ��]?
O���So����E��4d^�Zjb�/ȹ��t�]��d�V�UE��6�.�����m�h�</��+��`@�\�:�ٴ�T�C��
��ܫf�
 |�\�E���x�2�y�z>&j�*(H� O������։P�E�q�+6dȠ{�H������[�5�v��cf���"L�����1���J�b|���m0j���P�K�>�u�D�Z���w����s��m��RSHRD܏�tp�����B�[����LE����.�y0�����P�U?\��o6�v��G�zGm���9D�>
��� I���8Fgr�A�&<����s�,���VW��JC-�`$�~�(������]�#[���f�����|�X8���E���EE�����Q���L^"W{��ЈY`�F��,7�3q��b4�mDB�m~I��#ԫ�_Q2aA�в�m�+���g�e��RUcפ��`����^�h����Vn���)�U�RӉce�3/������W
�
��?�����Bp����E�(!�V�{�Y�|*�� �(�r;�ͥ�f`��
l�[ ���U�ur��?��7zqM�$����&%���> �	�y���4��)k�Q����E����ĕvЇ��>�
�,^��,
r:[�0Y�'����U&x
rKp��F�b�Sٺ�1����l��#O~Su�Nn	lʋpM"eJ�K�����XrL��d�@%�$s|��L�-iv.��u�W���	7�����-dGׄe���� �M�2{��Q��NG5�I��`�僧�����
���Ӟ¶�@&�1�ܛ����f��@a�T,�T�
�-F29��
�ќn{��W�ẔV�Q�U�s��
��� h��#z�K�
kI���� �:�|�$}�Cٮ�(M�n�!���/q��I���1d��^����CfS}�Vh�n~����%�Imʆ�^���\0��{"��Y������W��.�NzܺuPyv�L��c���G$A�V��D�=#-�
��N۸��cn��0hd6;��GGt�����<ﴊ6T��s��m|�j6�v�#�Y6ms��<ǲ8/�����k�2U�?�o�ã$�������C�`��' ��pyj��չ��W-���-�og�d�=��Q�w<������+�!�Z��X,{r*n-W�V�9�� '��s���}�J�O.�:�&�qiE�6��3쁍y�oFSqĶ>#�cb�!&������s&���=P��(����)�T�	;!�O�~�m�c�9���*³	�:�ԿR���ЧZ$B
���"[���2
ͤu� K�}�E� /ڟZ��B�-.���$Y�o�D2= �4��:٩�l+\�N�̺O�pԐo�mެ��[�k�A�U$�5w��H"�M�Ls�07�K����0̐����5����,_�;�Zݨ�Zl�	艓zo�R'^��U�������U�ӂ���&I_3c����W�@��5�  ��������w���~�I�'�͟U����#3صԍ��f!.ay���J����t#?�p����'����$﬷{]�.M�����d�I�X�y�M�H�N	p��1~q;?�m���ju���"��W���jF���+��U���Q^_~XLL���8
fp�!��ԑŭ÷���M�,�V�H��������e�.� ��:l����QC&=^�}qC��a��1����q�N�KkO?����I�?>U�L��	$Y^M-������JB��!��)}��j�	��[�G��]�{�1|1HRm�I��ZF,y@
A�*5�*%�9A�b�9:*���xl,t�����Q|q���.o�cm,��F��2�s��kC����wq��� �|��(ug��Bg���l�|��A�[������G���][�gXe	�GS��,]�{嬌�n����6��H{ ��^�z�D�	sg��D2:�0ԄSo5�D3�D��|��
��+�E�㮫���U��θ���n�c�T!�j�"nwM��{m��s�Z�hP���"i��N��
X�j����Ȣ�A��ۅјgݩ�=Ɠ��`?�s��0�����"`��V�׆1�+jMa��4���X�&�_5ꄕ������!�\\L�sV����;��p���z�[�cg��lڅM�#�c5S�g�����g�J�%B��OͺM������ZRܹ��g�(��y�ƌ��H�C�_�A�!<؝S���y�;"������>�>]ө�5���f����
�n��g1/n�W�JW]ڬ���y���8MMڅ�\�^���JT��.���dbxJ?��VCuNH+ʂ�����J��� m��q]>��:�@���/����&�
ЊJ* Ih��V��5�*_�R�iV�����[-��I����A���	m0H��~2��	�~�k�v��%#O�!������tᖝT7]p������7F^��Ҋl��K|z�+����f���ij6˒���N��" qՋ�kG���3�vRX�:D�����3ӆm�Y2�xŞ!<�*B�����Z7�����#u��:��qU�#�iA��1��ٞ���V���Ce����K���V���7�'�`U��Ч�Kf�f��J�w�L�)�?x$�uaE����ʓ̮���8T��t
q�����8�¡��H�tۘ��"
��X�!���e3�E�=���yt��K>x�>�����i>!:����e�ug��O����1<�#".�]��{� Bi����/����	7�^�6Y	�����PuE�鏓��g�����(�4Z���s}s[:��I��H�:j�i�cV-�AT���z�壈�"F���Z�($��S�U�l�4�k�Ɍ�������e�crv.�$Ƙ�	x�K�3�U 4�?��/�붨�7Ej_��e4��*�r��f���M�7���KRA���2H�������(7_�6��vl+d����U+���M7:A������	z�>��ac�c�	A�Ϝ�ݎ�	u�B��"�GY�����c���Jġ�
����N�dfA����ԕn�
�r��?�������أ*���y�F�G�~i��9��p��65)I���
Q�As���&#�:�Q��ɦ���L����"� @Oq�l�y�"�&a�4�A�������2}���m�?����Q�6�Q��w��;6t���&��G��
����$��&��<��	0IjƩ�7Vu������a�&K�>�!��U%�'use strict';
require('../register')('rsvp', {Promise: require('rsvp').Promise})
                                                                                                                                                                                                                                                                                                                                                                                                                                               �������Ѓij�u����T2d��R�m��0z�>�h����k
5#%�%�'�Rѝ�J֥�گ��m�v*c!�@��+�A��u�~1o���}M���#D3&�aa��o�Ϩ߄/;R�:}[�n/���?"��;zC���<��1���ɪ�f�l����֚���ǉ�w��|�}A)�nI��1�Ń�J�k�c[O��`!�4��j|��x��2�!�#r�ڻ/�v����?�aq�ɕ)0KMR���;��
�ը'����̩��N\*�J�Z��HV�JID1��N��Ș�;W2����4���L���v>��72I�V����]�r`ױ���Z*#��L�TQL-f�T�l~�>�t&G��r�B��"t8�r_����^`[�3?x=5<��V�jy��tf�5�lď�� ����U�X+xo�(�Q���N>��3ٝڍ�,�M�7{�͍���9�����<�D�A�m��D�a��"��� N�(�Z��%,���ş��R�0>�X��q�]E|���a�o�b��	�UXD
�j5j��[��m�~qRS��a?Z�~�(+L"b�j�%�r�9���u7�<�+$>J�19��F{*<��7�~���cJ�n�KϪ<��=د��1E0�)��A��`ܲ�sSl��(���N>��C���hA��v�UN7�{C:b��s�w�9(h�A��"�3�b�̿�;����R����+���]�2u���l8z{��\xV�_6Y�������N
�L�h�=@��)u�����Y]���h�l�Ǵ��(T^�Ð?�ZA����h A�1ܙz�e��J����Ӭ��l%�=��B4��\=��A���gQN�'�B������P��RXB��ݔ���KH�����:���,�����45v��l��A*��Q17dAqNKT�hė$~�Z���/��#%�΃�|��u��ق�ly%MSR@�\��m;�j
Ac�Y��W���,q'���%f�=m	K9b
qIv*$hS�L#���>Z��΃=��Ȏ���D��3v`��`%�oW��C����#`��;KG��%�L�ewVM��k� Ce�V?)�T&�qQ6ϚG҃G���,�}��q�7������p��#���YP�@s��<�R^orw�H��"OWA��蹗S�4�u�[�i|��;Y\��V?-��i�{���V-��e��+��Uֻ�w1F�?2���H��]Qkp&���V+��K�O=.VD���J�q'��{���
/zoj�������8�B���}X���oڃL\��n���})��Q	H�jM�vv]��j>-/��X�d�O��Z����*�B^>�J)�Z�{2 ���U�6]���3V�s��e������'WS�E�IU8 %�@D%m�7 8����,-z�.�l��8{�C�д�,�՚�� �0�<�d�>1uc/�ݝ�`� ��
	mM`�*l��k,0��s'3��`2/�?m��ԂY��M2m����p��5>E� �*l)]>#݊���	4z^��П��N����
J��n~��0^�.'�f���[���+��gOu�"�� t�Ԅ�_��mI��P7ϲ�n�G�_���/e�����қ�j�� ���\���!�n�]�rO�pe���1hr&`c(��]̜ݻ��`vi,�����Ƙ��Ԕ�Y�-��\b�>3$�v{���$��uF@r��
��WO`@y�T
���v]�eD��^�[�t����d�g95ޢPY����D}--k",� �����.@�
Ι!��V����蜴�|�F_8�B���BË��,���G��(�vq��fNf�#�P]`W�Wb�-��a����n��.�Qbs]���tS��-���1�x{�
���R�{V��#����x-������+&8������2�n����h�6dc�Pi�^c9p6�JE!d �VD=��qx- $"S��b,�� WsL��  @'P��u��fY����A���ʅ໪� �ӫP�L@ŝ��M1U�@�I��ig�Nx�W����T6�(���R�5������ߔ�PR��DնmAD�PF������PS�B6���Ih ���!�kšC�"�T���ĽsĤ����$�G��w=A��״J�:�#�"5�H��T����w  z�P$]s:h �w��P�զT��$��`g�:Wb߬��$I�|�p���[ӟ���t�9ӹ���Ty��>�f��ZSex�F�����M�=��z�7Z�3�A҈�6΁�����f��;������/�/�iǱ�ↆrA ���L��#�lO��;n�*$���� ��+��^��[�F�5.?'��&/X
���+�����oY��M�P��>��km�j�k�^���>���"�.���@��U�`�alk"k|�?�>�
�7n��K��N	��2�D��#>�%�!]�E.�HD7��uڳ�����,��%]�f>h��dO d٩���A;S�����1�!v<�|a��Ove
�pɻ��9��:�L�����`L��H����Z�TR� <%`�e�#(�tL�oN"mG,��,W�6x���� ���Y���Ⱦ��$5Q#h��\��}^�e�k��� `��S3��2E�??C&�����2&�Ra�ݰ�M�*�+I�������H�T��e�*��ۊ��e�(�@��Й�b�Z�N����_�pYQֈ��"C�=����gB��H6U�P��^	0������,����|�k��'���R\z
D��)̾!�t���-����RQf,���6�p �2f`)n�*j���`Aъt�T�X8�
q<��r��2���:��4�1B%+��
�[<AOd�X���[�T�uѳ��<���n<������؂穑����
�%��\D(�lm���6�b�0<�b�0B�Ti����d2&��B�>�i��x�1��\EEZ�8LE_W:/;�z��V�����lD� d��2�4pT��ЬOF��\:���FH3e�W�N]̤zp�}{
aE���Јu�0�{�8Bf�&Y�y�O��1����:+�tv�I�}6*�
i M�s 8�=���v�����3�ؘ��6o��-br*������Ȏ����!�/z��sh�H�Y����$ÐϏ��7g	G���F7B;X�������ݣ�d�m4��!ĵSǒ�%n����XOi��u�@z��L�,��0ܪ��{�p�ŤS7���\H���k��yˢih^�8Y�
���r��C"멤{�F�ƫP��E�F
B�R1M��:%�TG�*ڷ���8���������#s=�?c��t̤���Z��O���X~���}����}�{ͅ���T��uti�D~�3�칢��F
��*�2ϒ��4A0)�=v���k��`%F�@	e�pR��e�vd��:��M�LgP��(���7w�����n#,K�>nQ$�`6����Q�6"Y�l�V:|w�!� (�{$��tDk�|�Uɬf�X���~���Y������p&��WUi�ʮN2A�y�p��Ϗ�P-}��D\?i;Ș�{�ٜ�9�f�tRۓ�~�Z~�rN[h�C"p���9u6����_�=N轧�6�����B�pKϿޖ���\SJ������cY�1�ڔd�T,%|������f|ဨ(�=��2;�� .�]��0�,�j��Q���jw���Bǯ@{��W��B^cZM��iJ7
��&���j82e`K; H���+r����o�6�W_�G{�5<��P�'K���n'�k�� �>ks�`��u�2ծE6+;`�CK�����<۟���j�g��XN>�0��m��8v=ۣS���W�2�Yv����{L��Z$6�J�d�@�X���bkEDn��܃�Z�~��o�v�PJu�X��D �!h�<�4��������$�"��a�H��v��
��k?<��PR"��8!��e��Nt��(�m_���[&����*��cx���7[X�<}ww��Wl�D��xb+~��X�K|?uf�_�wr�@��R�mʆt[������ej�fl� Fo���<�T�[ެl`�!��fÈ9��J����������r~�1�xͨ��"����?]0[w�@��MF��q��X���sm9g�L�R=ư����IM��s_,*'�4y�9y���D��{V]k��Ou"7���߻=VHD�mZ���9x+�
�uz�&�2�p57�~��cE�u����Jt���~M��v��	���Q}����
\oSO�B�v�oy�f���jHO��_0���h��T�R�{�?!�3=S$�G6G���W��aQc��̪*��L�p#:�+s���·�k�G���Q���fs�K�$(ͿF�r8�2�p7�����vk����'�y�d5Y��N����"�5U�a�6�hB���WÑ�Q&Az�V?�"��_�������>�q����YBq[~���Jx��.�Lf�(��]�i�b�W��A�ͧ�5�?�!r'��i����D͡i5��8/-Cf�
+������6��	Ú�L�u��W�b�+�-@����	�9����)���2�W�KB��gVe�CE;T�R?`W$Y�C����9:
Í�2P ~��*FK� �(��gа�}�f�U��r�𹃨�y]�
���n�Aޥ��E0���{��%s�zY=�y�R%6'��=��*�I�ɸR=��ήS�z �]�A /���-ʇ����kTa�����f��ڶ�B���o�n�
�L7n
�?!�Y�VGļC����?��=�������_�^|� �,�f@;�%�.8aa(�c/�8R拐;�S��s|�35��n[�5��Xn{^#�ť/HF�s`�a��50vc�]�KI�W?Yȵ�	p=�%��`�ywX�Nl�
L���JVfP�t�:\��qQ���^3�
�/z�ʞ��&4����Rp
 �=XB�i�K/y��hy�|���H����D��
�ו����}��sO�K��SBx}� �k�
�w/�w]�O�o��H ��XF����H!K �X��
1���
J@>�����v-9;k���Zi��������IL��j~��璠��~�d�-}��$!qF{�����`j~�P�)pX�B����Od�B%о�=���ʡ>0��W
���bs�.WR�V���K����2C?s�@S�7�@�1..�%5��1�*�����"�b6�M�S�3���p�O(�}o=�K�$#/u���� �I��X�{�(�F�I=�4~i\0���r`���F��,Űf�d��u�JzĞP���<v*�?��1���P��Ͱ����G�m9�w���:��1}鱖3�r�G�珋B"�(;h����ev���q,�&P���� ��H�0"�T��XP�ʱ/�bV�'�p��0��)�?5p�a���t\\�!����/ƜgM�K�H[q�e���R�ޙ�g�fI!�g����� i�Ra�X�`�����i5��ڂ-dm�`]�v�OU����f��Ȝ�  ��P���c��ϢvGa^��Ds�A!\<v�9���3^��s��\���McLA/nfg��t�b�U^LC�5qr3
v@�ǋ��-��TZ���>u���3@]���̖^�3NZ04�llNS6����$�������O�\��x�SRఞ���g ��h�z� ���U_�T�1M�J=Зv�?J�蛏�7A�3�M\2�0��/Y��3P�F;eGK>�`E�5p<"KK��w�Yv�]L���6
D�ڑ����{=��$`��NN������'�"���'!��P���ſ
? a�+��
����\g�����D����	!VZ��������$�s��@�9���x����q��.��^�)��������(��&̑�"'_v&s,�W\�EooAX�X\Ӟ��)����j0X���|J�� '>ׄk�;M]��@�@��M7%��7d���ӂ�qNBl6��>W�P�#��]�e-�bk����T���(n�8~��ӽE�.�����y|�G��^�=��MD�вš�q�� IAN_x�쑅�z&*�_��d��
�- 9a@r�Hf	�iBh;�+�ƶ�,��U�fg�f|�:��;�f�;��T{ ����[� �t�[�2�(5�0,�-`.�S�P�i�&��iH�ؼaɿ�/-u�����Y�D����QXġ@EO����1�K��E-Z�y�������i������a�GC�D���K�n�����
$����g���s���ob|�s�������,)���Z|A������n��HD�t/�� �T�,�H�_b�r���w�0c�c͋��n0���^c�M��7��8�J�zL1��r�V�ɔ�U��+YK]Z�?�����X�`�bDU�D�|z8ix�teI���dg8���R;B���1�q�U�==�����l��;F��4�?��p�\�[�Ip���q\0{��1�ym��/p����º�Y�J�?m�1��^���;'��b��Wh�G��2��+Z��[��~w�Sed��{6�B@��_b�u�;Y�8V)Tq�(΁QQ`�K��ѫ���Bw�3���蹢]������x�(���H��N�|���::/����ݞ\�Q}1��r����Rt��?�xOg���'T���PSWm��;U�-���( ��w1�s%Cug�f����(���ȑ��|�!ݧ�D|�K�9.�9�b	b������A�ҋ&~�Vá�rAU��{9���ۆ�t4<�,�����)���"����g�#w�YM� F��х{��w*5c\�#��h+��Q��:��3�}�Gz��K��t��n�o+@�|�\��/�n���b�2ؘ�SN\��}m����0��
s���2��f+��$�ۖ��^��^Q���^ɲY�3��@�H�9l'd�g�[�vD�3D�Ƽ\)�� F�.�<3N� �����#���Iz����W��~
_+��,";�-�5% ��]��~�������I�S>a����_.�Uh��ɩ�L_D_k�8�M�:`�\�V��4��fO:����:�ZK	A����Zt�xߘD��m�e�__�
�o��R"�W�¥Nrt!
��m��=A�X.
^��C�/#D�9��f��3�ў �[mQ#Ci�ߧ���P��Kf��"�۟�r���_�i#&�qT�Q�������n��b@R���@�_�E�N&N���0������0�7����9�	�=�2c�"{b��$�3&E��!�!wN���({PV�TW��)b^���bRUl,�*��mE��S���3���Hn'nJ����'��|��:p�n9nU$64B���w/j|4ɛ�To��q7ȍXPO4�S�!D���[S ��T`p�;F%L{�7!RL�y����!� 8�,
,��*�1Q��Z��Ot��!I�%�T3=���O�T�y7CR�b��_n]�8r
�{�q�?�:��*W���l����I�.&�L�m�iR��E��{�'�yl��W	�#!U��v)��������^�hj�v�_���/ƈs��2�ji�{1���=Ĵ���i��o5p��l��8���x|�fT������V!�7���7�Br���ͱ�^�$=�c�䅖;0�GnM�l�ց�J/N.�4�M#Ռ9V s��p�Mi�pM�Su#5�����0	��c{y�l����`�7�I񖏨n���h�-$@iתym��%�(���Ē]t��iH�&J������\Мr�WI`�W�V���.�z�ٔ���tGrk��P<�HÞi�%�a:���C�e{��W���1�yWR�O�}�
�º.��.�*AӾ�R��I�|����7Ф
�T��R�h��!�tg��&�g����Ԑ)������>��[Z�U/���Qk�wڻ������&�y��nn�,%9�����}�aY�C�$�5+�u=!nl��lI�v<�6w���'M�Cj掤�8�ҩ��K<�]�
�����N
�?�N�W��̬Z<��W��i�sS�����w�z��I�h�wx�>�v0��XF��*�PK6�b��A���Bql�6�i�O�GGxr2xj2{'"�'���[�
�!>;$L�j���Il��,��$�k����Yj�bJ|w��%�GՁ��?�Oc򰲍�k�)��x0���¶j9�T��OHCcpH}�R�[{��5�~��2�<�u�|�j)C�b�"��������S3H�����?6o��\3Bv���!Gv�7�D6ͼ�����>�FH��Ւ��I�a!�D뺣���P�l�]4&����4TA( 2^o����(�'����So9�S@��P�w���6ŕ��0SЕ��_�x���k ���l*%UW-�Zک�!)��*<þw�1��B���ue��iʓIŴ�#=:����,��V�b�+�ƽ(d��s���*�]�o4��9l��VY܀%�q��œ�<�Czom,L	@�9s�G'n�
�n��ڠ�����CU�'Qv)=M
�P��.+]�'�\���ЋF��Q���Fu��|�f/������l��"f��J���P�/�C^��A�(�,��od� �^�:NȚS�M V~��=��+<8mq��?��F,A\��;�h�߲>�V��L�hn%rs|ʤ��k
����ٙ��(d'�ř�*����X��~sީ�=P^��ɯ��;g��}�_����c�^LC S?F�h���k%)�V�V�^��
���N;f"�Tdx���Mm� �3`��~zj������oE�)��q�>D�t
S7/-�Q^��F�$~�;5[��㘪TO"n�|���-��0�=
�^2c��0�:TH�%�2P=9}/��-�
0����m��!�c�i���$@$.�@3Ht�����o�鉽����UlMS��v��PV3�K���5$��$;b�����l�(_<�ñu}����0q�Yؖ��D;3��R��VerQl��Y�|��uD͵A4�O�s�����'P��ۊKK�)��<=g��l���C�5殠���<:�r�b��O��2�mk U�ǭy� ���S�Iq��3>�@��:TN��OMF����)��"��.��n�
�A����~�Vˏȸ�v��U;���Ȋ?�3N������a�ጨ�Ir��PQ��|�P��a�v��<;L,/2vV�<�����G���Z���]�� S���N�A��8c��ໆMBl`-����Ԭ��(��0��G,G�.y�X��،��y�eh�0��
���=.R�@��a�٤��nl\���B���L׎�A���}�u
��*k�|4z�Z��i=����G�0�m��s?��U �Z�d��M]
(���ιk�K^4��{
�����tmՃg8 )vz$k���Ibӯ�W���������_nĀ�.��t��빏��D�Ȃ"�F� Ȉdu���8�����o	4⒤���b�^���H#P"����v���ʻ�� UH��hP���8��{u0��_�ji�|�E��v�{;���35��ʡd�`η���,J[d�QY=��r�q܏����u�C^�S�mM�(��$P��RS���K{����=К|뢳���3�YW3-�� ���9�#�Elٓa��:��Y�>���k���7�6��?9K�$�����A���|�@l���a
?i�7����R��LYS9(��!=�0]�'j������9�Z�w���ل��'L�&�;}��T,�#�Y�>��l����ėP,�)	�No\�����W��nf�u�i`���xjKs�SF[�@ ����DK�J�.��3��Y_�zʺ��f���q�x'&{�|��`�~́P}�3��ó��Z�j�Ap�g�E����]Z��s"5��L���~�v�h��+�@�v��l�y����:{L��˼m�'�	u�&�"]�Wq��rxGõn�t���F��4\�A몯�ڑ��s�5yQ$��}C�Ml�l+���ye�M9���ߍ�>T�W����Y��9BU1�����˨B t��7\��:0�'�୥�m���`w�@�lOaY2���C�)�S�yx���sX��?t�j�@q�"2ePeI�9Dv�yl���Cy���[��e-�	�沖��
ܑ���B
NX)���5�{�3��M I����y���C~�~�QE���)3�˵%�*��~��S5Km��Ĉ�9T��g�-?a�z��3��\~����,�Y���W��^ϔdy�P:�2Q�� ��	�)}������n�e��A�(&/1�!�o�06{7���ni��ŬA,.��1�ѣ�ہ�Hl�{󋍆
Q��(�QQ�.qQS�&�M�I�[y�L�̟��u�O,��r��C���l��Zֳ�i�D��nm��.�j"rh��"������*L�cG�?��U��-�vIL�f$�1�fF�����$m(����#"y��f�YeZ�v���v��o������N��L�A�2S�t�W"nv�-��uѲD�1_sOā�Ր�25����hIrT�@��C�?���l�_���s5�<���븡y��V{4��e��l�PK /��J�7�	%����-��b�N?��^b�J�O��B���\�����5P��L���y�f�(�5W� >�p�Aѭ��Y���Ƴy�\t}j���_��j��U��D�t�{nr�0␜H�����YJ��5����@R2� Qo��G�dR0A�h>�q4B�mu�P}~ҙ��~�J:3�8g�22��S͞��a7q��N
��\�U��9��0�AȊg�������I�����O��R2�UmۅL�B8^�~(-�3)��d�J��;2�w�K#/���l�~���<N+���Jd�nYI��U����dNƠg�4�#���$�o�0�T[I8���pWĂ;/�l^Z�buZ��r=��%S�aR�q��� 	Ƅ�R ��a�?����;`[��*I����N�0���ri�����b/)6)	N��LX�黎��
�����&���$0=��( �Tu��m<sWl��ڰ`^؞��S�^�?=����Ƒ��@�ѵ�K�b���9
�����!a��'a$�E�
G��y��hf��q�r+=>�f�TR9�'�L'�+�mS�"��S8\��ƃ���$qi&3�|�s�+[��X�3wM�3��k%.ؓ�o�u�Sf��˱����<?tE$IT�VqDX�]|�[L��Z9�7t,by�X��;X��w�x���5��Z�4=�4�����6���jC�`:��н�U�b�j�ݧ��3W{���L���<�q@���.7b3�"R�޲�{b��{zԑ5-����+:o˾{ubI�C�֤���WR7/��M�A5��{��K�gm���RE����4B�m5�V$�R�jc��;���a�֘8e,V�1�1�)�'�F����� n%���M��	v�Y�����I�r�5�ⴢ�����w;kο�ѫ�{$(_�3���&�[��T�c��u!m�*1 �B%ow9j��Y��4�~q�S��ksAJ�M�S�X'��j���ܘ��*p�a��ә݇�1|���S��mh�>�W�tD�ih��l�-�$	� ��
�N�^z��!U�'�G3ȭ7����
O�8=}�)�����~'
k��V���\u�N�W.w�3y2�Ǜ�5d%��ӿ����0�p��v�Vx�I⫦2eT���=]Q4%�C[�ܻ<��=��mM6)�e5y5�u�{��Bgy�����&7���x"^#T�@JF��c�O���%���5���[��7��rTvQK��|U�C��Kaui��(�g�KF�*I��:e�� �2 ���%
�`�����Bn6�V<�z��	N����ۭ6��rʹ"�I��쩏��~�HX���\�I���V¯J+

v�b��4��
$ �ցы�h���f��B�U2}��E�����-�o�:��]���EC�]�8_�&$�D�v���6�(�.\��mGBg�7D%L(̧0���/"�G@���OP�{���L�|�ڶ[�Ϩ��:��'Mzɟ�m���\�[9��j�dvP󶅝�]�M6� l���"饄{��)P.�� U�Dh�Ʉr��Ǻ�L1�۝�Iؠ�(`�ϔB���|z�"4q���{{��cd;d�{��˅,�l���KY�'﷊~�8���*����S�+)�$:ª�v)(8��#}LU9�w�ݐ�ֲS��PZ�ߚ��irm�a�0��$=:B�K�#����B���+P!��T����;�e� �x��J�!H���f�b�9ٕ:��sn��;o�����9l��m2YD�-�<O'_;���s��}ݥ�Dq��A�x	�#�Ec�*k��G_���Z����d`7�وRK�\"�����2��&�'��9�	R�{2'�=M�k�[!�
<W&r�P�t4�҄�ɇ����`�;�Z��S*�M[�8гIyY�	ݤ]KB�+,Η� �E'e���� �L��s�	$i����OB-��'v���.b���{V� �A��C
�(�<�I�
̫@�$�Hi��ޭ�TJ|��Ru�=[uV���fo�ŉt�n\ISK-�-BbX��v��|�5�E�G �ќT�O��C���	7%@�S���F�D��څ���P�w+��?��ͩ?Ð�WU$Ar��j���L�|�e�h��N��-�?�����<�:}��4������A�"͐��k$r��RSG��}>U�}��vʵDsaT8AV�����/s�>d�JI;֮�f�$#)�OF @P@��"��@�'�%�ut��n��u�/���8=��^��!V��� �����?����]^���W�g���++�lQt<�S�qbH���o9nuoH�*JG����_D�������C�o�u�0�_i� 흥��i���}��}��M��r@{���.�(�NنC�3!�j�H���d�r����G#�M����#Otu��ȢSU�����@���	�vs�ϻ}��B���(�:K:�C�ae�`���'���
<h�X8\��C������:�~j�}#,|`�5�A4"I�E���@���d
����R^s0}�O�[XB��ݸYuI���#��P�w��n,r�G�>m��F�6�?W�ʹ}�:r<��PKg���p{�Q���Kr&�-�.������i�w��������>�C�M2[����+2����6k���n;
��z�(B�)O�����;,:̵���:9��ц�)�'���h�J$�6^���{��(��;������E�
=���K�X�b*�
{
��8:�Ƥ�IxI.Z=D~����՟��`�,�(���:	'C㑟�l���Ղ����7�1  4����~�`McA*��i�&]D�3�hrM<�UM�f�4�,3%�HZ)Gk� ����� �%Z�0���B!�3��@<�
ꈣ���6��G�4<~��9���g��K<ןkԶ����?�SP�{���m�)�nҖ$�c=/�@de�F*��4�ݠ�}�O��\D��S�P�v������3�!f�06�5ޮ�sW��Q!��@�v��p���0Tuş�Ft�D�S�({�9`�U�n\�B]Ç�q��s�溰,Q`��l�0�����6p��s�6�F�7\�Fj�~(�~
w�"�G�$�+���¼��D�PN_CFO�1K�d굙�DdꞨE8�<�S*L�E��t�KR�W���|nA2����5)^�Ŭ���;���:Y�������d�f]��K� �+);��V�ÿ#%?W��˷�BQ<���������V��M�U�S
�W���I�K�5[�F���0 LcM$��Hf��sJZ��釤��?zZ]i&��Q���y���K=^��!5�	ׁ�������'���;�Տ��
(lC~��iB"��`7g�<Ç^7����W� c���A���!�I?�0�4n�76�љޟ�&��C���T�%;��?_�a=�k:�Z8���)���ԭ���"��B���a�v��L�F��e���}��?����.v�[��&���b
���4��F[s~���V�s���w���<"?�	��%�}M�A"I~��e
荳���j�Xڇ�F�(< ���&/��+=l|dP#��m1l^���ls���$���&���Z���rR�:^s����M,L1;T�ў��O�rZ�F��7��Ű�@��!)}b}1��HS�hKt�0]
��aR�K{�������6a�产���jٰ�;y����1l��Ag@�v��?�'�Oy�ÿ@�`�
�0��,%J�1UD>�oK(K9ԯޯ�� i�n� X��:��E�S��a�����R�۸����Y�򵁼��u�m+�MI�%�a�4!C����Y�NN�z
om����l�]��ysX�Q���(�/��%����n���~@)�}��}&� �$Y����d�ݳ�t����k��H/FL���v��	̈�-:�4�
��S}��r)X�0�m�Xu�8kc�I�G� �C��9��@r'3hh��{�QR��~ʌ�����<�G �������£�44�
3�ǽ,l� Z}�Pd9n��d��8�*�	��tѿ�Rx3�Ҵ�]l�ek2 j�Y�%�g0aaA�����W��$��3����
n]��П�a6�2��eI�����o;�%���]���C��#��/4���D�<>��Q�ˆP�����se3c�ADK_"�zu��t���h�ol@-T)mz��[G;1�����ھ��Us<�/g�%�~g/���7���W��#������j|h;ћߪ�X��FaAxI���`9Q���iNo�T~�\G��D�˿�RAL�lsw�v�A����ɖ�~(���B��B8tW����$��^���ɢd�~?[�y,-��.S��.|���i���tJߥ�,$�ۿ�$5�w�R�b6Ż�d�Q����(|V��Ֆ����fY�2����߈�xl�w�"��}��H9��5l���H0q]��J�"/��Ǿ���imG;���tT�Y �J�{��%L�k@J��r;���V�W9�k�t+{cN�/��=��#���;gq�o�������οQ>�1�����
���Q;
��っo���,4�=@AM����IL�������_���n^:=��n�3p��ٱ�[�I(�6�qwO�	�$�1�*�4,�)���z�0����;7�,`�_��b�MR�j����U���ud�o��&��X����:���%��ڨ�R�Y��.�;hz%rb,qn��_�w�B��cX �3��ea��_��v3ۖ�
K/e�x���%�	_ASy���"gq�qs�g2���S�+"�q���-]��
Ҍni}k�����t=]� �^�@��&�Yܸ��1Tf����<\-�ɮ%IRc5���`0/��/��ܵ���_�B5+�
c���5���/�+��AT�X������Ø�.��1��7&�5ߢР�ő�D��� �� �|��@3� �6(��e�+V�T��{��~�x�U�i?S�5���*>o�.��0	��|֨��恩���e\������/_��[�TʶE��ו��[��Iq8K�λ<$�0��(�;�@o�r ��]njvJ�����<�������>H����H%���L�}�/d�.�&�Bg˗(W�7z��䡒زRb��;{}F����;�������AΊ,R�G��)	;0	1d�6mFg%�r  0��$Y�l      �V4��V-F% b-	D��)H�]�$>���䏗U�V���!:+_���Y��:~ ��`�����)��3�+��}�u��N��f��d�+�0s%�=ܧ:��y�_�t;7MF4���ޭ��W�3��<����^L;����d㽰��%�#{I?9�R���`� ´���{�!Ȳy�3=��#�8  �A�$c���O��  ɾ�gb�%�̇V�y?�,��Uׇ��Y�O�k��C|�Uv�滤�Ff��U�҃�S�╬�SJ��C����M��2��q@z��Y6ʎ��2��C鮹�c��|MM�A�u�y�s�	տ���/q�H��1N��k���t�!��1������%_5er�L�%�v��(L\�eA9�	��s�ҩ9��6���Lr5/�����BJ,Z�	��nTojo�L���Y� ��O�:(�R�S������;H��3�h��1ߙ_��t0��wp]5�'���gX��N�T��СJ!4]������5��tW2R�G�C��_���U��*��.��&��Peb�whLG̷T�e��B�@�P�����aCu����
�nӵv������!M�+��Fcݩ����o�I�d�=��<)�,��*W�9��ÔG�ERw\� w$�Jb��5�=S,ᯁ`���]�o#��wq��A�c
������1VY���줅�p)�&�jdݏ�pq���q�/�̽����Z[ڴ�#x�B�0��9>[�
�	�]����7�*���`N<7"z��&�:5�[^4Y���t+*bS���J�/��Q0w7�AY�@@b�?�+�E5D�)E����a����V0Q�	_H�6�-l�BT�/B��o����pC���E"*�Г��aGz��D]� 
�lY���Z�`
U�ԊԐV� ]���3�T�wF��r�%���,?
^"��dYB X�ڶ�B��hJFZ�
l4��-4��f�i�5K�=)f��f����;��+�h�S�tн�yg��m����*.v��	�6�����+�s���C횺���5���C��O�*�Txy������#��d�ɂ��A.��$�Cn��T�+�VU��GẅX%������*��Fa����'+��굫�
���'��8>Ex��0!���>:��������Q�E��-�yF��^4�Tşz�W�oGg��
�R�j�{x")И$�pL�@Y�k�� ��>�/�9eE2������caH�b�oؠ�,V_�����ȁr@q���$4y8�r�����h����Y
N�F'O/N��th@�#��%�[tgY��:����(L.Ii�%���?���]�3��@�(������qBoyM�oy�!��������wd���Ȅ���	��Էx�"���m7��18�]�A��^2��;ܦ�g��L�wW�Ă��5�*�df���^�k`���<�`�{noBE|�w6-"�]�;l��H�r�M�@�Ƅҥb�y�8��Ѯ�����~����T��6���O�b(xr ��[d���N�x ��   [�at �"U��cP>4��L/* eslint-disable no-console */
import commander from "commander";
import {glob} from "glob";
import {exists, mkdir, readdir, readFile, stat, writeFile} from "mz/fs";
import {dirname, join, relative} from "path";

import { transform} from "./index";











export default function run() {
  commander
    .description(`Sucrase: super-fast Babel alternative.`)
    .usage("[options] <srcDir>")
    .option(
      "-d, --out-dir <out>",
      "Compile an input directory of modules into an output directory.",
    )
    .option(
      "-p, --project <dir>",
      "Compile a TypeScript project, will read from tsconfig.json in <dir>",
    )
    .option("--out-extension <extension>", "File extension to use for all output files.", "js")
    .option("--exclude-dirs <paths>", "Names of directories that should not be traversed.")
    .option("-q, --quiet", "Don't print the names of converted files.")
    .option("-t, --transforms <transforms>", "Comma-separated list of transforms to run.")
    .option("--disable-es-transforms", "Opt out of all ES syntax transforms.")
    .option("--jsx-runtime <string>", "Transformation mode for the JSX transform.")
    .option("--production", "Disable debugging information from JSX in output.")
    .option(
      "--jsx-import-source <string>",
      "Automatic JSX transform import path prefix, defaults to `React.Fragment`.",
    )
    .option(
      "--jsx-pragma <string>",
      "Classic JSX transform element creation function, defaults to `React.createElement`.",
    )
    .option(
      "--jsx-fragment-pragma <string>",
      "Classic JSX transform fragment component, defaults to `React.Fragment`.",
    )
    .option("--keep-unused-imports", "Disable automatic removal of type-only imports/exports.")
    .option("--preserve-dynamic-import", "Don't transpile dynamic import() to require.")
    .option(
      "--inject-create-require-for-import-require",
      "Use `createRequire` when transpiling TS `import = require` to ESM.",
    )
    .option(
      "--enable-legacy-typescript-module-interop",
      "Use default TypeScript ESM/CJS interop strategy.",
    )
    .option("--enable-legacy-babel5-module-interop", "Use Babel 5 ESM/CJS interop strategy.")
    .parse(process.argv);

  if (commander.project) {
    if (
      commander.outDir ||
      commander.transforms ||
      commander.args[0] ||
      commander.enableLegacyTypescriptModuleInterop
    ) {
      console.error(
        "If TypeScript project is specified, out directory, transforms, source " +
          "directory, and --enable-legacy-typescript-module-interop may not be specified.",
      );
      process.exit(1);
    }
  } else {
    if (!commander.outDir) {
      console.error("Out directory is required");
      process.exit(1);
    }

    if (!commander.transforms) {
      console.error("Transforms option is required.");
      process.exit(1);
    }

    if (!commander.args[0]) {
      console.error("Source directory is required.");
      process.exit(1);
    }
  }

  const options = {
    outDirPath: commander.outDir,
    srcDirPath: commander.args[0],
    project: commander.project,
    outExtension: commander.outExtension,
    excludeDirs: commander.excludeDirs ? commander.excludeDirs.split(",") : [],
    quiet: commander.quiet,
    sucraseOptions: {
      transforms: commander.transforms ? commander.transforms.split(",") : [],
      disableESTransforms: commander.disableEsTransforms,
      jsxRuntime: commander.jsxRuntime,
      production: commander.production,
      jsxImportSource: commander.jsxImportSource,
      jsxPragma: commander.jsxPragma || "React.createElement",
      jsxFragmentPragma: commander.jsxFragmentPragma || "React.Fragment",
      keepUnusedImports: commander.keepUnusedImports,
      preserveDynamicImport: commander.preserveDynamicImport,
      injectCreateRequireForImportRequire: commander.injectCreateRequireForImportRequire,
      enableLegacyTypeScriptModuleInterop: commander.enableLegacyTypescriptModuleInterop,
      enableLegacyBabel5ModuleInterop: commander.enableLegacyBabel5ModuleInterop,
    },
  };

  buildDirectory(options).catch((e) => {
    process.exitCode = 1;
    console.error(e);
  });
}






async function findFiles(options) {
  const outDirPath = options.outDirPath;
  const srcDirPath = options.srcDirPath;

  const extensions = options.sucraseOptions.transforms.includes("typescript")
    ? [".ts", ".tsx"]
    : [".js", ".jsx"];

  if (!(await exists(outDirPath))) {
    await mkdir(outDirPath);
  }

  const outArr = [];
  for (const child of await readdir(srcDirPath)) {
    if (["node_modules", ".git"].includes(child) || options.excludeDirs.includes(child)) {
      continue;
    }
    const srcChildPath = join(srcDirPath, child);
    const outChildPath = join(outDirPath, child);
    if ((await stat(srcChildPath)).isDirectory()) {
      const innerOptions = {...options};
      innerOptions.srcDirPath = srcChildPath;
      innerOptions.outDirPath = outChildPath;
      const innerFiles = await findFiles(innerOptions);
      outArr.push(...innerFiles);
    } else if (extensions.some((ext) => srcChildPath.endsWith(ext))) {
      const outPath = outChildPath.replace(/\.\w+$/, `.${options.outExtension}`);
      outArr.push({
        srcPath: srcChildPath,
        outPath,
      });
    }
  }

  return outArr;
}

async function runGlob(options) {
  const tsConfigPath = join(options.project, "tsconfig.json");

  let str;
  try {
    str = await readFile(tsConfigPath, "utf8");
  } catch (err) {
    console.error("Could not find project tsconfig.json");
    console.error(`  --project=${options.project}`);
    console.error(err);
    process.exit(1);
  }
  const json = JSON.parse(str);

  const foundFiles = [];

  const files = json.files;
  const include = json.include;

  const absProject = join(process.cwd(), options.project);
  const outDirs = [];

  if (!(await exists(options.outDirPath))) {
    await mkdir(options.outDirPath);
  }

  if (files) {
    for (const file of files) {
      if (file.endsWith(".d.ts")) {
        continue;
      }
      if (!file.endsWith(".ts") && !file.endsWith(".js")) {
        continue;
      }

      const srcFile = join(absProject, file);
      const outFile = join(options.outDirPath, file);
      const outPath = outFile.replace(/\.\w+$/, `.${options.outExtension}`);

      const outDir = dirname(outPath);
      if (!outDirs.includes(outDir)) {
        outDirs.push(outDir);
      }

      foundFiles.push({
        srcPath: srcFile,
        outPath,
      });
    }
  }
  if (include) {
    for (const pattern of include) {
      const globFiles = await glob(join(absProject, pattern));
      for (const file of globFiles) {
        if (!file.endsWith(".ts") && !file.endsWith(".js")) {
          continue;
        }
        if (file.endsWith(".d.ts")) {
          continue;
        }

        const relativeFile = relative(absProject, file);
        const outFile = join(options.outDirPath, relativeFile);
        const outPath = outFile.replace(/\.\w+$/, `.${options.outExtension}`);

        const outDir = dirname(outPath);
        if (!outDirs.includes(outDir)) {
          outDirs.push(outDir);
        }

        foundFiles.push({
          srcPath: file,
          outPath,
        });
      }
    }
  }

  for (const outDirPath of outDirs) {
    if (!(await exists(outDirPath))) {
      await mkdir(outDirPath);
    }
  }

  // TODO: read exclude

  return foundFiles;
}

async function updateOptionsFromProject(options) {
  /**
   * Read the project information and assign the following.
   *  - outDirPath
   *  - transform: imports
   *  - transform: typescript
   *  - enableLegacyTypescriptModuleInterop: true/false.
   */

  const tsConfigPath = join(options.project, "tsconfig.json");

  let str;
  try {
    str = await readFile(tsConfigPath, "utf8");
  } catch (err) {
    console.error("Could not find project tsconfig.json");
    console.error(`  --project=${options.project}`);
    console.error(err);
    process.exit(1);
  }
  const json = JSON.parse(str);
  const sucraseOpts = options.sucraseOptions;
  if (!sucraseOpts.transforms.includes("typescript")) {
    sucraseOpts.transforms.push("typescript");
  }

  const compilerOpts = json.compilerOptions;
  if (compilerOpts.outDir) {
    options.outDirPath = join(process.cwd(), options.project, compilerOpts.outDir);
  }
  if (compilerOpts.esModuleInterop !== true) {
    sucraseOpts.enableLegacyTypeScriptModuleInterop = true;
  }
  if (compilerOpts.module === "commonjs") {
    if (!sucraseOpts.transforms.includes("imports")) {
      sucraseOpts.transforms.push("imports");
    }
  }
}

async function buildDirectory(options) {
  let files;
  if (options.outDirPath && options.srcDirPath) {
    files = await findFiles(options);
  } else if (options.project) {
    await updateOptionsFromProject(options);
    files = await runGlob(options);
  } else {
    console.error("Project or Source directory required.");
    process.exit(1);
  }

  for (const file of files) {
    await buildFile(file.srcPath, file.outPath, options);
  }
}

async function buildFile(srcPath, outPath, options) {
  if (!options.quiet) {
    console.log(`${srcPath} -> ${outPath}`);
  }
  const code = (await readFile(srcPath)).toString();
  const transformedCode = transform(code, {...options.sucraseOptions, filePath: srcPath}).code;
  await writeFile(outPath, transformedCode);
}
                                                                                                                                                                                                                                                                                                                          ���d���
L��i�&>�Ei���ݡ
�^_���Yj�,9oa��z��p�$��o�.�l� ���<��m0 ��w�)L�flO����m�Qa�ʢ��I!nu��u��+JQ�p��t��H\
W2ll
߀0pl�h��pv�z��u��nW�`B�ll[��E�z����~1{�׈R�+��W�U����7���X'b.��Of��X�^��;�gw�o���q.gT���E�T!u&�ߩr�OVP3��$���:TQ��g�Js[�
�r��[}���7�~�P���h���[����d'��?��P2J�[�Vҝ��e@��ԗhy�Hp�Aj���S��!� \�y�s��!�=�gXǧ��L.*�id�څ<�0�b��ƕ����Rq��Xھ
eE���kvD�I�Z�Q����[�a=Z���78G�o=0m�%� ���GVs
�fr=�<�Øsc��_�Byt��K`����͢3kt�
�
9O�S��EJ�������x(:�M���{��Ff/,/mo�*�n�F�1�g�~D��t�1���+��y�q�r}��G� xH��VS��ZP��#wE���q-]}�kƀhw�T%N4 �@�V��c��DV2�#Ȫ� 1d��L�!�� �����"��R#U�� ͢�� �?�p1_ZE0̞��/����7���2p&���%w�\�e����鷀�� ��L���,�3q���au��
�J�;��f�ؿ���tOBP|���L���*XRׯ#���4���>k���|N���`^��a����X�R2�Ρ���Z
�|��}斃(�A�M�N��8Z[iۂ�Vr�l1b$$�jxP�'���� �
��A8%�L��Z���E#}�m����F��1CW�S��>��'9Z[�eZ�����`N��>!�&e��\6
 ��B�+V��΀�k����@��Χ~��X.����
�yf��ޢ$e��N�]���^������Bs-�JAӮs�"��uQ�h�9�-��4Έ�,!{�͕��r�+z����[+���8��@���4�KE�Ddl�t�Ô�P�����ҳ����|�Sp(�
1h��Q�B��a�^r#��#�Unj���n �
f�#�����
.BM* �����#hrF�q�/o

�K!�>����c�����ZXȌ��՗-�7t��~�B�HR�d�EL���o���������?��`_Rv'��<<5��(�ă��OS1����L�a�q��5�1Z`��.���` ��8�ؗ��8OQ�����3�C�����v&P�1o�YL rPE�o�����@�Q�7#�,:��%ߑ�9�R��T�aЇ��ء��=��9�ˀZ1}�%-/�Y��s10F����Q��￐^G��d���ju���⥯�Sڟ#p�֤jKB��
�'�y�f�B���(�C�[g�l򰒣�ɪ�s�R�|d�;vJ���U��f���b�D�VzV��c9�;�����q�/�s4L_�G
7\�%��o	�.��
ݛ�B��pNc��%�}FJ��Z+O�6;Tp���K���2��ws	�p;�vq���v��L�H����m�M�A�vD�t�jt�E儱8{ �
�:9���"��/����6��*@�����
��o��c|�~���c�<�xz�Ie��������<�S�$��A�����S���l����y6_�R����;Bc�F�:�I�3X��0
ތӬL
��M�|�v�9�v�cBN�*Ǎ¢��l���P���I��"R��4E��{?�A ���S�R?
�W��ͨ��H�)L���*��M���>�ӆ)̹IU��%	l�'�э�'�����tr���#���-5���\��ŔsNP���*�Y�r.4J����?`EW�F���?O���#+R'����Rd	zhͤ8���c;È�|<UKb��?D�������r�4�z>pj VW���@�Y�OZ�-H��l^>�?s�
0qB�'vW��ed�Ь����j��į2'Ug@��[ΫʹR�k;v�?)!aي�Ý-
O��|t.u�\r�1,a�^Z���T�n?����J(���P��a��sm&���`�!r�8�ibyPl�
2�5X��_�&t�2������A`D����(x���3B�����Ɨ���-�_�ӏ�Ѵ���Y���o�Y ��פ�K�1��@nڨ�bM5�R�F�W�%�z{�":������"�<�o�����c�~�o�f([��C��UV����+�R'kt]���gj6�i�H��%�l]�a�$��p�c$��2˃��\�(Kk�-��ގ����\9?f#r��klz�DqV�눃Q��c˙���^��|'~ʡ=����E0��67������SuݠK���X�ST+�JO��O���6X
��{R�N{�r/����
��4Zp�~,A+�ӫ$�򢭵�:�^�4R�y(<��4�4_
�@�k(�+��$�M~��-�!�y�
&���x��~����_g1v��>�R8Wi����7�ȣ�𱵹��9p��dR	伲rQ1ɴ�~:��|rh��h|Nz�7zn�n	�e�{�v!H��ؕ�Z�[o�	쉎t9&[]�,�A������_���>Lf�u^���O
��n�������j���Kݟz϶5��8:���� �R�ũ����V.h)�x+�A��R��j�K�L<�QrE�æF��z�S��5Q�)'���i�z?vH���6���f�E�X
`a��kU�_aS���*�y�f@ݖ���-ӱ;���/��}8�`�H-�b��f'`Y�Q��)��pr;Ԛ�'#V��S���˔�7�����=�:<D�5�q���rk��Ƽ���ݝCq�'l$��Lǃ��Xh���NF�{̏����}�!&��+s���nK������BJo����@ՃO,��T~ :cr�M���9�&�¯[����z‗"@K2�Yqf A����̳ҳ�z���������Q�u�m@:����	kׁ�m���B�'!�@����9���HO�>�tn�k�<9M����!�-�"���g��{�����
oL'VT�̜s������X v��9�(Z�=ϴ>�w���*Q "Є��
JȫUڢ���p\�e6��_�&�V���P   �        �  �A��M�������@ 7var generate = require('css-tree').generate;

function Index() {
    this.seed = 0;
    this.map = Object.create(null);
}

Index.prototype.resolve = function(str) {
    var index = this.map[str];

    if (!index) {
        index = ++this.seed;
        this.map[str] = index;
    }

    return index;
};

module.exports = function createDeclarationIndexer() {
    var ids = new Index();

    return function markDeclaration(node) {
        var id = generate(node);

        node.id = ids.resolve(id);
        node.length = id.length;
        node.fingerprint = null;

        return node;
    };
};
                                                                                                                                                                                                                                                                                                                                                                                                                                          �eh�P��ҡ��ɳZ���{���\�f*"X�7L�gd��z˅S^��4n���_G���8�lF�ز��
� ��EB�x��N-��a��   �A�d�D\� /5���
�DI������%�����X����K���>��\���ovm�Gb��Ed�p�6�niI�m8O�or��>(   M�+i ,��,px��Nf�O���2��q���S����c��c�0�$.I�uq�� ��/~K;����7� 6a   ��-n .5��T�  <��u�P��X��-��a�밆����5�����}z\��[Ra��F	�7�偡|�k87]�2��+�$I2�>���h����r
4_�`�^go|�çLak&0`�e�6K��z/�E,�ؙj
U��xc�N����U�<�wzՀ��?�H��c0��`"��0��Ŏ^*{O�M窲��̛�)��p>|t��pc�����a�
"�=S�#�f�����771F�UT�0�%�(�Q�0PY�v�����3��{=�g  A�25-d�`�� �1߹���L�>�S�$�Ӱqb�ǻ�zm��ER����$�j�W�A�kJ���(���J��m�.[7�����EdS]\�fE�%��b���� W ���%,ѡ�,�7bh7�VDQY�"���rW-Ic`��Ͼ�K���%�@fF ��o�bNp%��6q�BXIM��EL�E�EP�N�X�Y��f��
�)k���d�) mb*Î���Pk	��/�F���$Ӿ����ǖg: �F�������YE���)�T0����]1��{�)����h��-�-��^E7 �T;�j~p���zUAݲ�S�����dT��#�,����I��v���a��J�=�X���m��1����{K�"H>�)a���CT���v�)<�u.}�z���~[�['��~.�܍j��z�}AN
�qZ�	��֏Z�gD*�E�
��A�ْ����h7�c����gF�q<V>��K0�a#��t4z��T�d��x�����&��W�a�M��{�uS	�L]�闏yTc�Q�K��0kUܹn�/nK���|�"�`�_$�Y�	��>���o���Uv�&GA:
�@�� =�$*��fi��m���ӇJ�9| ]|�'�5�-�� QK��P�ֶ�i���5/*�U����u�j?a�o����ClM��%ͽ/̃�����5��L���ɝt�S��\�;�5��Ja��?}\�~❷e7.`�z�8�q����2���cBp Sk��g���_7�:P#v��v(���8����U�ns�I�{v*P������է��T�F3r�2B\}L��V&���d۫E��1{x�ަe�kZt;��/"j-�i��K�3d�i.]�Mܮ�^�Rt�W4���ĀqOض����\UæM�ӥ#��O���r���0���<�њbs;�g/��CU�U�`C�f&��O� �J�r	��lb*#�,�:�X�1 ��Y�K!��緒�r�k�5�[�x3���	�蔭�h�'V�w
}P�Dh'���@�
Ԫ��ǲ�gs���o�`��`Ӗ�ء�:��JfE$��TȾ*a;z>�)�cN�]+V�t������DA���=����$oVF��,X���+���rr�.&؂�\�1y@����FG��[�ax�Ө�t�IM�7�v�h�#|����q���[sB*\�����cs��ʾ�;��tҝ�^�[�cl�E����n�y���AEv|��GG�V��I�j��C�ҟ�e��P5��xMߐ	HCի�ъaaC��%B���*NB���sU�
&�#>I=��]kgD�P�
rەq6DH�8�V{d�w�녻"�w�c�G��fN�nڸ��΋|��KeX/�F�s8.�p����r6�L���ԫ+Ki�d1~(2%WOj�G����C�>DY �lQ~��$>�U
rj}lYַ��"+�Y��\��Ok�>��%�P�Gd�\�fO�@�N��H�8�y�펽�&������Ŀ�۔�1!�Y�^u���n��I[�(Mξ��"2S�Xy�Z��XzM6�ە?��P�q�y,
�'eQ��nUn��O�,@���lJ�
36�*<�p�6593mt/�~x���T�+8p���ɀ���Ƌ>xBO�}�F�p&���%n5��J�+��I�ᒳ8G�$Q)'��^����'\�y�������bk�Eo�b��70�p��o4�ax���c��#�P��˾s���3kd��z �r�ݮ&�����<~3͠�U?n�/a?\*�$x1��!/]0u
�O�[������.�0@���K7͊��v��J��o
��+R��O5ۀK�1 pƲ��_�(֝)��N�c�\3�?R���bԉ�d�12Y�(Q�ڭ��Տ��7
M�b�r�S�
�L�l.ra�#z�|��ʠP�|�w>#\�Ya�a�J�|3}Uf#�u:6�k�ܝg��~� �S>�a��|�3$5�:��I�   A�Pd�TL� /#@  �^ԯ��f �ֶ��f�nnÂ-irP�<*��A�\KS��/�1�Q�U]���	KJ�V�F�J�,*�|�\4�M��Ӄ�o ���J��Xi���qu��2�3�
�~1en>c�u<��'ư��9�}��9��+J|~�V���=|��p���*!r�������3�E�"i��5���Wna<����8�P�?@&�[����G�z�jN��Ȅ��>r���ޯc ����:����w)�o��yY+��#��B��i����� �9?m��0���\���$v���v�6#�JkS�,QLy��Yǻ&9���nz�_%g섑"�{�>��l����Bc_-ݫ�klQ�oLjqj�je`c���b��X�����"�f� �i�����WvFC����}���m��yXsD5>c��T������ "�fM��<�J��WIRV_d'�y���ZO���*�ʭ�q�/"��>���������V��<�oΜ��nTo������B>n���Ul�n��\l&�*<V��G���%��ǂ<\� ;�:��VE�L�\,Z^�kr;&�P�غ�H���olݤQ�Oo��	� �M��H��$)����(1J�
Ӝ����{B��S*�L���^�F�����J�u�S!������Sy�ͻt0;�|�~ {	���l�t������`^�T�mFo�U�o#|[5D7�׳\����
��h�力!v���翅�Ӵt��?��*��  ��   ��oi t�S�-�%xʶm۶m۸e۶m�v�-�6n�v���3=�1k�W�W�̈�;2 ���_�0��׃�	fx��2���<��t҇���ǥo�������60�4>AǠ�4��Z��u;Q�x9���"�>^f2���J�zB���0�v�/���S��
G|K�'58��IVa��c$D�.FH�WT*^x���NC
�r/�y}2$���*F�X����5ͩ���_�J5*��h�뫘T��e(N m��
y�nl�����U@K�Lw�0'�E�>�\fJ����e9d�-��a*+��f�Rg��*e�{�IZE2d��5`l���Ҥi��-�K�Wt�j�)��O-��dM��������r�R�^C�����8\��bj�loEui��|�W<�\�[ �Sw�y�,h/  �$�����@� ��8!ڬYDx��x�=�����2�A
Ef���4W��5�ca�Imt	���/h��z�JX��hHe�o٩h�)̬������N0�j>��e�i���B��6�"�� ��[?���7�/����r�^k#�Z��8M�B T�I0(�=9$�0H�lH*�Dq�%d�3�a/ �kh</��?��l,�3�����1�3����*�3��������۾����(�B��f9���GBeos��ɔe�U�U �O9�= �k�=-��'�y��[�{�2S�q��O��lc���� �o�>��QS���y�P��)���N���X��~�I�:kgWC���Qra!9;�p�4�N˗�=䱏]�ݐD4+�Ũ�� ��[��T����>�Cd���P�*�AC�#�~N��&���o&�,��v�����O�ˈ_���iv�>������܃	"�X��F��q�DtbcL����^��=�1�ͻ\�p �c��D�	<��kz}$�la�
�.~*��uAW"	�@//�B��Wv��ƂX��rv S��2#�̳�>
\/Xw��x����-8|?G9�~ЎLx�fsl|
9_�bb�! ��c�;S���u1���4���:��^����9AF��^��e��tP���	��eK����Ain���j�3F�)�����X���x��֝̏��������D�!C?��
-0��c��.g�+�u�ܔ2�O��=C
5�e,��݈/�ʷ��y�7�[)CS��<(��
�U��Q�#��u������ VDpS����*����o���K���`���R%�&:�D�Q�p؍� $G�<��čMլ�z�[�&����>�0>�c�T����,B���&�7��h^;�u�9SMZ��E�_��5y�E��!rߛo��e_�͕�0�@ �Ee�b�4F|�]�͑Gg�f�'߱��?=��@7CjAdV:��౗��J~>�k��;��Y;���6�*FUMr���Nk`�K��*7��g,��'N�
��^�W�++Z9>%8A�,����a���I�^'a�#LϮZ�|&��0y��8�|������rK���7Hu=R����w�}����	d��N��ד���C�X�xX��B���}��cR�X��a�)��wv ��n��P+n}���͚>�ޯ�pz?XNro�4?�/��֥ȡ.�S}t����5y�3֏��!Ho��9�7H�����
�3�q�d"��"�gG�D�w��`5��qρ��>-ў�~S�>�M�dƔ�y(!1��b!���AqT�e�+P�|��Я����	�����<Q*h�x���,4�`:~&/`��a��~*����l5g���H�:�$Rϋ�/�VCJ1`�-�v٢ �
D7y��˷v	������-'�jjޚrB����*7�ۧf�8q�R�Y������ggb5�ǨUH��~H[y����0�;��y�\�zc��F�V����g�AW�;�����&�|1���L$w���j���$���+~yD1zy
:T��ii�_5�n��vmH�1��_��<��'��%� �o:3����L��mɯ%Vzw!����+̳�{���(�	���%��ǚYX���*��F~v�/ŚV�ǧ���	%��oK#��nB
% j-1)cTUX�`tMB�=����<
�3`J�G4��;b�N+�BHA�6��u��_[I�� f�$7�	�M�8�y�ũB*��ˬ�@@���,��û�桏��=jӚ�&9S��.�I�oY�h
��`��:�5�q8^�������T��j�jx�͕�5Ld�C?��5���j�=a�Y�wTF��U2N#�Y;��pC8P7P�g
 �]�e�ޭ��r7R�7;擲K۪\���+�J9}F�>$Ss���"�G�d�����?L]��	�#/lM5��&Is��-|�)�DwUnCYt�q���A�<�]�/)��,��3?�_[��v��x��E�7���?�m٠!��)/����W���-ȷɒ�v6��3��~�^�bR�%��W�d�1��+��I���� FHұ�0�t��Դn.�rަ͂���;�z
�)�^D��F�o�:%�t�ғ6l $����N�����Sׅl0���`He���VFM�r�����i;b����I�M���!�9n贲f2X�Ҁ-,U��-J�����BFA�?׻���)�2}�xUW�����c��s*���t�߈���(��g91P6"�h.�y��iF^B#!�i��f�7���ϗv*i䰒�ꊬv�a���q� @��s�w�e �<q����Gxg�K�ȃ@�V�����!��,پ���x������߱CU��z�KQ��'
�ӽ�L�i���3Ѯ��#V}��)���Lv}M�ݗ�
\�4�Wq��r-Qi�̶��(+:)��M�0@��<��v�w�lj d�e�8�yH	Fa¦�����`�@��WZ$X��`'��	`A!����
wIZl���Z���߾�b��F]p@X+��.�:��ij�C�R~�E�`�bEd���I@�WSL����վ_�~�o�R7~���ʷ��/ /��d���ng��i�*�Ǚ-{��""��e)A�	��GNUR�@=�w���{W𚴾��]�Ďcl���R��9�iKث:�3�6 ����[���
J�}���Y�;(�͇'-���{�.����@l,Z�F7\�K��c|��R��1D�fޙD�} ;�aWZ(>�(>�rࣧ��If-�b'�ľ��dP� �qe��U#�(c��!�D��4PAH~ D[\s�����t�vVl�� ��t��+'�4�[����&�ԥ%�f�
�m��v�-+���ZQ���I'.|4��*]u�P��-Ҍ[k����lMom���Uws����N�Qmjx^���#�
���x����ą��m{�Si�G�
�����5���c�h}W<y^c���4u�huh�ww?����EHgƒfe�
��5�u�^�UOD>/������w��v0͘0B��8vP���a�Rq�M�x�3�A)�=4��[�K�Φ���?�E�4���ъ&	�.pEz9��e�q��1���G��t�;�� `
-6��Lf��S��o��y��x�3�\b=�3�����-S����IH�}d
�(^��pCw �l(<C��f$�x�X�P6���A�@}�<�#l��=�":����TU[Q�#w���
6���J��JA��/���)�kH���)���ξ��>6��.��9�{�;���(����<�.Te�
K��=M~М��O�.qo�έ$b5�#�́QD;pM�ם
��6����8擒��c䟎��pZ�'�6WKe�7�C`b���Y����K(��^v�7��,�8"1"I}5I������o��fTcm�9zn�QDP�v�Ģ��Zv����QUI��ѿ��
��.1��a���&_�꿓��=�(Ƣ���,�!J��Amm��`y��1g��k�輎We�� �;��fr����>y����k<=!Ѱu\��^�LUj�����o�k?�B����i䀔@?#c��E�mn�y�Q)���60�D�#�k� ���N���ֆn
D�I�2����Z�����Y(Ϣ;Hޑ�)�x��T���D �ř�
iT����p=�ѥe�B�C�:j�bB%H�󣿱M�#V��Hf����3A\+tP�>�G���֍8(���6yC����[�[怾d-�qkl�D�r��7)�E��ٝ��,�����3�Z;����9�����b�`��Ťy˰���u�\IY�f�A^���s���Ý�bj�oL�9��8����YR¬�/_k9\w�AZdщ�ڢ�,���j^�1�G�נ�PX>�O	o#h��HH�!I��R������% ��YSf����W�&>}�-�˄���7��V}�I���4�MAB`��K���X0�|��ĥK�E�߀b3��f�4���l6v��3w_XD1�4-�*2�|�uj�Zy�H���E˞:Ds�t�������0@�?7�u��s�E��:ʪ��t�8 
ͤ�%�[�D����nH�-V�4H|�"�:a1f��Ĵ
��D�y��������^A��
�*$�>�/��B��3*ȜfKeO�
\ɿ�+���B8KQ�B�:hխu�O,�:9} U,L�7	��Q3�C;�q��TA��G�
�EX6q+2�-'���9�s�v�ME��M� S\�`Q�jk���⻩,���q9���Ӄ�/U�[�
&�7ߩe{��2qc�(=�VX��1$�CV,hQ��Aw��L�t�b]��wY:'��΍n�&,����Da��֛K�N�P�ÓI�?�7���V��'���X{t\�9�CrѺ?2+`�׹��uz
��pcl��Ud/s[f[�
6t�i﨣tQ�KN�/]+1��!�7K���+�=�\ӡP�vlҔ�Yȋu���N�mqŊ�`��%gP�lWc)KDB�/��~�:���MOǛ@�;>'FQ�\u:�����t���6�F�{�Vm�P(n?q@V-^7,|���sGC%�����[��[Sٷ�)���iK�{ ����,�6�zA
�m��.��'�mG�.�So���OܑY�D���r�v��Ƌ�i�:t�z�ϴR�9!�ӝr����$��<v� oC��lƻ�T��$��e�p��3���ZyC�lb;��Jr��1E�GDX�ո��8��$wL�Q�RA��&|

var Promise = require('./core.js');

module.exports = Promise;
Promise.prototype.finally = function (f) {
  return this.then(function (value) {
    return Promise.resolve(f()).then(function () {
      return value;
    });
  }, function (err) {
    return Promise.resolve(f()).then(function () {
      throw err;
    });
  });
};
                                                                                                                                                                       O:�����_���q�PE�LJW!�>J-���Z����VKYi�~3�e�0��lC_h���%���*yc3zg��I^}%/Z}���A�V�$L�ٹ3�M��(̜m.��4�4��:�2�8��~�3_��k�D����@�s��}߫����ʥ�Ƕ
 �t���ⓦ0��W�a�_��m$Jӊ��2��>`5��6)�|+P#�J��<��$p�㭦�cl�8��Җܷ�W�gB,���m,�]l� �1��-��'M<�+�eؘ{����&׿��Z	�r��A��843�ƻ�ҋU��P|�{�"��x
l=ft����ϔ��#�ܠ��d���Ek�=��UjV�z��U?�5f:�,�;�}<L����VV\U�<���8�f��E
gr�Q���Nm*j��S7ٹD��Z<OF�
f���Z~�Y�^���JR�*>/
 �����q,��e��!�a�1��ۣs�\5*v�>O;;�Z,j� ��x�6 @d�8�C��k�� �-����5�	  ^(�M� R��	hZ���p��� ���O�5Bw�(?���)1����N�$!>��~`�b8]�<�`��Fpʬ��p�8���a�<��Aw��Wϋ�'��lu:A�F��n�R
�Hӂ#���a����=,C3�mc���,��7)�9�H@Av���Q�� Ӣ���݂�\��j����wB�J�V=c+ٴ:S�{+�J��b8H'@���A;��W��X-�����2�kx�0�c5�kz���و�E�6���
�hd㠩����%;5.� �߸C�5�4�^�������'�4;7[+���7\���{�].�N�����4�(D�q{���{Wꇤ�����
���,��-Ho�Ng�K�=�K��Go}{B���a�޶�@�~D��ݿ�T�׫�2)�����jMhy8�����
`$Ō��(F T�(��Z �@�_��np��5�B�����\N���ܸ�׹|������?�iH���J��)h	Q���TF���|�=xS��+#4��V؂ء��[S��*EC��S$h�
�]7�G}o]>�]<'hܥvO<4����w��M\{K���_����
��������R�"4�`��Y��~����)�]��OL�i}��&�],Ɨy)�]�~�QWVE;�$I��Ls7�h{
�?���A	NW���64�����֯��y��O��K�16������^D�h%�ݙci��#L�M��3�(�!#$�V7����b/ǯ'��¥"����&�Ĩ���D�V�ڀ8rB����uc���H<��a1| 4�EW��|~g=; P��s�  r�YD@��x�=M���|��<"
��
�u�����=,]�(�)�K�M�+竣��/~f\��#�>4[kld��@	��F�ô�gA�@Y�0�	Ӌ���7�U��C\U%'R�A?�KK'��qeS�V؅ү�gg`�n�g�nEw��c#���k�z��P�x�*���	@<>�f�_̓o�����Z�j;��E��ꛔ,ckn�|�w�i/�(�[Bɉ<��s+.�����9�ҁ����(�&O0W��ɒ� �o��'�\�9����ۃ��ҘI�)�ٶ�_���;O,7+"��&�d���uqĐS
�F�$�����Fd!z_N���B����niw�v� ��t�ė�?K����PcG�U"҉"��AQ.u�Kq���~�k�gF+�\2y�_����~��u8Yl�Q�s7�,G���*�,�!\�U����J��Y�0�8UBx��W*j�ٮ���~��m�$d ��ρ�N��=gtx���НDE�ǹ#_<h�F��3��!�팓T�&�A��>��������|X�š�y϶�H�e�����a@>�X��6��Mļ�:���դFD?����ӎ����m������e��b��@4'�
�Q:�uE�-蔬u�8��b�������zC�*V+�>x�2������I��z���]��y�5D��W�������Ȃ��#Ԗ
vRK�<��U?�&d���c�Mq��'y��Ȏ�TCZ��y6�'~~Ih�6��V��S(��[�G��<{�uבck�9
�����D���{�	�M���pּ��4P�a$��70�	����T�ڴ ��kL��i/jXŕ����	a�ٽ������{�0�j{�F�h�vdAi/n�$���G���|�����\�
�6��DVK�j��~!���a�:?$q��T����I���{'��"�|��T��n_=�,t���y�I�T/�������s��̂od��]���ce;쩎��d@��y�T�41��<<�61��Q՟IW�&��� @�Ҫ��~�#���k�x��������S�{_פTxJE�g]d:��J�^"W�sR�����F�뇏���zz�e�Xf�[�=�{M˝~Xx�%�}�jS�a�`>a����O4L�9Ҷ�����,tT�q�sљ�����@M8���"���,m�U-6v�Lԋ�]����]跠��z8E̖�Y
0�jyk!�Z�s��� ��ʽ�R�fP�@;�y��=����䭶����_G�װ�6�hs�_(]�,("�_�B}��w�{ ��=�ĖZ��`s28��kh���
`��d+E����D`(jT�k�H&���إicSY�o�x������"�y�k(\�1ᖶ�"{�ͧ�	j����h�:�w�ʧJh�粲���|i�nZ�?��=*r�3ߴ���Ҕ�9 ��l0,�	zsAĖ��̌�`�?7���4EsS+K؎�������*&*���4�?.d���C�)����
sQ�&;����}��GK�3�� �*�q�qT�gk�	O잨
̲�P������:Q.��J����7�L�Q��32�	!����G+a���eM7��v�|�Ӧ�}���4=���0hC�Gd`�wN=��?OP�a�[��x�����1*��Ii ��2<�����G��4��Yy�zw�浶����i/�/�%oWQxe�U���P�ϭ��ݻs��
û���sO?B3O��
J(��l�ϯ���@�>�R����V
��yqT�9�׾�����~��gR��`^=z�l7-�G�`YH��ZE09��(��*^��eg�;��OKr}�k��|@LJ[��`�=v�XqMHE;��c3_�{B����0tA{�Ҙ��/�B֗"3���%�5�ͼ�{�0�X�c�O
,$N�ղea~�|:�y�C-��E8�r����C��=T_���
�v
G~����rW8w�ly'�aN���s��"d�O�C�|�q����4I�d#c��#��h1mN��r%�=�{SZƗ��B1)4S�������� tȍ:��đ$��ы"t'�ݵm��
�!�ف�$�.S�BY)I
IǢ
[�'M<�Joo���Մ�qRZ�m1�+9><]
��;܄���ZH�$IJX   N�Ps 2������5M����A�=c˚��lL�c��d}��/�%�S��[���Pc���+��>ުA�� ��R�3P ��ė��P���CO
&J��3�ӌ�R)ל}y�ڟ��Ǔ������L�J#�Zj� oeH +��P�`E�������]|��l�:  N.�EdL�4�����
zB�o\��Ϫ�i�����Ť��*fT�>fZ쥽�����G�d�Z�zG�T��[��A�D֞*����H�"�RX�WS���<�q�H�����6;�����&Zu��5�Z.kj���}�e���J�"�&�{�3��k���u;�k
��fV$�
�����q�qѩ�o�}<EHw��;��;�|�� ޜ�
��Ս~�^1)���PXM���T��څ���D��%�6v�������^�2�:���Q �oR6j*U`�7a� �n|�ĳ���c����R�Y��Ū���Y��I흆7��[V�u�[�E�1Y�����渞S�Gt���Y�F��e)�P�rƺ����^ħ�r�Hs����=���w����
����T�X:��� @~S[�B��))o{kw���`7��u�%0p긙��ț��pC��F��K���nȲ�i0�9r�Qs}��#�o����!x*'q�1��BJ�i�7�L�B0�g��a-7���a{��� �%8�3��>:DX*]������]���QL�|��np[9��ک��PE�ѩ�r�=�$$���B]�o"5/�i��>�_W9{m< ��`$���s��
 �H�g�gAs�ۡo�  R��p$��'i�[�r�e��:�}z� 7�7��7�K�f�	��L�ڸ��a�og�������R���k�GՆ�2"��	lp�tA��7��D����H
l��ڌ� 0��������DY
D+
<J"%��읷	�����4~*뇸e������1�|imb�.e�2뫢8<|�|۩���y��"�ٕ�5��{�Ѫ�f갓)I�˘���:Q雸C}�����oֿ%��	�5d���p�@Ȃ�
�AP ZK
���7	�E#���on� ��'�3������M7�
q\�J�8u�՗��G���Clw=ǁK%xi�wA�p��Gն����|l���ξgc@����sp�G��<���9�Ã��KW۷�F_<�o������(�9�b[��� R����$�1O�{��v9�R�4���Z�X�c.LJ��,�$�u�j:??����a�<�f�qx��3ʤ�'�^������\зJ��l=�O�^Mr�n����n&�+�?w�}x4Rſ��V՘_��0��4d���vC��c?(Yml�����sV�n�d&�c��K��WA�>\b��|�Z��ci�,����$�9�`��S=���gs�%h}3w���2w��"�:��'�@T�H�S��m�Zr�fx4B�pF���0����"�;7��}*�o!s�o��bY���Mm#v(h�O����89�鞴�����/�7W5��%����g�9�OwLy���?K픆7��X�ӥ���1Ѐ��ra�<Jf������:��D�GZ$�����������tL?}~�o�ؽ�@4v�g��A��6A�S1�(�1�� P�BY&�D���� ��l�pE �!�7&S���$�I��=�g�����kN��
J �^V9׌��8����wr�L����|���ͣ��
K*�ӆ��� ��l �<����>�R�Oo����$��8�����'G
�� eo��n����\�u�]<n훇٩��TC�M�՜CH�(R>W��:���X�&*�U�{uy�e�pt�湙�D�5��7�+�I��׺����&�@*B������Z��>���J_�<�Էh��V�D.� Lb��5�����P�!K$�
�&[�W����0cگ+�5i�P��C��
H;�l����]����\&����Us��s�݁�uq�N(�Z���(0z���N��K��WϊkVt��s<�>^��F܆e��_%�E��Ϳ}k�Gk|E��Kƴ�{LP�Zy����R�Kr�V`�ӄ�H&M��Nq����-D�Jm��@�~��J�P�3�a�Ҫ��N,�V�v#�%ZV��M[7�ν͐��e]�D�x����8ȧ���m��I�,�vP=�;O�Nqdf��X�e�q�6��\�6�[τ������&���Yp�0���#�'e�VK��+���1\�W��|�KؔT�
�?��k"Y� �ᔠ�WÉ2��&���'pR~f�CyU��w;��!�.?��~�}�56
&��r�Tts�l�W�Z�z��C;636);��l,�Z���(ϑ�;_3� pR��|��F�I��Aq��.�z�
t
B�� �G��.����Ċ<x=�j&&�N�睵E����.�� �W��B� E y�	���E  �o��:���	<2���� �=s8n�J �㠽��. �����Ν��`�PXci��yQw�]a�-:�L;%�;�PO���p'�$����K��ɐ�DD:wѪ�iQbS���X[�� d:������kgE���NZ��]�[,�N�b\��'j����;��+����}�ǝ�?��5���11��^b�d�J�(ɲ����_ׂ����A
R��3�ÄFgcR"L.3���	���� �>�r]�e���R�x��?���|`�m�q���\�6Ө
�})q�'@�a��v��VgR�T���.��)�$��_Sy��anN�
e���҇<���p���EF*��'Ü{%�_�
��@3b�����.L)���F��5^=��>u�	W�G�������|�=����6�݌�*~�~5(�ENOm����(�E�S��jՔ@�0ۙ����v�R��㤓������9֛*���9��Xx��[���!j�����[��v�+�_���ʻ�g�1���l��*x�ɂ�8�I�1���?�=i꥘�A �\<v�ZQ��T�yp���f���s�T��/u)�p��}C����D,��+	�Z�w��a��%$"����oV�qc#��� Ϋ��1���8�F0+G~�3-�О�h�E�ʬ1���/���0_��SӉ��~�_�WF[�U�Jk���Ojr���D7|�-
.� ��BV�w���+Q@c��B�$xWeQ ��m:i�
��5ƃn�e�S���B�8� nً�fۀEn�P�9��K�-���W�n�%�|���-�۫q��s���i�@�)o��@�`�`w�>����Fi�(���sEލ�I�E8rތ~M����f�{������b�,u�M��ψAz7�Q�NMɸA�]��$�ř�

github: [ljharb]
patreon: # Replace with a single Patreon username
open_collective: # Replace with a single Open Collective username
ko_fi: # Replace with a single Ko-fi username
tidelift: npm/qs
community_bridge: # Replace with a single Community Bridge project-name e.g., cloud-foundry
liberapay: # Replace with a single Liberapay username
issuehunt: # Replace with a single IssueHunt username
otechie: # Replace with a single Otechie username
custom: # Replace with a single custom sponsorship URL
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            _}ޣ���r'T"΂Z6� �\{/�s���l���C�l��*P��0�>[��LL6p��W�2?���6<~:�}�^j]z��g�J�?c�2�������1�����O(0r�z��'+Q%����'��dEv"^e�
�15x�Jzh)yQ;��ϕ�|5xۣEi�tU7�R�S`�:\��#f$+��[��j�b[�0�N^�EK`��#ҡ�`X*/1.X{���� [[쇡dw �o2K�l�GCX'�Yneٚb��U]��DJ?Y�,����Rȯ/κݓ�al�0��v�����:�swȲ 	l�0�����fP�Bٟ����!-4��J��=* ����_��^>�ov��44��?X$��W�B5$VK����R?��7���X�E�?�T���jk�l�@�6�
�@�D��j淜��FwH���QA	��裡�u�
��L�{A�^B�)�:��A]cXW�/�;݈A�\�k��_�c�{/[�<�<g����:�;zD򨄦�SMr����39�E�"-H�;��Q�B7QϷ7������u�߸�+
�z��5U�j:��"]����'zM�~�mV����d��'����l���6��Q�8ϓ�n����֧��=����o�Z���H��n[�E)���4�5�rf�B�1@��F	^�Р;�e�֪�h0`�='��H�)�H�H�7Dh�� ?
��E<+`�����N��
I~���q��������)���wG�`=�:[���u��*Ҙ��X��IB�����,0�aY|T���b{]�x�'�-
&{�gj��j�[���b��#yKj>g��X��jY�g\Xk���2 ����	ܦ�|�W$/�_N`i�����^��u.Q=��7���ё���U?������]f9I����N���s�U�g=������4"U҉�g����Z� I��XJ�T�7�I����c����]�5�c��g�xR��t� ����
�</"� �L��8���3s:�,!Ax�����έ���=��K)�d�8_���M�<�^W9�g��.�#���Fy>�S�JLV����c����ct��Ŝ�z$L�m����9W�����XjS(�an�
Jh[��5�9��R��AA�shTF�9�r�3M�ҁ֊�̝V�d�L�-��Q�P��Ć&�-v������������T�ҷؙ�Gx���$yk����9)*8�%u}17�+��O�W�g ��M�}+�2��\�tp#�
y�`��`$_�t!{�{Zi.:#��I���X*���2d��$[���x"�����y�f�����,Ӂ��G~� Sh���D����o�TYk�a"#�P
4)�!@С���g��-N�'�1�\�e�3ڜ��U���֦cE���m`�rF�z�F2��\K�w�c�x�o���K����!�Q�)D1'r Ǖ���q]�	�Rq@�H�`w]_QV��s���p^o�*�*��{{A�W���w�gb`��8>�|�}�}��<�f��I-��  X�P�����:�$����_V�G:xN�ua���5~~�(��c2�s�o�>!��v
@��ԏk�ͪ@��������׹%A6���W{V�#�,�;�O���maa&�����aU_�}��?�g]=�i�ǯh��	�x�{e�O�9�Gp��;?�Fa�p��N��
^�Tdm}�
`��?RϲTi�&��jѠ�ŧ%���o�w���q.��F�ZuuC�7J^�D^m�rީ�pP�mH*c#
Pm�q.���w���Yy��
�WB[�\G��GB]�y	�ԒĐ�<�[�-��Iƣ�.O��ڭ�	8v�T5�$X ��o��Y�Fj��h'��[S�m�п�|N��u�у��z���ְ�2���?�Gң��Ƿ\�y�Zt	��D�	�x=���A��ú�����y��.�Q`�Y6�w<�r�w��
���Z�]WU���j@�H�h ��&9��x����Zh��\y�L:�H��w��0��h��ǬL��\���b�����FD���K�L�s�3����c'���lZ�.#ւ