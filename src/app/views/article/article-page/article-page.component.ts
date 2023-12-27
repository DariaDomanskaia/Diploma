import {Component, inject, OnInit} from '@angular/core';
import {ArticleService} from "../../../share/services/article.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleType} from "../../../../types/article.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentsService} from "../../../share/services/comments.service";
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss']
})
export class ArticlePageComponent implements OnInit {

  router = inject(Router);
  activatedRout = inject(ActivatedRoute);
  articleService = inject(ArticleService);
  authService = inject(AuthService);
  commentsService = inject(CommentsService);
  fb = inject(FormBuilder);
  _snackBar = inject(MatSnackBar);
  serverStaticPath: string = environment.serverStaticPath;

  article!: ArticleType;
  relatedArticles: ArticleType[] = [];
  commentsCount: number = 3;
  isLogged: boolean = false;
  commentForm = this.fb.group({
    comment: ['', Validators.required]
  });


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

  getComments(countOfComments: number = this.commentsCount, articleId: string) {
    this.commentsService.getComments(countOfComments, articleId)
      .subscribe(comments => {
        this.article.commentsCount = comments.allCount;
        console.log(comments.comments);
        this.article.comments = comments.comments;
      })
  }


  sendComment() {
    if (this.commentForm.valid && this.article.id && this.commentForm.value.comment) {
      this.commentsService.addComment(this.commentForm.value.comment, this.article.id)
        .subscribe(response => {
          if (response.error) {
            throw new Error(response.message);
          }
          this._snackBar.open(response.message);
          this.commentForm.reset();
          this.getComments(3, this.article.id);
        });
    }
  }

  getReactions() {

  }
}
