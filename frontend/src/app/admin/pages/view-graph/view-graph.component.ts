import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import * as d3 from 'd3';
import { ZoomBehavior, ZoomTransform } from 'd3-zoom';
import { GraphService } from 'src/app/core/services/graph/graph.service';

@Component({
  selector: 'app-view-graph',
  templateUrl: './view-graph.component.html',
  styleUrls: ['./view-graph.component.css']
})
export class ViewGraphComponent implements OnInit {
  nodes: any[] = [];
  links: any[] = [];
  svg: any;
  div: Element | null = document.querySelector("#divGraph");
  zoom!: ZoomBehavior<Element, unknown>;
  showExample: boolean = false;

  isEmptyGraph: boolean = false;
  isLoading: boolean = false;

  constructor(private graphService: GraphService) { }

  ngOnInit(): void {
    if (this.showExample) {
      // console.log('first');
      // this.showExampleGraph();
      // this.isEmptyGraph = false;
      // this.initializeGraph();
      return;
    }

    this.loadDataGraph();
  }

  private loadDataGraph(): void {
    this.isLoading = true;
    this.graphService.getDataGraph()
      .pipe(
        catchError((error) => {
          console.error(error);
          this.isLoading = false;
          return error;
        })
      )
      .subscribe((data) => {
        this.handleGraphData(data);
        this.isLoading = false;
      });
  }

  private handleGraphData(data: any): void {
    const { nodes, links } = data;

    if (nodes.length === 0 && links.length === 0) {
      // console.log('Los nodos y los enlaces están vacíos.');
      this.isEmptyGraph = true;
      return;
    }

    this.isEmptyGraph = false;
    this.links = links;
    this.nodes = nodes;
    console.log({ data })
    this.initializeGraph();
  }

  private initializeGraph() {
    // console.log('initializeGraph()');
    const width: number = screen.width;
    const height: number = screen.height;

    const simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-400))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    const svg = d3.select('#divGraph').append('svg')
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", [-width / 2, -(height - 500) / 2, width, height - 500])
      .style("font", "12px sans-serif");

    this.zoom = d3.zoom()
      .scaleExtent([1, 30]) // Define los límites de escala del zoom
      .on('zoom', this.zoomed.bind(this)); // Llama a la función zoomed cuando se realiza el zoom

    // Obtén el elemento SVG
    this.svg = d3.select('#divGraph svg');

    // Aplica el comportamiento de zoom al elemento SVG
    this.svg.call(this.zoom);

    svg.append("svg:defs").selectAll("marker")
      .data(['arrow'])
      .enter().append("svg:marker")
      .attr("id", (d: string) => d)
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
      .attr("marker-end", "url(#arrow)") // Asegura que el marcador se aplique inicialmente


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
      .on('mouseover', (e, d) => handleMouseOver(d))
      .on('mouseout', (e, d) => handleMouseOut(d))
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

    const handleMouseOver = (d: any) => {
      // Reducir la opacidad de todos los elementos
      d3.selectAll('circle, path, text').style('opacity', 0.1);
    
      // Crear un conjunto para almacenar los IDs de los nodos y enlaces relacionados
      const relatedNodeIds = new Set();
      const relatedLinkIds = new Set();
    
      // Agregar el nodo actual y sus conexiones
      relatedNodeIds.add(d.id);
    
      this.links.forEach(link => {
        if (link.source && link.target) { // Verificar que source y target estén definidos
          if (link.source.id === d.id) {
            relatedNodeIds.add(link.target.id);
            relatedLinkIds.add(`${link.source.id}-${link.target.id}`);
          } else if (link.target.id === d.id) {
            relatedNodeIds.add(link.source.id);
            relatedLinkIds.add(`${link.source.id}-${link.target.id}`);
          }
        }
      });
    
      // Ajustar la opacidad y propiedades de los elementos relacionados
      d3.selectAll('circle, text')
        .filter((node: any) => relatedNodeIds.has(node.id))
        .style('opacity', 1);
    
      d3.selectAll('path')
        .filter((link: any) => {
          if (link.source && link.target) { // Verificar que source y target estén definidos
            const linkId = `${link.source.id}-${link.target.id}`;
            return relatedLinkIds.has(linkId);
          } else {
            return false; // Si no están definidos, no incluir el enlace
          }
        })
        .style('opacity', 1)
        .attr('stroke', (link: any) => link.source.id === d.id ? 'blue' : 'green') // Colorear los enlaces
        .attr('marker-end', (link: any) => {
          return link.source.id === d.id ? 'url(#arrow-out)' : 'url(#arrow-in)';
        });
    };
    
    const handleMouseOut = (d: any) => {
      d3.selectAll('circle').style('opacity', 1);
      d3.selectAll('path').style('opacity', 1).attr('stroke', 'black').attr('marker-end', 'url(#arrow)');
      d3.selectAll('text').style('opacity', 1);
    };
  }

  private linkArc(d: any) {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
      M${d.source.x},${d.source.y}
      A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `;
  }

  private zoomed(event: any) {
    const transform: ZoomTransform = event.transform;
    this.svg.attr('transform', transform);
  }

  public zoomIn() {
    // Aumenta la escala del zoom en 1.2 veces
    this.zoom.scaleBy(this.svg.transition().duration(200), 1.2);
  }

  public zoomOut() {
    // Reduce la escala del zoom en 1.2 veces
    this.zoom.scaleBy(this.svg.transition().duration(200), 0.8);
  }

  public centerGraph() {
    const svgElement = this.svg.node();

    if (!svgElement) return;

    // Obteniendo tamaño del contenedor del SVG
    const bbox = svgElement.getBBox();
    const centerX = -bbox.x - bbox.width / 2;
    const centerY = -bbox.y - bbox.height / 2;

    // Transición para centrar el gráfico
    this.svg
      .transition()
      .duration(750) // Duración de la transición en milisegundos
      .call(
        this.zoom.transform,
        d3.zoomIdentity.translate(centerX, centerY).scale(1)
      );
  }

  private showExampleGraph() {
    this.nodes = [
      { id: 'ab', name: "Cornellá de Llobregat" },
      { id: 'ac', name: "Domínguez Hermanos" },
      { id: 'ad', name: "Godínez e Hijos" },
      { id: 'af', name: "Rojas S.l." },
    ];

    this.links = [
      { source: this.nodes[0].id, target: this.nodes[1].id, type: 1 },
      { source: this.nodes[0].id, target: this.nodes[2].id, type: 3 },
    ];
  }

  public refresh() {
    // Eliminar antiguo svg
    d3.select('#divGraph svg').remove();
    this.loadDataGraph();
  }

  public showDemo() {
    this.showExample = true;
    this.ngOnInit();
  }
}