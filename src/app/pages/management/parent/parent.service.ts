import { Injectable } from '@angular/core';
import ParentDto from './modals/parent.dto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  private apiUrl = 'http://localhost:3000/users';
  private apiUrl2 = 'http://localhost:3000/parent';
  constructor(private http: HttpClient) { }
  addParent(parent: ParentDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, parent);
  }
  getAllParents(isStudentNull:boolean): Observable<ParentDto[]> {
    return this.http.get<any>(`${this.apiUrl2}?isStudentNull=${isStudentNull}`);
  }
  removeParent(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl2 + '/' + id);
  }
  editParent(id: number, parent: ParentDto): Observable<any> {
    return this.http.patch<any>(this.apiUrl2 + '/' + id, parent);
  }
}
