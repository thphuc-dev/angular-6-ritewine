import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './default-layout.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DefaultLayoutRouting } from './default-layout-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SharedModule } from '../../shared';
export const routes: Routes = [
    DefaultLayoutRouting
];

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule,
    RouterModule.forChild(routes),
    FormsModule,
    BsDropdownModule.forRoot(),
    SharedModule
  ],
  declarations: [DefaultLayoutComponent],
  exports: [RouterModule],
  providers: [
  ]
})
export class DefaultLayoutModule { }
