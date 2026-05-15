// ==UserScript==
// @name         HV - 战斗日志汉化
// @namespace    Aloxaf_hentai
// @version      0.5.0.b
// @description  汉化 HV 战斗日志
// @notice       原作者@qp_xe，物品汉化文本由HV物品装备汉化提供
// @author       qp_xe & indefined & 1235789gzy1 & mbbdzz
// @include      *://hentaiverse.org/*
// @include      *://alt.hentaiverse.org/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @homepage https://github.com/WayneFerdon/HVSinicization
// @downloadURL https://github.com/WayneFerdon/HVSinicization/raw/refs/heads/main/HVSinicization.js
// @updateURL https://github.com/WayneFerdon/HVSinicization/raw/refs/heads/main/HVSinicization.js
// ==/UserScript==

// 隐藏原先的战斗 log
GM_addStyle('#pane_log { display: none; width: 0 }');

let words = {
  //可在此自行增加翻译，注意格式
  //示例
  //'原始文本1': '<span style=\"background:#字体背景色\">自定义文本1</span>',
  //'原始文本2': '<span style=\"color:字体颜色\">自定义文本2</span>',
  //颜色请使用html颜色代码,注意添加逗号

  // 动作
  'which hits!': '命中了!',
  'which crits!': '暴击了!',
  'which glances!': '部分命中了!',
  'which partially parries,': '但被部分招架了,',
  '(.*) cast(s*) (.*)([\,;\.])': '<span style=\"color:red\"> $1 </span> <span style=\"background:#7CFC00;color:black\"> 咏唱了</span> $3 $4',
  '(.*) use(s*) (.*)([\,;\.])': '<span style=\"color:red\"> $1 </span> <span style=\"background:#ADFF2F;color:black\"> 使用了</span> $3 $4',
  '(.+) hit (.+?),' : '<span style=\"color:red\"> $1 </span> 击中 <span style=\"color:red\"> $2 </span> ',
  '(.+) gain(s*) the effect (.+)' : '<span style=\"color:red\"> $1 </span> 获得了状态 $3 ',
  '(.+) crit(s*) (.+?) for' : '<span style=\"color:red\"> $1 </span> 暴击 <span style=\"color:red\"> $3 </span> for',
  '(.+) crit(s*) (.+?)([\,;\.])' : '<span style=\"color:red\"> $1 </span> 暴击 <span style=\"color:red\"> $3 </span> $4 ',
  'and hit(s*) (.+?) for': '击中了 <span style=\"color:red\"> $2 </span> for',
  'and hit(s*) (.+?)([\,;\.])': '击中了 <span style=\"color:red\"> $2 </span> $4 ',
  '(.+) hit(s*) (.+?) for': '<span style=\"color:red\"> $1 </span> 击中了 <span style=\"color:red\"> $3 </span> for',
  '(.+) hit(s*) (.+?)([\,;\.])': '<span style=\"color:red\"> $1 </span> 击中了 <span style=\"color:red\"> $3 </span> $4 ',
  '(.+) glance(s*) (.+?)([\,;\.])': '<span style=\"color:red\"> $1 </span> 部分击中了 <span style=\"color:red\"> $3 </span> $4 ',
  '(.*) counter (.*) for': '<span style=\"color:red\"> $1 </span> <span style=\"color:#FF00FF\"> 反击 </span> <span style=\"color:red\"> $2 </span> <span style=\"color:#FF00FF\"> 造成 </span>',
  '(.+) vigorously whiffs at a shadow': '<span style=\"color:red\"> $1 </span> <span style=\"color:#FF00FF\"> 有力地挥空到影子上 </span>',
  '(.+) in the general direction of a shadow': '<span style=\"color:red\"> $1 </span> <span style=\"color:#FF00FF\"> 整体朝向了影子 </span>',
  'missing (.+?) completely.': '<span style=\"color:#FF00FF\"> 完全未命中 <span style=\"color:red\"> $1 </span> </span>',

  '(.+) block(s*) and partially (parry|parries) the attack from (.*)([\,;\.])' : '$1 <span style=\"color:red\"> $2 </span> 格挡及部分招架了 <span style=\"color:red\"> $4 </span> 的攻击 $5 ',
  '(.*了.)* (.+) partially block(s*) and partially (parry|parries) the attack([\,;\.])' : '$1 <span style=\"color:red\"> $2 </span> 部分格挡及部分招架 $5 ',
  '(.*了.)* (.+) partially block(s*) the attack([\,;\.])' : '$1 <span style=\"color:red\"> $2 </span> 部分格挡 $4 ',
  '(.*了.)* (.+) partially (parry|parries) the attack([\,;\.])' : '$1 <span style=\"color:red\"> $2 </span> 部分招架 $4 ',
  '(.+) evade(s*) (.*) spell([\,;\.])' : '<span style=\"color:red\"> $1 </span> 闪避了 $3 法术 $4',
  '(.+) partially resist(s*) the effects of (.*) spell([\,;\.])' : '<span style=\"color:red\"> $1 </span> 部分抵抗 $3 法术 $4',
  '(.+) partially resist(s*) (.*) spell([\,;\.])' : '<span style=\"color:red\"> $1 </span> 部分抵抗了 $3 法术 $4',
  '(.+) resist(s*) (.*) spell([\,;\.])' : '<span style=\"color:red\"> $1 </span> 抵抗了 $3 法术 $4',
  '(.+) resist(s*) the attack([\,;\.])' : '<span style=\"color:red\"> $1 </span> 抵抗了攻击 $3',
  '(.+) (parry|parrys|parries) the attack from (.*)([\,;\.])' : '<span style=\"color:red\"> $1 </span> 招架了 <span style=\"color:red\"> $3 </span> 的攻击 $4',
  '(.+) shrugs off the effects of (.+) spell\.': '<span style=\"color:red\"> $1 </span> 摆脱了 <span style=\"color:red\"> $2 </span> 的法术.',
  '(.*) absorbs (.*) from the attack into': '$1 吸收了 $2 并转化为 ',
  '(.+) evade(s*) the attack from (.+)\.': '<span style=\"color:red\"> $1 </span> 闪避了 <span style=\"color:red\"> $3 </span> 的攻击.',
  ' (.+) evade(s*) the attack\.': '<span style=\"color:red\"> $1 </span> 闪避了攻击.',
  '(.+) evade(s*) the attack\.': '<span style=\"color:red\"> $1 </span> 闪避了攻击.',
  '(.*) (parry|parries) the attack from (.*)\.': '<span style=\"color:red\"> $1 </span> 招架了 <span style=\"color:red\"> $3 </span> 攻击.',
  ' (.+) (parry|parries) the attack\.': '<span style=\"color:red\"> $1 </span> 招架了攻击.',
  '(.+) (parry|parries) the attack\.': '<span style=\"color:red\"> $1 </span> 招架了攻击.',
  '(.+) (parry|parries) your attack\.': '<span style=\"color:red\"> $1 </span> 招架了 your 攻击.',
  '(.+) block(s*) the attack from (.*)\.': '<span style=\"color:red\"> $1 </span> 格挡了 <span style=\"color:red\"> $3 </span> 攻击.',
  '(.+) block(s*) the attack\.': '<span style=\"color:red\"> $1 </span> 格挡了攻击.',
  '(.+) block(s*) your attack\.': '<span style=\"color:red\"> $1 </span> 格挡了 your 攻击.',

  '(2|3|4)x-crit (.*),': '<span style=\"background:#FF0000;color:#FFFFFF\"> $1 倍暴击了</span> <span style=\"color:red\"> $2 </span>, ',
  '(.*)resisted(.*)': '$1被抵抗$2',

  '(.+) drain (.*) points of health from (.*).': '$1 从 <span style=\"color:red\">$3</span> 身上吸取 <span style=\"color:#80B440\"> $2 点生命 </span>.',
  '(.*) was hit(s*)': '<span style=\"color:red\">$1</span> <span style=\"color:#FF00FF\"> 被击中 </span>',
  '(.*) was crit(s*)': '<span style=\"color:red\">$1</span> <span style=\"background:#FF0000;color:#FFFFFF\">被暴击击中</span> ',
  '(.*) was (2|3|4)x-crit': '<span style=\"color:red\">$1</span> <span style=\"background:#FF0000;color:#FFFFFF\">被 $2 倍暴击击中</span> ',
  '(and )*take(s*)': '<span style=\"color:#FF00FF\"> 受到 </span>',
  '(causing|for) (\\d+)': '<span style=\"color:#FF00FF\"> 造成 </span> $2 ',
  'Recovered': '<span style=\"color:#1E90FF\">你</span> <span style=\"color:#80B440\"> 恢复了 </span>',
  'restores': '<span style=\"color:#80B440\"> 恢复了 </span><span style=\"color:#1E90FF\"> 你 </span>',

  '(.*) got knocked out of confuse': '<span style=\"color:red\"> $1 </span> 从混乱中脱离',
  'The effect (.+) was dispelled\.': '效果 $1 已被替换',
  'The effect (.+) on (.+) has (expired|worn off)': '<span style=\"color:red\"> $2 </span> <span style=\"color:	#b06161\">身上的状态 $1 已失效</span>',
  'The effect (.+) has (expired|worn off)': '<span style=\"background:#FB6901;color:black\">状态 $1 已失效</span>',
  'Cooldown expired for (.*)': '$1 <span style=\"background:#97ffb2;color:black\">已结束冷却</span>',

  //战斗系统文本
  'Spawned Monster': '生成怪物',
  'Initializing random encounter': '正在初始化随机遭遇战',
  'Initializing arena challenge': '正在初始化竞技场战斗',
  'Initializing Item World': '正在初始化道具界战斗',
  'Initializing Grindfest': '正在初始化压榨界战斗',
  'Initializing The Tower': '正在初始化塔楼战斗',
  '(.*) has been defeated': '<span style=\"background:#b3b3b3;color:black\">打败了</span> <span style=\"color:red\">$1</span>',
  'With the light of a new dawn, [yY]our experience in all things increases': '随着新的黎明的到来，你在所有事情上的经验都增加了',
  'have escaped from the battle': '从战斗中脱离了',
  'Time Bonus:': '快速回答奖励:',
  'The Riddlemaster listens to your answer, tries to keep a pensive face, then breaks into a wide grin': '谜语大师听了你的回答，努力保持沉思的表情，然后咧嘴大笑',
  'The Riddlemaster listens to your answer and winks at you': '谜语大师听了你的回答，向你眨眼',
  'The Riddlemaster listens to your answer and cackles hysterically.': '谜语大师听了你的回答，歇斯底里地笑了起来',
  'The Riddlemaster listens to your answer and grins mischievously.': '谜语大师听了你的回答，顽皮地笑了起来',
  'The Riddlemaster listens to your answer and shows no reaction whatsoever.': '谜语大师听了你的回答，没有任何反应',
  'The Riddlemaster listens to your answer and snorts ambiguously.': '谜语大师听了你的回答，含糊地哼了一声',
  'Insufficient overcharge or spirit for Spirit Stance.': '灵力或斗气值不足，无法开启灵动架势',
  'Insufficient overcharge to use': '斗气值不足，无法使用',
  'have been defeated': '被击败了',
  'Spirit Stance Engaged': '<span style=\"background:#e21a4e\">灵动架势开启</span>',
  'Spirit Stance Exhausted': '<span style=\"background:#f5b3c4;color:black\">灵动架势关闭</span>',
  'Spirit Stance Disabled': '<span style=\"background:#f5b3c4;color:black\">灵动架势无法维持</span>',
  'You are Victorious!': '你胜利了',
  'You gain': '你获得了',
  'You obtained': '你获得了',
  'fails due to insufficient Spirit': '由于灵力不足，没有生效',
  'Stop kicking the dead horse': '别鞭尸啦',
  'You gain no EXP due to exhaustion': '由于你已精疲力竭，因此无法获得经验',
  'Warning: Reached equipment inventory limit': '警告，装备库存已满',
  'Invalid target': '非法目标',
  'Item does not exist': '道具不存在',
  'Inventory slot is empty': '物品栏是空的',
  'You do not have a powerup gem': '宝石不存在',
  '(.*) dropped (.*)': '<span style=\"color:red\"> $1 </span> 掉落了 $2',

  '[yY]our': '<span style=\"color:#1E90FF\"> 你的 </span>',
  '[yY]ou': '<span style=\"color:#1E90FF\"> 你 </span>',

  // 伤害
  'Fire damage': '<span style=\"background:#f97c7c;color:black\">火焰伤害</span>',
  'fire damage': '<span style=\"background:#f97c7c;color:black\">火焰伤害</span>',
  'Cold damage': '<span style=\"background:#94c2f5;color:black\">冰冷伤害</span>',
  'cold damage': '<span style=\"background:#94c2f5;color:black\">冰冷伤害</span>',
  'Void damage': '<span style=\"background:#ffffff\;color:#5c5a5a\">虚空伤害</span>',
  'void damage': '<span style=\"background:#ffffff\;color:#5c5a5a\">虚空伤害</span>',
  'Elec damage': '<span style=\"background:#f4f375;color:black\">闪电伤害</span>',
  'elec damage': '<span style=\"background:#f4f375;color:black\">闪电伤害</span>',
  'Wind damage': '<span style=\"background:#7ff97c;color:#5c5a5a\">疾风伤害</span>',
  'wind damage': '<span style=\"background:#7ff97c;color:#5c5a5a\">疾风伤害</span>',
  'Dark damage': '<span style=\"background:#000000\;color:#ffffff\">黑暗伤害</span>',
  'dark damage': '<span style=\"background:#000000\;color:#ffffff\">黑暗伤害</span>',
  'Holy damage': '<span style=\"background:#ffffff\;color:#000000\">神圣伤害</span>',
  'holy damage': '<span style=\"background:#ffffff\;color:#000000\">神圣伤害</span>',
  'Spirit damage': '<span style=\"color:#a2042c\">灵力值伤害</span>',
  'spirit damage': '<span style=\"color:#a2042c\">灵力值伤害</span>',

  'Crushing damage': '<span style=\"background:#000000\;color:#F6F504\">打击伤害</span>',
  'crushing damage': '<span style=\"background:#000000\;color:#F6F504\">打击伤害</span>',
  'Slashing damage': '<span style=\"background:#000000\;color:#F6F504\">斩击伤害</span>',
  'slashing damage': '<span style=\"background:#000000\;color:#F6F504\">斩击伤害</span>',
  'Piercing damage': '<span style=\"background:#000000\;color:#F6F504\">刺击伤害</span>',
  'piercing damage': '<span style=\"background:#000000\;color:#F6F504\">刺击伤害</span>',
  'damage': '伤害',
  'gain': '获得',
  'additional points of': '点额外',
  'points of': '点',

//   'Magic Points': '点<span style=\"color:#639AD4\"> 魔力 </span>',
//   '(.*) evades your attack': '<span style=\"color:red\">$1</span> <span style=\"color:#1E90FF\">闪避了你的攻击</span>',
//   '(.*) evades your spell': '<span style=\"color:red\">$1</span> <span style=\"color:#1E90FF\">闪避了你的法术</span>',

//   'You casts?': '<span style=\"color:#1E90FF\">你</span><span style=\"background:#7CFC00;color:black\">咏唱了</span>',
//   '(.*) casts?': '<span style=\"color:red\">$1</span><span style=\"background:#7CFC00;color:black\">咏唱了</span>',
//   'uses': '<span style=\"background:#ADFF2F;color:black\">使用了</span>',
//   'and hits you for': '<span style=\"color:#FF00FF\">并击中了</span> <span style=\"color:#1E90FF\">你</span> for',
//   'and hits (.*) for': '<span style=\"color:#FF00FF\">并击中了</span> <span style=\"color:red\">$1</span> for',
//   'which partially parries,': '但被部分招架了',
//   '(.*)([\,;] )(.+?) partially parries the attack,' : '$1$2<span style=\"color:red\">$3</span>部分招架了攻击',
//   '(.*) hits you for': '<span style=\"color:red\">$1</span> <span style=\"color:#FF00FF\">击中了</span> <span style=\"color:#1E90FF\">你</span> for',
//   '(.*) hits (.*) for': '<span style=\"color:red\">$1</span> <span style=\"color:#FF00FF\">击中了</span> <span style=\"color:red\">$2</span> for',
//   'and hits': '<span style=\"color:#FF00FF\">并击中了</span>',
//   'and hits you': '<span style=\"color:#FF00FF\">并击中了</span>',
//   '(.*) hits (.*),': '<span style=\"color:red\">$1</span> <span style=\"color:#FF00FF\">击中了</span> <span style=\"color:red\">$2</span>,',
//   'and crits': '<span style=\"background:#FF0000;color:#FFFFFF\">并暴击了</span>',
//   '(.*) crits': '<span style=\"color:red\">$1</span> <span style=\"background:#FF0000;color:#FFFFFF\">暴击了</span>',
//   'and crits': '<span style=\"background:#FF0000;color:#FFFFFF\">并暴击了</span>',
//   '(.*) was crit': '<span style=\"color:red\">$1</span> <span style=\"background:#FF0000;color:#FFFFFF\">暴击了</span>',
//   'and blasts': '<span style=\"background:#FF0000;color:#FFFFFF\">并暴击了</span>',
//   'blasts': '<span style=\"background:#FF0000;color:#FFFFFF\">暴击了</span>',
//   'You use': '<span style=\"color:#1E90FF\">你</span><span style=\"background:#ADFF2F;color:black\">使用了</span>',

//   'You gains? the effect': '<span style=\"color:#1E90FF\">你</span> <span style=\"background:#ADFF2F;color:black">获得了状态</span>',
//   '(.*) gains? the effect': '<span style=\"color:red\">$1</span> <span style=\"background:#ADFF2F;color:black">获得了状态</span>',
//   'You crit (.*) for': '<span style=\"color:#1E90FF\">你</span><span style=\"background:#FF0000;color:#FFFFFF\">暴击了</span><span style=\"color:red\">$1</span> for',
//   'You hit (.*) for': '<span style=\"color:#1E90FF\">你</span><span style=\"color:#FF00FF\">击中了 </span><span style=\"color:red\">$1</span> for',
//   'You crit (.*),': '<span style=\"color:#1E90FF\">你</span><span style=\"background:#FF0000;color:#FFFFFF\">暴击了</span><span style=\"color:red\">$1</span>',
//   'You hit (.*),': '<span style=\"color:#1E90FF\">你</span><span style=\"color:#FF00FF\">击中了 </span><span style=\"color:red\">$1</span>，',
//   'You are healed for (.*) Health Points': '你获得<span style=\"color:#80B440\"> $1 点生命</span>的治疗',
//   '(.*) evade the attack from (.*)\.': '<span style=\"color:red\">$1</span> <span style=\"color:#696969\">闪避了 <span style=\"color:red\">$2</span> 的攻击.</span>',
//   'partially block and parry the attack, and take': '<span style=\"color:#696969\">部分格挡并招架了攻击，并受到</span>',
//   'partially block and partially parry the attack, and take': '<span style=\"color:#696969\">部分格挡并部分招架了攻击，并受到</span>',
//   'partially block the attack, and take': '<span style=\"color:#696969\">部分格挡了攻击，并受到</span>',
//   'partially parry the attack, and take': '<span style=\"color:#696969\">部分招架了攻击，并受到</span>',
//   'block and partially parry the attack, and take': '<span style=\"color:#696969\">格挡并部分招架了攻击，并受到</span>',
//   'block and partially parry the attack from (.*)\.': '<span style=\"color:#696969\">格挡并部分招架了</span> <span style=\"color:red\">$1</span> <span style=\"color:#696969\">的攻击</span>',
//   'partially block and parry the attack from (.*)\.': '<span style=\"color:#696969\">部分格挡并招架了</span> <span style=\"color:red\">$1</span> <span style=\"color:#696969\">的攻击</span>',
//   'You block the attack from (.*)\.': '<span style=\"color:#696969\"><span style=\"color:#1E90FF\">你</span>格挡了 <span style=\"color:red\">$1</span> 的攻击</span>',
//   'You parry the attack from (.*)\.': '<span style=\"color:#696969\"><span style=\"color:#1E90FF\">你</span>招架了 <span style=\"color:red\">$1</span> 的攻击</span>',
//   'You evade the attack': '<span style=\"color:#696969\"><span style=\"color:#1E90FF\">你</span>闪避了这次攻击</span>',
//   'You block the attack': '<span style=\"color:#696969\"><span style=\"color:#1E90FF\">你</span>格挡了这次攻击</span>',
//   'You parry the attack': '<span style=\"color:#696969\"><span style=\"color:#1E90FF\">你</span>招架了这次攻击</span>',

//   'counter (.*) for (.*)': '<span style=\"background:#FFFF00\;color:black">反击</span> <span style=\"color:red\">$1</span><span style=\"color:#FF00FF\">造成 $2</span>',
//   'healing (.*) for (.*) points of health': '治疗 $1 <span style=\"color:#80B440\"> $2 点生命</span>',
//   'but is absorbed': '但被吸收了',
//   'resisted\\)': '被抵抗)',
//   'from the brink of defeat': '<span style=\"background:#2E6F15\;color:#FFFFFF">从死亡的边缘复活了</span>',
//   'take': '受到了',
//   'and takes': '并受到',
//   'which hits!': '命中了!',
//   'which glances!': '部分命中了!',
//   'which crits!': '造成了<span style=\"background:#FF0000;color:#FFFFFF\">暴击</span>!',
//   '2x-crit (.*),': '<span style=\"background:#FF0000;color:#FFFFFF\">2倍暴击</span>了 <span style=\"color:red\">$1</span>，',

//   '(.*) glances (.+?)[\,;]': '<span style=\"color:red\">$1</span> <span style=\"color:#FF00FF\">部分击中</span> <span style=\"color:red\">$2</span>, ',
//   'glance (.*),': '的攻击部分命中<span style=\"color:red\">$1</span>',
//   'spell fails to connect.': '吟唱失败',
//   'misses the attack against': '攻击没有命中',
//   'but misses the attack.': '但这次攻击没有命中',

//   '(.*) parries your attack': '<span style=\"color:red\">$1</span><span style=\"background:#00FFFF;color:black\">招架了<span style=\"color:#1E90FF\">你</span>的攻击</span>',
//   '(.*) parries the attack from (.*)' : '<span style=\"color:red\">$1</span><span style=\"background:#00FFFF;color:black\">招架了<span style=\"color:red\">$2</span>的攻击</span>',


//   '(.*) partially resists the effects of your spell.': '<span style=\"color:red\">$1</span> <span style=\"background:#81f7f3;color:black\">部分抵抗了<span style=\"color:#1E90FF\">你</span>的魔法</span>',
//   '(.*) resists your spell.': '<span style=\"color:red\">$1</span> <span style=\"background:#81f7f3;color:black\">抵抗了<span style=\"color:#1E90FF\">你</span>的魔法</span>',

//   'dodges (.*?) attack.' : '躲避了<span style=\"color:#1E90FF\"><span style=\"color:red\">$1</span></span>的攻击',



  //结算时各项经验的翻译文本
  'have reached Level': '<span style=\"background:#00FF00\">升级至</span>',
  'one-handed weapon proficiency': '单手武器的熟练度',
  'two-handed weapon proficiency': '双手武器的熟练度',
  'one-handed proficiency': '单手熟练度',
  'two-handed proficiency': '双手熟练度',
  'dual wielding proficiency': '双持熟练度',
  'staff proficiency': '法杖熟练度',
  'cloth armor proficiency': '布甲熟练度',
  'light armor proficiency': '轻甲熟练度',
  'heavy armor proficiency': '重甲熟练度',
  'elemental magic proficiency': '元素魔法熟练度',
  'divine magic proficiency': '神圣魔法熟练度',
  'forbidden magic proficiency': '黑暗魔法熟练度',
  'deprecating magic proficiency': '减益魔法熟练度',
  'supportive magic proficiency': '增益魔法熟练度',

  'A traveling salesmoogle gives': '自动出售后给予了',
  'for it': '',
  'A traveling salesmoogle salvages it into': '自动分解后给予了',
  'Arena Token Bonus!': '获得竞技场令牌奖励!',
  'Battle Clear Bonus!': '获得战斗胜利奖励!',


  'Capacitor Level': '电容器（魔力+2%/级） 等级',
  'Juggernaut Level': '勇士（生命+2%/级） 等级',
  'Butcher Level': '屠夫（武器攻击伤害+2%/级） 等级',
  'Fatality Level': '致命（攻击暴击伤害+2%/级） 等级',
  'Overpower Level': '压制（反招架率+4%/级） 等级',
  'Swift Strike Level': '迅捷打击（攻速+1.92%/级） 等级',
  'Annihilator Level': '毁灭者（魔法暴击伤害+2%/级） 等级',
  'Archmage Level': '大法师（武器魔法伤害+2%/级） 等级',
  'Economizer Level': '节约者（魔力消耗减免+5%/级） 等级',
  'Penetrator Level': '穿透者（反抵抗率+4%/级） 等级',
  'Spellweaver Level': '织法者（施法速度+1.5%/级） 等级',
  'Hollowforged': '虚空升华',
  'Coldproof Level': '抗寒（冰冷抗性+4%/级） 等级',
  'Darkproof Level': '驱暗（黑暗抗性+4%/级） 等级',
  'Elecproof Level': '绝缘（闪电抗性+4%/级） 等级',
  'Fireproof Level': '耐热（火焰抗性+4%/级） 等级',
  'Holyproof Level': '驱圣（神圣抗性+4%/级） 等级',
  'Windproof Level': '防风（疾风抗性+4%/级） 等级',

  'Unlocked': '解锁',
  'innate': '内在',
  'potential:': '潜能:',
  'potential has increased by': '潜经验提升了',
  'points!': '点',

  // 恢复
  'Refreshment': '灵力长效药',
  'Regeneration': '生命长效药',
  'Replenishment': '魔力长效药',
  'Kicking Ass': '海扁',
  'Sleeper Imprint': '沉睡烙印',

  // BUFF 效果
  'Regen': '细胞活化',
  'Protection': '守护',
  'Spirit Shield': '灵力盾',
  'Hastened': '急速',
  'Shadow Veil': '影纱',
  'Absorbing Ward': '吸收结界',
  'Spark of Life': '生命火花',
  'Cloak of the Fallen': '陨落斗篷',
  'Heartseeker': '觅心者',
  'Arcane Focus': '奥术集中',
  'Channeling': '引导',
  'Fleeing': '逃跑',
  'Blessing of the RiddleMaster': '御谜士的祝福',

  // 怪物 DEBUFF 效果
  'Vital Theft': '<span style="color:white;"> 生命汲取 </span>',
  'Ether Theft': '魔力汲取',
  'Spirit Theft': '灵力汲取',
  'Confused': '混乱',
  'Hastened': '急速',
  'Absorbing Ward': '吸收结界',
  'Slowed': '缓慢',
  'Weakened': '虚弱',
  'Imperiled': '陷危',
  'Blinded': '盲目',
  'Asleep': '沉眠',
  'Silenced': '沉默',
  'Magically Snared': '魔磁网',
  'Immobilized' : '魔磁网',

  //战斗风格
  'Overwhelming Strikes': '压制打击',
  'Coalesced Mana': '魔力合流',
  'Ether Tap': '魔力回流',

  // 物品
  'drops a Health Gem powerup!': '掉落了一颗生命宝石',
  'drops a Mana Gem powerup!': '掉落了一颗魔力宝石',
  'drops a Spirit Gem powerup!': '掉落了一颗灵力宝石',
  'drops a Mystic Gem powerup!': '掉落了一颗神秘宝石',
  'Health Gem': '生命宝石',
  'Mana Gem': '魔力宝石',
  'Spirit Gem': '灵力宝石',
  'Mystic Gem': '神秘宝石',
  'Health Potion': '体力药水',
  'Health Draught': '体力长效药',
  'Health Elixir': '体力秘药',
  'Mana Potion': '法力药水',
  'Mana Draught': '法力长效药',
  'Mana Elixir': '法力秘药',
  'Spirit Potion': '灵力药水',
  'Spirit Draught': '灵力长效药',
  'Spirit Elixir': '灵力秘药',
  'Last Elixir': '终极秘药',
  'Energy Drink': '能量饮料',
  'Caffeinated Candy': '咖啡因糖果',
  'Soul Stone': '灵魂石',
  'Flower Vase': '花瓶',
  'Bubble-Gum': '泡泡糖',
  'Infusion of Darkness': '黑暗魔药',
  'Infusion of Divinity': '神圣魔药',
  'Infusion of Storms': '风暴魔药',
  'Infusion of Lightning': '闪电魔药',
  'Infusion of Frost': '冰冷魔药',
  'Infusion of Flames': '火焰魔药',
  'Infusion of Gaia': '盖亚魔药',
  'Scroll of Swiftness': '加速卷轴',
  'Scroll of the Avatar': '化身卷轴',
  'Scroll of Shadows': '幻影卷轴',
  'Scroll of Absorption': '吸收卷轴',
  'Scroll of Life': '生命卷轴',
  'Scroll of Protection': '守护卷轴',
  'Scroll of 守护': '守护卷轴',
  'Scroll of the Gods': '众神卷轴',
  'Soul Fragments': '灵魂碎片',

  //攻击咒语效果
  'Searing Skin': '焦灼皮肤',
  'Freezing Limbs': '冰封肢体',
  'explodes': '爆裂',
  'Turbulent Air': '空气湍流',
  'Deep Burns': '深层烧伤',
  'Breached Defense': '防御崩溃',
  'Blunted Attack': '攻击钝化',

  // 技能
  'offhand': '<span style=\"color:#1E90FF\">副手攻击</span>',
  'Flee': '逃跑',
  'Scan': '扫描',
  'FUS RO DAH': '龙吼',
  'Orbital Friendship Cannon': '<font color="#FF0000">友</font><font color="#CC0033">谊</font><font color="#990066">小</font><font color="#660099">马</font><font color="#3300CC">炮</font>',
  'Concussive Strike': '震荡打击',
  'Skyward Sword': '天空之剑',
  'Frenzied Blows': '狂乱百裂斩',
  'Iris Strike': '虹膜打击',
  'Backstab': '背刺',
  'Shatter Strike': '粉碎打击',
  'Rending Blow': '撕裂打击',
  'Great Cleave': '大劈砍',
  'Merciful Blow': '最后的慈悲',
  'Shield Bash': '盾击',
  'Vital Strike': '致命打击',
  'Arcane Blow': '奥术冲击',

  'Fiery Blast': '炎爆术(Ⅰ)',
  'Inferno': '地狱火(Ⅱ)',
  'Flames of Loki': '邪神之火(Ⅲ)',
  'Freeze': '冰冻(Ⅰ)',
  'Blizzard': '暴风雪(Ⅱ)',
  'Fimbulvetr': '芬布尔之冬(Ⅲ)',
  'Shockblast': '电能爆破(Ⅰ)',
  'Chained Lightning': '连锁闪电(Ⅱ)',
  'Wrath of Thor': '雷神之怒(Ⅲ)',
  'Gale': '烈风(Ⅰ)',
  'Downburst': '下击暴流(Ⅱ)',
  'Storms of Njord': '尼奥尔德风暴(Ⅲ)',
  'Smite': '惩戒(Ⅰ)',
  'Banishment': '放逐(Ⅱ)',
  'Paradise Lost': '失乐园(Ⅲ)',
  'Corruption': '腐化(Ⅰ)',
  'Disintegrate': '瓦解(Ⅱ)',
  'Ragnarok': '诸神黄昏(Ⅲ)',

  'Drain': '枯竭',
  'Slow': '缓慢',
  'Weaken': '虚弱',
  'Silence': '沉默',
  'Sleep': '沉眠',
  'Confuse': '混乱',
  'Imperil': '陷危',
  'Blind': '致盲',
  'MagNet': '魔磁网',
  'Immobilize' : '魔磁网',

  'Regen': '细胞活化',
  'Full-Cure': '完全治疗术',
  'Cure': '治疗术',
  'Haste': '急速',
  'Protection': '守护',
  'Shadow Veil': '影纱',
  'Absorb': '吸收',
  'Spark of Life': '生命火花',
  'Arcane Focus': '奥术集中',
  'Heartseeker': '觅心者',
  '[sS]pirit [sS]hield': '灵力盾',

  //武器效果
  'Penetrated Armor': '破甲',
  'Stunned': '眩晕',
  'Bleeding Wound': '<span style="color:white;"> 流血 </span>',
  'Void Strike': '<span style=\"color:#1E90FF\">虚空打击</span>',
  'Fire Strike': '<span style=\"color:#1E90FF\">火焰打击</span>',
  'Cold Strike': '<span style=\"color:#1E90FF\">冰霜打击</span>',
  'Elec Strike': '<span style=\"color:#1E90FF\">闪电打击</span>',
  'Wind Strike': '<span style=\"color:#1E90FF\">狂风打击</span>',
  'Holy Strike': '<span style=\"color:#1E90FF\">神圣打击</span>',
  'Dark Strike': '<span style=\"color:#1E90FF\">黑暗打击</span>',
  'spike shield': '<span style=\"color:#1E90FF\">刺盾</span>',

  //属性
  'health': '<span style=\"color:#80B440\">生命</span>',
  'magic': '<span style=\"color:#639AD4\">魔力</span>',
  'spirit': '<span style=\"color:#D4637A\">灵力</span>',
};

