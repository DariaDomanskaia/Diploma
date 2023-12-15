import {Component, inject, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleService} from "../../share/services/article.service";
import {ArticleType} from "../../../types/article.type";
import {FormBuilder, Validators} from "@angular/forms";
import {RequestsService} from "../../share/services/requests.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  articleService = inject(ArticleService);
  fb = inject(FormBuilder);
  requestService = inject(RequestsService);
  _snackBar = inject(MatSnackBar);

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
  applicationForm = this.fb.group({
    service: [''],
    name: ['', [Validators.required, Validators.pattern(/^([А-Я][а-я]{3,}) ([А-Я][а-я]{3,})$/)]],
    phone: ['', [Validators.required, Validators.maxLength(11)]]
  });

  selectValues = {
    first: 'Создание сайтов',
    second: 'Продвижение',
    third: 'Реклама',
    fourth: 'Копирайтинг'
  };

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

  isApplicationForm: boolean = false;
  isThanksPage: boolean = false;

  articles: ArticleType[] = [];
  isLogged: boolean = false;

  ngOnInit(): void {
    this.articleService.getPopularArticles()
      .subscribe((data: ArticleType[]) => {
        this.articles = data;
      });
  }


  sendApplicationForm(): void {
    if (this.applicationForm.valid &&
      this.applicationForm.value.service &&
      this.applicationForm.value.name &&
      this.applicationForm.value.phone) {
      this.requestService.consultationRequest(this.applicationForm.value.name, this.applicationForm.value.phone, this.applicationForm.value.service, 'order')
        .subscribe((data: DefaultResponseType) => {
          if (!data.error) {
            this.isApplicationForm = false;
            this.isThanksPage = true;
          }
          this._snackBar.open(data.message);
        });
    }

  }

  showModal(): void {

    this.isApplicationForm = true;
  }

  closeModal(): void {
    this.isApplicationForm = false;
    this.isThanksPage = false;
  }
}
