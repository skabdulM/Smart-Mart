import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Products } from 'src/app/products';

@Component({
  selector: 'app-addto-cartdailog',
  templateUrl: './addto-cartdailog.component.html',
  styleUrls: ['./addto-cartdailog.component.css'],
})
export class AddtoCartdailogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public productInfo: Products,
    public dialogRef: MatDialogRef<AddtoCartdailogComponent>
  ) {
    dialogRef.disableClose = true;
  }
  productPrice:any=this.productInfo.productPrice;
  productQuantity:number = 1;
  ngOnInit() {

  }

  addtocart() {
    let addProduct: any = {};
    addProduct.redirect = 'addtocart';
    addProduct.productName = this.productInfo.productName;
    addProduct.productDescription = this.productInfo.productDescription;
    addProduct.productImage = this.productInfo.productImage;
    addProduct.productAmount = this.productInfo.productPrice;
    addProduct.productQuantity = this.productQuantity;
    this.dialogRef.close(addProduct);
  }

  dailogClose() {
    let addProduct: any = {};
    addProduct.redirect = 'close';
    this.dialogRef.close(addProduct);
  }
}
