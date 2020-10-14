import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Paper} from 'snapsvg';
import {LookupService} from '../../services/lookup.service';
import {SearchService} from '../../services/search.service';
import {FloorService} from '../../services/floor.service';
import {Library} from '../../models/library.model';
import {Floor} from '../../models/floor.model';
import {Rack} from '../../models/rack.model';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  private RACK_SELECTED_FILL_COLOR = '#4E73DF';

  public query: string;
  public zoomedIn: boolean = false;
  public loading: boolean = true;

  public error: boolean = false;
  public errorMessage: string;

  public library: Library = {};
  public floor: Floor = {};
  public racks: Rack[] = [];

  public U: string;

  public udkName: string;

  public floorPlanUrl: string;

  private snap: Paper;

  constructor(
    private route: ActivatedRoute,
    private lookupService: LookupService,
    private searchService: SearchService,
    private floorService: FloorService,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(qp => {
      this.query = qp.get('q');

      this.searchService.getSearchResponse(this.query)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe(
          res => {
            if (res) {
              this.library = res.library;
              this.floor = res.floor;
              this.racks = res.racks;
              this.U = res.U;
              this.udkName = res.udkName;

              this.floorPlanUrl = this.floorService.getFloorPlanUrl(res.floor.id);
            }
          },
        res => {
            if (res.error) {
              this.error = true;

              switch (res.error.code) {
                case 'invalid.search.parameter':
                  this.errorMessage = `Pri iskanju je bil podan neveljaven parameter ${res.error.params.parameter}.`;
                  break;
                case 'missing.required.search.parameters':
                  this.errorMessage = 'Pri iskanju niste podali obveznih parametrov L in/ali U.';
                  break;
                default:
                  this.errorMessage = 'Pri iskanju je prišlo do nepričakovane napake.';
              }
            }
        });
    });
  }

  private doZoom(): void {
    this.zoomedIn = !this.zoomedIn;

    this.snap.attr({
      style: `cursor: zoom-${this.zoomedIn ? 'out' : 'in'}`
    });
  }

  public processFloorPlan(): void {
    this.snap = Snap('.floor-plan-container > svg');

    this.snap
      .attr({
        style: 'cursor: zoom-in;'
      })
      .addClass('h-100 mw-100 m-auto d-block');

    this.snap.click(() => {
      this.doZoom();

      this.changeDetector.detectChanges();
    }, this);

    this.highlightLocation();
  }

  private highlightLocation(): void {
    if (this.racks) {
      let highlightedRacks = [];

      this.racks
        .forEach(r => {
          const element = this.snap.select(`[${this.floor.rackCodeIdentifier}="${r.code}"]`);

          const title = this.snap.el('title', {});
          if (this.udkName) {
            title.node.innerHTML = this.udkName;
          }

          if (element) {
            element
              .attr({
                fill: this.RACK_SELECTED_FILL_COLOR
              })
              .append(title);

            highlightedRacks.push(element);
          }
        });

      let rackGroup = this.snap.group();
      highlightedRacks.forEach(hr => rackGroup.add(hr));

      this.blinkLocation(rackGroup);
    }
  }

  blinkLocation(rackGroup: Paper): void {
    rackGroup.animate({ 'fill-opacity': 0}, 1000, mina.linear, () => this.unblinkLocation(rackGroup));
  }

  unblinkLocation(rackGroup: Paper): void {
    rackGroup.animate({ 'fill-opacity': 1 }, 1000, mina.linear, () => this.blinkLocation(rackGroup));
  }
}
