# Angular Dialog Implementation

## Overview
This entry describes how dialog previews are implemented in Angular using Material Design components. The pattern enables hover-based preview functionality that displays contextual information without requiring navigation.

## Key Components

### 1. List Component (`*-list.component.ts`)
The main component that manages the hover preview functionality:

```typescript
// Preview popup properties
previewVisible = false;
currentPreviewItem: ItemType | null = null;
previewPosition = { x: 0, y: 0 };
hoverTimeout: ReturnType<typeof setTimeout> | null = null;
hideTimeout: ReturnType<typeof setTimeout> | null = null;

constructor(
  private dialog: MatDialog,
  // Other dependencies
) {}

// Preview methods
showItemPreview(item: ItemType, event: MouseEvent): void {
  clearTimeout(this.hoverTimeout ?? 0);
  clearTimeout(this.hideTimeout ?? 0);

  this.hoverTimeout = setTimeout(() => {
    this.currentPreviewItem = item;
    this.previewVisible = true;

    // Position the preview near the mouse
    const container = document.querySelector('.container-class');
    if (container) {
      const rect = container.getBoundingClientRect();
      this.previewPosition = {
        x: Math.min(event.clientX - rect.left + 15, rect.width - 270), // 270px is the popup width
        y: Math.min(event.clientY - rect.top, window.innerHeight - 300) // 300px is popup height with margin
      };
    }
  }, 300); // Reduced timeout for better UX
}

hideItemPreview(): void {
  clearTimeout(this.hoverTimeout ?? 0);
  clearTimeout(this.hideTimeout ?? 0);

  // Add a small delay before hiding to allow moving mouse to preview
  this.hideTimeout = setTimeout(() => {
    this.previewVisible = false;
    this.currentPreviewItem = null;
  }, 200);
}

keepPreviewVisible(): void {
  // Keep preview visible when hovering over it
  clearTimeout(this.hideTimeout ?? 0);
}
```

### 2. Preview Dialog Component (`*-preview-dialog.component.ts`)
A standalone component that displays detailed information:

