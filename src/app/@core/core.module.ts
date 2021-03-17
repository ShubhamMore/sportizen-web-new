import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './../authentication/auth/auth-interpreter/auth-interceptor.service';

import { SocialLoginModule } from 'angularx-social-login';
import { SocialAuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';
import { environment } from './../../environments/environment';

const config = {
  providers: [
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(environment.oauthClientID),
    },
  ],
} as SocialAuthServiceConfig;

export function provideConfig() {
  return config;
}

@NgModule({
  imports: [SocialLoginModule],
  exports: [SocialLoginModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useFactory: provideConfig,
    },
  ],
})
export class CoreModule {}
