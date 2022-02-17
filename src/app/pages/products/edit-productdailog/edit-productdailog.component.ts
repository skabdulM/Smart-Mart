import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Products } from 'src/app/products';
class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
@Component({
  selector: 'app-edit-productdailog',
  templateUrl: './edit-productdailog.component.html',
  styleUrls: ['./edit-productdailog.component.css'],
})
export class EditProductdailogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public productInfo: Products,
    public dialogRef: MatDialogRef<EditProductdailogComponent>
  ) {
    dialogRef.disableClose = true;
  }
  selectedFile: any;
  updatedImage!: ImageSnippet;
  product: any;
  editProduct: FormGroup = new FormGroup({
    productName: new FormControl('', [Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
    productDescription: new FormControl('', [Validators.required]),
    productAmount: new FormControl('', [Validators.pattern('[0-9]{2,4}')]),
    productImage:new FormControl('')
  });
  ngOnInit() {
    this.product = this.productInfo;
    this.setValues();
  }

  setValues() {
    this.editProduct.controls['productName'].setValue(this.product.productName);
    this.editProduct.controls['productDescription'].setValue(
      this.product.productDescription
    );
    this.editProduct.controls['productAmount'].setValue(
      this.product.productPrice
    );
    this.selectedFile = this.product.productImage;
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

  updateProduct() {
    if (this.editProduct.valid) {
      let addProduct: any = {};
      addProduct.redirect = 'update';
      addProduct.productId = this.productInfo.id;
      addProduct.productName = this.editProduct.controls['productName'].value;
      addProduct.productDescription =
        this.editProduct.controls['productDescription'].value;
      addProduct.productImage = this.selectedFile;
      addProduct.productAmount =
        this.editProduct.controls['productAmount'].value;
      this.dialogRef.close(addProduct);
    } else {
      this.dailogClose();
    }
  }

  dailogClose() {
    let addProduct: any = {};
    addProduct.redirect = 'close';
    this.dialogRef.close(addProduct);
  }
}
