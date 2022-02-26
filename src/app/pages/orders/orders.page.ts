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
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

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
  // panelOpenState = false;
  // productId: any = [];
  ordersId: any = [];
  userId: string = '';
  product: any = [];
  OrderedProducts: any = [];
  productNames: any = [];
  productPrice: any = [];
  productQuantity: any = [];
  createdAt: string = '';
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
    const OrderBy = query(docRef, orderBy('createdAt', 'desc'));
    onSnapshot(OrderBy, (snapshot) => {
      this.ordersId = [];
      snapshot.docs.forEach((doc) => {
        this.ordersId.push({
          orderId: doc.id,
          userId: doc.get('user'),
          useremailId: doc.get('email'),
          status: doc.get('status'),
          amount: doc.get('totalAmount'),
          paymentId: doc.get('paymentID'),
        });
      });
    });
  }

  fetchProduct(user: string, orderId: string) {
    const docRef = doc(this.db, 'users', user, 'Orders', orderId);
    this.productNames = [];
    this.productPrice = [];
    this.productQuantity = [];
    onSnapshot(docRef, (doc) => {
      this.product = doc.data();
      this.createdAt = doc.get('createdAt').toDate();
      this.OrderedProducts = this.product.orderedProducts;
      this.OrderedProducts.forEach((element: any) => {
        this.productNames.push(element.productName); //every elemt of order name
        this.productPrice.push(
          '₹' + element.productPrice * element.productQuantity
        );
        this.productQuantity.push(element.productQuantity);
      });
      console.log(
        this.product,
        this.productNames,
        this.productPrice,
        this.productQuantity
      );
    });
  }

  createPDF(orderId: any) {
    const data: any = this.getDocumentDefinition(
      this.product,
      orderId,
      this.productNames,
      this.productPrice,
      this.productQuantity
    );
    pdfMake.createPdf(data).open();
  }
  getDocumentDefinition(
    info: any,
    orderId: string,
    productNames: any,
    productPrice: number,
    productQuantity: number
  ) {
    return {
      content: [
        {
          // text: 'My Journey',
          text: 'Invoice',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          text: 'Order ID: #' + orderId,
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 8],
        },
        {
          text: 'Ordered At: ' + info.createdAt.toDate(),
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 8],
        },
        {
          text: 'Name: ' + info.userName,
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 8],
        },
        {
          text: 'Address: ' + info.address,
          fontSize: 14,
          margin: [0, 20, 0, 8],
        },
        {
          text: 'Contact Details: ' + info.phoneNo,
          fontSize: 14,
          margin: [0, 20, 0, 8],
        },
        {
          text: 'Email Id: ' + info.email,
          fontSize: 14,
          margin: [0, 20, 0, 8],
        },
        {
          text: 'Payment Methode: ' + info.paymentID,
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 8],
        },
        {
          text: 'Delivery Status: ' + info.status,
          fontSize: 14,
          margin: [0, 20, 0, 8],
        },

        // { '#': id },
        {
          text: 'Product Details',
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 8],
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*',  '*'],
            headerRows: 1,
            body: [
              [
                { text: 'Product Name', style: 'tableHeader' },
                { text: 'Quantity', style: 'tableHeader' },
                { text: 'Product Price ', style: 'tableHeader' },
              ],
              [productNames, productQuantity, productPrice],
            ],
          },
          layout: 'lightHorizontalLines',
        },
        {
          text: 'Total Amount : ₹' + info.totalAmount,
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 8],
        },
      ],
      styles: {
        name: {
          fontSize: 16,
          bold: true,
        },
      },
    };
  }
}