var items = {
        //道具翻译
        'Health Potion' : '体力药水',
        'Health Draught' : '体力长效药',
        'Health Elixir' : '终极体力药',
        'Mana Potion' : '法力药水',
        'Mana Draught' : '法力长效药',
        'Mana Elixir' : '终极法力药',
        'Spirit Potion' : '灵力药水',
        'Spirit Draught' : '灵力长效药',
        'Spirit Elixir' : '终极灵力药',
        'Monster Chow' : '怪物饲料',
        'Last Elixir' : '终极秘药',
        'Energy Drink' : '能量饮料',
        'Caffeinated Candy' : '咖啡因糖果',
        'Golden Lottery Ticket' : '黄金彩票券',
        'Soul Stone' : '灵魂石',
        'Flower Vase' : '花瓶',
        'Bubble-Gum' : '泡泡糖',
        'Binding of Slaughter':  '粘合剂 基础物理伤害',
        'Binding of Balance':  '粘合剂 物理命中率',
        'Binding of Isaac':  '粘合剂 物理暴击率',
        'Binding of Destruction':  '粘合剂 基础魔法伤害',
        'Binding of Focus':  '粘合剂 魔法命中率',
        'Binding of Friendship':  '粘合剂 魔法暴击率',
        'Binding of Protection':  '粘合剂 物理减伤',
        'Binding of Warding':  '粘合剂 魔法减伤',
        'Binding of the Fleet':  '粘合剂 回避率',
        'Binding of the Barrier':  '粘合剂 格挡率',
        'Binding of the Nimble':  '粘合剂 招架率',
        'Binding of Negation':  '粘合剂 抵抗率',
        'Binding of the Ox':  '粘合剂 力量',
        'Binding of the Raccoon':  '粘合剂 灵巧',
        'Binding of the Cheetah':  '粘合剂 敏捷',
        'Binding of the Turtle':  '粘合剂 体质',
        'Binding of the Fox':  '粘合剂 智力',
        'Binding of the Owl':  '粘合剂 智慧',
        'Binding of the Elementalist':  '粘合剂 元素魔法熟练度',
        'Binding of the Heaven-sent':  '粘合剂 神圣魔法熟练度',
        'Binding of the Demon-fiend':  '粘合剂 黑暗魔法熟练度',
        'Binding of the Curse-weaver':  '粘合剂 减益魔法熟练度',
        'Binding of the Earth-walker':  '粘合剂 增益魔法熟练度',
        'Binding of Surtr':  '粘合剂 火属性咒语伤害',
        'Binding of Niflheim':  '粘合剂 冰属性咒语伤害',
        'Binding of Mjolnir':  '粘合剂 雷属性咒语伤害',
        'Binding of Freyr':  '粘合剂 风属性咒语伤害',
        'Binding of Heimdall':  '粘合剂 圣属性咒语伤害',
        'Binding of Fenrir':  '粘合剂 暗属性咒语伤害',
        'Binding of Dampening':  '粘合剂 敲击减伤',
        'Binding of Stoneskin':  '粘合剂 斩击减伤',
        'Binding of Deflection':  '粘合剂 刺击减伤',
        'Binding of the Fire-eater':  '粘合剂 火属性减伤',
        'Binding of the Frost-born':  '粘合剂 冰属性减伤',
        'Binding of the Thunder-child':  '粘合剂 雷属性减伤',
        'Binding of the Wind-waker':  '粘合剂 风属性减伤',
        'Binding of the Thrice-blessed':  '粘合剂 圣属性减伤',
        'Binding of the Spirit-ward':  '粘合剂 暗属性减伤',

        'Infusion of Darkness' : '黑暗魔药',
        'Infusion of Divinity' : '神圣魔药',
        'Infusion of Storms' : '风暴魔药',
        'Infusion of Lightning' : '闪电魔药',
        'Infusion of Frost' : '冰冷魔药',
        'Infusion of Flames' : '火焰魔药',
        'Infusion of Gaia' : '盖亚魔药',
        'Scroll of Swiftness' : '加速卷轴',
        'Scroll of the Avatar' : '化身卷轴',
        'Scroll of Shadows' : '幻影卷轴',
        'Scroll of Absorption' : '吸收卷轴',
        'Scroll of Life' : '生命卷轴',
        'Scroll of Protection' : '保护卷轴',
        'Scroll of the Gods' : '神之卷轴',
        'Crystal of Vigor' : '力量水晶',
        'Crystal of Finesse' : '灵巧水晶',
        'Crystal of Swiftness' : '敏捷水晶',
        'Crystal of Fortitude' : '体质水晶',
        'Crystal of Cunning' : '智力水晶',
        'Crystal of Knowledge' : '智慧水晶',
        'Crystal of Flames' : '火焰水晶',
        'Crystal of Frost' : '冰冻水晶',
        'Crystal of Lightning' : '闪电水晶',
        'Crystal of Tempest' : '疾风水晶',
        'Crystal of Devotion' : '神圣水晶',
        'Crystal of Corruption' : '暗黑水晶',
        'Crystal of Quintessence' : '灵魂水晶',

        'Monster Edibles' : '怪物食品',
        'Monster Cuisine' : '怪物料理',
        'Happy Pills' : '快乐药丸',

        'Wispy Catalyst' : '纤小 催化剂',
        'Diluted Catalyst' : '稀释 催化剂',
        'Regular Catalyst' : '平凡 催化剂',
        'Robust Catalyst' : '充沛 催化剂',
        'Vibrant Catalyst' : '活力 催化剂',
        'Coruscating Catalyst' : '闪耀 催化剂',
        'Low-Grade Cloth': '低级布料',
        'Mid-Grade Cloth': '中级布料',
        'High-Grade Cloth': '高级布料',
        'Low-Grade Leather': '低级皮革',
        'Mid-Grade Leather': '中级皮革',
        'High-Grade Leather': '高级皮革',
        'Low-Grade Metals': '低级金属',
        'Mid-Grade Metals': '中级金属',
        'High-Grade Metals': '高级金属',
        'Low-Grade Wood': '低级木头',
        'Mid-Grade Wood': '中级木头',
        'High-Grade Wood': '高级木头',
        'Scrap Metal' : '金属废料',
        'Scrap Leather' : '皮革废料',
        'Scrap Wood' : '木材废料',
        'Scrap Cloth' : '布制废料',
        'Energy Cell' : '能量元',
        'Defense Matrix Modulator' : '力场碎片(盾)',
        'Repurposed Actuator' : '动力碎片(重)',
        'Shade Fragment' : '暗影碎片(轻)',
        'Crystallized Phazon' : '相位碎片(布)',
        'Legendary Weapon Core' : '传奇武器核心',
        'Peerless Weapon Core' : '无双武器核心',
        'Legendary Staff Core' : '传奇法杖核心',
        'Peerless Staff Core' : '无双法杖核心',
        'Legendary Armor Core' : '传奇护甲核心',
        'Peerless Armor Core' : '无双护甲核心',
        'Voidseeker Shard' : '虚空碎片',
        'Featherweight Shard' : '羽毛碎片',
        'Aether Shard' : '以太碎片',
        'Amnesia Shard' : '重铸碎片',
        'Soul Fragment' : '灵魂碎片',
        'Blood Token' : '鲜血令牌',
        'Token of Blood' : '鲜血令牌',
        'Chaos Token' : '混沌令牌',

        "Silk Charm Pouch": "丝绸护符袋",
        "Kevlar Charm Pouch": "凯夫拉护符袋",
        "Mithril Charm Pouch": "秘银护符袋",
        "Lesser Featherweight Charm": "次级轻羽护符",
        "Greater Featherweight Charm": "强效轻羽护符",
        "Lesser Hollowforged Charm": "次级虚空升华护符",
        "Greater Hollowforged Charm": "强效虚空升华护符",
        "Lesser Fire Strike Charm": "次级火焰打击护符",
        "Greater Fire Strike Charm": "强效火焰打击护符",
        "Lesser Cold Strike Charm": "次级寒冰打击护符",
        "Greater Cold Strike Charm": "强效寒冰打击护符",
        "Lesser Lightning Strike Charm": "次级闪电打击护符",
        "Greater Lightning Strike Charm": "强效闪电打击护符",
        "Lesser Wind Strike Charm": "次级狂风打击护符",
        "Greater Wind Strike Charm": "强效狂风打击护符",
        "Lesser Holy Strike Charm": "次级神圣打击护符",
        "Greater Holy Strike Charm": "强效神圣打击护符",
        "Lesser Dark Strike Charm": "次级黑暗打击护符",
        "Greater Dark Strike Charm": "强效黑暗打击护符",
        "Lesser Butcher Charm": "次级物理伤害加成护符",
        "Greater Butcher Charm": "强效物理伤害加成护符",
        "Lesser Swiftness Charm": "次级迅捷护符",
        "Greater Swiftness Charm": "强效迅捷护符",
        "Lesser Fatality Charm": "次级物理暴击护符",
        "Greater Fatality Charm": "强效物理暴击护符",
        "Lesser Overpower Charm": "次级反招架护符",
        "Greater Overpower Charm": "强效反招架护符",
        "Lesser Voidseeker Charm": "次级虚空护符",
        "Greater Voidseeker Charm": "强效虚空护符",
        "Lesser Archmage Charm": "次级魔法伤害加成护符",
        "Greater Archmage Charm": "强效魔法伤害加成护符",
        "Lesser Economizer Charm": "次级节能护符",
        "Greater Economizer Charm": "强效节能护符",
        "Lesser Spellweaver Charm": "次级高速咏唱护符",
        "Greater Spellweaver Charm": "强效高速咏唱护符",
        "Lesser Annihilator Charm": "次级魔法暴击护符",
        "Greater Annihilator Charm": "强效魔法暴击护符",
        "Lesser Penetrator Charm": "次级反魔法抵抗护符",
        "Greater Penetrator Charm": "强效反魔法抵抗护符",
        "Lesser Aether Charm": "次级以太护符",
        "Greater Aether Charm": "强效以太护符",
        "Lesser Fire-proof Charm": "次级火焰抗性护符",
        "Greater Fire-proof Charm": "强效火焰抗性护符",
        "Lesser Cold-proof Charm": "次级寒冰抗性护符",
        "Greater Cold-proof Charm": "强效寒冰抗性护符",
        "Lesser Lightning-proof Charm": "次级闪电抗性护符",
        "Greater Lightning-proof Charm": "强效闪电抗性护符",
        "Lesser Wind-proof Charm": "次级狂风抗性护符",
        "Greater Wind-proof Charm": "强效狂风抗性护符",
        "Lesser Holy-proof Charm": "次级神圣抗性护符",
        "Greater Holy-proof Charm": "强效神圣抗性护符",
        "Lesser Dark-proof Charm": "次级黑暗抗性护符",
        "Greater Dark-proof Charm": "强效黑暗抗性护符",
        "Lesser Juggernaut Charm": "次级生命加成护符",
        "Greater Juggernaut Charm": "强效生命加成护符",
        "Lesser Capacitor Charm": "次级魔力加成护符",
        "Greater Capacitor Charm": "强效魔力加成护符",
        "World Seed": "世界种子",

        'Precursor Artifact' : '古遗物',
        'ManBearPig Tail' : '人熊猪的尾巴(等级2)',
        'Mithra\'s Flower' : '猫人族的花(等级2)',
        'Holy Hand Grenade of Antioch' : '安提阿的神圣手榴弹(等级2)',
        'Dalek Voicebox' : '戴立克音箱(等级2)',
        'Lock of Blue Hair' : '一绺蓝发(等级2)',
        'Bunny-Girl Costume' : '兔女郎装(等级3)',
        'Hinamatsuri Doll' : '雏人形(等级3)',
        'Broken Glasses' : '破碎的眼镜(等级3)',
        'Sapling' : '树苗(等级4)',
        'Black T-Shirt' : '黑色Ｔ恤(等级4)',
        'Unicorn Horn' : '独角兽的角(等级5)',
        'Noodly Appendage' : '面条般的附肢(等级6)',

        'Bronze Coupon' : '铜礼券(等级3)',
        'Silver Coupon' : '银礼券(等级5)',
        'Gold Coupon' : '黄金礼券(等级7)',
        'Platinum Coupon' : '白金礼券(等级8)',
        'Peerless Voucher' : '无双凭证',


        //节日及特殊奖杯
        'Mysterious Box' : '神秘宝盒(等级9)', // 在‘训练：技能推广’调整价格后赠予某些玩家。
        'Solstice Gift' : '冬至赠礼(等级7)', //  2009 冬至
        'Stocking Stuffers' : '圣诞袜小礼物(等级7)', // 2009年以来每年圣诞节礼物。
        'Tenbora\'s Box' : '天菠拉的盒子(等级9)', // 年度榜单或者年度活动奖品
        'Shimmering Present' : '微光闪动的礼品(等级8)', //  2010 圣诞节
        'Potato Battery' : '马铃薯电池(等级7)', // 《传送门 2》发售日
        'RealPervert Badge' : '真-变态胸章(等级7)', // 2011 愚人节
        'Rainbow Egg' : '彩虹蛋(等级8)', //  2011 复活节
        'Colored Egg' : '彩绘蛋(等级7)', //  2011 复活节
        'Raptor Jesus' : '猛禽耶稣(等级7)', //  哈罗德·康平的被提预言
        'Gift Pony' : '礼品小马(等级8)', // 2011 圣诞节
        'Faux Rainbow Mane Cap' : '人造彩虹鬃毛帽(等级8)', //  2012 复活节
        'Pegasopolis Emblem' : '天马族徽(等级7)', // 2012 复活节
        'Fire Keeper Soul' : '防火女的灵魂(等级8)', // 2012 圣诞节
        'Crystalline Galanthus' : '结晶雪花莲(等级8)', // 2013 复活节
        'Sense of Self-Satisfaction' : '自我满足感(等级7)', // 2013 复活节
        'Six-Lock Box' : '六道锁盒子(等级8)', // 2013 圣诞节
        'Golden One-Bit Coin' : '金色一比特硬币(等级8)', // 2014 复活节
        'USB ASIC Miner' : '随身型特定应用积体电路挖矿机(等级7)', // 2014 复活节
        'Reindeer Antlers' : '驯鹿鹿角(等级8)', // 2014 圣诞节
        'Ancient Porn Stash' : '古老的色情隐藏档案(等级8)', // 2015 复活节
        'VPS Hosting Coupon' : '虚拟专用服务器代管优惠券(等级7)', // 2015 复活节
        'Heart Locket' : '心型盒坠(等级8)', // 2015 圣诞节
        'Holographic Rainbow Projector' : '全像式彩虹投影机(等级8)', // 2016 复活节
        'Pot of Gold' : '黄金罐(等级7)', // 2016 复活节
        'Dinosaur Egg' : '恐龙蛋(等级8)', // 2016 圣诞节
        'Precursor Smoothie Blender' : '旧世界冰沙机(等级8)', // 2017 复活节
        'Rainbow Smoothie' : '彩虹冰沙(等级7)', // 2017 复活节
        'Mysterious Tooth' : '神秘的牙齿(等级8)', // 2017 圣诞节
        'Grammar Nazi Armband' : '语法纳粹臂章(等级7)', // 2018 复活节
        'Abstract Wire Sculpture' : '抽象线雕(等级8)', // 2018 复活节
        'Delicate Flower' : '娇嫩的花朵(等级8)', // 2018 圣诞节
        'Assorted Coins' : '什锦硬币(等级7)', // 2019 复活节
        'Coin Collector\'s Guide' : '硬币收藏家指南(等级8)', // 2019 复活节
        'Iron Heart' : '钢铁之心(等级8)', // 2019 圣诞节
        'Shrine Fortune' : '神社灵签(等级7)', // 2020起复活节
        'Plague Mask' : '瘟疫面具(等级8)', // 2020 复活节
        'Festival Coupon' : '节日礼券(等级7)', //2020起收获节（中秋？）
        'Annoying Gun' : '烦人的枪(等级8)', //2020 圣诞节
        'Vaccine Certificate' : '疫苗证明(等级8)', //2021 复活节
        'Barrel' : '酒桶(等级8)', //2021 圣诞节
        'CoreCare Starter Kit' : '核心服务工具套件(等级8)', //2022 复活节
        'Star Compass' : '星罗盘(等级8)', //2022 圣诞节
        'Museum Ticket' : '博物馆门票(等级8)', // 2023 复活节
        'Idol Fan Starter Pack' : '偶像粉丝入门包(等级8)', //2023 圣诞节
        'AI-Based Captcha Solver' : '人工智能验证码破解器(等级8)', //2024 复活节
        'Marten Pelt' : '貂皮(等级8)', //2024 圣诞节
        'Snowflake Bunny Girl Figure' : '雪花兔女郎玩偶(等级8)', //2025 复活节


        //旧旧古董
        'Priceless Ming Vase' : '无价的明朝瓷器',
        'Grue' : '格鲁',
        'Seven-Leafed Clover' : '七叶幸运草',
        'Rabbit\'s Foot' : '幸运兔脚',
        'Wirt\'s Leg' : '维特之脚',
        'Wirts Leg' : '维特之脚',
        'Shark-Mounted Laser' : '装在鲨鱼头上的激光枪',
        'BFG9000' : 'BFG9000',
        'Railgun' : '磁道炮',
        'Flame Thrower' : '火焰喷射器',
        'Small Nuke' : '小型核武',
        'Chainsaw Oil' : '电锯油',
        'Chainsaw Fuel' : '电锯燃油',
        'Chainsaw Chain' : '电锯链',
        'Chainsaw Safety Manual' : '电锯安全手册',
        'Chainsaw Repair Guide' : '电锯维修指南',
        'Chainsaw Guide Bar' : '电锯导板',
        'ASHPD Portal Gun' : '光圈科技传送门手持发射器',
        'Smart Bomb' : '炸弹机器人',
        'Tesla Coil' : '电光塔',
        'Vorpal Blade Hilt' : '斩龙剑的剑柄',
        'Crystal Jiggy' : '水晶拼图',

        //圣诞文物
        'Fiber-Optic Xmas Tree' : '光纤圣诞树',
        'Decorative Pony Sled' : '小马雪橇装饰品',
        'Hearth Warming Lantern' : '暖心节灯笼',
        'Mayan Desk Calendar' : '马雅桌历',
        'Fiber-Optic Tree of Harmony' : '光纤谐律之树',
        'Crystal Snowman' : '水晶雪人',
        'Annoying Dog' : '烦人的狗',
        'Iridium Sprinkler' : '铱制洒水器',
        'Robo Rabbit Head' : '机器兔子头',

        //复活节文物
        //2011
        'Easter Egg' : '复活节彩蛋',
        //S、N、O、W、F、L、A、K、E。
        //2012
        'Red Ponyfeather' : '红色天马羽毛',
        'Orange Ponyfeather' : '橙色天马羽毛',
        'Yellow Ponyfeather' : '黄色天马羽毛',
        'Green Ponyfeather' : '绿色天马羽毛',
        'Blue Ponyfeather' : '蓝色天马羽毛',
        'Indigo Ponyfeather' : '靛色天马羽毛',
        'Violet Ponyfeather' : '紫色天马羽毛',
        //2013
        'Twinkling Snowflake' : '闪闪发光(Twinkling)的雪花',
        'Glittering Snowflake' : '闪闪发光(Glittering)的雪花',
        'Shimmering Snowflake' : '闪闪发光(Shimmering)的雪花',
        'Gleaming Snowflake' : '闪闪发光(Gleaming)的雪花',
        'Sparkling Snowflake' : '闪闪发光(Sparkling)的雪花',
        'Glinting Snowflake' : '闪闪发光(Glinting)的雪花',
        'Scintillating Snowflake' : '闪闪发光(Scintillating)的雪花',
        //2014
        'Altcoin' : '山寨币',
        'LiteCoin' : '莱特币',
        'DogeCoin' : '多吉币',
        'PeerCoin' : '点点币',
        'FlappyCoin' : '象素鸟币',
        'VertCoin' : '绿币',
        'AuroraCoin' : '极光币',
        'DarkCoin' : '暗黑币',
        //2015
        'Ancient Server Part' : '古老的服务器零组件',
        'Server Motherboard' : '服务器主板',
        'Server CPU Module' : '服务器中央处理器模组',
        'Server RAM Module' : '服务器主内存模组',
        'Server Chassis' : '服务器机壳',
        'Server Network Card' : '服务器网络卡',
        'Server Hard Drive' : '服务器硬盘',
        'Server Power Supply' : '服务器电源供应器',
        //2016
        'Chicken Figurines' : '小鸡公仔',
        'Red Chicken Figurine' : '红色小鸡公仔',
        'Orange Chicken Figurine' : '橙色小鸡公仔',
        'Yellow Chicken Figurine' : '黄色小鸡公仔',
        'Green Chicken Figurine' : '绿色小鸡公仔',
        'Blue Chicken Figurine' : '蓝色小鸡公仔',
        'Indigo Chicken Figurine' : '靛色小鸡公仔',
        'Violet Chicken Figurine' : '紫色小鸡公仔',
        //2017
        'Ancient Fruit Smoothies' : '古老的水果冰沙',
        'Ancient Lemon' : '古代柠檬',
        'Ancient Plum' : '古代李子',
        'Ancient Kiwi' : '古代奇异果',
        'Ancient Mulberry' : '古代桑葚',
        'Ancient Blueberry' : '古代蓝莓',
        'Ancient Strawberry' : '古代草莓',
        'Ancient Orange' : '古代橙子',
        //2018
        'Aggravating Spelling Error' : '严重的拼写错误',
        'Exasperating Spelling Error' : '恼人的拼写错误',
        'Galling Spelling Error' : '恼怒的拼写错误',
        'Infuriating Spelling Error' : '激怒的拼写错误',
        'Irking Spelling Error' : '忿怒的拼写错误',
        'Vexing Spelling Error' : '烦恼的拼写错误',
        'Riling Spelling Error' : '愤怒的拼写错误',
        //2019
        'Manga Category Button' : '漫画类别按钮',
        'Doujinshi Category Button' : '同人志类别按钮',
        'Artist CG Category Button' : '画师CG类别按钮',
        'Western Category Button' : '西方类别按钮',
        'Image Set Category Button' : '图集类别按钮',
        'Game CG Category Button' : '游戏CG类别按钮',
        'Non-H Category Button' : '非H类别按钮',
        'Cosplay Category Button' : 'Cosplay类别按钮',
        'Asian Porn Category Button' : '亚洲色情类别按钮',
        'Misc Category Button' : '杂项类别按钮',
        //2020
        'Hoarded Hand Sanitizer' : '库存的洗手液',
        'Hoarded Disinfecting Wipes' : '库存的消毒湿巾',
        'Hoarded Face Masks' : '库存的口罩',
        'Hoarded Toilet Paper' : '库存的厕纸',
        'Hoarded Dried Pasta' : '库存的干面',
        'Hoarded Canned Goods' : '库存的罐头',
        'Hoarded Powdered Milk' : '库存的奶粉',
        //2021
        'Red Vaccine Vial' : '红色疫苗瓶',
        'Orange Vaccine Vial' : '橙色疫苗瓶',
        'Yellow Vaccine Vial' : '黄色疫苗瓶',
        'Green Vaccine Vial' : '绿色疫苗瓶',
        'Blue Vaccine Vial' : '蓝色疫苗瓶',
        'Indigo Vaccine Vial' : '靛色疫苗瓶',
        'Violet Vaccine Vial' : '紫色疫苗瓶',
        //2022
        'Core Carrying Bag' : '核心携带包',
        'Core Display Stand' : '核心展示架',
        'Core Ornament Set' : '核心饰品套装',
        'Core Maintenance Set' : '核心维护套装',
        'Core Wall-Mount Display' : '核心壁挂显示器',
        'Core LED Illumination' : '核心LED照明',
        //2023
        'Search Engine Crankshaft': '搜索引擎曲轴',
        'Search Engine Carburetor': '搜索引擎化油器',
        'Search Engine Piston': '搜索引擎活塞',
        'Search Engine Manifold': '搜索引擎歧管',
        'Search Engine Distributor': '搜索引擎分电器',
        'Search Engine Water Pump': '搜索引擎水泵',
        'Search Engine Oil Filter': '搜索引擎机油滤清器',
        'Search Engine Spark Plug': '搜索引擎火花塞',
        'Search Engine Valve': '搜索引擎气门',
        //2024
        'Abstract Art of Fire Hydrants': '消防栓抽象艺术品',
        'Abstract Art of Staircases': '楼梯抽象艺术品',
        'Abstract Art of Bridges': '桥梁抽象艺术品',
        'Abstract Art of Crosswalks': '斑马线抽象艺术品',
        'Abstract Art of Traffic Lights': '红绿灯抽象艺术品',
        'Abstract Art of Bicycles': '自行车抽象艺术品',
        'Abstract Art of Tractors': '拖拉机抽象艺术品',
        'Abstract Art of Busses': '公交车抽象艺术品',
        'Abstract Art of Motorcycles': '摩托车抽象艺术品',
        //2025
        "Bunny Girl: Fluffy Ear Headband": "兔女郎：毛绒耳朵头饰",
        "Bunny Girl: White Fluffy Tail": "兔女郎：白色蓬松尾巴",
        "Bunny Girl: Black Latex Top": "兔女郎：黑色乳胶上衣",
        "Bunny Girl: Black Latex Gloves": "兔女郎：黑色乳胶手套",
        "Bunny Girl: Black High Heels": "兔女郎：黑色高跟鞋",
        "Bunny Girl: Black Fishnet Stockings": "兔女郎：黑色渔网袜",
        "Bunny Girl: Black Underwear": "兔女郎：黑色内衣",
        "Bunny Girl: Choker and Bowtie": "兔女郎：项圈与领结",



        //药品解释
        'Provides a long-lasting health restoration effect.' : '持续回复2%的基础HP,持续50回合.',
        'Instantly restores a large amount of health.' : '立刻回复100%的基础HP.',
        'Fully restores health, and grants a long-lasting health restoration effect.' : 'HP全满,持续100回合2%的基础HP.',
        'Provides a long-lasting mana restoration effect.' : '持续50回合回复1%的基础MP.',
        'Instantly restores a moderate amount of mana.' : '立刻回复50%的基础MP.',
        'Fully restores mana, and grants a long-lasting mana restoration effect.' : 'MP全满,持续100回复1%的基础MP.',
        'Provides a long-lasting spirit restoration effect.' : '持续50回复1%的基础SP.',
        'Instantly restores a moderate amount of spirit.' : '立刻回复50%的基础SP.',
        'Fully restores spirit, and grants a long-lasting spirit restoration effect.' : 'SP全满,持续100回合回复1%的基础SP.',
        'Fully restores all vitals, and grants long-lasting restoration effects.' : '状态全满,产生所有回复药水的效果.',
        'Restores 10 points of Stamina, up to the maximum of 99. When used in battle, also boosts Overcharge and Spirit by 10% for ten turns.' : '可在战斗中使用,请在战斗道具栏设置,恢复10点精力，但不超过99。战斗时使用时,每回合增加10%的灵力和Overcharge.',
        //魔药解释
        'You gain +25% resistance to Fire elemental attacks and do 25% more damage with Fire magicks.' : '你获得 +25% 的火系魔法耐性且获得 25% 的额外火系魔法伤害。',
        'You gain +25% resistance to Cold elemental attacks and do 25% more damage with Cold magicks.' : '你获得 +25% 的冰冷魔法耐性且获得 25% 的额外冰系魔法伤害。',
        'You gain +25% resistance to Elec elemental attacks and do 25% more damage with Elec magicks.' : '你获得 +25% 的雷系魔法耐性且获得 25% 的额外雷系魔法伤害。',
        'You gain +25% resistance to Wind elemental attacks and do 25% more damage with Wind magicks.' : '你获得 +25% 的风系魔法耐性且获得 25% 的额外风系魔法伤害。',
        'You gain +25% resistance to Holy elemental attacks and do 25% more damage with Holy magicks.' : '你获得 +25% 的神圣魔法耐性且获得 25% 的额外神圣魔法伤害。',
        'You gain +25% resistance to Dark elemental attacks and do 25% more damage with Dark magicks.' : '你获得 +25% 的黑暗魔法耐性且获得 25% 的额外黑暗魔法伤害。',
        //卷轴解释
        'Grants the Haste effect.' : '使用产生加速效果。',
        'Grants the Protection effect.' : '使用产生保护效果。',
        'Grants the Haste and Protection effects.with twice the normal duration.' : '产生加速和保护的效果。两倍持续时间',
        'Grants the Absorb effect.' : '使用后获得吸收效果。',
        'Grants the Shadow Veil effect.' : '使用产生闪避效果。',
        'Grants the Spark of Life effect.' : '使用产生生命火花效果。',
        'Grants the Absorb, Shadow Veil and Spark of Life effects with twice the normal duration.' : '同时产生吸收，闪避，以及生命火花效果,两倍持续时间.',

        //物品说明
        'Various bits and pieces of scrap cloth. These can be used to mend the condition of an equipment piece.' : '各种零碎的布料，用于修复装备',
        'Various bits and pieces of scrap leather. These can be used to mend the condition of an equipment piece.' : '各种零碎的皮革，用于修复装备',
        'Various bits and pieces of scrap metal. These can be used to mend the condition of an equipment piece.' : '各种零碎的金属，用于修复装备',
        'Various bits and pieces of scrap wood. These can be used to mend the condition of an equipment piece.' : '各种零碎的木材，用于修复装备',
        'Some materials scavenged from fallen adventurers by a monster. Required to reforge and upgrade cloth armor.' : '一些从怪物身上收集到的材料，用于升级布甲',
        'Some materials scavenged from fallen adventurers by a monster. Required to reforge and upgrade staffs and shields.' : '一些从怪物身上收集到的材料，用于升级法杖和盾牌',
        'Some materials scavenged from fallen adventurers by a monster. Required to reforge and upgrade heavy armor and weapons' : '一些从怪物身上收集到的材料，用于升级重甲和武器',
        'Some materials scavenged from fallen adventurers by a monster. Required to reforge and upgrade light armor' : '一些从怪物身上收集到的材料，用于升级轻甲',
        'A cylindrical object filled to the brim with arcano-technological energy. Required to restore advanced armor and shields to full condition.' : '一个边缘充斥着神秘科技能量的圆柱形物体，用于修复高级护甲和盾牌',
        'Some materials scavenged from fallen adventurers by a monster. Required to upgrade equipment bonuses to' : '从怪物身上收集的材料，用于升级装备的',
        'A small vial filled with a catalytic substance necessary for upgrading and repairing equipment in the forge. This is permanently consumed on use.' : '一个装着升级与修复装备必须的催化剂的小瓶子，每使用一次就会消耗一个',
        'When used with a weapon, this shard will temporarily imbue it with the' : '当用在一件装备上时，会临时给予装备',
        'When used with an equipment piece, this shard will temporarily imbue it with the' : '当用在一件装备上时，会临时给予装备',
        'Can be used to reset the unlocked potencies and experience of an equipment piece.' : '可以用于重置装备的潜能等级',
        'Suffused Aether enchantment' : '弥漫的以太的附魔效果',
        'Featherweight Charm enchantment' : '轻如鸿毛的附魔效果',
        'Voidseeker' : '虚空探索者',
        's Blessing enchantment' : '的祝福的附魔效果',
        'These fragments can be used in the forge to permanently soulfuse an equipment piece to you, which will make it level as you do.' : '这个碎片可以将一件装备与你灵魂绑定，灵魂绑定的装备会随着你的等级一同成长。',
        'You can fuse this crystal with a monster in the monster tab to increase its' : '你可以用这种水晶在怪物实验室里面为一个怪物提升它的',
        'Strength\\.' : '力量',
        'Dexterity\\.' : '灵巧',
        'Agility\\.' : '敏捷',
        'Endurance\\.' : '体质',
        'Intelligence\\.' : '智力',
        'Wisdom\\.' : '智慧',
        'Fire Resistance' : '火属性抗性',
        'Cold Resistance' : '冰属性抗性',
        'Electrical Resistance' : '电属性抗性',
        'Wind Resistance' : '风属性抗性',
        'Holy Resistance' : '圣属性抗性',
        'Dark Resistance' : '暗属性抗性',
        'Non-discerning monsters like to munch on this chow.' : '不挑食的初级怪物喜欢吃这种食物',
        'Mid-level monsters like to feed on something slightly more palatable, like these scrumptious edibles.' : '中级怪物喜欢吃更好吃的食物，比如这种',
        'High-level monsters would very much prefer this highly refined level of dining if you wish to parlay their favor.' : '如果你想受高等级怪物的青睐的话，请喂它们吃这种精致的食物吧',
        'Tiny pills filled with delicious artificial happiness. Use on monsters to restore morale if you cannot keep them happy. It beats leaving them sad and miserable.' : '美味的人造药丸，满溢着的幸福，没法让怪物开心的话，就用它来恢复怪物的士气，赶走怪物的悲伤和沮丧吧',
        'An advanced technological artifact from an ancient and long-lost civilization. Handing these in at the Shrine of Snowflake will grant you a reward.' : '一个发达古文明的技术结晶，把它交给雪花神殿的雪花女神来获得你的奖励',
        'You can exchange this token for the chance to face a legendary monster by itself in the Ring of Blood.' : '你可以用这些令牌在浴血擂台里面换取与传奇怪物对阵的机会',
        'You can use this token to unlock monster slots in the Monster Lab, as well as to upgrade your monsters.' : '你可以用这些令牌开启额外的怪物实验室槽位，也可以升级你的怪物',
        'A sapling from Yggdrasil, the World Tree' : '一棵来自世界树的树苗',
        'A plain black 100% cotton T-Shirt. On the front, an inscription in white letters reads' : '一件平凡无奇的100%纯棉T恤衫，在前面用白色的字母写着',
        'I defeated Real Life, and all I got was this lousy T-Shirt.' : '战胜了现实后，我就得到了这么一件恶心的T恤衫',
        'No longer will MBP spread havoc, destruction, and melted polar ice caps.' : '不会再有人熊猪扩散浩劫、破坏、和融化的极地冰帽了。',
        'You found this item in the lair of a White Bunneh. It appears to be a dud.' : '这似乎是你在一只杀人兔的巢穴里发现的一颗未爆弹。',
        'A Lilac flower given to you by a Mithra when you defeated her. Apparently, this type was her favorite.' : '击败小猫娘后她送你的紫丁香。很显然这品种是她的最爱。',
        'Taken from the destroyed remains of a Dalek shell.' : '从戴立克的残骸里取出来的音箱。',
        'Given to you by Konata when you defeated her. It smells of Timotei.' : '击败泉此方后获得的蓝发。闻起来有 Timotei 洗发精的味道',
        'Given to you by Mikuru when you defeated her. If you wear it, keep it to yourself.' : '击败朝比奈实玖瑠后获得的兔女郎装。不要告诉别人你有穿过。',
        'Given to you by Ryouko when you defeated her. You decided to name it Achakura, for no particular reason.' : '击败朝仓凉子后获得的人形。你决定取名叫朝仓，这没什么特别的理由。',
        'Given to you by Yuki when you defeated her. She looked better without them anyway.' : '击败长门有希后获得的眼镜。她不戴眼镜时看起来好多了。',
        'An Invisible Pink' : '从隐形粉红独角兽头上取下来的',
        'taken from the Invisible Pink Unicorn.' : ' ',
        'It doesn&amp;#039;t weigh anything and has the consistency of air' : '它很像空气一样轻，几乎没有重量',
        'but you&amp;#039;re quite sure it&amp;#039;s real' : '但是你很确定它是真实存在的',
        'A nutritious pasta-based appendage from the Flying Spaghetti Monster.' : '一条用飞行意大利面怪物身上的面团做成的营养附肢。',
        'You found these in your Xmas stocking when you woke up. Maybe Snowflake will give you something for them.' : '你醒来时,在你的圣诞袜里发现这些东西。说不定用它可以和雪花女神交换礼物。',
        'This box is said to contain an item of immense power. You should get Snowflake to open it.' : '传说此盒子封印了一件拥有巨大力量的装备。你应该找雪花女神去打开它。',
        'A 1/10th scale figurine of Twilight Sparkle, the cutest, smartest, all-around best pony. According to Pinkie Pie, anyway.' : 'NO.1 暮光闪闪的 1/10 比例缩放公仔。最可爱、最聪明，最全能的小马。(根据萍琪的说法，嗯…) ',
        'A 1/10th scale figurine of Rainbow Dash, flier extraordinaire. Owning this will make you about 20% cooler, but it probably took more than 10 seconds to get one.' : 'NO.2 云宝黛西的 1/10 比例缩放公仔。杰出的飞行员。拥有这个公仔可以让你多酷大约 20%，但为了得到她你得多花 10 秒！ ',
        'A 1/10th scale figurine of Applejack, the loyalest of friends and most dependable of ponies. Equestria&amp;#039;s best applebucker, and founder of Appleholics Anonymous.' : 'NO.3 苹果杰克的 1/10 比例缩放公仔。最忠诚的朋友，最可靠的小马。阿奎斯陲亚最好的苹果采收员，同时也是苹果农庄的创始马。 ',
        'A 1/10th scale figurine of Fluttershy, resident animal caretaker. You&amp;#039;re going to love her. Likes baby dragons; Hates grown up could-eat-a-pony-in-one-bite dragons.' : 'NO.4 小蝶的 1/10 比例缩放公仔。小马镇动物的褓姆，大家都喜爱她。喜欢幼龙；讨厌能一口吞掉小马的大龙。 ',
        'A 1/10th scale figurine of Pinkie Pie, a celebrated connoisseur of cupcakes and confectioneries. She just wants to keep smiling forever.' : 'NO.5 萍琪的 1/10 比例缩放公仔。一位著名的杯子蛋糕与各式饼干糖果的行家。她只想让大家永远保持笑容。 ',
        'A 1/10th scale figurine of Rarity, the mistress of fashion and elegance. Even though she&amp;#039;s prim and proper, she could make it in a pillow fight.' : 'NO.6 瑞瑞的 1/10 比例缩放公仔。时尚与品味的的女主宰。她总是能在枕头大战中保持拘谨矜持。 ',
        'A 1/10th scale figurine of The Great and Powerful Trixie. After losing her wagon, she now secretly lives in the Ponyville library with her girlfriend, Twilight Sparkle.' : 'NO.7 崔克茜的 1/10 比例缩放公仔。伟大的、法力无边的崔克茜。失去她的篷车后，她现在偷偷的与她的女友暮光闪闪住在小马镇的图书馆中。 ',
        'A 1/10th scale figurine of Princess Celestia, co-supreme ruler of Equestria. Bored of the daily squabble of the Royal Court, she has recently taken up sock swapping.' : 'NO.8 塞拉斯提娅公主的 1/10 比例缩放公仔。阿奎斯陲亚大陆的最高统治者。对每日的皇家争吵感到无聊，她近日开始穿上不成对的袜子。 ',
        'A 1/10th scale figurine of Princess Luna, aka Nightmare Moon. After escaping her 1000 year banishment to the moon, she was grounded for stealing Celestia&amp;#039;s socks.' : 'NO.9 露娜公主的 1/10 比例缩放公仔。又名梦靥之月。在结束了一千年的放逐后，她从月球回到阿奎斯陲亚偷走了塞拉斯提娅的袜子。 ',
        'A 1/10th scale figurine of Apple Bloom, Applejack&amp;#039;s little sister. Comes complete with a &amp;quot;Draw Your Own Cutie Mark&amp;quot; colored pencil and permanent tattoo applicator set.' : 'NO.10 小萍花的 1/10 比例缩放公仔。苹果杰克的小妹。使用了“画出妳自己的可爱标志”彩色铅笔与永久纹身组后，生命更加的完整了。 ',
        'A 1/10th scale figurine of Scootaloo. Die-hard Dashie fanfilly, best pony of the Cutie Mark Crusaders, and inventor of the Wingboner Propulsion Drive. 1/64th chicken.' : 'NO.11 飞板露的 1/10 比例缩放公仔。云宝黛西的铁杆年轻迷妹，可爱标志十字军中最棒的小马，以及蠢翅动力推进系统的发明者。有 1/64 的组成成分是鲁莽。 ',
        'A 1/10th scale figurine of Sweetie Belle, Rarity&amp;#039;s little sister. Comes complete with evening gown and cocktail dress accessories made of 100% Dumb Fabric.' : 'NO.12 甜贝儿的 1/10 比例缩放公仔。瑞瑞的小妹。在穿上 100% 蠢布料制成的晚礼服与宴会短裙后更加完美了。 ',
        'A 1/10th scale figurine of Big Macintosh, Applejack&amp;#039;s older brother. Famed applebucker and draft pony, and an expert in applied mathematics.' : 'NO.13 大麦克的 1/10 比例缩放公仔。苹果杰克的大哥。有名的苹果采收员和大力马，同时也是实用数学的专家。 ',
        'A 1/10th scale figurine of Spitfire, team leader of the Wonderbolts. Dashie&amp;#039;s idol and occasional shipping partner. Doesn&amp;#039;t actually spit fire.' : 'NO.14 爆火的 1/10 比例缩放公仔。惊奇闪电的领导者。云宝黛西的偶像和临时飞行搭档。实际上不会吐火。 ',
        'A 1/10th scale figurine of Derpy Hooves, Ponyville&amp;#039;s leading mailmare. Outspoken proponent of economic stimulus through excessive muffin consumption.' : 'NO.15 小呆的 1/10 比例缩放公仔。小马镇上重要的邮差马。直言不讳的主张以大量食用马芬的方式来刺激经济。 ',
        'A 1/10th scale figurine of Lyra Heartstrings. Features twenty-six points of articulation, replaceable pegasus hoofs, and a detachable unicorn horn.' : 'NO.16 天琴心弦的 1/10 比例缩放公仔。拥有 26 个可动关节，可更换的飞马蹄与一个可拆卸的独角兽角是其特色。 ',
        'A 1/10th scale figurine of Octavia. Famous cello musician; believed to have created the Octatonic scale, the Octahedron, and the Octopus.' : 'NO.17 奥塔维亚的 1/10 比例缩放公仔。著名的大提琴家；据信创造了八度空间、八面体以及章鱼。 ',
        'A 1/10th scale figurine of Zecora, a mysterious zebra from a distant land. She&amp;#039;ll never hesitate to mix her brews or lend you a hand. Err, hoof.' : 'NO.18 泽科拉的 1/10 比例缩放公仔。一位来自远方的神秘斑马。她会毫不迟疑的搅拌她的魔药或助你一臂之力。呃，我是说一蹄之力… ',
        'A 1/10th scale figurine of Cheerilee, Ponyville&amp;#039;s most beloved educational institution. Your teachers will never be as cool as Cheerilee.' : 'NO.19 车厘子的 1/10 比例缩放公仔。小马镇最有爱心的教育家。你的老师绝对不会像车厘子这么酷的！ ',
        'A 1/10th scale bobblehead figurine of Vinyl Scratch, the original DJ P0n-3. Octavia&amp;#039;s musical rival and wub wub wub interest.' : 'NO.20 维尼尔的 1/10 比例缩放摇头公仔。是 DJ P0n-3 的本名。为奥塔维亚在音乐上的对手，喜欢重低音喇叭。 ',
        'A 1/10th scale figurine of Daring Do, the thrill-seeking, action-taking mare starring numerous best-selling books. Dashie&amp;#039;s recolor and favorite literary character.' : 'NO.21 天马无畏的 1/10 比例缩放公仔。追寻刺激，有如动作片主角一般的小马，为一系列畅销小说的主角。是云宝黛西最喜欢的角色，也是带领她进入阅读世界的原因。 ',
        'A 1/10th scale figurine of Doctor Whooves. Not a medical doctor. Once got into a hoof fight with Applejack over a derogatory remark about apples.' : 'NO.22 神秘博士的 1/10 比例缩放公仔。不是医生。曾经与苹果杰克陷入一场因贬低苹果的不当发言而产生的蹄斗。 ',
        'A 1/10th scale figurine of Berry Punch. Overly protective parent pony and Ponyville&amp;#039;s resident lush. It smells faintly of fruit wine.' : 'NO.23 酸梅酒的 1/10 比例缩放公仔。有过度保护倾向的小马，也是小马镇的万年酒鬼。闻起来有淡淡水果酒的气味。 ',
        'A 1/10th scale figurine of Bon-Bon. Usually seen in the company of Lyra. Suffers from various throat ailments that make her sound different every time you see her.' : 'NO.24 糖糖的 1/10 比例缩放公仔。常常被目击与天琴心弦在一起。患有许多呼吸道相关的疾病，使你每次遇到她的时候她的声音都不同。 ',
        'A 1/10th scale fluffy figurine of Fluffle Puff. Best Bed Forever.' : 'NO.25 毛毛小马 1/10 比例缩放的毛茸茸玩偶。让你想要永远躺在上面。 ',
        'A lifesize figurine of Angel Bunny, Fluttershy&amp;#039;s faithful yet easily vexed pet and life partner. All-purpose assistant, time keeper, and personal attack alarm.' : 'NO.26 天使兔的等身大玩偶。为小蝶忠实且易怒的宠物及伴侣。万能助理、报时器、受到人身攻击时的警报器。 ',
        'A lifesize figurine of Gummy, Pinkie Pie&amp;#039;s faithful pet. Usually found lurking in your bathtub. While technically an alligator, he is still arguably the best pony.' : 'NO.27 甘米的等身大玩偶。是萍琪的忠实宠物。经常被发现潜伏在你的浴缸里。虽然技术上是只短吻鳄，但它仍然可以称得上是最棒的小马。 ',
        'Some materials scavenged from fallen adventurers by a monster' : '从被击败的冒险者身上收集来的材料',
        'Required to reforge Phase Armor' : '用于强化相位甲',
        'Required to reforge Shade Armor' : '用于强化暗影甲',
        'Required to reforge Power Armor' : '用于强化动力甲',
        'Required to reforge Force Shields' : '用于强化力场盾',
        'Physical Base Damage' : '(物理伤害)',
        'Physical Hit Chance' : '(物理命中率)',
        'Magical Base Damage' : '(魔法伤害)',
        'Magical Hit Chance' : '(魔法命中率)',
        'Physical Defense' : '(物理减伤)',
        'Magical Defense' : '(魔法减伤)',
        'Evade Chance' : '(回避率)',
        'Block Chance' : '(格挡率)',
        'Parry Chance' : '(招架率)',
        'Elemental Magic Proficiency' : '(元素熟练)',
        'Divine Magic Proficiency' : '(圣熟练)',
        'Forbidden Magic Proficiency' : '(暗熟练)',
        'Deprecating Magic Proficiency' : '(减益熟练)',
        'Supportive Magic Proficiency' : '(增益熟练)',
        'Fire Spell Damage' : '(火焰法术伤害)',
        'Cold Spell Damage' : '(冰霜法术伤害)',
        'Elec Spell Damage' : '(闪电法术伤害)',
        'Wind Spell Damage' : '(狂风法术伤害)',
        'Holy Spell Damage' : '(神圣法术伤害)',
        'Dark Spell Damage' : '(黑暗法术伤害)',
        'Crushing Mitigation' : '(敲击减伤)',
        'Slashing Mitigation' : '(斩击减伤)',
        'Piercing Mitigation' : '(刺击减伤)',
        'Fire Mitigation' : '(火焰减伤)',
        'Cold Mitigation' : '(冰霜减伤)',
        'Elec Mitigation' : '(闪电减伤)',
        'Wind Mitigation' : '(狂风减伤)',
        'Holy Mitigation' : '(神圣减伤)',
        'Dark Mitigation' : '(黑暗减伤)',
        'Strength' : '(力量)',
        'Dexterity' : '(灵巧)',
        'Agility' : '(敏捷)',
        'Endurance' : '(体质)',
        'Intelligence' : '(智力)',
        'Wisdom' : '(智慧)',
        'Magical Mitigation' : '(魔法减伤)',
        'Resist Chance' : '(抵抗率)',
        'Physical Crit Chance' : '(物理暴击率)',
        'Magical Crit Chance' : '(魔法暴击率)',

        //物品类型，悬浮窗onmouseover参数自带一层单引号
        "'Consumable'" : "'消耗品'",
        "'Crystal'" : "'水晶'",
        "'Monster Food'" : "'怪物食品'",
        "'Token'" : "'令牌'",
        "'Trophy'" : "'奖杯'",
        "'Artifact'" : "'文物'",
        "'Material'" : "'材料'",
        "'Collectable'" : "'收藏品'",
        "Trophy Tier 1": "1 级奖杯",
        "Trophy Tier 2": "2 级奖杯",
        "Trophy Tier 3": "3 级奖杯",
        "Trophy Tier 4": "4 级奖杯",
        "Trophy Tier 5": "5 级奖杯",
        "Trophy Tier 6": "6 级奖杯",
        "Trophy Tier 7": "7 级奖杯",
        "Trophy Tier 8": "8 级奖杯",
        "Trophy Tier 9": "9 级奖杯",
    };
