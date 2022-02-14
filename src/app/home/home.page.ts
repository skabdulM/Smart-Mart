import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AddtoCartdailogComponent } from './addto-cartdailog/addto-cartdailog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css'],
})
export class HomePage implements OnInit {
  constructor(public dialog: MatDialog) {}
  addtoCart: FormGroup = new FormGroup({
    productId: new FormControl('', [Validators.required]),
  });

  qrData: any;
  product: any = {};
  qrResultString: string = '';
  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();

  ngOnInit() {}
  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
  }

  getProduct() {
    const id = this.addtoCart.controls['productId'].value;
    const docRef = doc(this.db, 'products', id);
    onSnapshot(docRef, (doc) => {
      this.product = {};
      this.product = doc.data();
      console.log(this.product);
      this.addtoCart.controls['productId'].setValue('');
    });
  }

  addToCart() {
    const dialogRef = this.dialog.open(AddtoCartdailogComponent, {
      width: '650px',
      // data: product,
    });
  }

  productIdinput() {
    this.qrData = this.product.id;
  }
}
