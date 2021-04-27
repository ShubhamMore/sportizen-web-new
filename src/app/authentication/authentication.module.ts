import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import { HeaderModule } from '../header/header.module';

@NgModule({
  declarations: [AuthenticationComponent],
  imports: [CommonModule, HeaderModule, AuthenticationRoutingModule],
})
export class AuthenticationModule {}
