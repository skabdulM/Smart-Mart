import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
@Component({
  selector: 'app-add-product-dailog',
  templateUrl: './add-product-dailog.component.html',
  styleUrls: ['./add-product-dailog.component.css'],
})
export class AddProductDailogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddProductDailogComponent> // private imageService: ImageService
  ) {
    dialogRef.disableClose = true;
  }

  // generateId: string = '';
  selectedFile!: ImageSnippet;
  // hideRequired = 'true';
  // qrIMG: any = '';

  myForm: FormGroup = new FormGroup({
    productName: new FormControl('', [Validators.required]),
    productDescription: new FormControl('', [Validators.required]),
    productAmount: new FormControl('', [Validators.required]),
    productImage: new FormControl('', [Validators.required]),
  });

  ngOnInit() {}

  // qrId() {
  //   this.generateId = uuidv4();
  // }

  // qrImg() {
  //   const img = document.querySelector('img') as HTMLImageElement;
  //   this.qrIMG = img;
  //   console.log(this.qrIMG);
  // }

  addProduct() {
    if (this.myForm.valid) {
      let addProduct: any = {};
      addProduct.redirect = 'save';
      // addProduct.productId = this.generateId;
      addProduct.productName = this.myForm.controls['productName'].value;
      addProduct.productDescription =
        this.myForm.controls['productDescription'].value;
      addProduct.productImage = this.selectedFile.src;
      addProduct.productAmount = this.myForm.controls['productAmount'].value;
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
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });
    reader.readAsDataURL(file);
  }

  dailogClose() {
    let addProduct: any = {};
    addProduct.redirect = 'close';
    this.dialogRef.close(addProduct);
  }
}
