import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
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
  serverTimestamp,
} from 'firebase/firestore';
import { MatAccordion } from '@angular/material/expansion';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { ThankingPageComponent } from './thanking-page/thanking-page.component';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.page.html',
  styleUrls: ['./order-form.page.css'],
})
export class OrderFormPage implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('stepper') stepper!: MatStepper;
  constructor(
    breakpointObserver: BreakpointObserver,
    private auths: AuthService,
    private router: Router,
    public toastController: ToastController,
    public modalController: ModalController
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
  orderId: string = '';
  rzp1: any;
  totalAmount: any = '';
  error: string = '';
  paymentId: string = '';
  enable = false;
  options = {
    key: 'rzp_test_hdC1SdrqAi6m86',
    amount: '1',
    currency: 'INR',
    name: 'Smart Mart',
    description: 'Test Transaction',
    image: '',
    order_id: '',
    handler: function (response: any) {
      var event = new CustomEvent('payment.success', {
        detail: response,
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(event);
    },
    prefill: {
      name: 'Shaikh Abdul Mannan',
      email: 'smart.mart@example.com',
      contact: '9525565826',
    },
    notes: {
      address: 'Razorpay Corporate Office',
    },
    theme: {
      color: '#528FF0',
    },
  };

  userDetails: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
    userPhoneNo: new FormControl('', [
      Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
    ]),
    userEmail: new FormControl(''),
    userAddress: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.retriveUser();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ThankingPageComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        name: this.userInfo.name,
        phone: this.userInfo.phoneNo,
        address: this.userInfo.address,
        email: this.userEmail,
        orderId: this.orderId,
      },
    });
    return await modal.present();
  }

  retriveUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user !== null) {
        this.userId = user.uid;
        this.userEmail = user.email;
        this.getUserValues();
        this.fetchProducts();
      } else {
        this.router.navigate(['/loginpage']);
      }
    });
  }

  pay() {
    this.totalAmount = this.getTotal() * 100;
    this.options.amount = this.totalAmount;
    this.options.prefill.name = this.userInfo.name;
    this.options.prefill.email = this.userEmail;
    this.options.prefill.contact = this.userInfo.phoneNo;
    this.rzp1 = new this.auths.nativeWindow.Razorpay(this.options);
    this.rzp1.open();
    this.rzp1.on('payment.failed', (response: any) => {
      this.presentToast('Payment Failed ' + response.error.code);
      this.error = response.error.reason;
    });
    (err: any) => {
      this.error = err.error.message;
    };
  }
  @HostListener('window:payment.success', ['$event'])
  onPaymentSuccess(event: any): void {
    this.paymentId = event.detail.razorpay_payment_id;
    this.orderProducts();
  }

  getUserValues() {
    const docRef = doc(this.db, 'users', this.userId, 'User', 'UserInfo');
    onSnapshot(docRef, (doc) => {
      this.userInfo = {};
      this.userInfo = doc.data();
      this.userDetails.reset();
      this.setValues();
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
    })
      .then(() => {})
      .catch((error) => {
        alert(error);
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
      if (this.products.length == 0) {
        this.router.navigate(['/home']);
      } else {
      }
    });
  }

  orderProducts() {
    let orderProducts: [] = this.products.map(function (product: any) {
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
      user: this.userId,
      userName: this.userInfo.name,
      phoneNo: this.userInfo.phoneNo,
      address: this.userInfo.address,
      email: this.userEmail,
      orderedProducts: orderProducts,
      totalAmount: this.getTotal(),
      createdAt: serverTimestamp(),
      paymentID: this.paymentId,
      status: 'undelivered',
    })
      .then((docRef) => {
        this.orderId = docRef.id;
        this.enable = true;
        const ref = doc(this.db, 'totalorders', this.orderId);
        setDoc(ref, {
          user: this.userId,
          userName: this.userInfo.name,
          phoneNo: this.userInfo.phoneNo,
          address: this.userInfo.address,
          email: this.userEmail,
          totalAmount: this.getTotal(),
          createdAt: serverTimestamp(),
          paymentID: this.paymentId,
          status: 'undelivered',
          orderedProducts: orderProducts,
        })
          .then(() => {
            this.presentModal();
            this.clearCart();
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        alert(error);
      });
  }

  orderProductCOD() {
    let orderProducts: [] = this.products.map(function (product: any) {
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
      user: this.userId,
      userName: this.userInfo.name,
      phoneNo: this.userInfo.phoneNo,
      address: this.userInfo.address,
      email: this.userEmail,
      orderedProducts: orderProducts,
      totalAmount: this.getTotal(),
      createdAt: serverTimestamp(),
      paymentID: 'Cash On Delivery',
      status: 'undelivered',
    })
      .then((docRef) => {
        this.orderId = docRef.id;
        this.enable = true;
        const ref = doc(this.db, 'totalorders', this.orderId);
        setDoc(ref, {
          user: this.userId,
          userName: this.userInfo.name,
          phoneNo: this.userInfo.phoneNo,
          address: this.userInfo.address,
          email: this.userEmail,
          totalAmount: this.getTotal(),
          createdAt: serverTimestamp(),
          paymentID: 'Cash On Delivery',
          status: 'undelivered',
          orderedProducts: orderProducts,
        })
          .then(() => {
            this.presentModal();
            this.clearCart();
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        alert(error);
      });
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
        alert(error);
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      color: 'primary',
      duration: 1500,
    });
    toast.present();
  }
}
