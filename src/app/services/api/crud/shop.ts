import { CrudAPI, ICrud } from '../crud';
import { ApiService } from '../api.service';

export interface IShop extends ICrud {
  name?: string;
  picture?: string;
  rating?: number;
  link?: string;
  price_everage?: number;
  crawled?: boolean;
  maybe_duplicate?: boolean;
  address?: string;
  not_in_use?: boolean;
  editable?: boolean
  displayed_name?: string;
  displayed_picture?: string;
  displayed_rating?: number;
  displayed_link?: string;
  displayed_price_everage?: number;
  displayed_address?: string;
}

export class Shop extends CrudAPI<IShop> {
  constructor(
    public api: ApiService
  ) {
    super(api, 'shop');
  }
}