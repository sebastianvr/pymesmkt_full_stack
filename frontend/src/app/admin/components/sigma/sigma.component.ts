import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import Graph from "graphology";
import { Sigma } from "sigma";
import { Coordinates, EdgeDisplayData, NodeDisplayData } from "sigma/types";

interface State {
  hoveredNode?: string;
  searchQuery: string;

  // State derived from query:
  selectedNode?: string;
  suggestions?: Set<string>;

  // State derived from hovered node:
  hoveredNeighbors?: Set<string>;
}


@Component({
  selector: 'app-sigma',
  templateUrl: './sigma.component.html',
  styleUrls: ['./sigma.component.css']
})
export class SigmaComponent implements AfterViewInit, OnDestroy {
  @ViewChild("container") container: ElementRef | null = null;
  @Input("graph") graph: Graph = new Graph()
  sigma?: Sigma;

  @ViewChild("search-input") searchInput!: ElementRef;
  @ViewChild("suggestions") searchSuggestions!: ElementRef;
  // searchInput = document.getElementById("search-input") as HTMLInputElement;
  // searchSuggestions = document.getElementById("suggestions") as HTMLDataListElement;

  state: State = { searchQuery: "" };

  constructor() {    
  }

  ngAfterViewInit(): void {
    if (this.container)
      this.sigma = new Sigma(this.graph, this.container.nativeElement, {
        renderEdgeLabels: true
      });

      console.log(this.container?.nativeElement)

    // Feed the datalist autocomplete values:
    // this.searchSuggestions.innerHTML = this.graph
    //   .nodes()
    //   .map((node) => `<option value="${this.graph.getNodeAttribute(node, "label")}"></option>`)
    //   .join("\n");


    // Bind graph interactions:
    this.sigma?.on("enterNode", ({ node }) => {
      this.setHoveredNode(node);
    });
    this.sigma?.on("leaveNode", () => {
      this.setHoveredNode(undefined);
    });

    // Render nodes accordingly to the internal state:
    // 1. If a node is selected, it is highlighted
    // 2. If there is query, all non-matching nodes are greyed
    // 3. If there is a hovered node, all non-neighbor nodes are greyed
    this.sigma?.setSetting("nodeReducer", (node, data) => {
      const res: Partial<NodeDisplayData> = { ...data };

      if (this.state.hoveredNeighbors && ! this.state.hoveredNeighbors.has(node.toString()) && this.state.hoveredNode !== node) {
        res.label = "";
        res.color = "#f6f6f6";
      }

      if (this.state.selectedNode === node) {
        res.highlighted = true;
      } else if (this.state.suggestions && ! this.state.suggestions.has(node.toString())) {
        res.label = "";
        res.color = "#f6f6f6";
      }

      return res;
    });

    // Render edges accordingly to the internal state:
    // 1. If a node is hovered, the edge is hidden if it is not connected to the
    //    node
    // 2. If there is a query, the edge is only visible if it connects two
    //    suggestions
    this.sigma?.setSetting("edgeReducer", (edge, data) => {
      const res: Partial<EdgeDisplayData> = { ...data };

      if (this.state.hoveredNode && !this.graph.hasExtremity(edge, this.state.hoveredNode)) {
        res.hidden = true;
      }

      if (this.state.suggestions && (!this.state.suggestions.has(this.graph.source(edge)) || !this.state.suggestions.has(this.graph.target(edge)))) {
        res.hidden = true;
      }

      return res;
    });


  }

  ngOnDestroy(): void {
    if (this.sigma) {
      this.sigma.kill();
    }
  }

  // Actions:
  setSearchQuery(query: string) {
    this.state.searchQuery = query;

    if (this.searchInput.nativeElement.innerHTML !== query) this.searchInput.nativeElement.innerHTML = query;

    if (query) {
      const lcQuery = query.toLowerCase();
      const suggestions = this.graph
        .nodes()
        .map((n) => ({ id: n, label: this.graph.getNodeAttribute(n, "label") as string }))
        .filter(({ label }) => label.toLowerCase().includes(lcQuery));

      // If we have a single perfect match, them we remove the suggestions, and
      // we consider the user has selected a node through the datalist
      // autocomplete:
      if (suggestions.length === 1 && suggestions[0].label === query) {
        this.state.selectedNode = suggestions[0].id;
        this.state.suggestions = undefined;

        // Move the camera to center it on the selected node:
        const nodePosition = this.sigma?.getNodeDisplayData(this.state.selectedNode) as Coordinates;
        this.sigma?.getCamera().animate(nodePosition, {
          duration: 500,
        });
      }
      // Else, we display the suggestions list:
      else {
        this.state.selectedNode = undefined;
        this.state.suggestions = new Set(suggestions.map(({ id }) => id));
      }
    }
    // If the query is empty, then we reset the selectedNode / suggestions state:
    else {
      this.state.selectedNode = undefined;
      this.state.suggestions = undefined;
    }

    // Refresh rendering:
    this.sigma?.refresh();
  }

  setHoveredNode(node?: string) {
    if (node) {
      this.state.hoveredNode = node;
      this.state.hoveredNeighbors = new Set(this.graph.neighbors(node));
    } else {
      this.state.hoveredNode = undefined;
      this.state.hoveredNeighbors = undefined;
    }

    // Refresh rendering:
    this.sigma?.refresh();
  }


}
