import { CrudAPI, ICrud } from '../crud';
import { ApiService } from '../api.service';
import { IShop } from './shop';
import { IProduct } from './product';

export interface IProductShop extends ICrud {
  shop_id?: string,
  product_id?: string,
  product: IProduct,
  shop: IShop
}

export class ProductShop extends CrudAPI<IProductShop> {
  constructor(
    public api: ApiService
  ) {
    super(api, 'product_shop');
  }
}