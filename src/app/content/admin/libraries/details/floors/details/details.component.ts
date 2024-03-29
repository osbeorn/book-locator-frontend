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

  RACK_DEFAULT_FILL_COLOR = 'none';
  RACK_SELECTED_FILL_COLOR = '#4E73DF';
  RACK_IN_HOVER_FILL_COLOR = '#2E59D9';
  RACK_HAS_NO_CONTENTS_FILL_COLOR = '#E74A3B';
  RACK_HAS_CONTENTS_FILL_COLOR = '#1CC88A';
  RACK_OUT_HOVER_FILL_COLOR = 'none';

  RACK_HOVER_CLASS = 'rack-hover';
  RACK_SELECTED_CLASS = 'rack-selected';
  RACK_HAS_NO_CONTENT_CLASS = 'rack-incomplete';
  RACK_HAS_CONTENT_CLASS = 'rack-completed';

  private snap: Paper;

  id: string;

  floor: Floor = {};

  racks: Rack[];
  private racksSubject: ReplaySubject<Rack[]> = new ReplaySubject<Rack[]>(1);
  racksIncomplete: boolean = false;

  library: Library = {};

  floorRackCodeIdentifier: string;
  private floorRackCodeIdentifierSubject: ReplaySubject<string> = new ReplaySubject<string>(1);

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
            // TODO - use both attribute and value
            this.floorRackCodeIdentifier = this.floor.rackCodeSelector.attribute;
            this.floorRackCodeIdentifierSubject.next(this.floor.rackCodeSelector.attribute);

            this.libraryService.getLibrary(this.floor.libraryId)
              .subscribe(res2 => this.library = res2);
          });

        this.floorService.getFloorRacks(this.id, 'id,code,contents.id,contents.identifier,contents.regex', '', '', 0, 0)
          .subscribe(res => {
            this.racks = res.body;
            this.racksSubject.next(this.racks);
          });
      }
    });
  }

  get floorPlanUrl(): string {
    return this.floorService.getFloorPlanUrl(this.id);
  }

  processFloorPlan(): void {
    this.snap = Snap('.floor-plan-container > svg');

    // TODO - combine racksSubject and floorRackCodeIdentifierSubject

    this.floorRackCodeIdentifierSubject.subscribe(rackCodeAttributeSelector => {
      this.configureFloorPlanEvents(rackCodeAttributeSelector);
      this.setRackContentsCompletionData(rackCodeAttributeSelector);
    });
  }

  onRackContentKeypress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.addRackContent();
    }
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
      .subscribe(() => this.router.navigate(['/', 'admin', 'libraries', this.library.id]));
  }

  private configureFloorPlanEvents(rackCodeAttributeSelector: string): void {
    this.snap
      .selectAll(`[${rackCodeAttributeSelector}]`)
      .attr({
        'pointer-events': 'visible' // enable pointer events; see https://www.w3.org/TR/SVG/interact.html#PointerEventsProperty
      })
      .forEach(el => {
        el.hover(
          () => {
            if (!el.hasClass(this.RACK_SELECTED_CLASS)) {
              el.addClass(this.RACK_HOVER_CLASS);

              el.attr({
                fill: this.RACK_IN_HOVER_FILL_COLOR
              });

              const elChildren = el.children();
              if (elChildren && elChildren.length > 0) {
                elChildren
                  .filter(elC => elC.paper)
                  .forEach(elC => {
                    elC.attr({
                      fill: this.RACK_IN_HOVER_FILL_COLOR
                    });
                  });
              }
            }
          },
          () => {
            el.removeClass(this.RACK_HOVER_CLASS);

            if (!el.hasClass(this.RACK_SELECTED_CLASS)) {
              let fill = this.RACK_OUT_HOVER_FILL_COLOR;

              if (el.hasClass(this.RACK_HAS_CONTENT_CLASS)) {
                fill = this.RACK_HAS_CONTENTS_FILL_COLOR;
              } else if (el.hasClass(this.RACK_HAS_NO_CONTENT_CLASS)) {
                fill = this.RACK_HAS_NO_CONTENTS_FILL_COLOR;
              }

              el.attr({
                fill
              });

              const elChildren = el.children();
              if (elChildren && elChildren.length > 0) {
                elChildren
                  .filter(elC => elC.paper)
                  .forEach(elC => {
                    elC.attr({
                      fill
                    });
                  });
              }
            }
          }
        );

        el.click(() => {
          this.elementSelected(el);
        });
      });
  }

  private elementSelected(element: Snap.Element): void {
    element.paper
      .selectAll(`.${this.RACK_SELECTED_CLASS}`)
      .forEach(el2 => {
        el2.removeClass(this.RACK_SELECTED_CLASS);

        let fill = this.RACK_DEFAULT_FILL_COLOR;

        if (el2.hasClass(this.RACK_HAS_CONTENT_CLASS)) {
          fill = this.RACK_HAS_CONTENTS_FILL_COLOR;
        } else if (el2.hasClass(this.RACK_HAS_NO_CONTENT_CLASS)) {
          fill = this.RACK_HAS_NO_CONTENTS_FILL_COLOR;
        }

        el2.attr({
          fill
        });

        const el2Children = el2.children();
        if (el2Children && el2Children.length > 0) {
          el2Children
            .filter(el2C => el2C.paper)
            .forEach(el2C => {
              el2C.attr({
                fill
              });
            });
        }
      });

    element
      .addClass(this.RACK_SELECTED_CLASS)
      .attr({
        fill: this.RACK_SELECTED_FILL_COLOR
      });

    const elementChildren = element.children();
    if (elementChildren && elementChildren.length > 0) {
      elementChildren
        .filter(elementC => elementC.paper)
        .forEach(elementC => {
          elementC.attr({
            fill: this.RACK_SELECTED_FILL_COLOR
          });
        });
    }

    this.rackSelected(element);
  }

  private rackSelected(el: Snap.Element): void {
    const code = el.attr(this.floor.rackCodeSelector.attribute);
    const rack = this.getRackByCode(code);

    if (this.selectedRack && this.selectedRack.rack.code === rack.code) {
      return;
    }

    this.selectedRack = {
      element: el,
      rack
    };
  }

  private setRackContentsCompletionData(rackCodeAttributeSelector: string): void {
    this.racksSubject.subscribe(() => {
      // racks with 1 or more content where every content must have the identifier filled out
      const completedRacksSelector = this.racks
        .filter(r => r.contents && r.contents.length > 0 && r.contents.every(rc => rc.identifier))
        .map(r => `[${rackCodeAttributeSelector}=${r.code.replace(/\./g, '\\.')}]`)
        .join(',');

      // racks with no contents or racks with 1 or more content where not every content has the identifier filled out
      const incompleteRacksSelector = this.racks
        .filter(r =>
          !r.contents || r.contents.length === 0 ||
          (r.contents && r.contents.length > 0 && !r.contents.every(rc => rc.identifier))
        )
        .map(r => `[${rackCodeAttributeSelector}=${r.code.replace(/\./g, '\\.')}]`)
        .join(', ');

      if (completedRacksSelector) {
        this.racksIncomplete = false;

        const selectedElements = this.snap
          .selectAll(completedRacksSelector);

        const selectedElementChildren = [];
        selectedElements.forEach(el => {
          let elChildren = el.children();
          if (elChildren && elChildren.length > 0) {
            elChildren = elChildren.filter(elC => elC.paper);
            selectedElementChildren.push(...elChildren);
          }
        });
        selectedElementChildren.forEach(el => selectedElements.push(el));

        selectedElements
          .attr({
            fill: this.RACK_HAS_CONTENTS_FILL_COLOR
          })
          .forEach(el => {
            el.addClass(this.RACK_HAS_CONTENT_CLASS);
          });
      }

      if (incompleteRacksSelector) {
        this.racksIncomplete = true;

        const selectedElements = this.snap
          .selectAll(incompleteRacksSelector);

        const selectedElementChildren = [];
        selectedElements.forEach(el => {
          let elChildren = el.children();
          if (elChildren && elChildren.length > 0) {
            elChildren = elChildren.filter(elC => elC.paper);
            selectedElementChildren.push(...elChildren);
          }
        });
        selectedElementChildren.forEach(el => selectedElements.push(el));

        selectedElements
          .attr({
            fill: this.RACK_HAS_NO_CONTENTS_FILL_COLOR
          })
          .forEach(el => {
            el.addClass(this.RACK_HAS_NO_CONTENT_CLASS);
          });
      }
    });
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
