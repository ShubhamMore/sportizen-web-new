import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clock12hr',
})
export class TimePipe implements PipeTransform {
  transform(time: string): string {
    if (!time) {
      return '--';
    }
    const timeArr: string[] = time.split(':');

    let hr = parseInt(timeArr[0]);
    const min = timeArr[1];

    if (hr > 12) {
      hr = hr % 12;
      return hr + ':' + min + 'PM';
    } else if (hr === 12) {
      return hr + ':' + min + 'PM';
    } else {
      return hr + ':' + min + 'AM';
    }
  }
}
