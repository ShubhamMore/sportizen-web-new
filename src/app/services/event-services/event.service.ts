import { Injectable } from '@angular/core';
import { HttpService } from './../shared-services/http.service';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { EventModel } from './../../models/event-models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  // private event = new BehaviorSubject<EventModel>(null);

  // setLocalEvent(event: EventModel) {
  //   this.event.next(event);
  // }

  // getLocalEvent() {
  //   return this.event;
  // }

  constructor(private httpService: HttpService) {}

  getAllEvents(limit: number, skip: number, longitude: number, latitude: number) {
    const data = {
      api: `getAllEvents/${limit}/${skip}/${longitude}/${latitude}`,
      data: { limit, skip, longitude, latitude },
    };
    return this.httpService.httpGet(data).pipe(
      map((events: EventModel[]) => {
        return events;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getJoinedEvents(limit: number, skip: number) {
    const data = { api: 'getJoinedEvents', data: { limit, skip } };
    return this.httpService.httpPost(data).pipe(
      map((events: EventModel[]) => {
        return events;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getMyEvents(limit: number, skip: number) {
    const data = { api: 'getMyEvents', data: { limit, skip } };
    return this.httpService.httpPost(data).pipe(
      map((events: EventModel[]) => {
        return events;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getEvent(id: string) {
    const data = { api: `getEvent/${id}`, data: { id } };
    return this.httpService.httpGet(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  saveEvent(event: FormData) {
    const data = { api: 'newEvent', data: event };

    return this.httpService.httpPost(data).pipe(
      map((resEvent: EventModel) => {
        return resEvent;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  editEvent(event: FormData) {
    const data = { api: 'editEvent', data: event };

    return this.httpService.httpPost(data).pipe(
      map((resEvent: EventModel) => {
        return resEvent;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  deleteEvent(id: string) {
    const data = { api: `deleteEvent`, data: { id } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        // const i = this.events.findIndex((event) => event._id === id);
        // this.events.splice(i, 1);
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  deleteEventImage(id: string, imageId: string, index: number) {
    const data = {
      api: 'deleteEventImage',
      data: { id, imageId, index },
    };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        // const eventIndex = this.events.findIndex((event) => event._id === id);
        // this.events[eventIndex].images.splice(index, 1);
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }
}
