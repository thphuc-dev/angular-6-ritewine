import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Employee } from './crud/employee';
import { Shop } from './crud/shop';
import { Product } from './crud/product';
import { ProductShop } from './crud/product_shop';
import { Country } from './crud/country';
import { Food } from './crud/food';
import { Translate } from './crud/translate';
import { Tag } from './crud/tag';
@Injectable()
export class ApiService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {

  }

  employee = new Employee(this);
  shop = new Shop(this);
  product = new Product(this);
  productShop = new ProductShop(this);
  country = new Country(this);
  food = new Food(this);
  translate = new Translate(this);
  tag = new Tag(this);
}
