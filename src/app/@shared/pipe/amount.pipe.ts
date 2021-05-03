import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amount',
})
export class AmountPipe implements PipeTransform {
  transform(amount: any): string {
    if (!amount) {
      return '0.00/-';
    }

    amount = +amount;

    if (typeof amount === 'number') {
      return amount.toFixed(2) + '/-';
    }
    return '0.00/-';
  }
}
