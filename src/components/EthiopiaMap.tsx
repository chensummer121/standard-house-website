'use client';

import { useEffect, useState } from 'react';

interface City {
  name: string;
  nameEn: string;
  position: [number, number];
  population: string;
  industry: string;
  slug: string;
}

interface Project {
  name: string;
  position: [number, number];
  info: string;
  type: 'energy' | 'industry';
  slug: string | null;
}

const cities: City[] = [
  {
    name: '亚的斯亚贝巴',
    nameEn: 'Addis Ababa',
    position: [9.025, 38.747],
    population: '约600万',
    industry: '首都，非盟总部，工业/服务业',
    slug: 'addis-ababa',
  },
  {
    name: '德雷达瓦',
    nameEn: 'Dire Dawa',
    position: [9.603, 41.856],
    population: '约50万',
    industry: '第二大城市，东非铁路枢纽',
    slug: 'dire-dawa',
  },
  {
    name: '巴哈达尔',
    nameEn: 'Bahir Dar',
    position: [11.575, 37.361],
    population: '约35万',
    industry: '青尼罗河源头，旅游/教育',
    slug: 'bahir-dar',
  },
  {
    name: '阿达玛',
    nameEn: 'Adama',
    position: [8.54, 39.269],
    population: '约58万',
    industry: '工业走廊核心，纺织/机械',
    slug: 'adama',
  },
  {
    name: '默克莱',
    nameEn: 'Mekelle',
    position: [13.497, 39.475],
    population: '约50万',
    industry: '北部重镇，矿业/农业',
    slug: 'mekelle',
  },
  {
    name: '吉马',
    nameEn: 'Jimma',
    position: [7.674, 36.835],
    population: '约40万',
    industry: '咖啡产区最大城市',
    slug: 'jmma',
  },
  {
    name: '孔博勒查',
    nameEn: 'Kombolcha',
    position: [11.086, 39.736],
    population: '约12万',
    industry: '工业走廊，纺织/皮革',
    slug: 'kombolcha',
  },
  {
    name: '霍瓦萨',
    nameEn: 'Hawassa',
    position: [7.053, 38.485],
    population: '约50万',
    industry: '南部经济中心，渔业/农业',
    slug: 'hawassa',
  },
];

const projects: Project[] = [
  {
    name: '复兴大坝 (GERD)',
    position: [11.21, 35.09],
    info: '非洲最大水电站，装机容量5,150MW',
    type: 'energy',
    slug: null,
  },
  {
    name: '阿达玛工业园',
    position: [8.55, 39.25],
    info: '100公顷，纺织服装、机械设备',
    type: 'industry',
    slug: 'adama',
  },
  {
    name: '孔博勒查工业园',
    position: [11.09, 39.74],
    info: '纺织、皮革、农产品加工',
    type: 'industry',
    slug: 'kombolcha',
  },
  {
    name: '霍瓦萨工业园',
    position: [7.05, 38.47],
    info: '综合工业园区，食品加工、纺织',
    type: 'industry',
    slug: 'hawassa',
  },
];

const djibouti = {
  name: '吉布提港',
  position: [11.588, 43.145] as [number, number],
  info: '埃塞俄比亚90%以上进出口的出海口',
};

const railwayLine: [number, number][] = [
  [9.025, 38.747],
  [8.85, 39.3],
  [8.5, 39.5],
  [8.3, 39.8],
  [8.0, 40.0],
  [7.8, 40.3],
  [7.5, 40.7],
  [7.2, 41.0],
  [6.9, 41.5],
  [6.5, 41.8],
  [6.2, 42.2],
  [5.5, 42.8],
  [5.0, 43.0],
  [11.588, 43.145],
];

interface EthiopiaMapProps {
  showAllMarkers?: boolean;
  height?: string;
  interactive?: boolean;
}

