import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../shared';
import { DetailProductComponent } from './detail/detail.component';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ProductComponent } from './product.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  imports: [
    FormsModule,
    ProductRoutingModule,
    CommonModule,
    SharedModule,
    PipesModule.forRoot(),
    RatingModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [ DetailProductComponent, ProductComponent ]
})
export class ProductModule { }
