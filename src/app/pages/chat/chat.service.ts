import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { sendMesageDTO } from "./chat.model";

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
    getAllMessagesforSenderAndReciever(receiverId: number) {
        return this.http.get<any[]>(`http://localhost:3000/chat/chats/${receiverId}`);
    }

    //send message
    sendMessage(message: sendMesageDTO) {
        return this.http.post<any>(`http://localhost:3000/chat/send`, message);
    }
} 