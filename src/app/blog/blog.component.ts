import { HomeService } from './../services/home.service';
import { Component, OnInit } from '@angular/core';
import { UserProfileService } from './../services/user-profile.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  isSportizenId: boolean;

  constructor(
    private homeService: HomeService,
    private titleService: Title,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.isSportizenId = true;

    this.titleService.setTitle('SPORTIZEN | Blog');

    this.userProfileService.getUserSportizenId().subscribe((sportizenId: string) => {
      this.isSportizenId = !!sportizenId;
      if (sportizenId) {
        this.homeService.setRoute('Blogs');
      }
    });
  }
}