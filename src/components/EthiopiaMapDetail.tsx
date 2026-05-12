'use client';

import { useEffect, useState, useRef } from 'react';

interface City {
  name: string;
  nameEn: string;
  position: [number, number];
  population: string;
  industry: string;
  slug: string;
  highlight: string;
  isCapital?: boolean;
}

interface EthiopiaMapDetailProps {
  centerCity?: string; // 当指定城市时，地图聚焦该城市
  height?: string;
  zoom?: number;
  showControls?: boolean;
}

// 5个主要城市数据
const mainCities: City[] = [
  {
    name: '亚的斯亚贝巴',
    nameEn: 'Addis Ababa',
    position: [9.0222, 38.7469],
    population: '约600万',
    industry: '金融服务、信息技术、制造业',
    slug: 'addis-ababa',
    highlight: '首都，非盟总部，东非商业中心',
    isCapital: true,
  },
  {
    name: '德雷达瓦',
    nameEn: 'Dire Dawa',
    position: [9.6031, 41.8625],
    population: '约50万',
    industry: '物流仓储、铁路枢纽、轻工业',
    slug: 'dire-dawa',
    highlight: '东非铁路重要节点，对外贸易门户',
  },
  {
    name: '巴哈达尔',
    nameEn: 'Bahir Dar',
    position: [11.5742, 37.3622],
    population: '约50万',
    industry: '旅游业、教育、青尼罗河水电',
    slug: 'bahir-dar',
    highlight: '青尼罗河源头，历史文化名城',
  },
  {
    name: '阿达玛',
    nameEn: 'Adama',
    position: [8.5400, 39.2683],
    population: '约58万',
    industry: '工业园、纺织服装、机械设备',
    slug: 'adama',
    highlight: '工业走廊核心，亚吉铁路重要站点',
  },
  {
    name: '霍瓦萨',
    nameEn: 'Hawassa',
    position: [7.0533, 38.4761],
    population: '约50万',
    industry: '渔业、农业、农产品加工',
    slug: 'hawassa',
    highlight: '南部经济中心，裂谷湖畔城市',
  },
];

// 其他城市（作为参考点）
const otherCities = [
  { name: '默克莱', nameEn: 'Mekelle', position: [13.4961, 39.4750], slug: 'mekelle' },
  { name: '吉马', nameEn: 'Jimma', position: [7.6738, 36.8344], slug: 'jmma' },
  { name: '孔博勒查', nameEn: 'Kombolcha', position: [11.0864, 39.7356], slug: 'kombolcha' },
  { name: '德卜勒伯尔汉', nameEn: 'Debre Birhan', position: [9.6825, 39.5333], slug: 'debre-birhan' },
  { name: '塞梅拉', nameEn: 'Semera', position: [11.7933, 40.9933], slug: 'semera' },
];

