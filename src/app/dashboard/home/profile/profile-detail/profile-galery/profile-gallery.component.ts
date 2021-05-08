import { Component, OnInit } from '@angular/core';
import { PostGalleryService } from '../../../../../services/post-gallery.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ImageModelComponent } from 'src/app/image/image-model/image-model.component';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from './../../@shared/profile.service';

@Component({
  selector: 'app-profile-gallery',
  templateUrl: './profile-gallery.component.html',
  styleUrls: ['./profile-gallery.component.scss'],
})
export class ProfileGalleryComponent implements OnInit {
  userId: string;
  loading: boolean;
  gallery: any[];

  constructor(
    private postGalleryService: PostGalleryService,
    private profileService: ProfileService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.profileService.getUserSportizenId().subscribe((sportizenId: string) => {
      this.loading = true;
      this.userId = sportizenId;
      this.gallery = [];

      let postGallerySubscription: any;

      if (this.userId) {
        postGallerySubscription = this.postGalleryService.getUserPostGallery(this.userId);
      } else {
        postGallerySubscription = this.postGalleryService.getMyPostGallery();
      }

      postGallerySubscription.subscribe(
        (gallery: any[]) => {
          this.gallery = gallery;
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
        }
      );
    });
  }

  openImageModel(image: any) {
    const dialogRef = this.dialog.open(ImageModelComponent, {
      data: { image },
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  viewAlImages() {
    this.router.navigate(['./gallery'], { relativeTo: this.route });
  }
}
