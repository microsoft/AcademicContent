import { NgModule, Component, HostListener } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http, Headers, RequestOptions } from '@angular/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'rxjs/add/operator/map';

const GridSize: number = 8;

function forEachIndex(count: number, callback: (idx: number) => void) {
    for(let idx = 0; idx < count; idx += 1) {
        callback(idx);
    }
}
function mapByIndex(count: number, callback: (idx: number) => any) {
    let items = new Array(count);
    forEachIndex(count, idx => {
        items[idx] = callback(idx);
    });
    return items;
}

@Component({
    selector: 'pixel-grid',
    template: `
        <div class="pixel-grid">
            <div *ngFor="let row of rows">
                <div *ngFor="let col of cols"
                     [ngClass]="{ selected: grid[row*gridSize+col] }"
                     (mousedown)="selectPixel(row, col, true)"
                     (mouseover)="selectPixel(row, col)">
                </div>
            </div>
        </div>
        <div>
            <button (click)="submitGrid()">Submit</button>
            <button (click)="clearGrid()">Clear</button>
        </div>
        <div *ngIf="result">
            Azure ML says you entered a {{result}}
        </div>
        <div *ngIf="requestError"><pre>{{requestError | json}}</pre></div>
    `
})
class PixelGrid {

    isMouseButtonDown: boolean = false;
    gridSize: number = GridSize;
    grid: boolean[];
    rows: number[];
    cols: number[];
    result: string = null;
    requestError: any = null;

    constructor(private http: Http) {
        this.rows = new Array(GridSize);
        this.cols = new Array(GridSize);
        forEachIndex(GridSize, idx => {
            this.rows[idx] = idx;
            this.cols[idx] = idx;
        });
        this.clearGrid();
    }

    @HostListener('document:mousedown', [])
    onMouseDown() {
        this.isMouseButtonDown = true;
    }

    @HostListener('document:mouseup', [])
    onMouseUp() {
        this.isMouseButtonDown = false;
    }

    selectPixel(row, col, select = false) {
        if(this.isMouseButtonDown || select) {
            this.grid[row * GridSize + col] = true;
        }
    }

    clearGrid() {
        this.grid = new Array(GridSize * GridSize);
        forEachIndex(GridSize * GridSize, idx => {
            this.grid[idx] = false;
        });
        this.result = null;
        this.requestError = null;
    }

    submitGrid() {

        let columnNames = mapByIndex(GridSize * GridSize + 1, idx => {
            let paramIdx = "0" + (idx + 1);
            return "p" + paramIdx.substr(paramIdx.length - 2);
        });
        columnNames[GridSize * GridSize] = "digit";

        let values = mapByIndex(GridSize * GridSize + 1, idx => {
            return this.grid[idx] ? 16 : 0;
        });
        values[GridSize * GridSize] = 0;

        let request = {
            inputs: {
                input1: {
                    columnNames,
                    values: [values]
                }
            },
            globalParameters: {
            }
        };
        console.log('-----Request------');
        console.log(JSON.stringify(request, null, 2));

        this.postRequest(request);
    }

    postRequest(request: any) {

        const url = '... add your URL here ...';
        const apiKey = '... add your API Key here ...';

        let body = JSON.stringify(request);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        });
        let options = new RequestOptions({
            headers: headers
        });

        this.result = null;
        this.requestError = null;
        this.http
            .post(url, body, options)
            .map(res => res.json())
            .subscribe({
                next: (value) => {
                    console.log('-----Response------');
                    console.log(JSON.stringify(value, null, 2));
                    let valuesList = value.Results.output1.value.Values[0];
                    this.result = valuesList[valuesList.length - 1];
                },
                error: (error) => {
                    this.requestError = error.json() || error;
                }
            });
    }
}

@Component({
    selector: 'my-app',
    template: `
        <h2>Draw a digit from 0 to 9</h2>
        <pixel-grid></pixel-grid>
    `
})
class AppComponent {
}

@NgModule({
    imports: [ BrowserModule, HttpModule ],
    declarations: [ AppComponent, PixelGrid ],
    bootstrap: [ AppComponent ]
})
class AppModule { }

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
