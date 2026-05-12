/**
 * Chart Extractor Utility
 * Extracts and parses tables from markdown content for ECharts visualization
 */

export interface TableData {
  headers: string[];
  rows: string[][];
  rawTable: string;
  caption?: string;
}

export interface ParsedChartData {
  type: 'pie' | 'bar' | 'line' | 'mixed';
  title: string;
  data: any;
  sourceTable?: TableData;
}

// Common year patterns for detection
const YEAR_PATTERNS = [
  /^\d{4}$/,           // 2020
  /^\d{4}[-/]\d{2}$/,  // 2020-01, 2020/01
  /^(FY\s?)?\d{4}[-/]\d{2}$/i, // FY2020-01, FY2020/01
  /^\d{4}年$/,         // 2020年
  /^\d{2}Q\d$/,        // 24Q1, 2023Q1
];

// Numeric patterns
const NUMERIC_PATTERN = /^[\d,.%+-]+$/;

/**
 * Check if a string looks like a year
 */
function isYearLike(value: string): boolean {
  const trimmed = value.trim();
  return YEAR_PATTERNS.some(pattern => pattern.test(trimmed));
}

/**
 * Check if a string looks like a numeric value
 */
function isNumeric(value: string): boolean {
  const trimmed = value.trim();
  // Remove common formatting characters
  const cleaned = trimmed.replace(/[,$%¥€£]/g, '');
  return NUMERIC_PATTERN.test(cleaned) && !isNaN(parseFloat(cleaned));
}

/**
 * Parse a numeric value from string
 */
