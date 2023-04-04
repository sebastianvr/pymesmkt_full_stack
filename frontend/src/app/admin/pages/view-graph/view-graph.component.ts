import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { GraphService } from '../../../core/services/graph/graph.service';


@Component({
  selector: 'app-view-graph',
  templateUrl: './view-graph.component.html',
  styleUrls: ['./view-graph.component.css']
})


export class ViewGraphComponent implements OnInit {

  allData: any = {}

  nodes = [
    { index: 0, name: 'El Molino De Oro' },
    { index: 1, name: 'El Nogal' },
    { index: 2, name: 'Doña Carmen' },
    { index: 3, name: 'Dulce Tentación' },
    { index: 4, name: 'La Baguette' },
    { index: 5, name: 'Pastelería El Gato' },
    { index: 6, name: 'La Cremería' },
    { index: 7, name: 'La Boutique del Pan' },
    { index: 8, name: 'El Horno de Mama' },
    { index: 9, name: 'La Patisserie' },
  ];

  links = [
    { source: this.nodes[0], target: this.nodes[1], type: 1 },
    { source: this.nodes[0], target: this.nodes[2], type: 3 },
    { source: this.nodes[1], target: this.nodes[3], type: 4 },
    { source: this.nodes[1], target: this.nodes[4], type: 2 },
    { source: this.nodes[1], target: this.nodes[5], type: 1 },
    { source: this.nodes[1], target: this.nodes[6], type: 4 },
    { source: this.nodes[2], target: this.nodes[7], type: 6 },
    { source: this.nodes[2], target: this.nodes[8], type: 9 },
    { source: this.nodes[2], target: this.nodes[9], type: 4 },
    { source: this.nodes[1], target: this.nodes[0], type: 1 },
  ];

  constructor(
    private graphService: GraphService
  ) {
    this.graphService.getDataGraph().subscribe((data) => {
      this.allData = data
      console.log('this.allData', this.allData)
    })
  }

  div: any = document.querySelector("#divGraph");

  ngOnInit(): void {

    const width: any = screen.width
    const height: any = screen.height

    const simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-400))
      .force("x", d3.forceX())
      .force("y", d3.forceY());


    const svg = d3.select('#divGraph').append('svg')
      .attr("viewBox", [-width / 2, -(height - 500) / 2, width, height - 500])
      .style("font", "12px sans-serif");

    svg.append("svg:defs").selectAll("marker")
      .data(['arrow'])
      .enter().append("svg:marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", -0.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("fill", 'black')
      .attr("d", "M0,-5L10,0L0,5");


    const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(this.links)
      .join("path")
      .attr("id", (d: any) => `${d.source.name}x${d.target.name}`)
      .attr("stroke", "black")
      .attr("marker-end", "url(#arrow)")

      const linkLabel = svg
      .selectAll(".link-label")
      .data(this.links)
      .enter()
      .append("text")
      .attr("class", "link-label")
      .attr("dy", -4)
      .attr("text-anchor", "middle")
      .append("textPath")
      .attr("startOffset", "50%")
      .attr("xlink:href", (d: any) => `#${d.source.name}x${d.target.name}`)
      .text((d: any) => `${d.type}`);

    const node = svg.append("g")
      .attr("fill", "white")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .selectAll("g")
      .data(this.nodes)
      .join("g")

    const circles = node
      .append('circle')
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("r", 4)
      .style('fill', "#0d6efd")
      .style('cursor', 'pointer')
      .call(
        d3.drag<SVGCircleElement, any>()
          .on('start', (e, d) => dragstarted(e, d))
          .on('drag', (e, d) => dragged(e, d))
          .on('end', (e, d) => dragended(e, d))
      );

    const labelsCircles = node.append('text')
      .attr("x", 0)
      .attr("y", "1em")
      .text((d: any) => d.name)
      .clone(true).lower()
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 3);

    simulation.on("tick", () => {
      link.attr("d", this.linkArc);
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    const dragstarted = (e: any, d: any) => {
      if (!e.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (e: any, d: any) => {
      d.fx = e.x;
      d.fy = e.y;
    };

    const dragended = (e: any, d: any) => {
      if (!e.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    };
  }

  linkArc(d: any) {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
      M${d.source.x},${d.source.y}
      A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `;
  }







}
