import { SharedModule } from './../@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';

import { ServiceComponent } from './service/service.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    ContentComponent,
    AboutComponent,
    ContactComponent,
    FooterComponent,
    ServiceComponent,
  ],
  imports: [SharedModule, ContentRoutingModule],
  bootstrap: [ContentComponent],
})
export class ContentModule {}
