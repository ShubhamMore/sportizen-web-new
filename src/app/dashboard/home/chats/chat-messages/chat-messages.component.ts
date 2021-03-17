import { SocketioService } from './../../../../services/socket.service';
import { ChatMember, ChatService, Message } from './../@services/chat.service';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  QueryList,
  ViewChildren,
  AfterViewInit,
} from '@angular/core';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { MatMenuTrigger } from '@angular/material/menu';

interface DeleteMessageData {
  messageId: string;
  senderId: string;
  receiverId: string;
  index: number;
}

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss'],
})
export class ChatMessagesComponent implements OnInit, AfterViewInit {
  @ViewChild('messageScrollContainer', { static: false }) private messageScrollFrame: ElementRef;
  @ViewChildren('messageElement') private messageElements: QueryList<any>;

  // we create an object that contains coordinates
  menuTopLeftPosition = { x: '0', y: '0' };

  // reference to the MatMenuTrigger in the DOM
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger;

  private messageScrollContainer: any;

  private isNearBottom: boolean;

  user: ChatMember;
  socket: any;

  sportizenId: string;

  messages: Message[];
  messageLoading: boolean;

  message: string;

  constructor(
    private chatService: ChatService,
    private socketioService: SocketioService,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.isNearBottom = true;
    this.messageLoading = false;

    this.sportizenId = this.userProfileService.getUserSportizenId();

    this.socket = this.socketioService.getSocket();

    this.messages = [];

    // tslint:disable-next-line: deprecation
    this.chatService.getChatMember().subscribe((chatMember: ChatMember) => {
      if (chatMember) {
        this.user = chatMember;
        this.messages = [];
        this.message = null;
        this.messageLoading = true;

        this.chatService.getMessages(this.user.sportizenId).subscribe(
          (messages: Message[]) => {
            this.messages = messages;
            this.messageLoading = false;
          },
          (error: any) => {}
        );
      }
    });

    this.listenMessages();
  }

  ngAfterViewInit() {
    this.messageScrollContainer = this.messageScrollFrame.nativeElement;
    // tslint:disable-next-line: deprecation
    this.messageElements.changes.subscribe((_) => this.onMessageElementsChanged());
  }

  onMessageElementsChanged() {
    if (this.isNearBottom) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    this.messageScrollContainer.scroll({
      top: this.messageScrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  }

  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position =
      this.messageScrollContainer.scrollTop + this.messageScrollContainer.offsetHeight;
    const height = this.messageScrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrolled(event: any): void {
    this.isNearBottom = this.isUserNearBottom();
  }

  private listenMessages() {
    this.socket.on('message', (message: any) => {
      this.messages.push(message);
    });
  }

  backToChatMembers() {
    this.chatService.setChatMember(null);
  }

  send(e?: any) {
    if (this.message.trim()) {
      this.socket.emit('message', { message: this.message, receiverId: this.user.sportizenId });
      this.message = null;
    } else {
      this.message = null;
    }
  }

  onRightClick(event: MouseEvent, menuData: DeleteMessageData) {
    // preventDefault avoids to show the visualization of the right-click menu of the browser
    event.preventDefault();

    // we record the mouse position in our object
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';

    // we open the menu
    // we pass to the menu the information about our object
    this.matMenuTrigger.menuData = { menuData };

    // we open the menu
    this.matMenuTrigger.openMenu();
  }

  deleteMessage(message: DeleteMessageData) {
    if (message.senderId === this.sportizenId) {
      this.chatService
        .deleteMessageForSender(message.messageId, message.senderId, message.receiverId)
        .subscribe(
          (res: any) => {
            this.messages.splice(message.index, 1);
          },
          (error: any) => {}
        );
    } else {
      this.chatService
        .deleteMessageForReceiver(message.messageId, message.senderId, message.receiverId)
        .subscribe(
          (res: any) => {
            this.messages.splice(message.index, 1);
          },
          (error: any) => {}
        );
    }
  }

  deleteMessageForBoth(message: DeleteMessageData) {
    this.chatService
      .deleteMessageForBoth(message.messageId, message.senderId, message.receiverId)
      .subscribe(
        (res: any) => {
          this.messages.splice(message.index, 1);
        },
        (error: any) => {}
      );
  }
}
