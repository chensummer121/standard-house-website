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
  type: 'energy' | 'industry' | 'infrastructure';
  slug: string | null;
}

interface SpecialLine {
  name: string;
  positions: [number, number][];
  color: string;
}

// Country-specific data
const countryData = {
  ethiopia: {
    center: [9.145, 40.489] as [number, number],
    zoom: 6,
    cities: [
      { name: '亚的斯亚贝巴', nameEn: 'Addis Ababa', position: [9.025, 38.747], population: '约600万', industry: '首都，非盟总部，工业/服务业', slug: 'addis-ababa' },
      { name: '德雷达瓦', nameEn: 'Dire Dawa', position: [9.603, 41.856], population: '约50万', industry: '第二大城市，东非铁路枢纽', slug: 'dire-dawa' },
      { name: '巴哈达尔', nameEn: 'Bahir Dar', position: [11.575, 37.361], population: '约35万', industry: '青尼罗河源头，旅游/教育', slug: 'bahir-dar' },
      { name: '阿达玛', nameEn: 'Adama', position: [8.54, 39.269], population: '约58万', industry: '工业走廊核心，纺织/机械', slug: 'adama' },
      { name: '默克莱', nameEn: 'Mekelle', position: [13.497, 39.475], population: '约50万', industry: '北部重镇，矿业/农业', slug: 'mekelle' },
      { name: '吉马', nameEn: 'Jimma', position: [7.674, 36.835], population: '约40万', industry: '咖啡产区最大城市', slug: 'jmma' },
      { name: '孔博勒查', nameEn: 'Kombolcha', position: [11.086, 39.736], population: '约12万', industry: '工业走廊，纺织/皮革', slug: 'kombolcha' },
      { name: '霍瓦萨', nameEn: 'Hawassa', position: [7.053, 38.485], population: '约50万', industry: '南部经济中心，渔业/农业', slug: 'hawassa' },
    ] as City[],
    projects: [
      { name: '复兴大坝 (GERD)', position: [11.21, 35.09], info: '非洲最大水电站，装机容量5,150MW', type: 'energy', slug: null },
      { name: '阿达玛工业园', position: [8.55, 39.25], info: '100公顷，纺织服装、机械设备', type: 'industry', slug: 'adama' },
      { name: '孔博勒查工业园', position: [11.09, 39.74], info: '纺织、皮革、农产品加工', type: 'industry', slug: 'kombolcha' },
      { name: '霍瓦萨工业园', position: [7.05, 38.47], info: '综合工业园区，食品加工、纺织', type: 'industry', slug: 'hawassa' },
    ] as Project[],
    ports: [{ name: '吉布提港', position: [11.588, 43.145] as [number, number], info: '埃塞俄比亚90%以上进出口的出海口' }],
    specialLines: [
      { name: '亚的斯亚贝巴-吉布提铁路', positions: [[9.025, 38.747], [8.85, 39.3], [8.5, 39.5], [8.3, 39.8], [8.0, 40.0], [7.8, 40.3], [7.5, 40.7], [7.2, 41.0], [6.9, 41.5], [6.5, 41.8], [6.2, 42.2], [5.5, 42.8], [5.0, 43.0], [11.588, 43.145]], color: '#dc2626' },
    ] as SpecialLine[],
  },
  uganda: {
    center: [1.3733, 32.2903] as [number, number],
    zoom: 7,
    cities: [
      { name: '坎帕拉', nameEn: 'Kampala', position: [0.3476, 32.5825], population: '约350万', industry: '首都，商业中心，金融/贸易', slug: 'kampala' },
      { name: '恩德培', nameEn: 'Entebbe', position: [0.0619, 32.4473], population: '约8万', industry: '国际机场，维多利亚湖畔', slug: 'entebbe' },
      { name: '金贾', nameEn: 'Jinja', position: [0.4244, 33.2037], population: '约10万', industry: '工业城市，尼罗河源头', slug: 'jinja' },
      { name: '姆巴拉拉', nameEn: 'Mbarara', position: [-0.6083, 30.6553], population: '约20万', industry: '西部畜牧/乳业中心', slug: 'mbarara' },
      { name: '古卢', nameEn: 'Gulu', position: [2.7743, 32.299], population: '约15万', industry: '北部中心城市', slug: 'gulu' },
      { name: '姆巴莱', nameEn: 'Mbale', position: [1.0833, 34.175], population: '约12万', industry: '东部农业/咖啡产区', slug: 'mbale' },
    ] as City[],
    projects: [
      { name: 'EACOP输油管道', position: [1.2, 31.5], info: '1,443km，从Hoima到坦桑尼亚Tanga港，设计产能24万桶/日', type: 'energy', slug: null },
      { name: 'Kabale国际工业园', position: [-1.25, 29.99], info: '边境工业园，吸引制造业投资', type: 'industry', slug: 'kabale' },
      { name: '金贾工业园区', position: [0.42, 33.2], info: '利用尼罗河水力资源，工业制造', type: 'industry', slug: 'jinja' },
    ] as Project[],
    ports: [],
    specialLines: [
      { name: 'EACOP管道', positions: [[1.2, 31.5], [0.8, 32.0], [0.3, 32.5], [-0.5, 33.0], [-1.2, 33.5], [-2.0, 34.0], [-3.0, 34.5], [-4.0, 35.0], [-5.0, 35.5], [-5.5, 36.0], [-5.8, 36.5], [-6.0, 37.0]], color: '#ffd740' },
    ] as SpecialLine[],
  },
  kenya: {
    center: [-0.0236, 37.9062] as [number, number],
    zoom: 6,
    cities: [
      { name: '内罗毕', nameEn: 'Nairobi', position: [-1.2864, 36.8172], population: '约500万', industry: '首都，东非金融中心，ICT', slug: 'nairobi' },
      { name: '蒙巴萨', nameEn: 'Mombasa', position: [-4.0435, 39.6682], population: '约150万', industry: '东非最大港口，进出口枢纽', slug: 'mombasa' },
      { name: '基苏木', nameEn: 'Kisumu', position: [-0.0917, 34.768], population: '约50万', industry: '维多利亚湖畔，西部中心', slug: 'kisumu' },
      { name: '纳库鲁', nameEn: 'Nakuru', position: [-0.3031, 36.08], population: '约60万', industry: '农业中心，花卉出口', slug: 'nakuru' },
      { name: '埃尔多雷特', nameEn: 'Eldoret', position: [0.5143, 35.2698], population: '约50万', industry: '长跑之乡，农业', slug: 'eldoret' },
    ] as City[],
    projects: [
      { name: '蒙内铁路', position: [-1.5, 37.5], info: '内罗毕-蒙巴萨标准轨铁路，480km，中国融资建设', type: 'infrastructure', slug: null },
      { name: 'Olkaria地热电站', position: [-0.9, 36.3], info: '非洲最大地热项目，装机容量862MW', type: 'energy', slug: null },
      { name: 'Dongo Kundu SEZ', position: [-4.1, 39.7], info: '蒙巴萨特别经济区，3000公顷，制造业/物流', type: 'industry', slug: 'mombasa' },
    ] as Project[],
    ports: [{ name: '蒙巴萨港', position: [-4.05, 39.67] as [number, number], info: '东非最大港口，辐射肯尼亚、乌干达、卢旺达、南苏丹' }],
    specialLines: [
      { name: '蒙内铁路', positions: [[-1.2864, 36.8172], [-1.5, 37.0], [-1.8, 37.2], [-2.2, 37.5], [-2.5, 37.8], [-2.8, 38.0], [-3.0, 38.2], [-3.3, 38.5], [-3.5, 38.8], [-3.8, 39.0], [-4.0, 39.3], [-4.0435, 39.6682]], color: '#dc2626' },
    ] as SpecialLine[],
  },
  tanzania: {
    center: [-6.369, 34.8888] as [number, number],
    zoom: 5,
    cities: [
      { name: '达累斯萨拉姆', nameEn: 'Dar es Salaam', position: [-6.7924, 39.2083], population: '约600万', industry: '经济首都，最大城市，港口/金融', slug: 'dar-es-salaam' },
      { name: '多多马', nameEn: 'Dodoma', position: [-6.163, 35.7516], population: '约50万', industry: '行政首都，政府机构', slug: 'dodoma' },
      { name: '阿鲁沙', nameEn: 'Arusha', position: [-3.3869, 36.683], population: '约50万', industry: '旅游门户，EAC总部', slug: 'arusha' },
      { name: '姆万扎', nameEn: 'Mwanza', position: [-2.5167, 32.9], population: '约100万', industry: '维多利亚湖畔，第二大城市', slug: 'mwanza' },
      { name: '桑给巴尔', nameEn: 'Zanzibar', position: [-6.1659, 39.2029], population: '约50万', industry: '旅游岛，香料贸易', slug: 'zanzibar' },
      { name: '姆贝亚', nameEn: 'Mbeya', position: [-8.9094, 33.4506], population: '约40万', industry: '西南部农业/矿业中心', slug: 'mbeya' },
    ] as City[],
    projects: [
      { name: 'LNG项目', position: [-10.0, 39.5], info: 'Lindi地区，Equinor+Shell开发，年产能220万吨', type: 'energy', slug: null },
      { name: '巴加莫约港', position: [-6.8, 38.9], info: '深海港开发，设计吞吐能力2000万吨', type: 'infrastructure', slug: null },
      { name: 'Kurasini物流中心', position: [-6.82, 39.28], info: '达累斯萨拉姆物流枢纽，提升货运效率', type: 'industry', slug: 'dar-es-salaam' },
    ] as Project[],
    ports: [{ name: '达累斯萨拉姆港', position: [-6.82, 39.28] as [number, number], info: '坦桑主要港口，服务内陆国家进出口' }, { name: '坦加港', position: [-5.58, 39.1] as [number, number], info: 'EACOP管道终点，石油出口港' }],
    specialLines: [
      { name: 'TAZARA铁路', positions: [[-6.7924, 39.2083], [-6.5, 38.5], [-6.2, 37.8], [-5.8, 37.0], [-5.5, 36.2], [-5.0, 35.0], [-4.5, 33.5], [-4.0, 32.0], [-13.5, 32.6]], color: '#ffd740' },
    ] as SpecialLine[],
  },
  rwanda: {
    center: [-1.9403, 29.8739] as [number, number],
    zoom: 9,
    cities: [
      { name: '基加利', nameEn: 'Kigali', position: [-1.9444, 30.0616], population: '约120万', industry: '首都，ICT中心，金融服务', slug: 'kigali' },
      { name: '布塔雷', nameEn: 'Butare/Huye', position: [-2.5967, 29.7394], population: '约12万', industry: '大学城，文化教育中心', slug: 'butare' },
      { name: '穆桑泽', nameEn: 'Musanze', position: [-1.4986, 29.6349], population: '约13万', industry: '火山大猩猩旅游门户', slug: 'musanze' },
      { name: '鲁巴武', nameEn: 'Rubavu/Gisenyi', position: [-1.7047, 29.3106], population: '约12万', industry: '边境城市，与刚果(金)接壤', slug: 'rubavu' },
      { name: '鲁西济', nameEn: 'Rusizi/Cyangugu', position: [-2.1753, 28.9083], population: '约8万', industry: '西南边境，布隆迪/刚果交汇', slug: 'rusizi' },
    ] as City[],
    projects: [
      { name: 'Kigali Innovation City', position: [-1.94, 30.06], info: '基加利创新城，科技企业聚集区', type: 'industry', slug: 'kigali' },
      { name: 'Bugesera国际机场', position: [-2.45, 30.05], info: '新国际机场，2025年建成，设计年客运量450万', type: 'infrastructure', slug: null },
      { name: 'Mukungwa II水电', position: [-1.52, 29.68], info: '水电站扩建，装机容量43MW', type: 'energy', slug: null },
    ] as Project[],
    ports: [],
    specialLines: [],
  },
  "south-sudan": {
    center: [6.877, 31.307] as [number, number],
    zoom: 7,
    cities: [
      { name: '朱巴', nameEn: 'Juba', position: [4.8517, 31.5825], population: '约40万', industry: '首都，尼罗河畔，石油经济中心', slug: 'juba' },
      { name: '马拉卡勒', nameEn: 'Malakal', position: [9.5374, 31.6525], population: '约15万', industry: '上尼罗州首府，白尼罗河上游', slug: 'malakal' },
      { name: '瓦乌', nameEn: 'Wau', position: [7.7011, 27.9895], population: '约12万', industry: '西部重镇，牲畜贸易中心', slug: 'wau' },
    ] as City[],
    projects: [
      { name: 'Paloch油田', position: [9.8, 31.2], info: '主要石油产区，日产量约4万桶', type: 'energy', slug: null },
      { name: '石油管道', position: [10.0, 32.0], info: '途经苏丹至红海，2024年受损中断', type: 'infrastructure', slug: null },
    ] as Project[],
    ports: [],
    specialLines: [],
  },
};

