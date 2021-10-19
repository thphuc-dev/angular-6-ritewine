import { DefaultLayoutComponent } from './default-layout.component';
export const DefaultLayoutRouting = {
  path: '',
  component: DefaultLayoutComponent,
  children: [
    {
      path: '',
      loadChildren: '../../views/home/home.module#HomeModule'
    },
    {
      path: 'faqs',
      loadChildren: '../../views/faqs/faqs.module#FAQsModule'
    },
    {
      path: ':slug',
      loadChildren: '../../views/product/product.module#ProductModule'
    }
  ]
};
