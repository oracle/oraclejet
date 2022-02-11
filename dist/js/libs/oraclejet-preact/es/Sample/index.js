import { h } from 'preact';

function Sample({ preferredGreeting = "Hello" }) {
    const greeting = preferredGreeting;
    return h("p", null,
        greeting,
        ", World!");
}

export { Sample };
