import { HttpService } from './../shared-services/http.service';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orderDetails: any;

  getOrderDetails() {
    return this.orderDetails;
  }

  setOrderDetails(order: any) {
    this.orderDetails = order;
  }

  deleteOrderDetails() {
    this.orderDetails = null;
  }

  constructor(private httpService: HttpService) {}

  deleteOrder(id: string) {
    const data = { api: 'deleteOrder', data: { id } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  generateOrder(order: any) {
    const data = { api: 'generateOrder', data: order };
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
