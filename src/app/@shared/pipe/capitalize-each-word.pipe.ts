import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeEachWord',
})
export class CapitalizeEachWordPipe implements PipeTransform {
  transform(name: string): string {
    if (!name) {
      return '';
    }
    const nameArr: string[] = name.split(' ');
    const newNameArr: string[] = [];
    for (let n of nameArr) {
      const newName: string = n.charAt(0).toUpperCase() + n.slice(1);
      newNameArr.push(newName);
    }
    return newNameArr.join(' ');
  }
}
