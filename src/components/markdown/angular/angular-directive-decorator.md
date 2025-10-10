---
id: 14
name: Angulars @Directive
topic: angular
fileName: angular/angular-directive-decorator
---

# Angulars @Directive

The `@Directive` decorator in Angular is used to create custom directives, which are classes that
can modify the behavior, appearance, or structure of DOM elements. Directives enable you to attach
custom behavior to elements or manipulate the DOM in a reusable and declarative way.

### Function and Behavior

- The `@Directive` decorator marks a class as a directive and allows Angular to recognize and
  instantiate it when it encounters the specified selector in a template.
- Directives can **listen to events**, **modify element properties**, **apply classes or styles**,
  and **interact with Angular’s forms and templates**.

### Example

```
// highlight.directive.ts
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('yellow');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}

// app.component.html
<p appHighlight>Hover over this text to see the highlight effect!</p>
```

### When to Use a Directive vs. a Component

- **Use a Directive** when you want to **add behavior** to an existing DOM element **without
  creating a new UI element**.  
  Example: Highlight text, validate form inputs, modify styles dynamically.

- **Use a Component** when you want to **create a new UI element** with its own **template, styles,
  and logic**.  
  Example: A reusable card component, a form input group, a dashboard widget.

| Feature  | Directive                            | Component                             |
|----------|--------------------------------------|---------------------------------------|
| Purpose  | Attach behavior to existing elements | Create new elements with a template   |
| Template | No (directives don’t have templates) | Yes (components have their own HTML)  |
| Usage    | Applied to existing DOM elements     | Declared with a selector and rendered |
| Example  | Highlight text, validate fields      | Product card, modal window            |
