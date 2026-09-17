/**
 * NSCA 运动科学计算公式与运动生理学逻辑核心库
 * 
 * 包含：
 * 1. Brzycki 1RM 预测公式（NSCA 官方推荐的最大力量推算方法）
 * 2. NSCA 负荷百分比与重复次数（%1RM - Repetitions）权威对照表
 * 3. RPE 自感用力度与 RIR (Reps In Reserve 储备次数) 换算体系
 * 4. NSCA "2-for-2" 渐进超负荷增重准则
 */

/**
 * 【NSCA 核心计算逻辑】Brzycki 公式计算预估 1RM (One-Rep Max)
 * 
 * 数学公式：
 * 1RM = Weight / (1.0278 - (0.0278 * Reps))
 * 
 * 科学依据与生理学原理解释（NSCA-CSCS 认证指南）：
 * 1. Matt Brzycki (1993) 提出的该公式是力量体能训练中最经典、验证最充分的亚极量 (Submaximal) 负荷推算公式之一。
 * 2. 精准度区间：当 Reps（完成次数）在 1 ~ 10 次以内时，公式预测精度极高（相关系数 r > 0.95）。
 *    因为 1-10 次主要动用磷酸原系统 (ATP-CP) 及快速糖酵解系统，神经系统高阈值运动单位 (High-threshold Motor Units) 充分动员。
 * 3. 当 Reps > 10 次时，机体转入高乳酸耐受与无氧耐力主导，力量衰竭主因包含局部酸中毒和代谢废物堆积，
 *    而非纯粹的神经-肌肉最大募集力竭，因此会产生非线性偏移。
 * 4. 特殊边界处理：
 *    - 当 Reps === 1 时，实测即为当下极限，1RM 直接取重量自身。
 *    - 当 Reps <= 0 或 Weight <= 0 时，返回 0。
 *    - 结果保留 1 位小数，符合实际杠铃片调节精度。
 * 
 * @param weightKg 举起的实际重量（kg）
 * @param reps 规范完成的极限次数
 * @returns 预估的 1RM 最大单次重量（kg）
 */
export function calculateBrzycki1RM(weightKg: number, reps: number): number {
  if (!weightKg || weightKg <= 0 || !reps || reps <= 0) {
    return 0;
  }

  // 单次极限直接等于实测重量
  if (reps === 1) {
    return Math.round(weightKg * 10) / 10;
  }

  // Brzycki 核心数学公式
  const denominator = 1.0278 - (0.0278 * reps);
  
  // 防御除以极小数或负数（若输入超大次数）
  if (denominator <= 0.1) {
    // 超过30次时给予合理的耐力折算上限
    return Math.round((weightKg * (1 + reps / 30)) * 10) / 10;
  }

  const estimated1RM = weightKg / denominator;
  return Math.round(estimated1RM * 10) / 10;
}

/**
 * NSCA 经典 %1RM 与最高重复次数对应表 (NSCA Essentials Table 17.6)
 * 揭示肌肉在不同强度下的代谢与神经输出能力
 */
export const NSCA_LOAD_CHART = [
  { percent: 100, reps: 1,  zone: '神经最大募集', desc: '绝对最大力量' },
  { percent: 95,  reps: 2,  zone: '极高强度力量', desc: '重载突破' },
  { percent: 93,  reps: 3,  zone: '高强度纯力量', desc: '力量期常规上限' },
  { percent: 90,  reps: 4,  zone: '高强度纯力量', desc: '力量爆发过渡' },
  { percent: 87,  reps: 5,  zone: '纯力量黄金期', desc: 'NSCA 力量标准' },
  { percent: 85,  reps: 6,  zone: '力量/肥大交界', desc: '强度下限 / 肥大上限' },
  { percent: 80,  reps: 8,  zone: '功能性肌肥大', desc: '肌肥大黄金次数' },
  { percent: 77,  reps: 9,  zone: '功能性肌肥大', desc: '容量累积' },
  { percent: 75,  reps: 10, zone: '肌肥大/代谢压力', desc: '经典增肌区间' },
  { percent: 70,  reps: 11, zone: '肌肥大/肌耐力', desc: '泵感与糖原耗竭' },
  { percent: 67,  reps: 12, zone: '肌肥大耐力下限', desc: 'NSCA 肥大期下界' },
  { percent: 65,  reps: 15, zone: '局部肌耐力', desc: '毛细血管密度与耐力' },
];

