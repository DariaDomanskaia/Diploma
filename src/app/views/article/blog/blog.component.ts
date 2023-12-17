import {Component, inject, OnInit} from '@angular/core';
import {CategoryType} from "../../../../types/category.type";
import {CategoryService} from "../../../share/services/category.service";
import {debounceTime} from "rxjs";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsUtil} from "../../../share/utils/active-params.util";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {ArticleService} from "../../../share/services/article.service";
import {ArticleType} from "../../../../types/article.type";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  categoryService = inject(CategoryService);
  activatedRoute = inject(ActivatedRoute);
  articleService = inject(ArticleService);
  router = inject(Router);

  pages: number[] = [];
  nullResult: boolean = false;
  categories: CategoryType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];
  articles: ArticleType[] = [];
  sortingOpen: boolean = false;


  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
      this.activeParams = ActiveParamsUtil.processParams(params);

      if (params['categories']) {
        this.activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
      }
      if (this.categories && this.categories.length > 0 &&
        this.categories.some(category => this.activeParams.categories.find(item => category.url === item))) {
      }

      this.processCatalog();
    });


  }

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

    this.appliedFilters = [];
    this.activeParams.categories.forEach(url => {
      for (let i = 0; i < this.categories.length; i++) {
        const foundCategory = (this.categories[i].url === url) ? this.categories[i] : null;
        if (foundCategory) {
          this.appliedFilters.push({
            name: foundCategory.name,
            urlParam: foundCategory.url
          });
        }
      }
    });
    this.articleService.getAllArticles(this.activeParams)
      .subscribe(data => {
        this.articles = data.items;
        this.pages = [];
        for (let i = 1; i <= data.pages; i++) {
          this.pages.push(i);
        }
        if (data.items.length === 0)
          this.nullResult = !this.nullResult;
      });
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.urlParam);
    this.activeParams.page = 1;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  toggleSorting(): void {
    this.sortingOpen = !this.sortingOpen;
  }


  updateFilterParams(url: string, checked: boolean) {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingTypeInParams = this.activeParams.categories.find(item => item === url);
      if (existingTypeInParams && !checked) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url)
      } else if (!existingTypeInParams && checked) {

        this.activeParams.categories = [...this.activeParams.categories, url];
      }
    } else if (checked) {
      this.activeParams.categories = [url];
    }

    this.activeParams.page = 1;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });

  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      });
    }

  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      });
    }
  }
}
