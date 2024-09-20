import {Injectable} from '@angular/core';
import {distinctUntilChanged, map, Observable} from "rxjs";
import {CsvRepository} from "./csv.repository";
import {Restaurant} from "../domain/restaurant";

function containsAny(array: Restaurant[], toFilter: string[]) {
  if (toFilter && toFilter.length > 0) {
    return array.filter(elt => {
      const toFind = elt.classification?.toLowerCase().split(',') || [];
      return toFilter.some(i => toFind.includes(i));
    });
  } else {
    return array;
  }
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  public restaurants$: Observable<Restaurant[]>;

  constructor(private csvRepository: CsvRepository) {
    this.restaurants$ = this.csvRepository.loadRecipesFromCSV<Restaurant>('/assets/data/restaurants.csv').pipe(
      map(resp => resp.filter(elt => elt.location)) // filter out empty recipes
    );
  }

  getFilteredRestaurants(type: string[]): Observable<Restaurant[]> {
    return this.restaurants$.pipe(
      distinctUntilChanged(),
      map(result => {
        return containsAny(result, type);
      })
    );
  }
}
