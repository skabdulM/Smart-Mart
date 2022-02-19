import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TotalOrdersPage } from './total-orders.page';

const routes: Routes = [
  {
    path: '',
    component: TotalOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TotalOrdersPageRoutingModule {}
