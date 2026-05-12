// 国家间多维联系数据
// 11国联系网络

export interface CountryNode {
  id: string;
  name: string;
  nameEn: string;
  flag: string;
  region: string;
}

export interface CountryLink {
  source: string;
  target: string;
  type: 'trade' | 'infrastructure' | 'security' | 'finance' | 'resource' | 'organization' | 'china';
  strength: number; // 1-10
  description: string;
  details?: string;
}

export const countries: CountryNode[] = [
  { id: 'ethiopia', name: '埃塞俄比亚', nameEn: 'Ethiopia', flag: '🇪🇹', region: 'Horn' },
  { id: 'uganda', name: '乌干达', nameEn: 'Uganda', flag: '🇺🇬', region: 'East' },
  { id: 'kenya', name: '肯尼亚', nameEn: 'Kenya', flag: '🇰🇪', region: 'East' },
  { id: 'tanzania', name: '坦桑尼亚', nameEn: 'Tanzania', flag: '🇹🇿', region: 'South' },
  { id: 'rwanda', name: '卢旺达', nameEn: 'Rwanda', flag: '🇷🇼', region: 'Lakes' },
  { id: 'south-sudan', name: '南苏丹', nameEn: 'South Sudan', flag: '🇸🇸', region: 'Horn' },
  { id: 'burundi', name: '布隆迪', nameEn: 'Burundi', flag: '🇧🇮', region: 'Lakes' },
  { id: 'djibouti', name: '吉布提', nameEn: 'Djibouti', flag: '🇩🇯', region: 'Horn' },
  { id: 'somalia', name: '索马里', nameEn: 'Somalia', flag: '🇸🇴', region: 'Horn' },
  { id: 'eritrea', name: '厄立特里亚', nameEn: 'Eritrea', flag: '🇪🇷', region: 'Horn' },
  { id: 'dr-congo', name: '刚果（金）', nameEn: 'DR Congo', flag: '🇨🇩', region: 'Central' },
];

