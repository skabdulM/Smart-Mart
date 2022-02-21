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
  panelOpenState = false;
  productId: any = [];
  userId: string = '';
  product: any = [];
  OrderedProducts: any = [];
  productNames: any = [];
  productPrice: any = [];
  productQuantity: any = [];
  
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
      this.productId = [];
      snapshot.docs.forEach((doc) => {
        this.productId.push({ id: doc.id, status: doc.get('status') });
        // doc.data()
      });
    });
  }

  fetchProduct(id: string) {
    const docRef = doc(this.db, 'users', this.userId, 'Orders', id);
    this.productNames = [];
    this.productPrice = [];
    this.productQuantity = [];
    onSnapshot(docRef, (doc) => {
      this.product = doc.data();
      this.OrderedProducts = this.product.orderedProducts;
      this.OrderedProducts.forEach((element: any) => {
        this.productNames.push(element.productName); //every elemt of order name
        this.productPrice.push(element.productPrice * element.productQuantity);
        this.productQuantity.push(element.productQuantity);
      });
      console.log(this.productNames, this.productPrice, this.productQuantity);
    });
  }
  createPDF(id: any) {
    const data: any = this.getDocumentDefinition(
      id.id,
      this.productNames,
      this.productPrice,
      this.productQuantity
    );
    pdfMake.createPdf(data).open();
  }
  getDocumentDefinition(
    id: string,
    productNames: any,
    productPrice: number,
    productQuantity: number
  ) {
    return {
      content: [
        {
          // text: 'My Journey',
          text: 'Order Details',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          text: 'Order ID',
          fontSize: 14,
          bold: true,
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
            headerRows: 1,
            body: [
              [
                { text: 'Product Name', style: 'tableHeader' },
                { text: 'Product Quantity', style: 'tableHeader' },
                { text: 'Product Price ', style: 'tableHeader' },
              ],
              [productNames, productQuantity, productPrice],
            ],
          },
          layout: 'lightHorizontalLines',
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