var equips = {
        ///////////////////////////////////////////武器种类
        // 单手武器类
        'Dagger':'*匕首(单)',
        'Sword Chucks' : '*锁链双剑（单）',
        'Swordchucks' : '*锁链双剑（双）',
        'Shortsword':'短剑(单)',
        'Wakizashi':'脇差(单)',
        'Axe':'斧(单)',
        'Club':'棍(单)',
        'Rapier':'<span style=\"background:#ffa500;color:black\">西洋剑</span>(单)',
        //双手
        'Great Mace' : '重锤(双)',
        'Scythe':'*镰刀(双)',
        'Longsword':'长剑(双)',
        'Katana':'太刀(双)',
        'Mace':'重槌(双)',
        'Estoc':'刺剑(双)',
        //法杖
        'Staff':'法杖(双)',
        //布甲
        'Cap ':'兜帽 ',
        'Cap$':'兜帽',
        'Cap/':'兜帽/',
        'Cap<':'兜帽<',
        'Robe':'长袍',
        'Gloves':'手套',
        'Pants':'短裤',
        'Shoes':'鞋',
        //轻甲
        'Helmet':'头盔',
        'Breastplate':'护胸',
        'Gauntlets':'手甲',
        'Leggings':'护腿',
        //重甲
        'Cuirass':'胸甲',
        'Armor':'盔甲',
        'Sabatons':'铁靴',
        'Boots':'靴子',
        'Greaves':'护胫',
        //锁子甲
        'Coif' : '头巾',
        'Mitons' : '护手',
        'Hauberk' : '装甲',
        'Chausses' : '裤',

        /////////////////////////////盾或者材料,武器不会出现这个
        'Buckler':'圆盾',
        'Kite Shield':'鸢盾',
        'Tower Shield':'*塔盾',
        'Force Shield':'<span style=\"background:#ffa500;color:black\" >力场盾</span>',
        //布甲
        'Cotton':'棉质<span style=\"background:#FFFFFF;color:#000000\" >(布)</span>',
        'Gossamer':'*薄纱<span style=\"background:#FFFFFF;color:#000000\" >(布)</span>',
        'Silk' : '*丝绸<span style=\"background:#FFFFFF;color:#000000\" >(布)</span>',
        'Ironsilk' : '*铁绸<span style=\"background:#FFFFFF;color:#000000\" >(布)</span>',
        'Phase':'<span style=\"background:#ffa500;color:#000000\" >相位</span><span style=\"background:#FFFFFF;color:#000000\" >(布)</span>',
        //轻甲
        'Leather':'皮革<span style=\"background:#666666;color:#FFFFFF\" >(轻)</span>',
        'Kevlar':'*凯夫拉<span style=\"background:#666666;color:#FFFFFF\" >(轻)</span>',
        'Dragon Hide' : '*龙皮<span style=\"background:#666666;color:#FFFFFF\" >(轻)</span>',
        'Drakehide' : '*龙皮<span style=\"background:#666666;color:#FFFFFF\" >(轻)</span>',
        'Shade':'<span style=\"background:#ffa500;color:black\" >暗影</span><span style=\"background:#666666;color:#FFFFFF\" >(轻)</span>',
        //重甲
        'Chainmail' : '*锁子甲<span style=\"background:#000000;color:#FFFFFF\" >(重)</span>',
        'Chain' : '*锁子甲<span style=\"background:#000000;color:#FFFFFF\" >(重)</span>',
        'Reactive' : '*反应装甲<span style=\"background:#000000;color:#FFFFFF\" >(重)</span>',
        'Plate':'板甲<span style=\"background:#000000;color:#FFFFFF\" >(重)</span>',
        'Power':'<span style=\"background:#ffa500;color:#000000\" >动力</span><span style=\"background:#000000;color:#FFFFFF\" >(重)</span>',
        //法杖
        'Ebony':'*乌木',
        'Redwood':'红木',
        'Willow':'<span style=\"background:#ffa500;color:black\">柳木</span>',
        'Oak':'橡木',
        'Katalox':'铁木',

        ///////////////////////////////////////////防具后缀////////////////////////////////////////////
        'of Negation':'否定(抵抗)',
        'of the Shadowdancer':'影舞者(攻暴/回避)',
        'of the Arcanist':'奥术师(法命/双智)',
        'of the Fleet':'迅捷(回避)',
        'of the Fire-eater':'噬火者(火抗)',
        'of the Thunder-child':'雷之子(雷抗)',
        'of the Wind-waker':'驭风者(风抗)',
        'of the Frost-born':'冰诞者(冰抗)',
        'of the Spirit-ward':'幽冥结界(暗抗)',
        'of the Thrice-blessed':'三重祝福(圣抗)',
        'of the Stone-skinned':'硬肤者(免伤)',
        'of Dampening':'抑制(免敲)',
        'of Stoneskin':'石肤(免斩)',
        'of Deflection':'偏转(免刺)',
        'of the Nimble': '灵活(招架)',
        'of the Barrier': '屏障(格挡)',
        'of Protection': '守护(物防)',
        'of Warding': '保卫(魔防)',

        'of the Ox' :  '公牛(力量)',
        'of the Raccoon' :  '浣熊(灵巧)',
        'of the Cheetah' :  '猎豹(敏捷)',
        'of the Turtle' :  '乌龟(体质)',
        'of the Fox' :  '狐狸(智力)',
        'of the Owl' :  '夜枭(智慧)',
        'of the Hulk' :  '浩克',
        'of the Shielding Aura' :  '守护光环',

        ////////////////////////////////////////////////////武器后缀/////////////////////////////////
        'of Slaughter':'<span style=\"background:#FF0000;color:#FFFFFF\" >杀戮(攻伤)</span>',
        'of Swiftness':'快速(攻速)',
        'of Balance':'平衡(攻命/攻暴)',
        'of the Battlecaster':'战法师(法命/魔耗/干涉)',
        'of the Banshee':'报丧女妖(吸灵)',
        'of the Illithid':'夺心魔(吸魔)',
        'of the Vampire':'吸血鬼(吸血)',
        'of Destruction':'<span style=\"background:#9400d3;color:#FFFFFF\" >毁灭(法伤)</span>',
        'of Surtr':'<span style=\"background:#f97c7c;color:black\" >苏尔特(火伤)</span>',
        'of Niflheim':'<span style=\"background:#94c2f5;color:#5c5a5a\" >尼芙菲姆(冰伤)</span>',
        'of Mjolnir':'<span style=\"background:#f4f375;color:black\" >姆乔尔尼尔(雷伤)</span>',
        'of Freyr':'<span style=\"background:#7ff97c;color:#5c5a5a\" >弗瑞尔(风伤)</span>',
        'of Heimdall':'<span style=\"background:#ffffff\;color:#000000\" >海姆达(圣伤)</span>',
        'of Fenrir':'<span style=\"background:#000000\;color:#ffffff" >芬里尔(暗伤)</span>',
        'of Focus':'专注(法命/魔耗/法暴)',
        'of the Elementalist':'元素使(元素熟练)',
        'of the Heaven-sent':'天堂(神授熟练)',
        'of the Demon-fiend':'恶魔(禁忌熟练)',
        'of the Earth-walker':'地行者(辅助熟练)',
        'of the Priestess':'牧师',
        'of the Curse-weaver':'咒术师(衰折熟练)',

        ///////////////武器或者防具属性/////////////////
        'Radiant':'<span style=\"background:#ffffff\;color:#000000" >✪魔光的✪(法伤)</span>',
        'Mystic':'神秘的(法暴伤)',
        'Charged':'<span style=\"color:red\" >充能的(法速)</span>',
        'Amber':'<span style=\"background:#ffff00\;color:#9f9f16" >琥珀的(电抗)</span>',
        'Mithril':'<span style=\"color:red\" >秘银的(低重)</span>',
        'Agile':'俊敏的(攻速)',
        'Zircon':'<span style=\"background:#ffffff\;color:#5c5a5a" >锆石的(圣抗)</span>',
        'Frugal':'<span style=\"color:red\" >节能的(省魔)</span>',
        'Jade':'<span style=\"background:#b1f9b1;color:black\">翡翠的(风抗)</span>',
        'Cobalt':'<span style=\"background:#a0f4f4;color:black\">钴石的(冰抗)</span>',
        'Ruby':'<span style=\"background:#ffa6a6;color:black\" 红宝石(火抗)</span>',
        'Onyx':'<span style=\"background:#cccccc;color:black\">缟玛瑙(暗抗)</span>',
        'Savage':'<span style=\"color:red\">残暴的(攻暴伤)</span>',
        'Reinforced':'加固的(减伤)',
        'Shielding':'盾化的(格挡)',
        'Arctic':'<span style=\"background:#94c2f5\;color:black">极寒之(冰)</span>',
        'Fiery':'<span style=\"background:#f97c7c;color:black\">灼热之(火)</span>',
        'Shocking':'<span style=\"background:#f4f375;color:black\">闪电之(雷)</span>',
        'Tempestuous':'<span style=\"background:#7ff97c;color:#5c5a5a\">风暴之(风)</span>',
        'Hallowed':'<span style=\"background:#ffffff\;color:#000000" >神圣之(圣)</span>',
        'Demonic':'<span style=\"background:#000000\;color:#ffffff" >恶魔之(暗)</span>',
        'Ethereal':'<span style=\"background:#ffffff\;color:#5c5a5a" >虚空之</span>',

        'Bronze ' : '铜 ',
        'Iron ' : '铁 ',
        'Silver ' : '银 ',
        'Steel ' : '钢 ',
        'Gold ' : '金 ',
        'Bronze-' : '铜-',
        'Iron-' : '铁-',
        'Silver-' : '银-',
        'Steel-' : '钢-',
        'Gold-' : '金-',
        'Platinum' : '白金',
        'Titanium' : '钛',
        'Emerald' : '祖母绿',
        'Sapphire' : '蓝宝石',
        'Diamond' : '金刚石',
        'Prism' : '光棱',
        '-trimmed' : '-镶边',
        '-adorned' : '-装饰',
        '-tipped' : '-前端',
        'Astral' : '五芒星',
        'Quintessential' : '第五元素',

        /////////////////品质//////////
        'Flimsy ' : '<span style=\"background:#848482;color:black\" >薄弱</span> ',
        'Crude ':'<span style=\"background:#acacac;color:black\" >劣质</span> ',
        'Fair ':'<span style=\"background:#c1c1c1;color:black\" >一般</span> ',
        'Average ':'<span style=\"background:#dfdfdf;color:black\" >中等</span> ',
        'Superior ':'<span style=\"background:#fbf9f9;color:black\" >上等</span> ',
        'Fine ':'<span style=\"background:#b9ffb9;color:black\" >优质</span> ',
        'Exquisite':'<span style=\"background:#d7e698;color:black\" >✧精良✧</span>',
        'Magnificent':'<span style=\"background:#a6daf6;color:black\" >☆史诗☆</span>',
        'Legendary':'<span style=\"background:#ffbbff;color:black\" >✪传奇✪</span>',
        'Peerless':'<span style=\"background:#ffd760;color:black\" >☯无双☯</span>',

        /////////////////装备部位，更换装备列表用的//////////
        'Empty':'空',
        'Main Hand':'主手',
        'Off Hand':'副手',
        'Helmet':'头盔',
        'Body':'身体',
        'Hands':'手部',
        'Legs(\\W)':'腿部$1',
        'Feet(\\W)':'脚部$1',

        'Current Owner':'持有者',
    };

