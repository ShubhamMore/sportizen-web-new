import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss'],
})
export class ChatMessagesComponent implements OnInit {
  user = {
    name: 'atharv nerurkar',
    sportizenId: 'atharvnerurkarpzPoN7',
    userImageURL:
      'https://lh3.googleusercontent.com/a-/AOh14GisVqCOl6TBS--_0d50k9uCHJ35p-PkjvL70IT1vg=s96-c',
  };

  constructor() {}

  ngOnInit(): void {}
}
