---
id: 13
name: Angulars @Output
topic: angular
fileName: angular/angular-output-decorator
---

# Angulars @Output

The `@Output` directive in Angular is a decorator used to send data from a child component to a
parent component. It enables the child component to emit custom events that the parent component can
listen to and respond to, allowing dynamic and interactive communication between components.

### Function and Behavior

- The `@Output` decorator marks a property in the child component as an event that the parent
  component can bind to using Angular's event binding syntax: `(event)="handler($event)"`.
- The `EventEmitter` class is typically used alongside `@Output` to emit events or data from the
  child component.
- The parent component can listen for these emitted events and execute logic in response, enabling
  reactive and dynamic parent-child interactions.
- The data flow is unidirectional: child to parent.

### Example

```
// app.component.html
<app-child (childEvent)="handleChildEvent($event)"></app-child>


// app.component.ts
export class AppComponent {
  handleChildEvent(message: string) {
    console.log('Received from child:', message);
  }
}


// child.component.ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `<button (click)="sendEvent()">Send Event</button>`
})
export class ChildComponent {
  @Output() childEvent = new EventEmitter<string>();

  sendEvent() {
    this.childEvent.emit('Hello from Child!');
  }
}
```
