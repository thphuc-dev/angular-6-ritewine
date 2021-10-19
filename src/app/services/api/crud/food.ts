import { CrudAPI, ICrud } from '../crud';
import { ApiService } from '../api.service';

export interface IFood extends ICrud {
  name?: string,
}

export class Food extends CrudAPI<IFood> {
  constructor(
    public api: ApiService
  ) {
    super(api, 'food');
  }
}