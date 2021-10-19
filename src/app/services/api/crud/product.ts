import { CrudAPI, ICrud, CrudOptions } from '../crud';
import { ApiService } from '../api.service';
import * as _ from 'lodash';

export interface IProduct extends ICrud {
  name?: string;
  picture?: string;
  rating?: number;
  link?: string;
  price?: number;
  crawl_from?: string;
  maybe_duplicate?: boolean;
  editable?: boolean;
  not_in_use?: boolean;
  reviews?: number;
  unit_price?: string;
  country?: string;
  displayed_name?: string;
  displayed_picture?: string;
  displayed_rating?: number;
  displayed_price?: number;
  displayed_address?: string;
  displayed_unit_price?: string;
  displayed_country?: string;
  displayed_reviews?: number;
  type?: string;
  vivino_winery?: any;
  vivino_region?: any;
  vivino_wine_type?: any;
  vivino_style?: any;
  displayed_vivino_wine_type?: string;
  displayed_vivino_winery?: string;
  displayed_vivino_style?: string;
  displayed_vivino_region?: string;
  displayed_vivino_food?: string;
  displayed_vivino_grape?: string;
  vivino_reviews?: any;
  vivino_foods?: any;
  vivino_grapes?: any;
  vivino_image?: any;
  vivino_wine_id?: any;
  vivino_id?: any;
  vivino_year?: any;
  foods_of_product?: any;
  shops_of_product?: any;
  comments?: any;
  alcohol?: number;
  vivino_url?: string;
}
export class Product<T> extends CrudAPI<IProduct> {
  constructor(
    public api: ApiService
  ) {
    super(api, 'product');
  }

  async getStatistic(options?: CrudOptions): Promise<T> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.apiUrl('statistic'),
      params: options.query,
      headers: _.merge({}, {
        'content-type': 'application/json',
      }, options.headers),
      body: null,
      responseType: 'json'
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const row = res.body.results.object as T;
    return row;
  }

  async getItemWithSlug(slug: string, options?: CrudOptions): Promise<T> {
    if (!slug) {throw new Error('slug undefined in getItem'); }
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.apiUrl('get_item_with_slug/' + slug),
      params: options.query,
      headers: _.merge({}, {
      }, options.headers),
      responseType: 'json'
    };
    const resp = await this.exec(setting);
    const res: any = resp;
    const row = res.body.results.object as T;
    return row;
  }

  async search(limit: number, page: number,data: any, options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.apiUrl('search?limit=' + limit + '&page=' + page),
      params: options.query,
      headers: _.merge({}, {
      }, options.headers),
      responseType: 'json',
      decode: true,
      body: data
    };
    const hashedQuery: any = options.query;
    this.activeHashQuery = hashedQuery;
    this.activeQuery = options.query;
    const res = await this.exec(setting);
    const results: any = res;
    const pagination: any = res;
    const rows = results.body.results.objects.rows as T[];
    if (options.reload) {
      this.pagination = pagination.body.pagination;
      this.pagination.totalItems = results.body.results.objects.count || 0;
      this.hashCache[hashedQuery] = {
        pagination: this.pagination,
        items: rows
      };
      this.items.next(rows);
    }
    return rows;
  }
}