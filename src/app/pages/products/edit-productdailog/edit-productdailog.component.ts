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
    // dialogRef.disableClose = true;
  }
  selectedFile: any;
  updatedImage!: ImageSnippet;
  product: any;
  editProduct: FormGroup = new FormGroup({
    productName: new FormControl('', [Validators.required]),
    productDescription: new FormControl('', [Validators.required]),
    productAmount: new FormControl('', [Validators.required]),
    productImage: new FormControl('', [Validators.required]),
  });
  ngOnInit() {
    this.product = this.productInfo;
    console.log(this.product);

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
    // this.selectedFile.setValue(this.product.productImage)
    // this.editProduct.controls['productId'].setValue(this.product.productId);
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = null;
      this.updatedImage = new ImageSnippet(event.target.result, file);
    });
    reader.readAsDataURL(file);
  }

  updateNote() {}
}
