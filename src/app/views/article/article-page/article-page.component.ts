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
          this.getReactions();

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
          this.showReactionsForUser();
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
    this.commentsService.getUserReactionsForComments(this.article.id)
      .subscribe((commentsData: CommentReactionsType[] | DefaultResponseType) => {
        if ((commentsData as DefaultResponseType).error !== undefined) {
          throw new Error(((commentsData as DefaultResponseType).message));
        }
        const commentsDataResponse = commentsData as CommentReactionsType[];
        if (commentsDataResponse) {
          this.userActionsForComments = commentsDataResponse;
          this.showReactionsForUser();
        }
      });
  }

  updateCount(reaction: CommentReactionsType[]) {
    if (reaction) {
      this.userActionsForComments.forEach(item => {
        if (item.comment === reaction[0].comment) {
          if (item.action === 'like' && reaction[0].action === 'dislike') {
            this.article.comments?.forEach(comment => {
              if (comment.id === reaction[0].comment) {
                comment.likesCount --;
                comment.dislikesCount ++;
                this.getReactions();
              }
            });
          } else if (item.action === 'dislike' && reaction[0].action === 'like') {
            this.article.comments?.forEach(comment => {
              if (comment.id === reaction[0].comment) {
                comment.likesCount ++;
                comment.dislikesCount --;
                this.getReactions();
              }
            });
          }
        }
      });
    }
  }

  showReactionsForUser() {
    this.userActionsForComments.forEach(item => {
      if (this.article.comments) {
        for (let i = 0; i < this.article.comments?.length; i++) {
          if (item.comment === this.article.comments[i].id) {
            this.article.comments[i].isChecked = item.action;
          }
        }
      }
    });
  }
}
