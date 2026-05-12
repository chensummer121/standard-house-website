'use client';

import { useEffect, useState } from 'react';

// Industry color mapping
export const INDUSTRY_COLORS = {
  building: '#f59e0b',      // 🏗️ 建材/建筑
  energy: '#ef4444',        // ⚡ 能源/电力
  manufacturing: '#3b82f6', // 🏭 制造业
  fintech: '#10b981',       // 💰 金融/Fintech
  agriculture: '#84cc16',   // 🌾 农业/加工
  logistics: '#8b5cf6',     // 🚚 物流/贸易
  ict: '#06b6d4',           // 💻 ICT/数字
  infrastructure: '#f97316', // 🏛️ 基建项目
  mining: '#a78bfa',        // ⛏️ 矿业
};

type IndustryType = keyof typeof INDUSTRY_COLORS;

interface City {
  name: string;
  nameEn: string;
  position: [number, number];
  population: string;
  industries: IndustryType[];
  description: string;
  slug: string;
}

interface Project {
  name: string;
  position: [number, number];
  info: string;
  industries: IndustryType[];
  status: 'operating' | 'construction' | 'planned';
  slug: string | null;
}

interface Corridor {
  name: string;
  positions: [number, number][];
  type: 'railway' | 'highway' | 'pipeline' | 'power';
  color: string;
}

interface IndustrialZone {
  name: string;
  positions: [number, number][];
  industries: IndustryType[];
  description: string;
}

interface BorderPort {
  name: string;
  position: [number, number];
  connectedCountry: string;
  type: 'land' | 'sea' | 'air';
}

interface CountryData {
  center: [number, number];
  zoom: number;
  cities: City[];
  projects: Project[];
  corridors: Corridor[];
  industrialZones: IndustrialZone[];
  borderPorts: BorderPort[];
}

