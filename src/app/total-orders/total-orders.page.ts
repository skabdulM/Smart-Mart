import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-total-orders',
  templateUrl: './total-orders.page.html',
  styleUrls: ['./total-orders.page.css'],
})
export class TotalOrdersPage implements OnInit {
  constructor(private router: Router) {}
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
        // this.fetchProducts();
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
      if (this.userInfo.admin == true) {
        console.log('admin');
      } else {
       this.router.navigate(['/user']);
      }
    });
  }
}
