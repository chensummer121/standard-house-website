'use client';

import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

export interface AutoChartData {
  type: 'pie' | 'bar' | 'line' | 'mixed';
  title: string;
  data: any;
}

interface AutoChartProps {
  chartData: AutoChartData;
  height?: number;
  showRawTable?: boolean;
  rawTableHtml?: string;
  index?: number;
}

const CHART_COLORS = [
  '#448aff', '#00e676', '#ff9100', '#ff5252', '#a0a0b0',
  '#e040fb', '#ffd740', '#18ffff',
];

export default function AutoChart({ 
  chartData, 
  height = 400,
  showRawTable = false,
  rawTableHtml,
  index = 0
}: AutoChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispose();
    }

    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    const { type, title, data } = chartData;

    const baseOption: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: title,
        left: 'center',
        top: 10,
        textStyle: {
          color: '#e8e8e8',
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: type === 'pie' ? 'item' : 'axis',
        backgroundColor: '#1f4068',
        borderColor: '#2a3a5c',
        textStyle: { color: '#e8e8e8' },
        axisPointer: type !== 'pie' ? { type: 'cross' } : undefined,
        formatter: type === 'pie' 
          ? (params: any) => {
              return `<div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">${params.name}</div><div style="color: #a0a0b0;"><div>数值: ${params.value}</div><div>占比: ${params.percent.toFixed(1)}%</div></div>`;
            }
          : (params: any) => {
              let html = `<div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">${params[0].axisValue}</div>`;
              params.forEach((p: any) => {
                if (p.value !== null) {
                  html += `<div style="color: ${p.color}; margin: 4px 0;"><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${p.color}; margin-right: 5px;"></span>${p.seriesName}: ${p.value}</div>`;
                }
              });
              return html;
            },
      },
      legend: type === 'pie' || (data.series && data.series.length > 1) ? {
        orient: 'vertical',
        right: '2%',
        top: 'middle',
        textStyle: { color: '#a0a0b0' },
        itemWidth: 12,
        itemHeight: 12,
      } : undefined,
      grid: {
        left: '8%',
        right: type === 'pie' ? '20%' : '5%',
        top: '15%',
        bottom: '15%',
        containLabel: true,
      },
    };

    let typeSpecificOption: echarts.EChartsOption = {};

    if (type === 'pie') {
      typeSpecificOption = {
        series: [{
          ...data.series[0],
          center: ['45%', '55%'],
          itemStyle: {
            borderRadius: 6,
            borderColor: '#1b1b2f',
            borderWidth: 2,
          },
          labelLine: { lineStyle: { color: '#2a3a5c' } },
        }],
      };
    } else if (type === 'line') {
      typeSpecificOption = {
        xAxis: data.xAxis,
        yAxis: data.yAxis,
        series: data.series.map((s: any, idx: number) => ({
          ...s,
          lineStyle: { ...s.lineStyle, color: CHART_COLORS[idx % CHART_COLORS.length] },
          itemStyle: { color: CHART_COLORS[idx % CHART_COLORS.length] },
          areaStyle: idx === 0 ? { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(68, 138, 255, 0.4)' }, { offset: 1, color: 'rgba(68, 138, 255, 0.05)' }] } } : undefined,
        })),
      };
    } else {
      typeSpecificOption = {
        xAxis: data.xAxis,
        yAxis: data.yAxis,
        series: data.series.map((s: any, idx: number) => ({
          ...s,
          itemStyle: { ...s.itemStyle, color: s.itemStyle?.color || CHART_COLORS[idx % CHART_COLORS.length] },
          lineStyle: s.lineStyle ? { ...s.lineStyle, color: CHART_COLORS[idx % CHART_COLORS.length] } : undefined,
        })),
      };
    }

    const finalOption = echarts.util.merge(baseOption, typeSpecificOption);
    chart.setOption(finalOption, true);

    const handleResize = () => { chart.resize(); };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, [chartData, isClient]);

  if (!isClient) {
    return (
      <div style={{ height: `${height}px`, background: 'var(--bg-card)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        加载图表中...
      </div>
    );
  }

  return (
    <div className="auto-chart-container" style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem' }}>{chartData.type === 'pie' ? '📊' : chartData.type === 'line' ? '📈' : '📉'}</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{chartData.title}</span>
          <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', background: chartData.type === 'pie' ? 'rgba(68, 138, 255, 0.2)' : chartData.type === 'line' ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 145, 0, 0.2)', color: chartData.type === 'pie' ? '#448aff' : chartData.type === 'line' ? '#00e676' : '#ff9100' }}>
            {chartData.type === 'pie' ? '饼图' : chartData.type === 'line' ? '折线图' : '柱状图'}
          </span>
        </div>
        {showRawTable && (
          <button onClick={() => setIsExpanded(!isExpanded)} style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: isExpanded ? 'var(--accent-blue)' : 'transparent', color: isExpanded ? 'white' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}>
            {isExpanded ? '收起表格' : '查看原始数据'}
          </button>
        )}
      </div>
      <div ref={chartRef} style={{ height: `${height}px`, width: '100%' }} />
      {showRawTable && isExpanded && rawTableHtml && (
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', maxHeight: '300px', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: rawTableHtml }} />
      )}
    </div>
  );
}
