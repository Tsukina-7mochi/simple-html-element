import { assertEquals } from '@std/assert';

import { SimpleHTMLElement } from './mod.ts';

Deno.test('constructor (arguments)', () => {
  const element = new SimpleHTMLElement(
    'a',
    { href: 'https://github.com/Tsukina-7mochi/simple-html-element' },
    ['Simple HTML Element - GitHub'],
  );

  assertEquals(
    element.toString(),
    '<a href="https://github.com/Tsukina-7mochi/simple-html-element">Simple HTML Element - GitHub</a>',
  );
});

Deno.test('constructor (init object)', () => {
  const element = new SimpleHTMLElement({
    tag: 'a',
    attributes: {
      href: 'https://github.com/Tsukina-7mochi/simple-html-element',
    },
    children: ['Simple HTML Element - GitHub'],
  });

  assertEquals(
    element.toString(),
    '<a href="https://github.com/Tsukina-7mochi/simple-html-element">Simple HTML Element - GitHub</a>',
  );
});

Deno.test('empty element', () => {
  const element = new SimpleHTMLElement('div');

  assertEquals(element.toString(), '<div></div>');
});

Deno.test('empty element (unpaired)', () => {
  const element = new SimpleHTMLElement('div');

  assertEquals(element.toString({ unpairedTags: ['div'] }), '<div>');
});

Deno.test('empty element (unpaired by function)', () => {
  const element = new SimpleHTMLElement('div');

  assertEquals(
    element.toString({ unpairedTags: (tag) => tag === 'div' }),
    '<div>',
  );
});

Deno.test('empty element (unpaired by default)', () => {
  const element = new SimpleHTMLElement('br');

  assertEquals(element.toString(), '<br>');
});

Deno.test('empty element (self-closing)', () => {
  const element = new SimpleHTMLElement('div');

  assertEquals(element.toString({ selfClosingTags: ['div'] }), '<div />');
});

Deno.test('empty element (self-closing by function)', () => {
  const element = new SimpleHTMLElement('div');

  assertEquals(
    element.toString({ selfClosingTags: (tag) => tag === 'div' }),
    '<div />',
  );
});

Deno.test('one child (string)', () => {
  const element = new SimpleHTMLElement({
    tag: 'p',
    children: 'hello',
  });

  assertEquals(element.toString(), '<p>hello</p>');
});

Deno.test('one child (element)', () => {
  const element = new SimpleHTMLElement({
    tag: 'p',
    children: new SimpleHTMLElement('span'),
  });

  assertEquals(element.toString(), '<p><span></span></p>');
});

Deno.test('one child (init)', () => {
  const element = new SimpleHTMLElement({
    tag: 'p',
    children: { tag: 'span' },
  });

  assertEquals(element.toString(), '<p><span></span></p>');
});

Deno.test('multiple children', () => {
  const element = new SimpleHTMLElement({
    tag: 'div',
    children: [
      'hello',
      new SimpleHTMLElement({ tag: 'span', children: ['world'] }),
      { tag: 'br' },
    ],
  });

  assertEquals(element.toString(), '<div>hello<span>world</span><br></div>');
});

Deno.test('attributes', () => {
  const element = new SimpleHTMLElement(
    'p',
    { id: 'hello', class: 'greetings' },
    ['hello'],
  );

  assertEquals(
    element.toString(),
    '<p id="hello" class="greetings">hello</p>',
  );
});

Deno.test('attributes (unpaired)', () => {
  const element = new SimpleHTMLElement('br', {
    id: 'line-break',
    class: 'whitespace',
  });

  assertEquals(element.toString(), '<br id="line-break" class="whitespace">');
});

Deno.test('attributes (self-closing)', () => {
  const element = new SimpleHTMLElement('br', {
    id: 'line-break',
    class: 'whitespace',
  });

  assertEquals(
    element.toString({ selfClosingTags: ['br'] }),
    '<br id="line-break" class="whitespace" />',
  );
});

Deno.test('boolean attributes', () => {
  const element = new SimpleHTMLElement('input', {
    type: 'checkbox',
    checked: true,
  });

  assertEquals(
    element.toString(),
    '<input type="checkbox" checked>',
  );
});

Deno.test('boolean attributes (explicit)', () => {
  const element = new SimpleHTMLElement('input', {
    type: 'checkbox',
    checked: true,
  });

  assertEquals(
    element.toString({ explicitBooleanAttribute: true }),
    '<input type="checkbox" checked="true">',
  );
});

Deno.test('options propagation', () => {
  const element = new SimpleHTMLElement(
    'div',
    { foo: true },
    new SimpleHTMLElement('br', { bar: true }),
  );

  assertEquals(
    element.toString({
      explicitBooleanAttribute: true,
      selfClosingTags: ['br'],
    }),
    '<div foo="true"><br bar="true" /></div>',
  );
});
