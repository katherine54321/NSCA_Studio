import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { DataLogger } from './components/DataLogger';
import { ProgressiveOverloadChart } from './components/ProgressiveOverloadChart';
import { PeriodizationGenerator } from './components/PeriodizationGenerator';
import { NscaToolbox } from './components/NscaToolbox';
import { Exercise, TrainingLogEntry } from './types/nsca';
import { getInitialSampleLogs, NSCA_EXERCISES } from './data/exercises';
import { Activity, Dumbbell, LineChart, Calendar, Award, ShieldAlert } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'nsca_cscs_training_logs_v1';

export default function App() {
  // 核心标签页状态
  const [activeTab, setActiveTab] = useState<'library' | 'logger' | 'chart' | 'periodization' | 'toolbox'>('library');

  // 跨组件联动的预选动作
  const [selectedExerciseForLogging, setSelectedExerciseForLogging] = useState<Exercise | null>(null);

  // 训练日志状态（初始化从 LocalStorage 加载，无则置入真实渐进超负荷示范数据）
  const [logs, setLogs] = useState<TrainingLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse local training logs, falling back to samples', e);
    }
    return getInitialSampleLogs();
  });

  // 日志变更时自动持久化至 LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }
  }, [logs]);

  // 添加一组新数据
  const handleAddLog = (newLogData: Omit<TrainingLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: TrainingLogEntry = {
      ...newLogData,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };
    setLogs((prev) => [newEntry, ...prev]);
  };

  // 删除单组数据
  const handleDeleteLog = (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  // 重设为 NSCA 示范数据
  const handleResetSamples = () => {
    const samples = getInitialSampleLogs();
    setLogs(samples);
  };

  // 清空所有记录
  const handleClearLogs = () => {
    if (window.confirm('确认清空所有训练组记录吗？该操作不可恢复。')) {
      setLogs([]);
    }
  };

  // 从动作库联动选择动作并跳转到记录面板
  const handleSelectFromLibrary = (exercise: Exercise) => {
    setSelectedExerciseForLogging(exercise);
    setActiveTab('logger');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 从周期化课表中快速选择动作联动
  const handleQuickLogFromPlan = (exerciseName: string) => {
    const found = NSCA_EXERCISES.find(e => 
      e.name.toLowerCase().includes(exerciseName.toLowerCase()) ||
      exerciseName.toLowerCase().includes(e.name.toLowerCase())
    );
    if (found) {
      setSelectedExerciseForLogging(found);
    }
    setActiveTab('logger');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#121212] text-zinc-100 flex flex-col selection:bg-[#39FF14] selection:text-black">
      {/* 顶部高科技导航 */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        logsCount={logs.length} 
      />

      {/* 快速状态条 / 指令条 */}
      <div className="bg-zinc-950/90 border-b border-zinc-850 px-3 sm:px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-zinc-400">
          <div className="flex items-center gap-1.5 sm:gap-2 font-mono-tech text-[10px] sm:text-[11px] truncate">
            <span className="text-[#39FF14] font-semibold">● NSCA-CSCS CERTIFIED</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-300 truncate">BRZYCKI 1RM = Weight / (1.0278 - 0.0278 × Reps)</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-mono-tech">
            <span className="text-zinc-400">
              标准动作: <strong className="text-white">{NSCA_EXERCISES.length}</strong> 项
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-[#00E5FF]">
              已记录: <strong className="text-white">{logs.length}</strong> 组
            </span>
          </div>
        </div>
      </div>

      {/* 主工作区 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 pb-20 md:pb-6">
        {/* 1. NSCA 标准动作指导库 */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            <ExerciseLibrary onSelectForLogging={handleSelectFromLibrary} />
          </div>
        )}

        {/* 2. 智能化数据记录面板：手机端仅展示纯训练记录，不展示渐进负荷趋势图；平板与桌面端保留集成折线图 */}
        {activeTab === 'logger' && (
          <div className="space-y-6 sm:space-y-8">
            <DataLogger
              logs={logs}
              onAddLog={handleAddLog}
              onDeleteLog={handleDeleteLog}
              onResetSamples={handleResetSamples}
              onClearLogs={handleClearLogs}
              selectedExercise={selectedExerciseForLogging}
            />

            {/* 用户明确指示：手机端按底部Tab区分，‘记训练’仅展示训练记录，不展示渐进负荷趋势图（趋势图由底部独立的‘趋势图’Tab专职呈现）；平板与桌面端保持集成呈现 */}
            <div className="hidden md:block pt-6 border-t border-zinc-800">
              <div className="mb-4">
                <span className="text-[11px] font-mono-tech text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/30 px-2 py-0.5 rounded">
                  INTEGRATED CHART.JS OVERVIEW
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  历史 1RM 渐进负荷 (Progressive Overload) 趋势图表
                </h3>
              </div>
              <ProgressiveOverloadChart logs={logs} />
            </div>
          </div>
        )}

        {/* 3. 独立的高清渐进负荷图表分析 (手机端‘趋势图’Tab直接直达) */}
        {activeTab === 'chart' && (
          <div className="space-y-6">
            <ProgressiveOverloadChart logs={logs} />
          </div>
        )}

        {/* 4. NSCA 周期化训练计划生成器 */}
        {activeTab === 'periodization' && (
          <div className="space-y-6">
            <PeriodizationGenerator onQuickLogExercise={handleQuickLogFromPlan} />
          </div>
        )}

        {/* 5. CSCS 科学工具箱 */}
        {activeTab === 'toolbox' && (
          <div className="space-y-6">
            <NscaToolbox />
          </div>
        )}
      </main>

      {/* 页脚：调整与功能模块的间距，紧凑合理，手机端预留底部tab栏高度 */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-5 sm:py-6 px-4 sm:px-6 lg:px-8 mt-4 sm:mt-8 mb-16 md:mb-0 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 text-center sm:text-left">
            <div className="w-6 h-6 rounded bg-zinc-900 border border-[#39FF14]/40 flex items-center justify-center font-mono-tech text-[10px] text-[#39FF14] font-bold shrink-0">
              CSCS
            </div>
            <div>
              <p className="text-zinc-300 font-medium text-xs">
                NSCA-CSCS 科学体能训练与数据记录系统
              </p>
              <p className="text-[10px] sm:text-[11px] text-zinc-500 font-mono-tech">
                National Strength & Conditioning Association Standard Guidelines
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-mono-tech text-[10px] sm:text-[11px] text-zinc-400">
            <span>BRZYCKI 1RM</span>
            <span className="hidden sm:inline">•</span>
            <span>RPE / RIR AUTOREGULATION</span>
            <span className="hidden sm:inline">•</span>
            <span>2-FOR-2 PROGRESSION</span>
            <span className="hidden sm:inline">•</span>
            <span>4-WEEK PERIODIZATION</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-zinc-900 text-[10px] sm:text-[11px] text-zinc-600 flex items-start gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
          <span>
            专业安全提示：本系统所有算法（含 Brzycki 预测 1RM、%1RM 负荷区间及 4 周周期化进程）均基于运动生理学理论模型。大重量训练必须在有合格保护员（Spotter）或安全防护杠（Safety Pins）保护下进行，并严格维持脊柱与关节生理中立位。
          </span>
        </div>
      </footer>
    </div>
  );
}
