import {
  Component, Input, Output, EventEmitter,
  OnChanges, SimpleChanges, ContentChildren,
  QueryList, AfterContentInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AdminTableColumn {
  key: string;        // property name on the row object
  label: string;      // column header
  type?: 'text' | 'status' | 'currency' | 'number' | 'template';
  currencySymbol?: string;  // e.g. '₹'
}

@Component({
  selector: 'app-admin-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css']
})
export class AdminTableComponent implements OnChanges {

  @Input() rows: any[] = [];
  @Input() columns: AdminTableColumn[] = [];
  @Input() isLoading = false;
  @Input() pageSize = 10;
  @Input() searchPlaceholder = 'Search...';
  @Input() emptyMessage = 'No records found';
  @Input() searchKeys: string[] = []; // which keys to search across

  @Output() editRow   = new EventEmitter<any>();
  @Output() deleteRow = new EventEmitter<any>();

  searchText   = '';
  currentPage  = 1;
  pageSizes    = [5, 10, 25, 50];

  get filtered(): any[] {
    if (!this.searchText.trim()) return this.rows;
    const q = this.searchText.toLowerCase();
    const keys = this.searchKeys.length ? this.searchKeys
      : this.columns.filter(c => c.type !== 'status').map(c => c.key);
    return this.rows.filter(row =>
      keys.some(k => String(row[k] ?? '').toLowerCase().includes(q))
    );
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  get pagedRows(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    const cur   = this.currentPage;
    const pages: number[] = [];
    const delta = 2;
    for (let i = Math.max(1, cur - delta); i <= Math.min(total, cur + delta); i++) {
      pages.push(i);
    }
    return pages;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows']) {
      this.currentPage = 1;
      this.searchText  = '';
    }
  }

  onSearch(): void {
    this.currentPage = 1;
  }

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  getCellValue(row: any, col: AdminTableColumn): string {
    const val = row[col.key];
    if (col.type === 'currency') {
      return `${col.currencySymbol ?? ''}${val ?? '—'}`;
    }
    return val ?? '—';
  }
}
