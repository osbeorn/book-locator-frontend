import {Component, OnInit} from '@angular/core';
import {StatisticService} from '../../../services/statistic.service';
import {DateTime} from 'luxon';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  statistics: any = {};

  // chart
  // view: any[] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  // showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Datum';
  showYAxisLabel = true;
  yAxisLabel = 'Št. iskanj';
  colorScheme = {
    domain: ['#4e73df']
  };
  data = [];

  constructor(
    private statisticService: StatisticService
  ) {
  }

  ngOnInit(): void {
    const today = DateTime.local();

    const dates = [today];
    for (let i = 1; i <= 7; i++) {
      const date = today.minus({ day: i});
      dates.unshift(date);
    }

    this.statisticService.getSearchStatistics()
      .subscribe(res => this.statistics = res);

    this.statisticService
      .getDailySearchStatistics(
        '',
        `queryStart:GTE:'${dates[0].startOf('day').toUTC().toISO()}' queryStart:LTE:'${today.endOf('day').toUTC().toISO()}'`,
        'queryStart ASC'
      )
      .subscribe(res => {
        const tmpData = [];
        for (const date of dates) {
          const isoDateString = date.toISODate();
          const localDateString = date.setLocale('sl').toLocaleString();

          let key;
          let value;
          let found = false;
          for ([key, value] of Object.entries(res)) {
            if (key === isoDateString) {
              found = true;
              break;
            }
          }

          if (found) {
            tmpData.push({
              name: localDateString,
              value
            });
          } else {
            tmpData.push({
              name: localDateString,
              value: 0
            });
          }
        }

        this.data = [...tmpData];
      });
  }
}
