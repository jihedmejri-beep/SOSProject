/* ------------------------------------------------------------------
   Runtime bridge for the TSX port of the "Projet par défaut" app.

   The original static app was loaded in a separate iframe document, so it
   owned its document, body and documentElement. Here it is rendered in a
   scoped DOM (a shadow root) instead. This object exposes exactly the small
   document surface the original scripts use, mapped onto that scoped DOM,
   so every original script can keep its source unchanged.
   ------------------------------------------------------------------ */

export type PapDocument = any;

export interface PapScope {
  document: PapDocument;
  /** Runs the DOMContentLoaded callbacks registered by the ported scripts. */
  flushReady: () => void;
  cleanup: () => void;
}

export function createScope(shadow: ShadowRoot, rootEl: HTMLElement): PapScope {
  const ready: Array<() => void> = [];

  // Writes to documentElement.lang / .dir are kept inside the scoped root.
  const documentElement = {
    get lang(): string {
      return rootEl.lang;
    },
    set lang(value: string) {
      rootEl.lang = value;
    },
    get dir(): string {
      return rootEl.dir;
    },
    set dir(value: string) {
      rootEl.dir = value;
    },
    setAttribute(name: string, value: string) {
      rootEl.setAttribute(name, value);
    },
    getAttribute(name: string): string | null {
      return rootEl.getAttribute(name);
    },
  };

  // Dialogs are appended to the scoped DOM so its stylesheet still styles them.
  const body = {
    appendChild(node: Node): Node {
      return shadow.appendChild(node);
    },
    contains(node: Node): boolean {
      return shadow.contains(node);
    },
  };

  const document: PapDocument = {
    documentElement,
    body,
    get title(): string {
      return "";
    },
    set title(_value: string) {
      /* the host page owns the real document title */
    },
    getElementById(id: string): Element | null {
      return shadow.getElementById(id);
    },
    querySelector(selector: string): Element | null {
      return shadow.querySelector(selector);
    },
    querySelectorAll(selector: string): NodeListOf<Element> {
      return shadow.querySelectorAll(selector);
    },
    createElement(tagName: string): HTMLElement {
      return window.document.createElement(tagName);
    },
    createElementNS(namespace: string, qualifiedName: string): Element {
      return window.document.createElementNS(namespace, qualifiedName);
    },
    createTextNode(data: string): Text {
      return window.document.createTextNode(data);
    },
    addEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
      if (type === "DOMContentLoaded") {
        ready.push(listener as () => void);
      }
    },
    removeEventListener(): void {
      /* no persistent document listeners are used by the ported app */
    },
    get defaultView(): Window {
      return window;
    },
  };

  return {
    document,
    flushReady() {
      ready.slice().forEach((callback) => callback());
    },
    cleanup() {
      ready.length = 0;
    },
  };
}
