import { CrudAPI, ICrud, CrudOptions } from '../crud';
import { ApiService } from '../api.service';
import * as _ from 'lodash';
export interface ICountry extends ICrud {
  name?: string,
}

export class Country<T> extends CrudAPI<ICountry> {
  constructor(
    public api: ApiService
  ) {
    super(api, 'country');
  }
  async search(data: any, options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'POST',
      uri: this.apiUrl('search?limit=50'),
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