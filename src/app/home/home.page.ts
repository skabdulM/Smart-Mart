import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
} from 'firebase/auth';
import { doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AddtoCartdailogComponent } from './addto-cartdailog/addto-cartdailog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css'],
})
export class HomePage implements OnInit {
  constructor(public dialog: MatDialog, private snackBar: MatSnackBar) {}

  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();
  provider = new GoogleAuthProvider();
  product: any = {};
  userId: string = '';
  qrResultString: string = '';

  ngOnInit() {
    this.retriveUser();
  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    this.getProduct();
  }
 
  retriveUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user !== null) {
        this.userId = user.uid;
      } else {
        this.loginGmail();
      }
    });
  }

  loginGmail() {
    signInWithRedirect(this.auth, this.provider);
  }

  getProduct() {
    const docRef = doc(this.db, 'products', this.qrResultString);
    onSnapshot(docRef, (doc) => {
      this.product = {};
      (this.product = doc.data()), doc.id;
      this.addToCart();
    });
  }

  addToCart() {
    const dialogRef = this.dialog.open(AddtoCartdailogComponent, {
      width: '650px',
      data: this.product,
    });
    dialogRef.afterClosed().subscribe((addProduct) => {
      if (addProduct.redirect === 'addtocart') {
        const db = getFirestore();
        const docRef = doc(
          db,
          'users',
          this.userId,
          'cartItems',
          this.qrResultString
        );
        setDoc(docRef, {
          productName: addProduct.productName,
          productDescription: addProduct.productDescription,
          productPrice: addProduct.productAmount,
          productImage: addProduct.productImage,
          productQuantity: addProduct.productQuantity,
        }).then(() => {
          this.openSnackBar('Added to Cart', '🛒');
          this.qrResultString = '';
        });
      } else {
        this.qrResultString = '';
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 2500 });
  }
}
