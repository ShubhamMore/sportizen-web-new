import { HomeService } from '../../../services/home-services/home.service';
import { SocketioService } from '../../../services/communication-services/socket.service';
import { ChatService, ChatMember } from './@services/chat.service';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {
  user: ChatMember;
  socket: any;

  constructor(
    private chatService: ChatService,
    private socketioService: SocketioService,
    private titleService: Title,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.homeService.setRoute('Messages');

    this.socket = this.socketioService.getSocket();

    this.titleService.setTitle('SPORTIZEN | Chat');

    $(document).ready(() => {
      $(window).on('resize', () => {
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
