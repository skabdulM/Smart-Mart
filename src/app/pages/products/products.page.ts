import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { initializeApp } from 'firebase/app';
import {
  collection,
  getFirestore,
  addDoc,
  onSnapshot,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { AddProductDailogComponent } from './add-product-dailog/add-product-dailog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Products } from 'src/app/products';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.css'],
})
export class ProductsPage implements OnInit {
  constructor(public dialog: MatDialog, private snackBar: MatSnackBar) {}
  products: Products[] = [];
  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();
  userInfo: any = {};
  userId: string = '';

  ngOnInit() {
    this.retriveUser();
  }
  
  retriveUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user !== null) {
        this.userId = user.uid;
        this.getUserValues();
      } else {
        console.log('okkk');
      }
    });
  }

  getUserValues() {
    const docRef = collection(this.db, 'users', this.userId, 'User');
    onSnapshot(docRef, (snapshot) => {
      this.userInfo = {};
      snapshot.docs.forEach((doc) => {
        this.userInfo = { ...doc.data() };
      });
    });
  }

  // signout() {
  //   signOut(this.auth)
  //     .then(() => {
  //       console.log('logged out');
  //     })
  //     .catch((error) => {
  //       console.log('error');
  //     });
  // }

  openDialog() {
    const dialogRef = this.dialog.open(AddProductDailogComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe((addProduct) => {
      if (addProduct.redirect === 'save') {
        const db = getFirestore();
        const docRef = collection(db, 'products');
        addDoc(docRef, {
          productName: addProduct.productName,
          productDescription: addProduct.productDescription,
          productPrice: addProduct.productAmount,
          productImage: addProduct.productImage,
        }).then(() => {
          this.openSnackBar('Product Added!! 👏👏 ', 'Ok');
        });
      } else {
        this.openSnackBar('Product not added!!', 'Ok');
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 2500 });
  }
}
