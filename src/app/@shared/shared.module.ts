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

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { CapitalizeEachWordPipe } from './pipe/capitalize-each-word.pipe';
import { TimePipe } from './pipe/time.pipe';
import { ConfirmComponent } from './confirm/confirm.component';
import { AmountPipe } from './pipe/amount.pipe';
import { MaterialElevationDirective } from '../directives/material-elevation.directive';

@NgModule({
  declarations: [
    LoadingContentComponent,
    CapitalizeEachWordPipe,
    TimePipe,
    AmountPipe,
    SafeHtmlPipe,
    ConfirmComponent,
    MaterialElevationDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    CKEditorModule,

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
    AmountPipe,

    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,

    CKEditorModule,

    MomentModule,
    InfiniteScrollModule,
    SharedRoutingModule,
  ],
})
export class SharedModule {}
