import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Chart } from 'chart.js/auto';
import { TrainingLogEntry } from '../types/nsca';
import { NSCA_EXERCISES } from '../data/exercises';
import { 
  TrendingUp, 
  Award, 
  Calendar, 
  Activity, 
  Zap, 
  BarChart2, 
  Info,
  CheckCircle
} from 'lucide-react';

interface ProgressiveOverloadChartProps {
  logs: TrainingLogEntry[];
}

export const ProgressiveOverloadChart: React.FC<ProgressiveOverloadChartProps> = ({ logs }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // 获取有记录的动作列表
  const exercisesWithLogs = useMemo(() => {
    const ids = Array.from(new Set(logs.map((l) => l.exerciseId)));
    return NSCA_EXERCISES.filter((ex) => ids.includes(ex.id));
  }, [logs]);

  // 当前选中的观察动作，默认选取有记录的首个动作或深蹲
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(() => {
    return exercisesWithLogs[0]?.id || 'back-squat';
  });

  // 当日志变化且当前选中动作无记录时，自动切换
  useEffect(() => {
    if (exercisesWithLogs.length > 0 && !exercisesWithLogs.some((e) => e.id === selectedExerciseId)) {
      setSelectedExerciseId(exercisesWithLogs[0].id);
    }
  }, [exercisesWithLogs, selectedExerciseId]);

  // 过滤并按时间升序排序当前动作的所有记录
  const exerciseLogs = useMemo(() => {
    return logs
      .filter((l) => l.exerciseId === selectedExerciseId)
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [logs, selectedExerciseId]);

  const activeExercise = useMemo(() => {
    return NSCA_EXERCISES.find((e) => e.id === selectedExerciseId) || NSCA_EXERCISES[0];
  }, [selectedExerciseId]);

  // 统计分析指标
  const stats = useMemo(() => {
    if (exerciseLogs.length === 0) {
      return { max1RM: 0, current1RM: 0, gainKg: 0, gainPercent: 0, totalSets: 0 };
    }
    const max1RM = Math.max(...exerciseLogs.map((l) => l.estimated1RM));
    const first1RM = exerciseLogs[0].estimated1RM;
    const current1RM = exerciseLogs[exerciseLogs.length - 1].estimated1RM;
    const gainKg = Math.round((current1RM - first1RM) * 10) / 10;
    const gainPercent = first1RM > 0 ? Math.round(((current1RM - first1RM) / first1RM) * 1000) / 10 : 0;

    return {
      max1RM,
      current1RM,
      gainKg,
      gainPercent,
      totalSets: exerciseLogs.length,
    };
  }, [exerciseLogs]);

  // 渲染 Chart.js 渐进超负荷折线图
  useEffect(() => {
    if (!canvasRef.current || exerciseLogs.length === 0) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // 销毁旧实例以防重复重叠
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // 创建霓虹绿渐变阴影
    const neonGradient = ctx.createLinearGradient(0, 0, 0, 300);
    neonGradient.addColorStop(0, 'rgba(57, 255, 20, 0.28)');
    neonGradient.addColorStop(0.7, 'rgba(57, 255, 20, 0.05)');
    neonGradient.addColorStop(1, 'rgba(57, 255, 20, 0)');

    const labels = exerciseLogs.map((l, i) => `${l.dateStr} (#${i + 1})`);
    const oneRmData = exerciseLogs.map((l) => l.estimated1RM);
    const weightData = exerciseLogs.map((l) => l.weightKg);

    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '预估 1RM 渐进曲线 (Brzycki 科学估算)',
            data: oneRmData,
            borderColor: '#39FF14', // 荧光绿
            borderWidth: 3,
            backgroundColor: neonGradient,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#39FF14',
            pointBorderColor: '#121212',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 9,
            pointHoverBackgroundColor: '#FFFFFF',
            pointHoverBorderColor: '#39FF14',
            pointHoverBorderWidth: 3,
            yAxisID: 'y',
          },
          {
            label: '实做重量 (Actual Weight kg)',
            data: weightData,
            borderColor: '#00E5FF', // 电光蓝
            borderWidth: 2,
            borderDash: [5, 4],
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.2,
            pointBackgroundColor: '#00E5FF',
            pointBorderColor: '#121212',
            pointRadius: 4,
            pointHoverRadius: 7,
            yAxisID: 'y',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              color: '#d4d4d8',
              font: {
                family: "'Space Mono', monospace",
                size: 11,
              },
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 15,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(24, 24, 27, 0.95)',
            titleColor: '#39FF14',
            titleFont: {
              family: "'Chakra Petch', sans-serif",
              size: 13,
              weight: 'bold',
            },
            bodyColor: '#f4f4f5',
            bodyFont: {
              family: "'Space Mono', monospace",
              size: 12,
            },
            borderColor: 'rgba(57, 255, 20, 0.4)',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            callbacks: {
              title: (items) => {
                const idx = items[0].dataIndex;
                const log = exerciseLogs[idx];
                return `${log.dateStr} · 训练组 #${idx + 1}`;
              },
              afterBody: (items) => {
                const idx = items[0].dataIndex;
                const log = exerciseLogs[idx];
                return [
                  `-------------------`,
                  `完成负荷: ${log.weightKg} kg × ${log.reps} 次`,
                  `主观用力: RPE ${log.rpe}`,
                  log.notes ? `训练体会: ${log.notes}` : '',
                ].filter(Boolean);
              },
              label: (context) => {
                const value = context.parsed.y;
                return ` ${context.dataset.label?.split(' ')[0]}: ${value} kg`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
            ticks: {
              color: '#71717a',
              font: {
                family: "'Space Mono', monospace",
                size: 10,
              },
              maxRotation: 45,
            },
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.08)',
            },
            ticks: {
              color: '#a1a1aa',
              font: {
                family: "'Space Mono', monospace",
                size: 11,
              },
              callback: (value) => `${value} kg`,
            },
            suggestedMin: (Math.min(...weightData, ...oneRmData) || 50) - 10,
          },
        },
      },
    });

    chartInstanceRef.current = newChart;

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [exerciseLogs]);

  return (
    <div className="space-y-6">
      {/* 模块顶部介绍与动作选择下拉 */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30 font-mono-tech">
              CHART.JS PROGRESSIVE OVERLOAD ENGINE
            </span>
            <span className="text-zinc-400 text-xs hidden sm:inline">力量渐进超负荷趋势监测</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#39FF14]" />
            1RM 力量渐进超负荷 (Progressive Overload) 折线图
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            基于 Brzycki 科学公式实时推算每组 1RM，直观呈现中枢神经募集与肌纤维肥大的力量增长轨迹
          </p>
        </div>

        {/* 观察动作选择下拉框 */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <label htmlFor="chart-exercise-select" className="text-xs text-zinc-400 whitespace-nowrap font-medium">
            监测动作：
          </label>
          <select
            id="chart-exercise-select"
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
            className="px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-semibold text-[#00E5FF] focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]"
          >
            {NSCA_EXERCISES.map((ex) => {
              const hasLogs = logs.some((l) => l.exerciseId === ex.id);
              return (
                <option key={ex.id} value={ex.id}>
                  {ex.name} {hasLogs ? '✓' : '(暂无数据)'}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* 4 项核心力量指标卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* 历史最高 1RM */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-zinc-400 font-mono-tech">
            <span>HISTORIC PR</span>
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#39FF14]" />
          </div>
          <div className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold font-mono-tech text-white">
            <span className="text-[#39FF14]">{stats.max1RM}</span>
            <span className="text-xs sm:text-sm text-zinc-400 ml-1 font-normal">kg</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 mt-1 truncate">
            历史峰值极限 (Brzycki)
          </div>
        </div>

        {/* 最近一次 1RM */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-zinc-400 font-mono-tech">
            <span>RECENT 1RM</span>
            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00E5FF]" />
          </div>
          <div className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold font-mono-tech text-white">
            <span className="text-[#00E5FF]">{stats.current1RM}</span>
            <span className="text-xs sm:text-sm text-zinc-400 ml-1 font-normal">kg</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 mt-1 truncate">
            最新训练表现预测
          </div>
        </div>

        {/* 净增幅 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-zinc-400 font-mono-tech">
            <span>NET GAIN</span>
            <TrendingUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${stats.gainKg >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
          </div>
          <div className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold font-mono-tech text-white">
            <span className={stats.gainKg >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {stats.gainKg >= 0 ? `+${stats.gainKg}` : stats.gainKg}
            </span>
            <span className="text-xs sm:text-sm text-zinc-400 ml-1 font-normal">kg</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 mt-1 font-mono-tech truncate">
            增长率: {stats.gainPercent >= 0 ? `+${stats.gainPercent}%` : `${stats.gainPercent}%`}
          </div>
        </div>

        {/* 累计收录组数 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-zinc-400 font-mono-tech">
            <span>SAMPLES</span>
            <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
          </div>
          <div className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold font-mono-tech text-white">
            <span className="text-amber-400">{stats.totalSets}</span>
            <span className="text-xs sm:text-sm text-zinc-400 ml-1 font-normal">组</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 mt-1 truncate">
            有效历史采样数据
          </div>
        </div>
      </div>

      {/* Chart.js 画布容器 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 relative">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14] animate-pulse shrink-0" />
            <h3 className="font-bold text-white text-sm sm:text-base truncate">
              {activeExercise.name} · 渐进负荷历程
            </h3>
            <span className="text-[10px] sm:text-xs font-mono-tech text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded shrink-0">
              {activeExercise.category}
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono-tech text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#39FF14] rounded-full inline-block"></span>
              预估 1RM
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#00E5FF] rounded-full inline-block border-b border-dashed"></span>
              实做重量
            </span>
          </div>
        </div>

        {exerciseLogs.length === 0 ? (
          <div className="h-64 sm:h-80 flex flex-col items-center justify-center text-zinc-500 space-y-3">
            <BarChart2 className="w-10 h-10 text-zinc-700" />
            <p className="text-xs sm:text-sm text-center">该动作暂无历史数据，请在“记录数据”中为 {activeExercise.name} 添加训练组。</p>
          </div>
        ) : (
          <div className="h-72 sm:h-96 w-full relative">
            <canvas ref={canvasRef} id="nsca-overload-chart" />
          </div>
        )}

        {/* NSCA 渐进超负荷 2-for-2 规则诊断栏 */}
        <div className="mt-4 p-3.5 bg-zinc-950/80 rounded-lg border border-zinc-800 text-xs flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-[#39FF14] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-zinc-200">NSCA 科学教练点评 (CSCS Feedback)：</span>
            <span className="text-zinc-400 ml-1">
              {stats.gainKg > 0 
                ? `该动作呈现稳定的渐进超负荷形态（净增长 +${stats.gainKg}kg）。当前阶段建议优先保证向心阶段速度，严守技术形变底线。当连续两周最后一组超越既定次数 >=2 次时，立即执行 2.5~5kg 加重。`
                : `当前该动作处于基底积累或平稳阶段。建议强化辅助肌群孤立训练，并在下周尝试通过缩短组间歇或增加 1-2 次重复来突破平台期。`
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
