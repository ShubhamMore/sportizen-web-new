import { SocketioService } from './services/socket.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, UserData } from './authentication/auth/auth-service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'SPORTIZEN';

  constructor(
    private authService: AuthService,
    public translate: TranslateService,
    private socketioService: SocketioService
  ) {
    translate.setDefaultLang('en');
    // this.translate.use(language);
  }

  ngOnInit() {
    const userData: UserData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    this.authService.autoLogin(userData);
    this.socketioService.setupSocketConnection();
  }
}
