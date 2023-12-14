import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import {ShareModule} from "../../share/share.module";
import { BlogComponent } from './blog/blog.component';
import { ArticlePageComponent } from './article-page/article-page.component';


@NgModule({
  declarations: [
    BlogComponent,
    ArticlePageComponent
  ],
  imports: [
    CommonModule,
    ShareModule,
    ArticleRoutingModule
  ]
})
export class ArticleModule { }
