import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-thanking-page',
  templateUrl: './thanking-page.component.html',
  styleUrls: ['./thanking-page.component.css'],
})
export class ThankingPageComponent implements OnInit {
  constructor(public modalController: ModalController) {}
  @Input() name!: string;
  @Input() phone!: string;
  @Input() address!: string;
  @Input() email!: string;
  @Input() orderId!: string;
  img:any="/scr/assests/thumb.png"
  ngOnInit() {}
  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
