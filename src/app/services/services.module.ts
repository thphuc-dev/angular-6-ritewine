import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from './config/config.service';
import { ApiService } from './api/api.service';
import { ShareDataService } from './share-data/share-data.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    ConfigService,
    ApiService,
    ShareDataService,
  ]
})
export class ServicesModule { }
