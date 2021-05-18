import { HttpService } from '../shared-services/http.service';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private httpService: HttpService) {}

  verifyPayment(payment: any, placedOrder: any) {
    const data = {
      api: 'verifyPayment',
      data: {
        payment,
        receipt: placedOrder,
      },
    };
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