export const links: CountryLink[] = [
  // === 贸易联系 ===
  { source: 'ethiopia', target: 'djibouti', type: 'trade', strength: 10, 
    description: '埃塞80%贸易经吉布提港', 
    details: '亚吉铁路运输，主要进口通道' },
  { source: 'uganda', target: 'kenya', type: 'trade', strength: 8,
    description: 'EAC内部贸易核心伙伴',
    details: '蒙巴萨港是乌干达主要出海口' },
  { source: 'uganda', target: 'tanzania', type: 'trade', strength: 6,
    description: 'EAC贸易，北方走廊',
    details: '石油管道经坦桑' },
  { source: 'rwanda', target: 'kenya', type: 'trade', strength: 7,
    description: 'EAC内部贸易',
    details: '蒙巴萨港是主要出海口' },
  { source: 'rwanda', target: 'tanzania', type: 'trade', strength: 6,
    description: '湖区贸易走廊',
    details: '坦噶港通道' },
  { source: 'burundi', target: 'tanzania', type: 'trade', strength: 7,
    description: '穆松加蒂镍矿出口通道',
    details: '2025年新建铁路项目' },
  { source: 'dr-congo', target: 'tanzania', type: 'trade', strength: 7,
    description: '铜钴出口至达累斯萨拉姆',
    details: '卢本巴希-达累斯萨拉姆走廊' },
  { source: 'dr-congo', target: 'uganda', type: 'trade', strength: 5,
    description: '区域贸易',
    details: '边境贸易' },
  
  // === 基础设施走廊 ===
  { source: 'ethiopia', target: 'djibouti', type: 'infrastructure', strength: 10,
    description: '亚吉铁路752km',
    details: '2018年运营，中国融资建设' },
  { source: 'ethiopia', target: 'kenya', type: 'infrastructure', strength: 6,
    description: '公路连接规划中',
    details: '北走廊一部分' },
  { source: 'uganda', target: 'kenya', type: 'infrastructure', strength: 9,
    description: '北走廊（公路+管道）',
    details: 'EACOP管道2025年投运' },
  { source: 'uganda', target: 'south-sudan', type: 'infrastructure', strength: 7,
    description: '朱巴-尼穆勒公路',
    details: '石油管道连接' },
  { source: 'kenya', target: 'tanzania', type: 'infrastructure', strength: 5,
    description: '中走廊',
    details: '公路连接' },
  { source: 'tanzania', target: 'burundi', type: 'infrastructure', strength: 7,
    description: '乌温扎-穆松加蒂铁路',
    details: '282km，2025年签约' },
  
  // === 安全联动 ===
  { source: 'ethiopia', target: 'somalia', type: 'security', strength: 9,
    description: '非盟维和行动',
    details: 'ATMIS主要力量' },
  { source: 'kenya', target: 'somalia', type: 'security', strength: 7,
    description: '边境安全合作',
    details: 'Lam签合作' },
  { source: 'uganda', target: 'south-sudan', type: 'security', strength: 6,
    description: '区域维稳',
    details: 'EAC安全机制' },
  { source: 'dr-congo', target: 'uganda', type: 'security', strength: 5,
    description: '边境安全',
    details: 'M23问题协调' },
  { source: 'dr-congo', target: 'rwanda', type: 'security', strength: 3,
    description: '紧张关系',
    details: 'M23叛军问题，2024和平协议' },
  
  // === 金融联系 ===
  { source: 'kenya', target: 'uganda', type: 'finance', strength: 8,
    description: '区域支付系统',
    details: 'M-Pesa跨境汇款' },
  { source: 'kenya', target: 'tanzania', type: 'finance', strength: 7,
    description: 'EAC货币一体化',
    details: '区域金融整合' },
  { source: 'rwanda', target: 'kenya', type: 'finance', strength: 7,
    description: 'M-Pesa和Kakao Talk Pay',
    details: '数字支付互联' },
  
  // === 资源争夺 ===
  { source: 'ethiopia', target: 'egypt', type: 'resource', strength: 9,
    description: '尼罗河水权争议',
    details: '复兴大坝问题' },
  { source: 'south-sudan', target: 'sudan', type: 'resource', strength: 7,
    description: '石油管道和水权',
    details: '过境费争议' },
  { source: 'dr-congo', target: 'uganda', type: 'resource', strength: 4,
    description: '矿产资源竞争',
    details: '东部地区' },
  
  // === 区域组织 ===
  { source: 'ethiopia', target: 'kenya', type: 'organization', strength: 9,
    description: 'EAC成员',
    details: '东非共同体' },
  { source: 'ethiopia', target: 'uganda', type: 'organization', strength: 9,
    description: 'EAC+IGAD成员',
    details: '东非共同体+政府间发展组织' },
  { source: 'ethiopia', target: 'somalia', type: 'organization', strength: 8,
    description: 'IGAD成员',
    details: '非盟成员' },
  { source: 'kenya', target: 'tanzania', type: 'organization', strength: 9,
    description: 'EAC+COMESA成员',
    details: '东非共同体+东南非共同市场' },
  { source: 'uganda', target: 'rwanda', type: 'organization', strength: 9,
    description: 'EAC成员',
    details: '东非共同体' },
  { source: 'uganda', target: 'burundi', type: 'organization', strength: 8,
    description: 'EAC成员',
    details: '东非共同体' },
  { source: 'burundi', target: 'rwanda', type: 'organization', strength: 9,
    description: 'EAC+大湖区',
    details: '区域一体化' },
  { source: 'dr-congo', target: 'rwanda', type: 'organization', strength: 7,
    description: 'COMESA+EAC观察员',
    details: '区域组织成员' },
  { source: 'djibouti', target: 'ethiopia', type: 'organization', strength: 8,
    description: 'IGAD成员',
    details: '政府间发展组织' },
  
  // === 中国项目 ===
  { source: 'ethiopia', target: 'china', type: 'china', strength: 10,
    description: '一带一路旗舰',
    details: '亚吉铁路、复兴大坝、工业园' },
  { source: 'djibouti', target: 'china', type: 'china', strength: 10,
    description: '一带一路核心节点',
    details: '港口、自贸区、军事基地' },
  { source: 'kenya', target: 'china', type: 'china', strength: 8,
    description: '蒙内铁路',
    details: '标轨铁路2027年延伸' },
  { source: 'uganda', target: 'china', type: 'china', strength: 7,
    description: '卡鲁玛水电站',
    details: 'EACOP管道' },
  { source: 'tanzania', target: 'china', type: 'china', strength: 8,
    description: '港口扩建',
    details: '2025年镍矿铁路' },
  { source: 'rwanda', target: 'china', type: 'china', strength: 6,
    description: '基加利城市规划',
    details: '水泥厂等项目' },
  { source: 'burundi', target: 'china', type: 'china', strength: 5,
    description: '基础设施建设',
    details: '水电站、外交部大楼' },
  { source: 'somalia', target: 'china', type: 'china', strength: 5,
    description: '一带一路新方向',
    details: '$12亿投资协议（2024）' },
  { source: 'eritrea', target: 'china', type: 'china', strength: 7,
    description: 'Colluli钾盐矿',
    details: '四川路桥集团持50%' },
  { source: 'dr-congo', target: 'china', type: 'china', strength: 9,
    description: '一带一路重点',
    details: 'SICOMINES、华刚、KFM扩产' },
];

export const linkTypeColors: Record<string, string> = {
  trade: '#10b981',       // 绿色 - 贸易
  infrastructure: '#f59e0b', // 金色 - 基础设施
  security: '#ef4444',    // 红色 - 安全
  finance: '#3b82f6',     // 蓝色 - 金融
  resource: '#8b5cf6',    // 紫色 - 资源
  organization: '#06b6d4', // 青色 - 组织
  china: '#dc2626',       // 深红 - 中国项目
};

export const linkTypeNames: Record<string, string> = {
  trade: '贸易联系',
  infrastructure: '基础设施走廊',
  security: '安全联动',
  finance: '金融联系',
  resource: '资源争夺',
  organization: '区域组织',
  china: '中国项目',
};
