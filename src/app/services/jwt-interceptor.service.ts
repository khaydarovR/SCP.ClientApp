import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt = localStorage.getItem("jwt");

    if (jwt) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization", jwt)
      });

      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}
