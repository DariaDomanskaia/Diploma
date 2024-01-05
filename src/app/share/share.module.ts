import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {ArticleCardComponent} from './components/article-card/article-card.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ModalComponent } from './components/modal/modal.component';
import { CommentComponent } from './components/comment/comment.component';
import { ReduceDatePipe } from './pipes/reduce-date.pipe';



@NgModule({
  declarations: [
    ArticleCardComponent,
    ModalComponent,
    CommentComponent,
    ReduceDatePipe
  ],
  exports: [
    ArticleCardComponent,
    ModalComponent,
    CommentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

  ]
})
export class ShareModule {
}
