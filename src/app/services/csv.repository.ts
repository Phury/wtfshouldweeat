import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Papa} from "ngx-papaparse";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CsvRepository {

  constructor(
    private http: HttpClient,
    private papa: Papa
  ) {
  }

  public loadRecipesFromCSV<T>(path: string): Observable<T[]> {
    return this.http.get(path, { responseType: 'text' }).pipe(
      map(csvData => {
        const parsedData = this.papa.parse(csvData, {
          header: true,
          delimiter: ";"
        });
        //console.log(parsedData.data);
        return parsedData.data as T[];
      })
    );
  }
}
