export function styled(
  element: HTMLElement,
  style: Partial<CSSStyleDeclaration>
): void {
  for (const property in style) {
    // @ts-ignore
    element.style[property] = style[property];
  }
}
