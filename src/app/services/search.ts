import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Search {
  // BehaviorSubject remembers the last broadcasted value
  private searchSource = new BehaviorSubject<string>('');
  
  // Components will subscribe to this to listen for changes
  currentSearch = this.searchSource.asObservable();

  // The Navbar will call this to broadcast new text
  updateSearch(term: string) {
    this.searchSource.next(term);
  }
}