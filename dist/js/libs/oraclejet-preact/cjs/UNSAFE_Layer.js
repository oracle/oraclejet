/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var compat = require('preact/compat');
var preact = require('preact');
var jsxRuntime = require('preact/jsx-runtime');

const LayerContext = preact.createContext({});

const Layer = (props) => {
    var _a;
    const context = compat.useContext(LayerContext);
    const defaultHost = (_a = context.getHost) === null || _a === void 0 ? void 0 : _a.call(context);
    const host = compat.useMemo(() => defaultHost, [defaultHost]);
    const [layerContainer, setLayerContainer] = compat.useState(null);
    // Really need useLayoutEffect instead of useEffect here. Otherwise the re-parented
    // content does not get re-rendered with valid ref's
    compat.useLayoutEffect(() => {
        var _a;
        if (!host)
            return;
        const doc = (_a = host.ownerDocument) !== null && _a !== void 0 ? _a : document;
        const layer = doc.createElement("div");
        host.appendChild(layer);
        setLayerContainer(layer);
        return () => {
            if (host && layer && host.contains(layer)) {
                host.removeChild(layer);
            }
            setLayerContainer(null);
        };
    }, [host]);
    return layerContainer && compat.createPortal(props.children, layerContainer);
};

const LayerHost = compat.forwardRef((_props, ref) => {
    return jsxRuntime.jsx("div", { id: "__oj_layerhost_container", ref: ref });
});
LayerHost.displayName = 'Forwarded<LayerHost>';

function LayerManager({ children }) {
    const [defaultHost, setDefaultHost] = compat.useState();
    //const context = useContext(LayerContext);
    const defaultHostRef = compat.useCallback((el) => {
        // ref callbacks fire after the component has been unnmounted so we do not
        // want to set state in this use-case
        if (el !== null) {
            setDefaultHost(el);
        }
    }, []);
    return (jsxRuntime.jsx(LayerContext.Consumer, { children: (value) => {
            const defaultHostContext = defaultHost ? { getHost: () => defaultHost } : {};
            const layerContext = value.getHost ? value : defaultHostContext;
            return (jsxRuntime.jsxs(LayerContext.Provider, Object.assign({ value: layerContext }, { children: [children, !value.getHost && jsxRuntime.jsx(LayerHost, { ref: defaultHostRef })] })));
        } }));
}

exports.Layer = Layer;
exports.LayerContext = LayerContext;
exports.LayerManager = LayerManager;
/*  */
//# sourceMappingURL=UNSAFE_Layer.js.map
