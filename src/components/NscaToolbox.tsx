import React, { useState, useMemo } from 'react';
import { NSCA_LOAD_CHART, RPE_SCALE, evaluate2for2Rule } from '../utils/nscaFormulas';
import { 
  Award, 
  Calculator, 
  Flame, 
  ShieldCheck, 
  ArrowRight, 
  BookOpen, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const NscaToolbox: React.FC = () => {
  // 1RM 负荷矩阵状态
  const [custom1RM, setCustom1RM] = useState<number>(100);

  // 2-for-2 法则测试状态
  const [testCategory, setTestCategory] = useState<'LOWER_PUSH' | 'UPPER_PUSH'>('LOWER_PUSH');
  const [extraReps, setExtraReps] = useState<number>(2);
  const [consecutiveSessions, setConsecutiveSessions] = useState<number>(2);

  // 1RM 矩阵计算
  const loadMatrix = useMemo(() => {
    return NSCA_LOAD_CHART.map((item) => {
      const weight = Math.round((custom1RM * (item.percent / 100)) * 2) / 2;
      return {
        ...item,
        weight,
      };
    });
  }, [custom1RM]);

  // 2-for-2 评估结果
  const evaluation2for2 = useMemo(() => {
    return evaluate2for2Rule(testCategory, extraReps, consecutiveSessions);
  }, [testCategory, extraReps, consecutiveSessions]);

  return (
    <div className="space-y-8">
      {/* 顶部标题栏 */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/30 font-mono-tech">
              CSCS SCIENTIFIC TOOLBOX
            </span>
            <span className="text-zinc-400 text-xs hidden sm:inline">体能教练科学工具锦囊</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            NSCA-CSCS 力量科学与调节计算工具箱
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            收录《NSCA Essentials》官方力量百分比矩阵、RPE/RIR 自律调节体系与 2-for-2 渐进增重法则
          </p>
        </div>
      </div>

      {/* 第一模块：1RM 百分比负荷速算矩阵 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#39FF14]" />
              <span>NSCA %1RM 负荷与重复次数速算矩阵 (Table 17.6)</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
              输入您的单项极限 1RM，即刻换算力量期、肌肥大期与耐力期的建议负荷
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 self-start sm:self-auto">
            <label htmlFor="custom-1rm-input" className="text-xs text-zinc-300 font-medium whitespace-nowrap">
              基准 1RM:
            </label>
            <input
              id="custom-1rm-input"
              type="number"
              min="20"
              max="500"
              step="2.5"
              value={custom1RM}
              onChange={(e) => setCustom1RM(parseFloat(e.target.value) || 0)}
              className="w-20 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-center text-sm font-mono-tech font-bold text-[#39FF14] focus:outline-none focus:border-[#39FF14]"
            />
            <span className="text-xs font-mono-tech text-zinc-400">kg</span>
          </div>
        </div>

        {/* 矩阵表格 */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {loadMatrix.map((item) => (
            <div
              key={item.percent}
              className={`p-2.5 sm:p-3 rounded-lg border text-center transition-colors ${
                item.percent >= 85
                  ? 'bg-zinc-950 border-zinc-800 hover:border-[#39FF14]/50'
                  : item.percent >= 67
                  ? 'bg-zinc-950 border-zinc-800 hover:border-[#00E5FF]/50'
                  : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="text-[10px] sm:text-[11px] font-mono-tech text-zinc-400">
                {item.percent}% 1RM
              </div>
              <div className="text-lg sm:text-xl font-extrabold font-mono-tech text-white my-0.5 sm:my-1">
                {item.weight} <span className="text-[10px] font-normal text-zinc-500">kg</span>
              </div>
              <div className="text-[11px] sm:text-xs font-mono-tech font-semibold text-zinc-300">
                ≤ {item.reps} 次
              </div>
              <div className="text-[9px] sm:text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                {item.zone}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 第二模块：NSCA "2-for-2" 渐进加重准则交互诊断器 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
        <div className="pb-4 border-b border-zinc-800">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
            <span>NSCA &ldquo;2-for-2&rdquo; 渐进超负荷科学增重法则诊断</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
            严防盲目加重导致损伤，亦防长期停滞！连续两周最后两组均能超额完成 ≥2 次时方可安全加重。
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4 md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  动作肌群属性
                </label>
                <select
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-[#00E5FF]"
                >
                  <option value="LOWER_PUSH">下肢大复合动作 (深蹲/硬拉等)</option>
                  <option value="UPPER_PUSH">上肢/小肌群动作 (卧推/推举/划船等)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  最后一组超额完成次数
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setExtraReps(n)}
                      className={`flex-1 py-1.5 text-xs font-mono-tech rounded border ${
                        extraReps === n
                          ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] font-bold'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      +{n}次
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  该超额持续周数
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setConsecutiveSessions(w)}
                      className={`flex-1 py-1.5 text-xs font-mono-tech rounded border ${
                        consecutiveSessions === w
                          ? 'bg-[#39FF14]/20 border-[#39FF14] text-[#39FF14] font-bold'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {w} 周
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${evaluation2for2.canIncrease ? 'bg-[#39FF14]' : 'bg-amber-400'}`} />
                <span className="font-bold text-sm text-white">
                  {evaluation2for2.canIncrease ? '符合 NSCA 加重判定条件' : '暂未达标，维持当前重量'}
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {evaluation2for2.recommendation}
              </p>
              <div className="text-xs font-mono-tech text-zinc-400 pt-1">
                推荐增重量级：<strong className="text-white">{evaluation2for2.weightIncrement}</strong>
              </div>
            </div>
          </div>

          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-400 space-y-2">
            <div className="font-bold text-zinc-200 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>NSCA 教材原文规范</span>
            </div>
            <p className="leading-relaxed">
              &ldquo;The 2-for-2 rule: If the athlete can perform two or more repetitions over his or her assigned repetition goal in the last set in two consecutive workouts for a given exercise, weight should be added to that exercise for the next training session.&rdquo;
            </p>
            <p className="text-zinc-500 text-[11px] pt-1">
              — Thomas R. Baechle, NSCA Essentials of Strength Training and Conditioning
            </p>
          </div>
        </div>
      </div>

      {/* 第三模块：RPE & RIR 自律调节全景对照 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
        <div className="pb-4 border-b border-zinc-800">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>RPE 自感用力度与 RIR (储备次数) 全景对照表</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
            结合百分比 (%1RM) 与自律调节 (Autoregulation)，避免状态波动与中枢疲劳强推致伤
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {RPE_SCALE.map((r) => (
            <div
              key={r.score}
              className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 flex items-start gap-3"
            >
              <div
                className="w-10 h-10 rounded-lg flex flex-col items-center justify-center font-mono-tech font-bold shrink-0 border"
                style={{
                  backgroundColor: `${r.color}15`,
                  borderColor: `${r.color}40`,
                  color: r.color,
                }}
              >
                <span className="text-xs">@{r.score}</span>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{r.name}</span>
                  <span 
                    className="text-[10px] font-mono-tech px-1.5 py-0.2 rounded font-semibold"
                    style={{ backgroundColor: `${r.color}20`, color: r.color }}
                  >
                    {r.rir}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  {r.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
