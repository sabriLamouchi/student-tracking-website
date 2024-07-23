import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubjectModel } from '../subject/subject.model';
import { createClassDTO, scolarYearDTO } from './modal/scolarYearDTO.model';

@Injectable({
  providedIn: 'root'
})
export class ScolarService {
  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  getAllScolarYears(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl+'/scolar');
  }
  addScolarYear(scolarYear:scolarYearDTO | any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/scolar', scolarYear);
  }

  getAllClasses(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl + '/classe');
  }
  addClass(classe:createClassDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/classe', classe);
  }
}
