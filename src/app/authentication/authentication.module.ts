import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { HeaderComponent } from './header/header.component';
import { AuthenticationComponent } from './authentication.component';

@NgModule({
  declarations: [HeaderComponent, AuthenticationComponent],
  imports: [CommonModule, AuthenticationRoutingModule],
})
export class AuthenticationModule {}
