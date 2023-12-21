import {Component, inject, OnInit} from '@angular/core';
import {ArticleService} from "../../../share/services/article.service";
import {ActivatedRoute} from "@angular/router";
import {ArticleType} from "../../../../types/article.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentsService} from "../../../share/services/comments.service";

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss']
})
export class ArticlePageComponent implements OnInit{

  activatedRout = inject(ActivatedRoute);
  articleService = inject(ArticleService);
  authService = inject(AuthService);
  commentsService = inject(CommentsService);
  serverStaticPath: string = environment.serverStaticPath;

  article!: ArticleType;
  relatedArticles: ArticleType[] = [];
  isLogged: boolean = false;



  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();
    this.activatedRout.params.subscribe(param => {
      this.articleService.getArticle(param['url'])
        .subscribe((data: ArticleType) => {
          this.article = data;

          this.articleService.getRelatedArticles(param['url'])
            .subscribe((articleData: ArticleType[] | DefaultResponseType) => {
              if ((articleData as DefaultResponseType).error !== undefined) {
                throw new Error(((articleData as DefaultResponseType).message));
              }

              const articleDataResponse = articleData as ArticleType[];
              if (articleDataResponse) {
                 this.relatedArticles = articleDataResponse;
              }

            });


          /*if (this.authService.getIsLoggedIn()) {

            this.favoriteService.getFavorites()
              .subscribe((data: FavoriteType[] | DefaultResponseType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  const error = (data as DefaultResponseType).message;
                  throw new Error(error);
                }
                const products = data as FavoriteType[];
                const currentProductExists = products.find(item => item.id === this.product.id);
                if (currentProductExists) {
                  this.product.isInFavorite = true;
                }
              });
          }*/
        });
    });
  }




}
