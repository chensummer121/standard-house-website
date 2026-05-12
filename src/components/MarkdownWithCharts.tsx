'use client';

import { useMemo } from 'react';
import AutoChart, { AutoChartData } from './charts/AutoChart';
import { extractChartsFromMarkdown, TableData } from '../utils/chartExtractor';

interface MarkdownWithChartsProps {
  content: string;
  chartHeight?: number;
  showRawTables?: boolean;
}

function tableToHtml(table: TableData): string {
  const { headers, rows } = table;
  
  let html = '<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.875rem;">';
  
  html += '<thead><tr>';
  headers.forEach(h => {
    html += '<th style="border: 1px solid var(--border-color); padding: 0.75rem; text-align: left; background: var(--bg-secondary); font-weight: 600; color: var(--text-primary);">' + h + '</th>';
  });
  html += '</tr></thead>';
  
  html += '<tbody>';
  rows.forEach((row, idx) => {
    html += '<tr style="' + (idx % 2 === 1 ? 'background: rgba(68, 138, 255, 0.05);' : '') + '">';
    row.forEach(cell => {
      html += '<td style="border: 1px solid var(--border-color); padding: 0.75rem; color: var(--text-secondary);">' + cell + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  
  return html;
}

function markdownToHtml(markdown: string, tables: TableData[]): string {
  let html = markdown;
  
  tables.forEach((table, idx) => {
    const placeholder = '__TABLE_' + idx + '__';
    html = html.replace(table.rawTable, placeholder);
  });
  
  html = html.replace(/^#### (.+)$/gm, '<h4 style="font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.75rem; color: var(--text-primary);">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 style="font-size: 1.5rem; font-weight: 600; margin: 1.5rem 0 0.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; color: var(--text-primary);">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 style="font-size: 1.75rem; font-weight: 600; margin: 2rem 0 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; color: var(--text-primary);">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 style="font-size: 2rem; font-weight: 700; margin: 2rem 0 1rem; color: var(--text-primary);">$1</h1>');
  
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: 600; color: var(--text-primary);">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/^> (.+)$/gm, '<blockquote style="border-left: 4px solid var(--accent-green); padding-left: 1rem; margin: 1.5rem 0; background: var(--bg-secondary); padding: 1rem; border-radius: 0 8px 8px 0;"><p style="margin: 0; color: var(--text-primary);">$1</p></blockquote>');
  html = html.replace(/`([^`]+)`/g, '<code style="background: var(--bg-secondary); padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.9em;">$1</code>');
  html = html.replace(/^---$/gm, '<hr style="border: none; border-top: 1px solid var(--border-color); margin: 2rem 0;" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: var(--accent-green); text-decoration: underline;">$1</a>');
  html = html.replace(/^- (.+)$/gm, '<li style="margin: 0.5rem 0; line-height: 1.7;">$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li style="margin: 0.5rem 0; line-height: 1.7;">$1</li>');
  html = html.replace(/^(?!<[a-z]|$)(.+)$/gm, '<p style="margin: 0.75rem 0; line-height: 1.8; color: var(--text-secondary);">$1</p>');
  
  tables.forEach((table, idx) => {
    html = html.replace('__TABLE_' + idx + '__', tableToHtml(table));
  });
  
  return html;
}

export default function MarkdownWithCharts({ content, chartHeight = 400, showRawTables = true }: MarkdownWithChartsProps) {
  const { charts, tables, html } = useMemo(() => {
    const extractedCharts = extractChartsFromMarkdown(content);
    const tableRegex = /\|(.+)\|\s*\n\|[-:\s|]+\|\s*\n((?:\|.+\|\s*\n?)+)/g;
    const tables: TableData[] = [];
    let match;
    const contentCopy = content;
    
    while ((match = tableRegex.exec(contentCopy)) !== null) {
      const headerLine = match[1];
      const bodyLines = match[2].trim().split('\n');
      
      const headers = headerLine.split('|').map(h => h.trim()).filter(h => h.length > 0);
      const rows = bodyLines.map(line => line.split('|').map(cell => cell.trim()).filter((c, i) => i > 0 && i <= headers.length)).filter(row => row.length >= 2 && row.some(cell => cell.length > 0));
      
      if (rows.length >= 2) {
        tables.push({ headers, rows, rawTable: match[0] });
      }
    }
    
    const convertedHtml = markdownToHtml(content, tables);
    return { charts: extractedCharts, tables, html: convertedHtml };
  }, [content]);

  if (charts.length === 0) {
    return (
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} style={{ color: 'var(--text-secondary)' }} />
    );
  }

  return (
    <div className="markdown-with-charts">
      {charts.map((chart, idx) => (
        <AutoChart
          key={'chart-' + idx}
          chartData={chart}
          height={chartHeight}
          showRawTable={showRawTables}
          rawTableHtml={chart.sourceTable ? tableToHtml(chart.sourceTable) : undefined}
          index={idx}
        />
      ))}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} style={{ color: 'var(--text-secondary)' }} />
    </div>
  );
}