export default function EthiopiaMapDetail({
  centerCity,
  height = '400px',
  zoom = 6,
  showControls = true,
}: EthiopiaMapDetailProps) {
  const [isClient, setIsClient] = useState(false);
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [L, setL] = useState<any>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
    
    Promise.all([
      import('react-leaflet'),
      import('leaflet')
    ]).then(([mod, leafletMod]) => {
      setMapComponents(mod);
      setL(leafletMod.default || leafletMod);
    });
  }, []);

  // 确定地图中心点
  const getMapCenter = () => {
    if (centerCity) {
      const city = mainCities.find(c => c.slug === centerCity);
      if (city) return city.position;
    }
    return [9.145, 40.489] as [number, number];
  };

  const getMapZoom = () => {
    if (centerCity) return 8;
    return zoom;
  };

  if (!isClient || !MapComponents || !L) {
    return (
      <div 
        className="rounded-xl overflow-hidden flex items-center justify-center"
        style={{ 
          height,
          background: 'linear-gradient(135deg, #1f4068 0%, #162447 100%)',
        }}
      >
        <div className="text-center" style={{ color: '#a0a0b0' }}>
          <div className="text-4xl mb-2">🗺️</div>
          <p>地图加载中...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  // 创建自定义图标
  const createCityIcon = (isCapital: boolean, color: string) => {
    if (isCapital) {
      // 首都用星形图标
      return L.divIcon({
        className: 'custom-div-icon capital-icon',
        html: `<div style="
          width: 32px; 
          height: 32px; 
          background: linear-gradient(135deg, #ffd740, #ff9100);
          border: 3px solid #fff;
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          box-shadow: 0 2px 10px rgba(255, 183, 77, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="font-size: 14px;">🏛️</span>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });
    }
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="
        width: 20px; 
        height: 20px; 
        border-radius: 50%; 
        background: ${color};
        border: 2px solid #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
    });
  };

  // 其他城市用小圆点
  const createDotIcon = () => {
    return L.divIcon({
      className: 'other-city-dot',
      html: `<div style="
        width: 8px; 
        height: 8px; 
        border-radius: 50%; 
        background: #78909c;
        border: 1px solid #fff;
        opacity: 0.7;
      "></div>`,
      iconSize: [8, 8],
      iconAnchor: [4, 4],
    });
  };

  // 城市颜色映射
  const cityColors: Record<string, string> = {
    'addis-ababa': '#448aff',
    'dire-dawa': '#00e676',
    'bahir-dar': '#18ffff',
    'adama': '#ff9100',
    'hawassa': '#e040fb',
  };

  const currentZoom = getMapZoom();
  const currentCenter = getMapCenter();

  return (
    <div 
      className="rounded-xl overflow-hidden"
      style={{ 
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        border: '1px solid #2a3a5c',
      }}
    >
      <div style={{ height }}>
        <MapContainer
          center={currentCenter}
          zoom={currentZoom}
          scrollWheelZoom={showControls}
          style={{ height: '100%', width: '100%' }}
          zoomControl={showControls}
          dragging={showControls}
          doubleClickZoom={showControls}
          ref={mapRef}
        >
          {/* 深色底图 - CartoDB Dark Matter */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* 主要城市标记 */}
          {mainCities.map((city) => {
            const color = cityColors[city.slug] || '#448aff';
            const isHighlighted = centerCity === city.slug;
            
            return (
              <Marker 
                key={city.slug} 
                position={city.position}
                icon={createCityIcon(city.isCapital || false, color)}
              >
                <Popup>
                  <div 
                    className="text-center p-2"
                    style={{ 
                      minWidth: '220px',
                      background: '#1a1f2e',
                      borderRadius: '8px',
                    }}
                  >
                    {/* 城市名称 */}
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-2xl">
                        {city.isCapital ? '🏛️' : '🏙️'}
                      </span>
                      <div>
                        <h3 
                          className="font-bold text-base"
                          style={{ color: '#e8e8e8' }}
                        >
                          {city.name}
                        </h3>
                        <p className="text-xs" style={{ color: '#78909c' }}>
                          {city.nameEn}
                        </p>
                      </div>
                    </div>
                    
                    {/* 简介 */}
                    <p 
                      className="text-xs mb-2"
                      style={{ color: '#a0a0b0' }}
                    >
                      {city.highlight}
                    </p>
                    
                    {/* 详细信息 */}
                    <div 
                      className="text-xs space-y-1 p-2 rounded"
                      style={{ background: '#0f172a' }}
                    >
                      <p style={{ color: '#ffd740' }}>
                        <span style={{ color: '#a0a0b0' }}>人口：</span>
                        {city.population}
                      </p>
                      <p style={{ color: '#448aff' }}>
                        <span style={{ color: '#a0a0b0' }}>产业：</span>
                        {city.industry}
                      </p>
                    </div>
                    
                    {/* 链接按钮 */}
                    <a 
                      href={`/invest/ethiopia/toolkit/cities/${city.slug}`}
                      className="inline-block mt-3 px-4 py-1.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                      style={{ 
                        background: city.isCapital 
                          ? 'linear-gradient(135deg, #ff9100, #ff5252)' 
                          : `linear-gradient(135deg, ${color}, ${color}99)`,
                        textDecoration: 'none',
                      }}
                    >
                      查看详情 →
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
          
          {/* 其他城市标记（小型点） */}
          {!centerCity && otherCities.map((city, idx) => (
            <Marker 
              key={`other-${idx}`} 
              position={city.position}
              icon={createDotIcon()}
            >
              <Popup>
                <div 
                  className="text-center p-2"
                  style={{ 
                    minWidth: '120px',
                    background: '#1a1f2e',
                    borderRadius: '8px',
                  }}
                >
                  <h4 className="font-medium text-sm" style={{ color: '#e8e8e8' }}>
                    {city.name}
                  </h4>
                  <p className="text-xs" style={{ color: '#78909c' }}>
                    {city.nameEn}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* 图例 */}
      <div 
        className="p-3"
        style={{ 
          background: '#162447', 
          borderTop: '1px solid #2a3a5c' 
        }}
      >
        <div 
          className="flex flex-wrap gap-4 justify-center text-xs items-center"
          style={{ color: '#a0a0b0' }}
        >
          <span className="flex items-center gap-1.5">
            <span 
              className="w-5 h-5"
              style={{
                background: 'linear-gradient(135deg, #ffd740, #ff9100)',
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              }}
            ></span>
            首都
          </span>
          <span className="flex items-center gap-1.5">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ background: '#448aff' }}
            ></span>
            主要城市
          </span>
          <span className="flex items-center gap-1.5">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ background: '#78909c' }}
            ></span>
            其他城市
          </span>
        </div>
      </div>
    </div>
  );
}
