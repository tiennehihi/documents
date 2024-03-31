'use strict';Object.defineProperty(exports, "__esModule", { value: true });var rules = exports.rules = {
  'no-unresolved': require('./rules/no-unresolved'),
  named: require('./rules/named'),
  'default': require('./rules/default'),
  namespace: require('./rules/namespace'),
  'no-namespace': require('./rules/no-namespace'),
  'export': require('./rules/export'),
  'no-mutable-exports': require('./rules/no-mutable-exports'),
  extensions: require('./rules/extensions'),
  'no-restricted-paths': require('./rules/no-restricted-paths'),
  'no-internal-modules': require('./rules/no-internal-modules'),
  'group-exports': require('./rules/group-exports'),
  'no-relative-packages': require('./rules/no-relative-packages'),
  'no-relative-parent-imports': require('./rules/no-relative-parent-imports'),
  'consistent-type-specifier-style': require('./rules/consistent-type-specifier-style'),

  'no-self-import': require('./rules/no-self-import'),
  'no-cycle': require('./rules/no-cycle'),
  'no-named-default': require('./rules/no-named-default'),
  'no-named-as-default': require('./rules/no-named-as-default'),
  'no-named-as-default-member': require('./rules/no-named-as-default-member'),
  'no-anonymous-default-export': require('./rules/no-anonymous-default-export'),
  'no-unused-modules': require('./rules/no-unused-modules'),

  'no-commonjs': require('./rules/no-commonjs'),
  'no-amd': require('./rules/no-amd'),
  'no-duplicates': require('./rules/no-duplicates'),
  first: require('./rules/first'),
  'max-dependencies': require('./rules/max-dependencies'),
  'no-extraneous-dependencies': require('./rules/no-extraneous-dependencies'),
  'no-absolute-path': require('./rules/no-absolute-path'),
  'no-nodejs-modules': require('./rules/no-nodejs-modules'),
  'no-webpack-loader-syntax': require('./rules/no-webpack-loader-syntax'),
  order: require('./rules/order'),
  'newline-after-import': require('./rules/newline-after-import'),
  'prefer-default-export': require('./rules/prefer-default-export'),
  'no-default-export': require('./rules/no-default-export'),
  'no-named-export': require('./rules/no-named-export'),
  'no-dynamic-require': require('./rules/no-dynamic-require'),
  unambiguous: require('./rules/unambiguous'),
  'no-unassigned-import': require('./rules/no-unassigned-import'),
  'no-useless-path-segments': require('./rules/no-useless-path-segments'),
  'dynamic-import-chunkname': require('./rules/dynamic-import-chunkname'),
  'no-import-module-exports': require('./rules/no-import-module-exports'),
  'no-empty-named-blocks': require('./rules/no-empty-named-blocks'),

  // export
  'exports-last': require('./rules/exports-last'),

  // metadata-based
  'no-deprecated': require('./rules/no-deprecated'),

  // deprecated aliases to rules
  'imports-first': require('./rules/imports-first') };


