import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.css'],
})
export class SlidesComponent implements OnInit {

  constructor() { }

  ngOnInit() {}
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
}
