import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';
import { Ng5SliderModule } from 'ng5-slider';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../shared';
import { RatingModule } from 'ngx-bootstrap/rating';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};
@NgModule({
  imports: [
    FormsModule,
    HomeRoutingModule,
    CommonModule,
    PaginationModule.forRoot(),
    LazyLoadImagesModule,
    Ng5SliderModule,
    PipesModule.forRoot(),
    SharedModule,
    RatingModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    SwiperModule,
    TooltipModule.forRoot(),
    AngularMultiSelectModule
  ],
  declarations: [ HomeComponent ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class HomeModule { }
