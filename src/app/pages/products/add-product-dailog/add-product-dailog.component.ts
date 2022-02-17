import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-product-dailog',
  templateUrl: './add-product-dailog.component.html',
  styleUrls: ['./add-product-dailog.component.css'],
})
export class AddProductDailogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AddProductDailogComponent>) {
    dialogRef.disableClose = true;
  }
  selectedFile: any;
  addProductForm: FormGroup = new FormGroup({
    productName: new FormControl('', [Validators.required]),
    productDescription: new FormControl('', [Validators.required]),
    productAmount: new FormControl('', [Validators.required]),
    productImage: new FormControl(''),
  });

  ngOnInit() {}

  addProduct() {
    if (this.addProductForm.valid) {
      let addProduct: any = {};
      addProduct.redirect = 'save';
      addProduct.productName =
        this.addProductForm.controls['productName'].value;
      addProduct.productDescription =
        this.addProductForm.controls['productDescription'].value;
      addProduct.productImage = this.selectedFile;
      addProduct.productAmount =
        this.addProductForm.controls['productAmount'].value;
      this.dialogRef.close(addProduct);
    } else {
      let addProduct: any = {};
      addProduct.redirect = 'close';
      this.dialogRef.close(addProduct);
    }
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = null;
      this.selectedFile = event.target.result;
    });
    reader.readAsDataURL(file);
  }

  dailogClose() {
    let addProduct: any = {};
    addProduct.redirect = 'close';
    this.dialogRef.close(addProduct);
  }
}
