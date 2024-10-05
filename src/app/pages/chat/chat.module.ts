import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from './chat.service';
import { ChatComponent } from './chat.component';
import { AuthenticationModule } from 'src/app/authentication/authentication.module';
import { UIModule } from "../../shared/ui/ui.module";
import { TablesModule } from '../tables/tables.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RouterModule } from '@angular/router';
import { ChatRoutingModule } from './chat-routing.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { socketIoConfigFactory } from './socket-config.factory';



// const config: SocketIoConfig = { 
//   url: 'http://localhost:3000/chat',
//   options: {
//     auth: {
//       token: `Bearer ${localStorage.getItem('JWT_Token')}`,
//     },
//     transports: ['websocket']
//   } };
@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    AuthenticationModule,
    UIModule,
    TablesModule,
    SimplebarAngularModule,
    FormsModule,
    TabsModule,
    ReactiveFormsModule,
    ChatRoutingModule,
    SocketIoModule.forRoot(socketIoConfigFactory())
],
  providers: [ChatService,
  ],
})
export class ChatModule { }
