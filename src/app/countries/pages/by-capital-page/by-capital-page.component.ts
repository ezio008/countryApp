import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-by-capital-page',
  templateUrl: './by-capital-page.component.html',
  styles: [
  ]
})
export class ByCapitalPageComponent implements OnInit{

  public countries: Country[] = [];
  public initialValue: string = '';

  constructor(private countriesService: CountriesService) {}

  ngOnInit(): void {
    this.countries = this.countriesService.cacheStore.byCapital.countries;
    this.initialValue = this.countriesService.cacheStore.byCapital.term;
  }

  public isLoading: boolean = false;

  public onSearchCapital(terms: string): void {
    this.isLoading = true;
    this.countriesService.searchCapital(terms).subscribe((values) => {
      this.countries = values;
      this.isLoading = false;
    });
  }

}
