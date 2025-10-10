---
id: 8
name: Angulars NgModel
topic: angular
fileName: angular/angular-ng-model-directive
---

# Angulars NgModel

The `ngModel` directive in Angular is a key component of Angular's FormsModule. It provides two-way
data binding between a form control (e.g., an input field) and a property in the component class.
This means that changes in the input field are automatically reflected in the component's property,
and vice versa.

### Function and Behavior

- The primary function of `ngModel` is to create a two-way binding between the DOM (view) and the
  component class (model). When the user updates the value in the input field, the bound property in
  the component is updated. Similarly, when the component property is updated programmatically, the
  value in the input field is updated automatically.
- `[(ngModel)]` is the syntax used for two-way data binding. This syntax combines Angular's property
  binding `([ ])` and event binding `(( ))`.

### Example

```
// app.component.html
<input type="text" [(ngModel)]="name" placeholder="Enter your name">
<p>Your name is: {{ name }}</p>


// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name: string = '';
}
```