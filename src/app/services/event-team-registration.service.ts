import { Injectable } from '@angular/core';
import { HttpService } from './shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EventTeamModel } from '../models/event-team.model';

@Injectable({ providedIn: 'root' })
export class EventTeamRegistrationService {
  constructor(private httpService: HttpService) {}

  registerTeam(team: any) {
    const data = { api: 'registerTeam', data: team };
    return this.httpService.httpPost(data).pipe(
      map((eventTeam: EventTeamModel) => {
        return eventTeam;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  updateTeamRegistration(team: EventTeamModel) {
    const data = { api: 'updateTeamRegistration', data: team };
    return this.httpService.httpPost(data).pipe(
      map((eventTeam: EventTeamModel) => {
        return eventTeam;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getEventTeams(event: string) {
    const data = { api: `getEventTeams/${event}`, data: { event } };
    return this.httpService.httpGet(data).pipe(
      map((eventTeams: EventTeamModel[]) => {
        return eventTeams;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getEventTeam(id: string) {
    const data = { api: 'getEventTeam', data: { id } };
    return this.httpService.httpPost(data).pipe(
      map((eventTeam: EventTeamModel) => {
        return eventTeam;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  deleteTeamRegistration(id: string) {
    const data = { api: 'deleteTeamRegistration', data: { id } };
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
