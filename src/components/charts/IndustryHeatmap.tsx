'use client';

import { useState } from 'react';

interface HeatmapCell {
  country: string;
  industry: string;
  score: number; // 1-5, 5=最高推荐度
}

interface CountryInfo {
  name: string;
  flag: string;
  color: string;
}

const countries: CountryInfo[] = [
  { name: '埃塞俄比亚', flag: '🇪🇹', color: '#3b82f6' },
  { name: '乌干达', flag: '🇺🇬', color: '#22c55e' },
  { name: '肯尼亚', flag: '🇰🇪', color: '#f59e0b' },
  { name: '坦桑尼亚', flag: '🇹🇿', color: '#ef4444' },
  { name: '卢旺达', flag: '🇷🇼', color: '#a855f7' },
  { name: '南苏丹', flag: '🇸🇸', color: '#1a472a' },
];

const industries = [
  '能源/电力',
  '矿业/金属',
  '农业加工',
  '金融服务',
  'ICT/科技',
  '物流/运输',
  '制造业',
  '房地产',
  '旅游/酒店',
  '医疗健康',
];

// [埃塞, 乌干达, 肯尼亚, 坦桑尼亚, 卢旺达, 南苏丹]
const heatmapData: number[][] = [
  [5, 3, 4, 4, 2, 4],  // 能源/电力 - 石油服务机会
  [5, 4, 3, 5, 2, 2],  // 矿业/金属 - 基础设施不足
  [4, 5, 3, 4, 3, 4],  // 农业加工 - 潜力大
  [2, 2, 5, 2, 4, 1],  // 金融服务 - 极度落后
  [3, 2, 5, 2, 5, 1],  // ICT/科技 - 几乎空白
  [3, 4, 5, 4, 3, 2],  // 物流/运输 - 基建匮乏
  [5, 3, 3, 3, 2, 3],  // 制造业 - 本地需求大
  [3, 2, 4, 3, 3, 2],  // 房地产 - 重建需求
  [3, 4, 4, 5, 5, 2],  // 旅游/酒店 - 安全顾虑
  [2, 2, 3, 2, 3, 2],  // 医疗健康 - 巨大缺口
];

const getScoreColor = (score: number): string => {
  const colors = [
    'rgba(31, 64, 104, 0.3)',  // 1 - 低推荐
    'rgba(31, 64, 104, 0.5)',  // 2
    'rgba(68, 138, 255, 0.4)', // 3 - 中等
    'rgba(0, 230, 118, 0.5)',  // 4 - 较好
    'rgba(0, 230, 118, 0.8)',  // 5 - 高度推荐
  ];
  return colors[score - 1] || colors[0];
};

const getScoreLabel = (score: number): string => {
  const labels = ['极低', '较低', '中等', '较高', '高度推荐'];
  return labels[score - 1] || labels[0];
};

export default function IndustryHeatmap() {
  const [hoveredCell, setHoveredCell] = useState<{row: number; col: number} | null>(null);

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold" style={{ color: '#e8e8e8' }}>
          行业-国家机会热力图
        </h3>
        <p className="text-sm" style={{ color: '#a0a0b0' }}>
          颜色越深=投资机会越高 | 数据基于实地调研
        </p>
      </div>

      {/* 热力图网格 */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* 表头 */}
          <div className="grid grid-cols-[150px_repeat(6,1fr)] gap-1 mb-2">
            <div className="p-2"></div>
            {countries.map((country) => (
              <div 
                key={country.name} 
                className="p-2 text-center text-sm font-medium rounded"
                style={{ backgroundColor: country.color + '20', color: country.color }}
              >
                <span className="text-lg mr-1">{country.flag}</span>
                <span className="hidden sm:inline">{country.name}</span>
              </div>
            ))}
          </div>

          {/* 热力图行 */}
          {industries.map((industry, rowIndex) => (
            <div 
              key={industry}
              className="grid grid-cols-[150px_repeat(6,1fr)] gap-1 mb-1"
            >
              {/* 行业名称 */}
              <div className="p-2 flex items-center text-sm" style={{ color: '#a0a0b0' }}>
                {industry}
              </div>

              {/* 评分格子 */}
              {countries.map((country, colIndex) => {
                const score = heatmapData[rowIndex][colIndex];
                const isHovered = hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex;
                
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      p-2 text-center rounded cursor-pointer transition-all duration-200
                      ${isHovered ? 'ring-2 ring-white scale-105' : ''}
                    `}
                    style={{ 
                      backgroundColor: getScoreColor(score),
                    }}
                    onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <div className="text-white font-bold text-lg">
                      {score}
                    </div>
                    {isHovered && (
                      <div 
                        className="text-xs mt-1 p-1 rounded"
                        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                      >
                        {getScoreLabel(score)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 图例 */}
      <div className="flex justify-center items-center gap-4 mt-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: getScoreColor(1) }}></div>
          <span className="text-xs" style={{ color: '#a0a0b0' }}>极低</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: getScoreColor(2) }}></div>
          <span className="text-xs" style={{ color: '#a0a0b0' }}>较低</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: getScoreColor(3) }}></div>
          <span className="text-xs" style={{ color: '#a0a0b0' }}>中等</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: getScoreColor(4) }}></div>
          <span className="text-xs" style={{ color: '#a0a0b0' }}>较高</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: getScoreColor(5) }}></div>
          <span className="text-xs" style={{ color: '#a0a0b0' }}>高度推荐</span>
        </div>
      </div>

      {/* 悬停提示 */}
      {hoveredCell && (
        <div 
          className="mt-4 p-3 rounded-lg text-center"
          style={{ backgroundColor: 'rgba(31, 64, 104, 0.8)', border: '1px solid #2a3a5c' }}
        >
          <div className="text-white font-bold">
            {countries[hoveredCell.col].flag} {countries[hoveredCell.col].name} - {industries[hoveredCell.row]}
          </div>
          <div style={{ color: '#00e676' }} className="text-sm mt-1">
            推荐度: {getScoreLabel(heatmapData[hoveredCell.row][hoveredCell.col])} ({heatmapData[hoveredCell.row][hoveredCell.col]}/5)
          </div>
        </div>
      )}
    </div>
  );
}
