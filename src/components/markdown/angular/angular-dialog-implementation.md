# Angular Dialog Implementation

## Overview
This guide explains how to implement hover-based dialog previews in Angular applications using Material Design components. This pattern allows users to preview contextual information without navigating away from their current view, providing a seamless user experience.

## Architecture Overview

The implementation consists of two main components working together:

1. **List Component** - Manages the hover state and controls when previews appear
2. **Preview Dialog Component** - A standalone component that renders the actual preview content

## Core Implementation

### 1. List Component Logic
The list component handles all the hover interactions and manages the preview state:

```typescript
// State management
previewVisible = false;
currentPreviewItem: ItemType | null = null;
previewPosition = { x: 0, y: 0 };
hoverTimeout: ReturnType<typeof setTimeout> | null = null;
hideTimeout: ReturnType<typeof setTimeout> | null = null;

// Hover preview with delay to prevent accidental triggers
showItemPreview(item: ItemType, event: MouseEvent): void {
  this.clearTimeouts();
  this.hoverTimeout = setTimeout(() => {
    this.currentPreviewItem = item;
    this.previewVisible = true;
    this.positionPreview(event);
  }, 300);
}

hideItemPreview(): void {
  this.clearTimeouts();
  this.hideTimeout = setTimeout(() => {
    this.previewVisible = false;
    this.currentPreviewItem = null;
  }, 200);
}

keepPreviewVisible(): void {
  clearTimeout(this.hideTimeout ?? 0);
}

private clearTimeouts(): void {
  clearTimeout(this.hoverTimeout ?? 0);
  clearTimeout(this.hideTimeout ?? 0);
}

private positionPreview(event: MouseEvent): void {
  const container = document.querySelector('.container-class');
  if (container) {
    const rect = container.getBoundingClientRect();
    this.previewPosition = {
      x: Math.min(event.clientX - rect.left + 15, rect.width - 270),
      y: Math.min(event.clientY - rect.top, window.innerHeight - 300)
    };
  }
}
```

### 2. Preview Dialog Component
A standalone component that displays the preview content:

```typescript
@Component({
  selector: 'app-preview-dialog',
  standalone: true,
  template: `
    <div class="preview-box" *ngIf="item">
      <h4>{{ item.name }}</h4>
      <div class="preview-content">
        <span class="item-meta">
          <mat-icon>{{ getIcon(item) }}</mat-icon> {{ item.category }}
        </span>
        <p>{{ item.description }}</p>
        <img [src]="imageUrl" *ngIf="imageUrl" alt="Preview image"/>
      </div>
    </div>
  `
})
export class PreviewDialogComponent implements OnChanges {
  @Input() item: ItemType | null = null;
  imageUrl: string | null = null;

  ngOnChanges(): void {
    if (this.item?.image) {
      this.imageUrl = `${environment.apiUrl}/images/${this.item.image}`;
    }
  }

  getIcon(item: ItemType): string {
    return item.category === 'premium' ? 'star' : 'default';
  }
}
```

## HTML Implementation

### Template Structure
The HTML template combines a regular table with a conditional preview container:

```html
<div class="table-container">
  <table mat-table [dataSource]="items">
    <!-- Standard table columns -->
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef>Name</th>
      <td mat-cell *matCellDef="let item">{{ item.name }}</td>
    </ng-container>

    <!-- Preview action column -->
    <ng-container matColumnDef="preview">
      <th mat-header-cell *matHeaderCellDef>Preview</th>
      <td mat-cell *matCellDef="let item">
        <button mat-icon-button (click)="openFullDialog(item); $event.stopPropagation()">
          <mat-icon>visibility</mat-icon>
        </button>
      </td>
    </ng-container>

    <!-- Table rows with hover events -->
    <tr mat-row *matRowDef="let item; columns: columnsToDisplay;"
        (mouseenter)="showItemPreview(item, $event)"
        (mouseleave)="hideItemPreview()">
    </tr>
  </table>

  <!-- Conditional preview container -->
  @if (previewVisible) {
    <div class="preview-container"
         [style.left.px]="previewPosition.x"
         [style.top.px]="previewPosition.y"
         (mouseenter)="keepPreviewVisible()"
         (mouseleave)="hideItemPreview()">
      <app-preview-dialog [item]="currentPreviewItem"></app-preview-dialog>
    </div>
  }
</div>
```

## Key Techniques Explained

### 1. Smart Timeout Management
The implementation uses carefully timed delays to create a smooth user experience:

- **300ms delay before showing** - Prevents accidental previews when quickly moving the mouse
- **200ms delay before hiding** - Allows users to move their mouse to the preview without it disappearing
- **Clear existing timeouts** - Prevents conflicting timeout operations

### 2. Intelligent Positioning
The preview dialog appears near the mouse cursor while staying within screen boundaries. This positioning algorithm ensures the preview is always visible and accessible:

```typescript
private positionPreview(event: MouseEvent): void {
  const container = document.querySelector('.container-class');
  if (container) {
    const rect = container.getBoundingClientRect();
    this.previewPosition = {
      x: Math.min(event.clientX - rect.left + 15, rect.width - 270),
      y: Math.min(event.clientY - rect.top, window.innerHeight - 300)
    };
  }
}
```

**How the positioning works:**

1. **Container Detection**: The algorithm first finds the parent container element and gets its dimensions using `getBoundingClientRect()`

2. **Relative Positioning**: It calculates the mouse position relative to the container by subtracting the container's left and top positions from the mouse coordinates

3. **Horizontal Positioning**:
   - Adds 15px offset from the cursor for better visibility
   - Uses `Math.min()` to prevent the preview from extending beyond the container's right edge
   - The 270px value represents the maximum preview width

4. **Vertical Positioning**:
   - Places the preview at the exact vertical position of the mouse cursor
   - Constrains the position to prevent overflow beyond the window's bottom edge
   - The 300px value accounts for the preview height plus additional margin

5. **Boundary Protection**: The `Math.min()` functions act as safeguards, automatically adjusting the position when the preview would otherwise overflow the visible area

This approach creates a smooth user experience where the preview follows the mouse naturally while remaining fully visible regardless of cursor position.

### 3. Component Communication
The pattern uses Angular's `@Input()` binding to pass data between components:

- **List component** manages the hover state and positioning
- **Preview component** receives the current item and displays the content
- **Clean separation** - Each component has a single responsibility

### 4. Event Handling Strategy
The implementation handles various user interactions:

- **Mouse enter** - Triggers preview with delay
- **Mouse leave** - Hides preview with delay
- **Hover over preview** - Keeps preview visible
- **Click actions** - Separate from hover actions

## Advantages of This Approach

- **User Experience**: Provides instant feedback without navigation
- **Performance**: Minimal DOM manipulation and efficient rendering
- **Maintainability**: Clean component architecture with clear responsibilities
- **Type Safety**: Full TypeScript support with proper type definitions
- **Flexibility**: Easy to customize for different content types

## Implementation Tips

1. **Timeout Timing**: Use 300ms for showing, 200ms for hiding as optimal values
2. **Position Awareness**: Always check viewport boundaries to prevent overflow
3. **Memory Management**: Clean up timeouts in `ngOnDestroy` to prevent memory leaks
4. **Accessibility**: Add keyboard navigation support for better accessibility
5. **Mobile Support**: Consider touch events for mobile device compatibility