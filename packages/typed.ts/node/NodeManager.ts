import { deepCopy } from "../utils/deepCopy";
import { EmptyVisibleNodeError } from "./EmptyVisibleNodeError";
import { VisibleNode } from "./Node";

export class NodeManager {
  private _nodes: VisibleNode[] = [];

  get nodes(): VisibleNode[] {
    return deepCopy<VisibleNode[]>(this._nodes);
  }

  constructor() {}

  public getFirstElement(): VisibleNode {
    if (this._nodes.length) {
      return this._nodes.slice(0, 1)[0];
    }
    throw new EmptyVisibleNodeError("Impossible to get the first node.");
  }

  public addToBeginning(...nodes: VisibleNode[]) {
    this._nodes.unshift(...nodes);
  }

  public removeFirstNode(): VisibleNode {
    if (this._nodes.length) {
      return this._nodes.shift() as VisibleNode;
    }

    throw new EmptyVisibleNodeError("Impossible to delete the first node.");
  }

  public getLastElement(): VisibleNode {
    if (this._nodes.length) {
      return this._nodes.slice(-1, 1)[0];
    }
    throw new EmptyVisibleNodeError("Impossible to get the last node.");
  }

  public addToEnd(...nodes: VisibleNode[]) {
    this._nodes.push(...nodes);
  }

  public removeLastNode(): VisibleNode {
    if (this._nodes.length) {
      return this._nodes.pop() as VisibleNode;
    }

    throw new EmptyVisibleNodeError("Impossible to delete the last node.");
  }
}
