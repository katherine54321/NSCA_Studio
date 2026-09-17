/**
 * NSCA 体系核心数据类型与枚举定义
 * 基于 NSCA-CSCS (National Strength and Conditioning Association - Certified Strength and Conditioning Specialist) 科学标准
 */

export type NSCACategory = 
  | 'POWER'        // 爆发力 (Power / Olympic lifts)
  | 'LOWER_PUSH'   // 下肢推 (Lower Body Push)
  | 'LOWER_PULL'   // 下肢拉 (Lower Body Pull)
  | 'UPPER_PUSH'   // 上肢推 (Upper Body Push)
  | 'UPPER_PULL'   // 上肢拉 (Upper Body Pull)
  | 'CORE';        // 核心 (Core)

export interface NSCACategoryMeta {
  key: NSCACategory;
  name: string;
  enName: string;
  description: string;
  nscaPriorityOrder: number; // NSCA 训练动作排序原则：1-爆发力 -> 2-下肢复合 -> 3-上肢大复合 -> 4-辅助动作 -> 5-核心
  accentColor: string;
}

export interface Exercise {
  id: string;
  name: string;
  enName: string;
  category: NSCACategory;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  executionCues: string[]; // NSCA 规范动作要领
  commonErrors: string[];  // 常见生物力学错误与损伤隐患
  orderRecommendation: string; // NSCA 课表内安排建议
  breathingCue: string; // 呼吸与瓦式呼吸法（Valsalva Maneuver）指导
}

export interface TrainingLogEntry {
  id: string;
  timestamp: number;
  dateStr: string;
  exerciseId: string;
  exerciseName: string;
  category: NSCACategory;
  weightKg: number;
  reps: number;
  rpe: number; // 1-10 自感用力度 (Rate of Perceived Exertion)
  estimated1RM: number; // Brzycki 公式计算得出的 1RM (kg)
  notes?: string;
  isSample?: boolean;
}

export type TrainingGoal = 'HYPERTROPHY' | 'ENDURANCE' | 'STRENGTH' | 'POWER';

export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface DayWorkout {
  dayName: string;
  theme: string;
  exercises: {
    name: string;
    category: NSCACategory;
    sets: number;
    reps: string;
    intensity: string; // 如 "75-80% 1RM"
    rest: string;      // 如 "60-90s"
    notes: string;
  }[];
}

export interface MicrocycleWeek {
  weekNumber: number;
  weekName: string;
  phaseGoal: string;
  volumeMultiplier: number;
  intensityDescription: string;
  repsDescription: string;
  restDescription: string;
  dailyWorkouts: DayWorkout[];
  coachTips: string[];
}

export interface NSCAConflictItem {
  id: string;
  type: 'FREQUENCY_OVERLOAD' | 'POWER_PREMATURE' | 'COMPOUND_RISK';
  title: string;
  severity: 'WARNING' | 'CRITICAL';
  description: string;
  nscaStandard: string;
  suggestedActions: {
    label: string;
    actionType: 'SET_DAYS_3' | 'SET_LEVEL_INTERMEDIATE' | 'SET_GOAL_HYPERTROPHY' | 'SET_GOAL_ENDURANCE' | 'SET_GOAL_STRENGTH' | 'APPLY_SAFE_COMBO';
  }[];
}

export interface NSCAValidationResult {
  hasConflict: boolean;
  severity: 'SAFE' | 'WARNING' | 'CRITICAL';
  conflicts: NSCAConflictItem[];
}

export interface PeriodizationPlan {
  id: string;
  title: string;
  goal: TrainingGoal;
  weeklyDays: number;
  experienceLevel: ExperienceLevel;
  createdAt: string;
  safetyWarning?: string;
  isBeginnerAdapted?: boolean;
  nscaParameters: {
    intensity: string;
    repsPerSet: string;
    restPeriod: string;
    setsPerExercise: string;
    frequencyAdvice: string;
  };
  weeks: MicrocycleWeek[];
}
