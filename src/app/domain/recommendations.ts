import {Restaurant} from "./restaurant";
import {Recipe} from "./recipe";

export interface Recommendations {
  restaurants?: Restaurant[];
  recipes?: Recipe[]
}
