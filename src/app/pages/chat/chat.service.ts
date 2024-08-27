import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable()
export class ChatService {
    constructor(private http: HttpClient) {
    }
    getContacts() {
        return this.http.get<any[]>("http://localhost:3000/users/getAdmins");
    }
    getRecentMessage() {
        return this.http.get<any[]>("http://localhost:3000/chat/recent");
    }

} 