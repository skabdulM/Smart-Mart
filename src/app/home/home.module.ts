import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { MatDialogModule } from '@angular/material/dialog';
import { IonicModule } from '@ionic/angular';
import { ZXingScannerModule } from 'angular-weblineindia-qrcode-scanner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { HomePageRoutingModule } from './home-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { HomePage } from './home.page';
import { AddtoCartdailogComponent } from './addto-cartdailog/addto-cartdailog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    HomePageRoutingModule,
    ZXingScannerModule,
    QRCodeModule,
    MatDialogModule,
    MatSelectModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  declarations: [HomePage, AddtoCartdailogComponent],
})
export class HomePageModule {}
