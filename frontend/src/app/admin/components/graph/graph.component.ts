import { Component, OnInit } from '@angular/core';
import Graph from 'graphology';
import random from 'graphology-layout/random';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  graph!: Graph;
  RED: string = "#FA4F40";
  BLUE: string = "#727EE0";
  GREEN: string = "#5DB346";
  BLACK: string = "#000000";
  
  constructor() {
    this.graph = new Graph();
    this.graph.addNode("Pyme 1", { size: 15, label: "Pyme 1", color: this.RED });
    this.graph.addNode("Pyme 2", { size: 15, label: "Pyme 2", color: this.RED });
    this.graph.addNode("Pyme 3", { size: 15, label: "Pyme 3", color: this.RED });
    this.graph.addNode("Pyme 4", { size: 15, label: "Pyme 4", color: this.BLUE });
    this.graph.addNode("Pyme 5", { size: 15, label: "Pyme 5", color: this.BLUE });
    this.graph.addNode("Pyme 6", { size: 15, label: "Pyme 6", color: this.GREEN });
    this.graph.addNode("Pyme 7", { size: 15, label: "Pyme 7", color: this.GREEN });
    this.graph.addNode("Pyme 8", { size: 15, label: "Pyme 8", color: this.GREEN });

    this.graph.addEdge("Pyme 1", "Pyme 2", { type: "arrow", label: "1", size: 5 });
    // this.graph.addEdge("Pyme 2", "Pyme 1", { type: "arrow", label: "1", size: 5 });
    this.graph.addEdge("Pyme 1", "Pyme 7", { type: "line", label: "2", size: 5 });

    this.graph.addEdge("Pyme 8", "Pyme 1", { type: "line", label: "3", size: 5 });
    this.graph.addEdge("Pyme 6", "Pyme 5", { type: "line", label: "4", size: 5 });
    this.graph.addEdge("Pyme 5", "Pyme 1", { type: "line", label: "8", size: 5 });
    this.graph.addEdge("Pyme 4", "Pyme 5", { type: "line", label: "1", size: 5 });
    this.graph.addEdge("Pyme 3", "Pyme 6", { type: "line", label: "2", size: 5 });

    this.graph.addEdge("Pyme 3", "Pyme 4", { type: "line", label: "2", size: 5 });
    this.graph.addEdge("Pyme 3", "Pyme 7", { type: "line", label: "2", size: 5 });
    this.graph.addEdge("Pyme 2", "Pyme 7", { type: "line", label: "2", size: 5 });
    this.graph.addEdge("Pyme 4", "Pyme 1", { type: "line", label: "2", size: 5 });
    this.graph.addEdge("Pyme 2", "Pyme 8", { type: "line", label: "2", size: 5 });


    random.assign(this.graph)

  }


  ngOnInit(): void {
  }

}
