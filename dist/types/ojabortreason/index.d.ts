export interface AbortReason extends DOMException {
    severity: 'error' | 'warn' | 'log' | 'info' | 'none';
}
