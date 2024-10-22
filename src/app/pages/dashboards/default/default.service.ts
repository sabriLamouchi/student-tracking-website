

import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ad, O } from "@fullcalendar/core/internal-common";
import { Observable } from "rxjs";
import { addAdminDTO } from "./modal/default.modal";
@Injectable()
export class defaultService {
    constructor(private http: HttpClient) {

    }

     getAdmins():Observable<any[]>{
        return this.http.get<any[]>("http://localhost:3000/users/getAdmins");
    }
    createAdmin(data:addAdminDTO):Observable<any>{
        return this.http.post<any>("http://localhost:3000/users/createAdmin",data);
    }
} 