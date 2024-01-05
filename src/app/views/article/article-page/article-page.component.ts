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
import {UserInfoType} from "../../../../types/user-info.type";
import {CommentReactionsType} from "../../../../types/comment-reactions.type";

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
  userActionsForComments: CommentReactionsType[] = [];


  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();
    this.activatedRout.params.subscribe(param => {
      this.articleService.getArticle(param['url'])
        .subscribe((data: ArticleType) => {
          this.article = data;
          console.log(this.article.comments);
          console.log(this.article);
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
        });
      this.commentsService.getUserReactionsForComments(this.article.id)
        .subscribe((commentsData: CommentReactionsType[] | DefaultResponseType) => {
          if ((commentsData as DefaultResponseType).error !== undefined) {
            throw new Error(((commentsData as DefaultResponseType).message));
          }
          const commentsDataResponse = commentsData as CommentReactionsType[];
          if (commentsDataResponse) {
            this.userActionsForComments = commentsDataResponse;
          }
        })
    });
  }


  getComments(articleId: string) {
    this.commentsService.getComments(this.commentsCount, articleId)
      .subscribe(comments => {
        if (comments.comments.length > 0) {
          for (let i = 0; i < comments.comments.length; i++) {
            this.article.comments?.push(comments.comments[i]);
          }
          this.commentsCount += 10;

        }

      });
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
          this.articleService.getArticle(this.article.url)
            .subscribe((data: ArticleType) => {
              this.article = data;
            });
        });
    }
  }

  getReactions() {

  }

  updateCount(reaction: CommentReactionsType[]) {
    if (reaction) {
      this.article.comments?.forEach(item => {
        if (item.id === reaction[0].comment) {
          if (reaction[0].action === 'like') {
            item.likesCount++;
          } else if (reaction[0].action === 'dislike') {
            item.dislikesCount++;
          }
        }
      });
    }
  }

  /*addReactions(commentId: string, actionName: string){
    this.commentsService.applyActions(commentId, actionName)
      .subscribe(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        this._snackBar.open('Спасибо, ваш голос учтён!');
        this.commentsService.getReactionsForComment(commentId)
          .subscribe((data: CommentReactionsType[] | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }
            const reaction = data as CommentReactionsType[];

          });
      });
  }*/
}
