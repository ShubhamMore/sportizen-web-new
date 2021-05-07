import { Component, OnInit } from '@angular/core';
import { PostGalleryService } from '../../../../../../services/post-gallery.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ImageModelComponent } from 'src/app/image/image-model/image-model.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-dashboard-gallery',
  templateUrl: './profile-dashboard-gallery.component.html',
  styleUrls: ['./../@shared/profile.scss', './profile-dashboard-gallery.component.scss'],
})
export class ProfileDashboardGalleryComponent implements OnInit {
  userId: string;
  gallery: any[];

  constructor(
    private postGalleryService: PostGalleryService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((param: Params) => {
      this.userId = param.id;
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.gallery = [];

    let postGallerySubscription: any;

    if (this.userId) {
      postGallerySubscription = this.postGalleryService.getUserPostGallery(this.userId, 6);
    } else {
      postGallerySubscription = this.postGalleryService.getMyPostGallery(6);
    }

    postGallerySubscription.subscribe(
      (gallery: any[]) => {
        this.gallery = gallery;
      },
      (error: any) => {}
    );
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
