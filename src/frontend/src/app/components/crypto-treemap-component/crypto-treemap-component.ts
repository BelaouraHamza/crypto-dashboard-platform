import { isPlatformBrowser } from '@angular/common';
import { Component, Input, ElementRef, AfterViewInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import * as d3 from 'd3';

interface CryptoNode {
  symbol: string;
  value: number;
  current_price: number;
  price_change_percentage_24h: number;
}

@Component({
  selector: 'app-crypto-treemap',
  templateUrl: './crypto-treemap-component.html',
  styleUrls: ['./crypto-treemap-component.scss'],
  host: {
    ngSkipHydration: 'true'
  }
})
export class CryptoTreemapComponent implements AfterViewInit, OnDestroy {
  private _cryptoData: CryptoNode[] = [];
  private initialized = false;
  private isBrowser: boolean;
  private resizeListener?: () => void;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

@Input()
set cryptoData(data: any[]) {
this._cryptoData = (data || []).map(c => {
  return {
    symbol: c.symbol,                     
    value: +c.marketCap || 0,              
    current_price:  +c.currentPrice || 0,    
    price_change_24h: +c.priceChange24h || 0,              
    price_change_percentage_24h: +c.priceChangePercentage24h || 0 
  };
});

  if (this.initialized && this._cryptoData.length && this.isBrowser) this.drawTreemap();
}


  ngAfterViewInit() {
    this.initialized = true;
    if (this._cryptoData.length && this.isBrowser) this.drawTreemap();

    if (this.isBrowser) {
      this.resizeListener = this.drawTreemap.bind(this);
      window.addEventListener('resize', this.resizeListener);
    }
  }

  ngOnDestroy() {
    if (this.isBrowser && this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  /**
   * Formats a price in dollars as a string.
   * @param val the price in dollars
   * @returns a string representation of the price
   */
  private formatPrice(val: number): string {
    // 1 billion
    if (val >= 1_000_000_000) {
      return '$' + (val / 1_000_000_000).toFixed(1) + 'B';
    }
    // 1 million
    if (val >= 1_000_000) {
      return '$' + (val / 1_000_000).toFixed(1) + 'M';
    }
    // 1 thousand
    if (val >= 1_000) {
      return '$' + (val / 1_000).toFixed(1) + 'K';
    }
    // otherwise, just show the number with 2 decimal places
    return '$' + val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  /**
   * Formats a price change as a string.
   * @param val the price change (in percent)
   * @returns a string representation of the price change
   */
  private formatChange(val: number): string {
    return (val > 0 ? '+' : '') + val.toFixed(2) + '%';
  }

  /**
   * Draws a treemap chart into the container element.
   * The treemap layout is computed using D3.js.
   * Each leaf node is represented by a rectangle, whose size is proportional
   * to the value of the node.
   * The color of each rectangle is determined by the price change in 24 hours,
   * with red for negative and green for positive changes.
   * The chart also includes labels for each node, with the symbol, current price,
   * and price change. The labels are centered and multi-line.
   */
  private drawTreemap() {
    const container = this.el.nativeElement.querySelector('#treemap');

    d3.select(container).select('svg').remove();
    if (!this._cryptoData || this._cryptoData.length === 0) return;

    // Responsive dimensions
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // D3.js hierarchical data structure
    const root = d3.hierarchy<{ children: CryptoNode[] } | CryptoNode>({ children: this._cryptoData })
      .sum((d: any) => (d.value ?? 0));

    // Compute the treemap layout
    d3.treemap<any>()
      .size([width, height])
      .padding(2)(root);

    // Create the SVG element
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Draw the rectangles for each node
    svg.selectAll('rect')
      .data(root.leaves())
      .enter()
      .append('rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('fill', (d: any) => {
        const pct = d.data.price_change_percentage_24h;
        return pct < 0
          ? d3.interpolateRgb('#dc2626', '#ff6161')(Math.min(1, Math.abs(pct / 8)))
          : d3.interpolateRgb('#16a34a', '#c1f2d3')(Math.min(1, pct / 8));
      })
      .attr('stroke', '#222')
      .attr('stroke-width', 0.8);

    // Draw the labels for each node
    svg.selectAll('label')
      .data(root.leaves())
      .enter()
      .append('text')
      .attr('x', (d: any) => (d.x0 + d.x1) / 2)
      .attr('y', (d: any) => (d.y0 + d.y1) / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('pointer-events', 'none')
      .style('font-family', 'Roboto, Arial, sans-serif')
      .each((d: any, i: number, nodes: ArrayLike<SVGTextElement>) => {
        const g = d3.select(nodes[i]);
        const w = d.x1 - d.x0, h = d.y1 - d.y0;
        if (w < 55 || h < 40) return; // too small for label

        const big = Math.max(24, Math.min(58, h / 2.3));
        const mid = Math.max(12, Math.min(32, h / 7));
        const small = Math.max(10, Math.min(20, h / 10));

        let y = (d.y0 + d.y1) / 2 - big/1.2;

        // SYMBOL
        g.append('tspan')
          .attr('x', (d.x0 + d.x1) / 2)
          .attr('y', y)
          .attr('font-size', mid)
          .attr('font-weight', 'bold')
          .attr('fill', '#fff')
          .text(d.data.symbol);

        // PRICE
        y += big * 1.12;
        g.append('tspan')
          .attr('x', (d.x0 + d.x1) / 2)
          .attr('y', y)
          .attr('font-size', small)
          .attr('fill', '#fff')
          .text(this.formatPrice(d.data.current_price));

        // CHANGE
        y += mid * 1.08;
        g.append('tspan')
          .attr('x', (d.x0 + d.x1) / 2)
          .attr('y', y)
          .attr('font-size', small)
          .attr('fill', d.data.price_change_percentage_24h < 0 ? '#ffcaca' : '#b6fad1')
          .text(this.formatChange(d.data.price_change_percentage_24h));
      });
  }
}


