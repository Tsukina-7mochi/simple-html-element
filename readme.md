# Simple HTML Element

Simple HTML element implementation for text rendering.

## Installation

### Node.js

TBD

### Deno

```javascript
import SimpleHTMLElement from 'https://deno.land/x/simple_html_element/mod.ts';
```

## Usage

### Creating anchor element

```javascript
const anchor = new SimpleHTMLElement(
  'a',
  { href: 'https://github.com/Tsukina-7mochi/simple-html-element' },
  ['Simple HTML Element - GitHub'],
);

assertEquals(
  anchor.toString(),
  '<a href="https://github.com/Tsukina-7mochi/simple-html-element">Simple HTML Element - GitHub</a>',
);
```

### Creating menu from object

```javascript
const menu = [
  { title: 'Page 1', href: './page1.html' },
  { title: 'Page 2', href: './page2.html' },
  { title: 'Page 3', href: './page3.html' },
];
const menuListItems = menu
  .map(({ title, ...attributes }) =>
    new SimpleHTMLElement('a', attributes, title)
  )
  .map((element) => new SimpleHTMLElement('li', {}, element));
const menuList = new SimpleHTMLElement('ul', {}, menuListItems);

assertEquals(
  menuList.toString(),
  '<ul><li><a href="./page1.html">Page 1</a></li><li><a href="./page2.html">Page 2</a></li><li><a href="./page3.html">Page 3</a></li></ul>',
);
```
