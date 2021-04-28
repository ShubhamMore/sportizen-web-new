import { SharedModule } from '../@shared/shared.module';
import { NgModule } from '@angular/core';

import { ContentRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { ServiceComponent } from './service/service.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    ContactComponent,
    FooterComponent,
    ServiceComponent,
  ],
  imports: [SharedModule, ContentRoutingModule],
  bootstrap: [HomeComponent],
})
export class HomeModule {}
