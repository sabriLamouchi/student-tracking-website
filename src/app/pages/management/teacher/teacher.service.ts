import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { teacherModel } from './modal/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private apiUrl = 'http://localhost:3000/users';
  private apiUrl2 = 'http://localhost:3000/teacher';
  constructor(private http: HttpClient) { }

  async getAllTeachers(): Promise<any[]> {
    try {
      const response = await fetch(this.apiUrl2,{
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
    catch(e){
      return e;
    }

  }
  addTeacher(teacher:teacherModel | any): Observable<any> {
    try {
      var res=this.http.post<any>(this.apiUrl, teacher);
    } catch (error) {
      console.log(error);
      return error;
    }
    return res;
  }
  
  removeTeacher(id:number):Observable<any>{
    return this.http.delete<any>(this.apiUrl2 +  '/' + id);
  }
  editTeacher(id: number, teacher): Observable<any> {
    return this.http.patch<any>(this.apiUrl2 + '/' + id, teacher);
  }
}
