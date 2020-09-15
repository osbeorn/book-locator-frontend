import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Paper} from 'snapsvg';
import {JSONService} from '../../services/json-service';
import {forkJoin, Observable} from 'rxjs';
import {Udk} from '../../models/udk.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public udk: string;
  public zoomedIn: boolean = false;

  private snap: Paper;

  private udkLookupObservable: Observable<any>;
  private labelLookupObservable: Observable<any>;

  private udkLookup: any;
  private labelLookup: any;

  constructor(
    private route: ActivatedRoute,
    private jsonService: JSONService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.udkLookupObservable = this.jsonService.getJSON('assets/data/udk-lookup.json');
    this.labelLookupObservable = this.jsonService.getJSON('assets/data/koz_0-lookup.json');
  }

  ngOnInit(): void {
    const svgObject = document.getElementById('svg-object');

    svgObject.addEventListener('load', () => {
      const svgDocument = svgObject['contentDocument'];
      const svg = svgDocument.getElementById('floor-plan');

      this.snap = Snap(svg);
      this.snap.attr({
        style: 'cursor: zoom-in;'
      });

      this.snap.click(() => {
        this.doZoom();
        this.changeDetector.detectChanges();
      }, this);

      forkJoin([this.labelLookupObservable, this.udkLookupObservable])
        .subscribe(([labelLookup, udkLookup]) => {
          this.labelLookup = labelLookup;
          this.udkLookup = udkLookup;

          this.highlightLocation(this.udk);
        });
    }, false);

    this.route.queryParamMap.subscribe(qp => {
      this.udk = qp.get('udk');
    });
  }

  private doZoom(): void {
    this.zoomedIn = !this.zoomedIn;

    this.snap.attr({
      style: `cursor: zoom-${this.zoomedIn ? 'out' : 'in'}`
    });
  }

  private highlightLocation(udk: string): void {
    const parsedUdk = this.parseUdk(udk);

    const udkName = this.udkLookup
      .filter(l => l.id.toLowerCase().replace(/\s/g, '') === parsedUdk.u)
      .map(l => l.name)
      .find(l => l);

    this.labelLookup
      .filter(l => l.udks
        .map(u => u.toLowerCase().replace(/\s/g, ''))
        .includes(parsedUdk.toString())
      )
      .map(l => l.label)
      .forEach(l => {
        const element = this.snap.select(`[data-label="${l}"]`);

        const title = this.snap.el('title', {});
        if (udkName) {
          title.node.innerHTML = udkName;
        }

        if (element) {
          element
            .attr({
              fill: '#930042'
            })
            .append(title);
        }
      });
  }

  private parseUdk(udk: string): Udk {
    const l = this.getUdkAttribute(udk, 'L'); // lokacija
    const i = this.getUdkAttribute(udk, 'I');
    const u = this.getUdkAttribute(udk, 'U');
    const a = this.getUdkAttribute(udk, 'A');

    const values = {
      l, i, u, a
    };

    return new Udk(values);
  }

  private getUdkAttribute(udk: string, attribute: string): string {
    if (!udk) {
      return null;
    }

    return udk
      .split('_')
      .filter(x => x.startsWith(attribute))
      .map(x => x.substring(1))
      .find(x => x);
  }
}
