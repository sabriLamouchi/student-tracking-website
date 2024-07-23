import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { debounceTime, switchMap, delay, tap, catchError } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { classeModel } from './modal/scolarYearDTO.model';
import { SortColumn,SortDirection } from '../../jobs/list/list-sortable.directive';
import { HttpClient } from '@angular/common/http';

interface SearchResult {
  classes: classeModel[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  status: string;
  type: string;
  date: string;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(classes: classeModel[], column: SortColumn, direction: string): classeModel[] {
  if (direction === '' || column === '') {
    return classes;
  } else {
    return [...classes].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(classe: classeModel, term: string, pipe: PipeTransform) {
  return classe.name.toLowerCase().includes(term.toLowerCase()) ||
    classe.teacher.name.toLowerCase().includes(term.toLowerCase()) ||
    classe.teacher.last_name.toLowerCase().includes(term.toLowerCase()) ||
    classe.student.name.toLowerCase().includes(term.toLowerCase()) ||
    classe.student.last_name.toLowerCase().includes(term.toLowerCase()) ||
    classe.scolar.year.toLowerCase().includes(term.toLowerCase()) ||
    classe.subject.name.toLowerCase().includes(term.toLowerCase());
}

@Injectable({ providedIn: 'root' })
export class ClasseListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _classes$ = new BehaviorSubject<classeModel[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private classeData:classeModel[]=[];
  content?: any;
  products?: any;

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    startIndex: 0,
    endIndex: 9,
    totalRecords: 0,
    status: '',
    type: '',
    date: '',
  };

  constructor(private pipe: DecimalPipe,private http: HttpClient) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap((classData:any) => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._classes$.next(result.classes);
      this._total$.next(result.total);
    });
    this._fetchClasses();
    this._search$.next();
  }

  get classes$() { return this._classes$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get startIndex() { return this._state.startIndex; }
  get endIndex() { return this._state.endIndex; }
  get totalRecords() { return this._state.totalRecords; }
  get status() { return this._state.status; }
  get type() { return this._state.type; }
  get date() { return this._state.date; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }
  set startIndex(startIndex: number) { this._set({ startIndex }); }
  set endIndex(endIndex: number) { this._set({ endIndex }); }
  set totalRecords(totalRecords: number) { this._set({ totalRecords }); }
  set status(status: any) { this._set({ status }); }
  set type(type: any) { this._set({ type }); }
  set date(date: any) { this._set({ date }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }
  private _fetchClasses() {
    this.http.get<classeModel[]>('http://localhost:3000/classe')
      .pipe(
        catchError(() => of([])), // handle error
      )
      .subscribe(classes => {
        this._classes$.next(classes);
        this.classeData=classes;
        this._search$.next();
      });
  }
  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm, status, type, date } = this._state;
    console.log("this.classeData",this.classeData);
    // 1. sort
    let classes = sort(this.classeData, sortColumn, sortDirection);
    
    console.log("sorted classes ",classes);
    // 2. filter
    if(this.classeData){
        classes = classes.filter(classe => matches(classe, searchTerm, this.pipe));
    }



    const total = classes.length;

    // 5. paginate
    this.totalRecords = classes.length;
    this._state.startIndex = (page - 1) * this.pageSize + 1;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    classes = classes.slice(this._state.startIndex - 1, this._state.endIndex);
    return of({ classes, total });
  }
}
