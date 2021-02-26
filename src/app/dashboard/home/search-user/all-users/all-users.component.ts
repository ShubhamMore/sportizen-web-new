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

  constructor(private route: ActivatedRoute, private connectionService: ConnectionService) {}

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
}
