---
id: 7
name: Angulars @Input
topic: angular
fileName: angular-input
---

# Angulars @Input

The `@Input` directive in Angular is a decorator used to pass data from a parent component to a
child component. It allows the parent component to bind values to the child component's properties,
enabling dynamic and customizable behavior in the child component based on the parent's context.

### Function and Behavior

- The `@Input` decorator marks a property in the child component as a target for property binding
  from the parent component. Data is passed from the parent component template to the child
  component using Angular's property binding syntax: `[property]="value"`.
- The child component automatically updates whenever the parent component's bound property changes,
  ensuring a reactive and dynamic UI.
- By passing data through @Input, you can make reusable child components that adapt their behavior
  and appearance based on the data received.
- The data flow is unidirectional: parent to child.

### Example

```
// app.component.html
<app-child [childProperty]="parentData"></app-child>


// app.component.ts
export class AppComponent {
  parentData: string = 'Hello from Parent!';
}


// child.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `<p>{{ childProperty }}</p>`
})
export class ChildComponent {
  @Input() childProperty: string;
}
```
