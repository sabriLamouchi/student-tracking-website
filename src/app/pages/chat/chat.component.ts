import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';

import { ChatUser, ChatMessage } from './chat.model';

import { chatData, chatMessagesData } from './data';
import { AuthService } from 'src/app/authentication/auth.service';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewInit {

  @ViewChild('scrollEle') scrollEle;
  @ViewChild('scrollRef') scrollRef;

  username = 'Steven Franklin';

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
  
  constructor(public formBuilder: UntypedFormBuilder,private authService: AuthService,private chatService: ChatService) {
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Skote' }, { label: 'Chat', active: true }];

    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });

    
    this.onListScroll();
    this._fetchData();
    this._fetchUserProfile();
    this._fetchRecentMessage();
    this._fetchContacts();
  }

  ngAfterViewInit() {
    this.scrollEle.SimpleBar.getScrollElement().scrollTop = 100;
    this.scrollRef.SimpleBar.getScrollElement().scrollTop = 200;
  }

  /**
   * Returns form
   */
  get form() {
    return this.formData.controls;
  }

  private _fetchData() {
    this.chatData = chatData;
    this.chatMessagesData = chatMessagesData;
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
          this.scrollRef.SimpleBar.getScrollElement().scrollHeight + 1500;
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
      data.map((message)=>{
        this.chatMessagesData.push({
          name: message.sender.id==this.userProfile.userId ? "You" : message.receiver.name,
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
