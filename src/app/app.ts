import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, linkedSignal, signal } from '@angular/core';
import { Album } from './interfaces/album';
import { SortField, SortDirection } from './interfaces/sort';

const API_URL = 'https://jsonplaceholder.typicode.com/albums';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class App {
  protected title = 'Linked Signals + httpResource + computed Example';

  protected albums = httpResource<Album[]>(
    () => API_URL,
    {
      defaultValue: [],
    }
  );

  protected sortedAlbums = computed(()=> {
    const sortField = this.sortField();
    const sortDirection = this.sortDirection();
    const albums = this.albums.value();

    if (!sortField || !sortDirection) {
      return albums;
    }

    return albums.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  });

  protected sortField = signal<SortField | undefined>(undefined);

  protected sortDirection = linkedSignal<SortField | undefined, SortDirection | undefined>({
    source: this.sortField,
    computation: (source, _prev) => {
      if (source === undefined) {
        return undefined;
      }
      
      return 'asc';
    }
  });

  toggleSortDirection() {
    const currentDirection = this.sortDirection();

    if (currentDirection === 'asc') {
      this.sortDirection.set('desc');
    } else {
      this.sortDirection.set('asc');
    }
  }

  changeSortField(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value as SortField | undefined;

    this.sortField.set(value);
  }
}
