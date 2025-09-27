import { unpairedTags as defaultUnpairedTags } from "./unpairedTags.ts";
import { setOrPredicatorIncludes } from "./util.ts";

type OneOrMany<T> = T | T[];

/**
 * Configuration object for creating a SimpleHTMLElement.
 *
 * @template T - The HTML tag name type
 */
export type SimpleHTMLElementInit<T extends string = string> = {
  /** The HTML tag name */
  tag: T;

  /** Optional attributes as key-value pairs where values can be strings or booleans */
  attributes?: Record<string, string | boolean>;

  /** Optional children which can be elements, initialization objects, or strings */
  children?: OneOrMany<SimpleHTMLElement | SimpleHTMLElementInit | string>;
};

/** Options for customizing HTML string output. */
export type ToStringOptions = {
  /** Tags that should be self-closing (e.g., <img />). Can be an array of tag names or a predicate function */
  selfClosingTags?: string[] | ((tag: string) => boolean);

  /** Tags that don't have closing tags (e.g., <br>). Can be an array of tag names or a predicate function */
  unpairedTags?: string[] | ((tag: string) => boolean);

  /** Whether to explicitly render boolean attributes as key="true" instead of just the key */
  explicitBooleanAttribute?: boolean;
};

/**
 * A simple HTML element representation.
 *
 * @template T - The HTML tag name type
 */
export class SimpleHTMLElement<T extends string = string> {
  /** The HTML tag name */
  tag: T;

  /** Element attributes as key-value pairs */
  attributes: Record<string, string | boolean>;

  /** Child elements and text content */
  children: (SimpleHTMLElement | string)[];

  /**
   * Creates a SimpleHTMLElement object.
   *
   * @param tag - The HTML tag name
   * @param attributes - Optional attributes object
   * @param children - Optional children elements, strings, or initialization objects
   */
  constructor(
    tag: T,
    attributes?: Record<string, string | boolean>,
    children?: OneOrMany<SimpleHTMLElement | SimpleHTMLElementInit | string>,
  );
  /**
   * Creates a SimpleHTMLElement object.
   *
   * @param init - The initialization object containing tag, attributes, and children
   */
  constructor(init: SimpleHTMLElementInit);
  constructor(
    obj: T | SimpleHTMLElementInit<T>,
    attributes?: Record<string, string | boolean>,
    children?: OneOrMany<SimpleHTMLElement | SimpleHTMLElementInit | string>,
  ) {
    if (typeof obj === "string") {
      this.tag = obj;
    } else {
      this.tag = obj.tag;
      attributes = obj.attributes;
      children = obj.children;
    }

    this.attributes = attributes ?? {};

    if (typeof children === "string" || children instanceof SimpleHTMLElement) {
      this.children = [children];
    } else if (Array.isArray(children)) {
      this.children = children?.map((item) => {
        if (typeof item === "string" || item instanceof SimpleHTMLElement) {
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

  /**
   * Converts the element to an HTML string.
   *
   * @param options - Optional formatting options
   * @returns The HTML string representation
   */
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
        if (typeof value === "string") {
          return `${key}="${value.replace(/"/g, '\\"')}"`;
        } else if (options?.explicitBooleanAttribute) {
          return `${key}="true"`;
        } else {
          return key;
        }
      });
    const attributesString = attributes.length === 0
      ? ""
      : " " + attributes.join(" ");

    if (this.children.length === 0) {
      if (isSelfClosing) {
        return `<${this.tag}${attributesString} />`;
      } else if (isUnpaired) {
        return `<${this.tag}${attributesString}>`;
      }
    }

    const content = this.children.map((v) => v.toString(options)).join("");
    return `<${this.tag}${attributesString}>${content}</${this.tag}>`;
  }
}
