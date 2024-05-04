const voidElements = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

type ArrayOrSingle<T> = T | T[];
type ToStringOptions = {
  selfClose?: boolean;
  explicitBooleanValue?: boolean;
};

class SimpleHTMLElement {
  tag: string;
  attributes: Record<string, string | boolean>;
  children: (SimpleHTMLElement | string)[];

  constructor(
    tag: string,
    attributes?: Record<string, string | boolean>,
    children?: ArrayOrSingle<SimpleHTMLElement | string>,
  ) {
    this.tag = tag;
    this.attributes = attributes ?? {};
    if (typeof children === 'string' || children instanceof SimpleHTMLElement) {
      this.children = [children];
    } else {
      this.children = children ?? [];
    }
  }

  toString(options?: ToStringOptions): string {
    let attributes = [...Object.entries(this.attributes)]
      .filter(([_, value]) => value !== false)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value.replace(/"/g, '\\"')}"`;
        } else {
          if (options?.explicitBooleanValue) {
            return `${key}="true"`;
          }
          return key;
        }
      })
      .join(' ');
    if (attributes.length > 0) {
      attributes = ' ' + attributes;
    }

    if (this.children.length === 0 && voidElements.includes(this.tag)) {
      if (options?.selfClose) {
        return `<${this.tag}${attributes} />`;
      } else {
        return `<${this.tag}${attributes}>`;
      }
    } else {
      const content = this.children.map((v) => v.toString(options)).join('');
      return `<${this.tag}${attributes}>${content}</${this.tag}>`;
    }
  }
}

export { SimpleHTMLElement };
export default SimpleHTMLElement;
