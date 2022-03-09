import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.css'],
})
export class CartPage implements OnInit {
  constructor(public toastController: ToastController) {}

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
    })
      .then(() => {
        this.presentToast('Quantity Updated');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  retriveUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user !== null) {
        this.userId = user.uid;
        this.fetchProducts();
      } else {
      }
    });
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
      this.presentToast('Product Deleted');
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      color: 'primary',
      duration: 1500,
    });
    toast.present();
  }
}
