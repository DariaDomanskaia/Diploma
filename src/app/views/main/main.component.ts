import {Component, inject, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleService} from "../../share/sarvices/article.service";
import {ArticleType} from "../../../types/article.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{

  articleService = inject(ArticleService);

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
  customOptionsRev: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
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
  reviews = [
    {
      name: 'Станислав',
      image: '1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: '2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: '3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
  ];

  articles: ArticleType[] = [];
  isLogged: boolean = false;

  ngOnInit(): void {
    this.articleService.getPopularArticles()
      .subscribe((data: ArticleType[]) => {
        this.articles = data;
      });
  }
}