let items_words = { ...items, ...equips };

let regexs = [], chinese = [];

let monsterNames = Array.from(gE('div.btm3>div>div', 'all')).map(monster => monster.innerHTML);


for (const [key, value] of Object.entries(words)) {
  regexs.push(new RegExp(`(?<=[ ,.\\[]|^)${key}(?=[ ,.\\]]|$)`, 'g'));
  chinese.push(value);
}

let regexs_items = [], chinese_items = [];
for (const [key, value] of Object.entries(items_words)) {
  regexs_items.push(new RegExp(`(?<=[ ,.\\[]|^)${key}(?=[ ,.\\]]|$)`, 'g'));
  chinese_items.push(value);
}

unsafeWindow.trans_regexs = regexs;
unsafeWindow.trans_chinese = chinese;

function trans(text) {
  let regexs = unsafeWindow.trans_regexs || regexs;
  let chinese = unsafeWindow.trans_chinese || chinese;

  for (let i in monsterNames) {
    text = text.replace(monsterNames[i], `[MONSTER_NAME_${i}]`);
  }

  if (text.match(/(\[.+\])/)) {
    // 如果内容包含掉落物则翻译物品装备，否则不翻译
    let item = RegExp.$1, itemorg = RegExp.$1;
    for (const [idx, regex] of Object.entries(regexs_items)) {
      item = item.replace(regex, chinese_items[idx]);
    }
    text = text.replace(itemorg, item);
  }
  for (const [idx, regex] of Object.entries(regexs)) {
    text = text.replace(regex, chinese[idx]);
  }

  for (let i in monsterNames) {
    text = text.replace(`[MONSTER_NAME_${i}]`, monsterNames[i]);
  }
  return text;
}

