import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { SpinItem } from '../types';

interface StrikeZoneHeatmapD3Props {
  spins: SpinItem[];
}

export default function StrikeZoneHeatmapD3({ spins }: StrikeZoneHeatmapD3Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle Resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0 || !containerRef.current) return;

    // Process data: Win density per Double Street (DS)
    // Double Streets are 1-6, 7-12, 13-18, 19-24, 25-30, 31-36
    const zones = [
      { name: 'DS1', count: 0 },
      { name: 'DS2', count: 0 },
      { name: 'DS3', count: 0 },
      { name: 'DS4', count: 0 },
      { name: 'DS5', count: 0 },
      { name: 'DS6', count: 0 },
    ];

    spins.forEach(spin => {
      if (spin.hit > 0 && spin.hit <= 36 && spin.strikeType === 'Win') {
        const dsIndex = Math.floor((spin.hit - 1) / 6);
        if (zones[dsIndex]) {
          // Count only wins to calculate "win density"
          zones[dsIndex].count++;
        }
      }
    });

    const maxCount = d3.max(zones, d => d.count) || 1;

    // Setup D3 Chart
    const margin = { top: 10, right: 10, bottom: 20, left: 20 };
    const chartWidth = dimensions.width - margin.left - margin.right;
    const chartHeight = dimensions.height - margin.top - margin.bottom;

    const svg = d3.select(containerRef.current)
      .selectAll('svg')
      .data([null])
      .join('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    const g = svg.selectAll('g.chart-area')
      .data([null])
      .join('g')
      .attr('class', 'chart-area')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale
    const x = d3.scaleBand()
      .range([0, chartWidth])
      .domain(zones.map(d => d.name))
      .padding(0.2);

    // Y Scale
    const y = d3.scaleLinear()
      .range([chartHeight, 0])
      .domain([0, maxCount]);

    // Color Scale (Heatmap gradient from blue to hot red/pink)
    const colorScale = d3.scaleSequential()
      .interpolator(d3.interpolateInferno)
      .domain([0, maxCount * 1.5]); // offset to avoid picking the dark/black part for 0

    // X Axis
    (g.selectAll('g.x-axis')
      .data([null])
      .join('g') as any)
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call((g: any) => g.select(".domain").remove())
      .selectAll("text")
      .style('fill', '#64748b')
      .style('font-size', '10px');

    // Y Axis
    (g.selectAll('g.y-axis')
      .data([null])
      .join('g') as any)
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y).ticks(4).tickFormat(d3.format('d')))
      .call((g: any) => g.select(".domain").remove())
      .selectAll("text")
      .style('fill', '#64748b')
      .style('font-size', '10px');

    // Grid lines (horizontal)
    g.selectAll("g.grid-lines")
      .data([null])
      .join("g")
      .attr("class", "grid-lines")
      .selectAll("line")
      .data(y.ticks(4))
      .join("line")
      .attr("x1", 0)
      .attr("x2", chartWidth)
      .attr("y1", d => y(d))
      .attr("y2", d => y(d))
      .attr("stroke", "#1e293b")
      .attr("stroke-dasharray", "3 3");

    // Bars
    g.selectAll('rect.bar')
      .data(zones)
      .join(
        enter => enter.append('rect')
          .attr('class', 'bar')
          .attr('x', d => x(d.name)!)
          .attr('y', chartHeight)
          .attr('width', x.bandwidth())
          .attr('height', 0)
          .attr('fill', d => d.count === 0 ? '#1e293b' : colorScale(d.count))
          .attr('rx', 4)
          .attr('ry', 4)
          .call(enter => enter.transition().duration(800)
            .attr('y', d => y(d.count))
            .attr('height', d => chartHeight - y(d.count))),
        update => update.call(update => update.transition().duration(800)
          .attr('x', d => x(d.name)!)
          .attr('width', x.bandwidth())
          .attr('y', d => y(d.count))
          .attr('height', d => chartHeight - y(d.count))
          .attr('fill', d => d.count === 0 ? '#1e293b' : colorScale(d.count))),
        exit => exit.transition().duration(800)
          .attr('y', chartHeight)
          .attr('height', 0)
          .remove()
      );

    // Values on top of bars
    g.selectAll('text.bar-label')
      .data(zones)
      .join(
        enter => enter.append('text')
          .attr('class', 'bar-label')
          .attr('x', d => x(d.name)! + x.bandwidth() / 2)
          .attr('y', chartHeight)
          .attr('text-anchor', 'middle')
          .style('fill', '#fff')
          .style('font-size', '10px')
          .style('font-weight', 'bold')
          .style('opacity', 0)
          .text(d => d.count > 0 ? d.count : '')
          .call(enter => enter.transition().duration(800).delay(100)
            .attr('y', d => y(d.count) - 5)
            .style('opacity', 1)),
        update => update.call(update => update.transition().duration(800)
          .attr('x', d => x(d.name)! + x.bandwidth() / 2)
          .attr('y', d => y(d.count) - 5)
          .text(d => d.count > 0 ? d.count : '')),
        exit => exit.remove()
      );

  }, [spins, dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[180px]" />
  );
}
