import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
} from 'firebase/auth';
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

import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.css'],
})
export class CartPage implements OnInit {
  constructor() {}

  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  provider = new GoogleAuthProvider();
  db = getFirestore();
  products: any = [];
  userId: string = '';

  ngOnInit() {
    this.retriveUser();
  }

  updateProductbyquantity(quantity: any, id: string) {
    const docRef = doc(this.db, 'users', this.userId, 'cartItems', id);
    updateDoc(docRef, {
      productQuantity: quantity.value,
    }).then(() => {
      console.log('updated quantity');
    });
  }

  retriveUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user !== null) {
        this.userId = user.uid;
        this.fetchProducts();
      } else {
        this.loginGmail();
      }
    });
  }

  loginGmail() {
    signInWithRedirect(this.auth, this.provider);
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

  getTotal(): number {
    return this.products.reduce(
      (i: number, j: any) => i + j.productPrice * j.productQuantity,
      0
    );
  }

  deleteProduct(id: string) {
    const docRef = doc(this.db, 'users', this.userId, 'cartItems', id);
    deleteDoc(docRef).then(() => {
      // this.openSnackBar('Product Deleted 😞😞 !!', 'Ok');
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
    console.log(orderProducts);
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
}
