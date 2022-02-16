import { Component, OnInit } from '@angular/core';
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
} from 'firebase/firestore';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.page.html',
  styleUrls: ['./order-form.page.css'],
})
export class OrderFormPage implements OnInit {
  constructor(breakpointObserver: BreakpointObserver) {
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
    userName: new FormControl('', [Validators.required]),
    userPhoneNo: new FormControl('', [Validators.required]),
    userEmail: new FormControl(''),
  });
  addressForm: FormGroup = new FormGroup({
    userAddress: new FormControl('', [Validators.required]),
  });

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
    this.addressForm.controls['userAddress'].setValue(this.userInfo.address);
  }

  setuserInfo() {
    const docRef = doc(this.db, 'users', this.userId, 'User', 'UserInfo');
    setDoc(docRef, {
      name: this.userDetails.controls['userName'].value,
      email: this.userEmail,
      phoneNo: this.userDetails.controls['userPhoneNo'].value,
      address: this.addressForm.controls['userAddress'].value,
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
      this.clearCart();
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

  deleteProduct(id: string) {
    const docRef = doc(this.db, 'users', this.userId, 'cartItems', id);
    deleteDoc(docRef).then(() => {});
  }
}
