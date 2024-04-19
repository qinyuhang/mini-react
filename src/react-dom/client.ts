import { createRoot as createRootFiber } from './fiber.ts';
/***
 * @deprecated use createRoot
 * */
function render(element: Element, container: Element) {
  const dom = renderDom(element);
  if (dom) {
    container.appendChild(dom);
  }
}

function createRoot(container: HTMLElement) {
  const rootEl = document.createDocumentFragment();
  container.appendChild(rootEl);
  return {
    /**
     * @param ele React.Element
     * */
    render: function(ele: any) {
      createRootFiber(ele, container);
    },
    unmount: function() {
      container.removeChild(rootEl);
    }
  }
}

//
// 更新 dom 属性
function updateAttributes(dom: HTMLElement, attributes: Record<string, any>) {
  Object.keys(attributes).forEach((key) => {
    if (key.startsWith('on')) {
      // 事件的处理
      const eventName = key.slice(2).toLowerCase();
      dom.addEventListener(eventName, attributes[key]);
    } else if (key === 'className') {
      // className 的处理
      const classes = attributes[key].split(' ');
      classes.forEach((classKey: string) => {
        dom.classList.add(classKey);
      });
    } else if (key === 'style') {
      // style处理
      const style = attributes[key];
      Object.keys(style).forEach((styleName) => {
        (dom.style as any)[styleName] = style[styleName];
      });
    } else {
      // 其他属性的处理
      // @ts-ignore
      // dom.setAttribute(key, attributes[key]);
      dom[key] = attributes[key];
    }
  });
}
/**
 * @param ele React.Element
 * */
export function renderDom(element: any): Node | null {
  // debugger;
  let dom = null;
  if (!element && element !== 0) { return null }
  if (typeof element === 'string') {
    return document.createTextNode(element)
  }
  if (typeof element === 'number') {
    return document.createTextNode(String(element));
  }

  const { type, props: { children, ...attributes } } = element;

  if (typeof type === 'string' || typeof type === "symbol") {
    // TODO iterate all symbols
    dom = document.createElement(String(type));
  } else if (typeof type === 'symbol') {
    return document.createTextNode(String(type))
  } else if (typeof type === 'function') {
    dom = document.createDocumentFragment() as any;
  } else {
    return null;
  }
  updateAttributes(dom, attributes);
  return dom;
}

const ReactDOM = {
  render,
  createRoot,
}

export default ReactDOM;
