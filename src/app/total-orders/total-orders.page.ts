import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-total-orders',
  templateUrl: './total-orders.page.html',
  styleUrls: ['./total-orders.page.css'],
})
export class TotalOrdersPage implements OnInit {
  constructor() {}
  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();
  userInfo: any = {};
  userId: string = '';
  ordersId: any = [];
  product: any = [];

  ngOnInit() {
    this.retriveUser();
  }

  retriveUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user !== null) {
        this.userId = user.uid;
        // this.getUserValues();
        this.fetchProducts();
      } else {
        console.log('okkk');
      }
    });
  }

  fetchProducts() {
    const docRef = collection(this.db, 'totalorders');
    const OrderBy = query(docRef, orderBy('createdAt', 'desc'));
    onSnapshot(OrderBy, (snapshot) => {
      this.ordersId = [];
      snapshot.docs.forEach((doc) => {
        this.ordersId.push(doc.id);
      });
      console.log(this.ordersId);
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
