import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { sendMesageDTO } from "./chat.model";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";
@Injectable()
export class ChatService {
    constructor(private http: HttpClient,private socket:Socket) {
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
    async getSenderName(id:number){
        return await this.http.get<any>(`http://localhost:3000/users/getUser/${id}`);
    }
    //send message
    sendMessage(message: sendMesageDTO) {
        return this.http.post<any>(`http://localhost:3000/chat/send`, message);
    }

    sendSocketMessage(message: sendMesageDTO) {
        this.socket.emit("sendMessage", message);
    }
    
    getNewMesage():Observable<any>{
        return this.socket.fromEvent("newMessage");
    }
} 