import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ConnectionService } from './../../../../services/connection.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss'],
})
export class AllUsersComponent implements OnInit {
  searchResults: any;

  constructor(
    private route: ActivatedRoute,
    private connectionService: ConnectionService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param: Params) => {
      const searchKeyword = param.searchKeyword;
      if (searchKeyword) {
        this.connectionService.getSearchResults(searchKeyword).subscribe((res: any) => {
          this.searchResults = res;
        });
      }
    });
  }

  followUnfollow(name: string, sportizenId: string, connectionStatus: string, i: number) {
    if (connectionStatus === 'following') {
      this.connectionService.unfollowConnection(sportizenId).subscribe((res: any) => {
        this.searchResults[i].connectionStatus = 'not-connected';
        this.snackBar.open(`You unfollowed  ${name}`, null, {
          duration: 2000,
        });
      });
    } else {
      this.connectionService.sendConnectionRequest(sportizenId).subscribe((res: any) => {
        this.searchResults[i].connectionStatus = res.status;
        this.snackBar.open(`You are now following ${name}`, null, {
          duration: 2000,
        });
      });
    }
  }
}
