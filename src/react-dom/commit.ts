import type { Fiber } from "./fiber";

export function commitRoot(rootFiber: Fiber) {
  commitWork(rootFiber.child);
}

/**
 * 深度优先便利
 * 先child 再 sibling
 * */
function commitWork(fiber?: Fiber) {
  if (!fiber) { return }
  commitWork(fiber.child);
  let parentDom = fiber.return?.stateNode;
  if (fiber.stateNode) {
    parentDom?.appendChild(fiber.stateNode);
  }
  commitWork(fiber.sibling);
}
