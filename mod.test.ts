import { assertEquals } from 'std/assert/mod.ts';

import { SimpleHTMLElement } from './mod.ts';

Deno.test('SimpleHTMLElement', async (ctx) => {
  await ctx.step('example 1', () => {
    const anchor = new SimpleHTMLElement(
      'a',
      { href: 'https://github.com/Tsukina-7mochi/simple-html-element' },
      ['Simple HTML Element - GitHub'],
    );

    assertEquals(
      anchor.toString(),
      '<a href="https://github.com/Tsukina-7mochi/simple-html-element">Simple HTML Element - GitHub</a>',
    );
  });

  await ctx.step('example 2', () => {
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
  });

  await ctx.step('usual element', () => {
    const element = new SimpleHTMLElement('p');

    assertEquals(element.toString(), '<p></p>');
    assertEquals(`${element}`, '<p></p>');
  });

  await ctx.step('void element', () => {
    const element = new SimpleHTMLElement('br');

    assertEquals(element.toString(), '<br>');
  });

  await ctx.step('usual element (self-close)', () => {
    const element = new SimpleHTMLElement('p');

    // not <p />
    assertEquals(element.toString(), '<p></p>');
  });

  await ctx.step('void element (self-closing)', () => {
    const element = new SimpleHTMLElement('br');

    assertEquals(element.toString({ selfClose: true }), '<br />');
  });

  await ctx.step('text child', () => {
    const element = new SimpleHTMLElement('p', {}, 'hello');

    assertEquals(element.toString(), '<p>hello</p>');
  });

  await ctx.step('text children', () => {
    const element = new SimpleHTMLElement('p', {}, ['hello', 'world']);

    assertEquals(element.toString(), '<p>helloworld</p>');
  });

  await ctx.step('element children', () => {
    const span1 = new SimpleHTMLElement('span', {}, ['hello']);
    const span2 = new SimpleHTMLElement('span', {}, ['world']);
    const element = new SimpleHTMLElement('p', {}, [span1, span2]);

    assertEquals(
      element.toString(),
      '<p><span>hello</span><span>world</span></p>',
    );
  });

  await ctx.step('mixed children', () => {
    const span1 = new SimpleHTMLElement('span', {}, ['hello']);
    const element = new SimpleHTMLElement('p', {}, [span1, 'world']);

    assertEquals(element.toString(), '<p><span>hello</span>world</p>');
  });

  await ctx.step('attributes', () => {
    const element = new SimpleHTMLElement('p', {
      id: 'hello',
      class: 'greetings',
    }, ['hello']);

    assertEquals(
      element.toString(),
      '<p id="hello" class="greetings">hello</p>',
    );
  });

  await ctx.step('attributes (self-closing)', () => {
    const element = new SimpleHTMLElement('br', {
      id: 'line-break',
      class: 'whitespace',
    });

    assertEquals(element.toString(), '<br id="line-break" class="whitespace">');
  });

  await ctx.step('boolean attributes', () => {
    const element = new SimpleHTMLElement('input', {
      type: 'checkbox',
      checked: true,
    });

    assertEquals(
      element.toString(),
      '<input type="checkbox" checked>',
    );
  });

  await ctx.step('boolean attributes', () => {
    const element = new SimpleHTMLElement('input', {
      type: 'checkbox',
      checked: true,
    });

    assertEquals(
      element.toString({ explicitBooleanValue: true }),
      '<input type="checkbox" checked="true">',
    );
  });
});
