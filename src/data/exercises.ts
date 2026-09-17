import { Exercise, NSCACategory, NSCACategoryMeta } from '../types/nsca';

/**
 * NSCA 6 大核心动作分类元信息
 * 严格遵循 NSCA 训次排序原则 (Exercise Order):
 * 爆发力动作优先 -> 大肌群多关节复合动作 -> 辅助单关节动作 -> 核心/小肌群
 */
export const NSCA_CATEGORIES: NSCACategoryMeta[] = [
  {
    key: 'POWER',
    name: '爆发力动作',
    enName: 'Power / Olympic Lifts',
    description: '最大功率输出与高阈值运动单位募集，神经疲劳极快，须置于训练课最先执行。',
    nscaPriorityOrder: 1,
    accentColor: '#39FF14', // 荧光绿
  },
  {
    key: 'LOWER_PUSH',
    name: '下肢推',
    enName: 'Lower Body Push',
    description: '股四头肌与臀大肌为主导的双关节/单侧伸髋伸膝动作，全身代谢与激素响应峰值。',
    nscaPriorityOrder: 2,
    accentColor: '#00E5FF', // 电光蓝
  },
  {
    key: 'LOWER_PULL',
    name: '下肢拉',
    enName: 'Lower Body Pull',
    description: '后侧动力链（腘绳肌、臀肌、竖脊肌）主导的铰链动作，核心抗屈曲与地面力传导基石。',
    nscaPriorityOrder: 3,
    accentColor: '#A855F7', // 科技紫
  },
  {
    key: 'UPPER_PUSH',
    name: '上肢推',
    enName: 'Upper Body Push',
    description: '胸大肌、三角肌前束及肱三头肌主导的水平推与垂直推动作，兼顾肩锁关节稳定性。',
    nscaPriorityOrder: 4,
    accentColor: '#F59E0B', // 琥珀橙
  },
  {
    key: 'UPPER_PULL',
    name: '上肢拉',
    enName: 'Upper Body Pull',
    description: '背阔肌、斜方肌中下束、菱形肌及肱二头肌主导的垂直拉与水平拉，维持肩袖力偶平衡。',
    nscaPriorityOrder: 5,
    accentColor: '#10B981', // 翡翠绿
  },
  {
    key: 'CORE',
    name: '核心稳定',
    enName: 'Core & Trunk Stability',
    description: '腹横肌、腹直肌、腹内外斜肌与骨盆底肌群的抗伸展、抗侧屈与抗旋转力矩传递。',
    nscaPriorityOrder: 6,
    accentColor: '#EC4899', // 霓虹粉
  },
];

