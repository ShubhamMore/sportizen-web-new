import { Injectable } from '@angular/core';
import { HttpService } from './shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EventPlayerModel } from '../models/event-player.model';

@Injectable({ providedIn: 'root' })
export class EventPlayerRegistrationService {
  constructor(private httpService: HttpService) {}

  registerPlayer(team: any) {
    const data = { api: 'registerPlayer', data: team };
    return this.httpService.httpPost(data).pipe(
      map((eventPlayer: EventPlayerModel) => {
        return eventPlayer;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getEventPlayers(event: string) {
    const data = { api: 'getEventPlayers', data: { event } };
    return this.httpService.httpPost(data).pipe(
      map((eventPlayers: EventPlayerModel[]) => {
        return eventPlayers;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getEventPlayer(id: string) {
    const data = { api: 'getEventPlayer', data: { id } };
    return this.httpService.httpPost(data).pipe(
      map((eventPlayer: EventPlayerModel) => {
        return eventPlayer;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  updatePlayerRegistration(team: any) {
    const data = { api: 'updatePlayerRegistration', data: team };
    return this.httpService.httpPost(data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  deletePlayerRegistration(id: string) {
    const data = { api: 'deletePlayerRegistration', data: { id } };
    return this.httpService.httpPost(data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }
}
