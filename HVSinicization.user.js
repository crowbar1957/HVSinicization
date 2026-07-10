// ==UserScript==
// @name         HV 战斗日志汉化
// @namespace    Aloxaf_hentai
// @version      2026.7.f
// @description  汉化 HV 战斗日志
// @author       qp_xe & indefined & 1235789gzy1 & mbbdzz 原作者@qp_xe，物品汉化文本由HV物品装备汉化提供
// @icon         https://hentaiverse.org/y/favicon.png
// @match      *://hentaiverse.org/*
// @match      *://alt.hentaiverse.org/*
// @grant        GM_addStyle
// @homepage https://github.com/crowbar1957/HVSinicization
// @downloadURL https://github.com/crowbar1957/HVSinicization/raw/refs/heads/main/HVSinicization.user.js
// @updateURL https://github.com/crowbar1957/HVSinicization/raw/refs/heads/main/HVSinicization.user.js
// ==/UserScript==

(function () {
    const defaultLogID = "textlog";
    const translatorID = "zh_log";

    const customStyle = ``;

    const translatorStyle = `
        #${translatorID} .you { color: #303030 ; background: #dbedff;  }
        #${translatorID} .monster { background: #d3d3d3; }
        #${translatorID} .effect { background: #c6ffb5; }
        #${translatorID} .debuff { background: #856d00; }
        #${translatorID} .strike { color: #283b2f; }
        #${translatorID} .attack { color: #ff0000; font-weight: bold; text-decoration: underline;}
        #${translatorID} .crits { color: #ef3aff; font-weight: bold; }
        #${translatorID} .resist { color: #b443ff; font-weight: bold; }
        #${translatorID} .harm { background: #f1d1d5; font-weight: bold; }
        #${translatorID} .crystal { color: #BA05B4; }
        #${translatorID} .collectables { color: #461B7E; }
        #${translatorID} .token { color: #254117; }
        #${translatorID} .monsterItem { color: #489EFF; }
        #${translatorID} .credits { color: #A89000; }
        #${translatorID} .fragments { color: #254117; }
    `;

    const sentences = [
        // 环境
        ["\\(Round", "(回合"],
        ["Initializing random encounter", "初始化随机遭遇战"],
        ["Initializing arena challenge", "初始化竞技场战斗"],
        ["Initializing Item World", "初始化道具界战斗"],
        ["Initializing Grindfest", "初始化压榨界战斗"],
        ["Initializing The Tower", "初始化塔楼战斗"],
        ["^Spawned Monster (\\w+):", "生成怪物 $1:"],
        ["Warning: Reached equipment inventory limit", "警告: 装备库存已满"],

        ["Time Bonus:", "快速回答奖励:"],
        [
            "The Riddlemaster listens to your answer, tries to keep a pensive face, then breaks into a wide grin",
            "谜语大师听了你的回答，努力保持沉思的表情，然后咧嘴大笑",
        ],
        [
            "The Riddlemaster listens to your answer and winks at you",
            "谜语大师听了你的回答，向你眨眼",
        ],
        [
            "The Riddlemaster listens to your answer and cackles hysterically.",
            "谜语大师听了你的回答，歇斯底里地笑了起来",
        ],
        [
            "The Riddlemaster listens to your answer and grins mischievously.",
            "谜语大师听了你的回答，顽皮地笑了起来",
        ],
        [
            "The Riddlemaster listens to your answer and shows no reaction whatsoever.",
            "谜语大师听了你的回答，没有任何反应",
        ],
        [
            "The Riddlemaster listens to your answer and snorts ambiguously.",
            "谜语大师听了你的回答，含糊地哼了一声",
        ],
        [
            "With the light of a new dawn, [yY]our experience in all things increases",
            "随着新的黎明的到来，你在所有事情上的经验都增加了",
        ],

        // 状态
        ["restores (\\d+) points", "恢复 $1 点"],
        ["(.+) gains? the effect (.+).", "$1 获得状态 $2."],
        [
            "The effect (.+) on (.+) has (expired|worn off)",
            "$2 的状态 $1 已失效",
        ],

        ["The effect (.+) has (expired|worn off)", "状态 $1 已失效"],
        ["Insufficient overcharge to use", "斗气值不足，无法使用"],
        ["Spirit Stance Engaged", "灵动架势开启"],
        [
            "Insufficient overcharge or spirit for Spirit Stance",
            "灵力或斗气值不足，无法开启灵动架势",
        ],
        ["Spirit Stance Exhausted", "灵动架势关闭"],
        ["Spirit Stance Disabled", "灵动架势无法维持"],

        ["fails due to insufficient Spirit", "由于灵力不足，没有生效"],
        ["You gain no EXP due to exhaustion", "你已精疲力竭，无法获得经验"],
        ["Cooldown expired for (.+)", "$1 已完成冷却"],
        [
            "(.+) drain (.+) points of health from (.+)(?=[.,;])",
            "$1 从 $3 身上吸取到 $2 点生命",
        ],
        ["The effect (.+) was dispelled(?=[.,;])", "效果 $1 已被替换"],
        ["(.+) got knocked out of confuse", "$1 从混乱中脱离"],
        [
            "(.+) shrugs off the effects of (.+) spell(?=[.,;])",
            "$1 摆脱了 $2 的法术",
        ],
        ["You are healed for (\\d+) Health Points", "你获得 $1 点生命治疗"],

        // 发动
        ["(.+) uses? (.+)", "$1 发动 $2"],
        ["(.+) casts? (.+)", "$1 施展出 $2"],
        ["missing (.+?) completely", "完全未命中 $1"],
        ["(.+) vigorously whiffs at a shadow", "$1 用力地挥空到影子上"],
        ["(.+) in the general direction of a shadow", "$1 朝向了影子"],
        ["(.+) absorbs (.+) from the attack into", "$1 吸收了 $2 并转化为"],

        ["which hits", "命中了"],
        ["which crits", "暴击了"],
        ["which glances", "部分命中了"],
        ["which partially parries", "但被部分招架"],

        ["Invalid target", "非法目标"],
        ["Item does not exist", "道具不存在"],
        ["Inventory slot is empty", "物品栏是空的"],
        ["You do not have a powerup gem", "宝石不存在"],

        // 受伤
        ["(.+) you, causing (\\d+) points", "$1 you, <span class='attack'>造成 $2 点</span>"],
        ["(.+) hits? (.+)", "$1 击中 $2"],
        ["(.+) glances? (.+)", "$1 部分击中 $2"],
        ["(?:causing|for) (\\d+) points", "造成 $1 点"],
        ["(?:causing) (\\d+) additional points", "追加 $1 点"],
        ["(.+) crits? (.+?)", "$1 <span class='crits'>暴击</span> $2"],
        ["(?:and )?takes? (\\d+)(?: points)?", "受到 $1 点", "attack"],

        ["(.+) was hits?", "$1 被击中"],
        ["(.+) was crits?", "$1 被暴击击中"],
        ["(.+) was (\\d)x-crit", "$1 被 $2倍暴击 击中"],
        [
            "(\\d)x-crit (.+)(?=[.,;])",
            "<span class='crits'>$1 倍暴击</span> $2",
        ],
        ["from the brink of defeat", "从死亡的边缘复活了", "attack"],

        // 应对
        ["(.+) counter (.+)", "$1 <span class='resist'>反击</span> $2"],

        // 闪避
        ["(.+) evades? the attack from (.+)(?=[.,;])", "$1 闪避了 $2 的攻击."],
        ["(.+) evades? the attack(?=[.,;])", "$1 闪避了攻击"],
        ["(.+) evades? (.+) spell(?=[.,;])", "$1 闪避了 $2 法术"],
        ["but misses the attack", "但这次攻击没有命中"],

        // 格挡招架
        [
            "(.+) partially blocks? and partially (?:parry|parries) the attack",
            "$1 部分格挡及部分招架了攻击",
        ],
        [
            "(.+) blocks? and partially (?:parry|parries) the attack from (.+)(?=[.,;])",
            "$1 格挡及部分招架了 $2 的攻击",
        ],
        [
            "(.+) partially blocks? and (?:parry|parries) the attack from (.+)(?=[.,;])",
            "$1 部分格挡及招架了 $2 的攻击",
        ],
        [
            "(.+) blocks? and parry the attack from (.+)(?=[.,;])",
            " $1 格挡及招架了 $2 的攻击",
        ],

        // 格挡
        ["(.+) blocks? the attack from (.+)(?=[.,;])", "$1 格挡了 $2 的攻击"],
        ["(.+) partially blocks? the attack", "$1 部分格挡攻击"],
        ["(.+) blocks? the attack", "$1 格挡了攻击"],

        // 招架
        [
            "(.+) (?:parry|parrys|parries) the attack from (.+)(?=[.,;])",
            "$1 招架了 $2 的攻击",
        ],
        ["(.+) partially (parry|parries) the attack", "$1 部分招架攻击"],
        ["(.+) (parry|parries) the attack(?=[.,;])", "$1 招架了攻击"],

        // 抵抗
        [
            "(.+) partially resists? the effects of (.+) spell(?=[.,;])",
            "$1 部分抵抗了 $2 状态法术",
        ],
        [
            "(.+) partially resists? (.*) spell(?=[.,;])",
            "$1 部分抵抗了 $2 法术",
        ],

        [
            "(.+) partially blocks? and resists? the attack",
            "$1 部分格挡及抵抗了攻击",
        ],

        ["(.+) resists? (.+) spell(?=[.,;])", "$1 抵抗了 $2 法术"],
        ["(.+) resists? the attack(?=[.,;])", "$1 抵抗了攻击"],

        // 胜利
        ["(.+) ha(?:ve|s) been defeated", "$1 被击败了"],
        ["have escaped from the battle", "从战斗中脱离了"],
        ["Stop kicking the dead horse", "别再鞭尸啦"],

        ["(.+) dropped (.+)", "$1 掉落了 $2"],
        ["(.+) drops a (.+) powerup", "$1 掉落了一颗 $2 道具"],

        ["You gain", "你得到了"],
        ["You( have)? obtained", "你获得了"],
        ["You are Victorious", "你胜利了"],
        ["have reached Level (\\d+)", "升级至 $1"],
        ["one Mastery Point", "1 技能点"],
        ["the title:", "称号:"],

        ["one-handed weapon proficiency", "单手武器的熟练度"],
        ["two-handed weapon proficiency", "双手武器的熟练度"],
        ["one-handed proficiency", "单手熟练度"],
        ["two-handed proficiency", "双手熟练度"],
        ["dual-?wielding proficiency", "双持熟练度"],
        ["staff proficiency", "法杖熟练度"],
        ["cloth armor proficiency", "布甲熟练度"],
        ["light armor proficiency", "轻甲熟练度"],
        ["heavy armor proficiency", "重甲熟练度"],
        ["elemental magic proficiency", "元素魔法熟练度"],
        ["divine magic proficiency", "神圣魔法熟练度"],
        ["forbidden magic proficiency", "黑暗魔法熟练度"],
        ["deprecating magic proficiency", "减益魔法熟练度"],
        ["supportive magic proficiency", "增益魔法熟练度"],
        ["A traveling salesmoogle gives", "自动出售后给予了"],
        ["A traveling salesmoogle salvages it into", "自动分解后给予了"],
        ["plus (.+) for the remains", "外加来自残余的 $1"],
        ["Arena Token Bonus!", "获得竞技场令牌奖励!"],
        ["Battle Clear Bonus!", "获得战斗胜利奖励!"],
        ["Capacitor Level", "电容器（魔力+2%/级）等级"],
        ["Juggernaut Level", "勇士（生命+2%/级）等级"],
        ["Butcher Level", "屠夫（武器攻击伤害+2%/级）等级"],
        ["Fatality Level", "致命（攻击暴击伤害+2%/级）等级"],
        ["Overpower Level", "压制（反招架率+4%/级）等级"],
        ["Swift Strike Level", "迅捷打击（攻速+1.92%/级）等级"],
        ["Annihilator Level", "毁灭者（魔法暴击伤害+2%/级）等级"],
        ["Archmage Level", "大法师（武器魔法伤害+2%/级）等级"],
        ["Economizer Level", "节约者（魔力消耗减免+5%/级）等级"],
        ["Penetrator Level", "穿透者（反抵抗率+4%/级）等级"],
        ["Spellweaver Level", "织法者（施法速度+1.5%/级）等级"],
        ["Coldproof Level", "抗寒（冰冷抗性+4%/级）等级"],
        ["Darkproof Level", "驱暗（黑暗抗性+4%/级）等级"],
        ["Elecproof Level", "绝缘（闪电抗性+4%/级）等级"],
        ["Fireproof Level", "耐热（火焰抗性+4%/级）等级"],
        ["Holyproof Level", "驱圣（神圣抗性+4%/级）等级"],
        ["Windproof Level", "防风（疾风抗性+4%/级）等级"],
        ["potential has increased by", "潜经验提升了"],

        //武器效果
        ["Stunned", "眩晕"],
        ["Bleeding Wound", "流血"],
        ["Penetrated Armor", "破甲"],
        ["Void Strike", "虚空打击", "strike"],
        ["Fire Strike", "火焰打击", "strike"],
        ["Cold Strike", "冰霜打击", "strike"],
        ["Elec Strike", "闪电打击", "strike"],
        ["Wind Strike", "狂风打击", "strike"],
        ["Holy Strike", "神圣打击", "strike"],
        ["Dark Strike", "黑暗打击", "strike"],
        ["spike shield", "刺盾", "strike"],
        ["[sS]pirit [sS]hield", "灵力盾", "strike"],
    ];

    const equipsWords = [
        ///////////////////////////////////////////武器种类
        // 单手武器类
        ["Dagger", "*匕首（单）"],
        ["Sword Chucks", "*锁链双剑（单）"],
        ["Swordchucks", "*锁链双剑（双）"],
        ["Shortsword", "短剑（单）"],
        ["Wakizashi", "脇差（单）"],
        ["Axe", "斧（单）"],
        ["Club", "棍（单）"],
        ["Rapier", "<span style='background: #ffa500'>西洋剑</span>（单）"],
        //双手
        ["Great Mace", "重锤"],
        ["Scythe", "*镰刀（双）"],
        ["Longsword", "长剑（双）"],
        ["Katana", "太刀（双）"],
        ["Mace", "重槌（双）"],
        ["Estoc", "刺剑（双）"],
        //法杖
        ["Staff", "法杖"],
        //布甲
        ["Cap ", "兜帽 "],
        ["Cap$", "兜帽"],
        ["Cap/", "兜帽/"],
        ["Cap<", "兜帽<"],
        ["Robe", "长袍"],
        ["Gloves", "手套"],
        ["Pants", "短裤"],
        ["Shoes", "鞋"],
        //轻甲
        ["Helmet", "头盔"],
        ["Breastplate", "护胸"],
        ["Gauntlets", "手甲"],
        ["Leggings", "护腿"],
        //重甲
        ["Cuirass", "胸甲"],
        ["Armor", "盔甲"],
        ["Sabatons", "铁靴"],
        ["Boots", "靴子"],
        ["Greaves", "护胫"],
        //锁子甲
        ["Coif", "头巾"],
        ["Mitons", "护手"],
        ["Hauberk", "装甲"],
        ["Chausses", "裤"],

        /////////////////////////////盾或者材料,武器不会出现这个
        ["Buckler", "圆盾"],
        ["Kite Shield", "鸢盾"],
        ["Tower Shield", "*塔盾"],
        ["Force Shield", "<span style='background: #ffa500'>力场盾</span>"],

        ////////////////////////材质前缀////////////////////////
        //布甲
        [
            "Cotton",
            "棉质<span style='background: #FFFFFF; color: #000000'>(布)</span>",
        ],
        [
            "Gossamer",
            "*薄纱<span style='background: #FFFFFF; color: #000000'>(布)</span>",
        ],
        [
            "Silk",
            "*丝绸<span style='background: #FFFFFF; color: #000000'>(布)</span>",
        ],
        [
            "Ironsilk",
            "*铁绸<span style='background: #FFFFFF; color: #000000'>(布)</span>",
        ],
        [
            "Phase",
            "<span style='background: #ffa500'>相位</span><span style='background: #FFFFFF; color: #000000'>(布)</span>",
        ],
        //轻甲
        [
            "Leather",
            "皮革<span style='background: #666666; color: #FFFFFF'>(轻)</span>",
        ],
        [
            "Kevlar",
            "*凯夫拉<span style='background: #666666; color: #FFFFFF'>(轻)</span>",
        ],
        [
            "Dragon Hide",
            "*龙皮<span style='background: #666666; color: #FFFFFF'>(轻)</span>",
        ],
        [
            "Drakehide",
            "*龙皮<span style='background: #666666; color: #FFFFFF'>(轻)</span>",
        ],
        [
            "Shade",
            "<span style='background: #ffa500'>暗影</span><span style='background: #666666; color: #FFFFFF'>(轻)</span>",
        ],
        //重甲
        [
            "Chainmail",
            "*锁子甲<span style='background: #000000; color: #FFFFFF'>(重)</span>",
        ],
        [
            "Chain",
            "*锁子甲<span style='background: #000000; color: #FFFFFF'>(重)</span>",
        ],
        [
            "Reactive",
            "*反应装甲<span style='background: #000000; color: #FFFFFF'>(重)</span>",
        ],
        [
            "Plate",
            "板甲<span style='background: #000000; color: #FFFFFF'>(重)</span>",
        ],
        [
            "Power",
            "<span style='background: #ffa500'>动力</span><span style='background: #000000; color: #FFFFFF'>(重)</span>",
        ],
        //法杖
        ["Ebony", "*乌木"],
        ["Redwood", "红木"],
        ["Willow", "柳木"],
        ["Oak", "橡木"],
        ["Katalox", "铁木"],

        ///////////////////////////////////////////防具后缀////////////////////////////////////////////
        ["of Negation", "否定"],
        ["of the Shadowdancer", "影舞者"],
        ["of the Arcanist", "奥术师"],
        ["of the Fleet", "迅捷"],
        ["of the Fire-eater", "噬火者"],
        ["of the Thunder-child", "雷之子"],
        ["of the Wind-waker", "风之杖"],
        ["of the Frost-born", "冰人"],
        ["of the Spirit-ward", "灵魂护佑"],
        ["of the Thrice-blessed", "三重祝福"],
        ["of the Stone-skinned", "硬皮"],
        ["of Dampening", "抑制"],
        ["of Stoneskin", "石肤"],
        ["of Deflection", "偏转"],
        ["of the Nimble", "招架"],
        ["of the Barrier", "格挡"],
        ["of Protection", "物防"],
        ["of Warding", "魔防"],

        ["of the Ox", "牛（力量）"],
        ["of the Raccoon", "浣熊（灵巧）"],
        ["of the Cheetah", "猎豹（敏捷）"],
        ["of the Turtle", "乌龟（体质）"],
        ["of the Fox", "狐狸（智力）"],
        ["of the Owl", "猫头鹰（智慧）"],
        ["of the Hulk", "浩克"],
        ["of the Shielding Aura", "守护光环"],

        ////////////////////////////////////////////////////武器后缀/////////////////////////////////
        [
            "of Slaughter",
            "<span style='background: #FF0000; color: #FFFFFF'>杀戮</span>",
        ],
        ["of Swiftness", "加速"],
        ["of Balance", "平衡"],
        ["of the Battlecaster", "战法师"],
        ["of the Banshee", "报丧女妖"],
        ["of the Illithid", "灵吸怪"],
        ["of the Vampire", "吸血鬼"],
        [
            "of Destruction",
            "<span style='background: #9400d3; color: #FFFFFF'>毁灭</span>",
        ],
        ["of Surtr", "<span style='background: #f97c7c'>苏尔特（火伤）</span>"],
        [
            "of Niflheim",
            "<span style='background: #94c2f5'>尼芙菲姆（冰伤）</span>",
        ],
        [
            "of Mjolnir",
            "<span style='background: #f4f375'>姆乔尔尼尔（雷伤）</span>",
        ],
        ["of Freyr", "<span style='background: #7ff97c'>弗瑞尔（风伤）</span>"],
        [
            "of Heimdall",
            "<span style='background: #ffffff; color: #000000'>海姆达（圣伤）</span>",
        ],
        [
            "of Fenrir",
            "<span style='background: #000000; color: #ffffff'>芬里尔（暗伤）</span>",
        ],
        ["of Focus", "专注"],
        ["of the Elementalist", "元素使"],
        ["of the Heaven-sent", "天堂"],
        ["of the Demon-fiend", "恶魔"],
        ["of the Earth-walker", "地行者"],
        ["of the Priestess", "牧师"],
        ["of the Curse-weaver", "咒术师"],

        ///////////////武器或者防具属性/////////////////
        [
            "Radiant",
            "<span style='background: #ffffff; color: #000000'>✪魔光✪</span>",
        ],
        ["Mystic", "神秘的"],
        ["Charged", "<span style='color:red'>充能的</span>"],
        [
            "Amber",
            "<span style='background: #ffff00; color: #9f9f16'>琥珀的（雷抗）</span>",
        ],
        ["Mithril", "<span style='color:red'>秘银的</span>"],
        ["Agile", "俊敏的"],
        [
            "Zircon",
            "<span style='background: #ffffff; color: #5c5a5a'>锆石的（圣抗）</span>",
        ],
        ["Frugal", "<span style='color:red'>节能</span>"],
        ["Jade", "<span style='background: #b1f9b1'>翡翠的（风抗）</span>"],
        ["Cobalt", "<span style='background: #a0f4f4'>钴石的（冰抗）</span>"],
        ["Ruby", "<span style='background: #ffa6a6'>红宝石（火抗）</span>"],
        ["Onyx", "<span style='background: #cccccc'>缟玛瑙（暗抗）</span>"],
        ["Savage", "<span style='color:red'>野蛮的</span>"],
        ["Reinforced", "加固的"],
        ["Shielding", "盾化的"],
        ["Arctic", "<span style='background: #94c2f5'>极寒之</span>"],
        ["Fiery", "<span style='background: #f97c7c'>灼热之</span>"],
        ["Shocking", "<span style='background: #f4f375'>闪电之</span>"],
        ["Tempestuous", "<span style='background: #7ff97c'>风暴之</span>"],
        [
            "Hallowed",
            "<span style='background: #ffffff; color: #000000'>神圣之</span>",
        ],
        [
            "Demonic",
            "<span style='background: #000000; color: #ffffff'>恶魔之</span>",
        ],
        [
            "Ethereal",
            "<span style='background: #ffffff; color: #5c5a5a'>虚空之</span>",
        ],

        ["Bronze ", "铜 "],
        ["Iron ", "铁 "],
        ["Silver ", "银 "],
        ["Steel ", "钢 "],
        ["Gold ", "金 "],
        ["Bronze-", "铜-"],
        ["Iron-", "铁-"],
        ["Silver-", "银-"],
        ["Steel-", "钢-"],
        ["Gold-", "金-"],
        ["Platinum", "白金"],
        ["Titanium", "钛"],
        ["Emerald", "祖母绿"],
        ["Sapphire", "蓝宝石"],
        ["Diamond", "金刚石"],
        ["Prism", "光棱"],
        ["-trimmed", "-镶边"],
        ["-adorned", "-装饰"],
        ["-tipped", "-前端"],
        ["Astral", "五芒星"],
        ["Quintessential", "第五元素"],

        /////////////////品质//////////
        ["Flimsy ", "薄弱 "],
        ["Crude", "<span style='background: #acacac'>劣质</span> "],
        ["Fair", "<span style='background: #c1c1c1'>一般</span> "],
        ["Average", "<span style='background: #dfdfdf'>中等</span> "],
        ["Superior", "<span style='background: #fbf9f9'>上等</span> "],
        ["Fine", "<span style='background: #b9ffb9'>优质</span> "],
        ["Exquisite", "<span style='background: #d7e698'>✧精良✧</span> "],
        ["Magnificent", "<span style='background: #a6daf6'>☆史诗☆</span> "],
        ["Legendary", "<span style='background: #ffbbff'>✪传奇✪</span> "],
        ["Peerless", "<span style='background: #ffd760'>☯无双☯</span> "],
    ];

    const itemWords = [
        ["(\\d+) Credits", "$1 Credits", "credits"],

        // 药
        ["Refreshment", "灵力长效药", "effect"],
        ["Regeneration", "生命长效药", "effect"],
        ["Replenishment", "魔力长效药", "effect"],
        ["Kicking Ass", "海扁"],
        ["Sleeper Imprint", "沉睡烙印"],

        // 道具
        ["Health Gem", "生命宝石"],
        ["Mana Gem", "魔力宝石"],
        ["Spirit Gem", "灵力宝石"],
        ["Mystic Gem", "神秘宝石"],
        ["Health Potion", "体力药水"],
        ["Health Draught", "体力长效药"],
        ["Health Elixir", "体力秘药"],
        ["Mana Potion", "法力药水"],
        ["Mana Draught", "法力长效药"],
        ["Mana Elixir", "法力秘药"],
        ["Spirit Potion", "灵力药水"],
        ["Spirit Draught", "灵力长效药"],
        ["Spirit Elixir", "灵力秘药"],
        ["Last Elixir", "终极秘药"],
        ["Energy Drink", "能量饮料"],
        ["Caffeinated Candy", "咖啡因糖果"],
        ["Soul Stone", "灵魂石"],
        ["Flower Vase", "花瓶"],
        ["Bubble-Gum", "泡泡糖"],
        ["Infusion of Darkness", "黑暗魔药"],
        ["Infusion of Divinity", "神圣魔药"],
        ["Infusion of Storms", "风暴魔药"],
        ["Infusion of Lightning", "闪电魔药"],
        ["Infusion of Frost", "冰冷魔药"],
        ["Infusion of Flames", "火焰魔药"],
        ["Infusion of Gaia", "盖亚魔药"],
        ["Scroll of Swiftness", "加速卷轴"],
        ["Scroll of the Avatar", "化身卷轴"],
        ["Scroll of Shadows", "幻影卷轴"],
        ["Scroll of Absorption", "吸收卷轴"],
        ["Scroll of Life", "生命卷轴"],
        ["Scroll of Protection", "守护卷轴"],
        ["Scroll of the Gods", "众神卷轴"],
        ["Soul Fragments", "灵魂碎片", "fragments"],

        ["Monster Chow", "怪物饲料", "monsterItem"],
        ["Golden Lottery Ticket", "黄金彩票券"],
        ["Binding of Slaughter", "粘合剂 基础物理伤害"],
        ["Binding of Balance", "粘合剂 物理命中率"],
        ["Binding of Isaac", "粘合剂 物理暴击率"],
        ["Binding of Destruction", "粘合剂 基础魔法伤害"],
        ["Binding of Focus", "粘合剂 魔法命中率"],
        ["Binding of Friendship", "粘合剂 魔法暴击率"],
        ["Binding of Protection", "粘合剂 物理减伤"],
        ["Binding of Warding", "粘合剂 魔法减伤"],
        ["Binding of the Fleet", "粘合剂 回避率"],
        ["Binding of the Barrier", "粘合剂 格挡率"],
        ["Binding of the Nimble", "粘合剂 招架率"],
        ["Binding of Negation", "粘合剂 抵抗率"],
        ["Binding of the Ox", "粘合剂 力量"],
        ["Binding of the Raccoon", "粘合剂 灵巧"],
        ["Binding of the Cheetah", "粘合剂 敏捷"],
        ["Binding of the Turtle", "粘合剂 体质"],
        ["Binding of the Fox", "粘合剂 智力"],
        ["Binding of the Owl", "粘合剂 感知"],
        ["Binding of the Elementalist", "粘合剂 元素魔法熟练度"],
        ["Binding of the Heaven-sent", "粘合剂 神圣魔法熟练度"],
        ["Binding of the Demon-fiend", "粘合剂 黑暗魔法熟练度"],
        ["Binding of the Curse-weaver", "粘合剂 减益魔法熟练度"],
        ["Binding of the Earth-walker", "粘合剂 增益魔法熟练度"],
        ["Binding of Surtr", "粘合剂 火属性咒语伤害"],
        ["Binding of Niflheim", "粘合剂 冰属性咒语伤害"],
        ["Binding of Mjolnir", "粘合剂 雷属性咒语伤害"],
        ["Binding of Freyr", "粘合剂 风属性咒语伤害"],
        ["Binding of Heimdall", "粘合剂 圣属性咒语伤害"],
        ["Binding of Fenrir", "粘合剂 暗属性咒语伤害"],
        ["Binding of Dampening", "粘合剂 敲击减伤"],
        ["Binding of Stoneskin", "粘合剂 斩击减伤"],
        ["Binding of Deflection", "粘合剂 刺击减伤"],
        ["Binding of the Fire-eater", "粘合剂 火属性减伤"],
        ["Binding of the Frost-born", "粘合剂 冰属性减伤"],
        ["Binding of the Thunder-child", "粘合剂 雷属性减伤"],
        ["Binding of the Wind-waker", "粘合剂 风属性减伤"],
        ["Binding of the Thrice-blessed", "粘合剂 圣属性减伤"],
        ["Binding of the Spirit-ward", "粘合剂 暗属性减伤"],

        ["Crystal of Vigor", "力量水晶", "crystal"],
        ["Crystal of Finesse", "灵巧水晶", "crystal"],
        ["Crystal of Swiftness", "敏捷水晶", "crystal"],
        ["Crystal of Fortitude", "体质水晶", "crystal"],
        ["Crystal of Cunning", "智力水晶", "crystal"],
        ["Crystal of Knowledge", "感知水晶", "crystal"],
        ["Crystal of Flames", "火焰水晶", "crystal"],
        ["Crystal of Frost", "冰冻水晶", "crystal"],
        ["Crystal of Lightning", "闪电水晶", "crystal"],
        ["Crystal of Tempest", "疾风水晶", "crystal"],
        ["Crystal of Devotion", "神圣水晶", "crystal"],
        ["Crystal of Corruption", "暗黑水晶", "crystal"],
        ["Crystal of Quintessence", "灵魂水晶", "crystal"],

        ["Monster Edibles", "怪物食品", "monsterItem"],
        ["Monster Cuisine", "怪物料理", "monsterItem"],
        ["Happy Pills", "快乐药丸", "monsterItem"],

        ["Wispy Catalyst", "纤小 催化剂"],
        ["Diluted Catalyst", "稀释 催化剂"],
        ["Regular Catalyst", "平凡 催化剂"],
        ["Robust Catalyst", "充沛 催化剂"],
        ["Vibrant Catalyst", "活力 催化剂"],
        ["Coruscating Catalyst", "闪耀 催化剂"],
        ["Low-Grade Cloth", "低级布料"],
        ["Mid-Grade Cloth", "中级布料"],
        ["High-Grade Cloth", "高级布料"],
        ["Low-Grade Leather", "低级皮革"],
        ["Mid-Grade Leather", "中级皮革"],
        ["High-Grade Leather", "高级皮革"],
        ["Low-Grade Metals", "低级金属"],
        ["Mid-Grade Metals", "中级金属"],
        ["High-Grade Metals", "高级金属"],
        ["Low-Grade Wood", "低级木头"],
        ["Mid-Grade Wood", "中级木头"],
        ["High-Grade Wood", "高级木头"],
        ["Scrap Metal", "金属废料"],
        ["Scrap Leather", "皮革废料"],
        ["Scrap Wood", "木材废料"],
        ["Scrap Cloth", "布制废料"],
        ["Energy Cell", "能量元"],
        ["Defense Matrix Modulator", "力场碎片(盾)"],
        ["Repurposed Actuator", "动力碎片(重)"],
        ["Shade Fragment", "暗影碎片(轻)"],
        ["Crystallized Phazon", "相位碎片(布)"],
        ["Legendary Weapon Core", "传奇武器核心"],
        ["Peerless Weapon Core", "无双武器核心"],
        ["Legendary Staff Core", "传奇法杖核心"],
        ["Peerless Staff Core", "无双法杖核心"],
        ["Legendary Armor Core", "传奇护甲核心"],
        ["Peerless Armor Core", "无双护甲核心"],
        ["Voidseeker Shard", "虚空碎片"],
        ["Featherweight Shard", "羽毛碎片"],
        ["Aether Shard", "以太碎片"],
        ["Amnesia Shard", "重铸碎片"],
        ["Soul Fragment", "灵魂碎片"],
        ["Blood Token", "鲜血令牌", "token"],
        ["Token of Blood", "鲜血令牌", "token"],
        ["Chaos Token", "混沌令牌", "token"],

        ["Hollowforged", "虚空升华"],
        ["Silk Charm Pouch", "丝绸护符袋"],
        ["Kevlar Charm Pouch", "凯夫拉护符袋"],
        ["Mithril Charm Pouch", "秘银护符袋"],
        ["Lesser Featherweight Charm", "次级轻羽护符"],
        ["Greater Featherweight Charm", "强效轻羽护符"],
        ["Lesser Hollowforged Charm", "次级虚空升华护符"],
        ["Greater Hollowforged Charm", "强效虚空升华护符"],
        ["Lesser Fire Strike Charm", "次级火焰打击护符"],
        ["Greater Fire Strike Charm", "强效火焰打击护符"],
        ["Lesser Cold Strike Charm", "次级寒冰打击护符"],
        ["Greater Cold Strike Charm", "强效寒冰打击护符"],
        ["Lesser Lightning Strike Charm", "次级闪电打击护符"],
        ["Greater Lightning Strike Charm", "强效闪电打击护符"],
        ["Lesser Wind Strike Charm", "次级狂风打击护符"],
        ["Greater Wind Strike Charm", "强效狂风打击护符"],
        ["Lesser Holy Strike Charm", "次级神圣打击护符"],
        ["Greater Holy Strike Charm", "强效神圣打击护符"],
        ["Lesser Dark Strike Charm", "次级黑暗打击护符"],
        ["Greater Dark Strike Charm", "强效黑暗打击护符"],
        ["Lesser Butcher Charm", "次级物理伤害加成护符"],
        ["Greater Butcher Charm", "强效物理伤害加成护符"],
        ["Lesser Swiftness Charm", "次级迅捷护符"],
        ["Greater Swiftness Charm", "强效迅捷护符"],
        ["Lesser Fatality Charm", "次级物理暴击护符"],
        ["Greater Fatality Charm", "强效物理暴击护符"],
        ["Lesser Overpower Charm", "次级反招架护符"],
        ["Greater Overpower Charm", "强效反招架护符"],
        ["Lesser Voidseeker Charm", "次级虚空护符"],
        ["Greater Voidseeker Charm", "强效虚空护符"],
        ["Lesser Archmage Charm", "次级魔法伤害加成护符"],
        ["Greater Archmage Charm", "强效魔法伤害加成护符"],
        ["Lesser Economizer Charm", "次级节能护符"],
        ["Greater Economizer Charm", "强效节能护符"],
        ["Lesser Spellweaver Charm", "次级高速咏唱护符"],
        ["Greater Spellweaver Charm", "强效高速咏唱护符"],
        ["Lesser Annihilator Charm", "次级魔法暴击护符"],
        ["Greater Annihilator Charm", "强效魔法暴击护符"],
        ["Lesser Penetrator Charm", "次级反魔法抵抗护符"],
        ["Greater Penetrator Charm", "强效反魔法抵抗护符"],
        ["Lesser Aether Charm", "次级以太护符"],
        ["Greater Aether Charm", "强效以太护符"],
        ["Lesser Fire-proof Charm", "次级火焰抗性护符"],
        ["Greater Fire-proof Charm", "强效火焰抗性护符"],
        ["Lesser Cold-proof Charm", "次级寒冰抗性护符"],
        ["Greater Cold-proof Charm", "强效寒冰抗性护符"],
        ["Lesser Lightning-proof Charm", "次级闪电抗性护符"],
        ["Greater Lightning-proof Charm", "强效闪电抗性护符"],
        ["Lesser Wind-proof Charm", "次级狂风抗性护符"],
        ["Greater Wind-proof Charm", "强效狂风抗性护符"],
        ["Lesser Holy-proof Charm", "次级神圣抗性护符"],
        ["Greater Holy-proof Charm", "强效神圣抗性护符"],
        ["Lesser Dark-proof Charm", "次级黑暗抗性护符"],
        ["Greater Dark-proof Charm", "强效黑暗抗性护符"],
        ["Lesser Juggernaut Charm", "次级生命加成护符"],
        ["Greater Juggernaut Charm", "强效生命加成护符"],
        ["Lesser Capacitor Charm", "次级魔力加成护符"],
        ["Greater Capacitor Charm", "强效魔力加成护符"],
        ["World Seed", "世界种子"],
        ["Precursor Artifact", "古遗物"],
        ["ManBearPig Tail", "人熊猪的尾巴(等级2)", "collectables"],
        ["Mithra's Flower", "猫人族的花(等级2)", "collectables"],
        [
            "Holy Hand Grenade of Antioch",
            "安提阿的神圣手榴弹(等级2)",
            "collectables",
        ],
        ["Dalek Voicebox", "戴立克音箱(等级2)", "collectables"],
        ["Lock of Blue Hair", "一绺蓝发(等级2)", "collectables"],
        ["Bunny-Girl Costume", "兔女郎装(等级3)", "collectables"],
        ["Hinamatsuri Doll", "雏人形(等级3)", "collectables"],
        ["Broken Glasses", "破碎的眼镜(等级3)", "collectables"],
        ["Sapling", "树苗(等级4)", "collectables"],
        ["Black T-Shirt", "黑色Ｔ恤(等级4)", "collectables"],
        ["Unicorn Horn", "独角兽的角(等级5)", "collectables"],
        ["Noodly Appendage", "面条般的附肢(等级6)", "collectables"],

        ["Bronze Coupon", "铜礼券(等级3)", "collectables"],
        ["Silver Coupon", "银礼券(等级5)", "collectables"],
        ["Gold Coupon", "黄金礼券(等级7)", "collectables"],
        ["Platinum Coupon", "白金礼券(等级8)", "collectables"],
        ["Peerless Voucher", "无双凭证"],
    ];

    const baseWords = [
        ["(?<=^|\\s)(Y|y)our", "你的", "you"],
        ["(?<=^|\\s)(Y|y)ou", "你", "you"],
        ["points(!| of)", "点"],
        ["EXP", "经验"],
        ["Recovered", "恢复了"],

        // 状态
        ["Regen", "细胞活化", "effect"],
        ["Protection", "守护", "effect"],
        ["Spirit Shield", "灵力盾", "effect"],
        ["Hastened", "急速", "effect"],
        ["Shadow Veil", "影纱", "effect"],
        ["Absorbing Ward", "吸收结界", "effect"],
        ["Spark of Life", "生命火花", "effect"],
        ["Cloak of the Fallen", "陨落斗篷", "effect"],
        ["Heartseeker", "觅心者", "effect"],
        ["Arcane Focus", "奥术集中", "effect"],
        ["Channeling", "引导", "effect"],
        ["Fleeing", "逃跑", "effect"],
        ["Blessing of the RiddleMaster", "御谜士的祝福", "effect"],
        ["Defending", "防御", "effect"],
        ["Focusing", "专注", "effect"],

        // 怪物
        ["Vital Theft", "生命汲取", "debuff"],
        ["Ether Theft", "魔力汲取", "debuff"],
        ["Spirit Theft", "灵力汲取", "debuff"],
        ["Confused", "混乱", "debuff"],
        ["Hastened", "急速", "debuff"],
        ["Absorbing Ward", "吸收结界", "debuff"],
        ["Slowed", "缓慢", "debuff"],
        ["Weakened", "虚弱", "debuff"],
        ["Imperiled", "陷危", "debuff"],
        ["Blinded", "盲目", "debuff"],
        ["Asleep", "沉眠", "debuff"],
        ["Silenced", "沉默", "debuff"],
        ["Magically Snared", "魔磁网", "debuff"],
        ["Immobilized", "魔磁网", "debuff"],

        //攻击咒语效果
        ["Searing Skin", "焦灼皮肤"],
        ["Freezing Limbs", "冰封肢体"],
        ["explodes", "爆裂"],
        ["Turbulent Air", "空气湍流"],
        ["Deep Burns", "深层烧伤"],
        ["Breached Defense", "防御崩溃"],
        ["Blunted Attack", "攻击钝化"],

        //战斗风格
        ["Overwhelming Strikes", "压制打击"],
        ["Coalesced Mana", "魔力合流"],
        ["Ether Tap", "魔力回流"],

        // 技能
        ["offhand", "副手攻击"],
        ["Flee", "逃跑"],
        ["Scan", "扫描"],
        ["FUS RO DAH", "龙吼"],
        [
            "Orbital Friendship Cannon",
            `
            <font color="#FF0000">友</font>
            <font color="#CC0033">谊</font>
            <font color="#990066">小</font>
            <font color="#660099">马</font>
            <font color="#3300CC">炮</font>`,
        ],
        ["Concussive Strike", "震荡打击"],
        ["Skyward Sword", "天空之剑"],
        ["Frenzied Blows", "狂乱百裂斩"],
        ["Iris Strike", "虹膜打击"],
        ["Backstab", "背刺"],
        ["Shatter Strike", "粉碎打击"],
        ["Rending Blow", "撕裂打击"],
        ["Great Cleave", "大劈砍"],
        ["Merciful Blow", "最后的慈悲"],
        ["Shield Bash", "盾击"],
        ["Vital Strike", "致命打击"],
        ["Arcane Blow", "奥术冲击"],

        ["Fiery Blast", "炎爆术(Ⅰ)"],
        ["Inferno", "地狱火(Ⅱ)"],
        ["Flames of Loki", "邪神之火(Ⅲ)"],
        ["Freeze", "冰冻(Ⅰ)"],
        ["Blizzard", "暴风雪(Ⅱ)"],
        ["Fimbulvetr", "芬布尔之冬(Ⅲ)"],
        ["Shockblast", "电能爆破(Ⅰ)"],
        ["Chained Lightning", "连锁闪电(Ⅱ)"],
        ["Wrath of Thor", "雷神之怒(Ⅲ)"],
        ["Gale", "烈风(Ⅰ)"],
        ["Downburst", "下击暴流(Ⅱ)"],
        ["Storms of Njord", "尼奥尔德风暴(Ⅲ)"],
        ["Smite", "惩戒(Ⅰ)"],
        ["Banishment", "放逐(Ⅱ)"],
        ["Paradise Lost", "失乐园(Ⅲ)"],
        ["Corruption", "腐化(Ⅰ)"],
        ["Disintegrate", "瓦解(Ⅱ)"],
        ["Ragnarok", "诸神黄昏(Ⅲ)"],

        ["Drain", "枯竭"],
        ["Slow", "缓慢"],
        ["Weaken", "虚弱"],
        ["Silence", "沉默"],
        ["Sleep", "沉眠"],
        ["Confuse", "混乱"],
        ["Imperil", "陷危"],
        ["Blind", "致盲"],
        ["MagNet", "魔磁网"],
        ["Immobilize", "魔磁网"],

        //法术
        ["Regen", "细胞活化"],
        ["Full-Cure", "完全治疗术"],
        ["Cure", "治疗术"],
        ["Haste", "急速"],
        ["Protection", "守护"],
        ["Shadow Veil", "影纱"],
        ["Absorb", "吸收"],
        ["Spark of Life", "生命火花"],
        ["Arcane Focus", "奥术集中"],
        ["Heartseeker", "觅心者"],

        //属性
        ["(of )?health", '<span style="color: #80B440">生命</span>'],
        ["(of )?magic", '<span style="color: #639AD4">魔力</span>'],
        ["(of )?spirit", '<span style="color: #D4637A">灵力</span>'],

        // 伤害
        [
            "(of )?[Ss]pirit damage",
            '<span style="color: #9f3000">灵力值伤害</span>',
            "harm",
        ],

        [
            "(of )?[Ff]ire damage",
            '<span style="color: #ae0c4f">火焰伤害</span>',
            "harm",
        ],
        [
            "(of )?[Cc]old damage",
            '<span style="color: #0067b1">冰冷伤害</span>',
            "harm",
        ],
        [
            "(of )?[Vv]oid damage",
            '<span style="color: #3c3c3c">虚空伤害</span>',
            "harm",
        ],
        [
            "(of )?[Ee]lec damage",
            '<span style="color: #b6b300">闪电伤害</span>',
            "harm",
        ],
        [
            "(of )?[Ww]ind damage",
            '<span style="color: #008920">疾风伤害</span>',
            "harm",
        ],
        [
            "(of )?[Dd]ark damage",
            '<span style="color: #161616">黑暗伤害</span>',
            "harm",
        ],
        [
            "(of )?[Hh]oly damage",
            '<span style="color: #700081">神圣伤害</span>',
            "harm",
        ],
        [
            "(of )?[Cc]rushing damage",
            '<span style="color: #944f00">打击伤害</span>',
            "harm",
        ],
        [
            "(of )?[Ss]lashing damage",
            '<span style="color: #ae4300">斩击伤害</span>',
            "harm",
        ],
        [
            "(of )?[Pp]iercing damage",
            '<span style="color: #e21e00">刺击伤害</span>',
            "harm",
        ],
        ["Precise Strike", "精准打击"],
        ["Unlocked", "解锁"],
        ["innate", "内在"],
        ["potential", ': "潜能:'],
    ];

    const RunData = {
        _defaultLog: null,
        _translator: null,

        get defaultLog() {
            if (this._defaultLog?.isConnected) {
                return this._defaultLog;
            }

            const defaultLog = document.querySelector(`#${defaultLogID}`);
            if (!defaultLog) {
                throw Error("无法读取到原始日志");
            }
            this.defaultLog = defaultLog;
            return defaultLog;
        },

        set defaultLog(Element) {
            this._defaultLog = Element;
        },

        get translator() {
            if (this._translator?.isConnected) {
                return this._translator;
            }

            const translator = document.querySelector(`#${translatorID}`);
            if (!translator) {
                throw Error("无法获取到翻译日志");
            }
            this.translator = translator;
            return translator;
        },

        set translator(Element) {
            this._translator = Element;
        },

        monster: new Set(),
    };

    function addStyle() {
        const styleConfig = {
            default: `#mainpane #${defaultLogID} { display: none;}`,
            translator: translatorStyle,
            custom: customStyle,
        };
        for (const key in styleConfig) {
            GM_addStyle(styleConfig[key]);
        }
    }

    function monsterTranslator(text) {
        let newText = text;

        if (text.startsWith("Spawned Monster")) {
            text.matchAll(
                /^(Spawned Monster .*:) (.*) \(([\w\s-_]+)\) (LV=\d+) (HP=\d+)/g
            ).forEach((matchs) => {
                RunData.monster.add(matchs[3]);
                newText = `${matchs[1]} ${matchs[4]} ${matchs[5]} ${matchs[2]} (${matchs[3]})`;
            });
        }

        if (RunData.monster.size == 0) {
            document
                .querySelectorAll("#pane_monster .btm3")
                .forEach((element) => {
                    RunData.monster.add(element.innerText);
                });
            if (RunData.monster.size != 0) {
                return monsterTranslator(text);
            }
        }

        for (const [name, _] of RunData.monster.entries()) {
            if (text.search(name) > -1) {
                newText = newText.replace(
                    name,
                    `<span class="monster">${name}</span>`
                );
                break;
            }
        }

        return newText;
    }

    function Translator(text, regList) {
        let newText = text;
        for (const [regText, trText, ...style] of regList) {
            const classText = style.join(" ");
            newText = newText.replaceAll(
                new RegExp(regText, "g"),
                classText
                    ? `<span class="${classText}">${trText}</span>`
                    : trText
            );
        }

        return newText;
    }

    function equipsTranslator(text) {
        if (!text.match(/\[.+\]/)) {
            return text;
        }

        return Translator(
            text,
            equipsWords.map((arr) => {
                const [regText, ..._] = arr;
                return [
                    `(?<!<span class="monster">[^<]{0,99})${regText}`,
                    ..._,
                ];
            })
        );
    }

    function itemsTranslator(text) {
        return Translator(
            text,
            itemWords.map((arr) => {
                const [regText, ..._] = arr;
                return [
                    `(?<!<span class="monster">[^<]{0,99})${regText}`,
                    ..._,
                ];
            })
        );
    }

    function wordsTranslator(text) {
        return Translator(
            text,
            baseWords.map((arr) => {
                const [regText, ..._] = arr;
                return [
                    `(?<!<span class="monster">[^<]{0,99})${regText}`,
                    ..._,
                ];
            })
        );
    }

    function sentenceTranslator(text) {
        return Translator(text, sentences);
    }

    function TextTranslator(text) {
        const translatorText = text
            ? [
                  monsterTranslator,
                  sentenceTranslator,
                  itemsTranslator,
                  equipsTranslator,
                  wordsTranslator,
              ].reduce((Text, func) => func(Text), text)
            : text;

        const Element = document.createElement("tr");
        Element.innerHTML = `<td>${translatorText}</td>`;
        return Element;
    }

    function LogProcess(Element) {
        const text = Element.innerText;
        console.debug("rawLog:", text);

        const node = TextTranslator(text);

        if (Element?.firstElementChild.classList.length) {
            const classList = Element.firstElementChild.classList;
            node?.firstElementChild.classList.add(classList);

            if (
                text === "" &&
                classList.contains("tls") &&
                node.firstElementChild
            ) {
                node.firstElementChild.textContent = "---";
            }
        }

        const translatorBody = RunData.translator.firstElementChild;
        translatorBody.insertBefore(node, translatorBody.firstElementChild);
    }

    function LogRemove() {
        const translatorBody = RunData.translator.firstElementChild;
        translatorBody.lastElementChild?.remove();
    }

    function obs_Log() {
        function checkNode(node) {
            if (node.nodeType != Node.ELEMENT_NODE) {
                return false;
            }
            if (!(node instanceof Element)) {
                return false;
            }

            if (!node.matches("tr")) {
                return false;
            }
            return true;
        }

        const defaultLog = RunData.defaultLog;
        const obs = new MutationObserver((mutationList) => {
            for (const mutation of mutationList) {
                for (const node of mutation.addedNodes) {
                    if (checkNode(node)) {
                        LogProcess(node);
                    }
                }
                for (const node of mutation.removedNodes) {
                    if (checkNode(node)) {
                        LogRemove();
                    }
                }
            }
        });
        obs.observe(defaultLog.lastElementChild, { childList: true });

        const zhTable = document.createElement("table");
        const zhLog = document.createElement("tbody");

        zhTable.id = translatorID;
        zhTable.appendChild(zhLog);
        defaultLog.parentElement.appendChild(zhTable);

        // 添加已存在日志
        const logs = defaultLog.lastElementChild?.querySelectorAll("tr");
        [...logs].reverse().forEach((item) => LogProcess(item));

        // 结合战斗翻译开关
        document.addEventListener("dblclick", function (ev) {
            if (ev.target && ev.target.id == "infopane") {
                const currentDisplay =
                    window.getComputedStyle(defaultLog).display;
                defaultLog.style.display =
                    currentDisplay === "none" ? "block" : "";

                const zhTableDisplay = window.getComputedStyle(zhTable).display;
                zhTable.style.display =
                    zhTableDisplay === "none" ? "block" : "none";
            }
        });
    }

    function initDefaultLog(func) {
        const log = document.querySelector(`#${defaultLogID}`);
        if (log) {
            RunData.defaultLog = log;
            func();
            return;
        }

        document.addEventListener("DOMContentLoaded", () => {
            const obs = new MutationObserver((mutationList) => {
                for (const mutation of mutationList) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType != Node.ELEMENT_NODE) {
                            continue;
                        }
                        if (!(node instanceof Element)) {
                            continue;
                        }

                        if (node.id === defaultLogID) {
                            RunData.defaultLog = node;
                            obs.disconnect();
                            func();
                            return;
                        }
                    }
                }
            });

            obs.observe(document, { childList: true, subtree: true });
        });
    }

    addStyle();
    initDefaultLog(obs_Log);
})();
