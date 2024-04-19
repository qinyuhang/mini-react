import type { Fiber, FiberElement } from "./fiber";

export function reconcileChildren(workInProgress: Fiber, elements: Array<FiberElement>) {
  let index = 0;
  // @ts-ignore
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];
    const newFiber: Fiber = {
      element,
      return: workInProgress,
      stateNode: null,
    };
    if (index === 0) {
      workInProgress.child = newFiber;
    } else {
      prevSibling!.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }

}
