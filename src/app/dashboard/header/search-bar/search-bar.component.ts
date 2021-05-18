import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, finalize, switchMap, tap, first } from 'rxjs/operators';
import { ConnectionService } from '../../../services/user-services/connection.service';
import { UserProfileService } from './../../../services/user-services/user-profile.service';
import * as $ from 'jquery';
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

  filteredOptions: any[];

  myControl = new FormControl();
  options: any[];
  isLoading: boolean;
  searchKeyWord: string;
  isSearchBarOpen: boolean;
  sportizenId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private connectionService: ConnectionService,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.isLoading = false;
    this.isSearchBarOpen = false;
    this.searchKeyWord = '';
    this.filteredOptions = [];
    this.options = [];

    $(window).on('resize', () => {
      if (window.innerWidth > 833 && this.isSearchBarOpen) {
        this.toggleSearchBar();
      }
    });

    this.userProfileService
      .getUserSportizenId()
      .pipe(first())
      .subscribe((sortizenId: string) => {
        this.sportizenId = this.sportizenId;
      });

    this.myControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap((key: string) => {
          this.searchKeyWord = key;
          return this.connectionService
            .getSearchResults(key, 6)
            .pipe(finalize(() => (this.isLoading = false)));
        })
      )
      .subscribe((users: any[]) => (this.filteredOptions = users));

    this.emitSearchBarToggle.emit(true);
  }

  allFriends() {
    this.router.navigate(['/dashboard', 'search', this.searchKeyWord], {
      relativeTo: this.route,
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

  toggleSearchBar() {
    this.emitSearchBarToggle.emit(this.isSearchBarOpen);
    this.isSearchBarOpen = !this.isSearchBarOpen;
  }
}
