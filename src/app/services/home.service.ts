import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private activeRoute = new BehaviorSubject<string>(null);

  constructor() {}

  setRoute(route: string) {
    this.activeRoute.next(route);
  }

  getRoute() {
    return this.activeRoute;
  }
}
