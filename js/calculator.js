/**
 * 轻食智配 · NutriPlan
 * Body Metrics Calculator
 * Calculates BMR, TDEE, macro targets based on user profile
 */

const Calculator = (() => {

  /**
   * Calculate BMI
   * @param {number} weightKg
   * @param {number} heightCm
   * @returns {{value: number, category: string}}
   */
  function calcBMI(weightKg, heightCm) {
    const heightM = heightCm / 100;
    const value = weightKg / (heightM * heightM);
    let category;
    if (value < 18.5) category = '偏瘦';
    else if (value < 24) category = '正常';
    else if (value < 28) category = '超重';
    else category = '肥胖';
    return { value: Math.round(value * 10) / 10, category };
  }

  /**
   * Calculate Basal Metabolic Rate (Mifflin-St Jeor equation)
   * @param {number} weightKg
   * @param {number} heightCm
   * @param {number} age
   * @param {string} gender - 'male' or 'female'
   * @returns {number} BMR in kcal/day
   */
  function calcBMR(weightKg, heightCm, age, gender) {
    if (gender === 'male') {
      return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
    } else {
      return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
    }
  }

  /**
   * Calculate Total Daily Energy Expenditure
   * @param {number} bmr
   * @param {string} activityLevel - sedentary, light, moderate, active, very_active
   * @returns {number} TDEE in kcal/day
   */
  function calcTDEE(bmr, activityLevel) {
    const multipliers = {
      sedentary: 1.2,      // 久坐，基本不运动
      light: 1.375,        // 轻度活动（1-3天/周）
      moderate: 1.55,      // 中等活动（3-5天/周）
      active: 1.725,       // 高度活动（6-7天/周）
      very_active: 1.9,    // 极高活动（体力劳动/专业运动员）
    };
    return Math.round(bmr * (multipliers[activityLevel] || 1.375));
  }

  /**
   * Calculate lean body mass (Boer formula)
   * @param {number} weightKg
   * @param {number} heightCm
   * @param {string} gender
   * @returns {number} LBM in kg
   */
  function calcLeanBodyMass(weightKg, heightCm, gender) {
    if (gender === 'male') {
      return Math.round((0.407 * weightKg + 0.267 * heightCm - 19.2) * 10) / 10;
    } else {
      return Math.round((0.252 * weightKg + 0.473 * heightCm - 48.3) * 10) / 10;
    }
  }

  /**
   * Calculate daily calorie target for weight loss
   * @param {number} tdee
   * @param {number} weeklyLossKg - Target kg loss per week (0.5 recommended)
   * @returns {number} Daily calorie target
   */
  function calcCalorieTarget(tdee, weeklyLossKg = 0.5) {
    // 1 kg fat ≈ 7700 kcal
    const dailyDeficit = (weeklyLossKg * 7700) / 7;
    return Math.round(tdee - dailyDeficit);
  }

  /**
   * Calculate macronutrient targets
   * @param {number} calorieTarget
   * @param {number} leanBodyMass
   * @param {Object} options - {proteinPerKgLBM, fatPercent}
   * @returns {{protein: number, fat: number, carbs: number}}
   */
  function calcMacros(calorieTarget, leanBodyMass, options = {}) {
    const proteinPerKg = options.proteinPerKgLBM || 2.0; // g per kg LBM
    const fatPercent = options.fatPercent || 0.25; // 25% of calories from fat

    const protein = Math.round(leanBodyMass * proteinPerKg);
    const fat = Math.round((calorieTarget * fatPercent) / 9);
    const carbCalories = calorieTarget - (protein * 4) - (fat * 9);
    const carbs = Math.round(carbCalories / 4);

    return { protein, fat, carbs };
  }

  /**
   * Get full profile calculations
   * @param {Object} profile - User profile data
   * @returns {Object} All calculated metrics
   */
  function getFullMetrics(profile) {
    const { height, weight, age, gender, activityLevel, weeklyLossTarget } = profile;

    const bmi = calcBMI(weight, height);
    const bmr = calcBMR(weight, height, age, gender);
    const tdee = calcTDEE(bmr, activityLevel);
    const lbm = calcLeanBodyMass(weight, height, gender);
    const calorieTarget = calcCalorieTarget(tdee, weeklyLossTarget || 0.5);
    const macros = calcMacros(calorieTarget, lbm);

    return {
      bmi,
      bmr,
      tdee,
      leanBodyMass: lbm,
      calorieTarget,
      macros,
      dailyDeficit: tdee - calorieTarget,
    };
  }

  /**
   * Determine food restrictions based on conditions
   * @param {string[]} conditions - Array of diagnosed conditions
   * @returns {Object} Restrictions and recommendations
   */
  function getConditionRestrictions(conditions) {
    const restrictions = {
      avoid: [],
      limit: [],
      prefer: [],
      notes: [],
    };

    const conditionRules = {
      '高尿酸': {
        avoid: ['动物内脏', '带壳海鲜', '沙丁鱼', '鲭鱼', '啤酒', '高果糖饮料'],
        limit: ['红肉（每日≤80g）', '中嘌呤食物'],
        prefer: ['低脂乳制品', '樱桃', '维C丰富食物（彩椒、柑橘）', '充足饮水(≥2L/天)'],
        notes: ['每日嘌呤摄入建议<300mg', '发作期应<150mg'],
      },
      '痛风': {
        avoid: ['动物内脏', '带壳海鲜', '沙丁鱼', '鲭鱼', '啤酒', '高果糖饮料'],
        limit: ['红肉（每日≤80g）', '中嘌呤食物', '豆类（适量）'],
        prefer: ['低脂乳制品', '樱桃', '维C丰富食物', '充足饮水(≥2L/天)'],
        notes: ['每日嘌呤摄入建议<300mg', '急性发作期<150mg'],
      },
      '高血压': {
        avoid: ['腌制食品', '加工肉类'],
        limit: ['钠摄入（每日<2000mg）', '酒精'],
        prefer: ['高钾食物（香蕉、菠菜）', 'DASH饮食模式', '全谷物'],
        notes: ['遵循DASH饮食原则', '控制钠摄入'],
      },
      '糖尿病': {
        avoid: ['含糖饮料', '精制糖', '白面包'],
        limit: ['高GI食物', '精制碳水'],
        prefer: ['低GI食物', '全谷物', '高纤维蔬菜', '优质蛋白'],
        notes: ['注意碳水化合物计数', '均匀分配碳水到每餐'],
      },
      '高血脂': {
        avoid: ['油炸食品', '反式脂肪'],
        limit: ['饱和脂肪（<总热量7%）', '胆固醇（<200mg/天）'],
        prefer: ['ω-3脂肪酸（深海鱼、亚麻籽）', '可溶性纤维（燕麦）', '坚果（适量）'],
        notes: ['优先选择不饱和脂肪来源'],
      },
      '肾病': {
        avoid: ['高钠食物'],
        limit: ['蛋白质摄入', '钾（需医嘱）', '磷'],
        prefer: ['优质低蛋白食物'],
        notes: ['⚠️ 请务必遵循肾内科医生指导，蛋白质摄入量需个性化调整'],
      },
    };

    for (const condition of conditions) {
      const rules = conditionRules[condition];
      if (rules) {
        restrictions.avoid.push(...rules.avoid);
        restrictions.limit.push(...rules.limit);
        restrictions.prefer.push(...rules.prefer);
        restrictions.notes.push(...rules.notes);
      }
    }

    // Deduplicate
    restrictions.avoid = [...new Set(restrictions.avoid)];
    restrictions.limit = [...new Set(restrictions.limit)];
    restrictions.prefer = [...new Set(restrictions.prefer)];
    restrictions.notes = [...new Set(restrictions.notes)];

    return restrictions;
  }

  return {
    calcBMI,
    calcBMR,
    calcTDEE,
    calcLeanBodyMass,
    calcCalorieTarget,
    calcMacros,
    getFullMetrics,
    getConditionRestrictions,
  };
})();
