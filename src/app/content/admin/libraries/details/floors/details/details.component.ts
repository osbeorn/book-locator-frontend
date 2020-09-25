import {Component, OnInit} from '@angular/core';
import {Library} from '../../../../../../models/library.model';
import {Floor} from '../../../../../../models/floor.model';
import {ActivatedRoute, Router} from '@angular/router';
import {LibraryService} from '../../../../../../services/library.service';
import {FloorService} from '../../../../../../services/floor.service';
import {Paper} from 'snapsvg';
import {ReplaySubject} from 'rxjs';
import {Rack} from '../../../../../../models/rack.model';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  private RACK_DEFAULT_FILL_COLOR = 'none';
  private RACK_SELECTED_FILL_COLOR = '#4E73DF';
  private RACK_IN_HOVER_FILL_COLOR = '#224ABE';
  private RACK_OUT_HOVER_FILL_COLOR = 'none';

  private snap: Paper;

  id: string;

  floor: Floor = {};
  racks: Rack[];

  library: Library = {};

  floorRackCodeIdentifierSubject: ReplaySubject<string> = new ReplaySubject<string>(1);

  selectedRack: SelectedRack;

  ladda: any = {
    saveRacksInProgress: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private libraryService: LibraryService,
    private floorService: FloorService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(p => {
      if (p.has('floorId')) {
        this.id = p.get('floorId');

        this.floorService.getFloor(this.id)
          .subscribe(res => {
            this.floor = res;
            this.floorRackCodeIdentifierSubject.next(this.floor.rackCodeIdentifier);

            this.libraryService.getLibrary(this.floor.libraryId)
              .subscribe(res2 => this.library = res2);
          });

        this.floorService.getFloorRacks(this.id, 'id,code,contents.id,contents.identifier,contents.regex', '', '', 0, 0)
          .subscribe(res => {
            this.racks = res.body;
          });
      }
    });
  }

  get floorPlanUrl(): string {
    return this.floorService.getFloorPlanUrl(this.id);
  }

  processFloorPlan(): void {
    this.snap = Snap('.floor-plan-container > svg');

    this.floorRackCodeIdentifierSubject.subscribe(rackCodeIdentifier => {
      this.snap
        .selectAll(`[${rackCodeIdentifier}]`)
        .attr({
          'pointer-events': 'visible' // enable pointer events; see https://www.w3.org/TR/SVG/interact.html#PointerEventsProperty
        })
        .forEach(el => {
          el.hover(
            () => {
              if (!el.hasClass('rack-selected')) {
                el.addClass('rack-hover');

                el.attr({
                  fill: this.RACK_IN_HOVER_FILL_COLOR
                });
              }
            },
            () => {
              el.removeClass('rack-hover');

              if (!el.hasClass('rack-selected')) {
                el.attr({
                  fill: this.RACK_OUT_HOVER_FILL_COLOR
                });
              }
            }
          );

          el.click(() => {
            el.paper
              .selectAll('.rack-selected')
              .forEach(el2 => {

                el2
                  .removeClass('rack-selected')
                  .attr({
                    fill: this.RACK_DEFAULT_FILL_COLOR
                  });
              });

            el
              .addClass('rack-selected')
              .attr({
                fill: this.RACK_SELECTED_FILL_COLOR
              });

            this.rackSelected(el);
          });
        });
    });
  }

  rackSelected(el: Snap.Element): void {
    const code = el.attr(this.floor.rackCodeIdentifier);
    const rack = this.getRackByCode(code);

    if (this.selectedRack && this.selectedRack.rack.code === rack.code) {
      return;
    }

    this.selectedRack = {
      element: el,
      rack
    };
  }

  addRackContent(): void {
    if (!this.selectedRack.rack.contents) {
      this.selectedRack.rack.contents = [];
    }

    this.selectedRack.rack.contents.push({
      regex: false,
      identifier: ''
    });
  }

  removeRackContent(index: number): void {
    if (!this.selectedRack.rack.contents) {
      return;
    }

    this.selectedRack.rack.contents.splice(index, 1);
  }

  saveRacks(): void {
    this.ladda.saveRacksInProgress = true;

    this.floorService.createOrUpdateRacks(this.id, this.racks)
      .pipe(
        finalize(() => this.ladda.saveRacksInProgress = false)
      )
      .subscribe(res => console.log(res));
  }

  private getRackByCode(code: string): Rack {
    let rack = this.racks.find(r => r.code === code);
    if (!rack) {
      rack = {
        code,
        contents: [{
          regex: false,
          identifier: ''
        }]
      };

      this.racks.push(rack);
    }

    if (!rack.contents) {
      rack.contents = [{
        regex: false,
        identifier: ''
      }];
    }

    return rack;
  }
}

export class SelectedRack {
  element?: Snap.Element;
  rack?: Rack;
}