function parseNumeric(value: string): number | null {
  const trimmed = value.trim();
  const cleaned = trimmed.replace(/[,$%¥€£]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Extract all tables from markdown content
 */
export function extractTables(markdown: string): TableData[] {
  const tables: TableData[] = [];
  
  // Match markdown table pattern
  const tableRegex = /\|(.+)\|\s*\n\|[-:\s|]+\|\s*\n((?:\|.+\|\s*\n?)+)/g;
  
  let match;
  while ((match = tableRegex.exec(markdown)) !== null) {
    const headerLine = match[1];
    const bodyLines = match[2].trim().split('\n');
    
    // Parse headers
    const headers = headerLine.split('|')
      .map(h => h.trim())
      .filter(h => h.length > 0);
    
    // Parse rows
    const rows = bodyLines
      .map(line => line.split('|').map(cell => cell.trim()).filter((c, i) => i > 0 && i <= headers.length))
      .filter(row => row.length >= 2 && row.some(cell => cell.length > 0));
    
    if (rows.length >= 2) {
      tables.push({
        headers,
        rows,
        rawTable: match[0],
      });
    }
  }
  
  return tables;
}

/**
 * Extract caption from text before table
 */
function extractTableCaption(markdown: string, tableStart: number): string | undefined {
  const beforeTable = markdown.substring(Math.max(0, tableStart - 500), tableStart);
  const lines = beforeTable.split('\n').reverse();
  
  for (const line of lines) {
    const trimmed = line.trim();
    const headingMatch = trimmed.match(/^#{1,4}\s+(.+)$/);
    if (headingMatch) {
      return headingMatch[1].replace(/[#💰🌍📈💱🏦⚡]+/g, '').trim();
    }
    const boldMatch = trimmed.match(/\*\*(.+?)\*\*/);
    if (boldMatch) {
      return boldMatch[1].trim();
    }
  }
  
  return undefined;
}

/**
 * Determine chart type based on table structure
 */
function determineChartType(headers: string[], rows: string[][]): 'pie' | 'bar' | 'line' | 'mixed' {
  const numericColumnIndices: number[] = [];
  headers.forEach((header, index) => {
    if (rows.length > 0 && isNumeric(rows[0][index])) {
      numericColumnIndices.push(index);
    }
  });
  
  const firstColIsYear = rows.length > 0 && isYearLike(rows[0][0]);
  
  if (headers.length === 2 && numericColumnIndices.length === 1) {
    return 'pie';
  }
  
  if (firstColIsYear && numericColumnIndices.length >= 1) {
    if (numericColumnIndices.length === 1) {
      return 'line';
    }
    return 'mixed';
  }
  
  if (numericColumnIndices.length === 1) {
    return 'bar';
  }
  
  if (numericColumnIndices.length > 1) {
    return 'mixed';
  }
  
  return 'bar';
}

/**
 * Parse table data for ECharts
 */
export function parseTableForChart(table: TableData, caption?: string): ParsedChartData {
  const { headers, rows } = table;
  const chartType = determineChartType(headers, rows);
  
  let labelColIndex = 0;
  const numericColIndices: number[] = [];
  
  if (rows.length > 0 && isYearLike(rows[0][0])) {
    labelColIndex = 0;
  } else {
    for (let i = 0; i < headers.length; i++) {
      if (!isNumeric(rows[0][i])) {
        labelColIndex = i;
        break;
      }
    }
  }
  
  for (let i = 0; i < headers.length; i++) {
    if (i !== labelColIndex && rows.length > 0 && isNumeric(rows[0][i])) {
      numericColIndices.push(i);
    }
  }
  
  let chartData: any;
  
  if (chartType === 'pie') {
    const data = rows
      .map(row => ({
        name: row[labelColIndex] || '',
        value: parseNumeric(row[numericColIndices[0]]) || 0,
      }))
      .filter(d => d.name && d.value !== null);
    
    chartData = {
      series: [{
        type: 'pie',
        data,
        radius: ['40%', '70%'],
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        label: {
          show: data.length <= 8,
          formatter: '{b}: {d}%',
          color: '#e8e8e8',
        },
      }],
    };
  } else if (chartType === 'line') {
    const xAxisData = rows.map(row => row[labelColIndex]);
    
    const series = numericColIndices.map((colIdx, idx) => ({
      name: headers[colIdx] || `系列${idx + 1}`,
      type: 'line',
      data: rows.map(row => parseNumeric(row[colIdx]) ?? null),
      smooth: true,
      showSymbol: true,
      lineStyle: { width: 3 },
    }));
    
    const colors = ['#448aff', '#00e676', '#ff9100', '#ff5252', '#a0a0b0'];
    series.forEach((s, idx) => {
      s.lineStyle.color = colors[idx % colors.length];
      s.itemStyle = { color: colors[idx % colors.length] };
    });
    
    chartData = {
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLine: { lineStyle: { color: '#2a3a5c' } },
        axisLabel: { color: '#a0a0b0', rotate: 45 },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#2a3a5c' } },
        axisLabel: { color: '#a0a0b0' },
        splitLine: { lineStyle: { color: '#2a3a5c', type: 'dashed' } },
      },
      series,
    };
  } else {
    const xAxisData = rows.map(row => row[labelColIndex]);
    
    const series = numericColIndices.map((colIdx, idx) => {
      const isSingleSeries = numericColIndices.length === 1;
      return {
        name: headers[colIdx] || `系列${idx + 1}`,
        type: isSingleSeries ? 'bar' : (idx === 0 ? 'bar' : 'line'),
        data: rows.map(row => parseNumeric(row[colIdx]) ?? null),
        yAxisIndex: idx > 0 ? 1 : 0,
        barWidth: isSingleSeries ? '60%' : '40%',
        itemStyle: {
          color: isSingleSeries 
            ? { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
                { offset: 0, color: '#448aff' },
                { offset: 1, color: '#1f4068' },
              ]}
            : ['#448aff', '#00e676', '#ff9100', '#ff5252'][idx % 4],
          borderRadius: isSingleSeries ? [4, 4, 0, 0] : undefined,
        },
        lineStyle: idx > 0 ? { width: 3, color: ['#448aff', '#00e676', '#ff9100', '#ff5252'][idx % 4] } : undefined,
      };
    });
    
    const yAxisConfig = numericColIndices.length > 1 ? [
      {
        type: 'value' as const,
        name: headers[numericColIndices[0]] || '',
        nameTextStyle: { color: '#a0a0b0' },
        axisLine: { lineStyle: { color: '#2a3a5c' } },
        axisLabel: { color: '#a0a0b0' },
        splitLine: { lineStyle: { color: '#2a3a5c', type: 'dashed' } },
      },
      {
        type: 'value' as const,
        name: headers[numericColIndices[1]] || '',
        nameTextStyle: { color: '#a0a0b0' },
        axisLine: { lineStyle: { color: '#2a3a5c' } },
        axisLabel: { color: '#a0a0b0' },
        splitLine: { show: false },
      },
    ] : {
      type: 'value' as const,
      axisLine: { lineStyle: { color: '#2a3a5c' } },
      axisLabel: { color: '#a0a0b0' },
      splitLine: { lineStyle: { color: '#2a3a5c', type: 'dashed' } },
    };
    
    chartData = {
      xAxis: {
        type: 'category' as const,
        data: xAxisData,
        axisLine: { lineStyle: { color: '#2a3a5c' } },
        axisLabel: { color: '#a0a0b0', rotate: 45 },
      },
      yAxis: yAxisConfig,
      series,
    };
  }
  
  return {
    type: chartType,
    title: caption || `数据可视化`,
    data: chartData,
    sourceTable: table,
  };
}

/**
 * Extract all tables from markdown and convert to chart data
 */
export function extractChartsFromMarkdown(markdown: string): ParsedChartData[] {
  const tables = extractTables(markdown);
  const charts: ParsedChartData[] = [];
  
  tables.forEach(table => {
    if (table.rows.length < 3) {
      return;
    }
    
    const tableStart = markdown.indexOf(table.rawTable);
    const caption = extractTableCaption(markdown, tableStart);
    const parsed = parseTableForChart(table, caption);
    charts.push(parsed);
  });
  
  return charts;
}
