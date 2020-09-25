import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LibraryService} from '../../../../../../services/library.service';
import {Floor} from '../../../../../../models/floor.model';
import {FloorService} from '../../../../../../services/floor.service';
import {NgForm} from '@angular/forms';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {

  @ViewChild('floorPlanFileInput', { static: false })
  private floorPlanFileInput: ElementRef;

  @ViewChild('floorForm', { static: false })
  private floorForm: NgForm;

  mode: Mode;
  libraryId: string;
  floorId: string;

  floor: Floor;

  floorPlanFile: File;

  ladda: any = {
    createOrUpdateFloorInProgress: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private libraryService: LibraryService,
    private floorService: FloorService
  ) {
  }

  ngOnInit(): void {
    this.mode = Mode.ADD;
    this.floor = {};

    this.route.paramMap.subscribe(p => {
      if (p.has('libraryId')) {
        this.libraryId = p.get('libraryId');
      }

      if (p.has('floorId')) {
        this.mode = Mode.EDIT;
        this.floorId = p.get('floorId');

        this.floorService.getFloor(this.floorId)
          .subscribe(res => this.floor = res);
      }
    });
  }

  floorPlanFileChanged(event: Event): void {
    const floorPlanFileInputElement = this.floorPlanFileInput.nativeElement;

    if (floorPlanFileInputElement.files && floorPlanFileInputElement.files.length > 0) {
      this.floorPlanFile = this.floorPlanFileInput.nativeElement.files[0];
      this.floorForm.control.markAsDirty();
    }
  }

  onSubmit(): void {
    this.ladda.createOrUpdateFloorInProgress = true;

    let formData;
    if (this.floorPlanFile) {
      formData = new FormData();
      formData.append('file', this.floorPlanFile, this.floorPlanFile.name);
    }

    if (this.mode === Mode.ADD) {
      this.libraryService.createLibraryFloor(this.libraryId, this.floor)
        .pipe(
          finalize(() => this.ladda.createOrUpdateFloorInProgress = false)
        )
        .subscribe(res => {
          if (formData) {
            this.floorService.updateFloorPlan(res.id, formData)
              .subscribe(() => this.router.navigate(['..', res.id], { relativeTo: this.route }));
          } else {
            this.router.navigate(['..', res.id], {relativeTo: this.route});
          }
        });
    } else if (this.floorId && this.mode === Mode.EDIT) {
      this.floorService.patchFloor(this.floorId, this.floor)
        .pipe(
          finalize(() => this.ladda.createOrUpdateFloorInProgress = false)
        )
        .subscribe(() => {
          if (formData) {
            this.floorService.updateFloorPlan(this.floorId, formData)
              .subscribe(() => this.router.navigate(['..'], { relativeTo: this.route }));
          } else {
            this.router.navigate(['..'], {relativeTo: this.route});
          }
        });
    }
  }
}

enum Mode {
  ADD,
  EDIT
}
