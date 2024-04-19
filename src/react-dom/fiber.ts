import { renderDom } from './client'
import { commitRoot } from './commit';
import { reconcileChildren } from './reconciler.ts';

let nextUnitOfWork: null | Fiber = null;
let workInProgressRoot: null | Fiber = null;
let currentRoot: null | Fiber = null;

export interface FiberElement {
    props: {
      children: Array<any>
    },
    type?: any;
}
export interface Fiber {
  /** coresponding html element */
  stateNode: any;
  /** coresponding React Component */
  element?: FiberElement;
  alternate?: Fiber|null,
  /** parent */
  return?: Fiber;
  child?: Fiber;
  sibling?: Fiber;
}


export function createRoot(element: any, container: HTMLElement) {
  workInProgressRoot = {
    stateNode: container,
    element: {
      props: {
        children: [element]
      }
    },
    alternate: currentRoot,
  };
  nextUnitOfWork = workInProgressRoot;
}

function performUnitOfWork(workInProgress: Fiber) {
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = renderDom(workInProgress.element)
  }
  // if (workInProgress.return && workInProgress.stateNode) {
  //   let parentFiber:undefined | Fiber = workInProgress.return;
  //   while (!parentFiber?.stateNode) {
  //     parentFiber = parentFiber?.return;
  //   }
  //   let a = 0;
  //   while (a < 200000000) {
  //     a++;
  //   }
  //   这里只append了一个child
  //   也就是说，每个performUnitOfWork 会处理一个元素
  //   因此再前面 while 卡一下的时候，就会造成
  //   IdleCallback -> while -> A
  //   IdleCallback -> while -> B
  //   IdleCallback -> while -> C
  //   这样的渲染情况，也就是 A B C 会分三次出现在
  //   parentFiber.stateNode.appendChild(workInProgress.stateNode)
  //
  //   而换成commitRoot 之后
  //   整个commitRoot 会一次性的把所有的元素上屏
  // }

  // build fiber tree
  let children = workInProgress.element?.props?.children;
  let type = workInProgress.element?.type;
  if (typeof type === 'function') {
    if (type.prototype.isReactComponent) {
      const { props , type: Comp } = workInProgress.element!;
      const component = new Comp(props);
      const jsx = component.render();
      children = [jsx];
    } else {
      const { props, type: Fn } = workInProgress.element!;
      const jsx = Fn(props);
      children = [jsx];
    }
  }

  if (children || children === 0) {
    let elements = Array.isArray(children) ? children : [children];
    elements = elements.flat();

    reconcileChildren(workInProgress, elements);
  }
  // 设置下一个工作单元
  if (workInProgress.child) {
    // 如果有子 fiber，则下一个工作单元是子 fiber
    nextUnitOfWork = workInProgress.child;
  } else {
    let nextFiber: undefined | Fiber = workInProgress;
    while (nextFiber) {
      if (nextFiber.sibling) {
        // 没有子 fiber 有兄弟 fiber，则下一个工作单元是兄弟 fiber
        nextUnitOfWork = nextFiber.sibling;
        return;
      } else {
        // 子 fiber 和兄弟 fiber 都没有，深度优先遍历返回上一层
        nextFiber = nextFiber.return;
      }
    }
    if (!nextFiber) {
      // 若返回最顶层，表示迭代结束，将 nextUnitOfWork 置空
      nextUnitOfWork = null;
    }
  }
}

let count = 0;
export function workLoop(deadline: IdleDeadline) {
  count ++
  // if (count === 2) { return }
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  // commit phrase
  if (!nextUnitOfWork && workInProgressRoot) {
    commitRoot(workInProgressRoot);
    currentRoot = workInProgressRoot;
    workInProgressRoot = null;
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
