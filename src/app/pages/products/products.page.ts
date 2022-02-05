import { Component, OnInit } from '@angular/core';

import { DailogBoxComponent } from 'src/app/dailog-box/dailog-box.component';
import { v4 as uuidv4 } from 'uuid';
// import { QRCodeElementType, QRCodeErrorCorrectionLevel } from 'angularx-qrcode';
DailogBoxComponent
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.css'],
})
export class ProductsPage implements OnInit {
  generateQr: string = '';

  constructor() {}
  ngOnInit() {}
  Qrwithid() {
    this.generateQr = uuidv4();
  }
//   openDialog(note: Notes): void {
//     const dialogRef = this.dialog.open(DailogBoxComponent, {
//       width: '650px',
//       data: note,
//     });
}
