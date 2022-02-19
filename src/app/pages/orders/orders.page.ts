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
  productId: any = [];
  userId: string = '';
  product: any = [];

  ngOnInit() {
    this.retriveUser();
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

  fetchProducts() {
    const docRef = collection(this.db, 'users', this.userId, 'Orders');
    onSnapshot(docRef, (snapshot) => {
      this.productId = [];
      snapshot.docs.forEach((doc) => {
        this.productId.push(doc.id);
        // doc.data()
      });
    });
  }

  fetchProduct(id: string) {
    const docRef = doc(this.db, 'users', this.userId, 'Orders', id);
    onSnapshot(docRef, (doc) => {
      this.product = doc.data();
      console.log(this.product);
    });
  }
}