export default function EthiopiaMap({ 
  showAllMarkers = true, 
  height = '400px',
  interactive = true 
}: EthiopiaMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [L, setL] = useState<any>(null);

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

  const { MapContainer, TileLayer, Marker, Popup, Polyline } = MapComponents;

  // Create custom icons
  const createIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="
        width: 24px; 
        height: 24px; 
        border-radius: 50%; 
        background: ${color};
        border: 3px solid #e8e8e8;
        box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  const cityIcon = createIcon('#448aff');
  const portIcon = createIcon('#ff5252');
  const energyIcon = createIcon('#ffd740');
  const industryIcon = createIcon('#a0a0b0');

  // Merge default Leaflet icons with dark theme fix
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });

  return (
    <div className="rounded-xl overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
      <div style={{ height }}>
        <MapContainer
          center={[9.145, 40.489]}
          zoom={6}
          scrollWheelZoom={interactive}
          style={{ height: '100%', width: '100%' }}
          zoomControl={interactive}
          dragging={interactive}
          doubleClickZoom={interactive}
        >
          {/* 深色底图 */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* 铁路线 */}
          <Polyline
            positions={railwayLine}
            pathOptions={{
              color: '#dc2626',
              weight: 3,
              dashArray: '10, 10',
              opacity: 0.7,
            }}
          />
          
          {/* 吉布提港 */}
          <Marker position={djibouti.position} icon={portIcon}>
            <Popup>
              <div className="text-center" style={{ minWidth: '180px' }}>
                <h3 className="font-bold text-lg" style={{ color: '#e8e8e8' }}>
                  🚢 {djibouti.name}
                </h3>
                <p className="text-sm mt-1" style={{ color: '#a0a0b0' }}>
                  {djibouti.info}
                </p>
              </div>
            </Popup>
          </Marker>
          
          {/* 城市 */}
          {showAllMarkers && cities.map((city) => (
            <Marker key={city.slug} position={city.position} icon={cityIcon}>
              <Popup>
                <div className="text-center" style={{ minWidth: '200px' }}>
                  <h3 className="font-bold text-lg" style={{ color: '#e8e8e8' }}>
                    🏙️ {city.name}
                  </h3>
                  <p className="text-xs" style={{ color: '#a0a0b0' }}>
                    {city.nameEn}
                  </p>
                  <div className="mt-2 text-sm space-y-1">
                    <p style={{ color: '#a0a0b0' }}>
                      <span style={{ color: '#ffd740' }}>人口：</span>
                      {city.population}
                    </p>
                    <p style={{ color: '#a0a0b0' }}>
                      <span style={{ color: '#448aff' }}>产业：</span>
                      {city.industry}
                    </p>
                  </div>
                  {city.slug && (
                    <a 
                      href={`/invest/ethiopia/toolkit/cities/${city.slug}`}
                      className="inline-block mt-3 px-3 py-1 rounded-lg text-white text-sm transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #ff9100, #ff5252)' }}
                    >
                      查看详情 →
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* 能源项目 */}
          {showAllMarkers && projects.filter(p => p.type === 'energy').map((project, idx) => (
            <Marker key={`energy-${idx}`} position={project.position} icon={energyIcon}>
              <Popup>
                <div className="text-center" style={{ minWidth: '200px' }}>
                  <h3 className="font-bold text-lg" style={{ color: '#e8e8e8' }}>
                    ⚡ {project.name}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#a0a0b0' }}>
                    {project.info}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* 工业园 */}
          {showAllMarkers && projects.filter(p => p.type === 'industry').map((project, idx) => (
            <Marker key={`industry-${idx}`} position={project.position} icon={industryIcon}>
              <Popup>
                <div className="text-center" style={{ minWidth: '200px' }}>
                  <h3 className="font-bold text-lg" style={{ color: '#e8e8e8' }}>
                    🏭 {project.name}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#a0a0b0' }}>
                    {project.info}
                  </p>
                  {project.slug && (
                    <a 
                      href={`/invest/ethiopia/toolkit/cities/${project.slug}`}
                      className="inline-block mt-2 px-3 py-1 rounded-lg text-white text-sm transition-all hover:opacity-90"
                      style={{ background: '#448aff' }}
                    >
                      查看详情 →
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* 图例 */}
      <div className="p-3" style={{ background: '#162447', borderTop: '1px solid #2a3a5c' }}>
        <div className="flex flex-wrap gap-4 justify-center text-xs" style={{ color: '#a0a0b0' }}>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ background: '#448aff' }}></span> 城市
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ background: '#ff5252' }}></span> 港口
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ background: '#ffd740' }}></span> 能源
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ background: '#a0a0b0' }}></span> 工业园
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 border-t-2 border-dashed" style={{ borderColor: '#dc2626' }}></span> 铁路线
          </span>
        </div>
      </div>
    </div>
  );
}
