export enum NodeType {
  TEXT_NODE = 'TEXT_NODE',
  HTML_TAG = 'HTML_TAG'
}

export type TextNode = {
  type: NodeType.TEXT_NODE;
  character: string;
  node: Text;
}

export type HTMLTag = {
  type: NodeType.HTML_TAG,
  node: Element;
  parentNode: Element;
}

export type VisibleNode = TextNode | HTMLTag;

