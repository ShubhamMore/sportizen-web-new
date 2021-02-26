import { _isNumberValue } from '@angular/cdk/coercion';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NumberService {
  constructor() {}

  convertToFixedDecimal(number: any): string {
    number = +number;
    return number.toFixed(2);
  }
}
