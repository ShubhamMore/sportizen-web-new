import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DashboardModule } from './dashboard/dashboard.module';

import { SharedModule } from './@shared/shared.module';
import { CoreModule } from './@core/core.module';
import { AuthenticationModule } from './authentication/authentication.module';

import { Validator } from './@shared/validators';

import { LoginAuthGuard } from './authentication/auth/guards/login.auth.guard';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogDetailsComponent } from './blogs/blog-details/blog-details.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SaveBlogComponent } from './blogs/save-blog/save-blog.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MyBlogsComponent } from './blogs/my-blogs/my-blogs.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../assets/i18n/locale_', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    BlogsComponent,
    BlogDetailsComponent,
    SaveBlogComponent,
    MyBlogsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
    AuthenticationModule,
    DashboardModule,
    AppRoutingModule,
    CKEditorModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [LoginAuthGuard, Validator],
  bootstrap: [AppComponent],
})
export class AppModule {}
