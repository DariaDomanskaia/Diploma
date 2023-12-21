import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AllCommentsType} from "../../../types/all-comments.type";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  http = inject(HttpClient);

  constructor() { }

  getComments(count: number, id: string): Observable<AllCommentsType> {
    return this.http.get<AllCommentsType>(environment.api + 'comments?offset=' + count + '&article=' + id);
  }
}
