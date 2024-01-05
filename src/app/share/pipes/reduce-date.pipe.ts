import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reduceDate'
})
export class ReduceDatePipe implements PipeTransform {

  transform(value: string): string {
    let date = new Date(value);
    let dateOf = date.toLocaleDateString();
    let timeOf = date.getHours() + ':' + date.getMinutes();

    let newDate = dateOf + ' ' + timeOf;
    return newDate;
  }

}
