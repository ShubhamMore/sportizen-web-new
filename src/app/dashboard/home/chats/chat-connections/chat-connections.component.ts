import { SocketioService } from '../../../../services/communication-services/socket.service';
import { ChatService, ChatMember } from './../@services/chat.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-connections',
  templateUrl: './chat-connections.component.html',
  styleUrls: ['./chat-connections.component.scss'],
})
export class ChatConnectionsComponent implements OnInit {
  chatMembers: ChatMember[];

  socket: any;

  constructor(private chatService: ChatService, private socketioService: SocketioService) {}

  ngOnInit(): void {
    this.chatMembers = [];

    this.socket = this.socketioService.getSocket();

    this.chatService.getMyConnections().subscribe(
      (chatMembers: ChatMember[]) => {
        this.chatMembers = chatMembers;
      },
      (error: any) => {}
    );

    this.socket.on('isOnline', (isOnline: { sportizenId: string; isOnline: boolean }) => {
      console.log(isOnline);
      const chatMember = this.chatMembers.find(
        (curChatMember: ChatMember) => curChatMember.sportizenId === isOnline.sportizenId
      );

      chatMember.isOnline = isOnline.isOnline;
    });
  }

  chatMember(chatMember: ChatMember) {
    this.chatService.setChatMember(chatMember);
  }
}
