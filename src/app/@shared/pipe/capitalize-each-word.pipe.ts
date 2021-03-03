import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeEachWord',
})
export class CapitalizeEachWordPipe implements PipeTransform {
  transform(name: string): string {
    const nameArr: String[] = name.split(' ');
    const newNameArr: String[] = [];
    for (let n of nameArr) {
      const newName: string = n.charAt(0).toUpperCase() + n.slice(1);
      newNameArr.push(newName);
    }
    return newNameArr.join(' ');
  }
}
