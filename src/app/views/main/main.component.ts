import {Component, DoCheck, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleService} from "../../share/services/article.service";
import {ArticleType} from "../../../types/article.type";
import {FormBuilder, Validators} from "@angular/forms";
import {RequestsService} from "../../share/services/requests.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {CommentReactionsType} from "../../../types/comment-reactions.type";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @Input() isClose: boolean = false;
  @Output() activeParam: EventEmitter<string> = new EventEmitter<string>();

  articleService = inject(ArticleService);
  fb = inject(FormBuilder);
  requestService = inject(RequestsService);
  _snackBar = inject(MatSnackBar);
  activatedRoute = inject(ActivatedRoute);

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
      0: {},
      400: {},
      800: {}
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

  selectValues = {
    first: 'Создание сайтов',
    second: 'Продвижение',
    third: 'Реклама',
    fourth: 'Копирайтинг'
  };

  banners = [
    {
      image: '1.png',
      type: 'create'
    },
    {
      image: '2.png',
      type: 'promotion'
    },
    {
      image: '3.png',
      type: 'add'
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
  modalIsVisible: boolean = false;
  type: string = '';


  ngOnInit(): void {
    this.articleService.getPopularArticles()
      .subscribe((data: ArticleType[]) => {
        this.articles = data;
      });
  }

  showModal(type: string = ''): void {
    this.modalIsVisible = true;
    this.type = type;
  }

  changeVisible(value: boolean) {
    this.modalIsVisible = !value;
  }

  /*ngDoCheck(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        console.log(params)
      });
  }*/

}
