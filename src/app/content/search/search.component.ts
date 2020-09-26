import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Paper} from 'snapsvg';
import {LookupService} from '../../services/lookup.service';
import {SearchService} from '../../services/search.service';
import {FloorService} from '../../services/floor.service';
import {Library} from '../../models/library.model';
import {Floor} from '../../models/floor.model';
import {Rack} from '../../models/rack.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  private RACK_SELECTED_FILL_COLOR = '#4E73DF';

  public query: string;
  public zoomedIn: boolean = false;

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
        .subscribe(res => {
          if (res) {
            this.library = res.library;
            this.floor = res.floor;
            this.racks = res.racks;
            this.U = res.U;
            this.udkName = res.udkName;

            this.floorPlanUrl = this.floorService.getFloorPlanUrl(res.floor.id);
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
      .addClass('h-100 m-auto d-block');

    this.snap.click(() => {
      this.doZoom();

      this.changeDetector.detectChanges();
    }, this);

    this.highlightLocation();
  }

  private highlightLocation(): void {
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
        }
      });
  }
}
