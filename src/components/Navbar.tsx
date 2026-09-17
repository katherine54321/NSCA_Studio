import React from 'react';
import { Activity, Dumbbell, LineChart, Calendar, Award, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: 'library' | 'logger' | 'chart' | 'periodization' | 'toolbox';
  setActiveTab: (tab: 'library' | 'logger' | 'chart' | 'periodization' | 'toolbox') => void;
  logsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, logsCount }) => {
  return (
    <>
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-md border-b border-zinc-800">
        {/* Top micro-bar: 仅在平板与桌面端显示详细信息，手机端紧凑展示 */}
        <div className="bg-zinc-900/80 border-b border-zinc-800/60 px-3 sm:px-4 py-1 text-xs flex justify-between items-center text-zinc-400">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></span>
            <span className="font-mono-tech text-[10px] sm:text-xs text-zinc-300">NSCA-CSCS® SCIENTIFIC ENGINE</span>
            <span className="hidden sm:inline text-zinc-500">|</span>
            <span className="hidden md:inline text-zinc-400 text-xs">美国国家体能协会力量体系</span>
          </div>
          <div className="flex items-center gap-2 font-mono-tech text-[10px] sm:text-[11px]">
            <span className="text-zinc-500 hidden lg:inline">FORMULA: BRZYCKI 1RM</span>
            <span className="text-[#00E5FF] bg-cyan-950/40 border border-cyan-800/50 px-2 py-0.5 rounded">
              已存 {logsCount} 组
            </span>
          </div>
        </div>

        {/* Main navigation header */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo & Brand */}
            <div 
              className="flex items-center gap-2.5 cursor-pointer" 
              onClick={() => setActiveTab('library')}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-zinc-900 border border-[#39FF14]/40 flex items-center justify-center glow-neon-green shrink-0">
                <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-[#39FF14]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display-tech text-base sm:text-lg font-bold tracking-wider text-white">
                    NSCA <span className="text-[#39FF14]">STRENGTH</span> <span className="text-[#00E5FF]">LAB</span>
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 tracking-tight line-clamp-1">
                  科学动作指导 · 1RM 渐进负荷 · 4周周期化
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs (桌面端显示，手机端隐藏并转到底部导航) */}
            <nav className="hidden md:flex items-center gap-1 sm:gap-2">
              <button
                id="nav-tab-library"
                onClick={() => setActiveTab('library')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'library'
                    ? 'bg-zinc-800 text-[#39FF14] border border-[#39FF14]/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>NSCA 动作库</span>
              </button>

              <button
                id="nav-tab-logger"
                onClick={() => setActiveTab('logger')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'logger'
                    ? 'bg-zinc-800 text-[#00E5FF] border border-[#00E5FF]/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>数据记录</span>
              </button>

              <button
                id="nav-tab-chart"
                onClick={() => setActiveTab('chart')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'chart'
                    ? 'bg-zinc-800 text-[#39FF14] border border-[#39FF14]/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                }`}
              >
                <LineChart className="w-4 h-4" />
                <span>渐进负荷图表</span>
              </button>

              <button
                id="nav-tab-periodization"
                onClick={() => setActiveTab('periodization')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'periodization'
                    ? 'bg-zinc-800 text-[#00E5FF] border border-[#00E5FF]/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>周期化计划</span>
              </button>

              <button
                id="nav-tab-toolbox"
                onClick={() => setActiveTab('toolbox')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'toolbox'
                    ? 'bg-zinc-800 text-amber-400 border border-amber-400/30 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>CSCS 工具箱</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* 手机端专用底部悬浮触控导航坞 (Mobile Bottom Navigation Dock) */}
      <nav 
        aria-label="Mobile Navigation" 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#121212]/95 backdrop-blur-xl border-t border-zinc-800 pb-[env(safe-area-inset-bottom)] shadow-2xl"
      >
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {/* 1. 动作库 */}
          <button
            id="mobile-nav-library"
            onClick={() => setActiveTab('library')}
            className={`flex flex-col items-center justify-center h-full py-1 transition-colors active:scale-95 ${
              activeTab === 'library'
                ? 'text-[#39FF14]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium tracking-tight">动作库</span>
            {activeTab === 'library' && (
              <span className="w-4 h-0.5 bg-[#39FF14] rounded-full mt-0.5 shadow-sm"></span>
            )}
          </button>

          {/* 2. 数据记录 */}
          <button
            id="mobile-nav-logger"
            onClick={() => setActiveTab('logger')}
            className={`flex flex-col items-center justify-center h-full py-1 transition-colors active:scale-95 ${
              activeTab === 'logger'
                ? 'text-[#00E5FF]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium tracking-tight">记训练</span>
            {activeTab === 'logger' && (
              <span className="w-4 h-0.5 bg-[#00E5FF] rounded-full mt-0.5 shadow-sm"></span>
            )}
          </button>

          {/* 3. 渐进图 */}
          <button
            id="mobile-nav-chart"
            onClick={() => setActiveTab('chart')}
            className={`flex flex-col items-center justify-center h-full py-1 transition-colors active:scale-95 ${
              activeTab === 'chart'
                ? 'text-[#39FF14]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LineChart className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium tracking-tight">趋势图</span>
            {activeTab === 'chart' && (
              <span className="w-4 h-0.5 bg-[#39FF14] rounded-full mt-0.5 shadow-sm"></span>
            )}
          </button>

          {/* 4. 周期化 */}
          <button
            id="mobile-nav-periodization"
            onClick={() => setActiveTab('periodization')}
            className={`flex flex-col items-center justify-center h-full py-1 transition-colors active:scale-95 ${
              activeTab === 'periodization'
                ? 'text-[#00E5FF]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium tracking-tight">周期计划</span>
            {activeTab === 'periodization' && (
              <span className="w-4 h-0.5 bg-[#00E5FF] rounded-full mt-0.5 shadow-sm"></span>
            )}
          </button>

          {/* 5. 工具箱 */}
          <button
            id="mobile-nav-toolbox"
            onClick={() => setActiveTab('toolbox')}
            className={`flex flex-col items-center justify-center h-full py-1 transition-colors active:scale-95 ${
              activeTab === 'toolbox'
                ? 'text-amber-400'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Award className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium tracking-tight">工具箱</span>
            {activeTab === 'toolbox' && (
              <span className="w-4 h-0.5 bg-amber-400 rounded-full mt-0.5 shadow-sm"></span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
