import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-product-dailog',
  templateUrl: './add-product-dailog.component.html',
  styleUrls: ['./add-product-dailog.component.css'],
})
export class AddProductDailogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AddProductDailogComponent>) {
    // dialogRef.disableClose = true;
  }
  generateQr: string = '';

  ngOnInit() {
    this.generateQr = uuidv4();
    console.log(this.generateQr);
  }

  Qrwithid() {
    this.generateQr = uuidv4();
    
    console.log(this.generateQr);
  }
}
