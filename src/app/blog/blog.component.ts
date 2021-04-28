import { HomeService } from '../services/home.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  constructor(private homeService: HomeService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('SPORTIZEN | Blog');
    this.homeService.setRoute('Blogs');
  }
}
