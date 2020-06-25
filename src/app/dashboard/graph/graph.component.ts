import { Component, OnInit } from '@angular/core';
import { ScriptService } from '../../_api/scripting.service';
// import '../../../;
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit {
  // loadScripts() {
  //   const dynamicScripts = [
  //     'https://platform.twitter.com/widgets.js',
  //     '../../../assets/node_modules/flot/excanvas.js',
  //   ];
  //   console.log('LOAD SCRIPTINGS', dynamicScripts);
  //   for (let i = 0; i < dynamicScripts.length; i++) {
  //     const node = document.createElement('script');
  //     node.src = dynamicScripts[i];
  //     node.type = 'text/javascript';
  //     node.async = false;
  //     node.charset = 'utf-8';
  //     document.getElementsByTagName('body')[0].appendChild(node);
  //   }
  // }
  public dataset: any;
  public options: any;
  constructor(private scriptService: ScriptService) {
    console.log('CONSTRUCTOR GRAPH');
    // this.loadScripts();
    this.scriptService
      .load(
        'canvas',
        'flot',
        'flotpie',
        'flottime',
        'flotcrosshair',
        'flottooltip',
        'flotdata'
      )
      .then((data) => {
        console.log('script loaded ', data);
      })
      .catch((error) => console.log(error));
    this.dataset = [
      {
        label: 'line1',
        data: [
          [1, 130],
          [2, 40],
          [3, 80],
          [4, 160],
          [5, 159],
          [6, 370],
          [7, 330],
          [8, 350],
          [9, 370],
        ],
      },
    ];
    this.options = {
      series: {
        lines: { show: true },
        points: {
          radius: 3,
          show: true,
        },
      },
    };
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    console.log('call ngOnDestroy');
  }
}
