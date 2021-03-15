import { UserProfileService } from './../../../../services/user-profile.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-connections',
  templateUrl: './chat-connections.component.html',
  styleUrls: ['./chat-connections.component.scss'],
})
export class ChatConnectionsComponent implements OnInit {
  connections: any[];

  constructor(private userProfileService: UserProfileService) {}

  ngOnInit(): void {
    this.connections = [];

    this.userProfileService.getMyConnections().subscribe(
      (connections: any[]) => {
        console.log(connections);
        this.connections = connections;
      },
      (error: any) => {}
    );
  }
}