function observe_node(node, config, callback) {
  const observer = new MutationObserver(callback);
  observer.observe(node, config);
  return observer;
}

function add_to_log(text) {
  let tr = document.createElement('tr');
  let td = document.createElement('td');
  if (text == '') {
    td.classList.add('tls');
  }
  else {
    td.classList.add('tl');
    td.innerHTML = trans(text);
  }
  tr.appendChild(td);
  let log = document.querySelector('#translog');

  // // 添加新日志之前检查日志数量
  // if (log.children.length >= 100) {
  //   // 如果超过100条，删除最旧的日志
  //   log.lastChild.remove();
  // }

  log.insertBefore(tr, log.firstChild);
}
function handle_log(mutations, _observer) {
  monsterNames = Array.from(gE('div.btm3>div>div', 'all')).map(monster => monster.innerHTML);

  add_to_log('<span style=\"color:#777;\">----------------------------------------------------------------------------------</span>');
  for (const mutation of mutations) {
    if (mutation.type !== 'childList') {
      continue;
    }
    for (const node of mutation.addedNodes) {
      if (node.nodeName !== 'TR') {
        continue;
      }
      let text = [];
      node.childNodes.forEach(n => text.push(n.innerHTML));
      add_to_log(text.join(' '));
    }
  }
}

