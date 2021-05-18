import { UserProfileService } from './../../../../services/user-services/user-profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConnectionService } from '../../../../services/user-services/connection.service';
import { first } from 'rxjs/operators';
import { UserConnection } from './../../user-connection/user-connection.component';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss'],
})
export class AllUsersComponent implements OnInit {
  searchResults: UserConnection[];
  sportizenId: string;
  searchKeyword: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userProfileService: UserProfileService,
    private connectionService: ConnectionService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userProfileService
      .getUserSportizenId()
      .pipe(first())
      .subscribe((sportizenId: string) => {
        this.sportizenId = sportizenId;

        this.route.params.subscribe((param: Params) => {
          const searchKeyword = param.searchKeyword;
          this.searchKeyword = searchKeyword;
          this.searchResults = [];
          if (searchKeyword) {
            this.connectionService
              .getSearchResults(searchKeyword)
              .subscribe((res: UserConnection[]) => {
                this.searchResults = res;
              });
          }
        });
      });
  }

  followUnfollow(name: string, sportizenId: string, connectionStatus: string, i: number) {
    if (connectionStatus === 'following') {
      this.connectionService.unfollowConnection(sportizenId).subscribe(
        (res: any) => {
          this.searchResults[i].connectionStatus = 'not-connected';
          this.snackBar.open(`You unfollowed  ${name}`, null, {
            duration: 2000,
          });
        },
        (error: any) => {
          this.snackBar.open(error, null, {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
        }
      );
    } else {
      this.connectionService.sendConnectionRequest(sportizenId).subscribe(
        (res: any) => {
          this.searchResults[i].connectionStatus = res.status;
          this.snackBar.open(`You are now following ${name}`, null, {
            duration: 2000,
          });
        },
        (error: any) => {
          this.snackBar.open(error, null, {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
        }
      );
    }
  }
}
