import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car, PagedResult } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  private apiUrl = 'http://localhost:5000/api/cars';

  constructor(private http: HttpClient) {}

  getCars(
    search?: string,
    make?: string,
    minYear?: number,
    maxYear?: number,
    minPrice?: number,
    maxPrice?: number,
    page: number = 1,
    pageSize: number = 10
  ): Observable<PagedResult<Car>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) params = params.set('search', search);
    if (make) params = params.set('make', make);
    if (minYear) params = params.set('minYear', minYear.toString());
    if (maxYear) params = params.set('maxYear', maxYear.toString());
    if (minPrice) params = params.set('minPrice', minPrice.toString());
    if (maxPrice) params = params.set('maxPrice', maxPrice.toString());

    return this.http.get<PagedResult<Car>>(this.apiUrl, { params });
  }

  getCar(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`);
  }
}

