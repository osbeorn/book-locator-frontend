import {Component, OnInit} from '@angular/core';
import {LibraryService} from '../../../../services/library.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Library} from '../../../../models/library.model';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {

  mode: Mode;
  id: string;

  library: Library;

  ladda: any = {
    createOrUpdateLibraryInProgress: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private libraryService: LibraryService
  ) {
  }

  ngOnInit(): void {
    this.mode = Mode.ADD;
    this.library = {};

    this.route.paramMap.subscribe(p => {
      if (p.has('libraryId')) {
        this.mode = Mode.EDIT;
        this.id = p.get('libraryId');

        this.libraryService.getLibrary(this.id)
          .subscribe(res => this.library = res);
      }
    });
  }

  onSubmit(): void {
    this.ladda.createOrUpdateLibraryInProgress = true;

    if (this.mode === Mode.ADD) {
      this.libraryService.createLibrary(this.library)
        .pipe(
          finalize(() => this.ladda.createOrUpdateLibraryInProgress = false)
        )
        .subscribe(res => this.router.navigate(['..'], { relativeTo: this.route }));
    } else if (this.id && this.mode === Mode.EDIT) {
      this.libraryService.patchLibrary(this.id, this.library)
        .pipe(
          finalize(() => this.ladda.createOrUpdateLibraryInProgress = false)
        )
        .subscribe(res => this.router.navigate(['..'], { relativeTo: this.route }));
    }
  }
}

enum Mode {
  ADD,
  EDIT
}
