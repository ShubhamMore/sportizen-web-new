import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectionService } from '../../../services/user-services/connection.service';

export interface UserConnection {
  name: string;
  email: string;
  userImageURL: string;
  sportizenId: string;
  mutuleConnections?: string;
  connectionStatus?: string;
}

@Component({
  selector: 'app-user-connection',
  templateUrl: './user-connection.component.html',
  styleUrls: ['./user-connection.component.scss'],
})
export class UserConnectionComponent implements OnInit {
  @Input('user') user: UserConnection;
  @Input('isLoggedInUser') isLoggedInUser: boolean;
  @Input('isConnected') isConnected: boolean;
  @Input('connectionBtnText') connectionBtnText: string;
  @Output() connectionAction = new EventEmitter<void>();
  prevConnectionBtnText: string; // To Disable Unwanted Clicks

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private connectionService: ConnectionService
  ) {}

  ngOnInit(): void {
    this.prevConnectionBtnText = '';
  }

  viewProfile(id: string) {
    if (this.isLoggedInUser) {
      this.router.navigate(['/dashboard', 'profile'], { relativeTo: this.route });
    } else {
      this.connectionService.searchedSportizenId = id;
      this.router.navigate(['/dashboard', 'profile', id], { relativeTo: this.route });
    }
  }

  clickConnectionBtn() {
    if (this.prevConnectionBtnText !== this.connectionBtnText) {
      this.prevConnectionBtnText = this.connectionBtnText;
      this.connectionAction.emit();
    }
  }
}
