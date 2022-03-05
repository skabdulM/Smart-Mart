import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  deleteDoc,
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
import { ToastController } from '@ionic/angular';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.css'],
})
export class OrdersPage implements OnInit {
  constructor(public toastController: ToastController) {}
  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();
  ordersId: any = [];
  userId: string = '';
  product: any = [];
  OrderedProducts: any = [];
  productNames: any = [];
  productPrice: any = [];
  value: any = [];
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
        console.log('something is fishy');
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
    getDoc(docRef).then((doc) => {
      this.product = doc.data();
      this.createdAt = doc.get('createdAt').toDate();
      this.OrderedProducts = this.product.orderedProducts;
      this.OrderedProducts.forEach((element: any) => {
        this.productNames.push(element.productName + '\n'); //every elemt of order name
        this.productPrice.push('₹' + element.productPrice + '\n');
        this.productQuantity.push(element.productQuantity + '\n');
        this.value.push(
          '₹' + element.productPrice * element.productQuantity + '\n'
        );
      });
    });
  }

  cancelOrder(id: string) {
    const docRef = doc(this.db, 'users', this.userId, 'Orders', id);
    const ref = doc(this.db, 'totalorders', id);
    deleteDoc(docRef)
      .then(() => {
        this.presentToast('Order Cancelled!!');
      })
      .then(() => {
        deleteDoc(ref);
      })
      .catch((error) => {
        console.log(error);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      color: 'danger',
      duration: 1500,
    });
    toast.present();
  }

  createPDF(orderId: any) {
    const data: any = this.getDocumentDefinition(
      this.product,
      orderId,
      this.productNames,
      this.productPrice,
      this.productQuantity,
      this.value
    );
    pdfMake.createPdf(data).download();
  }

  getDocumentDefinition(
    info: any,
    orderId: string,
    productNames: any,
    productPrice: number,
    productQuantity: any,
    value: any
  ) {
    return {
      content: [
        {
          columns: [
            {
              image:
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoUAAAI3CAYAAADtKyGqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAANHxJREFUeNrs3WuMnNd5H/CXK4oX8bakLcqmLHFkL6PYjpZ0bEtxklqjoGAsoIklGQkKOLEpIAX6JYzUD0mDopCEomjRL5JoFE3QoFo3MRA0SESlRdUSaDQKEKeSlYhc1beQtleSpUSUTS515UWiOmf2XWq15O7O5T3v9fcDRiveZmfPO7vzn+ec85wkAQCg8VYZAmBU+w9Nt5f4oz3d2/gSf7Yl/fN+tGsyVLPd2+E+/+7jy/zZTHq76PcP7J2c8YwEhEJg1DC3+Nc3L/r1+ABBjvIG0RAcn13m7wiXIBQCNQl47SWCXSu9wSA6SwTKmeTdiqUgCUIhEDHoLQxx80Fv54LfW256FooSqo6z6f8/vjhAdsNjxxCBUAhcHPgWTsneLOzRwPAYwuKzybvT2LPd4HjY8IBQCHUJfeMLwl34OF/hm78By5tdEByPLPi1qWoQCqGU4a+9IOjtTkNg28hAdPOB8XGBEYRCyCv4zYe+EPbmW6mY4oXy6iTvVhjnw6IpaRAKoe/wN74g8O1eEASBeugFxDQsdhKVRRAKIa3+zQfAmxNr/aCp5qeeD6dh8bCqIkIhNCcAmvoFVtIRFBEKodoBcH4KuC0AAhGC4uNpWDxs6hmhEMoVAluLAqBj2IC8zKRBsbdGUTURoRDyDYELq4DhoyogUBazi0Jix5AgFIIQCJCkIfGRRCURoRAGDoGtRSGwZVSAmpivJIZ1iQetSUQohIuDYAh/n09DoDWBQFOEUHgwhMRuQDxoOBAKaWIIbKUBcD4ImhIGSANiooqIUEjNg+D82sAvJ6qBACsJ6w873dtXrUVEKKQuQTCEwNsSawMBhjWTzFURH7GjGaEQQRCAYHZBQLQOEaEQQRCAXkCcSkwxIxRScBAM4W9fGgYFQYBizSRzFcQHbVJBKCSPIBh2CYdq4G8lNosAlFWoGn61e5vqBsRZw4FQSJZhsJ3MVQT3GQ2ASplKrD9EKGTEINhKTA8D1MVM8m71cMZwIBTSTxhsJ3PTw7cZDYBaClXDr6oeIhRyqSAY1gruS8Ngy4gANMJM9/ZgYu0hQiHpFPE9yVxV0FFzAM003/vwPlPLQiHNC4PtNAy2jQYAC3TScNgxFEIh9Q6D+xLtZABYWWhrE3oeThkKoZD6hcFQGWwZDQAGMJPMVQ6FQ6GQCgfBsEbwrmSuMmi9IACjCOsOw6aUB2xKEQoRBgFAOBQKEQYBQDgUCil7IAxh8B5hEIACwuHd1hwKhRQfBvclNpAAULyZxIYUoZBCwmC7++EhYRCAkgmtbO7W51AoJH4YDP0F7080nQag3EIovNMJKUIh2YfB8TQM7jMaAFTIA8nctLLNKCU3ZggqEQjDJpIfCIQAVFDvNSx9LaPEVArLHQbbiXWDANSH9YZCIQOGQVPFANSZKWWhkD4CoX6DADRBCIRhI8pBQyEU8t4w2ErmporbRgOABukkdimXgo0m5QiE9yZzG0kEQgCaJrz2PW0jSvFUCosNg6HnYKgO7jEaAKBqWCSVwuIC4b3hnZFACAAXtBNVw8KoFOYfBlvdDw8LgwCwrE73drsdyvlRKcw3EO5LVAcBoB/tZK7p9W2GIh8qhfmEwdBeJqwd9MQGgMHpaygU1iIQhqpgmC5uGQ0AGFo4DSVsQjlsKOIwfRw3EN6bzE0XC4QAMJpQZHksXYpFBCqFccKg6WIAiGcqmTtD2XSyUFjqQGi6GADiC9PIt+tpmB3Tx9kGwn2J6WIAyEMowjxtd7JQWMZAGKaLHzISAJCbsFzr4XQNPyMyfTx6GOw9IRPnFgNAkaYS6wyFwgIDofWDAFAeYZ3hLYLhcEwfDx8IwxqGxwRCACiNUKz5QVq0QSjMJRDuS+YqhONGAwBKJbw2P2YDilCYRyC8P7GhBADKHgwf1uh6MNYUDhYIQxj0BAOA6njgwN7Juw2DUJhVGLTDGACqa6obDO80DEJhFoEwbCixaBUABEOhUCAEACpOy5pl2GiydCBsCYQAUCvhNf2xtOjDIiqFlw6Ee9JA6EkDAPWjYigUCoQAgGAoFAqEAIBgKBQKhACAYCgUCoQAgGAoFC4ZCEMQfLp7a/meAADBsKkD0OiWNAv6EAqEANBs87OGjdXYUKgxNQCwOBh288FDQmHzCIQAwGL7mhoMGxkK04stEAIASwXDe5v2RTduo0kaCPd5vgMAK7jzwN7JqaZ8sY2qFHYD4V0CIQDQp4e62eG2pnyxjakUdi9qCIMPeX4DAAMILWpCq5rDQmE9AqHm1ADAKMHwurr3MKx9KExbz/xAIAQARlD75ta1XlO4oBehQAgAjCLMOt5f5y+w7htN7k+0ngEAsrEv3bRaS7WdPk4v2v2evwBAxsI0ckcorEYgbCcNP78QAIgmrCv8RDcYzgiF5Q6Ere6HpxPrCAGAeGq38aSOawofFggBgMhqt/GkVqFw/6FpG0sAgLzsSw/HqIXaTB+nx9A87PkJAOSoNiee1CIUWkcIABSoFusL6zJ9bB0hAFCUsHTtnqp/EZUPhfsPTd+bWEcIABTrrnQpW2VVevq4O/ghDD7teQgAlECYPr6uqtPIla0Upuca21gCAJRFyCYPVfXBV3n6OMzdtzz/AIASua2q5yNXcvrYMXYAQIlV8hi8ylUK02njhzzfAICSqmRWqeL0sWljAKDs2lWbRq7U9LFpYwCgQio1jVyZSqFpYwCgYiqVXao0fWzaGAComnZVmlpXYvpYk2oAoMIq0dS6KpVC08YAQFWFaeTSn41c+lCY7txxtjEAUGV3pTOfQuGQgbASyRoAoA+lnvkse6Xw/mSu5AoAUHV79h+a3lfWB1fajSZ6EgIANVTaTSdlrhSaNgYA6qa0S+NKWSlMS6t2HAMAdXVd2U46KV2l0OYSAKABSlf8KuP0cWhB0/JcAQBqrJ3unxAKLyWtEv6W5wkA0AD3C4XLD44WNABAE5SqRU1pQmF3UFrdD/s8PwCABinNPooxgwIAUJhWWaqFpWhJk1YJf+B5AQA0UCkaWpelUqgnIQDQVGE/xV1FP4jCK4WOswMAKL5aWIZKobWEAEDTFV4tLLRSqEoIAHBBodXCoiuFqoQAAHMKrRYWVincf2h6T/fD064/AMAFhVULi6wUOs4OAOC9QrXwtiI+cSGh0OklAABLKmR53ViTvlgAgAoo5JST3NcUdr/IUBY96XozqCtfeDZZ9+YbF/3+8xMfNTgA1M3Mgb2T1+X5CVcX8EXe5TrTj4npp5IPHft2cs3Rb/UC4XJe2XZl8vyujyY/nPhYcmzyU8mZ9VcYQACqLFQL291g2MnrE+ZaKUyrhOGM43HXmkvZfOLl5ONP/GXy051Hk7WXqAr265s3fTb561u/0AuLAFBRnW4ovKWuoXBf4pxjLiEEwBAEP/Pon2Z6v8IhABUX2tPM5PGJ8p4+tsGEi1xz7NvJL/7R7/WqhFkLVccwDR2C4d+2bzXYAFRNyE535vGJcqsU7j80HXruPOzaslCoDrb/7A9z+Vyhati540vWGwJQNVvzaGadZ0sazap5j1/82u/lFgiDUDX81QP/ZqS1igBQgFw26eYSCtNm1W3XlIWBMIS0vIVdzIIhABXz5dqEwkSVkAXClHERgXBhMAyhFAAqopUuw6tFKNznehKETSV5ThkvJWw+CeEUACoierUweihM29DoS0hvyjbsMi6LEE5XaooNACVxW7ocL5o8WtKYOqYnVOZitJ0ZxRf+5x8nl//+71/49Yk3zyYnTp9Lpo+fSl549bSLBkCZhEx1dyVDYZpo97iGzDenLpsrnjmSXHX0W8m6Gz899xtbN/Q+fO7D23sB8dHvH0+efNFR3QCUwr6YoTD29LEqIT2jHlsX06n/+J8u+fvb1q9JvvjxDyW//TO7ev8PAAUbj7nhJHYo3Of6ERS523glp5/8RvLWCy8u+edXb1rXDYYTvY8AULBoG06ihUIbTJgXdvqWbS3hYm/8n79Y9s/Xr74s+Y3dO3sfAaBA0TacxKwUft51I/jQsW+X/jG+/vAjK/6dMIV8x/UfdEEBKDwYViYUdhPseKwHTPVsr0Dbl7Pf+U5ff+/GHVutLwSgaFGmkGNVCve5Xsz70NFvVeJxhrWF/Whf+z4XFYAi7dl/aDrz7i6xQuGXXS+Csq8lXOj8q6/29fduuHKzCwtA0TLPWpmHQr0JWWjLiR9V5rGe+853+/p7YfrYFDIABct8mV6MSqHehNSeaiEABWtl3bMwRii0wYTa25WefAIABcq000umoTBd9Nhyjai7G7Zv1rMQgKKVulJogwnvcWrb+yvzWC/bsWOgvz+xTbUQgEJleuxd1qHQ1DHv8cq2KyvzWFdfPVgonLSuEIDiZTaFnFkoNHXMUl6+emclHueaj/7kQH8/TCEDQMFKWSk0dcwlPb/rY+UPhD/5k8nYpk0D/ZuwpvDqTetcYACKlNkUcpah0NQxl/TDiY+W/jGuu/FTQ/27ye1bXGAAipbJFHImodDUMcs5Nvmp5Mz6K0r9GDfcPtz3k36FAJRAqSqFqoSsGAzLKkwdh9swwvSx000AKFiYQm6XJRR+3vVgOX996xdK+9g2fenXRvr3ExpZA1C8kbPYyKHQWcf0I7Sm+eZNny3d4woVwo23j/Z9pDUNACUw8qztWBkeBM3QueNLpVtbuPV3f3vk+9DEGoASaKV7PAoNhTe7DvQjBML//cV/XprHs/lLv5asu/HTI99PaE2jZyEAJdAuOhSqFNK3sOGkDNPIYdp46+/+Tmb3t8u6QgCKN9J6qJFCYZbn7dEcoVpY5G7kEAiv+q//JdP71JoGgBJod7PZeCGhMLHrmIoFw/lAOOjpJSsJbWmcbgJAGYJhUaGwbewZRlhf+Oe/8S9ynUoOZzB//V/928wD4byJrRtdWACKNnTBbuhQmLaiaRl7RhEqhuEWe1fy37ZvTf7wd/5d8o1X34r2OSZtNgGgeO3cQ2FigwkZCdXCENhiTCeH6uCf7P/XSeeOX+/9+s233k5eePV0lK8jNLEOO5EBoEBDt6ZZPcIn1YqGzITm1mE6+Zpj304+0Xk0mZh+aqT7++GujyXfvPGzl5yefuLFk8kd138wytcRWtM82b1/AChQu3s7nGcobBtzsvb8xEd7t80nXu4Fw4ln/ib50NFv9fVvQ1Xw+RAGu0Ew/P9Sjp18LdrjD61phEIAChYKdw/kEgrTQ5fHjTmxhMphWAcYbsGVLzybrHvzjeTKH84ka7sf54WK4HyY7FeYPj7x5tnejuGs9ZpYf9P1A6BQQy3xG7ZS2Dbe5Gm+8jdI+FvOsZOvJzdGCIVhTWFYWxjuHwCKEgp4B/ZOdgb5N8NuNLGekEqbfvmVaPdtFzIAJdAe9B+M5fWJoEyeOR4vFOpXCEAJDFzAGzgUpusJQTBcQjjZJMZ6RQAYwMB5bSyPTwJlFHMK2VnIABRt0ELeMKHQekJqIeZmkNCaBgAKFj0Uto0xdRDa0sQ63SS0pnG6CQAFG6iQN1AotJ6QuonZyHpim2ohAIUaKLcNWincY3ypkycinj4yaV0hAAUb5BzkQZtXW09IrYTp4zffejvKVG9oYj1hbSHQhxOnz/WWtEAE7aTPc5BXD3HHUCuhNc2NO7Zmfr+hLc1vfurDBhgY6OdR6IzgDHUy1Pc5yH1PH+8/NN1KnHdMDcVsTQMwiLBJ7Ysf/1Byz89fb6aBrPQ9fTzImsK2caWOjp1wTjFQLvMzDTFmMWicVlrYyzQU7jau1FFYUxizZyHAsELVUDAkA31VC8eyvkOoounjppCB8gbDcHwmlCkUto0pdfWMdYVAid1x/Q6DwCj66h7TVyjUtJq6C60gtIMAykqLK0bUV47rt1Jo6pjaUy0Eymxyu4b4DK+fJtb9hkKbTKi9ozabACU2sXWjQWAUmYVClUJqLzSNDTuRAcrIZhNGtGKBTyiEBfQsBKCmRq8U2mRCkzjdBICaWjHP9VMpVCWkMZ7RrxAoKR0SGNVKJ5v0Ewp3GkaaIqwpfOHV0wYCKB0nL5GBPaOGQpVCGkVrGqCMLG+hDKGwbQxp1A/e46cMAlC+N6yWtzC6m4cOhSvNPUMdhelja3cAgZAaag0dChNTxzSUtTtAmZg6RigEP4ABVArJzHKtBlcKhY63ww9ggAKFJS1OWyJDrWFDYcvYIRgCFOeJF08aBHIJhatX+Iemj2msoydfT27YvjnKfT/Z/SFf1A/6qzetT+64/oOlf5zBHdfv6Pu816889f3CHqcxbfaYzrv1I1clE1s3ZP8G1XIWsnXzwKFw/6FpgZBGCz+I+31RGtT61ZdVYjPLidPnCn2cg0yZVWVzkDGt35i+G2TXZf+1vXlWNwSy1lrqD8aG+UfQBOEHcazTTUIFMgRDoB5CIIzxPa1KSFlCoUohjXfs5GvR7nti2wYDDDVx046tUe7XekJiWGoH8nKh0JnHNF7MH8iTV242wFATN0T4fnYWOxG1Bg2FLWNG08VsBRFjQTqQvzB1vG39mszvVwcEyhQKTR9DxB/M4UUkxsJ0IF8TWzdGuV9N9Ilod9+hcP+h6fHuh3FjBnOtaWKZ3L7FAEPFxVpPqFJIRON9h8JElRBy+cF8g3WFUGmxKv4CIZG1BwmFLeMFc8Kawlg90GKtRQLyEeuNnaljYktnhYVCGPgHdMR37TacQHVNRjr1SKWQHOzpNxRqRwMLf0BHfNeuNQ1UU2hWHeNNXcyuB7BAq99Q2DJW8K6YR01pYg3VFOtsdA2rKVsotNEEFolVLQzVhlgvLkA8sar8jrYjJzv7DYXa0cAiMVvT7LKuEConxpu5mLMSsEhrxVC4/9C0KiFc6t378VeirfPRmgYEwt7PGVVC8tPXRhNVQljCsRNxqoVON4FqiTV1bD0hOeqrJY1KISwhZu+wWEdlAdmLUSkMMxFh5zHkZfHssEohDCBm77BJm02gEkIbmrBBrEo/X2AJ4yuFwt3GCPJ/Jx/rhQaoxhs4p5hQgNZKoVClEJZ7Nx/xB7fWNFB+sTaGqRRSxlDYMkawzLv546ei3bfWNFBusc4rFwgpyBahEEYQpo9j9RFTKYRyu2nH1jhvNk0dU4ylN5rsPzRt6hj6cCxSI+uwplBrGiivWF0CVAopg7HlEiOQ/7v6WJUIYDSx+omG2YdYjfFhBe3lQiFQ8Lt6/QqhnG7QsJqaG1suMQL5B8NYC9mB0cSq4jvajiItbGCtUghDOhppXWHgLGQol1jrfcOmtVgb16BP40uFwp3GBop/d681DZRLrM4AqoSUORS2jA30/w4/1ukmWtNAuUxaT0h9mT6GLBw7+Vq0+xYMoRzC1HGM78eYx2bCMLSkgZK+y5+0rhBKIdrUsd6ElMOFpYOrFv7u/kPT7xgbGMy/v+VjvUoCwCD+4MizgiFl0Dmwd/KW8D+mj8G7fcDPDng3FO4/NN02HDC4mK1pAIEQIrPRBPxwB4oyrRUN5TEuFEJGwg7CY6qFgDeTVNzCUGjnMQz7rt8PeKBPoQ1NeDMJZbH/0HRrcSgcNyww5Lt+U0FAnzSspoQuCoXAkJxfCngTSdUtDIXOPQY/6AFvIGme8cWhsGVMYHha0wDePFJRvX0lq40DZPTD/vgrvcXjsU43yWqHc3h8V29a19ff7VU1Tp8rbEzD4+x3PIvcAW5M6zemE1s3RPm6rCekzIRCyDK4nXg92jmpX/vmDzOZdgovdr/5qQ/39Xef/PvZ5NHvvVTYeIbH2e+L81ee+n5hj9OY1mtMt61fk9zz89dn/jWFN41h5zGU1cLp47bhgNHEbEh7w5WbDTDkINb3mt6ElNjOxaEQKPEP/cntQiHkYVekqWOnmFBiLaEQMhZzeihMp8VarwjMCd9jsZaAqBRSdkIhZP2DP+YUsmohRCUQ0vhQuP/QtCPuICPTx09Fu+9Y01rAnMlI6wlNHVNyrQuhMHHEHWQmTB/Hak6rUghxTWyL88ZLpZAqhUIgQ7H6uw3Suw0Y/E1XjHW74Y1iWG8MZScUQgQxp4pu2rHVAEMEsaaONaxGKIQGC02sY5nYutEAQwTRNplYT0jFQmHbUEB2wlRRrDVEYfo4nLgAZPt9FWPquHcEX6Q1xpCl/YemWyqFEMnRiOfGOt0EshVrWYYqIRUiFEIsMV8MtKaBarzRsp6QKhEKIZIwZRTrdBOtaSA7sZZkxDzhCIRCqJhjJ1+Ldt+CIWRjcvuWKPerNyFVDYU7DQVkbzrii8KkdYWQzRssp5jAe0Jhy1BA9kIT61hNayesK4SRhWnjWA3hVQqpmD2mjyGyWC8MMV/MoCliVQkFQipoXCiEyGK2pom1FgqaYnK7qWOYJxRCZDErBvoVwvBCs+pYyzBUChEKgYuENYXHIlULY53CAE0Qawd/aEMTay0xCIVQcTF3IWtNA8OZ1LAahELIW8x+hVrTwOBChT3WGypH21H1ULjHUEA8YTopnHASw8Q2rWmgLN834fs81vc65BUKxw0FxBWrehCz4gF1FavCrkpIhe02fQw5idmaZpdG1jCQWG+krCekwvQphLyEFhWxdiRqTQODBcIYu/bD93dYKgJVJRRCjo6diFMtDKebhBuwsl16E4JQCEWLecqBaiEU+73iFBOEQqBvx6IeeScUwkpCw/dYVXWVQoRCoG+hVUWsNUfhuC6nm8DybtqxVSCEJaw2BJCv0LIiVCtiuOP6DyYnTp9b9u9sW3f5QEHz1o9cVdhYDfJYq/I4jWmxY2rqGJa2Kvxn/6HpdwwF5CMEwt/+mV0GAmrkXz72LecdU3Ud08eQs5inmwDFfE8LhNSBUAgFiLnhBMiXhtUIhcDQrD+C+nC0HUIhMLRYTayBfIWlIJaDIBQCQwvrj7SwgOpTJUQoBEZ21LpCqDzrCREKgZGpMEC1hYp/rGb0IBRCg8Q83QTI4Y2dJSAIhUBWjp18zSBARekiQN045g6KfFE5/kpy87XvjxQ4X08e/d5LF/3+1ZvW947D68eTL54sdM3UHdfv6PtIwK889f3CHqcxLe+Y7tq2Mfnch7dHeYwqhQiFQKbBLaxLWr/6sszvO5wdO2qT7HCOcpGNtgc5JaIqDcGNab5jetOOrQIh9Mn0MRQs1ovLtvVr+q4IQV1NbN0Q5X5NHSMUApmL2ZpmcvsWA0xjhTdF4c1Rld7MgVAIDRbzxeWGKzcbYBor1tRx6BowyDQ8CIVAX8KLS6y1W6FSEmO9IlRBrDdFGlYjFALRTMesFm5XLaR5wrRxtKlj6wkRCoFYYvYrnDSFTAPFqhKGpvPhBkIhEEVYoxTrhWZi2wYDTONEa0WjSohQCMQW68UmrCk0hUyTxGzHNG3XMUIhEFvM1jS7tqoW0hyxpo5jbgoDoRC4ILSmidXmQmsamiTWmyC9CREKgdwcOxGnChFzJyaUSczlEk4xoSmhcNZQQPFivuioFtIEMdfPxnrTBiXx+HwoPGwsoHjHoh55JxRSf7FaMMVc3gFlYfoYSiS0pQntaWKY2LrB6SbUXqwWTKaOEQqB3MXsg6ZnIXUWpo5jvfGx6xihEMjd9PFT0e7b6SbUWaznd8zm8iAUAoW8AGliTZ3Fen4/8eJJg4tQCBQj1lRVmFq7etN6A0zthBNM4k0dv2aAEQqBYsRc1B7rTFgoUqzndczNX1DWUKhPIZRIzH5osc6EhSLF6sP5jF3HNMfh+VB4xFhAeYR+aI7Ugj7f6GxcF+3EnmnfhzTHrOljKKmjWmBAX2JtMAlvzrSioUmEQigp01ZQ8PegKiFCIVAGFrhDsZxiglAIlIZWGFDg998JU8c0MxQeNhRQPha5QzHC1HFYUwhNcWDvZEdLGiixsMjdCxMU8IbM1DENZPoYSs5idyjmDRkIhUCpaE0D+Yp5/jgIhcDQVAohX0+8eNIg0DS9ZYSr5n+1/9D0O8YEyuk3P/XhZGLrBgMBOfgP//eodlA0TefA3slbVAqhAuxChnzoD0qTCYVQAfoVQj6cJIRQCJSahe+QD1V5Gmp2cSjsGBMoLxUMiCv0BNWKhoY6sjgUAiWmNQ1EfuOlSkjDCYXgBQtInGICC0Oho+5AMITGOnZCNZ7GmlkcCo8YEyg3lQyI94bLOeMIhUBlWAQP3nBBLEIhVIjGuuANF0SgJQ1UkdY0kC19QGm6A3snDy8OhUAFTB8/ZRAgQ0+8eNIggFAI1ROqGhbEQ3YcI0nDzV4UCg/snewYF6gGrWkgG9bpQnL4olAIVMej3z9uEMD3EmRKKIQKCtWNx5/7kYGAEYQK4ZPWE8LsUqGwY2ygGh793nHTXjCksC73a9983kDAgsNLVAqhwi9qX3nq+4Ih+N6BTCwOhTOGBKr34mbjCfQnBEGBEC6d/VYv+oNnjQ1ULxj+wZFnk4mtG5L2te9Pbti+2aDAJcJg57kfWUMIA4RCoKLCMV3h9js/tT25/PLVydq1azO9//83ezp55dx5A02l/PDVN51YAn1aHAo73ds9hgWqademNcn58+eTM2fO9m5ZemxmNjl++i2DDFAjC/tU22gCNXLNhsuj3O+Zt98RCAFqzkYTqJGJTWuj3O9zb5wzuAD1c3jJUHhg76RQCBW15fLLurc4xf+XVQkB6mh2yVB4qb8AVMPEpjXR7lulEKCWZlYKhYeNEVRPrPWEwfOvC4UANfTsSqEQqKBdkSqFz6sSAtTVitPHjxsjEAjn2XUMUFuHVwqFQMWYOgZgCCtWCjvGCKolViuawCYTgHo6sHdSpRDqJGYrmlPnzvcaVwNQOxd1mxm7RGrsGCeojpitaEwdA9TW4RVDIVAtMdcT2mQCUFsrVwpTHWMF1RBz57F2NAC1daTfUOhUE2h4IAxrCVUKAWqr70rhEWMF5Rd16viMQAhQY32vKZwxVlB+MVvR2GQCUGszQiHURMxWNIH+hAD1dWDvZN+h8LDhgnKL2YomUCkEqK1L5ryxJdKjjSZQclrRADCk2b5DYapjzKC8tKIBYEiPDxoKVQuhgYGwFwpNHQPU2cygoVBbGiipmFPHwfHTbxtkAKHwAptNoKRitqI5de589yYUAtRY/xtNlkuRQLFit6IxdQxQa7NLbShe8pWl+w9UCqGEYreisfMYoNaWzHdjw/5DoBix1xPaeQwgFF7KjLGDcom58/jM2++oFALU27PDhkI7kKEhgTA4fkYgBKg508dQB9Gnjm0yARAKlzBj7KA8YraiCZ6znhCgzmaXO8p42VBoBzKUR+xWNIFKIUCtLZvr+nmF6RhDKJ5WNACM6PFRQ+GMMYTiaUUDwIhmRg2FdiBDCUTfeey8Y4C6G3n62LpCqHkgDKwnBKi3lfaKjPVxBx3DCMWKPXV86tz57k2lEKDGVsxz/W5lVC2EAsVuRWOTCUDtrZjl+g2FM8YSiqEVDQAZWHGPSL+vNI8bSyjGRB7rCe08Bqi7zCqFpo+hILHXEwamjwHqrZ8DScb6vKOO4YRixN55rEoIUHt95bhBFiqpFkLNAmEvFFpPCFB3fWU4oRBKLI+p4+dUCgHqrq+9IWNZ3yGQnditaALrCQFqT6UQqiyPVjQhEJ55+x2DDVBfswf2Ts5kGgrTXSuzxhbyoRUNABno9PsXBy1DqBZCTvJpReNoO4Ca63v531isOwZGY+cxABnou6A3aCjsGFuoRyA8de5896ZSCFBng/SaHot1x8DwnGICQAYGym1jsT8BMLg8WtGYOgaovYGW/a0e4hOEuem2cYY48mhFE/zU+Npk1+Y1BpzKCVXuU2fPJ8dePWsJBCyvEzsUhtR5l3GGOPJoRRNsX7faYFNJ11wxt7ziFz6woddW6a9efkPlGy5h0GV/po+hbC94OawnhDoFxH+6c0ty645NydrLVhkQGCGvDRwKu6kzNLDWrxAi2bXJlC4MKiyHCOFQMIQLBm4jOOzCpUeMNQiEUCZhSUSoGAI9nbxCYcdYQ/ZMHcPob6x+anydgaDxhmkjOJbXJwJWlkcrGqi7n73yCoNA0w2V08by/oTApYUKRx6taKDuwveRpRg03FDL/Mby/oTApZk6Bt9PkJFO3qGwY8whO/oGgu8nyMDsgb2TQ3WJGToUpp9wxthDNjZffplBgIysHdOahsY6OOw/HHUBU8fYA1C6UHiZ9bk01uPD/sNRv2usK4SMvOIMV/D9BKNTKYSqO3X2vEEA308wisPpyXP5h8L0EwuGkIHn3zhnEMD3E4xipBncsaIfADDn6KtnkjNvv2MgYETh+yh8P0EDHRzlH48V/QCAd1/I/ubEmwYCRhS+j7zBooFmhm1Fk1ko7D6Ame6Hw64FjO6vXn4jOX76LQMBQwrfP+H7CBpo5CJdVnv2O64FZOOPnz0lGMKQgTB8/0BDPT7qHWQVCr/qWkA2wrSXYAjDBULTxjRUOMWkHJVCp5tA9sHwq9+fTb7+8hte5GCF75XwfRK+X3yv0GCZ7O9YnfEDust1geyEtVHhtmvTmmRi09pky5rsTml4+7VXkvOvnUpOnz6dvPji3/d+b+vW8e5ta7Jqzdpk9bbtLgADeevE8eSds2eSkydPdm9zrdJ27Phgsm7dumRs45bkso2bM/tcoQ/hsVfPJEdfPWvgIaNOMJkdDrn/0PSe7oenXRcop/Biffb5Y8nZ544l5156vvfrlVz+gWuSNddM9G5jGb6gUw/nu28ses+p7u3cPzy/8gtO983G5Vd1n1PXzj2nwq+BkYWp462lCoVpMPxB90PL9YFyvXC/ceTryZnvfXOk+wkBcf3uz/Re1Gm28KbizSN/3VcQXM7aj3w8uWL3z3rDAaOZ6obCO7O4o9UZPzBTyFASoRL4+jceGzkMXggC3QAQbr1w+Mmbk8vfd5VBbpgwPfzGU52Rw+C88NwMtxAON3z6FpVDGE5mh4hkXSk0hQwlEKbzXvur/9XXFPGwQoUnVA5phlAZDBXnWEIg3Phzn+tNKwN9y2zqOPNQmAZDU8hQoBAGs6oOruSy7VcnW37hdhWeGgtvLF7tPJJZdXAlq1vXJ1s++08MPPQns6njYCzCA3TsHTQgEAZvH38heeXQf4takaTYQBiub16BMHhr5ru95zHQl0eyvLMYoVAja2hAILzwIn7iePKj//FHydunndtcx0AYrm/ewvP4x3+hvgAryKRhddRQmDaydhYy5CjLDSWDOnf2bPL333kmOfaHB1yIGikqEPaez6+/ljz/9b9IXjj0Zy4ELG0q6zsci/RAVQshJ2FTyelv/21hgfD48ZeS8+fPJ2++9IIX8Rq9ySgyEJ748Y97///yk53k1HenXRDIKWvFCoXq/pCDMMVX1PqrhYFwXngRf+3ZYy5MhYUehEW9yVgYCOc999+/ZmkCXGwmnZktfyjsPtAZwRDiCy1CitjkcalAOO+FQ3/qwlT5OfWNTmkCYRAC4T/85aMuDLzXgzHudCziA37ENYN4wkklRVR0lguEQZhGPjH9hAtUQWFdahHTxksFwnmhAn321AkXCN4VpfAWLRQe2Ds51f0w67pBHG9++29KFwgvvIg/0XGBKqiINxkrBULPKbg4EKYzstUJhakp1w7iyHu3cb+BsBdYX3qhd6M6QoUw7yphv4EwUH2GC6LNxMYOhXYhQwRhx3GeawkHCYQXXsSPeBH3JiObQBiEtYV2IkOvN+FUJUOhnoUQKaTleMLEMIEweO3Zoy5Uhbz10g9LGwjffU7Z2U7jTcW887EcvoAHXUOo5gv4sIEwCNPHWolUQ6g65zV1PGwg9EYD4meqPEJh2CFjwwlkGQpzeAEfJRAuDIZU4Pl0svyB0PMJkk6sDSa5hcLuFxAC4ZRrCdkIrWiqEAiDs6d+7IJ5TmUSCN99TmlNQ2NFn3kdq8sXAk3x9uunKhEIey/gs17AhcLsAqHnFA0WTjCJfihILqEwLXd2XFMotywDIWQdCKHBcunmMpbjF6RaCAIhAiEwuAdqFQrTsueM6woCIQIh0LepdH9GfUJh6j7XFkZz2YYtlQmEa8a3uWBVcMXGygRCzykaKLfslHco1J4GRv2m3bi5EoGw9wK+5X0uWAWs3jxeiUA495wSCmmU6G1oCguFafnT2kIY0eUfuKb0gTDYuHPCxarC8+mqazK5n9iBcOPOXS4WTZPrDOtYAV/gA64xjOayrVeWPhCuv+pqF6pCVm/bXupA6DlFA4U2NJ1ah0LNrCGDULh9+BfHvDaVqOpUy6r3faDUgXDuOaXyTKPkvg9jrClfKNTJup0/kbyz+vLSBsLgypvaLlSFbLzhplIHwsvWrU+2XD/pQtEUoUo41YhQmC6anHLNYXgbPv7p0gbCUCW0IaBawgamQdeq5tl25sobvcmgUQopno017QuGulj30Z9OVq1ZW7pAGHzgs7e6QBW0fvdnShkIQ5VQKKRBZouoEhYaCtNq4UHXHoYTAuH6j36ydIEwVAmt/aqmsAu5n2ph3o2pQyAMwRAaorAuLWNN/cKhDtZcv2fZvoVFnFRy9d47XJgKW//Jm0sVCEOzalVCGiRsxi2sS0uhoTDdat3xHIDhhOrJFZ/ZW5pAGKaNtQ2ptsvfd1Wy7oafKUUgDK79pV9TJaRJHszrSLvShcLU3Z4DMLy1H9yZrPn4jYUHwjBtbC1hPWz4xM8lq97/wcIDYXg+WYpAgxRaJSxFKOwm4sOJncgwkk2f/EfJ2o98vLBAGKqD1/3Kb7gQNbL1H3/hQkPrIgLhtt03eZNB0xRaJSxFKEzZiQwj2vhzn0vGrt1VSCCc+PX9pvhqJmxk2rz3V5Mza64oJBBe+0tfdBFoktCX8N6iH0QpQqG+hZCNre1fTrb//C/m9vlCM2GBsN7B8Krb9uXaNDpUBwVCGqgUxbFVZRmN/YemW90PP/C8gNG99uyx5Ad/8p+Tt0+/Ge1zhF3GdoU2x8tPdpIXDv1ZtPsPbyyu+5V/Zg0hTRSqhNcJhRcHw3u7H+7x/IDRhUD4D3/5aO/FPEthQ8m1v/xFJ5Y00NlTJ5Ln/vxr3TcdRzO93/DmIlQIVZxpqNu7obAUfZvLFgrHk7lq4bjnCGT3Qh7C4anvTo9UOQzrvLZN3qSSQ68SfWL6ieTEkSeGvo/5s4xDGPQGgwbrdAPhLWV5MKvKNjqqhRBPCIan/u6ZXqXn7OyJFV+0Q1Vwy/U3JFt+YlIVh4uENxmn/q77nPru3HNqpTcdoRF17zn1Ezfkuk4RSuyWtGezULhMMAzVwpbnCsQVKj6XEnYUC4EMExLffOmFS/6ZCjNc5GA3EN5epge0uqQDFRpaP+z5AnF5oSZLc9VlzykYIOuUylgZRyldcNnxfAEAaui+tB2fUFjVBA0AMKIQBh8o4wMrbShMj797wHMHAKiR+4o+zq5yoXB+4JK5A6IBAKoutKCZKuuDK3UoTJO0aWQAoA7uLPODK3ulMEkTdcfzCACosFJuLqlUKKxCsgYAWEYIg6XfJ1GJUJgm6/s8pwCACrqzrJtLFlpVpRHdf2j66e6HPZ5bAEBFlO7kkqWMVWxgTSMDAFUxW6XsUqlQqHchAFAhlZg2rmQoTIW1hYc9zwCAEjuYHttbGZULhWniNo0MAJRVJbNKFSuF89PIdiMDAGVUqWnjeauqPOJ2IwMAJTPVDYSVnNEcq/jAh0F3NjIAUAYzSYWP5610KDSNDACUyO1VnDauRShMg2FoUXPQ8xAAKNB9abGqssZqciHCNPKM5yMAUIBONxDeW/UvohahMC3V3u45CQDkrDYZpC6Vwvn1hXd7bgIAOar0OsJahsI0GFpfCADkJawj7NTlixmr4QUK6wsdgwcAxHSwDusIax0KFxyDp38hABDD4aSGR+7WsVI4v77Q+cgAQNZ6xae6rCOsfShMg2FYW6ixNQCQpTur3o+wcaEwDYb3dj9Mef4CABm4Ly061dJYAy5gaFNj4wkAMIqpum0saVwoTOf8b0lsPAEAhtOIXshNqBQKhgDAsGZChqjjxpJGhsI0GNqRDAAMoneEXRMCYbCqaVd3/6Hpfd0PD3meAwAr+ERddxpfyljTrm734k4lWtUAAMu7s0mBMFjV1Cu9/9B0qBbu85wHAC4RCKea9kWPNfVqdy92WF845XkPACxwdxMDYbCq6VdexRAASE2lRaNGWuX694Lh090Pe4wEAAiETTXmOdATehg69QQABMLGUilM7T80Pd798FiiYggAAqFQKBgKhgAgEAqFCIYAIBA2kjWFiyw4J/mg0QAAgbApVAqXoV0NAAiETaFSuAwNrgGgVu4WCJemUtgHFUMAqLw7m3pSiVCYfTAMofAhIwEAAqFQKBgKhgBQHb3No91A6IAKoTBKMAytakLLmnGjAQClNdO93S4QCoV5BMOHu7eW0QCA0glB8Ja0zRx9svt4COm7jk8kzksGgLKZEgiHo1I4IjuTAaA07uuGwXsNg1BYZDC8q/vhfiMBAIUIVcG77TAWCssSDNvJ3DpDG1AAID8ziQ0lQmEJg2ErDYZ7jAYARNdJA6H1g0JhacOhdYYAEJf1g0JhZYJhCIVhnaHpZADITqgKhupgx1AIhVUKhmEaOVQNTScDwOg6ieliobDi4TBUDO8yEgAwNNPFQmFtguFtyVzV0HQyAPRvpnu703RxfE40yUn3yXyw++G67u2g0QCAvkx1b58QCPOhUliAtNn1PYmqIQBcSlgzeGdaUEEorH0wbCVz08ltowEAFxxMA6HNJEJh48KhqiEAqA4KhVyoGoYdyrcZDQAaSHVQKGRROLRDGYAmmUnsLC4Nu49LZMEO5QeMBgA1d19iZ3GpqBSWlNNQAKipEALv7obBw4ZCKGSwcLgvcYYyANU3k8ydSjJlKIRChg+GIRCGHcqOygOgisJU8QM2kgiFZBcOW4nehgBUR1grH6aKZwyFUEiccBhCYZhStt4QgDLqJHNTxR1DIRSSTzjcl8xNK7eMBgAlMJPMVQY1oBYKEQ4BaGgYtIlEKKQkwTBsRgkbUX4rsVMZgHzMpmFQf12hEOEQgIaGwQcTO4qFQioVDr+cmFYGIBszaRicEgaFQqoZEPcl1hwCMFoYtGZQKKRm4TBMK2tlA0A/wlF0DwqDQiH1DYftZK5y2DYaAFxCJ9FnUCikUeGwlYbD2xKbUgCaLqwRPJiGwRnDIRTSzHAYAuG+ZG5quWVEABolBECbRxAKuSggttNweJvRAKi1UBX8qtNHEApZKRy2krnqoZY2APUxE4JgMlcVnDEcCIUMGhBD1fDzaUgEoHpUBREKyTQchrWHISBqawNQfqGdzHxV0FpBhEKiBcRWYnoZoGxmkrmq4IOmhxEKKSIg7knD4W0CIkDuZhcEwcOGA6EQARGgeUHwEesEEQoREAGaZSaZO2lEEEQopPIBcX4Xs00qAP0Hwfmdw6aGEQqpXUBsJXPnLn8+0SQbYLFO9/ZICIM2iyAU0rSQGILhzWlQVEUEmmZmQRDsaB+DUAjJe6qIISSGsDhuVICamU1D4OOJaiBCIfQdEvcsCIltIRGoqPkQGCqBHcOBUAhCIiAEglAIkULingUhsWVUgJzNJHNHys2HQLuEEQqhBCFxPA2J7TQohv9XTQSy1FkQAg9bE4hQCNUJiq00JO5eEBgB+nF4UQBUBUQohBoGxYVTzyqKQCcNgEcEQIRCaHZQHF8QFENVMQTHtpGB2glhb2Y+/CWmgEEohD7DYmtBQNyZ/r/KIpRfJ5nrCTgf/mZU/0AohBhhcb6yOB8ad6dBsW10IDeH0+D3ePpxPvzNGBoQCqFMgXH+484F4bFlhKBvswuC3xHBD4RCqFtonA+H86ExuDn9aGqaJpkPfCHgPbswBJrqBaEQeG9wDNrpx50Lfk94pAphL3g8/TiT3hKnfIBQCMQJkO0Fv1z4/7sXBMeFIRMG1VkU+E4tDnqJKV0QCoFKBsnFlcb2or+yO7m4Etk2cpU0PyWbLBHsFoc7AQ+EQoCRw+W8VrJ8ZfLmPj9F3abJF4ev5YLckWX+fOH07Ht+vxvmZj0zgUH9fwEGALzfBeONdtbQAAAAAElFTkSuQmCC',
              width: 150,
            },
            [
              {
                text: 'Receipt',
                color: '#333333',
                width: '*',
                fontSize: 28,
                bold: true,
                alignment: 'right',
                margin: [0, 0, 0, 15],
              },
              {
                stack: [
                  {
                    columns: [
                      {
                        text: 'Date Issued',
                        color: '#aaaaab',
                        bold: true,
                        width: '*',
                        fontSize: 12,
                        alignment: 'right',
                      },
                      {
                        text: '' + info.createdAt.toDate(),
                        bold: true,
                        color: '#333333',
                        fontSize: 12,
                        alignment: 'right',
                        width: 100,
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Status',
                        color: '#aaaaab',
                        bold: true,
                        fontSize: 12,
                        alignment: 'right',
                        width: '*',
                      },
                      {
                        text: info.status,
                        bold: true,
                        fontSize: 14,
                        alignment: 'right',
                        color: 'green',
                        width: 100,
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        {
          columns: [
            {
              text: 'From',
              color: '#aaaaab',
              bold: true,
              fontSize: 14,
              alignment: 'left',
              margin: [0, 20, 0, 5],
            },
            {
              text: 'To',
              color: '#aaaaab',
              bold: true,
              fontSize: 14,
              alignment: 'left',
              margin: [0, 20, 0, 5],
            },
          ],
        },
        {
          columns: [
            {
              text: 'SMT Traders',
              bold: true,
              color: '#333333',
              alignment: 'left',
            },
            {
              text: info.userName,
              bold: true,
              color: '#333333',
              alignment: 'left',
            },
          ],
        },
        {
          columns: [
            {
              text: 'Address',
              color: '#aaaaab',
              bold: true,
              margin: [0, 7, 0, 3],
            },
            {
              text: 'Address',
              color: '#aaaaab',
              bold: true,
              margin: [0, 7, 0, 3],
            },
          ],
        },
        {
          columns: [
            {
              text: '036, Green Downtown, Ostwal, Bandra',
              style: 'invoiceBillingAddress',
            },
            {
              text: info.address,
              style: 'invoiceBillingAddress',
            },
          ],
        },
        '\n\n',
        {
          width: '100%',
          alignment: 'center',
          text: 'Invoice No. #' + orderId,
          bold: true,
          margin: [0, 10, 0, 10],
          fontSize: 15,
        },
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function (i: any, node: any) {
              return 1;
            },
            vLineWidth: function (i: any, node: any) {
              return 1;
            },
            hLineColor: function (i: number, node: any) {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: function (i: any, node: any) {
              return '#eaeaea';
            },
            hLineStyle: function (i: any, node: any) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function (i: any, node: any) {
              return 10;
            },
            paddingRight: function (i: any, node: any) {
              return 10;
            },
            paddingTop: function (i: any, node: any) {
              return 2;
            },
            paddingBottom: function (i: any, node: any) {
              return 2;
            },
            fillColor: function (rowIndex: any, node: any, columnIndex: any) {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['*', 80,80,80],
            body: [
              [
                {
                  text: 'PRODUCT NAME',
                  fillColor: '#eaf2f5',
                  border: [false, true, false, true],
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'PRICE',
                  border: [false, true, false, true],
                  alignment: 'center',
                  fillColor: '#eaf2f5',
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'QUANTITY',
                  border: [false, true, false, true],
                  alignment: 'right',
                  fillColor: '#eaf2f5',
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'TOTAL',
                  border: [false, true, false, true],
                  alignment: 'right',
                  fillColor: '#eaf2f5',
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
              ],
             
              [
                {
                  text: productNames,
                  border: [false, false, false, true],
                  margin: [0, 5, 0, 5],
                  alignment: 'left',
                },
                {
                  text: productPrice,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  alignment: 'center',
                  margin: [0, 5, 0, 5],
                },
                {
                  text: productQuantity,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  alignment: 'center',
                  margin: [0, 5, 0, 5],
                },
                {
                  text: value,
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
              ],
            ],
          },
        },
        // '\n',
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function (i: any, node: any) {
              return 1;
            },
            vLineWidth: function (i: any, node: any) {
              return 1;
            },
            hLineColor: function (i: any, node: any) {
              return '#eaeaea';
            },
            vLineColor: function (i: any, node: any) {
              return '#eaeaea';
            },
            hLineStyle: function (i: any, node: any) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function (i: any, node: any) {
              return 10;
            },
            paddingRight: function (i: any, node: any) {
              return 10;
            },
            paddingTop: function (i: any, node: any) {
              return 3;
            },
            paddingBottom: function (i: any, node: any) {
              return 3;
            },
            fillColor: function (rowIndex: any, node: any, columnIndex: any) {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['*', 'auto'],
            body: [
              [
                {
                  text: 'Total Amount:',
                  bold: true,
                  fontSize: 15,
                  alignment: 'right',
                  border: [false, false, false, true],
                  margin: [0, 5, 0, 5],
                },
                {
                  text: '₹' + info.totalAmount,
                  bold: true,
                  fontSize: 15,
                  alignment: 'right',
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  margin: [0, 5, 0, 5],
                },
              ],
            ],
          },
        },
        '\n\n',
        {
          text: 'NOTES',
          style: 'notesTitle',
        },
        {
          text: 'Some notes goes here \n Notes second line',
          style: 'notesText',
        },
      ],
      styles: {
        notesTitle: {
          fontSize: 10,
          bold: true,
          margin: [0, 50, 0, 3],
        },
        notesText: {
          fontSize: 10,
        },
      },
      defaultStyle: {
        columnGap: 20,
        //font: 'Quicksand',
      },
    };
  }
}
