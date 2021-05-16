import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectionService } from './../../../services/connection.service';

@Component({
  selector: 'app-user-connection',
  templateUrl: './user-connection.component.html',
  styleUrls: ['./user-connection.component.scss'],
})
export class UserConnectionComponent implements OnInit {
  @Input('user') user: any;
  @Input('isLoggedInUser') isLoggedInUser: boolean;
  @Input('isConnected') isConnected: boolean;
  @Input('connectionBtnText') connectionBtnText: string;
  @Output() connectionAction = new EventEmitter<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private connectionService: ConnectionService
  ) {}

  ngOnInit(): void {}

  viewProfile(id: string) {
    if (this.isLoggedInUser) {
      this.router.navigate(['/dashboard', 'profile'], {});
    } else {
      this.connectionService.searchedSportizenId = id;
      this.router.navigate(['/dashboard', 'profile', id], {});
    }
  }

  clickConnectionBtn() {
    this.connectionAction.emit();
  }
}
