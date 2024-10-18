import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';

import { ChatUser, ChatMessage } from './chat.model';

import { chatData, chatMessagesData } from './data';
import { AuthService } from 'src/app/authentication/auth.service';
import { ChatService } from './chat.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewInit {

  @ViewChild('scrollEle') scrollEle;
  @ViewChild('scrollRef') scrollRef;

  username = 'Steven Franklin';
  status="horline";

  // bread crumb items
  breadCrumbItems: Array<{}>;
  chatData: ChatUser[];
  RecentChatData: any[];
  chatMessagesData: ChatMessage[];
  contacts: any[];
  formData: UntypedFormGroup;
  // Form submit
  chatSubmit: boolean;
  usermessage: string;
  userProfile:any;
  emoji:any = '';
  recieverId:number;
  
  constructor(public formBuilder: UntypedFormBuilder,private authService: AuthService,private chatService: ChatService,private toastr:ToastrService) {
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Skote' }, { label: 'Chat', active: true }];

    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });

    this.chatService.getNewMesage().subscribe(async(message:any )=>{
      console.log("New Message",message);
      await this._fetchsenderName(message.senderId).then(data=>{
        data.subscribe((data:any)=>{
          console.log("data",data);
          this.toastr.info('you have message from '+data.name+data.last_name+'\n Message: '+message.message,'Bootstrap')
          this.chatMessagesData.push({
            name: message.senderId == this.userProfile.userId ? "you" : data.name,
            align:message.senderId==this.userProfile.userId ? 'right' : 'left',
            message: message.message,
            time: message.time
          });
        })
        this.scrollRef.SimpleBar.getScrollElement().scrollTop =
        this.scrollRef.SimpleBar.getScrollElement().scrollHeight + 30000;
      });
      this.onListScroll();
    })
    this._fetchData();
    this._fetchUserProfile();
    this._fetchRecentMessage();
    this._fetchContacts();
  }

  ngAfterViewInit() {
    this.scrollEle.SimpleBar.getScrollElement().scrollTop = 100;
    this.scrollRef.SimpleBar.getScrollElement().scrollTop = 3000;
  }

  /**
   * Returns form
   */
  get form() {
    return this.formData.controls;
  }
  private async _fetchsenderName(id:number):Promise<any>{
    return await this.chatService.getSenderName(id);
  }
  private _fetchData() {
    this.chatData = chatData;
    this.chatMessagesData = chatMessagesData;
  }
  private _isAsender(chatmessages:any[],senderName:string):boolean{
    const res:boolean=false
    chatmessages.forEach((message)=>{
      if(message.align!='right'&& message.name==senderName ){
        return true
      }
    })
    return res
  }
  private _fetchUserProfile() {
    this.authService.getProfile().subscribe(data => {
      this.userProfile = data;
      console.log("User Profile",this.userProfile);
    });
  }
  private _fetchRecentMessage(){
    this.chatService.getRecentMessage().subscribe(data => {
      console.log("Recent Message",data);
      this.RecentChatData = data;
    });
  }
  private _fetchContacts(){
    this.chatService.getContacts().subscribe(data => {
      this.contacts = data.filter((user)=>user.name!=this.userProfile.name && user.last_name!=this.userProfile.last_name);
      console.log("Contacts",this.contacts);
    });
  }

  onListScroll() {
    if (this.scrollRef !== undefined) {
      setTimeout(() => {
        this.scrollRef.SimpleBar.getScrollElement().scrollTop =
          this.scrollRef.SimpleBar.getScrollElement().scrollHeight + 30000;
      }, 500);
    }
  }

  chatUsername(reciverId:number,name:string) {
    this.username = name;
    this.chatMessagesData = [];
    this.recieverId = reciverId;
    // const currentDate = new Date();  
    this.chatService.getAllMessagesforSenderAndReciever(reciverId).subscribe(data=>{
      console.log("Message data:",data);
      this.status=data[0].receiver.status;
      data.map((message)=>{
        this.chatMessagesData.push({
          name: message.sender.id == this.userProfile.userId ? "you" : message.sender.name,
          align:message.sender.id==this.userProfile.userId ? 'right' : 'left',
          message: message.message,
          time: message.time
        });
      })
    })
  }

  /**
   * Save the message in chat
   */
  messageSave() {
    const message = this.formData.get('message').value;
    const currentDate = new Date();
    if (this.formData.valid && message) {
      // Message Push in Chat
      this.chatService.sendSocketMessage(
        { 
        message,
        receiverId:this.recieverId,
        time:currentDate.getHours() + ':' + currentDate.getMinutes()
        }
    );

      this.chatService.sendMessage(
        { message,
          receiverId:this.recieverId,
          time:currentDate.getHours() + ':' + currentDate.getMinutes()}
      ).subscribe(data=>{
        console.log("Message Sent",data);
        this.chatMessagesData.push({
          align: 'right',
          name: "you",
          message,
          time: currentDate.getHours() + ':' + currentDate.getMinutes() 
        });
      })
      this.onListScroll();

      // Set Form Data Reset
      this.formData = this.formBuilder.group({
        message: null
      });
    }

    this.chatSubmit = true;
  }

  // Delete Message
  deleteMessage(event: any) {
    event.target.closest('li').remove();
  }

  // Copy Message
  copyMessage(event: any) {
    navigator.clipboard.writeText(event.target.closest('li').querySelector('p').innerHTML);
  }

  // Delete All Message
  deleteAllMessage(event: any) {
    var allMsgDelete: any = document.querySelector('.chat-conversation')?.querySelectorAll('li');
    allMsgDelete.forEach((item: any) => {
      item.remove();
    })
  }

  // Emoji Picker
  showEmojiPicker = false;
  sets: any = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  set: any = 'twitter';
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {

    const { emoji } = this;
    if (this.formData.get('message').value) {
      var text = `${emoji}${event.emoji.native}`;
    } else {
      text = event.emoji.native;
    }
    this.emoji = text;
    this.showEmojiPicker = false;
  }

  onFocus() {
    this.showEmojiPicker = false;
  }

  onBlur() {
  }

  closeReplay() {
    document.querySelector('.replyCard')?.classList.remove('show');
  }

  // Contact Search
  ContactSearch() {
    var input: any, filter: any, ul: any, li: any, a: any | undefined, i: any, txtValue: any;
    input = document.getElementById("searchContact") as HTMLAreaElement;
    filter = input.value.toUpperCase();
    ul = document.querySelectorAll(".chat-list");
    ul.forEach((item: any) => {
      li = item.getElementsByTagName("li");
      for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("h5")[0];
        txtValue = a?.innerText;
        if (txtValue?.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
        } else {
          li[i].style.display = "none";
        }
      }
    })
  }

}
