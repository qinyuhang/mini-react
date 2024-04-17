/***
 * @deprecated use createRoot
 * */
function render(element: Element, container: Element) {
  const dom = renderDom(element);
  if (dom) {
    container.appendChild(dom);
  }
}

function createRoot(container: Element) {
  const rootEl = document.createDocumentFragment();
  container.appendChild(rootEl);
  return {
    /**
     * @param ele React.Element
     * */
    render: function(ele: any) {
      const dom = renderDom(ele);
      if (dom) {
        container.appendChild(dom);
      }
    },
    unmount: function() {
      container.removeChild(rootEl);
    }
  }
}

/**
 * @param ele React.Element
 * */
function renderDom(element: any): Node | null {
  debugger;
  let dom = null;
  if (!element && element !== 0) { return null }
  if (typeof element === 'string') {
    return document.createTextNode(element)
  }
  if (typeof element === 'number') {
    return document.createTextNode(String(element));
  }
  if (Array.isArray(element)) {
    dom = document.createDocumentFragment();
    for (let item of element) {
      const child = renderDom(item);
      if (child) {

      dom.appendChild(child);
      }
      return dom;
    }
  }
  const { type, props: { children } } = element;

  if (typeof type === 'string') {
    dom = document.createElement(type);
  } else if (typeof type === 'function') {
    console.log("React function")
    if (type.prototype.isReactComponent) {} else {}
  } else if (typeof type === 'symbol') {
    return document.createTextNode(String(type))
  } else {
    return null;
  }
  const testEl = document.createElement('div');
  testEl.innerHTML = 'Hello World'
  return testEl;
  // return document.createDocumentFragment()
}

const ReactDOM = {
  render,
  createRoot,
}

export default ReactDOM;
