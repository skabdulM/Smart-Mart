import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.css'],
})
export class OrdersPage implements OnInit {
  constructor() {}
  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();
  panelOpenState = false;
  productId: any;
  userId: string = '';
  orders: any = [];
  ngOnInit() {
    this.retriveUser();
    // this.fetchProducts();
  }

  retriveUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user !== null) {
        this.userId = user.uid;
        // this.userEmail = user.email;
        // this.getUserValues();
        this.fetchProducts();
      } else {
        // console.log('something is fishy');
      }
    });
  }
  product: any = [];
  fetchProducts() {
    const docRef = collection(this.db, 'users', this.userId, 'Orders');
    this.orders = [];
    onSnapshot(docRef, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        this.orders.push(doc.id);
        // doc.data()
      });
      console.log(this.orders);
    });
  }
  products: any = [];
  fetchProduct(id: string) {
    const docRef = doc(this.db, 'users', this.userId, 'Orders', id);
    onSnapshot(docRef, (doc) => {
      this.products = doc.data();
      // doc.data()
      console.log(this.products);
    });
  }
}
