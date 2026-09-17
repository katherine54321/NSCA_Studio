import React, { useState } from 'react';
import { TrainingGoal, ExperienceLevel, PeriodizationPlan } from '../types/nsca';
import { generateNSCAPeriodizationPlan, validateNSCAPrescription } from '../utils/periodizationLogic';
import { NSCA_CATEGORIES } from '../data/exercises';
import { 
  Sparkles, 
  Calendar, 
  Target, 
  Sliders, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  Flame, 
  Copy, 
  Check, 
  ArrowRight,
  Dumbbell,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

interface PeriodizationGeneratorProps {
  onQuickLogExercise?: (exerciseName: string) => void;
}

export const PeriodizationGenerator: React.FC<PeriodizationGeneratorProps> = ({
  onQuickLogExercise,
}) => {
  // 3 个用户输入状态
  const [goal, setGoal] = useState<TrainingGoal>('HYPERTROPHY');
  const [weeklyDays, setWeeklyDays] = useState<number>(4);
  const [level, setLevel] = useState<ExperienceLevel>('INTERMEDIATE');

  // 生成的计划
  const [plan, setPlan] = useState<PeriodizationPlan>(() => 
    generateNSCAPeriodizationPlan('HYPERTROPHY', 4, 'INTERMEDIATE')
  );

  // 当前浏览的周 (1 - 4)
  const [activeWeekIndex, setActiveWeekIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [showTheoryExplainer, setShowTheoryExplainer] = useState<boolean>(false);

  // 实时运行 NSCA 处方智能规则校验
  const currentValidation = validateNSCAPrescription(goal, weeklyDays, level);

  // 响应一键修复建议
  const handleApplySuggestion = (actionType: string) => {
    switch (actionType) {
      case 'SET_DAYS_3':
        setWeeklyDays(3);
        break;
      case 'SET_LEVEL_INTERMEDIATE':
        setLevel('INTERMEDIATE');
        break;
      case 'SET_GOAL_HYPERTROPHY':
        setGoal('HYPERTROPHY');
        break;
      case 'SET_GOAL_ENDURANCE':
        setGoal('ENDURANCE');
        break;
      case 'SET_GOAL_STRENGTH':
        setGoal('STRENGTH');
        break;
      case 'APPLY_SAFE_COMBO':
        setWeeklyDays(3);
        setGoal('HYPERTROPHY');
        break;
      default:
        break;
    }
  };

  // 触发生成新计划
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newPlan = generateNSCAPeriodizationPlan(goal, weeklyDays, level);
      setPlan(newPlan);
      setActiveWeekIndex(0);
      setIsGenerating(false);
    }, 350);
  };

  // 复制计划文本
  const handleCopyPlan = () => {
    const textLines = [
      `=== ${plan.title} ===`,
      plan.safetyWarning ? `[NSCA 处方提示]: ${plan.safetyWarning}` : '',
      `目标区间: ${plan.nscaParameters.intensity} | 每组 ${plan.nscaParameters.repsPerSet} | 组间歇 ${plan.nscaParameters.restPeriod}`,
      `---------------------------------------`,
      ...plan.weeks.map((w) => {
        return [
          `\n【${w.weekName}】`,
          `阶段目标: ${w.phaseGoal}`,
          `计划强度: ${w.intensityDescription} | 目标次数: ${w.repsDescription}`,
          ...w.dailyWorkouts.map((d) => {
            return `\n  * ${d.dayName} - ${d.theme}:\n` +
              d.exercises.map((e) => `    - ${e.name}: ${e.sets}组 × ${e.reps} (${e.intensity}, 休息${e.rest})`).join('\n');
          })
        ].filter(Boolean).join('\n');
      })
    ];

    navigator.clipboard.writeText(textLines.join('\n'));
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const currentWeek = plan.weeks[activeWeekIndex];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 顶部标题与科学标准介绍 */}
      <div className="p-4 sm:p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-mono-tech">
              NSCA PERIODIZATION SYNTHESIZER
            </span>
            <span className="text-zinc-400 text-xs">4 周科学波浪微周期</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              CSCS 规则引擎内置
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#00E5FF]" />
            NSCA 周期化训练计划生成器
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
            严格按照《NSCA-CSCS 体能训练与力量调节指南》自动编排强度、每组次数、组间歇、分化架构与第4周科学减载
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setShowTheoryExplainer(!showTheoryExplainer)}
            className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 rounded-lg text-xs font-medium border border-zinc-700 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>训练天数理论定位</span>
            {showTheoryExplainer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            id="btn-copy-plan"
            onClick={handleCopyPlan}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-white rounded-lg text-xs font-medium border border-zinc-700 transition-colors"
          >
            {copiedToast ? <Check className="w-4 h-4 text-[#39FF14]" /> : <Copy className="w-4 h-4" />}
            <span>{copiedToast ? '已复制课表文本' : '复制课表'}</span>
          </button>
        </div>
      </div>

      {/* NSCA 周期化理论深度溯源折叠卡片 (解答用户的核心困惑) */}
      {showTheoryExplainer && (
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-[#00E5FF]/30 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#00E5FF]">
            <HelpCircle className="w-4 h-4" />
            <span>NSCA 权威解答：“每周训练天数”是评估依据还是计划结果？</span>
          </div>
          <div className="text-xs sm:text-sm text-zinc-300 space-y-2.5 leading-relaxed">
            <p>
              <strong className="text-white">答：它既是前置的【运动员恢复能力与时间预算评估依据 (Assessment Basis)】，也是生成科学分化模版 (Split Routine) 的调度依据。</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs">
                <span className="font-semibold text-emerald-400 font-mono-tech block mb-1">
                  1. NSCA Table 17.5 严格频率分级：
                </span>
                <ul className="text-zinc-400 space-y-1 list-disc pl-4">
                  <li><strong>初学者 (Novice)</strong>：严格限制为 <strong>2 - 3 天/周</strong>（每次全身训练后必须保留 48 小时以保证中枢恢复与肌原纤维重建）。</li>
                  <li><strong>中级运动员 (Intermediate)</strong>：<strong>3 - 4 天/周</strong>（适合上/下肢分化）。</li>
                  <li><strong>高级运动员 (Advanced)</strong>：<strong>4 - 7 天/周</strong>（高频分化与波浪超载）。</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs">
                <span className="font-semibold text-amber-400 font-mono-tech block mb-1">
                  2. 为什么“初学者 + 每周4天爆发力”绝对违规？
                </span>
                <ul className="text-zinc-400 space-y-1 list-disc pl-4">
                  <li><strong>神经系统枯竭</strong>：奥林匹克高翻/挺举落地冲击力为体重的 3~5 倍，初学者缺乏制动减速吸收能力。</li>
                  <li><strong>进阶阶梯倒置</strong>：NSCA 核心公理是 <em>“力量是爆发力的基石 (Strength is the foundation of power)”</em>。未建立 1.5 倍体重深蹲底座前直接爆发力训练极易导致手腕、肩袖和腰椎损伤。</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3 个核心输入项选择器 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
        <div className="text-sm font-semibold text-white flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#39FF14]" />
            <span>设定运动员档案与周期目标 (3 大评估输入参数)</span>
          </div>
          <span className="text-[11px] font-mono-tech text-zinc-400 hidden sm:inline">
            实时规则引擎校验中
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* 输入项 1: 用户当前目标 */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              1. 核心训练目标 (Target Goal)
            </label>
            <div className="space-y-2">
              {[
                { 
                  id: 'HYPERTROPHY' as const, 
                  name: '纯肌肥大 (Hypertrophy)', 
                  desc: '67-85% 1RM, 6-12次, 间歇30-90秒, 3-6组', 
                  color: '#00E5FF' 
                },
                { 
                  id: 'ENDURANCE' as const, 
                  name: '肌耐力 (Muscular Endurance)', 
                  desc: '≤67% 1RM, ≥12次, 间歇≤30秒, 2-3组', 
                  color: '#A855F7' 
                },
                { 
                  id: 'STRENGTH' as const, 
                  name: '纯最大力量 (Strength)', 
                  desc: '≥85% 1RM, ≤6次, 间歇2-5分钟, 2-6组', 
                  color: '#39FF14' 
                },
                { 
                  id: 'POWER' as const, 
                  name: '功率与爆发力 (Power / Olympic)', 
                  desc: '75-90% 1RM, 1-5次, 间歇2-5分钟, 3-5组', 
                  color: '#F59E0B' 
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setGoal(item.id)}
                  style={{
                    borderColor: goal === item.id ? item.color : undefined,
                    backgroundColor: goal === item.id ? `${item.color}15` : undefined,
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    goal === item.id
                      ? 'shadow-sm'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span 
                      className="font-bold text-xs"
                      style={{ color: goal === item.id ? item.color : '#f4f4f5' }}
                    >
                      {item.name}
                    </span>
                    {goal === item.id && (
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 font-mono-tech">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 输入项 2: 每周训练天数 */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              2. 每周训练天数 (Frequency - 评估依据)
            </label>
            <div className="space-y-2">
              {[
                { days: 2, name: '每周 2 天 (全身 A/B 循环)', desc: '初学者或时间受限者，恢复充沛 (48-72h间隔)' },
                { days: 3, name: '每周 3 天 (经典上/下/全身)', desc: 'NSCA 初学与中级黄金推荐，兼顾负荷与恢复' },
                { days: 4, name: '每周 4 天 (上下肢推拉分化)', desc: '仅建议中级与进阶运动员 (Upper-Lower 分化)' },
              ].map((item) => (
                <div
                  key={item.days}
                  onClick={() => setWeeklyDays(item.days)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    weeklyDays === item.days
                      ? 'bg-[#39FF14]/10 border-[#39FF14] text-[#39FF14]'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs">
                      {item.name}
                    </span>
                    {weeklyDays === item.days && (
                      <span className="w-2 h-2 rounded-full bg-[#39FF14]" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 输入项 3: 当前体能水平 */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              3. 当前体能水平 (Fitness Level)
            </label>
            <div className="space-y-2">
              {[
                { id: 'BEGINNER' as const, name: '初学者 (Novice)', desc: '规律抗阻 < 6 个月，重点动作轨迹与神经适应' },
                { id: 'INTERMEDIATE' as const, name: '中级运动员 (Intermediate)', desc: '规律抗阻 6-12 个月，具备深蹲/硬拉基本力量底座' },
                { id: 'ADVANCED' as const, name: '高级运动员 (Advanced)', desc: '系统抗阻 > 1 年，耐受高容量与奥林匹克翻举冲击' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setLevel(item.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    level === item.id
                      ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-[#00E5FF]'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs">
                      {item.name}
                    </span>
                    {level === item.id && (
                      <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🚨 NSCA 智能规则实时拦截与警示条 (Real-time Pre-flight Interception Banner) */}
        {currentValidation.hasConflict && (
          <div className="mt-5 space-y-3">
            {currentValidation.conflicts.map((conflict) => {
              const isCritical = conflict.severity === 'CRITICAL';

              return (
                <div
                  key={conflict.id}
                  className={`p-4 rounded-xl border ${
                    isCritical
                      ? 'bg-rose-950/30 border-rose-500/60 shadow-lg'
                      : 'bg-amber-950/30 border-amber-500/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isCritical ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {isCritical ? <AlertOctagon className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className={`text-sm font-bold ${
                          isCritical ? 'text-rose-300' : 'text-amber-300'
                        }`}>
                          {conflict.title}
                        </h4>
                        <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded font-bold border ${
                          isCritical 
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          {isCritical ? 'CRITICAL CONFLICT' : 'PRECAUTION WARNING'}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {conflict.description}
                      </p>

                      <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-[11px] text-zinc-400">
                        <strong className="text-zinc-200">NSCA 官方规范引注：</strong>
                        <span>{conflict.nscaStandard}</span>
                      </div>

                      {/* 交互式科学矫正建议按钮组 */}
                      <div className="pt-1">
                        <span className="text-[11px] font-semibold text-zinc-400 block mb-1.5">
                          💡 NSCA CSCS 建议快速采纳：
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {conflict.suggestedActions.map((action, aIdx) => (
                            <button
                              key={aIdx}
                              type="button"
                              onClick={() => handleApplySuggestion(action.actionType)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 border ${
                                aIdx === 0
                                  ? 'bg-[#39FF14]/15 hover:bg-[#39FF14]/25 text-[#39FF14] border-[#39FF14]/40 font-bold'
                                  : 'bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border-zinc-700'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{action.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 生成触发按钮 */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs text-zinc-400 flex items-center gap-1.5 order-2 sm:order-1">
            {currentValidation.hasConflict ? (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>若强制生成，系统将自动注入“初学者动力学安全降级保护”</span>
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>处方符合 NSCA 周期化标准，参数安全通过</span>
              </span>
            )}
          </div>

          <button
            id="btn-generate-plan"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#00E5FF] text-black font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md active:scale-95 glow-neon-green order-1 sm:order-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? '正在执行 NSCA 周期化算法...' : '生成 4 周周期化课表'}</span>
          </button>
        </div>
      </div>

      {/* 若当前课表带有初学者自适应防护，展示全局防护横幅 */}
      {plan.isBeginnerAdapted && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-500/40 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold text-amber-300 text-sm flex items-center gap-2">
              <span>已启用 NSCA 初学者特别安全防护与动力学降级模式</span>
              <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              基于 NSCA 损伤预防原则，系统已将课表中的高危杠铃翻举（高翻/挺举）自动降级为<strong>药球对地爆发砸投、哑铃轻负荷推举与箱式深蹲跳软着陆</strong>。重点建立中枢神经动力学传导与离心减速缓冲（Deceleration），严防中枢神经耗竭与关节挫伤。
            </p>
          </div>
        </div>
      )}

      {/* NSCA 周期化官方参数标定面板 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-mono-tech flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#39FF14]" />
            <span>NSCA 计划强度区间</span>
          </div>
          <div className="text-base sm:text-lg lg:text-xl font-bold font-mono-tech text-[#39FF14] mt-1.5 line-clamp-1">
            {plan.nscaParameters.intensity}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5 font-mono-tech">
            TARGET LOAD (%1RM)
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-mono-tech flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>每组完成次数</span>
          </div>
          <div className="text-base sm:text-lg lg:text-xl font-bold font-mono-tech text-[#00E5FF] mt-1.5 line-clamp-1">
            {plan.nscaParameters.repsPerSet}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5 font-mono-tech">
            REPETITIONS PER SET
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-mono-tech flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>组间恢复间歇</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-amber-300 mt-1.5 leading-snug line-clamp-2">
            {plan.nscaParameters.restPeriod}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5 font-mono-tech">
            REST INTERVAL
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-mono-tech flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>每动作推荐容量</span>
          </div>
          <div className="text-base sm:text-lg lg:text-xl font-bold font-mono-tech text-emerald-400 mt-1.5">
            {plan.nscaParameters.setsPerExercise}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5 font-mono-tech">
            VOLUME SETS / EXERCISE
          </div>
        </div>
      </div>

      {/* 4 周波浪微周期导航卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        {plan.weeks.map((w, idx) => {
          const isActive = activeWeekIndex === idx;
          const isDeload = idx === 3;

          return (
            <button
              key={w.weekNumber}
              id={`week-tab-${w.weekNumber}`}
              onClick={() => setActiveWeekIndex(idx)}
              className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all ${
                isActive
                  ? isDeload
                    ? 'bg-amber-950/20 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                    : 'bg-zinc-850 border-[#39FF14] shadow-md ring-1 ring-[#39FF14]/40'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono-tech font-bold text-zinc-400">
                  WEEK 0{w.weekNumber}
                </span>
                {isDeload && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-mono-tech bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    减载周
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mt-1 line-clamp-1">
                {idx === 0 ? '适应奠基周' : idx === 1 ? '负荷递增周' : idx === 2 ? '强度峰值周' : '科学减载周'}
              </div>
              <div className="text-[10px] sm:text-[11px] text-zinc-400 mt-1 font-mono-tech line-clamp-1">
                强度: {w.intensityDescription.split(' ')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* 当前选定周的详细训次安排 (Day-by-Day Workouts) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 space-y-5 sm:space-y-6">
        {/* 本周纲领与教练贴士 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-zinc-800 text-zinc-300">
                ACTIVE MICROCYCLE: WEEK 0{currentWeek.weekNumber}
              </span>
              {currentWeek.weekNumber === 4 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  DELOAD PHASE (超量恢复中)
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
              {currentWeek.weekName}
            </h3>
            <p className="text-xs text-zinc-300 mt-0.5">
              <span className="text-[#00E5FF] font-semibold">微周期导向：</span>
              {currentWeek.phaseGoal}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono-tech bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800">
            <span className="text-zinc-400">负荷基准:</span>
            <span className="text-[#39FF14] font-bold">{currentWeek.intensityDescription}</span>
            <span className="text-zinc-600">|</span>
            <span className="text-[#00E5FF] font-bold">{currentWeek.repsDescription}</span>
          </div>
        </div>

        {/* CSCS 教练专业指导贴士 */}
        <div className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800 text-xs text-zinc-300 space-y-1.5">
          <div className="font-semibold text-[#39FF14] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>NSCA-CSCS 本周教练执行要旨：</span>
          </div>
          {currentWeek.coachTips.map((tip, i) => (
            <div key={i} className="text-zinc-400 flex items-start gap-2 pl-1 leading-relaxed">
              <span className="text-zinc-500 font-mono-tech">›</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>

        {/* 每日训练动作卡片网格 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {currentWeek.dailyWorkouts.map((day, dIdx) => (
            <div
              key={dIdx}
              className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 sm:p-5 space-y-4 hover:border-zinc-700 transition-colors"
            >
              <div className="flex justify-between items-start pb-3 border-b border-zinc-850">
                <div>
                  <span className="text-xs font-mono-tech font-bold text-[#00E5FF]">
                    {day.dayName}
                  </span>
                  <h4 className="text-base font-bold text-white mt-0.5">
                    {day.theme}
                  </h4>
                </div>
                <span className="text-[10px] font-mono-tech text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {day.exercises.length} 个动作
                </span>
              </div>

              {/* 动作序列（遵循 NSCA 训次排序准则） */}
              <div className="space-y-3">
                {day.exercises.map((ex, eIdx) => {
                  const catMeta = NSCA_CATEGORIES.find((c) => c.key === ex.category);

                  return (
                    <div
                      key={eIdx}
                      className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800/80 space-y-1.5 hover:bg-zinc-900 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono-tech font-bold text-zinc-500">
                            #{eIdx + 1}
                          </span>
                          <span className="font-bold text-sm text-zinc-100">
                            {ex.name}
                          </span>
                        </div>
                        <span 
                          className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded border shrink-0"
                          style={{
                            color: catMeta?.accentColor,
                            backgroundColor: `${catMeta?.accentColor}10`,
                            borderColor: `${catMeta?.accentColor}30`,
                          }}
                        >
                          {catMeta?.name || ex.category}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono-tech pt-1">
                        <span className="text-[#39FF14] font-bold">
                          {ex.sets} 组 × {ex.reps}
                        </span>
                        <span className="text-zinc-400">
                          强度: <strong className="text-zinc-200">{ex.intensity}</strong>
                        </span>
                        <span className="text-zinc-400">
                          间歇: <strong className="text-amber-400">{ex.rest}</strong>
                        </span>
                      </div>

                      <div className="text-[11px] text-zinc-400 flex items-start gap-1 pt-0.5">
                        <span className="text-[#00E5FF] font-bold">›</span>
                        <span>{ex.notes}</span>
                      </div>

                      {onQuickLogExercise && (
                        <div className="pt-1 flex justify-end">
                          <button
                            onClick={() => onQuickLogExercise(ex.name)}
                            className="text-[10px] text-zinc-400 hover:text-[#39FF14] flex items-center gap-1 transition-colors font-mono-tech py-1 px-1.5 rounded hover:bg-zinc-800"
                          >
                            <Dumbbell className="w-3 h-3" />
                            <span>在数据面板中记录此项</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
