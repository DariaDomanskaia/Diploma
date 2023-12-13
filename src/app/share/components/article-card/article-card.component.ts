import {Component, Input} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {

  @Input() article!: ArticleType;

  serverStaticPath: string = environment.serverStaticPath;


  navigate() {
/*    if (this.isLight){
      this.router.navigate(['/product/' + this.product.url]);
    }*/
  }
}