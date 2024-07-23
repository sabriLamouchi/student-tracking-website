import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubjectModel } from './subject.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private apiUrl = 'http://localhost:3000/subject';
  constructor(private http: HttpClient) { }

  getAllSubjects(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl);
  }
  addSubject(subject:SubjectModel | any): Observable<any> {
    return this.http.post<any>(this.apiUrl, subject);
  }
  
  removeSubject(id:number):Observable<any>{
    return this.http.delete<any>(this.apiUrl +  '/' + id);
  }
}
