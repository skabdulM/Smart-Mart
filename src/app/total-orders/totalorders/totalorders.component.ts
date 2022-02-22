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
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-totalorders',
  templateUrl: './totalorders.component.html',
  styleUrls: ['./totalorders.component.css'],
})
export class TotalordersComponent implements OnInit {
  constructor() {}
  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();
  // userInfo: any = {};
  // userId: string = '';
  ordersId: any = [];
  product: any = [];
  displayedColumns = [
    'srNo',
    'ordersId',
    'userId',
    'totalAmount',
    'paymentId',
    'status',
    'invoice',
  ];

  ngOnInit() {
    // this.retriveUser();
    this.fetchProducts();
  }
  // retriveUser() {
  //   onAuthStateChanged(this.auth, (user) => {
  //     if (user !== null) {
  //       this.userId = user.uid;
  //       // this.getUserValues();
  //       this.fetchProducts();
  //     } else {
  //       console.log('okkk');
  //     }
  //   });
  // }

  fetchProducts() {
    const docRef = collection(this.db, 'totalorders');
    const OrderBy = query(docRef, orderBy('createdAt', 'desc'));
    onSnapshot(OrderBy, (snapshot) => {
      this.ordersId = [];
      snapshot.docs.forEach((doc) => {
        this.ordersId.push({
          id: doc.id,
          userId: doc.get('user'),
          status: doc.get('status'),
          amount: doc.get('totalAmount'),
          paymentId: doc.get('paymentID'),
        });
      });
      console.log(this.ordersId);
    });
  }

  fetchProduct(id: string) {
    const docRef = doc(this.db, 'totalorders', id);
    onSnapshot(docRef, (doc) => {
      this.product = doc.data();
      console.log(this.product);
    });
  }

  kk(id: string) {
    console.log(id);
  }
}
