import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { ConnectionService } from './../../../services/connection.service';
import { UserProfileService } from './../../../services/user-profile.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  animations: [
    trigger('searchBar', [
      state(
        'in',
        style({
          opacity: 1,
          width: 100,
        })
      ),

      transition('void => *', [
        style({
          opacity: 0,
          width: 0,
        }),
        animate(300),
      ]),

      transition('* => void', [
        animate(
          300,
          style({
            width: 0,
            opacity: 0,
          })
        ),
      ]),
    ]),

    trigger('searchBarIcon', [
      state(
        'in',
        style({
          opacity: 1,
          width: 100,
          height: 100,
        })
      ),

      transition('void => *', [
        style({
          opacity: 0,
          width: 0,
          height: 0,
        }),
        animate(300),
      ]),

      transition('* => void', [
        animate(
          300,
          style({
            opacity: 0,
            width: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class SearchBarComponent implements OnInit {
  @Output() emitSearchBarToggle = new EventEmitter<boolean>();

  @Input() minified: boolean;

  filteredOptions: any;

  myControl = new FormControl();
  options: any[];
  isLoading: boolean;
  searchKeyWord: string;
  isSearchBarOpen: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private connectionService: ConnectionService,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.isLoading = false;
    this.isSearchBarOpen = false;
    this.options = [];
    this.myControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap((value: string) => {
          this.searchKeyWord = value;
          return this.connectionService
            .getSearchResults(value)
            .pipe(finalize(() => (this.isLoading = false)));
        })
      )
      .subscribe((users: any) => (this.filteredOptions = users));

    this.emitSearchBarToggle.emit(true);
  }

  allFriends() {
    this.router.navigate(['/dashboard', 'search', this.searchKeyWord], {
      relativeTo: this.route,
    });
  }

  viewProfile(id: string) {
    if (id === this.userProfileService.getProfile().sportizenId) {
      this.router.navigate(['../../', 'profile'], { relativeTo: this.route });
    } else {
      this.connectionService.searchedSportizenId = id;
      this.router.navigate(['../../', 'profile', id], { relativeTo: this.route });
    }
  }

  toggleSearchBar() {
    this.emitSearchBarToggle.emit(this.isSearchBarOpen);
    this.isSearchBarOpen = !this.isSearchBarOpen;
  }
}