var configs = exports.configs = {
  recommended: require('../config/recommended'),

  errors: require('../config/errors'),
  warnings: require('../config/warnings'),

  // shhhh... work in progress "secret" rules
  'stage-0': require('../config/stage-0'),

  // useful stuff for folks using various environments
  react: require('../config/react'),
  'react-native': require('../config/react-native'),
  electron: require('../config/electron'),
  typescript: require('../config/typescript') };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJydWxlcyIsInJlcXVpcmUiLCJuYW1lZCIsIm5hbWVzcGFjZSIsImV4dGVuc2lvbnMiLCJmaXJzdCIsIm9yZGVyIiwidW5hbWJpZ3VvdXMiLCJjb25maWdzIiwicmVjb21tZW5kZWQiLCJlcnJvcnMiLCJ3YXJuaW5ncyIsInJlYWN0IiwiZWxlY3Ryb24iLCJ0eXBlc2NyaXB0Il0sIm1hcHBpbmdzIjoiMkVBQU8sSUFBTUEsd0JBQVE7QUFDbkIsbUJBQWlCQyxRQUFRLHVCQUFSLENBREU7QUFFbkJDLFNBQU9ELFFBQVEsZUFBUixDQUZZO0FBR25CLGFBQVNBLFFBQVEsaUJBQVIsQ0FIVTtBQUluQkUsYUFBV0YsUUFBUSxtQkFBUixDQUpRO0FBS25CLGtCQUFnQkEsUUFBUSxzQkFBUixDQUxHO0FBTW5CLFlBQVFBLFFBQVEsZ0JBQVIsQ0FOVztBQU9uQix3QkFBc0JBLFFBQVEsNEJBQVIsQ0FQSDtBQVFuQkcsY0FBWUgsUUFBUSxvQkFBUixDQVJPO0FBU25CLHlCQUF1QkEsUUFBUSw2QkFBUixDQVRKO0FBVW5CLHlCQUF1QkEsUUFBUSw2QkFBUixDQVZKO0FBV25CLG1CQUFpQkEsUUFBUSx1QkFBUixDQVhFO0FBWW5CLDBCQUF3QkEsUUFBUSw4QkFBUixDQVpMO0FBYW5CLGdDQUE4QkEsUUFBUSxvQ0FBUixDQWJYO0FBY25CLHFDQUFtQ0EsUUFBUSx5Q0FBUixDQWRoQjs7QUFnQm5CLG9CQUFrQkEsUUFBUSx3QkFBUixDQWhCQztBQWlCbkIsY0FBWUEsUUFBUSxrQkFBUixDQWpCTztBQWtCbkIsc0JBQW9CQSxRQUFRLDBCQUFSLENBbEJEO0FBbUJuQix5QkFBdUJBLFFBQVEsNkJBQVIsQ0FuQko7QUFvQm5CLGdDQUE4QkEsUUFBUSxvQ0FBUixDQXBCWDtBQXFCbkIsaUNBQStCQSxRQUFRLHFDQUFSLENBckJaO0FBc0JuQix1QkFBcUJBLFFBQVEsMkJBQVIsQ0F0QkY7O0FBd0JuQixpQkFBZUEsUUFBUSxxQkFBUixDQXhCSTtBQXlCbkIsWUFBVUEsUUFBUSxnQkFBUixDQXpCUztBQTBCbkIsbUJBQWlCQSxRQUFRLHVCQUFSLENBMUJFO0FBMkJuQkksU0FBT0osUUFBUSxlQUFSLENBM0JZO0FBNEJuQixzQkFBb0JBLFFBQVEsMEJBQVIsQ0E1QkQ7QUE2Qm5CLGdDQUE4QkEsUUFBUSxvQ0FBUixDQTdCWDtBQThCbkIsc0JBQW9CQSxRQUFRLDBCQUFSLENBOUJEO0FBK0JuQix1QkFBcUJBLFFBQVEsMkJBQVIsQ0EvQkY7QUFnQ25CLDhCQUE0QkEsUUFBUSxrQ0FBUixDQWhDVDtBQWlDbkJLLFNBQU9MLFFBQVEsZUFBUixDQWpDWTtBQWtDbkIsMEJBQXdCQSxRQUFRLDhCQUFSLENBbENMO0FBbUNuQiwyQkFBeUJBLFFBQVEsK0JBQVIsQ0FuQ047QUFvQ25CLHVCQUFxQkEsUUFBUSwyQkFBUixDQXBDRjtBQXFDbkIscUJBQW1CQSxRQUFRLHlCQUFSLENBckNBO0FBc0NuQix3QkFBc0JBLFFBQVEsNEJBQVIsQ0F0Q0g7QUF1Q25CTSxlQUFhTixRQUFRLHFCQUFSLENBdkNNO0FBd0NuQiwwQkFBd0JBLFFBQVEsOEJBQVIsQ0F4Q0w7QUF5Q25CLDhCQUE0QkEsUUFBUSxrQ0FBUixDQXpDVDtBQTBDbkIsOEJBQTRCQSxRQUFRLGtDQUFSLENBMUNUO0FBMkNuQiw4QkFBNEJBLFFBQVEsa0NBQVIsQ0EzQ1Q7QUE0Q25CLDJCQUF5QkEsUUFBUSwrQkFBUixDQTVDTjs7QUE4Q25CO0FBQ0Esa0JBQWdCQSxRQUFRLHNCQUFSLENBL0NHOztBQWlEbkI7QUFDQSxtQkFBaUJBLFFBQVEsdUJBQVIsQ0FsREU7O0FBb0RuQjtBQUNBLG1CQUFpQkEsUUFBUSx1QkFBUixDQXJERSxFQ