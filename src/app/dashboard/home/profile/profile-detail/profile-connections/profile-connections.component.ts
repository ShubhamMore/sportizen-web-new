import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConnectionService } from '../../../../../services/connection.service';
import { ProfileService } from './../../@shared/profile.service';

interface Connection {
  name: string;
  email: string;
  userImageURL: string;
  sportizenId: string;
  mutuleConnections?: string;
  connectionStatus?: string;
}

@Component({
  selector: 'app-profile-connections',
  templateUrl: './profile-connections.component.html',
  styleUrls: ['./profile-connections.component.scss'],
})
export class ProfileConnectionsComponent implements OnInit {
  userId: string;
  isFollowers: boolean;
  loading: boolean;
  connections: Connection[];

  sportizenId: string;

  constructor(
    private userProfileService: UserProfileService,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private connectionService: ConnectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.userProfileService.getUserSportizenId().subscribe((sportizenId: string) => {
      this.sportizenId = sportizenId;
    });

    this.profileService.getUserSportizenId().subscribe((sportizenId: string) => {
      this.loading = true;
      this.userId = sportizenId;

      this.connections = [];

      this.route.data.subscribe((data: any) => {
        this.isFollowers = data.isFollowers;
        this.getConnections(this.userId, this.isFollowers);
      });
    });
  }

  getConnections(userProfileId: string, isFollowers: boolean) {
    let connectionSubscription: any;

    if (isFollowers) {
      if (userProfileId) {
        connectionSubscription = this.userProfileService.getUserFollowers(userProfileId);
      } else {
        connectionSubscription = this.userProfileService.getMyFollowers();
      }
    } else {
      if (userProfileId) {
        connectionSubscription = this.userProfileService.getUserFollowings(userProfileId);
      } else {
        connectionSubscription = this.userProfileService.getMyFollowings();
      }
    }

    connectionSubscription.subscribe(
      (connections: Connection[]) => {
        this.connections = connections;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  viewProfile(id: string) {
    if (id === this.sportizenId) {
      this.router.navigate(['/dashboard', 'profile'], { relativeTo: this.route });
    } else {
      this.connectionService.searchedSportizenId = id;
      this.router.navigate(['/dashboard', 'profile', id], { relativeTo: this.route });
    }
  }

  followUser(name: string, sportizenId: string, i: number) {
    this.connectionService.sendConnectionRequest(sportizenId).subscribe(
      (res: any) => {
        this.connections[i].connectionStatus = res.status;
        this.connections.splice(i, 1);

        this.snackBar.open(`You are now following ${name}`, null, {
          duration: 2000,
          panelClass: ['success-snackbar'],
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

  unfollowUser(name: string, sportizenId: string, i: number) {
    this.connectionService.unfollowConnection(sportizenId).subscribe(
      (res: any) => {
        this.connections[i].connectionStatus = 'not-connected';
        this.connections.splice(i, 1);

        this.snackBar.open(`You unfollowed  ${name}`, null, {
          duration: 2000,
          panelClass: ['success-snackbar'],
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

  removeUser(name: string, sportizenId: string, i: number) {
    this.connectionService.removeFollowerConnection(sportizenId).subscribe(
      (res: any) => {
        this.connections.splice(i, 1);
        this.snackBar.open(`You Removed ${name}`, null, {
          duration: 2000,
          panelClass: ['success-snackbar'],
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
