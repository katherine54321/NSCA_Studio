import { PeriodizationPlan, TrainingGoal, ExperienceLevel, MicrocycleWeek, DayWorkout, NSCAValidationResult, NSCAConflictItem } from '../types/nsca';

/**
 * NSCA-CSCS 训练处方智能规则校验引擎
 * 严格遵照《NSCA Essentials of Strength Training and Conditioning》第17章（Table 17.5 训练频率与周期化进阶阶梯）
 */
export function validateNSCAPrescription(
  goal: TrainingGoal,
  weeklyDays: number,
  experienceLevel: ExperienceLevel
): NSCAValidationResult {
  const conflicts: NSCAConflictItem[] = [];

  const isBeginner = experienceLevel === 'BEGINNER';
  const isFrequencyOverload = isBeginner && weeklyDays > 3; // 初学者每周 4 天
  const isPowerPremature = isBeginner && goal === 'POWER';   // 初学者直接选爆发力

  if (isFrequencyOverload && isPowerPremature) {
    // 双重严重违规
    conflicts.push({
      id: 'COMPOUND_BEGINNER_POWER_4DAYS',
      type: 'COMPOUND_RISK',
      title: '🚨 NSCA 双重高风险违背：初学者每周 4 天高频爆发力',
      severity: 'CRITICAL',
      description: '同时严重违背了 NSCA 训练频率规范 (Table 17.5) 与周期化进阶金字塔模型！初学者结缔组织（肌腱韧带）与中枢神经系统 (CNS) 尚未建立耐受，高频冲刺奥林匹克杠铃翻举极易诱发中枢枯竭、手腕挫伤与过度训练综合征。',
      nscaStandard: '《NSCA 体能训练指南》第 17 章：初学者训练频率严格为 2~3 天/周（需 48h 恢复间隔）；且爆发力训练前必须经过解剖适应与力量奠基（通常深蹲 1RM 需达到 1.5 倍体重以保证落地缓冲安全）。',
      suggestedActions: [
        {
          label: '一键采纳黄金推荐：每周 3 天 + 肌肥大期 (Hypertrophy)',
          actionType: 'APPLY_SAFE_COMBO',
        },
        {
          label: '切换为：纯最大力量奠基期 (夯实动作底座)',
          actionType: 'SET_GOAL_STRENGTH',
        },
        {
          label: '降低频率为：每周 3 天 (均衡恢复)',
          actionType: 'SET_DAYS_3',
        },
      ],
    });
  } else {
    if (isFrequencyOverload) {
      conflicts.push({
        id: 'FREQUENCY_OVERLOAD_BEGINNER',
        type: 'FREQUENCY_OVERLOAD',
        title: '⚠️ NSCA 训练频率冲突：初学者每周 4 天训练过频',
        severity: 'WARNING',
        description: '初学者在经历抗阻训练后，肌原纤维修复与神经肌肉接头需要至少 48 小时完全超量恢复。每周 4 天高容量分化属于中高级方案，初学者执行极易造成慢性疲劳累积与技术形变。',
        nscaStandard: 'NSCA Table 17.5 规范：初学者建议 2~3 天/周；中级运动员建议 3~4 天/周；高级运动员建议 4~7 天/周。',
        suggestedActions: [
          {
            label: '调整频率为：每周 3 天 (NSCA 黄金初学者频次)',
            actionType: 'SET_DAYS_3',
          },
          {
            label: '调整水平为：中级运动员 (若已有半年以上系统经验)',
            actionType: 'SET_LEVEL_INTERMEDIATE',
          },
        ],
      });
    }

    if (isPowerPremature) {
      conflicts.push({
        id: 'POWER_PREMATURE_BEGINNER',
        type: 'POWER_PREMATURE',
        title: '⚠️ NSCA 周期化进阶冲突：初学者跨阶跳入爆发力期',
        severity: 'CRITICAL',
        description: 'NSCA 核心格言：“力量是爆发力的基石 (Strength is the foundation of power)”。奥林匹克举重动作落地冲击力高达体重的 3~5 倍。初学者若缺乏基本核心刚性与离心减速缓冲能力，直接大重量翻举极具致伤风险。',
        nscaStandard: 'NSCA 经典周期化顺序：肌耐力与解剖适应期 (Endurance/AA) ➔ 肌肥大期 (Hypertrophy) ➔ 基础力量期 (Strength) ➔ 爆发力转化期 (Power)。',
        suggestedActions: [
          {
            label: '切换为：肌肥大构建期 (67-85% 1RM 建立肌肉量与结缔组织耐受)',
            actionType: 'SET_GOAL_HYPERTROPHY',
          },
          {
            label: '切换为：肌耐力适应期 (≤67% 1RM 建立动作模式与抗疲劳底座)',
            actionType: 'SET_GOAL_ENDURANCE',
          },
          {
            label: '切换为：纯最大力量期 (建立深蹲/硬拉力量底座)',
            actionType: 'SET_GOAL_STRENGTH',
          },
          {
            label: '调整水平为：中高级运动员 (若已掌握抓翻基础)',
            actionType: 'SET_LEVEL_INTERMEDIATE',
          },
        ],
      });
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    severity: conflicts.some(c => c.severity === 'CRITICAL') ? 'CRITICAL' : conflicts.length > 0 ? 'WARNING' : 'SAFE',
    conflicts,
  };
}

/**
 * NSCA 科学周期化训练课表生成算法
 * 
 * 严格遵照《NSCA-CSCS 体能训练与力量调节指南 (Essentials of Strength Training and Conditioning)》四大抗阻目标：
 * 
 * 1. 目标区间科学配比 (NSCA Table 17.6 / 17.8 / 17.9 / 17.10)：
 *    - 【肌肥大期 (Hypertrophy)】：
 *      - 强度：67% - 85% 1RM
 *      - 每组重复次数：6 - 12 次
 *      - 组间休息：30 - 90 秒（适度不完全恢复，维持高代谢压力与肌浆网膨胀刺激）
 *      - 组数：3 - 6 组
 *    - 【肌耐力期 (Muscular Endurance)】：
 *      - 强度：≤ 67% 1RM
 *      - 每组重复次数：≥ 12 次 (通常 12 - 20+ 次)
 *      - 组间休息：≤ 30 秒（极短间歇，考验糖酵解缓冲与骨骼肌毛细血管氧化耐受）
 *      - 组数：2 - 3 组
 *    - 【力量期 (Maximal Strength)】：
 *      - 强度：≥ 85% 1RM (85% - 93% 1RM)
 *      - 每组重复次数：≤ 6 次 (通常 2 - 5 次)
 *      - 组间休息：2 - 5 分钟（确保磷酸肌酸 CP 与中枢高阈值运动神经元完全复原）
 *      - 组数：2 - 6 组
 *    - 【爆发力期 (Power / Olympic)】：
 *      - 强度：单次动作 80-90% 1RM (1-2次) / 多次动作 75-85% 1RM (3-5次)
 *      - 初学者安全动力学：50-65% 1RM 或自重快速加速与落地制动吸收
 *      - 组间休息：2 - 5 分钟
 *      - 组数：3 - 5 组
 * 
 * 2. 4 周微周期 (Microcycles) 周期化波浪进程：
 *    - Week 1: 蓄水与动作质量适应周 (Acclimation Base)
 *    - Week 2: 渐进超负荷递增周 (Progressive Overload Wave)
 *    - Week 3: 极限峰值超载周 (Intensity Peak / Controlled Overreach)
 *    - Week 4: NSCA 科学减载周 (Deload Week - 削减 40% 训练容量，维持基本运动技巧强度，实现超量恢复)
 */

export function generateNSCAPeriodizationPlan(
  goal: TrainingGoal,
  weeklyDays: number,
  experienceLevel: ExperienceLevel
): PeriodizationPlan {
  // 运行 NSCA 智能规则校验
  const validation = validateNSCAPrescription(goal, weeklyDays, experienceLevel);
  const isBeginnerAdapted = experienceLevel === 'BEGINNER' && (goal === 'POWER' || weeklyDays > 3);

  // 基础参数配比
  let intensity = '';
  let repsPerSet = '';
  let restPeriod = '';
  let setsPerExercise = '';
  let frequencyAdvice = '';

  if (goal === 'HYPERTROPHY') {
    intensity = '67% - 85% 1RM (中高机械张力)';
    repsPerSet = '6 - 12 Reps (机械张力与代谢积累黄金区间)';
    restPeriod = '30 - 90 秒 (高代谢应激，促进肌原纤维粗壮化与肌浆肥大)';
    setsPerExercise = experienceLevel === 'BEGINNER' ? '3 组' : experienceLevel === 'INTERMEDIATE' ? '3 - 4 组' : '4 - 5 组';
    frequencyAdvice = '目标肌群每周受刺激频次建议 2 - 3 次，保证充分合成代谢视窗与蛋白质合成 (MPS)';
  } else if (goal === 'ENDURANCE') {
    intensity = '≤ 67% 1RM (轻负荷耐受抗阻)';
    repsPerSet = '≥ 12 Reps (通常 12 - 20+ 次，追求动作节奏与乳酸耐受)';
    restPeriod = '≤ 30 秒 (极短间歇，考验糖酵解氧化清除与毛细血管密度)';
    setsPerExercise = experienceLevel === 'BEGINNER' ? '2 - 3 组' : '3 组 (NSCA 标准 2-3 组)';
    frequencyAdvice = '强调匀速节奏与持续张力，维持心率平稳与动作轨迹标准，避免过早中枢衰竭';
  } else if (goal === 'STRENGTH') {
    intensity = '≥ 85% 1RM (85% - 93% 1RM 极限负荷)';
    repsPerSet = '≤ 6 Reps (主要集中在 2 - 5 次极限负荷)';
    restPeriod = '2 - 5 分钟 (确保 ATP-CP 磷酸原系统与中枢神经完全恢复)';
    setsPerExercise = experienceLevel === 'BEGINNER' ? '3 组' : experienceLevel === 'INTERMEDIATE' ? '4 - 5 组' : '5 - 6 组';
    frequencyAdvice = '每次训练集中刺激 1-2 个大复合动作，避免神经中枢过早疲劳';
  } else {
    // POWER
    if (experienceLevel === 'BEGINNER') {
      intensity = '50% - 65% 1RM (初学者动力学轻负荷/自重快速爆发)';
      repsPerSet = '3 - 5 Reps (绝不力竭，以最高动作速率与缓冲品质为准)';
      restPeriod = '2 - 3 分钟 (保障每组高质量向心爆发)';
      setsPerExercise = '2 - 3 组 (严格控制初学者神经总做功量)';
      frequencyAdvice = '置于课表第一项；严控离心受创，着重落地消音缓冲';
    } else {
      intensity = '75% - 85% (多次动作) / 80% - 90% (单次爆发动作)';
      repsPerSet = '1 - 5 Reps (以最高动作速度与发力率为唯一评判指标)';
      restPeriod = '2 - 5 分钟 (杜绝在肌肉有酸痛疲劳感下进行爆发式动作)';
      setsPerExercise = '3 - 5 组';
      frequencyAdvice = '爆发力训练必须置于每次训练课核心热身后首个环节';
    }
  }

  // 4周微周期安排
  const weeks: MicrocycleWeek[] = [
    {
      weekNumber: 1,
      weekName: '第 1 周：基础适应与容量奠基周 (Acclimation & Base Volume)',
      phaseGoal: goal === 'ENDURANCE' 
        ? '确立轻负荷动作匀速节律，体验 ≥15次 肌肉泵感与短间歇心肺协同。' 
        : '熟悉训练动作轨迹，确立基准 RPE 7-8，储备力竭次数 (2-3 RIR)。',
      volumeMultiplier: 1.0,
      intensityDescription: goal === 'HYPERTROPHY' 
        ? '70% 1RM' 
        : goal === 'ENDURANCE' 
          ? '55% - 60% 1RM (轻负荷)' 
          : goal === 'STRENGTH' 
            ? '82.5% - 85% 1RM' 
            : experienceLevel === 'BEGINNER' ? '55% 1RM (轻量爆发)' : '75% 1RM',
      repsDescription: goal === 'HYPERTROPHY' 
        ? '10 - 12 次' 
        : goal === 'ENDURANCE' 
          ? '15 - 20 次' 
          : goal === 'STRENGTH' 
            ? '5 - 6 次' 
            : '3 - 5 次',
      restDescription: goal === 'HYPERTROPHY' 
        ? '60 - 75 秒' 
        : goal === 'ENDURANCE' 
          ? '≤ 30 秒 (短间歇)' 
          : '2 - 3 分钟',
      coachTips: [
        goal === 'ENDURANCE' 
          ? '保持持续张力（2-0-2节奏），顶峰不借力停顿，组间休息严守 30 秒倒计时。'
          : '严格遵守动作要领与离心控制（2-3秒离心），切忌盲目追求绝对重量。',
        '建立腹内压（Valsalva 呼吸法），每次下沉前收紧核心。',
        ...(isBeginnerAdapted ? ['【NSCA 初学者特别保护】初学者已自动降级高风险动作（如用药球砸投/哑铃跳推替换杠铃高翻），注重本体感觉建立。'] : []),
      ],
      dailyWorkouts: generateDailyWorkouts(goal, weeklyDays, 1, experienceLevel),
    },
    {
      weekNumber: 2,
      weekName: '第 2 周：渐进负荷阶梯递增周 (Progressive Overload Escalation)',
      phaseGoal: goal === 'ENDURANCE'
        ? '在保持高重复次数的前提下微增负荷至 62% 1RM，缩短组间喘息时间。'
        : '执行 NSCA 渐进超负荷，在大复合动作上加重 2.5-5kg，RPE 提升至 8-8.5。',
      volumeMultiplier: 1.1,
      intensityDescription: goal === 'HYPERTROPHY' 
        ? '75% - 77% 1RM' 
        : goal === 'ENDURANCE' 
          ? '60% - 63% 1RM' 
          : goal === 'STRENGTH' 
            ? '87.5% 1RM' 
            : experienceLevel === 'BEGINNER' ? '60% 1RM' : '80% 1RM',
      repsDescription: goal === 'HYPERTROPHY' 
        ? '8 - 10 次' 
        : goal === 'ENDURANCE' 
          ? '14 - 16 次' 
          : goal === 'STRENGTH' 
            ? '4 - 5 次' 
            : '3 次',
      restDescription: goal === 'HYPERTROPHY' 
        ? '75 - 90 秒' 
        : goal === 'ENDURANCE' 
          ? '25 - 30 秒' 
          : '3 分钟',
      coachTips: [
        goal === 'ENDURANCE'
          ? '深长呼气维持抗乳酸耐受，后半程保持动作轨迹不散架。'
          : '开始监测最后一组是否能超出目标 2 次，为下周期评估 2-for-2 法则收集数据。',
        '保持向心阶段最大主观意图发力速度（Maximal Intent to Accelerate）。',
        ...(weeklyDays > 3 && experienceLevel === 'BEGINNER' ? ['【高频恢复预警】检测睡眠质量与晨起脉搏，若有迟发性酸痛持续超48小时需主动调降强度。'] : []),
      ],
      dailyWorkouts: generateDailyWorkouts(goal, weeklyDays, 2, experienceLevel),
    },
    {
      weekNumber: 3,
      weekName: '第 3 周：超量负荷峰值周 (Intensity Overreaching Peak)',
      phaseGoal: goal === 'ENDURANCE'
        ? '达到肌耐力负荷上限 (65-67% 1RM)，挑战高心率与极度充血下的肌肉做功持久度。'
        : '达到本周期强度最高点，RPE 9-9.5，挑战神经极限与最大肌纤维募集。',
      volumeMultiplier: 1.15,
      intensityDescription: goal === 'HYPERTROPHY' 
        ? '80% - 82.5% 1RM' 
        : goal === 'ENDURANCE' 
          ? '65% - 67% 1RM (耐力负荷峰值)' 
          : goal === 'STRENGTH' 
            ? '90% - 93% 1RM' 
            : experienceLevel === 'BEGINNER' ? '65% 1RM' : '85% - 90% 1RM',
      repsDescription: goal === 'HYPERTROPHY' 
        ? '6 - 8 次' 
        : goal === 'ENDURANCE' 
          ? '12 - 15 次 (逼近乳酸耐受极值)' 
          : goal === 'STRENGTH' 
            ? '2 - 3 次' 
            : '1 - 2 次',
      restDescription: goal === 'HYPERTROPHY' 
        ? '90 秒' 
        : goal === 'ENDURANCE' 
          ? '20 - 30 秒 (极限代谢堆积)' 
          : '3 - 5 分钟',
      coachTips: [
        goal === 'ENDURANCE'
          ? '最后一组推向深度泵感极限，但坚决避免因疲劳产生借力代偿。'
          : '若保护员在场，可在最后一组冲击高强度复合动作真实表现。',
        '严防技术动作形变（如膝内扣、腰椎失稳），任何动作变形即刻停组。',
        ...(isBeginnerAdapted ? ['【技术形变零容忍】初学者在峰值周仍应保留至少 2-3 次储备（2-3 RIR），严禁盲目冲击力竭。'] : []),
      ],
      dailyWorkouts: generateDailyWorkouts(goal, weeklyDays, 3, experienceLevel),
    },
    {
      weekNumber: 4,
      weekName: '第 4 周：NSCA 科学减载与超量恢复周 (Deload & Supercompensation)',
      phaseGoal: '消除中枢神经疲劳与结缔组织微创伤，总组数削减 40-50%，强度维持在 50-70%，促进超量恢复。',
      volumeMultiplier: 0.6,
      intensityDescription: goal === 'ENDURANCE' ? '50% 1RM (轻量排酸)' : '65% - 70% 1RM (轻量快速移动)',
      repsDescription: goal === 'ENDURANCE' ? '10 - 12 次 (轻度充血)' : '5 - 8 次 (远离力竭，RIR ≥ 4)',
      restDescription: goal === 'ENDURANCE' ? '45 - 60 秒 (充沛排酸)' : '充沛休息 (2 分钟)',
      coachTips: [
        '减载不是停练，而是让神经系统和肌腱韧带修复滑液，为下一个高阶周期做准备。',
        '重点关注关节活动度与软组织滚轴放松。',
      ],
      dailyWorkouts: generateDailyWorkouts(goal, weeklyDays, 4, experienceLevel),
    },
  ];

  const goalName = goal === 'HYPERTROPHY' 
    ? '纯肌肥大增肌构建周期 (Hypertrophy)' 
    : goal === 'ENDURANCE'
      ? '肌耐力与抗疲劳氧化周期 (Muscular Endurance)'
      : goal === 'STRENGTH' 
        ? '最大神经力量突破周期 (Maximal Strength)' 
        : isBeginnerAdapted 
          ? '爆发动力学入门与减速缓冲准备周期 (初学者特调版)' 
          : '功率与爆发力转化周期 (Power)';
  const levelName = experienceLevel === 'BEGINNER' ? '初学者 (Novice)' : experienceLevel === 'INTERMEDIATE' ? '中级运动员 (Intermediate)' : '高级进阶 (Advanced)';

  const safetyWarning = validation.hasConflict 
    ? validation.conflicts.map(c => c.title + ': ' + c.description).join(' | ') 
    : undefined;

  return {
    id: `plan-${Date.now()}`,
    title: `NSCA-CSCS 4周 ${goalName} (${weeklyDays}天/周 - ${levelName})`,
    goal,
    weeklyDays,
    experienceLevel,
    createdAt: new Date().toLocaleDateString('zh-CN'),
    safetyWarning,
    isBeginnerAdapted,
    nscaParameters: {
      intensity,
      repsPerSet,
      restPeriod,
      setsPerExercise,
      frequencyAdvice,
    },
    weeks,
  };
}

/**
 * 根据每周天数及目标生成对应的科学分化训次
 * 严格遵循 NSCA 动作排序准则：
 * 爆发力 -> 核心大复合 -> 辅助单侧/次肌群 -> 核心抗旋转/抗伸展
 */
function generateDailyWorkouts(
  goal: TrainingGoal, 
  weeklyDays: number, 
  weekNumber: number,
  experienceLevel: ExperienceLevel = 'INTERMEDIATE'
): DayWorkout[] {
  const isDeload = weekNumber === 4;
  const isBeginner = experienceLevel === 'BEGINNER';
  const setModifier = isDeload ? -1 : weekNumber === 3 ? 1 : 0;
  // 初学者严格控制做功组数，肌耐力遵循 NSCA 2-3 组规范，最大力量 4 组
  const baseSets = goal === 'ENDURANCE' ? (isBeginner ? 2 : 3) : isBeginner ? 3 : goal === 'STRENGTH' ? 4 : 3;
  const currentSets = Math.max(2, baseSets + setModifier);

  const getRepsText = (standard: string) => {
    if (isDeload) {
      return goal === 'ENDURANCE' ? '10-12次 (轻量排酸)' : '6-8次 (减载轻松组)';
    }
    if (goal === 'ENDURANCE') {
      return weekNumber === 1 ? '15-20次' : weekNumber === 2 ? '14-16次' : '12-15次';
    }
    if (goal === 'HYPERTROPHY') {
      return weekNumber === 1 ? '10-12次' : weekNumber === 2 ? '8-10次' : '6-8次';
    }
    if (goal === 'STRENGTH') {
      return weekNumber === 1 ? '5次' : weekNumber === 2 ? '4次' : '2-3次';
    }
    return weekNumber === 1 ? '4-5次' : weekNumber === 2 ? '3次' : '1-2次';
  };

  const getIntensityText = () => {
    if (isDeload) {
      return goal === 'ENDURANCE' ? '50% 1RM' : '65% 1RM';
    }
    if (goal === 'ENDURANCE') {
      return weekNumber === 1 ? '55-60% 1RM' : weekNumber === 2 ? '60-63% 1RM' : '65-67% 1RM';
    }
    if (goal === 'HYPERTROPHY') {
      return weekNumber === 1 ? '70% 1RM' : weekNumber === 2 ? '77% 1RM' : '82.5% 1RM';
    }
    if (goal === 'STRENGTH') {
      return weekNumber === 1 ? '85% 1RM' : weekNumber === 2 ? '88% 1RM' : '92.5% 1RM';
    }
    return weekNumber === 1 ? '75% 1RM' : weekNumber === 2 ? '80% 1RM' : '87.5% 1RM';
  };

  const restText = goal === 'ENDURANCE'
    ? (isDeload ? '45s' : '≤30s (高密度耐力间歇)')
    : goal === 'HYPERTROPHY'
      ? (isDeload ? '90s' : '60-75s (代谢应激区间)')
      : '2.5-3.5分钟';

  // 爆发力动作安全分级：初学者使用低风险动力学动作，中高级使用经典高翻/挺举
  const getPowerExercise = (type: 'CLEAN' | 'JERK' | 'SNATCH_PULL') => {
    if (isBeginner) {
      if (type === 'CLEAN') {
        return {
          name: '药球对地爆发砸投 (Medicine Ball Slam)',
          category: 'POWER' as const,
          sets: Math.max(2, currentSets - 1),
          reps: '5次',
          intensity: '快速向心爆发',
          rest: '90s',
          notes: '【初学者安全动力学】训练三关节伸展与核心爆发下压，去除杠铃砸腕与翻接代偿',
        };
      }
      if (type === 'JERK') {
        return {
          name: '哑铃爆发推举 (Dumbbell Push Press)',
          category: 'POWER' as const,
          sets: Math.max(2, currentSets - 1),
          reps: '5次',
          intensity: '轻中负荷',
          rest: '90s',
          notes: '【初学者动力传导】利用浅屈膝弹性向上传导力量，肩部垂直锁定，负荷受控',
        };
      }
      return {
        name: '箱式深蹲跳与软着陆 (Box Jump with Soft Landing)',
        category: 'POWER' as const,
        sets: 3,
        reps: '4-5次',
        intensity: '自重爆发',
        rest: '90s',
        notes: '【初学者神经减速吸收】注重落地屈膝屈髋消音缓冲（Deceleration），保护膝盖',
      };
    }

    // 中高级运动员使用 NSCA 经典杠铃爆发力
    if (type === 'CLEAN') {
      return {
        name: '高翻 (Power Clean)',
        category: 'POWER' as const,
        sets: Math.max(2, currentSets - 1),
        reps: '3次',
        intensity: '75-80% 1RM',
        rest: '2-3分钟',
        notes: 'NSCA 首位动作：利用三重伸展爆发拉起',
      };
    }
    if (type === 'JERK') {
      return {
        name: '挺举推力 (Push Jerk)',
        category: 'POWER' as const,
        sets: Math.max(2, currentSets - 1),
        reps: '3次',
        intensity: '75-80% 1RM',
        rest: '2-3分钟',
        notes: '屈膝快速蹬伸，手肘过头顶锁定',
      };
    }
    return {
      name: '宽握高拉 (Snatch High Pull)',
      category: 'POWER' as const,
      sets: 3,
      reps: '3次',
      intensity: '80% 1RM',
      rest: '2.5分钟',
      notes: '爆发性伸髋，手肘高抬',
    };
  };

  // 2 天分化：全身 A / 全身 B
  if (weeklyDays === 2) {
    return [
      {
        dayName: 'Day 1 (周二)',
        theme: '全身复合力量 A (下肢推 + 上肢推 + 后链)',
        exercises: [
          ...(goal === 'POWER' ? [getPowerExercise('CLEAN')] : []),
          {
            name: '杠铃后深蹲 (Barbell Back Squat)',
            category: 'LOWER_PUSH' as const,
            sets: currentSets,
            reps: getRepsText('8'),
            intensity: getIntensityText(),
            rest: restText,
            notes: '核心下肢推：大腿上表面低于膝关节，腹内压保持',
          },
          {
            name: '杠铃平卧推 (Barbell Bench Press)',
            category: 'UPPER_PUSH' as const,
            sets: currentSets,
            reps: getRepsText('8'),
            intensity: getIntensityText(),
            rest: restText,
            notes: 'NSCA 五点接触法，双脚踩实，大臂夹角 45-70 度',
          },
          {
            name: '罗马尼亚硬拉 (RDL)',
            category: 'LOWER_PULL' as const,
            sets: Math.max(2, currentSets - 1),
            reps: '8-10次',
            intensity: '70% 1RM',
            rest: '90s',
            notes: '后侧链离心负荷：微屈膝后推髋，脊柱中立',
          },
          {
            name: '帕洛夫推举 (Pallof Press)',
            category: 'CORE' as const,
            sets: 3,
            reps: '10次/侧 (顶峰维持2秒)',
            intensity: '中等抗旋转阻力',
            rest: '60s',
            notes: '抗扭转力矩稳定，盆骨胸腔保持正前方',
          },
        ],
      },
      {
        dayName: 'Day 2 (周五)',
        theme: '全身复合力量 B (下肢拉 + 上肢垂直推/拉)',
        exercises: [
          ...(goal === 'POWER' ? [getPowerExercise('JERK')] : []),
          {
            name: '传统杠铃硬拉 (Conventional Deadlift)',
            category: 'LOWER_PULL' as const,
            sets: currentSets,
            reps: getRepsText('5'),
            intensity: getIntensityText(),
            rest: restText,
            notes: '下肢主导蹬地，过膝后强力伸髋夹臀，严禁腰椎超伸',
          },
          {
            name: '站姿杠铃推举 (Overhead Press)',
            category: 'UPPER_PUSH' as const,
            sets: currentSets,
            reps: getRepsText('6'),
            intensity: getIntensityText(),
            rest: restText,
            notes: '收紧臀部与核心，头部让过杠铃后垂直向上锁定',
          },
          {
            name: '引体向上 (Strict Pull-Up)',
            category: 'UPPER_PULL' as const,
            sets: currentSets,
            reps: '6-10次 (自重或负重)',
            intensity: 'RPE 8',
            rest: '90s',
            notes: '肩胛骨先下沉后拉起，全程受控离心3秒',
          },
          {
            name: '健腹轮向前滚出 (Ab Wheel Rollout)',
            category: 'CORE' as const,
            sets: 3,
            reps: '8-10次',
            intensity: '自重抗伸展',
            rest: '60s',
            notes: '骨盆微后倾，全程严禁塌腰过伸',
          },
        ],
      },
    ];
  }

  // 3 天经典分化：上肢推拉 / 下肢动力链 / 全身重载综合
  if (weeklyDays === 3) {
    return [
      {
        dayName: 'Day 1 (周一)',
        theme: '下肢主导与后链基础 (Lower Dominant)',
        exercises: [
          ...(goal === 'POWER' ? [getPowerExercise('CLEAN')] : []),
          {
            name: '杠铃后深蹲 (Barbell Back Squat)',
            category: 'LOWER_PUSH' as const,
            sets: currentSets,
            reps: getRepsText('6'),
            intensity: getIntensityText(),
            rest: restText,
            notes: '大复合主项：下蹲深度保证股骨低于髌骨上沿',
          },
          {
            name: '罗马尼亚硬拉 (RDL)',
            category: 'LOWER_PULL' as const,
            sets: currentSets,
            reps: '8-10次',
            intensity: '70-75% 1RM',
            rest: '90s',
            notes: '腘绳肌离心张力强化，下落3秒',
          },
          {
            name: '哑铃箭步蹲 (Walking Lunge)',
            category: 'LOWER_PUSH' as const,
            sets: 3,
            reps: '10步/腿',
            intensity: '中等负重',
            rest: '60s',
            notes: '单侧下肢力量与骨盆抗侧倾平衡',
          },
          {
            name: '悬垂举腿 (Hanging Leg Raise)',
            category: 'CORE' as const,
            sets: 3,
            reps: '10-12次',
            intensity: '自重控制',
            rest: '60s',
            notes: '卷起骨盆，避免摆腿惯性',
          },
        ],
      },
      {
        dayName: 'Day 2 (周三)',
        theme: '上肢推拉力量与肩胛平衡 (Upper Push & Pull)',
        exercises: [
          {
            name: '杠铃平卧推 (Barbell Bench Press)',
            category: 'UPPER_PUSH' as const,
            sets: currentSets,
            reps: getRepsText('6'),
            intensity: getIntensityText(),
            rest: restText,
            notes: '水平推基石：肩胛骨锁紧下沉，避免肩峰撞击',
          },
          {
            name: '俯身杠铃划船 (Bent-Over Row)',
            category: 'UPPER_PULL' as const,
            sets: currentSets,
            reps: getRepsText('8'),
            intensity: getIntensityText(),
            rest: restText,
            notes: '水平拉对抗：手肘紧贴体侧，顶峰用力挤压肩胛骨',
          },
          {
            name: '站姿杠铃推举 (Overhead Press)',
            category: 'UPPER_PUSH' as const,
            sets: Math.max(2, currentSets - 1),
            reps: '6-8次',
            intensity: '75% 1RM',
            rest: '2分钟',
            notes: '垂直推：臀腹紧锁，杜绝后仰代偿',
          },
          {
            name: '引体向上 (Strict Pull-Up)',
            category: 'UPPER_PULL' as const,
            sets: Math.max(2, currentSets - 1),
            reps: '6-10次',
            intensity: '自重 / RPE 8',
            rest: '90s',
            notes: '垂直拉：全幅度下放到臂直，不甩腿',
          },
          {
            name: '帕洛夫推举 (Pallof Press)',
            category: 'CORE' as const,
            sets: 3,
            reps: '12次/侧',
            intensity: '抗旋转弹力阻力',
            rest: '45s',
            notes: '强化抗侧向扭转刚度',
          },
        ],
      },
      {
        dayName: 'Day 3 (周五)',
        theme: '全身重载与后侧链爆发 (Full Body Peak & Post Chain)',
        exercises: [
          ...(goal === 'POWER' ? [getPowerExercise('SNATCH_PULL')] : []),
          {
            name: '传统杠铃硬拉 (Conventional Deadlift)',
            category: 'LOWER_PULL' as const,
            sets: currentSets,
            reps: getRepsText('5'),
            intensity: getIntensityText(),
            rest: restText,
            notes: '后侧动力链巅峰：足中蹬地，膝盖微展，上身一体',
          },
          {
            name: '杠铃前深蹲 (Front Squat)',
            category: 'LOWER_PUSH' as const,
            sets: Math.max(2, currentSets - 1),
            reps: '6-8次',
            intensity: '70% 1RM',
            rest: '2分钟',
            notes: '股四头肌高刺激与胸椎竖直训练',
          },
          {
            name: '上斜哑铃卧推 (Incline DB Press)',
            category: 'UPPER_PUSH' as const,
            sets: 3,
            reps: '8-10次',
            intensity: '中高负重',
            rest: '75s',
            notes: '30度夹角，保护肩峰囊，向心顶峰微夹',
          },
          {
            name: '健腹轮向前滚出 (Ab Wheel Rollout)',
            category: 'CORE' as const,
            sets: 3,
            reps: '8-10次',
            intensity: '抗伸展自重',
            rest: '60s',
            notes: '保持骨盆后倾，严防塌腰',
          },
        ],
      },
    ];
  }

  // 4 天分化：上肢 A / 下肢 A / 上肢 B / 下肢 B (NSCA 最推崇的职业运动员上下肢分化体系)
  return [
    {
      dayName: 'Day 1 (周一)',
      theme: '上肢推拉大力量 (Upper Body Strength A)',
      exercises: [
        {
          name: '杠铃平卧推 (Barbell Bench Press)',
          category: 'UPPER_PUSH' as const,
          sets: currentSets,
          reps: getRepsText('5'),
          intensity: getIntensityText(),
          rest: restText,
          notes: '水平推核心项目：五点支撑，腿部驱动',
        },
        {
          name: '俯身杠铃划船 (Bent-Over Row)',
          category: 'UPPER_PULL' as const,
          sets: currentSets,
          reps: getRepsText('6'),
          intensity: getIntensityText(),
          rest: restText,
          notes: '水平拉对抗平衡，背阔肌与菱形肌充分挤压',
        },
        {
          name: '站姿杠铃推举 (Overhead Press)',
          category: 'UPPER_PUSH' as const,
          sets: Math.max(2, currentSets - 1),
          reps: '6-8次',
          intensity: '75% 1RM',
          rest: '2分钟',
          notes: '垂直推：核心锁死，头部回正锁定',
        },
        {
          name: '引体向上 (Strict Pull-Up)',
          category: 'UPPER_PULL' as const,
          sets: Math.max(2, currentSets - 1),
          reps: '6-10次',
          intensity: 'RPE 8',
          rest: '90s',
          notes: '垂直拉：全行程激活背部',
        },
        {
          name: '帕洛夫推举 (Pallof Press)',
          category: 'CORE' as const,
          sets: 3,
          reps: '12次/侧',
          intensity: '抗旋转阻力',
          rest: '45s',
          notes: '抵抗扭矩传导',
        },
      ],
    },
    {
      dayName: 'Day 2 (周二)',
      theme: '下肢推拉与深蹲发展 (Lower Body Strength A)',
      exercises: [
        ...(goal === 'POWER' ? [getPowerExercise('CLEAN')] : []),
        {
          name: '杠铃后深蹲 (Barbell Back Squat)',
          category: 'LOWER_PUSH' as const,
          sets: currentSets,
          reps: getRepsText('5'),
          intensity: getIntensityText(),
          rest: restText,
          notes: '下肢力量基底：深蹲深度达标，足弓三点踩实',
        },
        {
          name: '罗马尼亚硬拉 (RDL)',
          category: 'LOWER_PULL' as const,
          sets: currentSets,
          reps: '8次',
          intensity: '75% 1RM',
          rest: '90s',
          notes: '后侧动力链离心控制，保护腘绳肌',
        },
        {
          name: '哑铃箭步蹲 (Walking Lunge)',
          category: 'LOWER_PUSH' as const,
          sets: 3,
          reps: '10步/侧',
          intensity: '辅助中重',
          rest: '60s',
          notes: '单侧肌力平衡纠错',
        },
        {
          name: '健腹轮向前滚出 (Ab Wheel Rollout)',
          category: 'CORE' as const,
          sets: 3,
          reps: '10次',
          intensity: '抗伸展自重',
          rest: '60s',
          notes: '核心绷紧，不塌腰',
        },
      ],
    },
    {
      dayName: 'Day 3 (周四)',
      theme: '上肢肥大与高容量雕刻 (Upper Body Hypertrophy B)',
      exercises: [
        {
          name: '上斜哑铃卧推 (Incline DB Press)',
          category: 'UPPER_PUSH' as const,
          sets: currentSets,
          reps: '8-10次',
          intensity: '75% 1RM',
          rest: '75s',
          notes: '上胸针对性刺激，30度斜角',
        },
        {
          name: '坐姿绳索划船 (Seated Cable Row)',
          category: 'UPPER_PULL' as const,
          sets: currentSets,
          reps: '10-12次',
          intensity: '70% 1RM',
          rest: '60s',
          notes: '中背部高孤立控制，肩胛后缩锁定',
        },
        {
          name: '杠铃平卧推 (Barbell Bench Press)',
          category: 'UPPER_PUSH' as const,
          sets: 3,
          reps: '8-10次',
          intensity: '70% 1RM (节奏控制组 3-0-1-0)',
          rest: '75s',
          notes: '注重离心3秒受控与代谢累积',
        },
        {
          name: '悬垂举腿 (Hanging Leg Raise)',
          category: 'CORE' as const,
          sets: 3,
          reps: '12次',
          intensity: '自重',
          rest: '45s',
          notes: '下腹屈曲骨盆后卷',
        },
      ],
    },
    {
      dayName: 'Day 4 (周五)',
      theme: '下肢硬拉峰值与爆发后链 (Lower Body Pull & Hinge B)',
      exercises: [
        ...(goal === 'POWER' ? [getPowerExercise('JERK')] : []),
        {
          name: '传统杠铃硬拉 (Conventional Deadlift)',
          category: 'LOWER_PULL' as const,
          sets: currentSets,
          reps: getRepsText('5'),
          intensity: getIntensityText(),
          rest: restText,
          notes: '全身后侧大复合：锁定伸髋，紧贴小腿',
        },
        {
          name: '杠铃前深蹲 (Front Squat)',
          category: 'LOWER_PUSH' as const,
          sets: currentSets,
          reps: '6-8次',
          intensity: '72.5% 1RM',
          rest: '90s',
          notes: '直躯干伸膝强化',
        },
        {
          name: '杠铃臀推 (Barbell Hip Thrust)',
          category: 'LOWER_PULL' as const,
          sets: 3,
          reps: '10-12次',
          intensity: '75% 1RM',
          rest: '75s',
          notes: '顶峰用力夹紧臀大肌维持1秒',
        },
        {
          name: '帕洛夫推举 (Pallof Press)',
          category: 'CORE' as const,
          sets: 3,
          reps: '12次/侧',
          intensity: '抗旋转阻力',
          rest: '45s',
          notes: '保持躯干稳定抗扭转',
        },
      ],
    },
  ];
}
