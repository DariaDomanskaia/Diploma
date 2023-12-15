import {Component, inject} from '@angular/core';
import {CategoryType} from "../../../../types/category.type";
import {CategoryService} from "../../../share/services/category.service";
import {debounceTime} from "rxjs";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActivatedRoute} from "@angular/router";
import {ActiveParamsUtil} from "../../../share/utils/active-params.util";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {

  categoryService = inject(CategoryService);
  activatedRoute = inject(ActivatedRoute);

  pages: number[] = [];
  nullResult: boolean = false;
  categories: CategoryType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];


  processCatalog() {
    this.categoryService.getCategories()
      .pipe(
        debounceTime(500)
      )
      .subscribe(data => {
        this.categories = data;
        this.activatedRoute.queryParams.subscribe(params => {
          this.activeParams = ActiveParamsUtil.processParams(params);
        })
      });

  }

}
