import React, { useState, useMemo } from 'react';
import { Exercise, TrainingLogEntry, NSCACategory } from '../types/nsca';
import { NSCA_EXERCISES, NSCA_CATEGORIES } from '../data/exercises';
import { calculateBrzycki1RM, RPE_SCALE, getLoadTableFor1RM } from '../utils/nscaFormulas';
import { 
  Plus, 
  Trash2, 
  RotateCcw, 
  Download, 
  Flame, 
  Calculator, 
  Check, 
  Filter, 
  Dumbbell
} from 'lucide-react';

interface DataLoggerProps {
  logs: TrainingLogEntry[];
  onAddLog: (log: Omit<TrainingLogEntry, 'id' | 'timestamp'>) => void;
  onDeleteLog: (id: string) => void;
  onResetSamples: () => void;
  onClearLogs: () => void;
  selectedExercise?: Exercise | null;
}

export const DataLogger: React.FC<DataLoggerProps> = ({
  logs,
  onAddLog,
  onDeleteLog,
  onResetSamples,
  onClearLogs,
  selectedExercise,
}) => {
  // 表单状态
  const [exerciseId, setExerciseId] = useState<string>(
    selectedExercise?.id || NSCA_EXERCISES[3].id // 默认后深蹲
  );
  const [weightKg, setWeightKg] = useState<number>(100);
  const [reps, setReps] = useState<number>(6);
  const [rpe, setRpe] = useState<number>(8.5);
  const [dateStr, setDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  // 筛选状态
  const [filterExerciseId, setFilterExerciseId] = useState<string>('ALL');

  // 当前选中的动作元数据
  const currentExercise = useMemo(() => {
    return NSCA_EXERCISES.find((e) => e.id === exerciseId) || NSCA_EXERCISES[0];
  }, [exerciseId]);

  // 当外部传入 selectedExercise 改变时，自动同步
  React.useEffect(() => {
    if (selectedExercise) {
      setExerciseId(selectedExercise.id);
    }
  }, [selectedExercise]);

  /**
   * 【核心计算逻辑】实时基于 Brzycki 公式计算即时预估 1RM
   * 
   * 公式定义：
   * 1RM = Weight / (1.0278 - (0.0278 * Reps))
   * 
   * 当 Reps=1 时，1RM 直接为重量本身。
   * 当用户在输入框中变动重量或次数时，右侧/下方即时反馈推算结果与各强度负荷区间。
   */
  const liveEstimated1RM = useMemo(() => {
    return calculateBrzycki1RM(weightKg, reps);
  }, [weightKg, reps]);

  // 对应 1RM 的 NSCA 负荷百分比速算
  const loadBreakdown = useMemo(() => {
    return getLoadTableFor1RM(liveEstimated1RM).slice(0, 6);
  }, [liveEstimated1RM]);

  // 当前选择的 RPE 信息
  const currentRpeInfo = useMemo(() => {
    return RPE_SCALE.find((r) => r.score === rpe) || RPE_SCALE[4];
  }, [rpe]);

  // 提交添加一组数据
  const handleAddSet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightKg || weightKg <= 0 || !reps || reps <= 0) return;

    const estimated1RM = calculateBrzycki1RM(weightKg, reps);

    onAddLog({
      dateStr,
      exerciseId: currentExercise.id,
      exerciseName: currentExercise.name,
      category: currentExercise.category,
      weightKg,
      reps,
      rpe,
      estimated1RM,
      notes: notes.trim() || undefined,
    });

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2500);
  };

  // 过滤历史日志
  const filteredLogs = useMemo(() => {
    if (filterExerciseId === 'ALL') return logs;
    return logs.filter((l) => l.exerciseId === filterExerciseId);
  }, [logs, filterExerciseId]);

  // 导出 JSON 数据
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nsca_training_logs_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8">
      {/* 顶部输入表单与 Brzycki 1RM 实时预测器 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧：数据输入表单 (占 7 列) */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono-tech bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                DATA LOGGING INTERFACE
              </span>
              <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-[#00E5FF]" />
                智能化训练组记录面板
              </h2>
            </div>
            <div className="text-right text-xs text-zinc-400 font-mono-tech">
              AUTOREGULATION / RPE
            </div>
          </div>

          <form onSubmit={handleAddSet} className="mt-5 space-y-5">
            {/* 动作选择 */}
            <div>
              <label htmlFor="exercise-select" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                训练动作选择 (NSCA 标准动作库)
              </label>
              <select
                id="exercise-select"
                value={exerciseId}
                onChange={(e) => setExerciseId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white font-medium focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]"
              >
                {NSCA_CATEGORIES.map((cat) => (
                  <optgroup key={cat.key} label={`【${cat.name}】`}>
                    {NSCA_EXERCISES.filter((ex) => ex.category === cat.key).map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* 重量与次数行 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 训练重量 (kg) */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="weight-input" className="text-xs font-semibold text-zinc-300">
                    训练重量 (kg)
                  </label>
                  <span className="text-[11px] text-zinc-400 font-mono-tech">
                    当前: {weightKg} kg
                  </span>
                </div>
                <input
                  id="weight-input"
                  type="number"
                  min="1"
                  max="500"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-base font-mono-tech text-[#39FF14] font-bold focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]"
                  required
                />
                {/* 快速加减微调按钮 */}
                <div className="grid grid-cols-5 gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setWeightKg((prev) => Math.max(0, Math.round((prev - 2.5) * 10) / 10))}
                    className="py-1.5 text-xs bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white rounded-lg border border-zinc-700 font-mono-tech transition-colors active:scale-95 text-center"
                  >
                    -2.5
                  </button>
                  {[+1.25, +2.5, +5, +10].map((inc) => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => setWeightKg((prev) => Math.max(0, Math.round((prev + inc) * 10) / 10))}
                      className="py-1.5 text-xs bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white rounded-lg border border-zinc-700 font-mono-tech transition-colors active:scale-95 text-center"
                    >
                      +{inc}
                    </button>
                  ))}
                </div>
              </div>

              {/* 完成次数 (Reps) */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="reps-input" className="text-xs font-semibold text-zinc-300">
                    完成次数 (Reps)
                  </label>
                  <span className="text-[11px] text-zinc-400 font-mono-tech">
                    当前: {reps} 次
                  </span>
                </div>
                <input
                  id="reps-input"
                  type="number"
                  min="1"
                  max="30"
                  value={reps}
                  onChange={(e) => setReps(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-base font-mono-tech text-[#00E5FF] font-bold focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]"
                  required
                />
                {/* 常用次数预设 */}
                <div className="grid grid-cols-6 gap-1.5 mt-2">
                  {[1, 3, 5, 8, 10, 12].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReps(r)}
                      className={`py-1.5 text-xs rounded-lg border font-mono-tech transition-colors active:scale-95 ${
                        reps === r
                          ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] font-bold shadow-sm'
                          : 'bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RPE 自感用力度选择器 (Rate of Perceived Exertion) */}
            <div className="bg-zinc-950 p-3 sm:p-4 rounded-xl border border-zinc-800 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">RPE 自感用力度 (1-10分)</span>
                </label>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <span className="text-xs font-bold font-mono-tech px-2 py-0.5 rounded bg-zinc-800 text-white">
                    @{rpe}
                  </span>
                  <span 
                    className="text-xs font-mono-tech px-2 py-0.5 rounded font-semibold"
                    style={{ backgroundColor: `${currentRpeInfo.color}20`, color: currentRpeInfo.color }}
                  >
                    {currentRpeInfo.rir}
                  </span>
                </div>
              </div>

              {/* RPE 快速刻度尺 (手机端 5 列网格，平板/桌面端 9 列网格) */}
              <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5 pt-1">
                {RPE_SCALE.map((r) => (
                  <button
                    key={r.score}
                    type="button"
                    onClick={() => setRpe(r.score)}
                    className={`py-2 px-1 min-h-[44px] rounded-lg text-center font-mono-tech border transition-all active:scale-95 flex flex-col items-center justify-center ${
                      rpe === r.score
                        ? 'font-bold scale-105 shadow-md ring-1 ring-white/20'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                    style={{
                      borderColor: rpe === r.score ? r.color : undefined,
                      backgroundColor: rpe === r.score ? `${r.color}25` : undefined,
                      color: rpe === r.score ? r.color : undefined,
                    }}
                  >
                    <div className="font-bold text-xs">{r.score}</div>
                    <div className="text-[9px] opacity-80 whitespace-nowrap">{r.rir}</div>
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                <span className="text-zinc-300 font-medium">CSCS 释义：</span>
                {currentRpeInfo.name} — {currentRpeInfo.description}
              </p>
            </div>

            {/* 即时 1RM 极速反馈指示卡 (在移动端非常实用，无需滑动即可见计算结果) */}
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#39FF14]/10 border border-[#39FF14]/30 flex items-center justify-center shrink-0">
                  <Calculator className="w-4 h-4 text-[#39FF14]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-200">
                    本组推算极限 1RM: <span className="text-[#39FF14] font-mono-tech font-bold text-sm">{liveEstimated1RM} kg</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono-tech">
                    Matt Brzycki 公式 · 负荷强度约 {Math.min(100, Math.round((weightKg / (liveEstimated1RM || 1)) * 100))}% 1RM
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono-tech text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-1 rounded shrink-0">
                1RM 速览
              </span>
            </div>

            {/* 日期与备注行 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="log-date" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  训练日期
                </label>
                <input
                  id="log-date"
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-300 font-mono-tech focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label htmlFor="log-notes" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  动作感受 / 技术自评 (可选)
                </label>
                <input
                  id="log-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="如：深蹲触底深度满意，无膝内扣"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            {/* 提交按钮 */}
            <button
              id="btn-add-set"
              type="submit"
              className="w-full min-h-[50px] py-3 px-4 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#00E5FF] text-black font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg hover:shadow-cyan-500/20 active:scale-[0.99]"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>添加本组数据 (推算 1RM 并记录)</span>
            </button>

            {showSuccessToast && (
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-[#39FF14]" />
                <span>已基于 Brzycki 科学公式计算本组 1RM ({liveEstimated1RM} kg) 并成功存入本地数据库！</span>
              </div>
            )}
          </form>
        </div>

        {/* 右侧：Brzycki 公式实时计算透视卡片 (占 5 列) */}
        <div className="lg:col-span-5 space-y-4">
          {/* 实时 1RM 巨幕仪表盘 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#39FF14]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tech text-zinc-400 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#39FF14]" />
                BRZYCKI 1RM ENGINE
              </span>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                REAL-TIME EVAL
              </span>
            </div>

            {/* 核心预估 1RM 数字展示 */}
            <div className="mt-4 text-center py-4 bg-zinc-950 rounded-xl border border-zinc-800/80">
              <div className="text-xs text-zinc-400 font-medium">
                本组完成 {weightKg} kg × {reps} 次的预估极限
              </div>
              <div className="text-5xl font-extrabold font-mono-tech text-white tracking-tight mt-1">
                <span className="text-[#39FF14]">{liveEstimated1RM}</span>
                <span className="text-xl text-zinc-400 ml-1.5 font-normal">kg</span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-1 font-mono-tech">
                ESTIMATED ONE-REP MAXIMUM (1RM)
              </div>
            </div>

            {/* Brzycki 公式详细解释与数学渲染 */}
            <div className="mt-4 p-3.5 bg-zinc-950/70 rounded-lg border border-zinc-800 text-xs text-zinc-300 space-y-2">
              <div className="flex items-center justify-between font-mono-tech text-zinc-400 text-[11px]">
                <span className="text-[#00E5FF]">【NSCA 官方推算公式】</span>
                <span>Matt Brzycki (1993)</span>
              </div>
              
              {/* LaTeX 数学形式展示 */}
              <div className="py-2 px-3 bg-zinc-900 rounded font-mono-tech text-center text-xs text-zinc-200 border border-zinc-800">
                1RM = 重量 ÷ (1.0278 - (0.0278 × 次数))
              </div>

              <div className="text-[11px] text-zinc-400 leading-relaxed">
                <span className="text-zinc-300 font-semibold">代入运算：</span> 
                {weightKg} ÷ (1.0278 - (0.0278 × {reps})) = <span className="text-[#39FF14] font-mono-tech font-bold">{liveEstimated1RM} kg</span>
              </div>

              <p className="text-[10px] text-zinc-400 leading-normal">
                NSCA 验证：在 1-10 次区间内，该公式推算准确率超过 95%，能有效规避极限大重量测试中可能的韧带损伤与过度中枢疲劳。
              </p>
            </div>

            {/* 对应此 1RM 的 NSCA 训练百分比负荷速算 */}
            <div className="mt-4">
              <div className="text-xs font-semibold text-zinc-300 mb-2 flex justify-between">
                <span>基于此 1RM 的 NSCA 负荷区间表</span>
                <span className="text-zinc-500 text-[10px] font-mono-tech">%1RM TARGETS</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {loadBreakdown.map((item) => (
                  <div key={item.percent} className="bg-zinc-950 p-2 rounded border border-zinc-850 text-center">
                    <div className="text-[10px] text-zinc-400 font-mono-tech">{item.percent}% ({item.reps}次)</div>
                    <div className="text-sm font-bold text-white font-mono-tech mt-0.5">
                      {item.recommendedWeight} <span className="text-[10px] text-zinc-500 font-normal">kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 历史训练记录 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
        {/* 表头控制区：标题、动作筛选与数据操作 */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 sm:gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>历史训练组记录</span>
              <span className="text-xs font-mono-tech font-normal text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                共 {filteredLogs.length} 组
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
              数据实时保存在浏览器本地，训练中断不丢失
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 动作筛选下拉 */}
            <div className="flex-1 sm:flex-initial flex items-center gap-1.5 bg-zinc-950 border border-zinc-750 px-2.5 py-1.5 rounded-lg text-xs">
              <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <select
                id="filter-logs-select"
                value={filterExerciseId}
                onChange={(e) => setFilterExerciseId(e.target.value)}
                className="bg-transparent text-zinc-200 focus:outline-none text-xs w-full sm:w-auto"
              >
                <option value="ALL" className="bg-zinc-900">全部动作</option>
                {NSCA_EXERCISES.map((ex) => (
                  <option key={ex.id} value={ex.id} className="bg-zinc-900">
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 导出 JSON */}
            <button
              onClick={handleExportJSON}
              title="导出记录为 JSON"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white rounded-lg text-xs font-medium border border-zinc-700 transition-colors active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出</span>
            </button>

            {/* 重置样例数据 */}
            <button
              onClick={onResetSamples}
              title="重设为 NSCA 示范科学数据"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-[#39FF14] rounded-lg text-xs font-medium border border-zinc-700 transition-colors active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">重置样例</span>
              <span className="sm:hidden">重置</span>
            </button>

            {/* 清空所有 */}
            <button
              onClick={onClearLogs}
              title="清空记录"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-800 hover:bg-rose-950/60 text-rose-400 rounded-lg text-xs font-medium border border-zinc-700 transition-colors active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>清空</span>
            </button>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-sm">
            当前暂无该动作记录，请在上方表单添加训练组数据。
          </div>
        ) : (
          <>
            {/* 1. 移动端专用卡片流视图 (Mobile Gym Set Cards: 彻底杜绝手机横向长滚动) */}
            <div className="mt-4 space-y-3 md:hidden">
              {filteredLogs.map((log) => {
                const catMeta = NSCA_CATEGORIES.find((c) => c.key === log.category);
                const rpeData = RPE_SCALE.find((r) => r.score === log.rpe);

                return (
                  <div 
                    key={log.id} 
                    className="p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-2.5 hover:border-zinc-700 transition-colors"
                  >
                    {/* 卡片顶栏: 动作名称 + 分类 + 日期 + 删除按钮 */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono-tech border"
                            style={{
                              color: catMeta?.accentColor,
                              backgroundColor: `${catMeta?.accentColor}15`,
                              borderColor: `${catMeta?.accentColor}30`,
                            }}
                          >
                            {catMeta?.name || log.category}
                          </span>
                          <span className="text-[10px] font-mono-tech text-zinc-500">
                            {log.dateStr}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-sm mt-1">
                          {log.exerciseName}
                        </h4>
                      </div>

                      <button
                        onClick={() => onDeleteLog(log.id)}
                        aria-label="删除本组"
                        className="p-1.5 text-zinc-500 hover:text-rose-400 active:scale-90 transition-colors rounded-lg bg-zinc-900 border border-zinc-800 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* 卡片中栏: 重量、次数、RPE、1RM 指标网格 */}
                    <div className="grid grid-cols-3 gap-2 bg-zinc-900/90 p-2.5 rounded-lg border border-zinc-850">
                      <div>
                        <div className="text-[10px] text-zinc-400 font-mono-tech">实做负荷</div>
                        <div className="font-mono-tech font-bold text-white text-sm mt-0.5">
                          {log.weightKg} <span className="text-[10px] font-normal text-zinc-400">kg</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-zinc-400 font-mono-tech">次数与感知</div>
                        <div className="font-mono-tech font-bold text-[#00E5FF] text-sm mt-0.5 flex items-center gap-1">
                          <span>{log.reps} 次</span>
                          <span 
                            className="text-[9px] px-1 py-0.2 rounded font-semibold"
                            style={{
                              backgroundColor: rpeData ? `${rpeData.color}20` : '#27272a',
                              color: rpeData?.color || '#a1a1aa'
                            }}
                          >
                            @{log.rpe}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-[#39FF14] font-mono-tech font-semibold">预估 1RM</div>
                        <div className="font-mono-tech font-extrabold text-base text-[#39FF14] mt-0.5">
                          {log.estimated1RM} <span className="text-[10px] font-normal text-zinc-400">kg</span>
                        </div>
                      </div>
                    </div>

                    {/* 卡片底栏: 训练技术笔记 */}
                    {log.notes && (
                      <div className="text-[11px] text-zinc-400 bg-zinc-900/50 px-2.5 py-1.5 rounded border border-zinc-850/60 leading-tight">
                        <span className="text-zinc-500 font-medium">笔记：</span>
                        {log.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 2. 平板与桌面端表格视图 (Desktop & Tablet Table) */}
            <div className="mt-4 overflow-x-auto hidden md:block">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-mono-tech text-[11px]">
                    <th className="py-3 px-3">日期</th>
                    <th className="py-3 px-3">动作名称</th>
                    <th className="py-3 px-3">NSCA 分类</th>
                    <th className="py-3 px-3 text-right">重量 (kg)</th>
                    <th className="py-3 px-3 text-right">完成次数</th>
                    <th className="py-3 px-3 text-center">RPE / RIR</th>
                    <th className="py-3 px-3 text-right font-bold text-[#39FF14]">
                      预估 1RM (Brzycki)
                    </th>
                    <th className="py-3 px-3">训练笔记</th>
                    <th className="py-3 px-3 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {filteredLogs.map((log) => {
                    const catMeta = NSCA_CATEGORIES.find((c) => c.key === log.category);
                    const rpeData = RPE_SCALE.find((r) => r.score === log.rpe);

                    return (
                      <tr key={log.id} className="hover:bg-zinc-850/50 transition-colors">
                        <td className="py-3 px-3 font-mono-tech text-zinc-300 whitespace-nowrap">
                          {log.dateStr}
                        </td>
                        <td className="py-3 px-3 font-medium text-white whitespace-nowrap">
                          {log.exerciseName}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span 
                            className="px-2 py-0.5 rounded text-[10px] font-mono-tech border"
                            style={{
                              color: catMeta?.accentColor,
                              backgroundColor: `${catMeta?.accentColor}15`,
                              borderColor: `${catMeta?.accentColor}30`,
                            }}
                          >
                            {catMeta?.name || log.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono-tech font-bold text-zinc-100">
                          {log.weightKg} kg
                        </td>
                        <td className="py-3 px-3 text-right font-mono-tech font-bold text-[#00E5FF]">
                          {log.reps} 次
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span 
                            className="px-2 py-0.5 rounded font-mono-tech text-[11px] font-semibold"
                            style={{
                              backgroundColor: rpeData ? `${rpeData.color}20` : '#27272a',
                              color: rpeData?.color || '#a1a1aa'
                            }}
                          >
                            @{log.rpe} ({rpeData?.rir || 'RPE'})
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono-tech font-bold text-base text-[#39FF14] whitespace-nowrap">
                          {log.estimated1RM} <span className="text-xs font-normal text-zinc-400">kg</span>
                        </td>
                        <td className="py-3 px-3 text-zinc-400 max-w-xs truncate text-[11px]">
                          {log.notes || '—'}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => onDeleteLog(log.id)}
                            title="删除该组"
                            className="p-1 text-zinc-500 hover:text-rose-400 transition-colors rounded hover:bg-zinc-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
