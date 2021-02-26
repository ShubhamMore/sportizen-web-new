import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({ providedIn: 'root' })
export class SideDrawerService {
  private drawer: MatDrawer;
  private _sideDrawerMode: string = 'side';

  public setSideNav(drawer: MatDrawer) {
    this.drawer = drawer;
  }

  public openDrawer(): any {
    if (this.drawer) {
      return this.drawer.open();
    }
  }

  get sideDrawerMode() {
    if (this._sideDrawerMode) {
      return this._sideDrawerMode;
    }
    return 'side';
  }

  set sideDrawerMode(mode: string) {
    this._sideDrawerMode = mode;
  }
  public close() {
    return this.drawer.close();
  }

  public toggle(): void {
    this.drawer.toggle();
  }

  public isDrawerOpened() {
    if (!this.drawer) {
      return false;
    }
    return this.drawer.opened;
  }
}
