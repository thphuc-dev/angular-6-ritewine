import { CrudAPI, ICrud } from '../crud';
import { ApiService } from '../api.service';

export interface ITag extends ICrud {
  name?: string,
  name_vn?: string,
  type?: string,
  foods?: any,
}

export class Tag extends CrudAPI<ITag> {
  constructor(
    public api: ApiService
  ) {
    super(api, 'tag');
  }
}