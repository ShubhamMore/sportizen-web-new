import { SafeHtmlPipe } from './pipe/safe-html.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';

import { MomentModule } from 'ngx-moment';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { SharedRoutingModule } from './shared-routing.module';

import { TranslateModule } from '@ngx-translate/core';

import { LoadingContentComponent } from './loading-content/loading-content.component';

import { CapitalizeEachWordPipe } from './pipe/capitalize-each-word.pipe';
import { TimePipe } from './pipe/time.pipe';
import { ConfirmComponent } from './confirm/confirm.component';

@NgModule({
  declarations: [
    LoadingContentComponent,
    CapitalizeEachWordPipe,
    TimePipe,
    SafeHtmlPipe,
    ConfirmComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    MomentModule,
    InfiniteScrollModule,
    SharedRoutingModule,
  ],
  entryComponents: [ConfirmComponent],
  exports: [
    CommonModule,
    LoadingContentComponent,
    ConfirmComponent,

    CapitalizeEachWordPipe,
    SafeHtmlPipe,
    TimePipe,

    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    MomentModule,
    InfiniteScrollModule,
    SharedRoutingModule,
  ],
})
export class SharedModule {}
