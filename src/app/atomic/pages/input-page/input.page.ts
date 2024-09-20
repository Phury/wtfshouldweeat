import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {RecommendationService} from "../../../services/recommendation.service";
import {shuffle} from "../../../shared/utils";
import {Recipe} from "../../../domain/recipe";
import {Restaurant} from "../../../domain/restaurant";

function parseInput(str: string): string[] {
  return str.split(',')
    .map(element => element.trim())
    .filter(element => element);
}

@Component({
  selector: 'app-input-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './input.page.html',
  styleUrl: './input.page.css'
})
export class InputPage {

  recipeForm: FormGroup;

  recommendations: any[] = [];
  history: any[] = [];
  filter: any[] = [];
  choice: string = 'cooking';
  recommendationPrompt: string = '';
  filterPrompt: string = '';
  filterPlaceholder: string = '';
  somethingElse: string = '';
  insult: string = '';
  showDetails: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private recommendationService: RecommendationService
  ) {
    this.recipeForm = this.fb.group({
      choice: [''],
      ingredients: ['']
    });
    this.onSubmit();
  }

  setChoice(choice: string) {
    this.choice = choice;
    this.clearFilter();
    this.onSubmit();
  }

  onSubmit() {
    const formData = this.recipeForm.value;
    const filter= parseInput(formData.ingredients);

    const recommendations$ = (this.choice === 'restaurant')
      ? this.recommendationService.recommendRestaurants(filter, 1)
      : this.recommendationService.recommendRecipes(filter, 1);

    // TODO: currently always 1 recommendation
    if (this.recommendations[0]) {
      this.recommendationService.saveHistory(this.recommendations[0]);
    }

    recommendations$.subscribe(recommendations => {
      this.recommendations = recommendations!.recipes || recommendations!.restaurants || [];

      if (this.choice === 'restaurant') {
        this.recommendationPrompt = this.randomRestaurantPrompt();
        this.filterPlaceholder = 'e.g. asian, italian, burgers';
        this.somethingElse = this.randomRestaurantNext();
      } else {
        this.recommendationPrompt = this.randomCookingPrompt();
        this.filterPlaceholder = 'e.g. chicken, rice, tomato';
        this.somethingElse = this.randomCookingNext();
      }

      this.filter = filter;
      if (filter.length > 0) {
        this.filterPrompt = 'We even took your fucking choices into account';
      }

      this.insult = this.randomInsult();
      this.showDetails = false;
      this.history = this.recommendationService.getHistory();
    });
  }

  toggleDetails($event: Event): void {
    $event.preventDefault();
    this.showDetails = !this.showDetails;
  }

  isRecipe(element: any): boolean {
    return (element.ingredients);
  }

  addToFilter(item: string) {
    //$event.preventDefault();
    const currentText = this.recipeForm.get('ingredients')?.value || '';
    const newText = currentText ? `${currentText}, ${item}` : item;
    this.recipeForm.get('ingredients')?.setValue(newText);
  }

  clearFilter() {
    this.recipeForm.get('ingredients')?.setValue('');
  }

  recommendationUrl(recommendation: any): string {
    const typeOf = recommendation?.ingredients ? 'recipe' : 'restaurant';
    return typeOf + '/' + recommendation.id;
  }

  private randomCookingPrompt() {
    return shuffle([
      'Eat some fucking',
      'How about some fucking',
      'Make some fucking',
      'You are a loser, why don´t you fucking learn to cook and make some',
      'I´m bored of having you here, go away and cook some',
      'Got pet your momma and cook some fucking',
      'Surprise! Surprise! Cook'
    ])[0];
  }

  private randomCookingNext() {
    return shuffle([
      'I dont fucking like that',
      'I´d rather not eat that',
      'That´s fucking disgusting'
    ])[0];
  }

  private randomRestaurantPrompt() {
    return shuffle([
      'Take a stroll to fucking',
      'Move your lazy ass to',
      'Don´t be a pussy and go to',
    ])[0];
  }

  private randomRestaurantNext() {
    return shuffle([
      'Fuck off! It´s too far',
      'How about no!',
      'I´m too lazy to go there'
    ])[0];
  }

  private randomInsult() {
    return shuffle(['dipshit', 'floppy cunt', 'fatso', 'fat lard'])[0];
  }
}
