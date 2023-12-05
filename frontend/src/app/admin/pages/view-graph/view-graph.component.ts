import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { GraphService } from '../../../core/services/graph/graph.service';
import { zoom, ZoomBehavior, ZoomTransform } from 'd3-zoom';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-view-graph',
  templateUrl: './view-graph.component.html',
  styleUrls: ['./view-graph.component.css']
})
export class ViewGraphComponent implements OnInit {

  allData: any = {}
  zoom!: ZoomBehavior<Element, unknown>;
  svg: any;
  div: any = document.querySelector("#divGraph");

  nodes: any[] = [];
  links: any[] = [];

  isEmptyGraph: boolean = false;
  isLoading: boolean = false;

  constructor(private graphService: GraphService) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.graphService.getDataGraph()
      .pipe(
        catchError((error) => {
          console.log({ error });
          return error;
        }))
      .subscribe((data) => {
        console.log({ data });
        this.isLoading = false;

        const { nodes, links } = data;

        // Verifica si tanto los nodos como los enlaces están vacíos
        if (nodes.length === 0 && links.length === 0) {
          console.log('Los nodos y los enlaces están vacíos.');
          this.isEmptyGraph = true;
          return;
        }
        
        this.isEmptyGraph = false;
        this.nodes = nodes;
        this.links = links;        

        // this.showExampleGraph();
        this.initializeGraph();

      });
  }

  initializeGraph() {
    const width: number = screen.width;
    const height: number = screen.height;

    const simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-400))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    const svg = d3.select('#divGraph').append('svg')
      .attr("viewBox", [-width / 2, -(height - 500) / 2, width, height - 500])
      .style("font", "12px sans-serif");

    this.zoom = d3.zoom()
      .scaleExtent([2, 20]) // Define los límites de escala del zoom
      .on('zoom', this.zoomed.bind(this)); // Llama a la función zoomed cuando se realiza el zoom

    // Obtén el elemento SVG
    this.svg = d3.select('#divGraph svg');

    // Aplica el comportamiento de zoom al elemento SVG
    this.svg.call(this.zoom);

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
      .attr("dy", -2)
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
      .attr("dy", "1.1em")  // Ajusta la posición vertical del texto
      .style("text-anchor", "middle")  // Centra el texto horizontalmente
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

  zoomed(event: any) {
    const transform: ZoomTransform = event.transform;
    this.svg.attr('transform', transform);
  }

  zoomIn() {
    // Aumenta la escala del zoom en 1.2 veces
    this.zoom.scaleBy(this.svg, 1.2);
  }

  zoomOut() {
    // Reduce la escala del zoom en 0.8 veces
    this.zoom.scaleBy(this.svg, 0.8);
  }

  centerGraph() {
    const svgElement = this.svg.node();
    const svgWidth = +svgElement.getAttribute("width");
    const svgHeight = +svgElement.getAttribute("height");

    // Calcula el centro del gráfico
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;

    // Realiza la transición para centrar el gráfico
    this.svg
      .transition()
      .duration(750) // Duración de la transición en milisegundos
      .call(
        this.zoom.transform,
        d3.zoomIdentity.translate(centerX, centerY)
      );
  }

  showExampleGraph() {
    this.nodes = [
      { index: 0, name: 'Pyme 1' },
      { index: 1, name: 'Pyme 2' },
      { index: 2, name: 'Pyme 3' },
      { index: 3, name: 'Pyme 4' },
      { index: 4, name: 'Pyme 5' },
      { index: 5, name: 'Pyme 6' },
    ];

    this.links = [
      { source: this.nodes[0], target: this.nodes[1], type: 1 },
      { source: this.nodes[0], target: this.nodes[2], type: 3 },
      { source: this.nodes[1], target: this.nodes[3], type: 4 },
      { source: this.nodes[1], target: this.nodes[4], type: 2 },
    ];
  }
}