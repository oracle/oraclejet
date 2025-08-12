export function getLayerContext(baseElem: HTMLElement): {
    getRootLayerHost?: (priority?: 'popup' | 'dialog' | 'messages' | 'tooltip') => Element;
    getLayerHost?: (priority?: 'popup' | 'dialog' | 'messages' | 'tooltip') => Element;
    onLayerUnmount?: (element: HTMLElement) => void;
};
