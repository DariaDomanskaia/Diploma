import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommentType} from "../../../../types/comment.type";
import {CommentReactionsType} from "../../../../types/comment-reactions.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CommentsService} from "../../services/comments.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {throwToolbarMixedModesError} from "@angular/material/toolbar";

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {

  @Input() comment!: CommentType;

  @Output() onCountChange: EventEmitter<CommentReactionsType[]> = new EventEmitter<CommentReactionsType[]>();

  commentsService = inject(CommentsService);
  _snackBar = inject(MatSnackBar);

  isLike: boolean = false;
  isDislike: boolean = false;
  reaction: CommentReactionsType[] = [];



  addReactions(commentId: string, actionName: string){
    this.commentsService.applyActions(commentId, actionName)
      .subscribe({
        next: (response) => {
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
              if (!!reaction[0].action){
                switch (reaction[0].action) {
                  case 'like': this.comment.isChecked = 'like'
                    break;
                  case 'dislike': this.comment.isChecked = 'dislike'
                    break;
                }
              }
              this.onCountChange.emit(reaction);
            });
        },
        error: (data) => {
          this._snackBar.open(data.error.message);
        }
        }

      );
  }
}
