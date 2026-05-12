/**
 * Auto-chart: Automatically convert HTML tables to ECharts visualizations
 * Scans .prose tables with numeric data and renders charts above them
 */
(function() {
  // Load ECharts dynamically
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js';
  script.onload = initCharts;
  document.head.appendChild(script);

  function initCharts() {
    var tables = document.querySelectorAll('.prose table');
    tables.forEach(function(table) {
      try {
        var data = parseTable(table);
        if (data && data.rows.length >= 2 && hasNumericData(data)) {
          renderChart(table, data);
        }
      } catch(e) {
        // Silently skip tables that can't be parsed
      }
    });
  }

  function parseTable(table) {
    var headers = [];
    var rows = [];
    var ths = table.querySelectorAll('thead th');
    if (ths.length > 0) {
      ths.forEach(function(th) { headers.push(th.textContent.trim()); });
    } else {
      var firstRow = table.querySelector('tr');
      if (!firstRow) return null;
      firstRow.querySelectorAll('th, td').forEach(function(cell) {
        headers.push(cell.textContent.trim());
      });
    }

    var bodyRows = table.querySelectorAll('tbody tr');
    if (bodyRows.length === 0) {
      bodyRows = table.querySelectorAll('tr');
      if (ths.length === 0 && bodyRows.length > 0) {
        bodyRows = Array.from(bodyRows).slice(1);
      }
    }

    bodyRows.forEach(function(tr) {
      var cells = tr.querySelectorAll('td');
      if (cells.length === 0) cells = tr.querySelectorAll('th, td');
      var row = [];
      cells.forEach(function(cell) { row.push(cell.textContent.trim()); });
      if (row.length >= 2) rows.push(row);
    });

    if (headers.length < 2 || rows.length < 2) return null;
    return { headers: headers, rows: rows };
  }

  function hasNumericData(data) {
    var numCount = 0;
    var total = 0;
    data.rows.forEach(function(row) {
      for (var i = 1; i < row.length; i++) {
        total++;
        var val = parseNum(row[i]);
        if (!isNaN(val)) numCount++;
      }
    });
    return total > 0 && numCount / total > 0.5;
  }

  function parseNum(str) {
    if (!str) return NaN;
    var cleaned = str.replace(/[,%~*$↑↓→↗↘]/g, '').replace(/[（(].*?[)）]/g, '').trim();
    // Handle Chinese units
    cleaned = cleaned.replace(/万亿/g, 'e8').replace(/亿/g, 'e4').replace(/万/g, 'e3');
    return parseFloat(cleaned);
  }

  function isYear(str) {
    var n = parseInt(str);
    return n >= 1990 && n <= 2035;
  }

  function renderChart(table, data) {
    var container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '350px';
    container.style.marginBottom = '1rem';
    container.style.background = 'rgba(15, 23, 42, 0.5)';
    container.style.borderRadius = '8px';
    container.style.padding = '0.5rem';
    table.parentNode.insertBefore(container, table);

    // Make original table collapsible
    var wrapper = document.createElement('div');
    var toggle = document.createElement('button');
    toggle.textContent = '📊 查看原始数据';
    toggle.style.cssText = 'font-size:0.75rem;color:var(--text-secondary);background:none;border:1px solid var(--border-color);padding:4px 12px;border-radius:4px;cursor:pointer;margin-bottom:0.5rem;';
    wrapper.appendChild(toggle);
    table.style.display = 'none';
    wrapper.appendChild(table);
    container.parentNode.insertBefore(wrapper, container.nextSibling);
    toggle.onclick = function() {
      table.style.display = table.style.display === 'none' ? '' : 'none';
    };

    var chart = echarts.init(container);
    var option = buildOption(data);
    chart.setOption(option);

    // Responsive
    var ro = new ResizeObserver(function() { chart.resize(); });
    ro.observe(container);
  }

  function buildOption(data) {
    var h = data.headers;
    var rows = data.rows;
    
    // Detect chart type
    var firstColIsYear = rows.every(function(r) { return isYear(r[0]); });
    var numericCols = [];
    for (var i = 1; i < h.length; i++) {
      var allNum = rows.every(function(r) { return !isNaN(parseNum(r[i])); });
      if (allNum) numericCols.push(i);
    }

    var categories = rows.map(function(r) { return r[0]; });
    var darkBg = 'transparent';
    var textColor = '#9ca3af';
    var axisLineColor = '#374151';

    if (firstColIsYear && numericCols.length > 0) {
      // Line/Bar chart for time series
      var series = numericCols.map(function(colIdx, idx) {
        var values = rows.map(function(r) { return parseNum(r[colIdx]); });
        return {
          name: h[colIdx],
          type: numericCols.length === 1 ? 'bar' : (idx === 0 ? 'bar' : 'line'),
          data: values,
          smooth: true,
          itemStyle: { borderRadius: numericCols.length === 1 ? [4,4,0,0] : 0 },
          lineStyle: { width: 2 },
          areaStyle: numericCols.length === 1 ? { opacity: 0.15 } : undefined
        };
      });

      return {
        backgroundColor: darkBg,
        tooltip: { trigger: 'axis', backgroundColor: '#1e293b', borderColor: '#374151', textStyle: { color: '#e5e7eb' } },
        legend: { show: numericCols.length > 1, textStyle: { color: textColor } },
        grid: { left: '3%', right: '4%', bottom: '3%', top: numericCols.length > 1 ? '40px' : '20px', containLabel: true },
        xAxis: { type: 'category', data: categories, axisLine: { lineStyle: { color: axisLineColor } }, axisLabel: { color: textColor } },
        yAxis: { type: 'value', axisLine: { lineStyle: { color: axisLineColor } }, axisLabel: { color: textColor }, splitLine: { lineStyle: { color: '#1e293b' } } },
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        series: series
      };
    } else if (numericCols.length === 1) {
      // Bar/Pie chart for simple comparison
      var values = rows.map(function(r) { return parseNum(r[numericCols[0]]); });
      var allPositive = values.every(function(v) { return v > 0; });
      
      if (allPositive && rows.length <= 8) {
        // Pie chart
        var pieData = rows.map(function(r, i) {
          return { name: r[0], value: parseNum(r[numericCols[0]]) };
        });
        return {
          backgroundColor: darkBg,
          tooltip: { trigger: 'item', backgroundColor: '#1e293b', borderColor: '#374151', textStyle: { color: '#e5e7eb' } },
          series: [{
            type: 'pie',
            radius: ['35%', '65%'],
            center: ['50%', '55%'],
            data: pieData,
            label: { color: textColor, fontSize: 11 },
            emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } }
          }],
          color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']
        };
      } else {
        // Bar chart
        return {
          backgroundColor: darkBg,
          tooltip: { trigger: 'axis', backgroundColor: '#1e293b', borderColor: '#374151', textStyle: { color: '#e5e7eb' } },
          grid: { left: '3%', right: '4%', bottom: '3%', top: '20px', containLabel: true },
          xAxis: { type: 'category', data: categories, axisLine: { lineStyle: { color: axisLineColor } }, axisLabel: { color: textColor, rotate: categories.length > 6 ? 30 : 0 } },
          yAxis: { type: 'value', axisLine: { lineStyle: { color: axisLineColor } }, axisLabel: { color: textColor }, splitLine: { lineStyle: { color: '#1e293b' } } },
          series: [{ type: 'bar', data: values, itemStyle: { borderRadius: [4,4,0,0], color: '#3b82f6' } }],
          color: ['#3b82f6']
        };
      }
    } else if (numericCols.length >= 2) {
      // Multi-series bar chart
      var series = numericCols.map(function(colIdx) {
        return {
          name: h[colIdx],
          type: 'bar',
          data: rows.map(function(r) { return parseNum(r[colIdx]); }),
          itemStyle: { borderRadius: [2,2,0,0] }
        };
      });
      return {
        backgroundColor: darkBg,
        tooltip: { trigger: 'axis', backgroundColor: '#1e293b', borderColor: '#374151', textStyle: { color: '#e5e7eb' } },
        legend: { textStyle: { color: textColor } },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '40px', containLabel: true },
        xAxis: { type: 'category', data: categories, axisLine: { lineStyle: { color: axisLineColor } }, axisLabel: { color: textColor } },
        yAxis: { type: 'value', axisLine: { lineStyle: { color: axisLineColor } }, axisLabel: { color: textColor }, splitLine: { lineStyle: { color: '#1e293b' } } },
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        series: series
      };
    }

    // Fallback: no chart
    return null;
  }
})();
