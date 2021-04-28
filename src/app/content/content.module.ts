import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule } from './../header/header.module';

import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';

@NgModule({
  declarations: [ContentComponent],
  imports: [CommonModule, HeaderModule, ContentRoutingModule],
})
export class ContentModule {}
