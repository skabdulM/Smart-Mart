import { Component, OnInit } from '@angular/core';
import { Products } from 'src/app/products';
import { initializeApp } from 'firebase/app';
import {
  collection,
  getFirestore,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { EditProductdailogComponent } from '../edit-productdailog/edit-productdailog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.css'],
})
export class ProductsTableComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public toastController: ToastController,
    public actionSheetController: ActionSheetController
  ) {}
  products: Products[] = [];
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore();
  displayedColumns = [
    'srNo',
    'productName',
    'productDescription',
    'productPrice',
    'editProduct',
    'deleteProduct',
    'downloadQR',
  ];

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    const docRef = collection(this.db, 'products');
    const OrderBy = query(docRef, orderBy('productName', 'asc'));
    onSnapshot(OrderBy, (snapshot) => {
      this.products = [];
      snapshot.docs.forEach((doc) => {
        this.products.push({ ...doc.data(), id: doc.id });
      });
    });
  }

  editProduct(product: Products) {
    const dialogRef = this.dialog.open(EditProductdailogComponent, {
      width: '650px',
      data: product,
    });
    dialogRef.afterClosed().subscribe((addProduct) => {
      if (addProduct.redirect === 'update') {
        const docRef = doc(this.db, 'products', addProduct.productId);
        updateDoc(docRef, {
          productName: addProduct.productName,
          productDescription: addProduct.productDescription,
          productImage: addProduct.productImage,
          productPrice: addProduct.productAmount,
        })
          .then(() => {
            this.presentToast('Product Updated!!');
          })
          .catch((error) => {
            alert(error);
          });
      } else {
        this.presentToast('Nothing changed');
      }
    });
  }

  async presentActionSheet(id: string) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Delete Product',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          id: 'delete-button',
          data: {
            type: 'delete',
          },
          handler: () => {
            this.deleteProduct(id);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();
    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  deleteProduct(id: string) {
    const docRef = doc(this.db, 'products', id);
    deleteDoc(docRef).then(() => {
      this.presentToast('Product Deleted 😞😞 !!');
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
    });
    toast.present();
  }
}
