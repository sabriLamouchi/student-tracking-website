import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import CreateStudentModel, { StudentModel } from './student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:3000/student';
  constructor(private http: HttpClient) { }

  async getAllStudents(): Promise<any[]> {
    const response = await fetch(this.apiUrl,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('JWT_Token')}`
      }
    });
    if (response.ok) {
      return await response.json();
    }else{
      throw new Error('Network response was not ok');
    }
  }
  addStudent(student:CreateStudentModel | any): Observable<any> {
    return this.http.post<any>(this.apiUrl, student);
  }
  
  removeStudent(id:number):Observable<any>{
    return this.http.delete<any>(this.apiUrl +  '/' + id);
  }
  editStudent(id: number, student): Observable<StudentModel> {
    return this.http.patch<any>(this.apiUrl + '/' + id, student);
  }

}
