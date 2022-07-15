/* @oracle/oraclejet-preact: 13.0.0 */
import { useContext, useMemo, useState, useLayoutEffect, createPortal, forwardRef, useCallback } from 'preact/compat';
import { createContext } from 'preact';
import { jsx, jsxs } from 'preact/jsx-runtime';

const LayerContext = createContext({});

const Layer = (props) => {
    var _a;
    const context = useContext(LayerContext);
    const defaultHost = (_a = context.getHost) === null || _a === void 0 ? void 0 : _a.call(context);
    const host = useMemo(() => defaultHost, [defaultHost]);
    const [layerContainer, setLayerContainer] = useState(null);
    // Really need useLayoutEffect instead of useEffect here. Otherwise the re-parented
    // content does not get re-rendered with valid ref's
    useLayoutEffect(() => {
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
    return layerContainer && createPortal(props.children, layerContainer);
};

const LayerHost = forwardRef((_props, ref) => {
    return jsx("div", { id: "__oj_layerhost_container", ref: ref });
});
LayerHost.displayName = 'Forwarded<LayerHost>';

function LayerManager({ children }) {
    const [defaultHost, setDefaultHost] = useState();
    //const context = useContext(LayerContext);
    const defaultHostRef = useCallback((el) => {
        // ref callbacks fire after the component has been unnmounted so we do not
        // want to set state in this use-case
        if (el !== null) {
            setDefaultHost(el);
        }
    }, []);
    return (jsx(LayerContext.Consumer, { children: (value) => {
            const defaultHostContext = defaultHost ? { getHost: () => defaultHost } : {};
            const layerContext = value.getHost ? value : defaultHostContext;
            return (jsxs(LayerContext.Provider, Object.assign({ value: layerContext }, { children: [children, !value.getHost && jsx(LayerHost, { ref: defaultHostRef })] })));
        } }));
}

export { Layer, LayerContext, LayerManager };
/*  */
//# sourceMappingURL=UNSAFE_Layer.js.map
