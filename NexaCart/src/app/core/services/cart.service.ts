import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'https://localhost:7053/api/Cart';

  private cartCountSubject = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCountSubject.asObservable();


  constructor(
    private http: HttpClient
  ) { }


  addToCart(request: any): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/add`,
      request
    );

  }



  getCart(userId:number): Observable<any>{

    return this.http.get<any>(
      `${this.apiUrl}/${userId}`
    );

  }



  loadCartCount(userId:number){

    this.getCart(userId)
    .subscribe({

      next:(items:any)=>{

        const count = items.items.length

        this.cartCountSubject.next(count);

      },

      error:(err)=>{

        console.error("Cart count error",err);

        this.cartCountSubject.next(0);

      }

    });

  }



  removeFromCart(cartItemId:number){

    return this.http.delete(
      `${this.apiUrl}/${cartItemId}`
    );

  }

}