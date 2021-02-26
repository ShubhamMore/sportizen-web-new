import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from './shared-services/http.service';

@Injectable({ providedIn: 'root' })
export class ContactUsService {
  constructor(private httpService: HttpService) {}

  sendEnquiry(enquiry: { name: string; email: string; message: string }) {
    const data = { api: 'sendEnquiry', data: enquiry };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }
}
