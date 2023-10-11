module.exports = {
  typeImport: {
    CustomMessageType: 'import { CustomMessageType } from "../../resources/CustomMessageType";'
  },
  otherImports: 'import { escape } from "../../resources/escape-util";',
  // remap some of the parameter names to different keys
  convertor: '(args: ParamsType): CustomMessageType => ({bundle: args.bundleId, key: args.id, params: args.params, value: escape(args.translation)})'
};
