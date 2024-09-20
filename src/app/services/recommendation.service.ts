import {Injectable} from '@angular/core';
import {RecipesService} from "./recipes.service";
import {map, Observable, of, Subject} from "rxjs";
import {shuffle} from "../shared/utils";
import {RestaurantService} from "./restaurant.service";
import {Recommendations} from "../domain/recommendations";
import {Restaurant} from "../domain/restaurant";
import {Recipe} from "../domain/recipe";

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  private history: any[] = []; // Restaurant or Recipe

  constructor(
    private recipeService: RecipesService,
    private restaurantService: RestaurantService) {
  }

  getRecommendation(type: string, id: string): Observable<Recipe | Restaurant>{
    return (type == 'recipe')
      ? this.recipeService.recipes$.pipe(
        map(recommendation => recommendation.find(it => it.id === id))) as Observable<Recipe | Restaurant>
      : this.restaurantService.restaurants$.pipe(
        map(recommendation => recommendation.find(it => it.id === id)))  as Observable<Recipe | Restaurant>;
  }

  recommendRecipes(filter: string[], limit?: number): Observable<Recommendations> {
    if (filter.length > 0 && filter[0] === 'showAll') {
      return this.recipeService.recipes$.pipe(
        map(recommendations => ({ recipes: recommendations } as Recommendations))
      );
    }
    return this.recipeService.getFilteredRecipes(filter).pipe(
      map(recommendations => shuffle(recommendations).slice(0, limit)), // TODO: define operator
      map(recommendations => ({ recipes: recommendations } as Recommendations))
    );
  }

  recommendRestaurants(filter: string[], limit: number): Observable<Recommendations> {
    if (filter.length > 0 && filter[0] === 'showAll') {
      return this.restaurantService.restaurants$.pipe(
        map(restaurants => ({ restaurants: restaurants } as Recommendations))
      );
    }
    return this.restaurantService.getFilteredRestaurants(filter).pipe(
      map(recommendations => shuffle(recommendations).slice(0, limit)),
      map(recommendations => ({ restaurants: recommendations } as Recommendations))
    );
  }

  saveHistory(item: any) {
    this.history.push(item);
  }

  getHistory(): any[] {
    return this.history;
  }
}
