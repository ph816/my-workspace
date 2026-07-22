/**
 * 轻食智配 · NutriPlan
 * 4-Week Rotation Meal Data
 */

const WEEK_DATA = [
  // ─── Week 1: 低脂高蛋白经典版 ───
  {
    label: '低脂高蛋白经典版',
    shopping: {
      protein: [
        { name: '鸡胸肉（去皮去骨）', detail: '400g 生重', price: '¥8-12' },
        { name: '鸡蛋', detail: '10个', price: '¥6-8' },
        { name: '老豆腐 / 北豆腐', detail: '350g', price: '¥3-5' },
      ],
      grain: [
        { name: '糙米', detail: '500g（余下备下次）', price: '¥5-8' },
        { name: '红薯', detail: '400g', price: '¥3-5' },
      ],
      veg: [
        { name: '西兰花', detail: '400g', price: '¥4-6' },
        { name: '胡萝卜', detail: '180g', price: '¥2-3' },
        { name: '红/黄彩椒', detail: '200g（富含维C，有益降尿酸）', price: '¥4-6' },
        { name: '西葫芦', detail: '200g', price: '¥2-3' },
        { name: '菠菜 / 羽衣甘蓝', detail: '150g', price: '¥2-3' },
      ],
    },
    freshNote: null,
    steps: [
      {
        title: '煮糙米',
        time: '主动操作20分钟 + 被动等待40分钟',
        items: [
          '称出 <strong>320g 糙米</strong>，充分淘洗2-3遍至水变清',
          '按 <strong>1:1.5 比例</strong> 加水（糙米320g → 加水480ml）',
          '电饭锅选"糙米"档，或大火烧开转小火焖40分钟',
          '煮好后<strong>摊开在大盘上晾凉</strong>（防结块，加速冷却）— 同时进行后续步骤',
        ],
        tipClass: 'alert-blue',
        tip: '<strong>💡 小贴士</strong> 糙米320g干重 ≈ 800g熟重，正好5份每份160g。晾凉时可用风扇辅助。',
      },
      {
        title: '处理鸡胸肉',
        time: '约25分钟',
        items: [
          '鸡胸肉400g均匀涂抹少量<strong>橄榄油、蒜末、黑胡椒</strong>（不加盐）',
          '腌制5分钟等待入味',
          '放入<strong>空气炸锅</strong>，180°C 烤 <strong>18-20分钟</strong>（中途翻面一次）',
          '用竹签刺入最厚处确认无粉红色，熟透后取出',
          '冷却后<strong>顺纤维方向撕成细丝</strong>（撕丝冻后口感更佳）',
        ],
        tipClass: 'alert-orange',
        tip: '<strong>⚠️ 痛风提示</strong> 鸡肉属中嘌呤食物，每份80g（熟重）在安全范围内。若近期关节不适，可将份量减至50g，豆腐增至100g。',
      },
      {
        title: '处理老豆腐',
        time: '约10分钟（含压水）',
        items: [
          '老豆腐350g切成约 <strong>1.5cm 小块</strong>',
          '用<strong>厨房纸巾</strong>包裹，上方压重物静置 <strong>10分钟</strong> 排出多余水分',
          '放入空气炸锅 <strong>200°C 烤10-12分钟</strong> 至表面微金黄',
          '取出冷却备用（烤后质地紧实，冷冻复热不会软烂）',
        ],
        tipClass: 'alert-green',
        tip: '<strong>✅ 为什么选老豆腐？</strong> 北豆腐/老豆腐嘌呤含量低，低脂乳蛋白有助于促进尿酸排泄，是痛风患者优质蛋白质来源。',
      },
      {
        title: '煮鸡蛋（全熟）',
        time: '约15分钟',
        items: [
          '<strong>冷水</strong>放入10个鸡蛋，开火',
          '水沸腾后继续计时 <strong>10分钟</strong>（全熟蛋）',
          '捞出立即放入<strong>冰水</strong>浸泡5分钟（好剥壳）',
          '全部剥壳，每个切成<strong>4瓣</strong>备用',
        ],
        tipClass: 'alert-blue',
        tip: '<strong>💡 蛋黄提示</strong> 全蛋冷冻后蛋白会变橡皮。若介意，可将蛋黄单独封装，或全部打散炒成蛋碎（口感最均匀）。',
      },
      {
        title: '蔬菜焯水',
        time: '约15分钟',
        items: [
          '烧一大锅水至沸腾，<strong>不加盐</strong>',
          '<strong>胡萝卜</strong>（切小丁，180g）先下锅，焯 <strong>3分钟</strong>，捞出放冰水',
          '<strong>西兰花</strong>（切小朵，400g）焯 <strong>2分钟</strong>，捞出放冰水',
          '<strong>西葫芦</strong>（切半圆片，200g）焯 <strong>1.5分钟</strong>，捞出放冰水',
          '<strong>彩椒</strong>（切小块，200g）焯 <strong>1分钟</strong>（保留维C），捞出放冰水',
          '<strong>菠菜</strong>（150g）最后放，焯 <strong>30秒</strong>即可，捞出放冰水',
          '所有蔬菜从冰水捞出，<strong>充分甩干/沥干水分</strong>（水分越少冷冻质量越好）',
        ],
        tipClass: 'alert-orange',
        tip: '<strong>⚠️ 注意焯水顺序</strong> 按耐热性从高到低依次入锅，可用同一锅水无需换水。',
      },
      {
        title: '红薯 → 混合 → 分装',
        time: '约30分钟',
        items: [
          '红薯400g去皮切约 <strong>2cm 小块</strong>，空气炸锅 <strong>200°C 烤20-22分钟</strong>至熟软，冷却备用',
          '确认所有食材均已<strong>冷却至室温</strong>再混合',
          '大盆中放入糙米 + 蔬菜 + 红薯，<strong>轻轻翻拌</strong>均匀',
          '加入鸡肉丝和豆腐块，继续轻拌（勿压碎豆腐）',
          '加入切好的鸡蛋',
          '称重分为 <strong>5等份（每份约680g）</strong>，装入密封容器或冷冻袋',
          '贴标签：<strong>前3份冷藏</strong>（3天内食用），<strong>后2份冷冻</strong>',
        ],
        tipClass: 'alert-green',
        tip: '<strong>🎉 备餐完成！</strong> 储存时限：冷藏保鲜3天，冷冻最佳赏味期2周（最长4周）。记得提前一晚将冷冻份转移到冷藏解冻。',
      },
    ],
    nutrition: {
      portionDesc: '约680g混合物',
      rows: [
        { name: '鸡胸肉（熟撕丝）',   weight: '80g',        kcal: '132 kcal', protein: '25g',   carb: '0g',   fat: '3g'   },
        { name: '鸡蛋（全熟）',        weight: '2个（~100g）', kcal: '143 kcal', protein: '12.6g', carb: '0.7g', fat: '9.5g' },
        { name: '老豆腐（烤压干）',    weight: '70g',        kcal: '56 kcal',  protein: '5.1g',  carb: '1.5g', fat: '3.4g' },
        { name: '熟糙米',             weight: '160g',       kcal: '185 kcal', protein: '3.9g',  carb: '41g',  fat: '1.6g' },
        { name: '红薯（烤熟）',        weight: '70g',        kcal: '63 kcal',  protein: '1.1g',  carb: '15g',  fat: '0.1g' },
        { name: '混合蔬菜（焯水）',    weight: '200g',       kcal: '65 kcal',  protein: '4.2g',  carb: '12g',  fat: '0.8g' },
        { name: '烹饪用油（残留）',    weight: '—',          kcal: '25 kcal',  protein: '0g',    carb: '0g',   fat: '2.8g' },
      ],
      total: { weight: '~680g', kcal: '≈669 kcal', protein: '≈52g', carb: '≈70g', fat: '≈21g' },
    },
  },
  // ─── Week 2: 猪肉+鲈鱼双蛋白版 ───
  {
    label: '猪肉+鲈鱼双蛋白版',
    shopping: {
      protein: [
        { name: '猪梅头肉', detail: '300g 生重', price: '¥10-15' },
        { name: '鲈鱼', detail: '300g 净重（约2条小鲈）', price: '¥15-20' },
        { name: '鸡蛋', detail: '10个', price: '¥6-8' },
        { name: '北豆腐（嫩豆腐）', detail: '350g', price: '¥3-5' },
      ],
      grain: [
        { name: '藜麦', detail: '300g（需充分预洗去皂苷）', price: '¥12-18' },
        { name: '紫薯', detail: '350g', price: '¥4-6' },
      ],
      veg: [
        { name: '胡萝卜', detail: '180g', price: '¥2-3' },
        { name: '西葫芦', detail: '200g', price: '¥2-3' },
        { name: '番茄', detail: '250g（🥒生鲜鲜加，不冷冻）', price: '¥3-5' },
        { name: '黄瓜', detail: '200g（🥒生鲜鲜加，不冷冻）', price: '¥2-3' },
        { name: '小白菜', detail: '200g', price: '¥2-3' },
        { name: '圆白菜', detail: '200g', price: '¥2-3' },
      ],
    },
    freshNote: '🥒🍅 本周含生鲜蔬菜：番茄、黄瓜每天现切鲜加，不混入冷冻批次',
    steps: [
      {
        title: '煮藜麦',
        time: '约30分钟（含预洗）',
        items: [
          '<strong>冷水搓洗藜麦300g</strong>至水不起泡（去除苦味皂苷，此步不可省略）',
          '加水450ml（1:1.5比例）放入锅中',
          '大火烧开转小火，焖煮 <strong>15分钟</strong>至颗粒透明出现小白圈',
          '摊开晾凉，颗粒分明即可',
        ],
        tipClass: 'alert-blue',
        tip: '<strong>💡 藜麦小贴士</strong> 藜麦含完全蛋白质，GI值比糙米低。预洗是关键，不洗会有明显苦味。',
      },
      {
        title: '处理猪梅头肉',
        time: '约20分钟',
        items: [
          '猪梅头肉300g切薄片（约5mm厚）',
          '冷水下锅，<strong>大火烧开后撇去浮沫</strong>',
          '转小火煮 <strong>15分钟</strong>至熟透',
          '捞出沥干，冷却备用（吃时再调味）',
        ],
        tipClass: 'alert-orange',
        tip: '<strong>⚠️ 猪肉嘌呤提示</strong> 猪梅头肉属中嘌呤食物，每份60g在安全范围。若关节不适，可减量至40g，增加豆腐补足蛋白。',
      },
      {
        title: '清蒸鲈鱼',
        time: '约20分钟',
        items: [
          '鲈鱼300g鱼身两面划几刀，姜片垫底入盘',
          '<strong>蒸锅水开后</strong>大火蒸 <strong>10-12分钟</strong>',
          '取出去皮去骨，撕成鱼块',
          '冷却备用（不加调料，吃时鲜加少量生抽）',
        ],
        tipClass: 'alert-blue',
        tip: '<strong>💡 鲈鱼低嘌呤</strong> 鲈鱼嘌呤含量相对较低，富含DHA和优质蛋白，是痛风患者可适量食用的鱼类。',
      },
      {
        title: '煎北豆腐',
        time: '约15分钟',
        items: [
          '北豆腐350g切1.5cm厚片，厨房纸吸干表面水分',
          '平底锅加 <strong>5ml橄榄油</strong>，中火预热',
          '每面煎 <strong>3-4分钟</strong>至表面金黄',
          '冷却备用（外酥内嫩）',
        ],
        tipClass: 'alert-green',
        tip: '<strong>✅ 本周换北豆腐</strong> 北豆腐与老豆腐交替使用，保持饮食多样性，嘌呤含量同样较低。',
      },
      {
        title: '煮鸡蛋（全熟）',
        time: '约15分钟',
        items: [
          '<strong>冷水</strong>放入10个鸡蛋，开火',
          '水沸腾后继续计时 <strong>10分钟</strong>（全熟蛋）',
          '捞出立即放入<strong>冰水</strong>浸泡5分钟',
          '全部剥壳，每个切成<strong>4瓣</strong>备用',
        ],
        tipClass: 'alert-blue',
        tip: '<strong>💡 同第1周方法</strong> 全熟蛋冷冻效果好，可与其他食材混合储存。',
      },
      {
        title: '蔬菜焯水',
        time: '约15分钟',
        items: [
          '烧一大锅水至沸腾，<strong>不加盐</strong>',
          '<strong>胡萝卜</strong>（切小丁，180g）先下锅，焯 <strong>3分钟</strong>，捞出放冰水',
          '<strong>西葫芦</strong>（切半圆片，200g）焯 <strong>1.5分钟</strong>，捞出放冰水',
          '<strong>小白菜</strong>（整叶，200g）焯 <strong>30秒</strong>，捞出放冰水',
          '<strong>圆白菜</strong>（手撕大块，200g）焯 <strong>2分钟</strong>，捞出放冰水',
          '所有焯水蔬菜<strong>充分沥干</strong>，冷却备用',
          '⚠️ <strong>番茄和黄瓜不焯水</strong>，每天取出时现切鲜加',
        ],
        tipClass: 'alert-blue',
        tip: '<strong>🥒🍅 生鲜蔬菜处理</strong> 番茄和黄瓜不适合冷冻，每天复热时现切加入，保持清爽口感和维C。',
      },
      {
        title: '紫薯 → 混合 → 分装',
        time: '约30分钟',
        items: [
          '紫薯350g去皮切2cm小块，上蒸锅，水开后蒸 <strong>20分钟</strong>至熟软，冷却备用',
          '确认所有食材均已<strong>冷却至室温</strong>再混合',
          '大盆中放入藜麦 + 焯水蔬菜 + 紫薯，<strong>轻轻翻拌</strong>均匀',
          '加入猪梅头肉片、鱼块、豆腐，继续轻拌',
          '加入切好的鸡蛋',
          '称重分为 <strong>5等份</strong>，装入密封容器',
          '贴标签：前3份冷藏，后2份冷冻；另备好番茄和黄瓜单独冷藏',
        ],
        tipClass: 'alert-green',
        tip: '<strong>🎉 备餐完成！</strong> 每天取出时鲜加番茄和黄瓜，提升口感和营养。',
      },
    ],
    nutrition: {
      portionDesc: '约675g混合物',
      rows: [
        { name: '猪梅头肉（熟切片）',  weight: '50g',        kcal: '90 kcal',  protein: '9g',    carb: '0g',   fat: '6g'   },
        { name: '鲈鱼（蒸熟）',        weight: '50g',        kcal: '52 kcal',  protein: '9.4g',  carb: '0g',   fat: '1.7g' },
        { name: '鸡蛋（全熟）',        weight: '2个（~100g）', kcal: '143 kcal', protein: '12.6g', carb: '0.7g', fat: '9.5g' },
        { name: '北豆腐（煎）',        weight: '70g',        kcal: '57 kcal',  protein: '5.7g',  carb: '1.1g', fat: '3.5g' },
        { name: '熟藜麦',             weight: '140g',       kcal: '150 kcal', protein: '5.3g',  carb: '28g',  fat: '2.4g' },
        { name: '紫薯（蒸熟）',        weight: '65g',        kcal: '59 kcal',  protein: '1g',    carb: '13g',  fat: '0.1g' },
        { name: '混合蔬菜（焯水）',    weight: '200g',       kcal: '65 kcal',  protein: '4.2g',  carb: '12g',  fat: '0.8g' },
        { name: '烹饪用油（残留）',    weight: '—',          kcal: '25 kcal',  protein: '0g',    carb: '0g',   fat: '2.8g' },
      ],
      total: { weight: '~675g', kcal: '≈641 kcal', protein: '≈47g', carb: '≈55g', fat: '≈27g' },
    },
  },
  // ─── Week 3: 牛肉大补版 ───
  {
    label: '牛肉大补版',
    shopping: {
      protein: [
        { name: '牛里脊', detail: '300g 生重（富含铁和锌）', price: '¥18-25' },
        { name: '鸡蛋', detail: '10个', price: '¥6-8' },
        { name: '老豆腐', detail: '350g', price: '¥3-5' },
      ],
      grain: [
        { name: '糙米', detail: '320g（若上周有剩可不买）', price: '¥3-5' },
        { name: '红薯', detail: '350g', price: '¥3-5' },
      ],
      veg: [
        { name: '胡萝卜', detail: '180g', price: '¥2-3' },
        { name: '番茄', detail: '200g（热锅略炒提升吸收）', price: '¥3-4' },
        { name: '西兰花', detail: '400g', price: '¥4-6' },
        { name: '彩椒（红/黄）', detail: '200g（🥒生鲜鲜加，不冷冻）', price: '¥4-6' },
        { name: '茄子', detail: '200g（空气炸锅，勿刷油）', price: '¥2-3' },
        { name: '四季豆', detail: '200g（⚠️必须焯熟≥4分钟）', price: '¥2-3' },
      ],
    },
    freshNote: '🫑 本周彩椒生鲜鲜加：每天现切加入，保留更多维C，不混入冷冻批次',
    steps: [
      {
        title: '煮糙米',
        time: '主动操作20分钟 + 被动等待40分钟',
        items: [
          '称出 <strong>320g 糙米</strong>，充分淘洗2-3遍至水变清',
          '按 <strong>1:1.5 比例</strong> 加水（糙米320g → 加水480ml）',
          '电饭锅"糙米"档煮熟，或大火烧开转小火焖40分钟',
          '煮好后<strong>摊开晾凉</strong>，同时进行后续步骤',
        ],
        tipClass: 'alert-blue',
        tip: '<strong>💡 本周同第1周</strong> 糙米320g干重 ≈ 800g熟重，正好5份每份160g。',
      },
      {
        title: '处理牛里脊',
        time: '约15分钟（含腌制）',
        items: [
          '牛里脊300g <strong>逆纹切薄片</strong>（约3mm），加生抽10ml腌制10分钟',
          '热锅加橄榄油5ml，<strong>大火</strong>翻炒 <strong>2分钟</strong>',
          '保留嫩度，不要炒过头（变柴影响口感）',
          '冷却备用',
        ],
        tipClass: 'alert-blue',
        tip: '<strong>💡 牛肉铁锌</strong> 牛里脊富含血红素铁（吸收率比植物铁高2-3倍）和锌，有助于提升免疫力和能量代谢。',
      },
      {
        title: '处理老豆腐（蒸法）',
        time: '约15分钟',
        items: [
          '老豆腐350g切成约 <strong>1.5cm 小块</strong>',
          '铺在蒸盘中，<strong>蒸锅水开后</strong>大火蒸 <strong>10分钟</strong>',
          '冷却备用（蒸法口感更嫩，与第1周烤法形成变化）',
        ],
        tipClass: 'alert-green',
        tip: '<strong>✅ 本周换蒸法</strong> 蒸豆腐质地更嫩滑，与牛肉搭配形成软嫩对比。',
      },
      {
        title: '炒鸡蛋碎',
        time: '约10分钟',
        items: [
          '10个鸡蛋全部打散，加少量盐搅匀',
          '热锅加<strong>5ml橄榄油</strong>，中大火',
          '倒入蛋液，<strong>快速翻炒至碎粒状</strong>（不要炒整块）',
          '冷却备用（炒蛋碎冷冻后口感优于整蛋，均匀分布在每份中）',
        ],
        tipClass: 'alert-blue',
        tip: '<strong>💡 本周换炒碎法</strong> 蛋碎均匀混入备餐中，每份蛋白质分布更均匀，复热效果更好。',
      },
      {
        title: '蔬菜处理',
        time: '约20分钟',
        items: [
          '烧一大锅水至沸腾，<strong>不加盐</strong>',
          '<strong>胡萝卜</strong>（切小丁，180g）焯 <strong>3分钟</strong>，捞出放冰水',
          '<strong>西兰花</strong>（切小朵，400g）焯 <strong>2分钟</strong>，捞出放冰水',
          '⚠️ <strong>四季豆</strong>（去筋折段，200g）焯 <strong>4分钟至暗绿色</strong>，确保熟透防凝集素中毒',
          '茄子200g切2cm块，<strong>空气炸锅200°C烤15分钟</strong>（不用刷油）',
          '番茄200g切小块，热锅 <strong>略炒1分钟</strong>出汁备用（加热后番茄红素更易吸收）',
          '⚠️ <strong>彩椒(200g)不焯水</strong>，每天取出时现切细条鲜加',
        ],
        tipClass: 'alert-red',
        tip: '<strong>⚠️ 四季豆安全提示</strong> 生四季豆含凝集素毒素，必须焯至颜色变暗绿（至少4分钟），确认无生脆感方可食用。',
      },
      {
        title: '红薯（微波炉）→ 混合 → 分装',
        time: '约25分钟',
        items: [
          '红薯350g去皮切2cm块，平铺微波容器，加2汤匙水',
          '微波炉<strong>高火5-6分钟</strong>至熟软，冷却备用',
          '确认所有食材均已<strong>冷却至室温</strong>',
          '大盆中放入糙米 + 胡萝卜 + 西兰花 + 四季豆 + 茄子 + 番茄 + 红薯，轻拌',
          '加入牛里脊片、豆腐块、鸡蛋碎，继续轻拌',
          '称重分为 <strong>5等份</strong>，装入密封容器；另备彩椒放冷藏',
          '贴标签：前3份冷藏，后2份冷冻',
        ],
        tipClass: 'alert-green',
        tip: '<strong>🎉 备餐完成！</strong> 每天复热时加入生切彩椒，清爽口感与维C加倍。',
      },
    ],
    nutrition: {
      portionDesc: '约650g混合物',
      rows: [
        { name: '牛里脊（熟炒）',      weight: '50g',        kcal: '78 kcal',  protein: '11.3g', carb: '0g',   fat: '3.8g' },
        { name: '鸡蛋（炒碎）',        weight: '2个（~100g）', kcal: '155 kcal', protein: '12.6g', carb: '0.7g', fat: '11g'  },
        { name: '老豆腐（蒸）',        weight: '70g',        kcal: '56 kcal',  protein: '5.1g',  carb: '1.5g', fat: '3.4g' },
        { name: '熟糙米',             weight: '160g',       kcal: '185 kcal', protein: '3.9g',  carb: '41g',  fat: '1.6g' },
        { name: '红薯（微波熟）',      weight: '70g',        kcal: '63 kcal',  protein: '1.1g',  carb: '15g',  fat: '0.1g' },
        { name: '混合蔬菜（焯水）',    weight: '200g',       kcal: '65 kcal',  protein: '4.2g',  carb: '12g',  fat: '0.8g' },
        { name: '烹饪用油（残留）',    weight: '—',          kcal: '25 kcal',  protein: '0g',    carb: '0g',   fat: '2.8g' },
      ],
      total: { weight: '~650g', kcal: '≈627 kcal', protein: '≈38g', carb: '≈70g', fat: '≈24g' },
    },
  },
  // ─── Week 4: 猪里脊+草鱼清淡版 ───
  {
    label: '猪里脊+草鱼清淡版',
    shopping: {
      protein: [
        { name: '猪里脊', detail: '300g 生重（高蛋白低脂）', price: '¥12-16' },
        { name: '草鱼', detail: '300g 净重', price: '¥10-15' },
        { name: '鸡蛋', detail: '10个（本周做溏心蛋，仅冷藏）', price: '¥6-8' },
        { name: '北豆腐', detail: '350g', price: '¥3-5' },
      ],
      grain: [
        { name: '燕麦（整燕麦粒/燕麦米）', detail: '300g干重', price: '¥8-12' },
        { name: '山药', detail: '350g（⚠️戴手套去皮）', price: '¥5-8' },
      ],
      veg: [
        { name: '胡萝卜', detail: '180g', price: '¥2-3' },
        { name: '番茄', detail: '200g（🥒生鲜鲜加，不冷冻）', price: '¥3-4' },
        { name: '菠菜', detail: '150g（⚠️草酸高，必须焯水）', price: '¥2-3' },
        { name: '西葫芦', detail: '200g', price: '¥2-3' },
        { name: '黄瓜', detail: '200g（🥒生鲜鲜加，不冷冻）', price: '¥2-3' },
        { name: '大白菜', detail: '200g', price: '¥1-2' },
      ],
    },
    freshNote: '🥒🍅 本周含生鲜蔬菜：番茄、黄瓜每天现切鲜加，不混入冷冻批次',
    steps: [
      {
        title: '煮燕麦',
        time: '约25分钟',
        items: [
          '整燕麦粒300g量入锅胆',
          '加入<strong>开水</strong>至刚好没过燕麦',
          '电饭锅<strong>保温档焖15分钟</strong>至软（或小火煮15分钟）',
          '适当干一些便于分装，摊开晾凉备用',
        ],
        tipClass: 'alert-blue',
        tip: '<strong>💡 燕麦选整粒</strong> 选整燕麦粒（燕麦米）而非即食燕麦片，GI值更低，饱腹感更持久，冷冻复热效果更好。',
      },
      {
        title: '处理猪里脊',
        time: '约20分钟（含腌制）',
        items: [
          '猪里脊300g切薄片（3-5mm），加生抽10ml腌制 <strong>10分钟</strong>',
          '煮锅水开后，放入猪里脊片',
          '中火煮 <strong>8分钟</strong>至熟透',
          '捞出冷却备用',
        ],
        tipClass: 'alert-blue',
        tip: '<strong>💡 猪里脊更清淡</strong> 猪里脊脂肪含量比梅头肉更低，与第2周形成变化，整体口味更清淡。',
      },
      {
        title: '清蒸草鱼',
        time: '约20分钟',
        items: [
          '草鱼300g切段，姜片垫底入盘',
          '<strong>蒸锅水开后</strong>大火蒸 <strong>12分钟</strong>',
          '取出<strong>去皮去刺</strong>（草鱼刺较多，需仔细），撕成鱼块',
          '冷却备用',
        ],
        tipClass: 'alert-orange',
        tip: '<strong>⚠️ 去刺提示</strong> 草鱼肌间刺较多，务必仔细去除后再混入备餐，避免误食。',
      },
      {
        title: '处理北豆腐（空气炸锅）',
        time: '约15分钟',
        items: [
          '北豆腐350g切成约 <strong>1.5cm 小块</strong>，厨房纸吸干表面',
          '放入空气炸锅 <strong>200°C 烤10-12分钟</strong>至金黄',
          '冷却备用（外酥内嫩）',
        ],
        tipClass: 'alert-green',
        tip: '<strong>✅ 空气炸锅更省油</strong> 不需额外加油，热量更低，与第2周平底锅煎法形成变化。',
      },
      {
        title: '溏心蛋（仅冷藏）',
        time: '约15分钟',
        items: [
          '<strong>冷水</strong>放入10个鸡蛋，开火',
          '水沸腾后继续计时 <strong>8分钟</strong>（溏心）',
          '捞出立即放入<strong>冰水</strong>浸泡5分钟，剥壳后对半切',
          '⚠️ <strong>溏心蛋仅冷藏保存</strong>，3天内食用，不可冷冻',
        ],
        tipClass: 'alert-orange',
        tip: '<strong>⚠️ 重要提示</strong> 溏心蛋蛋黄未完全熟透，仅适合冷藏3天内食用。如需冷冻该份备餐，此份鸡蛋请改用全熟法（10分钟）。',
      },
      {
        title: '蔬菜焯水',
        time: '约15分钟',
        items: [
          '烧一大锅水至沸腾，<strong>不加盐</strong>',
          '<strong>胡萝卜</strong>（切小丁，180g）焯 <strong>3分钟</strong>，捞出放冰水',
          '<strong>西葫芦</strong>（切半圆片，200g）焯 <strong>1.5分钟</strong>，捞出放冰水',
          '⚠️ <strong>菠菜</strong>（整叶，150g）焯 <strong>30秒</strong>（去草酸），捞出放冰水',
          '<strong>大白菜</strong>（手撕块，200g）焯 <strong>2分钟</strong>，捞出放冰水',
          '所有蔬菜充分<strong>沥干水分</strong>',
          '⚠️ <strong>番茄和黄瓜不焯水</strong>，每天现切鲜加',
        ],
        tipClass: 'alert-orange',
        tip: '<strong>⚠️ 菠菜注意</strong> 菠菜草酸含量高，必须焯水30秒以上去除大部分草酸，减少与钙结合的影响。',
      },
      {
        title: '山药 → 混合 → 分装',
        time: '约30分钟',
        items: [
          '⚠️ <strong>戴手套</strong>将山药350g去皮（防黏液致痒），切滚刀块约3cm',
          '上蒸锅，水开后蒸 <strong>15分钟</strong>至软熟，冷却备用',
          '确认所有食材均已<strong>冷却至室温</strong>',
          '大盆中放入燕麦 + 蔬菜 + 山药，轻拌均匀',
          '加入猪里脊片、鱼块、豆腐块，继续轻拌',
          '加入溏心蛋（对半切）',
          '称重分为 <strong>5等份</strong>，<strong>全部冷藏</strong>（3天内食用）；另备番茄黄瓜单独冷藏',
          '贴标签注明日期（溏心蛋批次请勿冷冻）',
        ],
        tipClass: 'alert-green',
        tip: '<strong>🎉 备餐完成！</strong> 本周全批冷藏，溏心蛋3天内食用。每天取出时鲜加番茄和黄瓜。',
      },
    ],
    nutrition: {
      portionDesc: '约690g混合物',
      rows: [
        { name: '猪里脊（熟切片）',    weight: '50g',        kcal: '61 kcal',  protein: '11.2g', carb: '0g',   fat: '1.7g' },
        { name: '草鱼（蒸熟）',        weight: '50g',        kcal: '57 kcal',  protein: '8.8g',  carb: '0g',   fat: '2.5g' },
        { name: '鸡蛋（溏心）',        weight: '2个（~100g）', kcal: '143 kcal', protein: '12.6g', carb: '0.7g', fat: '9.5g' },
        { name: '北豆腐（烤）',        weight: '70g',        kcal: '57 kcal',  protein: '5.7g',  carb: '1.1g', fat: '3.5g' },
        { name: '熟燕麦粒',           weight: '150g',       kcal: '137 kcal', protein: '4.5g',  carb: '27g',  fat: '2.6g' },
        { name: '山药（蒸熟）',        weight: '70g',        kcal: '42 kcal',  protein: '0.9g',  carb: '9.7g', fat: '0.1g' },
        { name: '混合蔬菜（焯水）',    weight: '200g',       kcal: '65 kcal',  protein: '4.2g',  carb: '12g',  fat: '0.8g' },
        { name: '烹饪用油（残留）',    weight: '—',          kcal: '25 kcal',  protein: '0g',    carb: '0g',   fat: '2.8g' },
      ],
      total: { weight: '~690g', kcal: '≈587 kcal', protein: '≈48g', carb: '≈51g', fat: '≈24g' },
    },
  },
];

// Current rotation week
// ── Current rotation week (ISO week % 4, mapped to 1-4) ──
function getISOWeek(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}
const CURRENT_WEEK = ((getISOWeek(new Date()) - 1) % 4) + 1;
