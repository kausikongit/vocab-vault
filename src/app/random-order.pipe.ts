import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from './common.service';

@Pipe({
  name: 'randomOrder'
})
export class RandomOrderPipe implements PipeTransform {

  constructor(private common: CommonService) { }

  transform(arr: Array<string>): Array<string> {
    return this.common.shuffle(arr || []);
  }
}
