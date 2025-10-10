# Angular Dialog Implementation

## Overview
This entry describes how dialog previews are implemented in Angular using Material Design components, specifically for the plant list feature.

## Key Components

### 1. Plant List Component (`plant-list.component.ts`)
The main component that manages the hover preview functionality:

```typescript
// Preview popup properties
previewVisible = false;
currentPreviewPlant: Plant | null = null;
previewPosition = { x: 0, y: 0 };
hoverTimeout: ReturnType<typeof setTimeout> | null = null;
hideTimeout: ReturnType<typeof setTimeout> | null = null;
```

### 2. Dialog Component (`show-plant-dialog.component.ts`)
A standalone component that displays plant information:

```typescript
@Component({
  selector: 'app-show-plant-dialog',
  imports: [MatIcon, NgIf]
})
export class ShowPlantDialogComponent implements OnChanges {
  @Input() plant: Plant | null = null;
  imageUrl: string | null = null;
}
```

## Implementation Pattern

### HTML Structure (`plant-list.component.html`)
```html
<!-- Table row with hover events -->
<tr mat-row
    (mouseenter)="showPlantPreview(plant, $event)"
    (mouseleave)="hidePlantPreview()">

<!-- Preview container -->
@if (previewVisible) {
  <div class="plant-preview-container"
       [style.left.px]="previewPosition.x"
       [style.top.px]="previewPosition.y">
    <app-show-plant-dialog [plant]="currentPreviewPlant"></app-show-plant-dialog>
  </div>
}
```

### TypeScript Logic
```typescript
showPlantPreview(plant: Plant, event: MouseEvent): void {
  clearTimeout(this.hoverTimeout ?? 0);
  clearTimeout(this.hideTimeout ?? 0);

  this.hoverTimeout = setTimeout(() => {
    this.currentPreviewPlant = plant;
    this.previewVisible = true;

    // Position the preview near the mouse
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
      const rect = tableContainer.getBoundingClientRect();
      this.previewPosition = {
        x: Math.min(event.clientX - rect.left + 15, rect.width - 270),
        y: Math.min(event.clientY - rect.top, window.innerHeight - 300)
      };
    }
  }, 300); // Delay before showing
}

hidePlantPreview(): void {
  clearTimeout(this.hoverTimeout ?? 0);
  clearTimeout(this.hideTimeout ?? 0);

  this.hideTimeout = setTimeout(() => {
    this.previewVisible = false;
    this.currentPreviewPlant = null;
  }, 200); // Delay before hiding
}
```

## Key Techniques

1. **Conditional Rendering**: Uses Angular's `@if` block for showing/hiding preview
2. **Dynamic Positioning**: Calculates preview position based on mouse coordinates
3. **Timeout Management**: Prevents flickering with delayed show/hide
4. **Component Communication**: Uses `@Input()` property binding
5. **Lifecycle Hooks**: Uses `ngOnChanges` to react to input changes

## Benefits

- **Responsive**: Preview appears near mouse cursor
- **User-Friendly**: Small delays prevent accidental triggering
- **Clean Architecture**: Separation of concerns between list and dialog components
- **Type Safety**: Full TypeScript support with proper type definitions

## Use Cases

- Hover previews in tables/lists
- Quick information display without navigation
- Context-sensitive popups
- Tooltip-style components with rich content