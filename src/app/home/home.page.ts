import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
} from 'firebase/auth';
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AddtoCartdailogComponent } from './addto-cartdailog/addto-cartdailog.component';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css'],
})
export class HomePage implements OnInit {
  constructor(
    public dialog: MatDialog,
    private router: Router,
    public toastController: ToastController,
    public modalController: ModalController
  ) {}

  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();
  provider = new GoogleAuthProvider();
  product: any = {};
  userId: string = '';
  qrResultString: string = '';
  opened = false;
  hasPermission!: boolean;
  products: any = [];
  Orders: any = [];
  
  ngOnInit() {
    this.retriveUser();
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    this.getProduct();
  }
  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  retriveUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user !== null) {
        this.userId = user.uid;
        this.fetchProducts();
        this.fetchOrders();
      } else {
        this.loginGmail();
      }
    });
  }

  loginGmail() {
    signInWithRedirect(this.auth, this.provider);
  }

  getProduct() {
    const docRef = doc(this.db, 'products', this.qrResultString);
    onSnapshot(docRef, (doc) => {
      this.product = {};
      (this.product = doc.data()), doc.id;
      if (this.product == null) {
        alert('Please Scan the provided QR code');
      } else {
        if (this.opened == false) {
          this.addToCart();
        } else {
        }
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
      console.log(this.products.length);
    });
  }

  fetchOrders() {
    const docRef = collection(this.db, 'users', this.userId, 'Orders');
    const OrderBy = query(docRef, orderBy('createdAt', 'desc'));
    onSnapshot(OrderBy, (snapshot) => {
      this.Orders = [];
      snapshot.docs.forEach((doc) => {
        this.Orders.push({
          orderId: doc.id,
        });
      });
    });
  }
  addToCart() {
    const dialogRef = this.dialog.open(AddtoCartdailogComponent, {
      width: '650px',
      data: this.product,
    });
    this.opened = true;
    dialogRef.afterClosed().subscribe((addProduct) => {
      if (addProduct.redirect === 'addtocart') {
        const db = getFirestore();
        const docRef = doc(
          db,
          'users',
          this.userId,
          'cartItems',
          this.qrResultString
        );
        setDoc(docRef, {
          productName: addProduct.productName,
          productDescription: addProduct.productDescription,
          productPrice: addProduct.productAmount,
          productImage: addProduct.productImage,
          productQuantity: addProduct.productQuantity,
        })
          .then(() => {
            this.presentToast('Added to Cart');
            this.qrResultString = '';
            this.opened = false;
            // this.dismiss();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.qrResultString = '';
        this.opened = false;
        // this.dismiss();
      }
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      color: 'primary',
      duration: 2500,
      buttons: [
        {
          side: 'end',
          text: ' Go to Cart',
          icon: 'cart',
          handler: () => {
            this.router.navigate(['/cart']);
            this.dismiss()
          },
        },
      ],
    });
    toast.present();
  }
}
