import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ShareDataService {

  listFoodsDropdown = new BehaviorSubject<any>(undefined);
  castListFoodsDropdown = this.listFoodsDropdown.asObservable();

  listFoodsMultipleSelect = new BehaviorSubject<any>(undefined);
  castListFoodsMultipleSelect = this.listFoodsMultipleSelect.asObservable();

  listFoods = new BehaviorSubject<any>([]);
  castListFoods = this.listFoods.asObservable();

  displayed_name = new BehaviorSubject<any>(undefined);
  castDisplayedName = this.displayed_name.asObservable();

  translate_object = new BehaviorSubject<any>({});
  castTranslateObject = this.translate_object.asObservable();

  amout_product = new BehaviorSubject<number>(0);
  castAmoutProduct = this.amout_product.asObservable();
  
  reset_displayed_name_in_header = new BehaviorSubject<string>(null);
  castResetDisplayedNameInHeader = this.reset_displayed_name_in_header.asObservable();

  detect_device = new BehaviorSubject<any>(undefined);
  castDetectDevice = this.detect_device.asObservable();
  constructor() { }

  setListFoodsChoosenFromHeader(list_foods: any) {
    this.listFoodsDropdown.next(list_foods);
  }

  setListFoodsMultipleSelect(list_foods: any) {
    this.listFoodsMultipleSelect.next(list_foods);
  }

  setListFoodsFromHeader(listFoods: any){
    this.listFoods.next(listFoods);
  }

  setDisplayedNameFromHeader(displayed_name: string){
    this.displayed_name.next(displayed_name);
  }

  setTranslateObject(translate_object: any){
    this.translate_object.next(translate_object);
  }

  setAmoutProduct(amout: number){
    this.amout_product.next(amout);
  }

  resetDisplayedNameInHeader(displayed_name: string){
    this.reset_displayed_name_in_header.next(displayed_name);
  }

  setDetectDevice(device: any){
    this.detect_device.next(device);
  }
}