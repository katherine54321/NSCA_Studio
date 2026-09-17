import React, { useState } from 'react';
import { Exercise, NSCACategory } from '../types/nsca';
import { NSCA_CATEGORIES, NSCA_EXERCISES } from '../data/exercises';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Wind, 
  Layers, 
  Zap, 
  PlusCircle, 
  Info,
  ChevronRight
} from 'lucide-react';

interface ExerciseLibraryProps {
  onSelectForLogging: (exercise: Exercise) => void;
}

export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ onSelectForLogging }) => {
  const [selectedCategory, setSelectedCategory] = useState<NSCACategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeExerciseId, setActiveExerciseId] = useState<string>(NSCA_EXERCISES[0].id);
  const [mobileTab, setMobileTab] = useState<'list' | 'detail'>('list');

  // 过滤动作列表
  const filteredExercises = NSCA_EXERCISES.filter((ex) => {
    const matchesCategory = selectedCategory === 'ALL' || ex.category === selectedCategory;
    const matchesSearch = 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.enName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.primaryMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeExercise = NSCA_EXERCISES.find(ex => ex.id === activeExerciseId) || NSCA_EXERCISES[0];
  const activeCategoryMeta = NSCA_CATEGORIES.find(c => c.key === activeExercise.category);

  const handleSelectExercise = (id: string) => {
    setActiveExerciseId(id);
    setMobileTab('detail');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 顶部科学原则与说明栏 */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30 font-mono-tech">
              NSCA STANDARD EXERCISES
            </span>
            <span className="text-zinc-400 text-xs hidden sm:inline">6 大科学动力链分类体系</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            NSCA 规范动作指导与生物力学解析库
          </h2>
          <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
            严格遵循 NSCA 训次排序原则：爆发力 → 大肌群多关节复合推拉 → 辅助单关节 → 核心
          </p>
        </div>

        {/* 快速搜索框 */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            id="exercise-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索动作、肌群、器械..."
            className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
            >
              清空
            </button>
          )}
        </div>
      </div>

      {/* NSCA 6 大分类过滤芯片 (移动端横向丝滑滑块) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        <button
          id="cat-filter-all"
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 ${
            selectedCategory === 'ALL'
              ? 'bg-zinc-100 text-black font-semibold'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white'
          }`}
        >
          <span>全部 ({NSCA_EXERCISES.length})</span>
        </button>

        {NSCA_CATEGORIES.map((cat) => {
          const count = NSCA_EXERCISES.filter(e => e.category === cat.key).length;
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              id={`cat-filter-${cat.key}`}
              onClick={() => setSelectedCategory(cat.key)}
              style={{
                borderColor: isSelected ? cat.accentColor : undefined,
                color: isSelected ? cat.accentColor : undefined,
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-1.5 active:scale-95 ${
                isSelected
                  ? 'bg-zinc-850 shadow-sm font-semibold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <span 
                className="w-2 h-2 rounded-full inline-block shrink-0" 
                style={{ backgroundColor: cat.accentColor }} 
              />
              <span>{cat.name}</span>
              <span className="text-[10px] opacity-70 font-mono-tech">({count})</span>
            </button>
          );
        })}
      </div>

      {/* 手机端专用分段视图切换器 (仅在手机/平板小屏幕呈现，桌面端并列展示) */}
      <div className="flex lg:hidden bg-zinc-900 p-1 rounded-xl border border-zinc-800">
        <button
          id="mobile-view-list-btn"
          onClick={() => setMobileTab('list')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            mobileTab === 'list'
              ? 'bg-zinc-800 text-white shadow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          动作列表 ({filteredExercises.length})
        </button>
        <button
          id="mobile-view-detail-btn"
          onClick={() => setMobileTab('detail')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'detail'
              ? 'bg-[#39FF14] text-black shadow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span>动作详解</span>
          <span className="text-[10px] opacity-80 font-mono-tech truncate max-w-[120px]">
            · {activeExercise.name}
          </span>
        </button>
      </div>

      {/* 主展示区：左侧动作卡片列表 + 右侧 NSCA 深度生物力学解析面板 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧动作选择卡片 (移动端受 mobileTab 控制，桌面端始终显示) */}
        <div className={`lg:col-span-5 space-y-2.5 max-h-[780px] overflow-y-auto pr-1 ${
          mobileTab === 'detail' ? 'hidden lg:block' : 'block'
        }`}>
          {filteredExercises.length === 0 ? (
            <div className="p-8 text-center bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 text-sm">
              没有找到匹配 &ldquo;{searchQuery}&rdquo; 的 NSCA 动作。
            </div>
          ) : (
            filteredExercises.map((ex) => {
              const isSelected = ex.id === activeExercise.id;
              const catMeta = NSCA_CATEGORIES.find(c => c.key === ex.category);

              return (
                <div
                  key={ex.id}
                  id={`exercise-card-${ex.id}`}
                  onClick={() => handleSelectExercise(ex.id)}
                  style={{
                    borderLeftColor: isSelected ? catMeta?.accentColor : 'transparent',
                  }}
                  className={`p-3.5 sm:p-4 rounded-xl cursor-pointer transition-all border-l-4 border active:scale-[0.99] ${
                    isSelected
                      ? 'bg-zinc-900 border-zinc-700 shadow-md ring-1 ring-zinc-700/60'
                      : 'bg-zinc-950/70 border-zinc-850 hover:bg-zinc-900/60 hover:border-zinc-750'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-[10px] font-mono-tech px-2 py-0.5 rounded font-medium border"
                          style={{
                            color: catMeta?.accentColor,
                            backgroundColor: `${catMeta?.accentColor}15`,
                            borderColor: `${catMeta?.accentColor}35`
                          }}
                        >
                          {catMeta?.name}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono-tech">
                          PRIORITY #{catMeta?.nscaPriorityOrder}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-base mt-1.5 flex items-center gap-1.5">
                        {ex.name}
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono-tech tracking-tight">
                        {ex.enName}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                      <span className="hidden sm:inline lg:hidden text-[11px]">查看技术</span>
                      <ChevronRight 
                        className={`w-5 h-5 transition-transform ${
                          isSelected ? 'text-[#39FF14] translate-x-1' : 'text-zinc-600'
                        }`} 
                      />
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] text-zinc-400">原动肌:</span>
                    {ex.primaryMuscles.slice(0, 3).map((muscle, idx) => (
                      <span key={idx} className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                        {muscle}
                      </span>
                    ))}
                    {ex.primaryMuscles.length > 3 && (
                      <span className="text-[10px] text-zinc-500 font-mono-tech">
                        +{ex.primaryMuscles.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 右侧：NSCA 规范生物力学指导与动作要领详解 (移动端受 mobileTab 控制，桌面端始终显示) */}
        <div className={`lg:col-span-7 ${
          mobileTab === 'list' ? 'hidden lg:block' : 'block'
        }`}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 lg:sticky lg:top-24 space-y-5 sm:space-y-6">
            {/* 手机端便捷返回动作列表按钮 */}
            <div className="lg:hidden flex items-center justify-between pb-2 border-b border-zinc-800">
              <button
                onClick={() => setMobileTab('list')}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 py-1"
              >
                <span>← 返回动作列表</span>
              </button>
              <span className="text-[10px] font-mono-tech text-zinc-500">
                NSCA BIOMECHANICS
              </span>
            </div>

            {/* 动作头部信息 */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3.5 pb-4 border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-xs font-mono-tech px-2.5 py-1 rounded font-semibold border"
                    style={{
                      color: activeCategoryMeta?.accentColor,
                      backgroundColor: `${activeCategoryMeta?.accentColor}15`,
                      borderColor: `${activeCategoryMeta?.accentColor}40`
                    }}
                  >
                    动力链：{activeCategoryMeta?.name}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono-tech">
                    器械：{activeExercise.equipment}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-2">
                  {activeExercise.name}
                </h3>
                <p className="text-xs text-zinc-400 font-mono-tech">
                  {activeExercise.enName}
                </p>
              </div>

              {/* 一键导入数据记录按钮 */}
              <button
                id="btn-log-this-exercise"
                onClick={() => onSelectForLogging(activeExercise)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-lg bg-[#39FF14] text-black font-semibold text-xs tracking-wider uppercase transition-all hover:bg-[#32e012] hover:shadow-lg glow-neon-green active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>记这一组数据</span>
              </button>
            </div>

            {/* NSCA 训次安排建议 */}
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-3.5 text-xs flex items-start gap-2.5 text-zinc-300">
              <Info className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#00E5FF]">NSCA 课表排序准则：</span>
                <span className="ml-1">{activeExercise.orderRecommendation}</span>
              </div>
            </div>

            {/* 原动肌群与协同肌群 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-850">
                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mb-1.5 font-medium">
                  <Layers className="w-3.5 h-3.5 text-[#39FF14]" />
                  <span>主要原动肌群 (Primary Movers)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeExercise.primaryMuscles.map((m, idx) => (
                    <span key={idx} className="text-xs bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30 px-2 py-0.5 rounded font-mono-tech">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-850">
                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mb-1.5 font-medium">
                  <Layers className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>协同与稳定肌群 (Synergists)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeExercise.secondaryMuscles.map((m, idx) => (
                    <span key={idx} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono-tech">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 核心动作要领 (NSCA Execution Cues) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-[#39FF14]" />
                <span>NSCA 标准动作要领 (Biomechanical Cues)</span>
              </div>
              <div className="space-y-2.5">
                {activeExercise.executionCues.map((cue, idx) => (
                  <div key={idx} className="text-xs text-zinc-300 bg-zinc-950/60 p-3 rounded-lg border border-zinc-850 flex items-start gap-2.5 leading-relaxed">
                    <span className="font-mono-tech font-bold text-[#39FF14] text-xs shrink-0">
                      0{idx + 1}
                    </span>
                    <div>{cue}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 常见错误提示 (Common Biomechanical Errors) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-rose-400">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>常见错误与生物力学损伤隐患 (Common Errors)</span>
              </div>
              <div className="space-y-2">
                {activeExercise.commonErrors.map((err, idx) => (
                  <div key={idx} className="text-xs text-zinc-300 bg-rose-950/20 p-3 rounded-lg border border-rose-900/40 flex items-start gap-2.5 leading-relaxed">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <div>{err}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 呼吸与核心刚度指导 */}
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3.5 text-xs text-zinc-300 flex items-start gap-2.5">
              <Wind className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-emerald-400">瓦式呼吸法与腹内压指导 (Valsalva Cue)：</span>
                <span className="ml-1 text-zinc-300 leading-relaxed">{activeExercise.breathingCue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
