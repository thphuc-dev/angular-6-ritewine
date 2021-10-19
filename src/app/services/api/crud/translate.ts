import { CrudAPI, ICrud, CrudOptions } from '../crud';
import { ApiService } from '../api.service';
import * as _ from 'lodash';

export interface ITranslate extends ICrud {
  key?: string,
  value?: string,
  value_vn?: string
}

export class Translate<T> extends CrudAPI<ITranslate> {
  constructor(
    public api: ApiService
  ) {
    super(api, 'translate');
  }

  async getListObject(options?: CrudOptions): Promise<T[]> {
    options = _.merge({}, this.options, options);
    const setting = {
      method: 'GET',
      uri: this.apiUrl('get_list_object'),
      params: options.query,
      headers: _.merge({}, {
      }, options.headers),
      responseType: 'json',
      decode: true
    };
    const hashedQuery: any = options.query;
    this.activeHashQuery = hashedQuery;
    this.activeQuery = options.query;
    const res = await this.exec(setting);
    const results: any = res;
    const rows = results.body.results.objects as T[];
    return rows;
  }
}