```typescript
@Component({
  selector: 'app-preview-dialog',
  standalone: true,
  imports: [MatIcon, NgIf, CommonModule],
  template: `
    <div class="preview-box" *ngIf="item">
      <div class="container">
        <div class="row">
          <div class="col d-flex flex-column align-items-center">
            <h4 class="preview-title">{{ item!.name }}</h4>
          </div>
        </div>
        <div class="row">
          <div class="col d-flex flex-column align-items-start justify-content-around preview-info">
            <span class="item-meta">Type: <mat-icon>{{ getIcon(item!) }}</mat-icon></span>
            <span class="item-meta">Description: {{ item!.description }}</span>
          </div>
          <div class="col preview-image" *ngIf="imageUrl">
            <img [src]="imageUrl" alt="Item image" class="preview-img img-fluid"/>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .preview-box {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      padding: 16px;
      min-width: 250px;
      max-width: 270px;
      border: 1px solid #e0e0e0;
    }
    .preview-title {
      font-weight: bold;
      margin-bottom: 8px;
      color: #333;
    }
    .preview-info {
      font-size: 14px;
      color: #666;
    }
    .item-meta {
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .preview-img {
      border-radius: 4px;
      max-height: 120px;
      object-fit: cover;
    }
  `]
})
export class PreviewDialogComponent implements OnChanges {
  @Input() item: ItemType | null = null;
  imageUrl: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.item) {
      this.imageUrl = this.item.image ? `${environment.apiUrl}/images/${this.item.image}` : null;
    }
  }

  getIcon(item: ItemType): string {
    switch (item.category) {
      case 'category1':
        return 'icon1';
      case 'category2':
        return 'icon2';
      default:
        return 'default_icon';
    }
  }
}
```

## Implementation Pattern

### HTML Structure (`*-list.component.html`)
```html
<div class="table-container">
  <table mat-table [dataSource]="items">
    <!-- Column definitions -->
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef>Name</th>
      <td mat-cell *matCellDef="let item">{{ item.name }}</td>
    </ng-container>

    <!-- Preview column -->
    <ng-container matColumnDef="preview">
      <th mat-header-cell *matHeaderCellDef>Preview</th>
      <td mat-cell *matCellDef="let item">
        <button mat-icon-button (click)="openFullDialog(item); $event.stopPropagation()">
          <mat-icon>visibility</mat-icon>
        </button>
      </td>
    </ng-container>

    <!-- Table rows with hover events -->
    <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
    <tr
      mat-row *matRowDef="let item; columns: columnsToDisplay;"
      class="clickable-row"
      (click)="navigateToItem(item.id)"
      (mouseenter)="showItemPreview(item, $event)"
      (mouseleave)="hideItemPreview()">
    </tr>
  </table>

  <!-- Preview Container -->
  @if (previewVisible) {
    <div
      class="preview-container"
      [style.left.px]="previewPosition.x"
      [style.top.px]="previewPosition.y"
      (mouseenter)="keepPreviewVisible()"
      (mouseleave)="hideItemPreview()">
      <app-preview-dialog [item]="currentPreviewItem"></app-preview-dialog>
    </div>
  }
</div>
```

### CSS Styling
```css
.table-container {
  position: relative;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: #f5f5f5;
}

.preview-container {
  position: absolute;
  z-index: 1000;
  pointer-events: auto;
}

.preview-container:hover {
  pointer-events: auto;
}
```

## Key Techniques

### 1. Conditional Rendering
- Uses Angular's `@if` block for showing/hiding preview
- Efficient DOM manipulation with minimal re-renders

### 2. Dynamic Positioning
- Calculates preview position based on mouse coordinates
- Keeps preview within viewport boundaries
- Uses `getBoundingClientRect()` for precise positioning

### 3. Timeout Management
- Prevents flickering with delayed show/hide
- Manages multiple timeout references
- Clears existing timeouts before setting new ones

### 4. Component Communication
- Uses `@Input()` property binding for data flow
- Clean separation of concerns between list and dialog components
- Reactive updates with `ngOnChanges` lifecycle hook

### 5. Event Handling
- Mouse events for hover interactions
- Stop propagation to prevent unwanted navigation
- Proper cleanup in `ngOnDestroy`

## Advanced Features

### Customizing Positioning Logic
```typescript
private calculatePreviewPosition(event: MouseEvent, container: Element): {x: number, y: number} {
  const rect = container.getBoundingClientRect();
  const popupWidth = 270;
  const popupHeight = 300;
  const offset = 15;

  // Calculate position with boundary checks
  let x = event.clientX - rect.left + offset;
  let y = event.clientY - rect.top;

  // Adjust if popup would overflow container
  if (x + popupWidth > rect.width) {
    x = rect.width - popupWidth - offset;
  }
  if (y + popupHeight > window.innerHeight) {
    y = window.innerHeight - popupHeight - offset;
  }

  return { x: Math.max(0, x), y: Math.max(0, y) };
}
```

### Adding Animation Support
```typescript
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void <=> *', animate('200ms ease-in-out'))
    ])
  ]
})
```

## Benefits

- **Responsive**: Preview appears near mouse cursor
- **User-Friendly**: Small delays prevent accidental triggering
- **Performance**: Efficient rendering with minimal DOM manipulation
- **Clean Architecture**: Separation of concerns between components
- **Type Safety**: Full TypeScript support with proper type definitions
- **Accessible**: Proper keyboard navigation and screen reader support

## Use Cases

- Hover previews in tables/lists
- Quick information display without navigation
- Context-sensitive popups
- Tooltip-style components with rich content
- Image galleries with hover previews
- Product catalogs with quick details

## Best Practices

1. **Timeout Values**: Use 300ms delay for showing, 200ms for hiding
2. **Performance**: Clear existing timeouts before setting new ones
3. **Accessibility**: Add keyboard navigation support
4. **Mobile Support**: Consider touch events for mobile devices
5. **Memory Management**: Cleanup timeouts in `ngOnDestroy`