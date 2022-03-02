import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrderFormPageRoutingModule } from './order-form-routing.module';
import { OrderFormPage } from './order-form.page';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ThankingPageComponent } from './thanking-page/thanking-page.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderFormPageRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatStepperModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatSelectModule,
  ],
  declarations: [OrderFormPage, ThankingPageComponent],
})
export class OrderFormPageModule {}
