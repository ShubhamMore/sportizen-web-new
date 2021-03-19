import { SocketioService } from './../../../services/socket.service';
import { ChatService, ChatMember } from './@services/chat.service';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {
  user: ChatMember;
  socket: any;

  constructor(private chatService: ChatService, private socketioService: SocketioService) {}

  ngOnInit(): void {
    this.socket = this.socketioService.getSocket();

    $(document).ready(() => {
      $(window).resize(() => {
        if (this.user) {
          if ($(window).width() <= 400) {
            $('.chat-connections').css('display', 'none');
            $('.chat-messages').css('display', 'block');
          } else {
            $('.chat-connections').css('display', 'inline-block');
            $('.chat-messages').css('display', 'inline-block');
          }
        } else {
          if ($(window).width() <= 400) {
            $('.chat-connections').css('display', 'block');
            $('.chat-messages').css('display', 'none');
          } else {
            $('.chat-connections').css('display', 'inline-block');
            $('.chat-messages').css('display', 'inline-block');
          }
        }
      });
    });

    // tslint:disable-next-line: deprecation
    this.chatService.getChatMember().subscribe((chatMember: ChatMember) => {
      if (chatMember) {
        this.user = chatMember;
        if ($(window).width() <= 400) {
          $('.chat-connections').css('display', 'none');
          $('.chat-messages').css('display', 'block');
        } else {
          $('.chat-connections').css('display', 'inline-block');
          $('.chat-messages').css('display', 'inline-block');
        }
      } else {
        if ($(window).width() <= 400) {
          $('.chat-connections').css('display', 'block');
          $('.chat-messages').css('display', 'none');
        } else {
          $('.chat-connections').css('display', 'inline-block');
          $('.chat-messages').css('display', 'inline-block');
        }
      }
    });
  }
}
