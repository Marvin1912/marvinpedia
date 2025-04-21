---
id: 9
name: angular-router-outlet
topic: angular
fileName: angular-router-outlet
---

# Angulars `router-outlet`

In Angular, navigation between different views or components is handled by the **Angular Router**. A
key part of this mechanism is the `<router-outlet>` directive, which acts as a placeholder that
Angular dynamically fills based on the current route.

`<router-outlet>` is a directive provided by the Angular Router module. It marks the location in
your template where the router should display the component for the current route.

### Why Place `<router-outlet>` in `app.component.html`?

The `app.component.html` file is the top-level template of your Angular application. Placing the
`<router-outlet>` here provides several benefits:

- **Central Layout Control**: Define global layout elements (e.g., header, footer, sidebar) *once*,
  and dynamically render routed views between them.

  ```html
  <!-- app.component.html -->
  <app-header></app-header>
  <router-outlet></router-outlet>
  <app-footer></app-footer>
  ```

- **App Shell Architecture**: It provides a static app shell (header/footer/etc.), while routed
  views are injected dynamically.

- **Single Entry Point for Routes**: Ensures all routed components enter through a unified component
  structure.

### How Routing Works

1. Define routes in your `AppRoutingModule` (or feature module):

   ```ts
   const routes: Routes = [
     { path: 'home', component: HomeComponent },
     { path: 'about', component: AboutComponent },
     {
       path: 'dashboard',
       component: DashboardComponent,
       children: [
         { path: 'stats', component: StatsComponent },
         { path: 'reports', component: ReportsComponent }
       ]
     },
   ];
   ```

2. In this example, `DashboardComponent` has **child routes** (`stats`, `reports`). It must contain
   its own `<router-outlet>` to render them:

   ```html
   <!-- dashboard.component.html -->
   <h2>Dashboard</h2>
   <nav>
     <a routerLink="stats">Stats</a> |
     <a routerLink="reports">Reports</a>
   </nav>

   <router-outlet></router-outlet> <!-- Renders child routes here -->
   ```

3. When a user navigates to `/dashboard/stats`, Angular first loads the `DashboardComponent`, then
   renders `StatsComponent` inside the inner `<router-outlet>`.
