import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';

import { MomentModule } from 'ngx-moment';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { SharedRoutingModule } from './shared-routing.module';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { HttpClient } from '@angular/common/http';
import { LoadingContentComponent } from './loading-content/loading-content.component';

import { CapitalizeEachWordPipe } from './pipe/capitalize-each-word.pipe';
import { ConfirmComponent } from './confirm/confirm.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/locale_', '.json');
}

@NgModule({
  declarations: [LoadingContentComponent, CapitalizeEachWordPipe, ConfirmComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    MomentModule,
    InfiniteScrollModule,
    SharedRoutingModule,
  ],
  entryComponents: [ConfirmComponent],
  exports: [
    LoadingContentComponent,
    ConfirmComponent,

    CapitalizeEachWordPipe,

    CommonModule,
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
