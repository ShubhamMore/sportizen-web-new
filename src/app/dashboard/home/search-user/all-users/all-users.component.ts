import { UserProfileService } from './../../../../services/user-profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConnectionService } from './../../../../services/connection.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss'],
})
export class AllUsersComponent implements OnInit {
  searchResults: any[];
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
    this.userProfileService.getUserSportizenId().subscribe((sportizenId: string) => {
      this.sportizenId = sportizenId;

      this.route.params.subscribe((param: Params) => {
        const searchKeyword = param.searchKeyword;
        this.searchKeyword = searchKeyword;
        this.searchResults = [];
        if (searchKeyword) {
          this.connectionService.getSearchResults(searchKeyword).subscribe((res: any[]) => {
            this.searchResults = res;
          });
        }
      });
    });
  }

  viewProfile(id: string) {
    if (id === this.sportizenId) {
      this.router.navigate(['/dashboard', 'profile'], {});
    } else {
      this.connectionService.searchedSportizenId = id;
      this.router.navigate(['/dashboard', 'profile', id], {});
    }
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
