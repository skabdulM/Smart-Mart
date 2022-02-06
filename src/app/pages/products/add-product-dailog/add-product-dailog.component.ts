import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { v4 as uuidv4 } from 'uuid';
class ImageSnippet {
  constructor(public src: string, public file: File) {

  }
}
@Component({
  selector: 'app-add-product-dailog',
  templateUrl: './add-product-dailog.component.html',
  styleUrls: ['./add-product-dailog.component.css'],
})
export class AddProductDailogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddProductDailogComponent>
  ) // private imageService: ImageService
  {
    // dialogRef.disableClose = true;
  }
  generateQr: string = '';

  ngOnInit() {
    this.generateQr = uuidv4();
    // console.log(this.generateQr);
  }

  Qrwithid() {
    this.generateQr = uuidv4();
    // console.log(this.generateQr);
  }

  selectedFile!: ImageSnippet;
  processFile(imageInput: any) {
    // debugger;
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      // debugger;
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });
    reader.readAsDataURL(file);
  }
}
