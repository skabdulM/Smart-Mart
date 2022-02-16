import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderFormPage } from './order-form.page';

const routes: Routes = [
  {
    path: '',
    component: OrderFormPage,
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('../../orders/orders.module').then((m) => m.OrdersPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderFormPageRoutingModule {}