/**
 * 根据预估 1RM 生成各目标强度的训练重量推荐表
 */
export function getLoadTableFor1RM(oneRM: number) {
  if (oneRM <= 0) return [];
  return NSCA_LOAD_CHART.map(item => ({
    ...item,
    recommendedWeight: Math.round((oneRM * (item.percent / 100)) * 2) / 2, // 以 0.5kg 为步进
  }));
}

/**
 * RPE (Rate of Perceived Exertion) 与 RIR (Reps in Reserve 储备次数) 权威对照表
 * NSCA-CSCS 建议将主观疲劳与客观负荷结合以优化自律调节 (Autoregulation)
 */
export interface RpeInfo {
  score: number;
  rir: string;
  name: string;
  description: string;
  color: string;
}

export const RPE_SCALE: RpeInfo[] = [
  { score: 10, rir: '0 RIR', name: '极限力竭', description: '无法再完成 1 次，动作已处于极限拼搏状态', color: '#EF4444' },
  { score: 9.5, rir: '0-1 RIR', name: '极接近极限', description: '无法再做完整 1 次，但或许能稍微增加点重量', color: '#F97316' },
  { score: 9, rir: '1 RIR', name: '尚存 1 次储备', description: '拼尽全力只能再完成 1 次严格规范动作', color: '#FBBF24' },
  { score: 8.5, rir: '1-2 RIR', name: '尚存 1-2 次', description: '很有把握再做 1 次，拼搏或许可做 2 次', color: '#EAB308' },
  { score: 8, rir: '2 RIR', name: '尚存 2 次储备', description: '动作保持高度爆发力，确认还能规范完成 2 次', color: '#84CC16' },
  { score: 7.5, rir: '2-3 RIR', name: '良好速度与控制', description: '杠铃速度明显，尚有 2-3 次储备', color: '#22C55E' },
  { score: 7, rir: '3 RIR', name: '中等强度热身/过渡', description: '还能做 3 次，动作节奏非常流畅轻松', color: '#10B981' },
  { score: 6, rir: '4+ RIR', name: '轻度负荷', description: '热身组或速度/技巧练习组，无明显疲劳积累', color: '#06B6D4' },
  { score: 5, rir: '极轻', name: '准备活动', description: '轻度肌肉激活，无负荷压力', color: '#64748B' },
];

/**
 * NSCA "2-for-2" 渐进超负荷加重准则判定
 * 
 * 原则定义：
 * 当运动员在某特定动作连续两周训练课的最后一组中，均能超过规定次数完成 2 次以上时，
 * 则说明神经肌肉系统已经产生积极适应，应执行下阶段渐进超负荷增重：
 * - 上肢小肌群/单关节动作：增加 1.25 ~ 2.5 kg (2.5 ~ 5 lbs)
 * - 下肢大肌群/复合核心动作：增加 2.5 ~ 5.0 kg (5 ~ 10 lbs)
 */
export function evaluate2for2Rule(
  category: string,
  extraRepsAchieved: number,
  consecutiveSessions: number
): { canIncrease: boolean; recommendation: string; weightIncrement: string } {
  const isLowerBody = category === 'LOWER_PUSH' || category === 'LOWER_PULL';
  
  if (extraRepsAchieved >= 2 && consecutiveSessions >= 2) {
    const increment = isLowerBody ? '2.5 - 5.0 kg' : '1.25 - 2.5 kg';
    return {
      canIncrease: true,
      recommendation: `已达成 NSCA "2-for-2" 进阶法则！建议在下周同一动作训练中直接提升负荷 ${increment}。`,
      weightIncrement: increment,
    };
  }

  return {
    canIncrease: false,
    recommendation: `未满足 2-for-2 法则（需要连续两周的最后一组均超出计划目标 >=2 次），建议保持当前重量打磨技术规范与向心动作速度。`,
    weightIncrement: '0 kg (维持当前重量)',
  };
}
