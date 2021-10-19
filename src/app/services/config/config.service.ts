import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable()
export class ConfigService {

  constructor() {
    this.config = {
      host: environment.host,
      version: environment.version,
      lang: 'en',
    };
  }

  config: {
    host: string
    version: string,
    lang: string
  };

  apiUrl(path: string = '') {
    return `${this.config.host}/api/${this.config.version}/${path}`;
  }

  get lang() {
    return localStorage.getItem('lang');
  }

  set lang(value: string) {
    localStorage.setItem('lang', value);
  }
}