function gE(ele, mode, parent) { // 获取元素
  if (typeof ele === 'object') {
    return ele;
  } if (mode === undefined && parent === undefined) {
    return (isNaN(ele * 1)) ? document.querySelector(ele) : document.getElementById(ele);
  } if (mode === 'all') {
    return (parent === undefined) ? document.querySelectorAll(ele) : parent.querySelectorAll(ele);
  } if (typeof mode === 'object' && parent === undefined) {
    return mode.querySelector(ele);
  }
}

function start_observe() {
  if (document.getElementById('translog')) return;

  // 在原日志的后面增加一个新的元素存放翻译后的日志，避免对其他插件造成可能存在的干扰
  let table = document.createElement('table');
  let tbody = document.createElement('tbody');
  table.id = 'translog';
  table.appendChild(tbody);

  // let textlog = document.querySelector('#pane_log');
  // textlog.appendChild(table);
  let textlog = document.querySelector('#battle_right');
  const container = document.createElement('div');
  container.id = 'pane_log';
  // container.classList.add('bttp');
  if (!document.querySelector('#pane_monster')) return;
  let paneMonsterHeight = document.querySelector('#pane_monster').getBoundingClientRect().height;
  const minTop = Math.max(55.6*5-paneMonsterHeight, 0);
  paneMonsterHeight += 10;
  container.style.cssText += `display: block; top: ${minTop}px; height: calc(100% - ${paneMonsterHeight+minTop}px); left: -6px; width: 548px; position: relative; overflow: auto;}`;
  textlog.appendChild(container);
  container.appendChild(table);
  document.querySelector('#battle_left').style.cssText += 'width: 681px;';
  const bg = document.createElement('div');
  bg.classList.add('btlbg');
  bg.style.cssText = "position: fixed; z-index: 1; height: 255px;width: 671px; background-color: #111; padding: 0; margin: 0; top: 47px;";
  document.querySelector('#battle_left').appendChild(bg);
  document.querySelector('#pane_action').style.cssText += 'position: sticky; top: 8px; z-index: 2;';
  document.querySelector('#pane_vitals').style.cssText += 'position: sticky; top: 53px; z-index: 2;';
  document.querySelector('#pane_quickbar').style.cssText += 'position: sticky; top: 133px; z-index: 2;';
  document.querySelector('#infopane').style.cssText += 'position: sticky; top: 173px; z-index: 2;';
  document.querySelector('#battle_right').style.cssText += 'height: 100%;';

  // 添加一下已存在的日志
  let texts = [];
  for (const log of document.querySelectorAll('#textlog > tbody > tr > td')) {
    texts.push(log.innerHTML);
  }
  for (const text of texts.reverse()) {
    add_to_log(text);
  }
  observe_node(document.querySelector('#textlog').firstChild, { childList: true }, handle_log);
}

if (document.querySelector('#battle_main') !== null) {
  // 新回合开始时会刷新 battle_main，导致原本的监听失效，必须在刷新时重新监听一次
  observe_node(document.querySelector('#battle_main'), { childList: true }, () => {
    start_observe();
  });
  observe_node(document.querySelector('body'), { childList: true }, () => {
    start_observe();
  });
  start_observe();
}
