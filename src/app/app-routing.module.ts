import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./share/layout/layout.component";
import {MainComponent} from "./views/main/main.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: MainComponent},
      {path: '', loadChildren: () => import('./views/user/user.module').then(m => m.UserModule)},
      {path: '', loadChildren: () => import('./views/article/article.module').then(m => m.ArticleModule)},
      /*{path: '', loadChildren: () => import('./views/order/order.module').then(m => m.OrderModule)},
      {path: '', loadChildren: () => import('./views/personal/personal.module').then(m => m.PersonalModule), canActivate: [authGuard]}*/
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
