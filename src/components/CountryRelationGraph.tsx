'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { countries, links, linkTypeColors, linkTypeNames, type CountryNode, type CountryLink } from '../data/countryRelations';

interface Props {
  className?: string;
}

export default function CountryRelationGraph({ className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<CountryLink | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  const nodesRef = useRef<{ x: number; y: number; vx: number; vy: number; id: string }[]>([]);
  const animationRef = useRef<number>();

  // 初始化节点位置
  const initNodes = useCallback(() => {
    const regionGroups: Record<string, { count: number; index: number }> = {};
    countries.forEach((c, i) => {
      if (!regionGroups[c.region]) {
        regionGroups[c.region] = { count: 0, index: 0 };
      }
      regionGroups[c.region].count++;
    });
    
    const groupIndices: Record<string, number> = {};
    
    nodesRef.current = countries.map((country, i) => {
      if (!groupIndices[country.region]) groupIndices[country.region] = 0;
      const idx = groupIndices[country.region]++;
      
      const angle = (idx / regionGroups[country.region].count) * Math.PI * 2;
      const radius = 120;
      
      const regionCenters: Record<string, { x: number; y: number }> = {
        'Horn': { x: dimensions.width * 0.3, y: dimensions.height * 0.3 },
        'East': { x: dimensions.width * 0.6, y: dimensions.height * 0.4 },
        'Lakes': { x: dimensions.width * 0.45, y: dimensions.height * 0.6 },
        'South': { x: dimensions.width * 0.7, y: dimensions.height * 0.7 },
        'Central': { x: dimensions.width * 0.5, y: dimensions.height * 0.85 },
      };
      
      const center = regionCenters[country.region] || { x: dimensions.width / 2, y: dimensions.height / 2 };
      
      return {
        id: country.id,
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      };
    });
  }, [dimensions]);

  // 力导向模拟
  const simulate = useCallback(() => {
    const nodes = nodesRef.current;
    const alpha = 0.1;
    const repulsionStrength = 5000;
    const attractionStrength = 0.01;
    const centerStrength = 0.01;

    // 计算力
    nodes.forEach(node => {
      let fx = 0, fy = 0;
      
      // 斥力
      nodes.forEach(other => {
        if (node.id === other.id) return;
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = repulsionStrength / (dist * dist);
        fx += (dx / dist) * force;
        fy += (dy / dist) * force;
      });
      
      // 连线引力
      links.forEach(link => {
        const isConnected = link.source === node.id || link.target === node.id;
        if (!isConnected) return;
        
        const otherId = link.source === node.id ? link.target : link.source;
        const other = nodes.find(n => n.id === otherId);
        if (!other) return;
        
        const dx = other.x - node.x;
        const dy = other.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = 150 + (10 - link.strength) * 10;
        const force = (dist - targetDist) * attractionStrength * link.strength * 0.1;
        
        fx += (dx / dist) * force;
        fy += (dy / dist) * force;
      });
      
      // 中心引力
      fx += (dimensions.width / 2 - node.x) * centerStrength;
      fy += (dimensions.height / 2 - node.y) * centerStrength;
      
      node.vx += fx * alpha;
      node.vy += fy * alpha;
    });
    
    // 更新位置
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      node.vx *= 0.9;
      node.vy *= 0.9;
      
      // 边界约束
      node.x = Math.max(50, Math.min(dimensions.width - 50, node.x));
      node.y = Math.max(50, Math.min(dimensions.height - 50, node.y));
    });
  }, [dimensions]);

  // 绘制
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    
    // 背景
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    const nodes = nodesRef.current;
    const filteredLinks = selectedType 
      ? links.filter(l => l.type === selectedType)
      : links;
    
    // 绘制连线
    filteredLinks.forEach(link => {
      const sourceNode = nodes.find(n => n.id === link.source);
      const targetNode = nodes.find(n => n.id === link.target);
      if (!sourceNode || !targetNode) return;
      
      const isHighlighted = selectedLink?.source === link.source && selectedLink?.target === link.target;
      const isHovered = hoveredNode === link.source || hoveredNode === link.target;
      
      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      ctx.strokeStyle = linkTypeColors[link.type] + (isHighlighted ? 'ff' : isHovered ? 'aa' : '66');
      ctx.lineWidth = (link.strength / 10) * 4 + (isHighlighted ? 2 : 0);
      ctx.stroke();
    });
    
    // 绘制节点
    countries.forEach(country => {
      const node = nodes.find(n => n.id === country.id);
      if (!node) return;
      
      const isHovered = hoveredNode === country.id;
      const radius = isHovered ? 25 : 20;
      
      // 节点阴影
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.fill();
      
      // 节点
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? '#f59e0b' : '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // 国旗
      ctx.font = `${radius}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(country.flag, node.x, node.y);
      
      // 国家名
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(country.name, node.x, node.y + radius + 15);
    });
  }, [dimensions, selectedType, selectedLink, hoveredNode]);

  // 主循环
  useEffect(() => {
    initNodes();
    
    const animate = () => {
      simulate();
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // 初始快速模拟
    for (let i = 0; i < 100; i++) simulate();
    draw();
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initNodes, simulate, draw]);

  // 响应式
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: Math.max(400, container.clientHeight * 0.6)
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 鼠标交互
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const node = nodesRef.current.find(n => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 25;
    });
    
    setHoveredNode(node?.id || null);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const clickedNode = nodesRef.current.find(n => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 25;
    });
    
    if (clickedNode) {
      const country = countries.find(c => c.id === clickedNode.id);
      if (country) {
        window.location.href = `/invest/${country.id}`;
      }
    }
  };

  const linkTypes = ['trade', 'infrastructure', 'security', 'finance', 'resource', 'organization', 'china'];

  return (
    <div className={`relative ${className}`}>
      {/* 筛选面板 */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedType(null)}
          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
            selectedType === null
              ? 'bg-amber-500 text-slate-900'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          全部显示
        </button>
        {linkTypes.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(selectedType === type ? null : type)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all flex items-center gap-1.5 ${
              selectedType === type
                ? 'bg-amber-500 text-slate-900'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            style={{ borderLeft: `3px solid ${linkTypeColors[type]}` }}
          >
            {linkTypeNames[type]}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        {/* 画布 */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full rounded-xl cursor-pointer"
            onMouseMove={handleMouseMove}
            onClick={handleClick}
          />
          
          {/* 图例 */}
          <div className="absolute bottom-4 left-4 bg-slate-800/90 rounded-lg p-3 text-xs">
            <div className="text-slate-400 mb-2">点击节点进入国家详情</div>
            <div className="text-slate-500">线条粗细 = 关系强度</div>
          </div>
        </div>

        {/* 详情面板 */}
        <div className="w-72 bg-slate-800/80 rounded-xl p-4">
          <h3 className="text-lg font-bold text-amber-500 mb-4">联系详情</h3>
          
          {selectedLink ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {countries.find(c => c.id === selectedLink.source)?.flag}
                </span>
                <span className="text-slate-400">↔</span>
                <span className="text-2xl">
                  {countries.find(c => c.id === selectedLink.target)?.flag}
                </span>
              </div>
              
              <div>
                <div className="text-sm text-slate-400">类型</div>
                <div 
                  className="inline-block px-2 py-0.5 rounded text-sm"
                  style={{ background: linkTypeColors[selectedLink.type] + '33', color: linkTypeColors[selectedLink.type] }}
                >
                  {linkTypeNames[selectedLink.type]}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-slate-400">强度</div>
                <div className="flex gap-1">
                  {[1,2,3,4,5,6,7,8,9,10].map(i => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm ${i <= selectedLink.strength ? 'bg-amber-500' : 'bg-slate-600'}`}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-slate-400">描述</div>
                <div className="text-white">{selectedLink.description}</div>
              </div>
              
              {selectedLink.details && (
                <div>
                  <div className="text-sm text-slate-400">详情</div>
                  <div className="text-slate-300 text-sm">{selectedLink.details}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-400 text-sm">
              选择关系类型查看连线，然后悬停在节点或点击查看详情
            </div>
          )}
          
          {/* 统计 */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <h4 className="text-sm font-semibold text-slate-300 mb-2">统计</h4>
            <div className="text-sm text-slate-400">
              <div>国家数量: <span className="text-white">{countries.length}</span></div>
              <div>关系连线: <span className="text-white">{links.length}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
