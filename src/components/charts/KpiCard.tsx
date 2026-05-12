'use client';

interface KpiCardProps {
  title: string;
  value: string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: string;
  icon?: string;
}

export default function KpiCard({
  title,
  value,
  unit = '',
  trend = 'stable',
  trendValue = '',
  color = '#448aff',
  icon = '📊'
}: KpiCardProps) {
  const trendColors = {
    up: '#00e676',
    down: '#ff5252',
    stable: '#ffd740'
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    stable: '→'
  };

  return (
    <div className="kpi-card group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
        <div 
          className="flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium"
          style={{ 
            backgroundColor: `${trendColors[trend]}20`, 
            color: trendColors[trend] 
          }}
        >
          <span>{trendIcons[trend]}</span>
          {trendValue && <span>{trendValue}</span>}
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm text-gray-400">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold" style={{ color }}>
            {value}
          </span>
          {unit && (
            <span className="text-lg text-gray-400">{unit}</span>
          )}
        </div>
      </div>

      <div 
        className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, ${color}, ${trendColors[trend]})` }}
      />
    </div>
  );
}
