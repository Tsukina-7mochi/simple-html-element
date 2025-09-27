# Simple HTML Element

Simple HTML element implementation for text rendering.

## Installation

```shell
# deno
$ deno add jsr:@tsukina-7mochi/simple-html-element

# npm
$ npx jsr add @tsukina-7mochi/simple-html-element
```

```typescript
import SimpleHTMLElement from "@tsukina-7mochi/simple-html-element";

const element = new SimpleHTMLElement("div", {}, ["hello"]);
console.log(`${element}`);
```

## Usage

```typescript
import SimpleHTMLElement from "@tsukina-7mochi/simple-html-element";

// empty <div> element
new SimpleHTMLElement("div");

// empty <div> element with attributes
new SimpleHTMLElement("div", { id: "my-div" });

// <div> element with children
new SimpleHTMLElement("div", {}, [
  "text node",
  new SimpleHTMLElement("div");
]);

// create from init object
new SimpleHTMLElement({
  tag: "div",
  attributes: { id: "my-div" },
  children: [
    "text node",
    { tag: "div", children: "nested init object is allowed" },
  ],
});
```

## Example

### Creating anchor element

```typescript
const anchor = new SimpleHTMLElement(
  "a",
  { href: "https://github.com/Tsukina-7mochi/simple-html-element" },
  ["Simple HTML Element - GitHub"],
);

assertEquals(
  anchor.toString(),
  "<a href="https://github.com/Tsukina-7mochi/simple-html-element">Simple HTML Element - GitHub</a>",
);
```

### Creating menu from object

```typescript
const menu = [
  { title: "Page 1", href: "./page1.html" },
  { title: "Page 2", href: "./page2.html" },
  { title: "Page 3", href: "./page3.html" },
];
const menuList = new SimpleHTMLElement({
  tag: "ul",
  children: menu.map(({ title, ...attributes }) => ({
    tag: "a",
    attributes,
    children: title,
  })),
});

assertEquals(
  menuList.toString(),
  "<ul><li><a href="./page1.html">Page 1</a></li><li><a href="./page2.html">Page 2</a></li><li><a href="./page3.html">Page 3</a></li></ul>",
);
```

## License

[LICENSE](./LICENSE)
