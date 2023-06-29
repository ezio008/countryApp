import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subject, Subscription, debounceTime, map } from 'rxjs';
import { OnInit } from '@angular/core';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  private debouncer: Subject<string> = new Subject<string>();
  private debouncerSubs?: Subscription;

  @Input()
  public placeholder: string = '';

  @Input()
  public initialValue: string = '';

  @Output()
  public onSearch: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {
    this.debouncerSubs = this.debouncer
      .pipe(
        debounceTime(300),
        map((value) => value.trim())
      )
      .subscribe((value) => {
        this.search(value);
      });
  }

  ngOnDestroy(): void {
    this.debouncerSubs?.unsubscribe();
  }

  public search(term: string) {
    if (term.length > 0) {
      this.onSearch.emit(term);
    }
  }

  onKeyPress(searchTerm: string) {
    this.debouncer.next(searchTerm);
  }
}
