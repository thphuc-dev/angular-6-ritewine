import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FAQsComponent } from './faqs.component';

const routes: Routes = [
  {
    path: '',
    component: FAQsComponent,
    data: {
      title: 'FAQs'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FAQsRoutingModule {}
