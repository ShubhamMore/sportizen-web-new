import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from './shared-services/http.service';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  constructor(private httpService: HttpService) {}
  private _searchedSportizenId: string = null;

  get searchedSportizenId(): string {
    return this._searchedSportizenId;
  }
  set searchedSportizenId(sportizenId: string) {
    this._searchedSportizenId = sportizenId;
  }

  getSearchResults(searchKey: string) {
    const data = { api: 'searchNewConnections', data: { searchName: searchKey } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  sendConnectionRequest(followedUserId: string) {
    const data = { api: 'sendConnectionRequest', data: { followedUser: followedUserId } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  unfollowConnection(followedUserId: string) {
    const data = { api: 'unfollowConnection', data: { followedUser: followedUserId } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }
}
