import { unpairedTags as defaultUnpairedTags } from './unpairedTags.ts';
import { setOrPredicatorIncludes } from './util.ts';

type OneOrMany<T> = T | T[];

export type SimpleHTMLElementInit<T extends string = string> = {
  tag: T;
  attributes?: Record<string, string | boolean>;
  children?: OneOrMany<SimpleHTMLElement | SimpleHTMLElementInit | string>;
};

export type ToStringOptions = {
  selfClosingTags?: string[] | ((tag: string) => boolean);
  unpairedTags?: string[] | ((tag: string) => boolean);
  explicitBooleanAttribute?: boolean;
};

export class SimpleHTMLElement<T extends string = string> {
  tag: T;
  attributes: Record<string, string | boolean>;
  children: (SimpleHTMLElement | string)[];

  constructor(
    tag: T,
    attributes?: Record<string, string | boolean>,
    children?: OneOrMany<SimpleHTMLElement | SimpleHTMLElementInit | string>,
  );
  constructor(init: SimpleHTMLElementInit);
  constructor(
    obj: T | SimpleHTMLElementInit<T>,
    attributes?: Record<string, string | boolean>,
    children?: OneOrMany<SimpleHTMLElement | SimpleHTMLElementInit | string>,
  ) {
    if (typeof obj === 'string') {
      this.tag = obj;
    } else {
      this.tag = obj.tag;
      attributes = obj.attributes;
      children = obj.children;
    }

    this.attributes = attributes ?? {};

    if (typeof children === 'string' || children instanceof SimpleHTMLElement) {
      this.children = [children];
    } else if (Array.isArray(children)) {
      this.children = children?.map((item) => {
        if (typeof item === 'string' || item instanceof SimpleHTMLElement) {
          return item;
        } else {
          return new SimpleHTMLElement(item);
        }
      }) ?? [];
    } else if (children !== undefined) {
      this.children = [new SimpleHTMLElement(children)];
    } else {
      this.children = [];
    }
  }

  toString(options?: ToStringOptions): string {
    const isSelfClosing = setOrPredicatorIncludes(
      options?.selfClosingTags ?? [],
      this.tag,
    );
    const isUnpaired = setOrPredicatorIncludes(
      options?.unpairedTags ?? defaultUnpairedTags,
      this.tag,
    );

    const attributes = [...Object.entries(this.attributes)]
      .filter(([_, value]) => value !== false)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value.replace(/"/g, '\\"')}"`;
        } else if (options?.explicitBooleanAttribute) {
          return `${key}="true"`;
        } else {
          return key;
        }
      });
    const attributesString = attributes.length === 0
      ? ''
      : ' ' + attributes.join(' ');

    if (this.children.length === 0) {
      if (isSelfClosing) {
        return `<${this.tag}${attributesString} />`;
      } else if (isUnpaired) {
        return `<${this.tag}${attributesString}>`;
      }
    }

    const content = this.children.map((v) => v.toString(options)).join('');
    return `<${this.tag}${attributesString}>${content}</${this.tag}>`;
  }
}
