import React, { useState, useMemo } from 'react';

interface ChecklistItem {
  id: string;
  text: string;
  category: string;
}

interface ChecklistProps {
  items: {
    required: ChecklistItem[];
    optional: ChecklistItem[];
  };
  title?: string;
}

export default function Checklist({ items, title }: ChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'required' | 'optional'>('required');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const allItems = items.required.concat(items.optional);
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allItems.forEach(item => cats.add(item.category));
    return Array.from(cats);
  }, [allItems]);

  const filteredRequired = items.required.filter(
    item => filterCategory === 'all' || item.category === filterCategory
  );
  const filteredOptional = items.optional.filter(
    item => filterCategory === 'all' || item.category === filterCategory
  );

  const requiredProgress = (checkedItems.size / items.required.length) * 100;
  const optionalProgress = items.optional.length > 0 
    ? ((checkedItems.size - items.required.filter(i => checkedItems.has(i.id)).length + items.optional.filter(i => checkedItems.has(i.id)).length) / items.optional.length) * 100
    : 0;

  const totalProgress = (checkedItems.size / allItems.length) * 100;

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      '投资许可': '#448aff',
      '银行开户': '#00e676',
      '资本登记': '#ff9100',
      '营业执照': '#448aff',
      '税务登记': '#00e676',
      '人事合规': '#ff5252',
      '土地获取': '#ff9100',
      '税务合规': '#00e676',
      '财务审计': '#448aff',
      '利润汇出': '#ff9100',
      '投资合规': '#448aff',
      '银行申请': '#00e676',
      '汇出执行': '#ff9100',
      '风险管理': '#ff5252',
      '月度合规': '#00e676',
      '季度合规': '#ff9100',
      '年度合规': '#448aff',
      '档案管理': '#a0a0b0',
      '合规管理': '#448aff',
      '税收优惠': '#00e676',
      '制度建立': '#448aff',
      '薪酬合规': '#ff9100',
      '员工关系': '#ff5252',
      '安全合规': '#ff9100',
      '社保合规': '#00e676',
      '外籍合规': '#ff5252',
      '员工发展': '#448aff',
      '前期准备': '#448aff',
      '申请程序': '#00e676',
      '尽职调查': '#ff9100',
      '社会合规': '#ff5252',
      '合同签订': '#448aff',
      '登记程序': '#00e676',
      '未来规划': '#a0a0b0',
      '事前预防': '#448aff',
      '争议管理': '#ff9100',
      '仲裁准备': '#00e676',
      '执行准备': '#ff5252',
      '紧急程序': '#ff9100',
      '执行程序': '#ff5252',
      '国际保护': '#448aff',
      '行业许可': '#a0a0b0',
      '其他许可': '#a0a0b0',
      '监管合规': '#448aff'
    };
    return colors[category] || '#448aff';
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>{title || '合规检查清单'}</h3>
        <div style={styles.overallProgress}>
          <span style={styles.progressLabel}>总体进度</span>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${totalProgress}%`
              }}
            />
          </div>
          <span style={styles.progressPercent}>{Math.round(totalProgress)}%</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'required' ? styles.tabActive : {})
          }}
          onClick={() => setActiveTab('required')}
        >
          必选项目 ({checkedItems.size > items.required.length ? items.required.length : checkedItems.size}/{items.required.length})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'optional' ? styles.tabActive : {})
          }}
          onClick={() => setActiveTab('optional')}
        >
          可选项目 ({checkedItems.size - items.required.filter(i => checkedItems.has(i.id)).length}/{items.optional.length})
        </button>
      </div>

      {/* Category Filter */}
      <div style={styles.filterRow}>
        <span style={styles.filterLabel}>分类筛选:</span>
        <select
          style={styles.select}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">全部分类</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Checklist Items */}
      <div style={styles.listContainer}>
        {activeTab === 'required' ? (
          <>
            <div style={styles.progressSection}>
              <div style={styles.progressHeader}>
                <span style={{ color: '#e8e8e8', fontSize: '13px' }}>
                  必选项目完成度
                </span>
                <span style={{ color: '#00e676', fontSize: '13px', fontWeight: 500 }}>
                  {Math.round(requiredProgress)}%
                </span>
              </div>
              <div style={styles.progressBarSmall}>
                <div 
                  style={{
                    ...styles.progressFillSmall,
                    width: `${requiredProgress}%`,
                    backgroundColor: '#00e676'
                  }}
                />
              </div>
            </div>
            {filteredRequired.map(item => (
              <ChecklistItemRow
                key={item.id}
                item={item}
                checked={checkedItems.has(item.id)}
                onToggle={() => toggleItem(item.id)}
                color={getCategoryColor(item.category)}
              />
            ))}
          </>
        ) : (
          <>
            {items.optional.length > 0 && (
              <div style={styles.progressSection}>
                <div style={styles.progressHeader}>
                  <span style={{ color: '#e8e8e8', fontSize: '13px' }}>
                    可选项目完成度
                  </span>
                  <span style={{ color: '#448aff', fontSize: '13px', fontWeight: 500 }}>
                    {items.optional.length > 0 ? Math.round((checkedItems.size - items.required.filter(i => checkedItems.has(i.id)).length) / items.optional.length * 100) : 0}%
                  </span>
                </div>
                <div style={styles.progressBarSmall}>
                  <div 
                    style={{
                      ...styles.progressFillSmall,
                      width: `${items.optional.length > 0 ? (checkedItems.size - items.required.filter(i => checkedItems.has(i.id)).length) / items.optional.length * 100 : 0}%`,
                      backgroundColor: '#448aff'
                    }}
                  />
                </div>
              </div>
            )}
            {filteredOptional.map(item => (
              <ChecklistItemRow
                key={item.id}
                item={item}
                checked={checkedItems.has(item.id)}
                onToggle={() => toggleItem(item.id)}
                color={getCategoryColor(item.category)}
              />
            ))}
          </>
        )}

        {filteredRequired.length === 0 && activeTab === 'required' && (
          <div style={styles.emptyState}>该分类下暂无必选项目</div>
        )}
        {filteredOptional.length === 0 && activeTab === 'optional' && (
          <div style={styles.emptyState}>该分类下无可选项目</div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .checklist-container {
            padding: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}

interface ChecklistItemRowProps {
  item: ChecklistItem;
  checked: boolean;
  onToggle: () => void;
  color: string;
}

function ChecklistItemRow({ item, checked, onToggle, color }: ChecklistItemRowProps) {
  return (
    <div 
      style={{
        ...styles.itemRow,
        backgroundColor: checked ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
      }}
      onClick={onToggle}
    >
      <div style={{
        ...styles.checkbox,
        borderColor: checked ? '#3b82f6' : '#2a3a5c',
        backgroundColor: checked ? '#3b82f6' : 'transparent'
      }}>
        {checked && <span style={styles.checkmark}>✓</span>}
      </div>
      <div style={styles.itemContent}>
        <span style={{
          ...styles.itemText,
          color: checked ? '#e8e8e8' : '#a0a0b0',
          textDecoration: checked ? 'none' : 'none',
          opacity: checked ? 1 : 0.9
        }}>
          {item.text}
        </span>
        <span style={{
          ...styles.categoryBadge,
          backgroundColor: `${color}20`,
          color: color,
          borderColor: `${color}40`
        }}>
          {item.category}
        </span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: 'rgba(27, 27, 47, 0.8)',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '24px',
    border: '1px solid #2a3a5c'
  },
  header: {
    marginBottom: '20px'
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#e8e8e8',
    marginBottom: '16px'
  },
  overallProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  progressLabel: {
    fontSize: '13px',
    color: '#a0a0b0',
    whiteSpace: 'nowrap'
  },
  progressBar: {
    flex: 1,
    height: '8px',
    backgroundColor: '#162447',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  },
  progressPercent: {
    fontSize: '13px',
    color: '#3b82f6',
    fontWeight: 600,
    minWidth: '40px',
    textAlign: 'right'
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px'
  },
  tab: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '6px',
    border: '1px solid #2a3a5c',
    backgroundColor: 'transparent',
    color: '#a0a0b0',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  tabActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: '#3b82f6',
    color: '#3b82f6'
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  filterLabel: {
    fontSize: '13px',
    color: '#a0a0b0'
  },
  select: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #2a3a5c',
    backgroundColor: '#162447',
    color: '#e8e8e8',
    fontSize: '13px',
    cursor: 'pointer'
  },
  listContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '8px'
  },
  progressSection: {
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: 'rgba(22, 36, 71, 0.5)',
    borderRadius: '8px'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  progressBarSmall: {
    height: '4px',
    backgroundColor: '#1b1b2f',
    borderRadius: '2px',
    overflow: 'hidden'
  },
  progressFillSmall: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s ease'
  },
  itemRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    marginBottom: '8px',
    border: '1px solid transparent'
  },
  checkbox: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
    transition: 'all 0.2s ease'
  },
  checkmark: {
    color: '#fff',
    fontSize: '12px',
    fontWeight: 700
  },
  itemContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  itemText: {
    fontSize: '14px',
    lineHeight: 1.5,
    transition: 'all 0.2s ease'
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 500,
    border: '1px solid',
    width: 'fit-content'
  },
  emptyState: {
    textAlign: 'center',
    padding: '32px 16px',
    color: '#a0a0b0',
    fontSize: '14px'
  }
};
