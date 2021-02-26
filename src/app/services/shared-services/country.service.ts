import { Injectable } from '@angular/core';
import * as country from './../../../assets/country.json';
@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private country: any;

  constructor() {
    this.country = country;
  }

  getCountry() {
    return this.country.default;
  }

  getStates() {
    return this.country.default.states;
  }

  getCities(name: string) {
    const state = this.country.default.states.find((curState: any) => curState.name === name);
    if (state) {
      return state.cities;
    }
    return [];
  }
}
