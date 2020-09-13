import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Paper} from 'snapsvg';
import {JSONService} from '../../services/json-service';
import {forkJoin, Observable} from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public udk: string;
  private snap: Paper;

  private udkLookupObservable: Observable<any>;
  private labelLookupObservable: Observable<any>;

  private udkLookup: any;
  private labelLookup: any;

  constructor(
    private route: ActivatedRoute,
    private jsonService: JSONService
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

  private highlightLocation(udk: string): void {
    let parsedUdk = this.parseUdk(udk);

    const udkName = this.udkLookup
      .filter(l => l.id === parsedUdk)
      .map(l => l.name)
      .find(l => l);

    this.labelLookup
      .filter(l => l.udks
        .map(u => u.toLowerCase().replace(/\s/g, ''))
        .includes(parsedUdk)
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

  private parseUdk(udk: string): string {
    const l = this.getUdkAttribute(udk, 'L'); // lokacija
    const i = this.getUdkAttribute(udk, 'I');
    const u = this.getUdkAttribute(udk, 'U');
    const a = this.getUdkAttribute(udk, 'A');

    let parsedUdk = '';
    if (i) {
      parsedUdk += i.toLowerCase().replace(/\s/g, '');
    }
    if (u) {
      parsedUdk += u.toLowerCase().replace(/\s/g, '');
    }
    if (a) {
      parsedUdk += a.toLowerCase().replace(/\s/g, '');
    }
    parsedUdk = parsedUdk.trim();

    return parsedUdk;
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