export const NSCA_EXERCISES: Exercise[] = [
  // 1. 爆发力 (Power / Olympic lifts)
  {
    id: 'power-clean',
    name: '高翻 (Power Clean)',
    enName: 'Power Clean',
    category: 'POWER',
    primaryMuscles: ['臀大肌', '腘绳肌', '股四头肌', '斜方肌', '小腿三头肌'],
    secondaryMuscles: ['前臂屈肌', '竖脊肌', '三角肌'],
    equipment: '奥林匹克杠铃 + 竞技杠铃片',
    orderRecommendation: 'NSCA 黄金法则第 1 位：爆发力动作需在神经系统最充沛时进行，置于热身后首个动作。',
    breathingCue: '起铃前深吸气腹内压屏住（Valsalva），三重伸展爆发瞬间呼气，接铃缓冲时稳住核心。',
    executionCues: [
      '【预备姿态】双脚与髋同宽，杠铃贴近胫骨，正握双臂自然垂直，肩稍过杠，挺胸收紧背阔肌。',
      '【第一提铃】以伸膝为主导平稳离地，躯干角度保持不变，杠铃垂直贴身向上滑行至膝上方。',
      '【第二提铃-三重伸展】杠铃至大腿中上段爆发力启动，踝、膝、髋三关节剧烈爆发性完全伸展，斜方肌猛烈耸肩。',
      '【借力下潜与接铃】手肘快速向前上方穿出，在膝屈曲不低于90度的位置（四分之一蹲）用三角肌前束架稳杠铃，站立锁定。'
    ],
    commonErrors: [
      '用手臂主动弯举拉拽杠铃，未借助髋膝爆发力，严重削弱爆发功率并增加二头肌肌腱拉伤风险。',
      '第二提铃阶段提前屈臂或躯干过早后仰（假性伸髋），导致杠铃弧形远离身体（飞杠）。',
      '接铃时手肘下垂，杠铃撞击锁骨或手腕过度后翻承重致腕关节损伤。'
    ]
  },
  {
    id: 'snatch-high-pull',
    name: '宽握高拉 (Snatch High Pull)',
    enName: 'Snatch High Pull',
    category: 'POWER',
    primaryMuscles: ['臀肌', '腘绳肌', '斜方肌中上束', '竖脊肌'],
    secondaryMuscles: ['三角肌中后束', '前臂肌群'],
    equipment: '奥林匹克杠铃',
    orderRecommendation: '爆发力阶段动作，强化伸髋耸肩爆发力的专项进阶。',
    breathingCue: '起铃建立腹内压，蹬地三伸展最高点短促发力呼气。',
    executionCues: [
      '宽握距（双手虎口间距接近肘窝伸展距离），保持背部严密反弓与背阔肌下压。',
      '杠铃过膝后快速伸髋，足跟发力蹬地，将全身垂直矢量动量传导至杠铃。',
      '杠铃顺势上飞至胸骨高度，肘部始终高于腕部。'
    ],
    commonErrors: [
      '手肘下沉导致变成反向卧推或腕部扭转。',
      '过早拉起脚后跟，重心过度前倾至脚趾导致失衡。'
    ]
  },
  {
    id: 'push-jerk',
    name: '挺举推力 (Push Jerk)',
    enName: 'Push Jerk',
    category: 'POWER',
    primaryMuscles: ['股四头肌', '臀大肌', '三角肌', '肱三头肌'],
    secondaryMuscles: ['腹直肌', '斜方肌', '前锯肌'],
    equipment: '奥林匹克杠铃',
    orderRecommendation: '上肢与下肢联合爆发力动作，排在多关节大负荷推举之前。',
    breathingCue: '架铃于锁骨上深吸气，屈膝借力推起瞬间锁定呼吸，过头支撑后吐气。',
    executionCues: [
      '起姿架于三角肌前束与锁骨，手肘向前抬高约45度。',
      '直线下沉（Dip）下潜5-10cm，躯干保持垂直，不得前倾。',
      '剧烈蹬伸双腿（Drive），紧接着双膝微屈下潜接铃（Catch），双臂在头顶完全锁定。'
    ],
    commonErrors: [
      '下沉阶段躯干前倾，导致杠铃向前抛射脱离重心垂线。',
      '未做二次下潜缓冲，完全用肩膀硬推，违背爆发力代偿原则。'
    ]
  },

  // 2. 下肢推 (Lower Body Push)
  {
    id: 'back-squat',
    name: '杠铃后深蹲 (Barbell Back Squat)',
    enName: 'Barbell Back Squat',
    category: 'LOWER_PUSH',
    primaryMuscles: ['股四头肌', '臀大肌'],
    secondaryMuscles: ['内收肌群', '腘绳肌', '竖脊肌', '腹横肌'],
    equipment: '深蹲架 + 奥林匹克杠铃',
    orderRecommendation: 'NSCA 核心大复合动作（Core Compound），安排在爆发力动作之后、辅助动作之前。',
    breathingCue: '瓦氏呼吸法（Valsalva）：顶部深吸气360度充盈腹腔，下蹲全程闭气锁紧核心，推起过粘滞点后匀速呼气。',
    executionCues: [
      '【出杠与站姿】双脚间距约为肩宽或稍宽，脚尖自然外展15-30度，肩胛骨向后收拢下沉，形成稳固肌肉垫。',
      '【下蹲轨迹】同时屈髋与屈膝，膝关节追踪脚尖方向，臀部坐向双脚正中，背部脊柱保持自然中立。',
      '【深度达标】NSCA 竞赛标准：大腿股骨上表面低于膝关节顶部（折痕低于膝眼），严禁过浅半蹲或过度骨盆翻转。',
      '【推起向心】足弓三点（第一跖骨、第五跖骨、足跟）均匀踩实地面，想象地板向两侧撑开，平稳伸髋伸膝站起。'
    ],
    commonErrors: [
      '膝内扣（Knee Valgus）：向心启动阶段双膝向内塌陷，显著增加前交叉韧带(ACL)与半月板剪切应力。',
      '臀先起（Good Morning Squat）：伸膝速度远快于伸髋，躯干严重前倾转为硬拉，腰椎负荷剧增。',
      '脚跟离地：重心过分移至前脚掌，踝关节背屈活动度不足代偿所致。'
    ]
  },
  {
    id: 'front-squat',
    name: '杠铃前深蹲 (Barbell Front Squat)',
    enName: 'Barbell Front Squat',
    category: 'LOWER_PUSH',
    primaryMuscles: ['股四头肌（股直肌/股外侧肌）', '腹直肌/核心肌群'],
    secondaryMuscles: ['臀大肌', '上背斜方肌/菱形肌'],
    equipment: '深蹲架 + 杠铃',
    orderRecommendation: '股四头肌高孤立度与躯干竖直复合动作，腰椎剪切力显著小于后深蹲。',
    breathingCue: '胸腔饱满吸气维持高肘位，全程保持腹内压防止上背部溃散。',
    executionCues: [
      '干净架杆位（Clean Grip）或交叉手位，双肘平抬与地面平行，杠铃落在三角肌前束窝内。',
      '躯干近乎垂直下蹲，重心落在足中，膝盖自然前移。',
      '向上站立时，持续有意识向上抬高手肘以防杠铃向前滑落。'
    ],
    commonErrors: [
      '手肘下垂导致胸椎屈曲折叠，杠铃脱手滚落。',
      '背部拱起（驼背），上背部肌肉支撑疲劳力竭。'
    ]
  },
  {
    id: 'walking-lunge',
    name: '哑铃箭步蹲 (Walking Lunge)',
    enName: 'Dumbbell Walking Lunge',
    category: 'LOWER_PUSH',
    primaryMuscles: ['股四头肌', '臀大肌'],
    secondaryMuscles: ['臀中肌（骨盆水平稳定）', '腘绳肌', '小腿肌群'],
    equipment: '哑铃一对',
    orderRecommendation: '单侧下肢力量与骨盆抗侧倾训练，有效纠正左右侧力量不平衡。',
    breathingCue: '前跨步下落吸气，蹬地站立跨步换脚呼气。',
    executionCues: [
      '跨出步幅适中，前腿屈膝约90度，膝盖对准脚尖，后膝轻触地面上方。',
      '前脚全掌蹬地，重心微前倾但胸椎保持挺拔。',
      '骨盆保持绝对水平，防止无负重侧骨盆塌陷。'
    ],
    commonErrors: [
      '步距过短导致前膝严重过载或脚后跟翘起。',
      '后膝猛烈撞击硬质地面造成髌骨机械损伤。'
    ]
  },

  // 3. 下肢拉 (Lower Body Pull)
  {
    id: 'conventional-deadlift',
    name: '传统杠铃硬拉 (Conventional Deadlift)',
    enName: 'Conventional Barbell Deadlift',
    category: 'LOWER_PULL',
    primaryMuscles: ['臀大肌', '腘绳肌', '竖脊肌', '背阔肌'],
    secondaryMuscles: ['斜方肌', '前臂屈肌握力', '腹横肌'],
    equipment: '标准硬拉杠铃 + 配重片',
    orderRecommendation: '下肢最大后链拉力核心动作，与深蹲交替或间隔安排。',
    breathingCue: '锁定骨盆后在起始位深吸气建立最大腹腔刚度，推离地面过膝后呼气锁定。',
    executionCues: [
      '【起姿设定】双脚髋宽，足中正对杠铃，胫骨距杆约2.5cm，正反握或双正握加抓握镁粉。',
      '【起拉准备】拉紧杠铃“咔哒”声（Slack Out），背阔肌向下向后收紧，锁住肩胛骨与胸椎。',
      '【推离地面】先以股四头肌“蹬离地板”为主导，杠铃贴小腿滑过膝关节。',
      '【伸髋锁定】杠铃过膝后强力伸髋将臀部前推夹紧，躯干直立锁定，切勿过度后仰超伸。'
    ],
    commonErrors: [
      '圆背起铃（Lumbar Flexion）：腰椎屈曲承重导致椎间盘后侧纤维环高压挤压，极度危险。',
      '拉离地面时杠铃脱离胫骨向前漂移，产生巨大力臂放大腰背杠杆负荷。',
      '顶部过度后倾（Hyperextension）：锁定阶段向后仰腰，将应力从臀肌转移至小关节面。'
    ]
  },
  {
    id: 'romanian-deadlift',
    name: '罗马尼亚硬拉 (Romanian Deadlift - RDL)',
    enName: 'Romanian Deadlift',
    category: 'LOWER_PULL',
    primaryMuscles: ['腘绳肌群（半腱肌/半膜肌/股二头肌）', '臀大肌'],
    secondaryMuscles: ['竖脊肌', '背阔肌'],
    equipment: '杠铃或哑铃',
    orderRecommendation: '腘绳肌离心拉伸超负荷训练核心动作，预防冲刺跑拉伤的首选动作。',
    breathingCue: '顶部吸气建立核心稳定，向后推髋下落全程保持核心紧张，回正呼气。',
    executionCues: [
      '从直立位起始，微屈膝关节（约15-20度），随后膝关节角度锁定不变。',
      '纯粹向后推送髋关节（Hip Hinge），想象用臀部关上身后的门。',
      '杠铃始终紧贴大腿表面下行至膝盖下方或小腿上段，感受腘绳肌强烈张力后由臀部发力拉回。'
    ],
    commonErrors: [
      '下放时膝关节持续弯曲变成蹲，丧失腘绳肌离心张力。',
      '为了追求杠铃触地而放弃中立脊柱，导致腰椎弯曲代偿。'
    ]
  },
  {
    id: 'barbell-hip-thrust',
    name: '杠铃臀推 (Barbell Hip Thrust)',
    enName: 'Barbell Hip Thrust',
    category: 'LOWER_PULL',
    primaryMuscles: ['臀大肌（上部与下部全束）'],
    secondaryMuscles: ['腘绳肌', '大收肌', '腹核心'],
    equipment: '训练凳 + 杠铃海绵垫',
    orderRecommendation: '水平向量伸髋最大峰值张力动作，极好强化臀肌神经募集。',
    breathingCue: '底部吸气，推至顶峰水平位呼气并收紧臀部保持1秒。',
    executionCues: [
      '肩胛骨下缘支撑于训练凳边沿，杠铃置于髋骨折痕处，双脚踩实，小腿在顶部垂直地面。',
      '由臀部主动收缩将杠铃推起至躯干与大腿呈水平一条线。',
      '下巴微收，眼神目视前方，保持骨盆后倾（Posterior Pelvic Tilt）避免腰椎过度代偿。'
    ],
    commonErrors: [
      '颈部后仰、胸腔过度上挺导致腰椎代偿超伸产生疼痛。',
      '双脚距离过远（过度募集腘绳肌）或过近（膝关节压力过大）。'
    ]
  },

  // 4. 上肢推 (Upper Body Push)
  {
    id: 'bench-press',
    name: '杠铃平卧推 (Barbell Bench Press)',
    enName: 'Barbell Bench Press',
    category: 'UPPER_PUSH',
    primaryMuscles: ['胸大肌（胸肋束/锁骨束）', '肱三头肌'],
    secondaryMuscles: ['三角肌前束', '前锯肌'],
    equipment: '标准卧推架 + 杠铃',
    orderRecommendation: '上肢水平推基础大复合动作，安排在上肢辅助单关节动作之前。',
    breathingCue: '出杠后在胸上方吸气充满胸腔并屏住腹压，下放至胸触碰，推过半程后平稳呼气。',
    executionCues: [
      '【NSCA 五点接触法】头部、上背肩胛、臀部紧贴卧推凳，左脚右脚全脚掌完全踩实地面。',
      '【肩胛姿态】双侧肩胛骨主动后缩（Retract）并下沉（Depress），形成紧固的肌肉基底。',
      '【下放轨迹】杠铃微呈弧形下放至胸肌下缘或剑突水平，大臂与躯干夹角呈45-75度，杜绝90度大臂外展。',
      '【腿部驱动 (Leg Drive)】双脚向地板斜前方持续施力，将地面反作用力经由骨盆与核心传导至上背支点。'
    ],
    commonErrors: [
      '耸肩推举：肩胛骨脱离后缩锁定，三角肌前束与肩峰下间隙受到严重挤压，诱发肩峰撞击综合征。',
      '杠铃砸胸反弹：利用胸骨与肋软骨弹性回弹作弊，极易造成软骨挫伤甚至骨折。',
      '臀部离开凳面：向心推起时臀部悬空抬起，属于违例且易造成腰椎反向剪切损伤。'
    ]
  },
  {
    id: 'overhead-press',
    name: '站姿杠铃推举 (Overhead Press / OHP)',
    enName: 'Standing Military / Overhead Press',
    category: 'UPPER_PUSH',
    primaryMuscles: ['三角肌前束/中束', '肱三头肌', '锁骨部胸肌'],
    secondaryMuscles: ['斜方肌上中下束', '前锯肌', '臀肌与核心稳定肌群'],
    equipment: '站姿深蹲架 / 杠铃',
    orderRecommendation: '上肢垂直推核心标杆动作，对站姿全身动力链协调与肩胛上回旋要求极高。',
    breathingCue: '锁骨前架好吸气收紧臀腹，推起头部后移让过杠铃，过头耸肩锁定时呼气。',
    executionCues: [
      '握距略宽于肩，前臂在侧面视角完全垂直于地面，手腕保持中立挺直。',
      '收紧臀大肌与腹横肌制造坚固下肢支柱，头部微后仰让出杠铃直线垂直上升轨迹。',
      '杠铃过头顶后，头部迅速回位穿出（Window），肩胛骨主动上回旋，在最高点形成完全支撑。'
    ],
    commonErrors: [
      '腰椎严重过伸（后弓腰借力）：下肢核心无力导致后仰，将垂直推代偿变成了倾斜卧推。',
      '推举杠铃向前画大圆弧，脱离肩峰中心垂线造成力矩过大脱力。'
    ]
  },
  {
    id: 'incline-dumbbell-press',
    name: '上斜哑铃卧推 (Incline DB Press)',
    enName: 'Incline Dumbbell Press',
    category: 'UPPER_PUSH',
    primaryMuscles: ['胸大肌锁骨部（上胸）', '三角肌前束'],
    secondaryMuscles: ['肱三头肌'],
    equipment: '可调哑铃凳（30-45度倾角） + 哑铃',
    orderRecommendation: '卧推后的进阶辅助刺激，强化上胸与肩关节协调。',
    breathingCue: '下放充分拉伸时深吸气，推起向心至哑铃微拢时呼气。',
    executionCues: [
      '凳角调节在30度左右最佳（超过45度三角肌前束主导占比过高）。',
      '手腕保持中立，哑铃在底部自然呈微八字（约45度角）保护肩关节囊。',
      '匀速向上推举，在顶部不互相撞击哑铃以维持持续张力。'
    ],
    commonErrors: [
      '哑铃下落过深导致前肩囊过度牵拉损伤。',
      '双脚悬空或乱动，丧失底盘稳定性。'
    ]
  },

  // 5. 上肢拉 (Upper Body Pull)
  {
    id: 'barbell-bent-over-row',
    name: '俯身杠铃划船 (Barbell Bent-Over Row)',
    enName: 'Barbell Bent-Over Row',
    category: 'UPPER_PULL',
    primaryMuscles: ['背阔肌', '斜方肌中下束', '菱形肌', '大圆肌'],
    secondaryMuscles: ['肱二头肌', '三角肌后束', '竖脊肌'],
    equipment: '奥林匹克杠铃',
    orderRecommendation: '上肢水平拉大复合动作，增强背部厚度与后背肌群等长支撑力。',
    breathingCue: '向腹部拉起时呼气并用力夹紧肩胛骨，缓慢下放受控时吸气。',
    executionCues: [
      '俯身角度保持在45度至近乎与地面平行，微屈膝，脊柱维持自然生理曲度。',
      '双正握或双反握，起拉时想象以手肘为挂钩，手肘贴近身体向斜后上方拉向脐部或下胸。',
      '在向心顶点用力挤压收拢双侧肩胛骨，感受中背部肌肉群峰值收缩。'
    ],
    commonErrors: [
      '躯干借力剧烈上下起伏摆动，变成利用下肢爆发力甩起杠铃。',
      '含胸驼背（胸椎失稳）：腰背疲劳后弓背强拉，极易导致腰肌劳损。'
    ]
  },
  {
    id: 'pull-up',
    name: '引体向上 (Strict Pull-Up)',
    enName: 'Strict Pull-Up',
    category: 'UPPER_PULL',
    primaryMuscles: ['背阔肌', '大圆肌', '肱二头肌'],
    secondaryMuscles: ['下斜方肌', '菱形肌', '核心抗摆动肌群'],
    equipment: '高位单杠 / 助力带 / 负重带',
    orderRecommendation: '上肢垂直拉黄金标准，自重/负重力量与体脂比例的极佳检测动作。',
    breathingCue: '底部悬垂吸气，上拉胸口触杠时呼气，下落过程均匀控制吸气。',
    executionCues: [
      '全握单杠，握距略宽于肩，初始位置进入完全悬垂状态（Dead Hang）。',
      '先主动激活肩胛骨：双肩下沉下压，随后背阔肌发力牵引手肘向肋骨靠拢。',
      '将下巴完全越过杠铃横杆，或以胸骨触杠为完美标准，身体保持微张紧张，不摆腿蹬踢。',
      '离心阶段保持3秒缓慢匀速受控下放至臂伸展。'
    ],
    commonErrors: [
      '借力屈髋蹬腿（Kipping）：未加说明时作为力量训练动作应保持严格孤立拉起。',
      '半程动作：下放未完全伸展臂长，只做顶峰半段，丧失背阔肌最关键的被动与主动拉伸区间。'
    ]
  },
  {
    id: 'seated-cable-row',
    name: '坐姿绳索划船 (Seated Cable Row)',
    enName: 'Seated Cable Row',
    category: 'UPPER_PULL',
    primaryMuscles: ['菱形肌', '斜方肌中束', '背阔肌'],
    secondaryMuscles: ['肱二头肌', '三角肌后束'],
    equipment: '低位滑轮拉力器 + V型手柄',
    orderRecommendation: '中背部肌群高稳定辅助训练，肩胛骨后缩控制的良好教学动作。',
    breathingCue: '拉至腹部时呼气并挺胸，放回绳索时吸气。',
    executionCues: [
      '双膝微屈踏实脚踏板，坐直躯干，腰背保持直立不前晃。',
      '拉动手柄至肚脐下方，手肘紧贴体侧，肩胛骨做大幅度后缩挤压。',
      '回放手柄时允许肩胛骨向前滑移充分展开中背部，但腰椎坚固不动。'
    ],
    commonErrors: [
      '前后剧烈晃动上半身借力，腰部承受过大交替弯剪应力。',
      '耸肩收肘，斜方肌上束严重代偿导致颈部紧张。'
    ]
  },

  // 6. 核心 (Core)
  {
    id: 'pallof-press',
    name: '帕洛夫推举 (Pallof Press)',
    enName: 'Pallof Press (Anti-Rotation)',
    category: 'CORE',
    primaryMuscles: ['腹内斜肌', '腹外斜肌', '腹横肌'],
    secondaryMuscles: ['臀中肌', '肩部稳定肌群'],
    equipment: '弹力带或线缆拉力器',
    orderRecommendation: 'NSCA 抗旋转力矩传递经典核心动作，有效防止脊柱剪切并提升爆发力击打抗扭刚度。',
    breathingCue: '双手推出时对抗旋转力矩，呼气锁住核心，收回胸前时平稳吸气。',
    executionCues: [
      '站姿侧对拉力器，双脚稍宽于肩，微屈膝，双手合握手柄置于胸前。',
      '向身体正前方沿水平直线推出双手，肘部完全伸直，力臂达到最大。',
      '保持抗扭转状态静止维持2-3秒，身体任何躯干部分不得偏转或旋转，平稳收回。'
    ],
    commonErrors: [
      '骨盆或胸腔跟随阻力侧旋转，完全丧失“抗旋转”训练价值。',
      '耸肩或憋气过度。'
    ]
  },
  {
    id: 'hanging-leg-raise',
    name: '悬垂举腿 (Hanging Leg Raise)',
    enName: 'Hanging Leg Raise',
    category: 'CORE',
    primaryMuscles: ['腹直肌（特别是下腹部）'],
    secondaryMuscles: ['髂腰肌', '股直肌', '前臂握力'],
    equipment: '引体向上单杠',
    orderRecommendation: '深层核心屈曲与骨盆后倾控制动作，训练尾声收尾。',
    breathingCue: '举腿骨盆卷起时用力将肺部气体呼出，下落受控时吸气。',
    executionCues: [
      '双手抓杠悬挂，肩胛骨微下沉防止肩脱臼感。',
      '核心主动卷动骨盆向上后旋，将双腿或膝盖抬至胸前高度。',
      '严禁依赖身体摆荡惯性，下放阶段严格对抗重力控制3秒下落。'
    ],
    commonErrors: [
      '仅做单纯的髋屈（大腿上下晃动），骨盆没有发生后卷，导致全靠髂腰肌发力而腹肌刺激极微。',
      '像钟摆一样前后甩荡身体。'
    ]
  },
  {
    id: 'ab-wheel-rollout',
    name: '健腹轮向前滚出 (Ab Wheel Rollout)',
    enName: 'Ab Wheel Rollout (Anti-Extension)',
    category: 'CORE',
    primaryMuscles: ['腹直肌', '腹横肌（抗脊柱过伸）'],
    secondaryMuscles: ['背阔肌', '前锯肌', '胸大肌'],
    equipment: '健腹轮 + 跪垫',
    orderRecommendation: '高阶抗伸展力矩核心训练，要求极高腹内压刚度。',
    breathingCue: '向前滚出前深吸气充盈腹压，推至极限腹壁绷紧，收回时呼气。',
    executionCues: [
      '双膝跪地，双手握轮置于肩下方，起始即保持骨盆轻度后倾与背部微含。',
      '以髋和肩为轴心缓慢向前推进，手臂与躯干向前延伸至身体几乎贴地。',
      '靠腹肌强力收缩卷回起始位置，严禁塌腰。'
    ],
    commonErrors: [
      '向前推出时核心脱力导致塌腰（腰椎超伸下坠），导致竖脊肌和小关节瞬间过载致伤。'
    ]
  }
];

