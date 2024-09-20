import {Injectable} from '@angular/core';
import {distinctUntilChanged, map, Observable} from "rxjs";
import {Recipe} from "../domain/recipe";
import {CsvRepository} from "./csv.repository";

function containsAny(array: Recipe[], toFilter: string[]) {
  if (toFilter && toFilter.length > 0) {
    return array.filter(elt => {
      const toFind = elt.ingredients?.toLowerCase().split(',') || [];
      return toFilter.some(i => toFind.includes(i));
    });
  } else {
    return array;
  }
}

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  public recipes$: Observable<Recipe[]>;

  constructor(private csvRepository: CsvRepository) {
    this.recipes$ = this.csvRepository.loadRecipesFromCSV<Recipe>('/assets/data/recipes.csv').pipe(
      map(resp => resp.filter(elt => elt.ingredients)) // filter out empty recipes
    );
  }

  getFilteredRecipes(ingredients: string[]): Observable<Recipe[]> {
    return this.recipes$.pipe(
      distinctUntilChanged(),
      map(result => {
        return containsAny(result, ingredients);
      })
    );
  }
}
