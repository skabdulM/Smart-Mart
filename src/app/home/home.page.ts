import { Component, OnInit } from '@angular/core';
import { BarcodeFormat } from 'angular-weblineindia-qrcode-scanner/library';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css'],
})
export class HomePage implements OnInit {
  constructor() {}
  allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX /*, ...*/ ];

  ngOnInit() {}
  
}
