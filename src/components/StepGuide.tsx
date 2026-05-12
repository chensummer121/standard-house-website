import React, { useState } from 'react';

interface Step {
  step: number;
  title: string;
  description: string;
  duration: string;
  requiredDocuments: string[];
  tips: string[];
  pitfalls: string[];
}

interface StepGuideProps {
  steps: Step[];
  title?: string;
}

export default function StepGuide({ steps, title }: StepGuideProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (step: number) => {
    setExpandedStep(expandedStep === step ? null : step);
  };

  const toggleComplete = (step: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(step)) {
      newCompleted.delete(step);
    } else {
      newCompleted.add(step);
    }
    setCompletedSteps(newCompleted);
  };

  const progressPercentage = (completedSteps.size / steps.length) * 100;

  return (
    <div className="step-guide-container" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>{title || '实操步骤流程'}</h3>
        <div style={styles.progressContainer}>
          <div style={styles.progressLabel}>
            进度: {completedSteps.size}/{steps.length} 步
          </div>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${progressPercentage}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={styles.timeline}>
        {steps.map((item, index) => {
          const isExpanded = expandedStep === item.step;
          const isCompleted = completedSteps.has(item.step);
          const isLast = index === steps.length - 1;

          return (
            <div key={item.step} style={styles.stepWrapper}>
              {/* Connector Line */}
              {!isLast && (
                <div 
                  style={{
                    ...styles.connector,
                    backgroundColor: isCompleted ? '#3b82f6' : '#2a3a5c'
                  }}
                />
              )}

              {/* Step Card */}
              <div 
                style={{
                  ...styles.stepCard,
                  borderColor: isCompleted ? '#3b82f6' : isExpanded ? '#00e676' : '#2a3a5c',
                  backgroundColor: isExpanded ? 'rgba(59, 130, 246, 0.08)' : 'rgba(31, 64, 104, 0.5)'
                }}
                onClick={() => toggleStep(item.step)}
              >
                {/* Step Header */}
                <div style={styles.stepHeader}>
                  {/* Step Number Circle */}
                  <div 
                    style={{
                      ...styles.stepCircle,
                      backgroundColor: isCompleted ? '#3b82f6' : isExpanded ? '#00e676' : '#1f4068',
                      borderColor: isCompleted ? '#3b82f6' : isExpanded ? '#00e676' : '#448aff'
                    }}
                  >
                    {isCompleted ? (
                      <span style={styles.checkmark}>✓</span>
                    ) : (
                      <span style={styles.stepNumber}>{item.step}</span>
                    )}
                  </div>

                  {/* Title and Duration */}
                  <div style={styles.stepInfo}>
                    <h4 style={styles.stepTitle}>{item.title}</h4>
                    <span style={styles.duration}>{item.duration}</span>
                  </div>

                  {/* Expand/Collapse Icon */}
                  <span style={styles.expandIcon}>
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </div>

                {/* Quick Description */}
                <p style={styles.quickDesc}>{item.description}</p>

                {/* Expanded Content */}
                {isExpanded && (
                  <div style={styles.expandedContent}>
                    {/* Required Documents */}
                    <div style={styles.section}>
                      <h5 style={styles.sectionTitle}>
                        <span style={styles.docIcon}>📄</span>
                        所需文件
                      </h5>
                      <ul style={styles.list}>
                        {item.requiredDocuments.map((doc, i) => (
                          <li key={i} style={styles.listItem}>
                            <span style={styles.bullet}>•</span>
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tips */}
                    <div style={styles.section}>
                      <h5 style={{...styles.sectionTitle, color: '#00e676'}}>
                        <span style={styles.tipIcon}>💡</span>
                        实操建议
                      </h5>
                      <ul style={styles.list}>
                        {item.tips.map((tip, i) => (
                          <li key={i} style={{...styles.listItem, color: '#a0a0b0'}}>
                            <span style={{...styles.bullet, color: '#00e676'}}>•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pitfalls */}
                    <div style={styles.section}>
                      <h5 style={{...styles.sectionTitle, color: '#ff9100'}}>
                        <span style={styles.warningIcon}>⚠️</span>
                        常见踩坑点
                      </h5>
                      <ul style={styles.list}>
                        {item.pitfalls.map((pitfall, i) => (
                          <li key={i} style={{...styles.listItem, color: '#ff9100'}}>
                            <span style={{...styles.bullet, color: '#ff9100'}}>•</span>
                            {pitfall}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Complete Button */}
                    <button
                      style={{
                        ...styles.completeBtn,
                        backgroundColor: isCompleted ? '#3b82f6' : 'transparent',
                        borderColor: '#3b82f6'
                      }}
                      onClick={(e) => toggleComplete(item.step, e)}
                    >
                      {isCompleted ? '✓ 已完成' : '标记完成'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .step-guide-container {
            padding: 12px !important;
          }
        }
      `}</style>
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
    marginBottom: '24px'
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#e8e8e8',
    marginBottom: '16px'
  },
  progressContainer: {
    marginBottom: '8px'
  },
  progressLabel: {
    fontSize: '13px',
    color: '#a0a0b0',
    marginBottom: '8px'
  },
  progressBar: {
    height: '6px',
    backgroundColor: '#162447',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: '3px',
    transition: 'width 0.3s ease'
  },
  timeline: {
    position: 'relative'
  },
  stepWrapper: {
    position: 'relative',
    paddingLeft: '40px',
    marginBottom: '16px'
  },
  connector: {
    position: 'absolute',
    left: '19px',
    top: '40px',
    width: '2px',
    height: 'calc(100% - 24px)',
    transition: 'background-color 0.3s ease'
  },
  stepCard: {
    backgroundColor: 'rgba(31, 64, 104, 0.5)',
    borderRadius: '10px',
    padding: '16px',
    cursor: 'pointer',
    border: '1px solid',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
  },
  stepHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  stepCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.3s ease'
  },
  stepNumber: {
    color: '#e8e8e8',
    fontSize: '16px',
    fontWeight: 600
  },
  checkmark: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 700
  },
  stepInfo: {
    flex: 1,
    minWidth: 0
  },
  stepTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#e8e8e8',
    margin: 0,
    lineHeight: 1.3
  },
  duration: {
    fontSize: '12px',
    color: '#448aff',
    display: 'block',
    marginTop: '4px'
  },
  expandIcon: {
    color: '#a0a0b0',
    fontSize: '12px',
    transition: 'transform 0.3s ease'
  },
  quickDesc: {
    fontSize: '13px',
    color: '#a0a0b0',
    margin: '12px 0 0 0',
    lineHeight: 1.5
  },
  expandedContent: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #2a3a5c'
  },
  section: {
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#448aff',
    margin: '0 0 10px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  docIcon: {
    fontSize: '14px'
  },
  tipIcon: {
    fontSize: '14px'
  },
  warningIcon: {
    fontSize: '14px'
  },
  list: {
    margin: 0,
    paddingLeft: '20px',
    listStyle: 'none'
  },
  listItem: {
    fontSize: '13px',
    color: '#e8e8e8',
    marginBottom: '6px',
    lineHeight: 1.5,
    display: 'flex',
    alignItems: 'flex-start'
  },
  bullet: {
    marginRight: '8px',
    flexShrink: 0
  },
  completeBtn: {
    width: '100%',
    padding: '10px 16px',
    borderRadius: '6px',
    border: '1px solid',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '8px',
    color: '#fff'
  }
};
