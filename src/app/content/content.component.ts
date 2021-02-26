import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

// import './../../assets/vendor/js/script.js';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./common-content.scss', './content.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class ContentComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ids: string[] = ['contact', 'service', 'about', 'home'];

  ngOnInit(): void {
    this.route.params.subscribe((param: Params) => {
      const id = param.id;
      if (!id) {
        this.scroll('home');
      } else if (this.ids.includes(id)) {
        this.scroll(id);
      } else {
        this.router.navigate(['/page-not-found'], { relativeTo: this.route });
      }
    });
  }

  scroll(id: string) {
    const el = document.getElementById(id);
    el.scrollIntoView();
  }
}
