import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country } from '../interfaces/country.interface';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';
import { CahceStore } from '../interfaces/cacheStore.interface';
import { Region } from '../interfaces/region.type';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  private apiUrl: string = 'https://restcountries.com/v3.1';

  public cacheStore: CahceStore = {
    byCapital: {term: '', countries: []},
    byCountry: {term: '', countries: []},
    byRegion: {region: undefined, countries: []},
  }

  constructor(private httpClient: HttpClient) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage() {
    if(!localStorage.getItem('cacheStore')) return;

    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);
  }

  private getCountriesRequest(url: string): Observable<Country[]> {
    return this.httpClient.get<Country[]>(url)
      .pipe(
        catchError(() => of([])),
        delay(200)
      );
  }

  public searchCountryByAlphaCode(alphaCode: string): Observable<Country | null> {
    let url = `${this.apiUrl}/alpha/${alphaCode}`;

    return this.httpClient.get<Country[]>(url).pipe(
      map(countries => countries.length > 0 ? countries[0] : null),
      catchError((_) => of(null))
      );
  }

  public searchCapital(term: string): Observable<Country[]> {
    let url = `${this.apiUrl}/capital/${term}`;

    return this.getCountriesRequest(url)
      .pipe(
        tap((countries) => this.cacheStore.byCapital = {term, countries}),
        tap(() => this.saveToLocalStorage())
      );
  }

  public searchCountry(term: string): Observable<Country[]> {
    let url = `${this.apiUrl}/name/${term}`;

    return this.getCountriesRequest(url)
      .pipe(
        tap((countries) => this.cacheStore.byCountry = {term, countries}),
        tap(() => this.saveToLocalStorage())
      );
  }

  public searchRegion(region: Region): Observable<Country[]> {
    let url = `${this.apiUrl}/region/${region}`;

    return this.getCountriesRequest(url)
      .pipe(
        tap((countries) => this.cacheStore.byRegion = {region, countries}),
        tap(() => this.saveToLocalStorage())
      );
  }

}
