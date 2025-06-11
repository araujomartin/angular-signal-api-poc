# Example: Angular Signal API with LinkedSignal, httpResource and computed

This project demonstrates how to use Angular's new Signal API (v20+) to manage reactive state in a simple and efficient way, combining:

- **httpResource**: to consume HTTP resources reactively.
- **linkedSignal**: to create signals that depend on other signals.
- **computed**: to automatically derive values from signals.

## What does the example do?

- Fetches a list of albums from a public API (`https://jsonplaceholder.typicode.com/albums`) using `httpResource`.
- Allows sorting the list by different fields and directions using linked (`linkedSignal`) and derived (`computed`) signals.
- The user can change the sort field and direction (ascending/descending) from the UI, and the list updates automatically.

## Key code snippets

```typescript
// src/app/app.ts
export class App {
  // Signal for the sort field
  protected sortField = signal<SortField | undefined>(undefined);

  // Linked signal for the sort direction
  protected sortDirection = linkedSignal<SortField | undefined, SortDirection | undefined>({
    source: this.sortField,
    computation: (source) => source ? 'asc' : undefined
  });

  // Reactive HTTP resource
  protected albums = httpResource<Album[]>(() => API_URL, { defaultValue: [] });

  // Computed signal for the sorted list
  protected sortedAlbums = computed(() => {
    const sortField = this.sortField();
    const sortDirection = this.sortDirection();
    const albums = this.albums.value();
    if (!sortField || !sortDirection) return albums;
    return albums.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  });
}
```
