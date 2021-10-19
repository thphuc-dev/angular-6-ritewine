import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FAQsComponent } from './faqs.component';
import { FAQsRoutingModule } from './faqs-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    FormsModule,
    FAQsRoutingModule,
    CommonModule
  ],
  declarations: [ FAQsComponent ]
})
export class FAQsModule { }