// Comprehensive data for all 5 East African countries
const countryData: Record<string, CountryData> = {
  ethiopia: {
    center: [9.145, 40.489],
    zoom: 6,
    cities: [
      { name: '亚的斯亚贝巴', nameEn: 'Addis Ababa', position: [9.025, 38.747], population: '600万', industries: ['manufacturing', 'fintech', 'ict', 'logistics'], description: '首都，非盟总部，东非航空枢纽', slug: 'addis-ababa' },
      { name: '德雷达瓦', nameEn: 'Dire Dawa', position: [9.603, 41.856], population: '50万', industries: ['logistics', 'manufacturing', 'building'], description: '亚吉铁路起点，东非铁路枢纽', slug: 'dire-dawa' },
      { name: '阿达玛', nameEn: 'Adama', position: [8.54, 39.269], population: '58万', industries: ['manufacturing', 'building', 'logistics'], description: '工业走廊核心，纺织服装基地', slug: 'adama' },
      { name: '霍瓦萨', nameEn: 'Hawassa', position: [7.053, 38.485], population: '50万', industries: ['manufacturing', 'agriculture', 'logistics'], description: '南部经济中心，渔业农产品加工', slug: 'hawassa' },
      { name: '孔博勒查', nameEn: 'Kombolcha', position: [11.086, 39.736], population: '12万', industries: ['manufacturing', 'building', 'agriculture'], description: '工业走廊，纺织皮革工业园', slug: 'kombolcha' },
      { name: '默克莱', nameEn: 'Mekelle', position: [13.497, 39.475], population: '50万', industries: ['mining', 'agriculture', 'manufacturing'], description: '北部重镇，矿业/盐业中心', slug: 'mekelle' },
      { name: '吉马', nameEn: 'Jimma', position: [7.674, 36.835], population: '40万', industries: ['agriculture', 'logistics'], description: '咖啡产区最大城市', slug: 'jimma' },
      { name: '巴哈达尔', nameEn: 'Bahir Dar', position: [11.575, 37.361], population: '35万', industries: ['agriculture', 'manufacturing', 'energy'], description: '青尼罗河源头，旅游教育中心', slug: 'bahir-dar' },
      { name: '贡德尔', nameEn: 'Gonder', position: [12.6, 37.45], population: '30万', industries: ['agriculture', 'tourism'], description: '历史文化名城，畜牧业', slug: 'gonder' },
      { name: '德卜勒伯尔汉', nameEn: 'Debre Berhan', position: [9.68, 39.53], population: '10万', industries: ['manufacturing', 'energy'], description: '新建工业园，太阳能资源丰富', slug: 'debre-berhan' },
    ],
    projects: [
      { name: '复兴大坝(GERD)', position: [11.21, 35.09], info: '非洲最大水电站，装机5150MW，已开始发电', industries: ['energy'], status: 'operating', slug: null },
      { name: '阿达玛工业园', position: [8.55, 39.25], info: '100公顷，纺织服装、机械设备制造', industries: ['manufacturing', 'building'], status: 'operating', slug: 'adama' },
      { name: '孔博勒查工业园', position: [11.09, 39.74], info: '纺织、皮革、农产品加工综合园', industries: ['manufacturing', 'agriculture'], status: 'operating', slug: 'kombolcha' },
      { name: '霍瓦萨工业园', position: [7.05, 38.47], info: '综合工业园，食品加工、纺织服装', industries: ['manufacturing', 'agriculture'], status: 'operating', slug: 'hawassa' },
      { name: 'Bole Lemi工业园', position: [8.98, 38.79], info: '出口导向型制造业园区，一期二期运营', industries: ['manufacturing'], status: 'operating', slug: null },
      { name: '东方工业园', position: [8.9, 38.85], info: '中国境外经贸合作区，60多家企业', industries: ['manufacturing', 'building'], status: 'operating', slug: null },
      { name: '埃塞-吉布提供电线路', position: [9.5, 41.0], info: '230kV跨境输电线路，保障工业用电', industries: ['energy'], status: 'construction', slug: null },
      { name: '索马里公路项目', position: [6.5, 44.0], info: '连接Addis Ababa与Jigjiga的600km公路', industries: ['infrastructure'], status: 'construction', slug: null },
    ],
    corridors: [
      { name: '亚吉铁路', positions: [[9.025, 38.747], [9.2, 39.2], [8.85, 39.6], [8.5, 40.0], [8.0, 40.3], [7.5, 40.8], [6.5, 42.0], [11.588, 43.145]], type: 'railway', color: '#dc2626' },
      { name: 'A2公路(南北动脉)', positions: [[14.0, 38.0], [13.5, 39.0], [12.6, 37.5], [11.6, 37.4], [9.7, 39.5], [9.0, 38.8], [8.5, 39.3]], type: 'highway', color: '#ffd740' },
    ],
    industrialZones: [
      { name: '亚的斯-阿达玛工业走廊', positions: [[8.5, 38.8], [8.7, 38.9], [8.9, 39.0], [9.0, 39.2], [9.1, 39.0], [8.8, 38.7]], industries: ['manufacturing', 'building'], description: '覆盖Addis Ababa到Adama的制造业集聚带' },
      { name: '东部铁路经济带', positions: [[9.0, 39.0], [9.3, 40.0], [9.5, 41.0], [9.6, 41.5], [10.0, 42.0], [11.0, 42.5], [11.5, 43.0]], industries: ['logistics', 'manufacturing'], description: '沿亚吉铁路的物流和出口加工区' },
      { name: '西北咖啡产区', positions: [[7.0, 36.0], [7.5, 36.5], [8.0, 36.8], [8.5, 37.0], [8.0, 36.5], [7.5, 36.2]], industries: ['agriculture'], description: '精品咖啡主要产区，Kaffa森林起源地' },
    ],
    borderPorts: [
      { name: '吉布提港', position: [11.588, 43.145], connectedCountry: '出海通道', type: 'sea' },
      { name: '莫亚莱', position: [4.21, 42.08], connectedCountry: '肯尼亚', type: 'land' },
      { name: 'Metema', position: [12.95, 36.2], connectedCountry: '苏丹', type: 'land' },
      { name: 'Woldiya公路', position: [12.5, 39.6], connectedCountry: '苏丹边境', type: 'land' },
    ],
  },
  kenya: {
    center: [-0.0236, 37.9062],
    zoom: 6,
    cities: [
      { name: '内罗毕', nameEn: 'Nairobi', position: [-1.2864, 36.8172], population: '500万', industries: ['ict', 'fintech', 'manufacturing', 'logistics'], description: '首都，非洲硅谷，东非金融中心', slug: 'nairobi' },
      { name: '蒙巴萨', nameEn: 'Mombasa', position: [-4.0435, 39.6682], population: '150万', industries: ['logistics', 'manufacturing', 'energy'], description: '东非最大港口，进出口枢纽', slug: 'mombasa' },
      { name: '基苏木', nameEn: 'Kisumu', position: [-0.0917, 34.768], population: '50万', industries: ['agriculture', 'manufacturing', 'logistics'], description: '维多利亚湖畔，西部经济中心', slug: 'kisumu' },
      { name: '纳库鲁', nameEn: 'Nakuru', position: [-0.3031, 36.08], population: '60万', industries: ['agriculture', 'manufacturing', 'energy'], description: '农业中心，花卉出口，温泉地热', slug: 'nakuru' },
      { name: '埃尔多雷特', nameEn: 'Eldoret', position: [0.5143, 35.2698], population: '50万', industries: ['agriculture', 'manufacturing', 'logistics'], description: '长跑之乡，谷物肉类加工基地', slug: 'eldoret' },
      { name: '蒂卡', nameEn: 'Thika', position: [-1.033, 37.067], population: '40万', industries: ['manufacturing', 'agriculture'], description: '工业城市，纺织服装农产品加工', slug: 'thika' },
      { name: '马林迪', nameEn: 'Malindi', position: [-3.213, 40.117], population: '12万', industries: ['tourism', 'agriculture'], description: '旅游城市，渔业，香料种植', slug: 'malindi' },
      { name: '拉穆', nameEn: 'Lamu', position: [-2.2686, 40.902], population: '3万', industries: ['tourism', 'logistics'], description: '历史文化古城，LAPSSET起点', slug: 'lamu' },
      { name: '尼耶里', nameEn: 'Nyeri', position: [-0.42, 36.95], population: '25万', industries: ['agriculture', 'manufacturing'], description: '咖啡产区，茶叶种植中心', slug: 'nyeri' },
      { name: '加里萨', nameEn: 'Garissa', position: [-0.45, 39.64], population: '15万', industries: ['agriculture', 'logistics'], description: '东北省首府，畜牧业中心', slug: 'garissa' },
    ],
    projects: [
      { name: '蒙内铁路', position: [-1.8, 38.2], info: '内罗毕-蒙巴萨标准轨铁路480km，已运营', industries: ['infrastructure'], status: 'operating', slug: null },
      { name: 'Olkaria地热电站', position: [-0.9, 36.3], info: '非洲最大地热项目，运营装机862MW', industries: ['energy'], status: 'operating', slug: null },
      { name: 'Dongo Kundu SEZ', position: [-4.1, 39.7], info: '蒙巴萨特别经济区3000公顷，制造物流', industries: ['manufacturing', 'logistics'], status: 'construction', slug: 'mombasa' },
      { name: 'LAPSSET走廊', position: [-1.5, 40.0], info: 'Lamu港-南苏丹-埃塞走廊，多期建设', industries: ['infrastructure', 'logistics'], status: 'construction', slug: null },
      { name: 'Lamu港', position: [-2.27, 40.9], info: '东非深海港，一期已运营', industries: ['logistics'], status: 'operating', slug: 'lamu' },
      { name: '内罗毕高速公路', position: [-1.3, 36.85], info: '内罗毕-蒙巴萨高速收费公路', industries: ['infrastructure'], status: 'construction', slug: null },
      { name: 'KenGen地热扩展', position: [-0.95, 36.35], info: 'Olkaria五期新增161MW地热发电', industries: ['energy'], status: 'construction', slug: null },
      { name: 'Mombasa West SEZ', position: [-4.0, 39.6], info: '蒙巴萨西部工业区，石油炼化制造', industries: ['manufacturing', 'energy'], status: 'planned', slug: 'mombasa' },
    ],
    corridors: [
      { name: '蒙内铁路', positions: [[-1.2864, 36.8172], [-1.5, 37.0], [-1.8, 37.3], [-2.2, 37.6], [-2.5, 37.9], [-2.8, 38.2], [-3.2, 38.6], [-3.5, 38.9], [-3.8, 39.2], [-4.0435, 39.6682]], type: 'railway', color: '#dc2626' },
      { name: 'LAPSSET走廊', positions: [[-2.27, 40.9], [-1.5, 40.0], [-0.8, 39.5], [1.5, 40.0], [3.5, 32.0]], type: 'highway', color: '#ff9100' },
      { name: '高压输电网', positions: [[-1.0, 36.5], [-0.8, 36.3], [-0.5, 36.1], [-0.3, 36.0], [-0.1, 35.5], [0.0, 35.0]], type: 'power', color: '#ffd740' },
    ],
    industrialZones: [
      { name: '内罗毕ICT创新圈', positions: [[-1.25, 36.78], [-1.28, 36.82], [-1.30, 36.85], [-1.32, 36.80], [-1.28, 36.77]], industries: ['ict', 'fintech'], description: 'Westlands-Kilimani科技企业集聚区' },
      { name: '蒙巴萨港口经济区', positions: [[-4.1, 39.6], [-4.0, 39.7], [-3.9, 39.75], [-4.0, 39.65], [-4.1, 39.55]], industries: ['logistics', 'manufacturing'], description: '港口、炼油、制造综合经济区' },
      { name: '维多利亚湖区', positions: [[-0.3, 34.8], [0.0, 34.5], [0.3, 34.2], [0.5, 35.0], [0.2, 35.3]], industries: ['agriculture', 'manufacturing'], description: '沿湖渔业农业加工带' },
      { name: ' Rift Valley农业带', positions: [[0.0, 36.0], [-0.3, 36.1], [-0.6, 36.2], [0.2, 35.5], [0.5, 35.3]], industries: ['agriculture', 'energy'], description: '花卉种植、地热能源综合带' },
    ],
    borderPorts: [
      { name: '蒙巴萨港', position: [-4.05, 39.67], connectedCountry: '出海通道', type: 'sea' },
      { name: 'Namanga', position: [-2.22, 36.8], connectedCountry: '坦桑尼亚', type: 'land' },
      { name: 'Busia', position: [0.46, 34.1], connectedCountry: '乌干达', type: 'land' },
      { name: 'Malaba', position: [0.65, 34.2], connectedCountry: '乌干达', type: 'land' },
      { name: 'Moyale', position: [3.52, 39.05], connectedCountry: '埃塞俄比亚', type: 'land' },
      { name: 'Lamu港', position: [-2.27, 40.9], connectedCountry: '区域出口', type: 'sea' },
    ],
  },
  uganda: {
    center: [1.3733, 32.2903],
    zoom: 7,
    cities: [
      { name: '坎帕拉', nameEn: 'Kampala', position: [0.3476, 32.5825], population: '350万', industries: ['fintech', 'manufacturing', 'logistics', 'ict'], description: '首都，商业中心，金融业集聚', slug: 'kampala' },
      { name: '恩德培', nameEn: 'Entebbe', position: [0.0619, 32.4473], population: '8万', industries: ['logistics', 'tourism'], description: '国际机场，维多利亚湖畔休闲区', slug: 'entebbe' },
      { name: '金贾', nameEn: 'Jinja', position: [0.4244, 33.2037], population: '10万', industries: ['manufacturing', 'energy', 'agriculture'], description: '尼罗河源头，工业化城市', slug: 'jinja' },
      { name: '姆巴莱', nameEn: 'Mbale', position: [1.0833, 34.175], population: '12万', industries: ['agriculture', 'manufacturing'], description: '东部农业咖啡产区', slug: 'mbale' },
      { name: '古卢', nameEn: 'Gulu', position: [2.7743, 32.299], population: '15万', industries: ['agriculture', 'logistics'], description: '北部中心城市，区域贸易', slug: 'gulu' },
      { name: '姆巴拉拉', nameEn: 'Mbarara', position: [-0.6083, 30.6553], population: '20万', industries: ['agriculture', 'manufacturing'], description: '西部畜牧乳业中心', slug: 'mbarara' },
      { name: '霍伊马', nameEn: 'Hoima', position: [1.44, 31.35], population: '10万', industries: ['energy', 'agriculture'], description: '油气区块中心，石油开采重镇', slug: 'hoima' },
      { name: '索罗蒂', nameEn: 'Soroti', position: [1.72, 33.6], population: '8万', industries: ['agriculture', 'manufacturing'], description: '东部农业区中心', slug: 'soroti' },
      { name: '里拉', nameEn: 'Lira', position: [2.25, 32.9], population: '10万', industries: ['agriculture', 'logistics'], description: '北部区域中心', slug: 'lira' },
      { name: '波特堡', nameEn: 'Fort Portal', position: [0.65, 30.25], population: '6万', industries: ['agriculture', 'tourism'], description: '旅游门户，茶产区', slug: 'fort-portal' },
    ],
    projects: [
      { name: 'EACOP输油管道', position: [0.5, 32.0], info: '1443km，从Hoima到坦桑Tanga港，24万桶/日', industries: ['energy'], status: 'construction', slug: null },
      { name: '金贾水电站', position: [0.43, 33.20], info: '尼罗河梯级电站，装机250MW', industries: ['energy'], status: 'operating', slug: 'jinja' },
      { name: 'Tilenga油田', position: [1.8, 31.2], info: 'TotalEnergies主导，设计产能19万桶/日', industries: ['energy'], status: 'construction', slug: null },
      { name: 'Buliisa油田', position: [1.8, 31.5], info: '与Tilenga配套的油田开发项目', industries: ['energy'], status: 'construction', slug: null },
      { name: '坎帕拉工业园', position: [0.35, 32.6], info: 'Kampala Industrial and Business Park', industries: ['manufacturing'], status: 'construction', slug: 'kampala' },
      { name: 'Mirama Hills边境', position: [-1.15, 29.9], info: '连接卢旺达边境贸易区', industries: ['logistics'], status: 'operating', slug: null },
      { name: '标准轨铁路一期', position: [0.5, 32.5], info: 'Malaba-Owino-Sigulu货运铁路', industries: ['infrastructure'], status: 'planned', slug: null },
      { name: 'Karuma水电站', position: [2.25, 32.25], info: '600MW水电站，尼罗河上游', industries: ['energy'], status: 'construction', slug: null },
    ],
    corridors: [
      { name: 'EACOP管道', positions: [[1.44, 31.35], [1.3, 31.5], [1.1, 31.8], [0.9, 32.2], [0.7, 32.6], [0.3, 33.0], [-0.2, 33.5], [-1.0, 34.0], [-2.0, 34.5], [-3.0, 35.0], [-4.0, 35.5], [-5.5, 36.0], [-5.8, 39.1]], type: 'pipeline', color: '#ffd740' },
      { name: '北部公路动脉', positions: [[0.35, 32.6], [1.0, 32.7], [1.5, 32.8], [2.0, 32.85], [2.5, 32.9], [3.0, 33.0]], type: 'highway', color: '#ff9100' },
      { name: '西部公路', positions: [[0.35, 32.6], [0.0, 32.2], [-0.3, 31.5], [-0.6, 30.7]], type: 'highway', color: '#84cc16' },
    ],
    industrialZones: [
      { name: '坎帕拉-金贾工业带', positions: [[0.1, 32.4], [0.3, 32.6], [0.5, 32.8], [0.4, 33.1], [0.2, 33.3]], industries: ['manufacturing', 'fintech', 'agriculture'], description: '沿尼罗河两岸的制造业集聚带' },
      { name: '阿尔伯丁裂谷油气区', positions: [[1.5, 31.3], [1.8, 31.4], [2.0, 31.3], [2.1, 31.5], [1.7, 31.6]], industries: ['energy'], description: 'Lake Albert盆地油气开发区' },
      { name: '北部重建区', positions: [[2.5, 32.8], [3.0, 33.0], [3.5, 33.2], [2.8, 32.6]], industries: ['agriculture', 'logistics'], description: '战后重建区域，农业贸易复苏' },
      { name: '维多利亚湖畔农业带', positions: [[0.0, 32.5], [0.2, 32.8], [0.4, 33.0], [0.1, 33.3], [-0.2, 33.2]], industries: ['agriculture', 'fishing'], description: '沿湖渔业和甘蔗种植带' },
    ],
    borderPorts: [
      { name: 'Busia', position: [0.46, 34.1], connectedCountry: '肯尼亚', type: 'land' },
      { name: 'Malaba', position: [0.65, 34.2], connectedCountry: '肯尼亚', type: 'land' },
      { name: 'Mutukula', position: [-1.22, 30.08], connectedCountry: '坦桑尼亚', type: 'land' },
      { name: 'Mirama Hills', position: [-1.15, 29.9], connectedCountry: '卢旺达', type: 'land' },
      { name: 'Elegu', position: [3.35, 32.05], connectedCountry: '南苏丹', type: 'land' },
      { name: 'Kagitumba', position: [-1.28, 30.07], connectedCountry: '卢旺达', type: 'land' },
    ],
  },
  tanzania: {
    center: [-6.369, 34.8888],
    zoom: 5,
    cities: [
      { name: '达累斯萨拉姆', nameEn: 'Dar es Salaam', position: [-6.7924, 39.2083], population: '600万', industries: ['logistics', 'fintech', 'manufacturing', 'ict'], description: '经济首都，最大城市，港口金融中心', slug: 'dar-es-salaam' },
      { name: '多多马', nameEn: 'Dodoma', position: [-6.163, 35.7516], population: '50万', industries: ['government'], description: '行政首都，政府机构迁移中', slug: 'dodoma' },
      { name: '阿鲁沙', nameEn: 'Arusha', position: [-3.3869, 36.683], population: '50万', industries: ['tourism', 'agriculture', 'logistics'], description: '旅游门户，EAC秘书处驻地', slug: 'arusha' },
      { name: '姆万扎', nameEn: 'Mwanza', position: [-2.5167, 32.9], population: '100万', industries: ['mining', 'manufacturing', 'agriculture'], description: '维多利亚湖畔，矿业服务中心', slug: 'mwanza' },
      { name: '桑给巴尔', nameEn: 'Zanzibar', position: [-6.1659, 39.2029], population: '50万', industries: ['tourism', 'agriculture', 'logistics'], description: '旅游岛，香料贸易自由区', slug: 'zanzibar' },
      { name: '姆贝亚', nameEn: 'Mbeya', position: [-8.9094, 33.4506], population: '40万', industries: ['agriculture', 'mining', 'manufacturing'], description: '西南部农业矿业中心', slug: 'mbeya' },
      { name: '坦加', nameEn: 'Tanga', position: [-5.58, 39.1], population: '25万', industries: ['logistics', 'agriculture', 'manufacturing'], description: 'EACOP管道终点港口', slug: 'tanga' },
      { name: '莫希', nameEn: 'Moshi', position: [-3.35, 37.35], population: '20万', industries: ['agriculture', 'tourism'], description: '乞力马扎罗山脚下，咖啡产区', slug: 'moshi' },
      { name: '基戈马', nameEn: 'Kigoma', position: [-4.88, 29.63], population: '20万', industries: ['logistics', 'agriculture'], description: '坦噶尼喀湖畔，港口贸易', slug: 'kigoma' },
      { name: '莫罗戈罗', nameEn: 'Morogoro', position: [-6.82, 37.67], population: '30万', industries: ['agriculture', 'logistics', 'mining'], description: '中部走廊，农业和煤炭', slug: 'morogoro' },
    ],
    projects: [
      { name: 'LNG项目', position: [-10.0, 39.5], info: 'Lindi地区，Equinor+Shell开发，年产220万吨', industries: ['energy'], status: 'planned', slug: null },
      { name: '坦加港扩建', position: [-5.58, 39.1], info: 'EACOP管道终点，石油出口专用港', industries: ['logistics', 'energy'], status: 'construction', slug: 'tanga' },
      { name: '巴加莫约港', position: [-6.8, 38.9], info: '深海港开发，设计能力2000万吨', industries: ['logistics'], status: 'planned', slug: null },
      { name: '标准轨铁路SGR', position: [-6.5, 38.5], info: 'Dar-Dodoma-Morogoro段建设中', industries: ['infrastructure'], status: 'construction', slug: null },
      { name: 'Kurasini物流中心', position: [-6.82, 39.28], info: '达累斯萨拉姆物流枢纽，提升效率', industries: ['logistics'], status: 'operating', slug: 'dar-es-salaam' },
      { name: 'JCHF煤矿铁路', position: [-8.5, 37.0], info: '姆贝亚煤矿到港口的铁路运煤线', industries: ['mining', 'infrastructure'], status: 'operating', slug: null },
      { name: 'Nyerere水电站', position: [-7.8, 37.3], info: '鲁伏河流域，360MW水电站', industries: ['energy'], status: ['construction'], slug: null },
      { name: 'Mtwara LNG项目', position: [-10.3, 40.2], info: '南部天然气开发，与LNG项目配套', industries: ['energy'], status: 'planned', slug: null },
    ],
    corridors: [
      { name: 'TAZARA铁路', positions: [[-6.7924, 39.2083], [-6.3, 38.5], [-5.5, 36.5], [-9.0, 33.0], [-13.5, 32.6]], type: 'railway', color: '#ffd740' },
      { name: 'SGR标准轨铁路', positions: [[-6.7924, 39.2083], [-6.5, 38.8], [-6.4, 38.2], [-6.2, 37.0], [-6.1, 36.2]], type: 'railway', color: '#dc2626' },
      { name: '中部走廊公路', positions: [[-6.8, 39.2], [-6.5, 38.5], [-6.2, 37.5], [-6.1, 36.5], [-9.0, 33.5]], type: 'highway', color: '#ff9100' },
      { name: 'EACOP管道', positions: [[-2.5, 33.5], [-3.0, 34.5], [-4.0, 35.5], [-5.5, 36.5], [-5.58, 39.1]], type: 'pipeline', color: '#ffd740' },
    ],
    industrialZones: [
      { name: '达累斯萨拉姆港口经济区', positions: [[-6.9, 39.1], [-6.8, 39.25], [-6.7, 39.3], [-6.75, 39.15]], industries: ['logistics', 'manufacturing'], description: '港口、工业、贸易一体化区' },
      { name: 'Arusha-Moshi旅游咖啡带', positions: [[-3.4, 36.7], [-3.5, 37.0], [-3.4, 37.3], [-3.2, 37.0]], industries: ['tourism', 'agriculture'], description: '乞力马扎罗旅游和咖啡产区' },
      { name: '姆万扎矿业服务区', positions: [[-2.6, 32.8], [-2.4, 33.0], [-2.3, 32.7], [-2.5, 32.5]], industries: ['mining', 'manufacturing'], description: '维多利亚湖区矿业加工服务' },
      { name: 'Mbeya南部农业区', positions: [[-8.5, 33.2], [-8.8, 33.4], [-9.0, 33.3], [-8.7, 33.1]], industries: ['agriculture', 'mining'], description: '茶叶、咖啡、矿产综合带' },
    ],
    borderPorts: [
      { name: '达累斯萨拉姆港', position: [-6.82, 39.28], connectedCountry: '出海通道', type: 'sea' },
      { name: '坦加港', position: [-5.58, 39.1], connectedCountry: 'EACOP管道', type: 'sea' },
      { name: 'Namanga', position: [-2.22, 36.8], connectedCountry: '肯尼亚', type: 'land' },
      { name: 'Rusumo', position: [-2.43, 30.78], connectedCountry: '卢旺达', type: 'land' },
      { name: 'Kabanga', position: [-2.65, 30.45], connectedCountry: '布隆迪', type: 'land' },
      { name: 'Manyovu', position: [-4.4, 30.4], connectedCountry: '布隆迪', type: 'land' },
    ],
  },
  rwanda: {
    center: [-1.9403, 29.8739],
    zoom: 8,
    cities: [
      { name: '基加利', nameEn: 'Kigali', position: [-1.9444, 30.0616], population: '120万', industries: ['ict', 'fintech', 'manufacturing', 'tourism'], description: '首都，ICT创新中心，非洲最安全首都', slug: 'kigali' },
      { name: '布塔雷', nameEn: 'Butare/Huye', position: [-2.5967, 29.7394], population: '12万', industries: ['manufacturing', 'agriculture', 'education'], description: '大学城，教育文化中心', slug: 'butare' },
      { name: '穆桑泽', nameEn: 'Musanze', position: [-1.4986, 29.6349], population: '13万', industries: ['tourism', 'agriculture', 'manufacturing'], description: '火山大猩猩旅游门户', slug: 'musanze' },
      { name: '鲁巴武', nameEn: 'Rubavu/Gisenyi', position: [-1.7047, 29.3106], population: '12万', industries: ['logistics', 'tourism', 'manufacturing'], description: '基伍湖畔，与刚果金接壤', slug: 'rubavu' },
      { name: '鲁西济', nameEn: 'Rusizi/Cyangugu', position: [-2.1753, 28.9083], population: '8万', industries: ['logistics', 'agriculture'], description: '西南边境，与布隆迪/刚果交汇', slug: 'rusizi' },
      { name: '尼亚加塔雷', nameEn: 'Nyagatare', position: [-1.3, 30.33], population: '10万', industries: ['agriculture'], description: '东部农业区，畜牧养殖', slug: 'nyagatare' },
      { name: '卡永扎', nameEn: 'Kayonza', position: [-1.95, 30.57], population: '8万', industries: ['agriculture', 'tourism'], description: '东部走廊，农业旅游', slug: 'kayonza' },
      { name: '卡龙基', nameEn: 'Karongi', position: [-2.07, 29.35], population: '6万', industries: ['tourism', 'agriculture'], description: '基伍湖畔，历史文化旅游', slug: 'karongi' },
    ],
    projects: [
      { name: 'Kigali Innovation City', position: [-1.94, 30.06], info: '科技企业聚集区，一期运营，二期建设', industries: ['ict', 'fintech'], status: 'construction', slug: 'kigali' },
      { name: 'Bugesera国际机场', position: [-2.45, 30.05], info: '新国际机场，设计年客运450万，2025年运营', industries: ['logistics'], status: 'construction', slug: null },
      { name: 'Mukungwa II水电', position: [-1.52, 29.68], info: '水电站扩建，装机43MW', industries: ['energy'], status: 'operating', slug: null },
      { name: 'Rusumo Falls水电', position: [-2.43, 30.78], info: '与坦桑尼亚、卢旺达共建，80MW', industries: ['energy'], status: 'construction', slug: null },
      { name: 'Kigali SEZ', position: [-1.97, 30.08], info: '经济特区，制造业出口加工', industries: ['manufacturing'], status: 'operating', slug: 'kigali' },
      { name: 'Huye风电场', position: [-2.6, 29.75], info: '卢旺达首个商业风电项目', industries: ['energy'], status: 'operating', slug: null },
      { name: 'Rwanda Mines项目', position: [-1.7, 29.9], info: '3T矿产(锡钨钽)现代化开采项目', industries: ['mining'], status: 'construction', slug: null },
      { name: '一次性塑料禁令配套产业', position: [-1.95, 30.05], info: '塑料替代品产业园，塑料禁令政策配套', industries: ['manufacturing', 'agriculture'], status: 'planned', slug: null },
    ],
    corridors: [
      { name: '北部走廊(到蒙巴萨)', positions: [[-1.94, 30.06], [-1.3, 30.1], [-0.9, 30.2], [0.3, 34.0], [0.65, 34.2], [-4.04, 39.67]], type: 'highway', color: '#ff9100' },
      { name: '中央走廊(到坦桑)', positions: [[-1.94, 30.06], [-2.0, 30.2], [-2.3, 30.5], [-2.43, 30.78]], type: 'highway', color: '#ffd740' },
      { name: '电力联网(东非电网)', positions: [[-1.94, 30.06], [-1.5, 30.0], [-1.0, 30.0], [0.5, 32.0]], type: 'power', color: '#dc2626' },
    ],
    industrialZones: [
      { name: '基加利ICT创新圈', positions: [[-1.92, 30.05], [-1.95, 30.07], [-1.97, 30.06], [-1.94, 30.04]], industries: ['ict', 'fintech'], description: 'Kigali CBD科技企业集聚区' },
      { name: '东部农业带', positions: [[-1.5, 30.2], [-1.3, 30.3], [-1.2, 30.4], [-1.4, 30.3]], industries: ['agriculture'], description: '畜牧和粮食种植区' },
      { name: '西部旅游带', positions: [[-1.5, 29.6], [-1.7, 29.3], [-2.0, 29.3], [-2.2, 29.5]], industries: ['tourism', 'agriculture'], description: '火山国家公园和湖滨旅游区' },
      { name: 'Rubavu边境贸易区', positions: [[-1.7, 29.3], [-1.65, 29.4], [-1.75, 29.4], [-1.8, 29.3]], industries: ['logistics', 'manufacturing'], description: '与刚果金边境的转口贸易区' },
    ],
    borderPorts: [
      { name: 'Rubavu', position: [-1.7047, 29.3106], connectedCountry: '刚果(金)', type: 'land' },
      { name: 'Rusizi', position: [-2.1753, 28.9083], connectedCountry: '刚果(金)/布隆迪', type: 'land' },
      { name: 'Kagitumba', position: [-1.28, 30.07], connectedCountry: '乌干达', type: 'land' },
      { name: 'Rusumo', position: [-2.43, 30.78], connectedCountry: '坦桑尼亚', type: 'land' },
      { name: 'Nyagatare公路', position: [-1.3, 30.35], connectedCountry: '乌干达', type: 'land' },
    ],
  },
  'south-sudan': {
    center: [6.877, 31.307],
    zoom: 7,
    cities: [
      { name: '朱巴', nameEn: 'Juba', position: [4.8517, 31.5825], population: '40万', industries: ['logistics', 'energy', 'agriculture'], description: '首都，尼罗河畔，石油经济中心', slug: 'juba' },
      { name: '马拉卡勒', nameEn: 'Malakal', position: [9.5374, 31.6525], population: '15万', industries: ['agriculture', 'energy'], description: '上尼罗州首府，白尼罗河上游', slug: 'malakal' },
      { name: '瓦乌', nameEn: 'Wau', position: [7.7011, 27.9895], population: '12万', industries: ['agriculture', 'logistics'], description: '西部重镇，牲畜贸易中心', slug: 'wau' },
      { name: '本提乌', nameEn: 'Bentiu', position: [9.2322, 29.7975], population: '8万', industries: ['energy', 'agriculture'], description: '石油产区核心，黑格里布油田', slug: 'bentiu' },
      { name: '延比奥', nameEn: 'Yei', position: [4.0953, 28.5903], population: '10万', industries: ['agriculture', 'logistics'], description: '西南部，边境贸易要地', slug: 'yei' },
    ],
    projects: [
      { name: 'Paloch油田', position: [9.8, 31.2], info: '主要石油产区，日产量约4万桶', industries: ['energy'], status: 'operating', slug: null },
      { name: '朱巴-肯尼亚公路', position: [3.5, 35.0], info: '连接南苏丹与肯尼亚的跨境公路', industries: ['infrastructure'], status: 'planned', slug: null },
      { name: '石油管道维修', position: [10.0, 32.0], info: '途经苏丹的石油管道修复工程', industries: ['energy'], status: 'construction', slug: null },
    ],
    corridors: [
      { name: '石油管道(到苏丹)', positions: [[9.2, 29.8], [9.5, 30.5], [9.8, 31.2], [10.0, 32.0], [15.0, 32.5], [17.5, 33.5], [19.5, 37.2]], type: 'pipeline', color: '#ef4444' },
      { name: 'LAPSSET走廊南延', positions: [[4.1, 35.5], [4.0, 34.0], [4.2, 32.5], [5.0, 31.0]], type: 'highway', color: '#ff9100' },
    ],
    industrialZones: [
      { name: 'Unity州石油带', positions: [[9.0, 29.5], [9.3, 29.8], [9.5, 30.0], [9.2, 29.7]], industries: ['energy'], description: '黑格里布油田核心区' },
      { name: 'Upper Nile石油区', positions: [[9.5, 31.5], [9.8, 31.2], [10.0, 31.0], [9.7, 31.3]], industries: ['energy'], description: 'Paloch油田及周边产区' },
    ],
    borderPorts: [
      { name: 'Elegu', position: [3.5128, 32.0711], connectedCountry: '乌干达', type: 'land' },
      { name: 'Nadapal', position: [4.2333, 33.0833], connectedCountry: '肯尼亚', type: 'land' },
      { name: 'Kaya', position: [3.5833, 31.7167], connectedCountry: '苏丹', type: 'land' },
    ],
  },
  burundi: {
    center: [-3.374, 29.919],
    zoom: 9,
    cities: [
      { name: '布琼布拉', nameEn: 'Bujumbura', position: [-3.3822, 29.3614], population: '120万', industries: ['logistics', 'building', 'manufacturing'], description: '前首都，最大城市，坦噶尼喀湖港口', slug: 'bujumbura' },
      { name: '基特加', nameEn: 'Gitega', position: [-3.4286, 29.9292], population: '15万', industries: ['government', 'agriculture'], description: '政治首都，政府机构所在地', slug: 'gitega' },
      { name: '恩戈齐', nameEn: 'Ngozi', position: [-2.9053, 29.8311], population: '10万', industries: ['agriculture', 'manufacturing'], description: '北部经济中心，咖啡产区', slug: 'ngozi' },
      { name: '穆松加蒂', nameEn: 'Musongati', position: [-3.85, 29.93], population: '5万', industries: ['mining'], description: '镍矿开采区，大型镍矿项目', slug: 'musongati' },
      { name: '鲁蒙盖', nameEn: 'Rumonge', position: [-3.9775, 29.4386], population: '8万', industries: ['agriculture', 'logistics'], description: '南部湖港，棕榈油产区', slug: 'rumonge' },
    ],
    projects: [
      { name: 'Musongati镍矿', position: [-3.85, 29.93], info: '大型镍矿项目，储量约300万吨', industries: ['mining'], status: 'planned', slug: null },
      { name: '布琼布拉港扩建', position: [-3.3822, 29.3614], info: '坦噶尼喀湖港口现代化改造', industries: ['logistics'], status: 'construction', slug: null },
    ],
    corridors: [
      { name: '中央走廊(到达累斯萨拉姆)', positions: [[-3.38, 29.36], [-3.5, 29.0], [-4.0, 29.5], [-5.0, 29.8], [-6.8, 29.6], [-8.0, 31.0], [-8.9, 33.0]], type: 'railway', color: '#3b82f6' },
    ],
    industrialZones: [
      { name: '布琼布拉工业区', positions: [[-3.35, 29.30], [-3.38, 29.32], [-3.41, 29.35], [-3.38, 29.33]], industries: ['manufacturing', 'logistics'], description: '首都圈轻工业和物流集散' },
    ],
    borderPorts: [
      { name: 'Gatumba', position: [-3.47, 29.22], connectedCountry: '刚果金', type: 'land' },
      { name: 'Kobero', position: [-2.65, 30.20], connectedCountry: '卢旺达', type: 'land' },
      { name: 'Kabanga', position: [-3.05, 30.55], connectedCountry: '坦桑尼亚', type: 'land' },
    ],
  },
  djibouti: {
    center: [11.588, 42.896],
    zoom: 9,
    cities: [
      { name: '吉布提市', nameEn: 'Djibouti City', position: [11.5884, 43.1456], population: '60万', industries: ['logistics', 'manufacturing', 'fintech'], description: '首都，红海入口，亚吉铁路终点', slug: 'djibouti-city' },
      { name: '阿里萨比埃', nameEn: 'Ali Sabieh', position: [11.1558, 42.7122], population: '5万', industries: ['logistics', 'mining'], description: '南部边境城市，埃塞-吉布提走廊', slug: 'ali-sabieh' },
      { name: '塔朱拉', nameEn: 'Tadjoura', position: [11.7861, 42.8814], population: '3万', industries: ['mining', 'agriculture'], description: '盐业产区，渔业基地', slug: 'tadjoura' },
      { name: '奥博克', nameEn: 'Obock', position: [11.9689, 43.2897], population: '2万', industries: ['logistics'], description: '北部港口，对岸也门', slug: 'obock' },
    ],
    projects: [
      { name: '多拉莱港', position: [11.57, 43.18], info: '非洲最大集装箱码头之一，中资参建', industries: ['logistics'], status: 'operating', slug: null },
      { name: '吉布提自贸区', position: [11.52, 43.22], info: '招商局参与，占地48km²', industries: ['manufacturing', 'logistics'], status: 'operating', slug: null },
      { name: '亚吉铁路终点站', position: [11.55, 43.20], info: '亚吉铁路吉布提段，中国承建', industries: ['logistics', 'infrastructure'], status: 'operating', slug: null },
    ],
    corridors: [
      { name: '亚吉铁路走廊', positions: [[9.02, 38.75], [9.60, 41.86], [10.65, 42.00], [11.10, 42.50], [11.59, 43.15]], type: 'railway', color: '#ef4444' },
    ],
    industrialZones: [
      { name: '吉布提自贸区', positions: [[11.50, 43.18], [11.52, 43.22], [11.54, 43.20], [11.51, 43.19]], industries: ['manufacturing', 'logistics'], description: '招商局主导，东非物流枢纽' },
    ],
    borderPorts: [
      { name: 'Galafi', position: [11.55, 42.40], connectedCountry: '埃塞俄比亚', type: 'land' },
      { name: 'Loyada', position: [11.47, 43.26], connectedCountry: '索马里', type: 'land' },
    ],
  },
  somalia: {
    center: [5.015, 46.199],
    zoom: 6,
    cities: [
      { name: '摩加迪沙', nameEn: 'Mogadishu', position: [2.0469, 45.3181], population: '250万', industries: ['logistics', 'building', 'manufacturing'], description: '首都，最大港口，重建中', slug: 'mogadishu' },
      { name: '哈尔格萨', nameEn: 'Hargeisa', position: [9.5627, 44.0650], population: '100万', industries: ['agriculture', 'fintech', 'logistics'], description: '索马里兰首府，相对稳定', slug: 'hargeisa' },
      { name: '基斯马尤', nameEn: 'Kismayo', position: [-0.3500, 42.5500], population: '30万', industries: ['agriculture', 'logistics'], description: '南部港口，农业和渔业中心', slug: 'kismayo' },
      { name: '博萨索', nameEn: 'Bosaso', position: [11.2755, 49.1797], population: '70万', industries: ['logistics', 'agriculture'], description: '邦特兰商业中心，红海港口', slug: 'bosaso' },
      { name: '加罗韦', nameEn: 'Garowe', position: [8.3808, 48.4828], population: '15万', industries: ['government'], description: '邦特兰行政中心', slug: 'garowe' },
    ],
    projects: [
      { name: '摩加迪沙港重建', position: [2.0469, 45.3181], info: '土耳其合作港口现代化', industries: ['logistics'], status: 'construction', slug: null },
      { name: '博萨索港扩建', position: [11.28, 49.18], info: '阿联酋投资港口升级', industries: ['logistics'], status: 'operating', slug: null },
    ],
    corridors: [
      { name: '畜牧贸易通道(到阿拉伯)', positions: [[9.56, 44.07], [11.28, 49.18], [12.0, 50.0], [14.0, 48.0]], type: 'trade', color: '#f59e0b' },
    ],
    industrialZones: [
      { name: '摩加迪沙重建区', positions: [[2.02, 45.28], [2.04, 45.30], [2.06, 45.32], [2.04, 45.31]], industries: ['building', 'manufacturing'], description: '首都重建核心区' },
    ],
    borderPorts: [
      { name: 'Bulo Hawo', position: [3.55, 42.38], connectedCountry: '肯尼亚', type: 'land' },
      { name: 'Beledhawo', position: [4.20, 42.70], connectedCountry: '埃塞俄比亚', type: 'land' },
    ],
  },
  eritrea: {
    center: [15.179, 39.782],
    zoom: 7,
    cities: [
      { name: '阿斯马拉', nameEn: 'Asmara', position: [15.3229, 38.9250], population: '80万', industries: ['building', 'manufacturing', 'agriculture'], description: '首都，海拔2400m，世遗城市', slug: 'asmara' },
      { name: '马萨瓦', nameEn: 'Massawa', position: [15.6086, 39.4744], population: '5万', industries: ['logistics', 'mining'], description: '红海主港，自由港', slug: 'massawa' },
      { name: '阿萨布', nameEn: 'Assab', position: [13.0097, 42.7247], population: '3万', industries: ['logistics', 'energy'], description: '南部红海港，炼油基地', slug: 'assab' },
      { name: '德克姆哈雷', nameEn: 'Dekemhare', position: [15.0703, 39.0456], population: '4万', industries: ['manufacturing', 'agriculture'], description: '工业卫星城，农业加工', slug: 'dekemhare' },
    ],
    projects: [
      { name: 'Bisha铜锌矿', position: [15.55, 37.05], info: '主力矿业项目，铜锌金伴生', industries: ['mining'], status: 'operating', slug: null },
      { name: '马萨瓦港升级', position: [15.61, 39.47], info: '港口设施现代化改造', industries: ['logistics'], status: 'planned', slug: null },
    ],
    corridors: [
      { name: '阿斯马拉-马萨瓦公路', positions: [[15.32, 38.93], [15.45, 39.10], [15.55, 39.30], [15.61, 39.47]], type: 'highway', color: '#22c55e' },
    ],
    industrialZones: [
      { name: '马萨瓦自由港区', positions: [[15.58, 39.42], [15.60, 39.45], [15.63, 39.48], [15.61, 39.47]], industries: ['logistics', 'manufacturing'], description: '红海自由港贸易区' },
    ],
    borderPorts: [
      { name: 'Zalambessa', position: [14.55, 39.50], connectedCountry: '埃塞俄比亚', type: 'land' },
      { name: 'Om Hajar', position: [16.05, 37.25], connectedCountry: '苏丹', type: 'land' },
    ],
  },
  'dr-congo': {
    center: [-2.500, 23.500],
    zoom: 5,
    cities: [
      { name: '金沙萨', nameEn: 'Kinshasa', position: [-4.4419, 15.2663], population: '1700万', industries: ['building', 'manufacturing', 'logistics'], description: '首都，刚果河畔，最大消费市场', slug: 'kinshasa' },
      { name: '卢本巴希', nameEn: 'Lubumbashi', position: [-11.6609, 27.4794], population: '200万', industries: ['mining', 'manufacturing'], description: '铜矿之都，南部经济中心', slug: 'lubumbashi' },
      { name: '科卢韦齐', nameEn: 'Kolwezi', position: [-10.7141, 25.4667], population: '60万', industries: ['mining'], description: '钴矿核心产区，全球钴储量70%', slug: 'kolwezi' },
      { name: '戈马', nameEn: 'Goma', position: [-1.6522, 29.2222], population: '100万', industries: ['agriculture', 'mining'], description: '东部冲突区，基伍湖畔', slug: 'goma' },
      { name: '马塔迪', nameEn: 'Matadi', position: [-5.8167, 13.4667], population: '30万', industries: ['logistics'], description: '刚果河出海口，唯一海运港', slug: 'matadi' },
      { name: '利卡西', nameEn: 'Likasi', position: [-11.0000, 26.7333], population: '40万', industries: ['mining', 'manufacturing'], description: '铜钴冶炼中心', slug: 'likasi' },
      { name: '基桑加尼', nameEn: 'Kisangani', position: [0.5153, 25.6000], population: '100万', industries: ['agriculture', 'logistics'], description: '内陆河港，刚果河中游', slug: 'kisangani' },
    ],
    projects: [
      { name: 'Inga水电(三期)', position: [-5.96, 14.26], info: '全球最大水电潜力，44000MW', industries: ['energy'], status: 'planned', slug: null },
      { name: 'TFM铜钴矿', position: [-10.60, 25.80], info: '中资洛阳钼业，全球最大钴矿之一', industries: ['mining'], status: 'operating', slug: null },
      { name: 'KFM铜钴矿', position: [-10.50, 25.65], info: '中资洛阳钼业，毗邻TFM', industries: ['mining'], status: 'operating', slug: null },
    ],
    corridors: [
      { name: '刚果河航道', positions: [[0.52, 25.60], [-1.0, 24.0], [-2.5, 22.0], [-3.5, 18.0], [-4.44, 15.27], [-5.82, 13.47]], type: 'waterway', color: '#3b82f6' },
      { name: '铜钴出口走廊', positions: [[-10.71, 25.47], [-11.00, 26.73], [-11.66, 27.48], [-12.50, 28.00], [-13.50, 28.50], [-15.40, 28.30]], type: 'railway', color: '#ef4444' },
    ],
    industrialZones: [
      { name: '加丹加铜钴带', positions: [[-10.71, 25.47], [-11.00, 26.73], [-11.66, 27.48], [-10.90, 26.10]], industries: ['mining'], description: '全球钴储量70%，铜矿核心区' },
    ],
    borderPorts: [
      { name: 'Kasumbalesa', position: [-12.18, 27.88], connectedCountry: '赞比亚', type: 'land' },
      { name: 'Beach Muanda', position: [-5.92, 12.42], connectedCountry: '刚果布', type: 'land' },
    ],
  },
};

