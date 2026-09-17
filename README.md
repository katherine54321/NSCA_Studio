# NSCA-CSCS 科学体能训练与数据记录系统

> 严格遵照《NSCA-CSCS 体能训练与力量调节指南 (Essentials of Strength Training and Conditioning)》打造的专业运动体能训练平台。集标准动作指导库、Brzycki 1RM 渐进超负荷追踪与 4 周波浪式周期化训练生成引擎于一体。

---

## 📱 移动端与桌面端核心架构（按底部 Tab 划分）

为了确保在手机端与桌面端均获得最佳训练体验，系统采用自适应响应式设计，在移动端通过**底部固定 Tab 导航栏**对各专业模块进行职责切分：

1. **📚 动作库 (`/library`)**
   - 涵盖 NSCA 八大动作分类（下肢双侧/单侧、上肢水平推/拉、垂直推/拉、奥林匹克爆发力举重、核心稳定抗伸展）。
   - 深度标注主要发力肌群、协同肌群、关节活动度要点、呼吸机制（Valsalva 腹内压）与力学安全注意事项。
   - 支持多维筛选与关键字极速检索，并可直达“一键带入记训练”。

2. **📝 记训练 (`/logger`)**
   - **手机端特调优化**：专职呈现训练动作录入面板与历史训次记录流，不挤占首屏空间渲染趋势图，聚焦现场快速打卡。
   - **Brzycki 预测 1RM**：输入重量与重复次数实时计算预测极限 $1\text{RM} = \text{Weight} \times \frac{36}{37 - \text{Reps}}$。
   - **RPE / RIR 自觉负荷量表联动**：结合 Borg CR-10 自觉用力系数与做功储备次数评估疲劳度。
   - **NSCA 2-for-2 自动进阶判定**：最后一组超出目标次数 $\ge 2$ 次且连续两次达到时，自动触发加重建议（上肢 +2.5kg / 下肢 +5kg）。
   - **平板与桌面端**：在宽屏视口下自动在下方集成折线图概览。

3. **📈 趋势图 (`/chart`)**
   - 基于 **Chart.js** 渲染高清渐进超负荷（Progressive Overload）趋势图。
   - 包含多动作切换、历史最大 1RM 极值、总训练容量（Volume = Sets × Reps × Weight）堆叠统计与最近 30 天负荷爬升率。
   - 手机端由独立 Tab 专职承载，图表自适应缩放与平滑贝塞尔曲线呈现。

4. **⚡ 周期化 (`/periodization`)**
   - **四大核心训练目标独立拆分**：
     - **纯肌肥大 (Hypertrophy)**：67% - 85% 1RM，6 - 12 Reps，间歇 30 - 90 秒，3 - 6 组；
     - **肌耐力 (Muscular Endurance)**：≤ 67% 1RM，≥ 12 Reps，间歇 ≤ 30 秒，2 - 3 组；
     - **纯最大力量 (Strength)**：≥ 85% 1RM，≤ 6 Reps，间歇 2 - 5 分钟，2 - 6 组；
     - **功率与爆发力 (Power / Olympic)**：75% - 90% 1RM，1 - 5 Reps，间歇 2 - 5 分钟，3 - 5 组。
   - **NSCA Table 17.5 规则引擎与实时冲突拦截**：对“初学者 + 4天/周”、“初学者 + 爆发力”等违规参数进行实时拦截，并提供一键科学矫正建议。
   - **初学者动力学安全降级保护**：将高危杠铃高翻自动安全替换为药球爆发砸投、哑铃跳推与箱式跳深软着陆制动。
   - **4 周微周期（Microcycle）编排**：第 1 周基础适应 ➔ 第 2 周负荷递增 ➔ 第 3 周超载峰值 ➔ 第 4 周科学减载（Deload）。
   - 支持一键复制完整标准文本课表。

---

## 🛠️ 技术栈与依赖

- **核心框架**：React 19 + TypeScript (ES2022)
- **构建工具**：Vite 6
- **样式方案**：Tailwind CSS v4
- **动效库**：Motion (Framer Motion)
- **图表引擎**：Chart.js
- **图标系统**：Lucide React

---

## 🚀 本地复现与启动指南 (Quickstart)

确保本地已安装 **Node.js 18+** 与 **npm**。

### 1. 克隆代码仓库
```bash
git clone <你的 GitHub 仓库地址>
cd <仓库目录>
```

### 2. 安装项目依赖
```bash
npm install
```

### 3. 本地启动开发服务器
```bash
npm run dev
```
启动后在浏览器打开 [http://localhost:3000](http://localhost:3000) 即可访问。

### 4. 生产打包验证
```bash
npm run build
```
打包产物将输出在 `dist/` 目录，可直接托管部署至 Cloud Run、Vercel、Netlify 或 GitHub Pages。

---

## 📂 项目结构概览

```text
├── index.html                   # HTML 模板入口 (加载 Chakra Petch 等科幻字体)
├── metadata.json                # AI Studio 应用元数据与能力配置
├── package.json                 # 依赖声明与启动脚本
├── tsconfig.json                # TypeScript 配置
├── vite.config.ts               # Vite & Tailwind 插件配置
├── src/
│   ├── App.tsx                  # 根组件 (Tab 路由、全局状态、响应式视图分流)
│   ├── main.tsx                 # React 渲染入口
│   ├── index.css                # 全局样式与 Tailwind 导入
│   ├── types/
│   │   ├── nsca.ts              # NSCA 处方、动作、日志与校验规则 TypeScript 接口定义
│   ├── data/
│   │   └── exercises.ts         # NSCA 标准动作全量数据库 (包含八大分类动作详尽指导)
│   ├── utils/
│   │   ├── nscaCalculators.ts   # Brzycki 1RM 计算、2-for-2 规则与 RPE 算法
│   │   └── periodizationLogic.ts# 周期化生成引擎、Table 17.5 规则冲突检测与安全降级
│   └── components/
│       ├── Navbar.tsx           # 顶部品牌栏与底部悬浮 Tab 响应式导航栏
│       ├── ExerciseLibrary.tsx  # 动作库浏览、筛选与弹窗详解组件
│       ├── DataLogger.tsx       # 训练记录、1RM 动态测算与历史日志管理
│       ├── ProgressiveOverloadChart.tsx # Chart.js 渐进超负荷趋势图
│       └── PeriodizationGenerator.tsx   # 4 周周期化生成器与交互式预检看板
```

---

## 📜 科学规范参考

1. Haff, G. G., & Triplett, N. T. (Eds.). (2015). *Essentials of Strength Training and Conditioning* (4th ed.). Human Kinetics / National Strength and Conditioning Association (NSCA).
2. Brzycki, M. (1993). *Strength testing—predicting a one-rep max from reps-to-fatigue*. Journal of Physical Education, Recreation & Dance.
3. Helms, E. R., et al. (2016). *Application of the Repetitions in Reserve-Based Rating of Perceived Exertion Scale for Resistance Training*. Strength & Conditioning Journal.
