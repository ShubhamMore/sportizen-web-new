import { ChatService } from './@services/chat.service';
import { SharedModule } from './../../../@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatsRoutingModule } from './chats-routing.module';
import { ChatsComponent } from './chats.component';
import { ChatConnectionsComponent } from './chat-connections/chat-connections.component';
import { ChatMessagesComponent } from './chat-messages/chat-messages.component';

@NgModule({
  declarations: [ChatsComponent, ChatConnectionsComponent, ChatMessagesComponent],
  imports: [CommonModule, SharedModule, ChatsRoutingModule],
  providers: [ChatService],
})
export class ChatsModule {}
