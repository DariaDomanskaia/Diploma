import { Component } from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  customOptions: OwlOptions = {
    items: 1,
    loop: true,
    autoplay: true,
    autoplaySpeed: 1200,
    autoplayTimeout: 3000,
    autoWidth: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 1200,
    navText: ['', ''],
    responsive: {
      0: {

      },
      400: {

      },
      800: {

      }
    },
    nav: false
  }

  banners = [
    {
      image: '1.png'
    },
    {
      image: '2.png'
    },
    {
      image: '3.png'
    }
  ];
}
