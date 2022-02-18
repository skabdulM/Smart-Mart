import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.page.html',
  styleUrls: ['./order-form.page.css'],
})
export class OrderFormPage implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  constructor(
    breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }
  stepperOrientation: Observable<StepperOrientation>;
  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();
  products: any = [];
  userInfo: any = {};
  userId: string = '';
  userEmail: any = '';
  userDetails: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
    userPhoneNo: new FormControl('', [
      Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
    ]),
    userEmail: new FormControl(''),
    userAddress: new FormControl('', [Validators.required]),
  });
  paymentDetails: FormGroup = new FormGroup({});

  ngOnInit() {
    this.retriveUser();
  }

  retriveUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user !== null) {
        this.userId = user.uid;
        this.userEmail = user.email;
        this.getUserValues();
        this.fetchProducts();
      } else {
        console.log('something is fishy');
      }
    });
  }

  getUserValues() {
    const docRef = collection(this.db, 'users', this.userId, 'User');
    onSnapshot(docRef, (snapshot) => {
      this.userInfo = {};
      snapshot.docs.forEach((doc) => {
        this.userInfo = { ...doc.data() };
        this.userDetails.reset();
        this.setValues();
      });
    });
  }

  setValues() {
    this.userDetails.controls['userName'].setValue(this.userInfo.name);
    this.userDetails.controls['userPhoneNo'].setValue(this.userInfo.phoneNo);
    this.userDetails.controls['userEmail'].setValue(this.userEmail);
    this.userDetails.controls['userAddress'].setValue(this.userInfo.address);
  }

  setuserInfo() {
    const docRef = doc(this.db, 'users', this.userId, 'User', 'UserInfo');
    setDoc(docRef, {
      name: this.userDetails.controls['userName'].value,
      email: this.userEmail,
      phoneNo: this.userDetails.controls['userPhoneNo'].value,
      address: this.userDetails.controls['userAddress'].value,
    }).catch(() => {
      console.log('retry');
    });
    this.getUserValues();
  }

  fetchProducts() {
    const docRef = collection(this.db, 'users', this.userId, 'cartItems');
    const OrderBy = query(docRef, orderBy('productName', 'asc'));
    onSnapshot(OrderBy, (snapshot) => {
      this.products = [];
      snapshot.docs.forEach((doc) => {
        this.products.push({ ...doc.data(), id: doc.id });
      });
    });
  }

  orderProducts() {
    let orderProducts = this.products.map(function (product: any) {
      return {
        id: product.id,
        productName: product.productName,
        productDescription: product.productDescription,
        productPrice: product.productPrice,
        productQuantity: product.productQuantity,
      };
    });
    const docRef = collection(this.db, 'users', this.userId, 'Orders');
    addDoc(docRef, {
      orderedProducts: orderProducts,
    }).then(() => {
      // this.clearCart();
    });
  }

  updateProductbyquantity(quantity: any, id: string) {
    const docRef = doc(this.db, 'users', this.userId, 'cartItems', id);
    updateDoc(docRef, {
      productQuantity: quantity.value,
    }).then(() => {
      this.openSnackBar('Quantity Updated', 'Ok');
    });
  }

  clearCart() {
    const docRef = collection(this.db, 'users', this.userId, 'cartItems');
    const OrderBy = query(docRef, orderBy('productName', 'asc'));
    onSnapshot(OrderBy, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.deleteProduct(doc.id);
      });
    });
  }

  getTotal(): number {
    return this.products.reduce(
      (i: number, j: any) => i + j.productPrice * j.productQuantity,
      0
    );
  }
  deleteProduct(id: string) {
    const docRef = doc(this.db, 'users', this.userId, 'cartItems', id);
    deleteDoc(docRef).then(() => {});
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 2500 });
  }
}