/**
 * 获取预置的真实渐进负荷样例数据（让用户初次打开即可直观看到 Chart.js 的渐进超负荷 1RM 趋势曲线）
 */
export function getInitialSampleLogs(): import('../types/nsca').TrainingLogEntry[] {
  return [
    // 杠铃后深蹲 渐进超负荷历史（展现 4 周典型超负荷）
    {
      id: 'sample-1',
      timestamp: Date.now() - 28 * 86400000,
      dateStr: new Date(Date.now() - 28 * 86400000).toISOString().split('T')[0],
      exerciseId: 'back-squat',
      exerciseName: '杠铃后深蹲 (Barbell Back Squat)',
      category: 'LOWER_PUSH',
      weightKg: 100,
      reps: 8,
      rpe: 8,
      estimated1RM: 124.2, // 100 / (1.0278 - 0.0278*8) = 124.2
      notes: '适应周第1次，热身充分，动作节奏控制在 3-0-1-0',
      isSample: true,
    },
    {
      id: 'sample-2',
      timestamp: Date.now() - 21 * 86400000,
      dateStr: new Date(Date.now() - 21 * 86400000).toISOString().split('T')[0],
      exerciseId: 'back-squat',
      exerciseName: '杠铃后深蹲 (Barbell Back Squat)',
      category: 'LOWER_PUSH',
      weightKg: 105,
      reps: 8,
      rpe: 8.5,
      estimated1RM: 130.4,
      notes: '负荷递增周，加重 5kg，动作稳定无内扣',
      isSample: true,
    },
    {
      id: 'sample-3',
      timestamp: Date.now() - 14 * 86400000,
      dateStr: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
      exerciseId: 'back-squat',
      exerciseName: '杠铃后深蹲 (Barbell Back Squat)',
      category: 'LOWER_PUSH',
      weightKg: 110,
      reps: 6,
      rpe: 8.5,
      estimated1RM: 127.8,
      notes: '强度测试组，下沉深度达标',
      isSample: true,
    },
    {
      id: 'sample-4',
      timestamp: Date.now() - 7 * 86400000,
      dateStr: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
      exerciseId: 'back-squat',
      exerciseName: '杠铃后深蹲 (Barbell Back Squat)',
      category: 'LOWER_PUSH',
      weightKg: 115,
      reps: 5,
      rpe: 9,
      estimated1RM: 129.4,
      notes: '峰值测试组，神经募集良好',
      isSample: true,
    },
    {
      id: 'sample-5',
      timestamp: Date.now() - 1 * 86400000,
      dateStr: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
      exerciseId: 'back-squat',
      exerciseName: '杠铃后深蹲 (Barbell Back Squat)',
      category: 'LOWER_PUSH',
      weightKg: 120,
      reps: 5,
      rpe: 9.5,
      estimated1RM: 135.0,
      notes: '突破历史新高！达成 2-for-2 超额储备',
      isSample: true,
    },

    // 杠铃平卧推 渐进超负荷历史
    {
      id: 'sample-6',
      timestamp: Date.now() - 25 * 86400000,
      dateStr: new Date(Date.now() - 25 * 86400000).toISOString().split('T')[0],
      exerciseId: 'bench-press',
      exerciseName: '杠铃平卧推 (Barbell Bench Press)',
      category: 'UPPER_PUSH',
      weightKg: 80,
      reps: 8,
      rpe: 7.5,
      estimated1RM: 99.3,
      notes: '基底组，肩胛骨收紧良好',
      isSample: true,
    },
    {
      id: 'sample-7',
      timestamp: Date.now() - 18 * 86400000,
      dateStr: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0],
      exerciseId: 'bench-press',
      exerciseName: '杠铃平卧推 (Barbell Bench Press)',
      category: 'UPPER_PUSH',
      weightKg: 85,
      reps: 7,
      rpe: 8.5,
      estimated1RM: 102.0,
      notes: '腿部驱动顺畅',
      isSample: true,
    },
    {
      id: 'sample-8',
      timestamp: Date.now() - 10 * 86400000,
      dateStr: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
      exerciseId: 'bench-press',
      exerciseName: '杠铃平卧推 (Barbell Bench Press)',
      category: 'UPPER_PUSH',
      weightKg: 90,
      reps: 5,
      rpe: 9,
      estimated1RM: 101.2,
      notes: '5次扎实触胸',
      isSample: true,
    },
    {
      id: 'sample-9',
      timestamp: Date.now() - 2 * 86400000,
      dateStr: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      exerciseId: 'bench-press',
      exerciseName: '杠铃平卧推 (Barbell Bench Press)',
      category: 'UPPER_PUSH',
      weightKg: 95,
      reps: 4,
      rpe: 9.5,
      estimated1RM: 103.6,
      notes: '大重量突破，触胸停顿0.5秒',
      isSample: true,
    },

    // 传统硬拉 样例
    {
      id: 'sample-10',
      timestamp: Date.now() - 20 * 86400000,
      dateStr: new Date(Date.now() - 20 * 86400000).toISOString().split('T')[0],
      exerciseId: 'conventional-deadlift',
      exerciseName: '传统杠铃硬拉 (Conventional Deadlift)',
      category: 'LOWER_PULL',
      weightKg: 130,
      reps: 5,
      rpe: 8,
      estimated1RM: 146.2,
      notes: '背部锁定平稳',
      isSample: true,
    },
    {
      id: 'sample-11',
      timestamp: Date.now() - 5 * 86400000,
      dateStr: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
      exerciseId: 'conventional-deadlift',
      exerciseName: '传统杠铃硬拉 (Conventional Deadlift)',
      category: 'LOWER_PULL',
      weightKg: 140,
      reps: 5,
      rpe: 9,
      estimated1RM: 157.5,
      notes: '双正握加抓握镁粉，起铃顺畅',
      isSample: true,
    }
  ];
}