type Country = 'ethiopia' | 'uganda' | 'kenya' | 'tanzania' | 'rwanda' | 'south-sudan' | 'burundi' | 'djibouti' | 'somalia' | 'eritrea' | 'dr-congo';

interface IndustryMapProps {
  country: Country;
  height?: string;
  showIndustrialZones?: boolean;
  showCorridors?: boolean;
  showBorderPorts?: boolean;
}

export default function IndustryMap({
  country,
  height = '600px',
  showIndustrialZones = true,
  showCorridors = true,
  showBorderPorts = true,
}: IndustryMapProps) {
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
          <p>产业地图加载中...</p>
        </div>
      </div>
    );
  }

  const data = countryData[country];
  if (!data) {
    return <div className="p-4 text-center" style={{ color: '#ff5252' }}>未找到 {country} 的数据</div>;
  }

  const { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, CircleMarker } = MapComponents;

  // Create icons for different purposes
  const createIcon = (color: string, size: number = 12, symbol: string = '') => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: symbol ? `<span style="font-size:${size}px;color:${color}">${symbol}</span>` :
        `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.8);box-shadow:0 2px 8px rgba(0,0,0,0.5)"></div>`,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
      popupAnchor: [0, -size/2],
    });
  };

  // Industry-specific city icons
  const getIndustryIcon = (industries: IndustryType[]) => {
    const primary = industries[0];
    const color = INDUSTRY_COLORS[primary] || '#888';
    const size = 14 + industries.length * 2;
    return createIcon(color, size);
  };

  // Special icons
  const capitalIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#ffd740" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" stroke="#fff" stroke-width="1"/></svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });

  const projectIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#f97316" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" stroke-width="2" fill="none"/></svg>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });

  const borderPortIcon = createIcon('#ff5252', 12, '🚧');
  const portIcon = createIcon('#ef4444', 14, '🚢');

  // Corridor line styles
  const corridorStyles: Record<string, any> = {
    railway: { dashArray: '10, 5', weight: 4 },
    highway: { dashArray: '0', weight: 3 },
    pipeline: { dashArray: '8, 4', weight: 4 },
    power: { dashArray: '4, 4', weight: 2 },
  };

  // Industrial zone style
  const zoneStyle = {
    color: '#888',
    weight: 1,
    opacity: 0.4,
    fillColor: '#888',
    fillOpacity: 0.15,
  };

  // Merge default Leaflet icons with dark theme fix
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });

  const getIndustryLabel = (type: IndustryType) => {
    const labels: Record<IndustryType, string> = {
      building: '🏗️ 建材/建筑',
      energy: '⚡ 能源/电力',
      manufacturing: '🏭 制造业',
      fintech: '💰 金融/Fintech',
      agriculture: '🌾 农业/加工',
      logistics: '🚚 物流/贸易',
      ict: '💻 ICT/数字',
      infrastructure: '🏛️ 基建项目',
      mining: '⛏️ 矿业',
    };
    return labels[type];
  };

  const getIndustryColor = (type: IndustryType) => INDUSTRY_COLORS[type];

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      operating: { text: '运营中', color: '#10b981' },
      construction: { text: '建设中', color: '#f59e0b' },
      planned: { text: '规划中', color: '#6b7280' },
    };
    return labels[status] || labels.planned;
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
      <div style={{ height }}>
        <MapContainer
          center={data.center}
          zoom={data.zoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          dragging={true}
          doubleClickZoom={true}
        >
          {/* Dark base map */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* Industrial Zones (Polygons) */}
          {showIndustrialZones && data.industrialZones.map((zone, idx) => (
            <Polygon
              key={`zone-${idx}`}
              positions={zone.positions}
              pathOptions={{
                ...zoneStyle,
                fillColor: getIndustryColor(zone.industries[0]),
              }}
            >
              <Popup>
                <div className="text-center" style={{ minWidth: '200px' }}>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1f2937' }}>
                    🏭 {zone.name}
                  </h3>
                  <p className="text-sm mb-2" style={{ color: '#4b5563' }}>
                    {zone.description}
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {zone.industries.map(ind => (
                      <span 
                        key={ind}
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ background: `${getIndustryColor(ind)}22`, color: getIndustryColor(ind) }}
                      >
                        {getIndustryLabel(ind)}
                      </span>
                    ))}
                  </div>
                </div>
              </Popup>
            </Polygon>
          ))}

          {/* Infrastructure Corridors */}
          {showCorridors && data.corridors.map((corridor, idx) => (
            <Polyline
              key={`corridor-${idx}`}
              positions={corridor.positions}
              pathOptions={{
                color: corridor.color,
                ...corridorStyles[corridor.type],
                opacity: 0.8,
              }}
            >
              <Popup>
                <div className="text-center" style={{ minWidth: '160px' }}>
                  <h3 className="font-bold" style={{ color: '#1f2937' }}>
                    {corridor.type === 'railway' && '🚂'}{corridor.type === 'highway' && '🛣️'}{corridor.type === 'pipeline' && '🔧'}{corridor.type === 'power' && '⚡'} {corridor.name}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#4b5563' }}>
                    类型: {corridor.type === 'railway' ? '铁路' : corridor.type === 'highway' ? '公路' : corridor.type === 'pipeline' ? '管道' : '电网'}
                  </p>
                </div>
              </Popup>
            </Polyline>
          ))}

          {/* Cities */}
          {data.cities.map((city, idx) => (
            <Marker key={city.slug} position={city.position} icon={idx === 0 ? capitalIcon : getIndustryIcon(city.industries)}>
              <Popup>
                <div className="text-center" style={{ minWidth: '220px' }}>
                  <h3 className="font-bold text-lg mb-1" style={{ color: '#1f2937' }}>
                    {idx === 0 ? '⭐' : '🏙️'} {city.name}
                  </h3>
                  <p className="text-xs mb-2" style={{ color: '#6b7280' }}>{city.nameEn}</p>
                  <p className="text-sm mb-2" style={{ color: '#374151' }}>{city.description}</p>
                  <div className="text-xs mb-2" style={{ color: '#6b7280' }}>
                    人口: <span className="font-semibold">{city.population}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center mb-2">
                    {city.industries.map(ind => (
                      <span 
                        key={ind}
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ background: `${getIndustryColor(ind)}22`, color: getIndustryColor(ind) }}
                      >
                        {getIndustryLabel(ind)}
                      </span>
                    ))}
                  </div>
                  {city.slug && (
                    <a 
                      href={`/invest/${country}/toolkit/cities/${city.slug}`}
                      className="inline-block mt-2 px-3 py-1 rounded-lg text-white text-sm transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #ff9100, #ff5252)' }}
                    >
                      查看详情 →
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Key Projects */}
          {data.projects.map((project, idx) => (
            <Marker key={`project-${idx}`} position={project.position} icon={projectIcon}>
              <Popup>
                <div className="text-center" style={{ minWidth: '220px' }}>
                  <h3 className="font-bold text-base mb-1" style={{ color: '#1f2937' }}>
                    🏗️ {project.name}
                  </h3>
                  <span 
                    className="px-2 py-0.5 rounded text-xs mb-2 inline-block"
                    style={{ background: `${getStatusLabel(project.status).color}22`, color: getStatusLabel(project.status).color }}
                  >
                    {getStatusLabel(project.status).text}
                  </span>
                  <p className="text-sm mb-2" style={{ color: '#4b5563' }}>{project.info}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {project.industries.map(ind => (
                      <span 
                        key={ind}
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ background: `${getIndustryColor(ind)}22`, color: getIndustryColor(ind) }}
                      >
                        {getIndustryLabel(ind)}
                      </span>
                    ))}
                  </div>
                  {project.slug && (
                    <a 
                      href={`/invest/${country}/toolkit/cities/${project.slug}`}
                      className="inline-block mt-2 px-3 py-1 rounded-lg text-white text-sm transition-all hover:opacity-90"
                      style={{ background: '#3b82f6' }}
                    >
                      城市详情 →
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Border Ports */}
          {showBorderPorts && data.borderPorts.map((port, idx) => (
            <Marker key={`port-${idx}`} position={port.position} icon={port.type === 'sea' ? portIcon : borderPortIcon}>
              <Popup>
                <div className="text-center" style={{ minWidth: '180px' }}>
                  <h3 className="font-bold text-base" style={{ color: '#1f2937' }}>
                    {port.type === 'sea' ? '🚢' : port.type === 'air' ? '✈️' : '🚧'} {port.name}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#4b5563' }}>
                    {port.type === 'sea' ? '海港' : port.type === 'air' ? '机场' : '边境口岸'}
                  </p>
                  <p className="text-sm" style={{ color: '#6b7280' }}>
                    连接: {port.connectedCountry}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Enhanced Legend */}
      <div className="p-4" style={{ background: '#0f172a', borderTop: '1px solid #1e293b' }}>
        <div className="text-xs font-semibold mb-3" style={{ color: '#94a3b8' }}>图例 LEGEND</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">
          {/* Industries */}
          <div>
            <div className="font-semibold mb-1" style={{ color: '#64748b', fontSize: '10px' }}>产业类型</div>
            <div className="space-y-1">
              <span className="flex items-center gap-2" style={{ color: '#cbd5e1' }}>
                <span className="w-3 h-3 rounded-full" style={{ background: INDUSTRY_COLORS.building }}></span>建材/建筑
              </span>
              <span className="flex items-center gap-2" style={{ color: '#cbd5e1' }}>
                <span className="w-3 h-3 rounded-full" style={{ background: INDUSTRY_COLORS.energy }}></span>能源/电力
              </span>
              <span className="flex items-center gap-2" style={{ color: '#cbd5e1' }}>
                <span className="w-3 h-3 rounded-full" style={{ background: INDUSTRY_COLORS.manufacturing }}></span>制造业
              </span>
              <span className="flex items-center gap-2" style={{ color: '#cbd5e1' }}>
                <span className="w-3 h-3 rounded-full" style={{ background: INDUSTRY_COLORS.fintech }}></span>金融/Fintech
              </span>
              <span className="flex items-center gap-2" style={{ color: '#cbd5e1' }}>
                <span className="w-3 h-3 rounded-full" style={{ background: INDUSTRY_COLORS.agriculture }}></span>农业/加工
              </span>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-1" style={{ color: '#64748b', fontSize: '10px' }}>&nbsp;</div>
            <div className="space-y-1">
              <span className="flex items-center gap-2" style={{ color: '#cbd5e1' }}>
                <span className="w-3 h-3 rounded-full" style={{ background: INDUSTRY_COLORS.logistics }}></span>物流/贸易
              </span>
              <span className="flex items-center gap-2" style={{ color: '#cbd5e1' }}>
                <span className="w-3 h-3 rounded-full" style={{ background: INDUSTRY_COLORS.ict }}></span>ICT/数字
              </span>
              <span className="flex items-center gap-2" style={{ color: '#cbd5e1' }}>
                <span className="w-3 h-3 rounded-full" style={{ background: INDUSTRY_COLORS.infrastructure }}></span>基建项目
              </span>
              <span className="flex items-center gap-2" style={{ color: '#cbd5e1' }}>
                <span className="w-3 h-3 rounded-full" style={{ background: INDUSTRY_COLORS.mining }}></span>矿业
              </span>
            </div>
          </div>
          {/* Markers */}
          <div>
            <div className="font-semibold mb-1" style={{ color: '#64748b', fontSize: '10px' }}>标记类型</div>
            <div className="space-y-1">
              <span className="flex items-center gap-2" style={{ color: '#cbd5e1' }}>
                <span style={{ color: '#ffd740', fontSize: '12px' }}>★</span>首都/首府
              </span>
              <span className="flex items-center gap-2" style={{ color: '#cbd5e1' }}>
                <span style={{ color: '#f97316', fontSize: '12px' }}>🏗</span>重点项目
              </span>
              <span className="flex items-center gap-2" style={{ color: '#cbd5e1' }}>
                <span style={{ color: '#ef4444', fontSize: '12px' }}>🚢</span>港口
              </span>
              <span className="flex items-center gap-2" style={{ color: '#cbd5e1' }}>
                <span style={{ color: '#ff5252', fontSize: '12px' }}>🚧</span>边境口岸
              </span>
            </div>
          </div>
          {/* Corridors */}
          <div>
            <div className="font-semibold mb-1" style={{ color: '#64748b', fontSize: '10px' }}>基建走廊</div>
            <div className="space-y-1">
              <span className="flex items-center gap-2" style={{ color: '#cbd5e1' }}>
                <span className="w-6 h-0.5" style={{ background: '#dc2626', borderBottom: '2px dashed #dc2626' }}></span>铁路
              </span>
              <span className="flex items-center gap-2" style={{ color: '#cbd5e1' }}>
                <span className="w-6 h-0.5 bg-yellow-400"></span>公路
              </span>
              <span className="flex items-center gap-2" style={{ color: '#cbd5e1' }}>
                <span className="w-6 h-0.5" style={{ background: '#ffd740', borderBottom: '2px dotted #ffd740' }}></span>管道
              </span>
              <span className="flex items-center gap-2" style={{ color: '#cbd5e1' }}>
                <span className="w-6 h-0.5" style={{ background: '#dc2626', borderBottom: '1px dotted #dc2626' }}></span>电网
              </span>
            </div>
          </div>
        </div>
        {/* Project Status */}
        <div className="mt-3 pt-3 border-t" style={{ borderColor: '#1e293b' }}>
          <div className="flex flex-wrap gap-4 text-xs" style={{ color: '#94a3b8' }}>
            <span>项目状态:</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: '#10b981' }}></span>运营中
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }}></span>建设中
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: '#6b7280' }}></span>规划中
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
