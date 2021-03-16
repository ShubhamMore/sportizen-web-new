import { map, catchError } from 'rxjs/operators';
import { HttpService } from './../../../../services/shared-services/http.service';
import { environment } from './../../../../../environments/environment';
import { BehaviorSubject, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

export interface Message {
  senderId: string;
  receiverId: string;
  message: string;
  date: string;
  seen: string;
}
export interface ChatMember {
  name: string;
  userImageURL: string;
  sportizenId: string;
  isOnline?: boolean;
}
@Injectable()
export class ChatService {
  private chatMember = new BehaviorSubject<ChatMember>(null);

  getChatMember() {
    return this.chatMember;
  }

  setChatMember(chatMember: ChatMember) {
    this.chatMember.next(chatMember);
  }

  constructor(private httpService: HttpService) {}

  getMyConnections() {
    const data = { api: 'getMyConnections', data: {} };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getMessages(receiverId: string) {
    const data = { api: 'getChats', data: { receiverId } };
    return this.httpService.httpPost(data).pipe(
      map((messages: Message[]) => {
        return messages;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }
}
