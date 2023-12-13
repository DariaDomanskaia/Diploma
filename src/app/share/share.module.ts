import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {ArticleCardComponent} from './components/article-card/article-card.component';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ArticleCardComponent
  ],
  exports: [
    ArticleCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ]
})
export class ShareModule {
}
