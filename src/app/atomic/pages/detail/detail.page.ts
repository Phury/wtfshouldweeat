import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RecommendationService} from "../../../services/recommendation.service";
import {Recipe} from "../../../domain/recipe";
import {Restaurant} from "../../../domain/restaurant";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './detail.page.html',
  styleUrl: './detail.page.css'
})
export class DetailPage implements OnInit {
  recommendation: Restaurant | Recipe | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recommendationService: RecommendationService,
  ) {
  }

  ngOnInit(): void {
    const type = this.route.snapshot.paramMap.get('type');
    const id = this.route.snapshot.paramMap.get('id');
    if (type === null || id === null) {
      this.router.navigate(['/']);
    }

    this.recommendationService.getRecommendation(type!, id!)
      .subscribe(rec => this.recommendation = rec);
  }

  isRecipe(element: any): boolean {
    return (element.ingredients);
  }

  parseIngredients(recommendation: Restaurant | Recipe) {
    return (recommendation as Recipe).ingredients!.split(',')
  }

  parseClassifications(recommendation: Restaurant | Recipe) {
    return (recommendation as Restaurant).classification!.split(',')
  }
}
