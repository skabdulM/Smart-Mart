import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderFormPage } from './order-form.page';

const routes: Routes = [
  {
    path: '',
    component: OrderFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderFormPageRoutingModule {}