type Country = 'ethiopia' | 'uganda' | 'kenya' | 'tanzania' | 'rwanda' | 'south-sudan';

interface CountryMapProps {
  country: Country;
  showAllMarkers?: boolean;
  height?: string;
  interactive?: boolean;
}

export default function CountryMap({ 
  country, 
  showAllMarkers = true, 
  height = '400px',
  interactive = true 
}: CountryMapProps) {
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

  const data = countryData[country];
  const { MapContainer, TileLayer, Marker, Popup, Polyline } = MapComponents;

  // Create custom icons
  const createIcon = (color: string, isCapital: boolean = false) => {
    if (isCapital) {
      return L.divIcon({
        className: 'custom-div-icon',
        html: `<svg width="28" height="28" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" stroke="#fff" stroke-width="1"/>
        </svg>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });
    }
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="
        width: 16px; 
        height: 16px; 
        border-radius: 50%; 
        background: ${color};
        border: 2px solid #e8e8e8;
        box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -8],
    });
  };

  const capitalIcon = createIcon('#ffd740', true);
  const cityIcon = createIcon('#448aff');
  const portIcon = createIcon('#ff5252');
  const energyIcon = createIcon('#ffd740');
  const industryIcon = createIcon('#a0a0b0');
  const infraIcon = createIcon('#00e676');

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
          center={data.center}
          zoom={data.zoom}
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
          
          {/* 特色线路 */}
          {showAllMarkers && data.specialLines.map((line, idx) => (
            <Polyline
              key={`line-${idx}`}
              positions={line.positions}
              pathOptions={{
                color: line.color,
                weight: 3,
                dashArray: '10, 10',
                opacity: 0.7,
              }}
            />
          ))}
          
          {/* 港口 */}
          {showAllMarkers && data.ports.map((port, idx) => (
            <Marker key={`port-${idx}`} position={port.position} icon={portIcon}>
              <Popup>
                <div className="text-center" style={{ minWidth: '180px' }}>
                  <h3 className="font-bold text-lg" style={{ color: '#e8e8e8' }}>
                    🚢 {port.name}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#a0a0b0' }}>
                    {port.info}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* 城市 - 首都特殊标记 */}
          {showAllMarkers && data.cities.map((city, idx) => (
            <Marker key={city.slug} position={city.position} icon={idx === 0 ? capitalIcon : cityIcon}>
              <Popup>
                <div className="text-center" style={{ minWidth: '200px' }}>
                  <h3 className="font-bold text-lg" style={{ color: '#e8e8e8' }}>
                    {idx === 0 ? '⭐' : '🏙️'} {city.name}
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
                      href={`/invest/${country}/toolkit/cities/${city.slug}`}
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
          {showAllMarkers && data.projects.filter(p => p.type === 'energy').map((project, idx) => (
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
          {showAllMarkers && data.projects.filter(p => p.type === 'industry').map((project, idx) => (
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
                      href={`/invest/${country}/toolkit/cities/${project.slug}`}
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

          {/* 基础设施项目 */}
          {showAllMarkers && data.projects.filter(p => p.type === 'infrastructure').map((project, idx) => (
            <Marker key={`infra-${idx}`} position={project.position} icon={infraIcon}>
              <Popup>
                <div className="text-center" style={{ minWidth: '200px' }}>
                  <h3 className="font-bold text-lg" style={{ color: '#e8e8e8' }}>
                    🏗️ {project.name}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#a0a0b0' }}>
                    {project.info}
                  </p>
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
            <span style={{ color: '#ffd740', fontSize: '14px' }}>★</span> 首都
          </span>
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
            <span className="w-3 h-3 rounded-full" style={{ background: '#00e676' }}></span> 基建
          </span>
        </div>
      </div>
    </div>
  );
}
