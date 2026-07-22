/**
 * 轻食智配 · NutriPlan
 * Profile Management Module
 * Handles personal metrics form, storage, and display
 */

const Profile = (() => {
  const STORAGE_KEY = 'nutriplan_profile';

  const DEFAULT_PROFILE = {
    name: '',
    height: 170,
    weight: 70,
    age: 25,
    gender: 'male',
    activityLevel: 'light',
    weeklyLossTarget: 0.5,
    conditions: [],
    allergies: [],
    notes: '',
    lastUpdated: null,
  };

  /**
   * Load profile from localStorage
   */
  function load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load profile:', e);
    }
    return { ...DEFAULT_PROFILE };
  }

  /**
   * Save profile to localStorage
   */
  function save(profile) {
    profile.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    // Dispatch event so other modules can react
    window.dispatchEvent(new CustomEvent('profileUpdated', { detail: profile }));
  }

  /**
   * Render the profile page HTML
   */
  function renderPage() {
    const profile = load();
    const metrics = Calculator.getFullMetrics(profile);
    const restrictions = Calculator.getConditionRestrictions(profile.conditions);

    return `
    <div class="page-wrap">
      <div class="page-header">
        <h1>👤 个人指标</h1>
        <p>填写你的身体数据，系统将自动计算营养需求并生成个性化方案</p>
      </div>

      <!-- Calculated Metrics Display -->
      <div class="card">
        <div class="card-title"><span class="icon">📊</span>计算结果（实时）</div>
        <div class="stat-grid" id="metricsDisplay">
          <div class="stat-item">
            <div class="stat-value">${metrics.bmi.value}</div>
            <div class="stat-label">BMI（${metrics.bmi.category}）</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">~${metrics.leanBodyMass}kg</div>
            <div class="stat-label">去脂体重</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${metrics.bmr}</div>
            <div class="stat-label">BMR（kcal/天）</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${metrics.tdee}</div>
            <div class="stat-label">TDEE（kcal/天）</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${metrics.calorieTarget}</div>
            <div class="stat-label">每日摄入目标 kcal</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${metrics.macros.protein}g</div>
            <div class="stat-label">蛋白质/天</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${metrics.macros.fat}g</div>
            <div class="stat-label">脂肪/天</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${metrics.macros.carbs}g</div>
            <div class="stat-label">碳水/天</div>
          </div>
        </div>
      </div>

      <!-- Basic Info Form -->
      <div class="card">
        <div class="card-title"><span class="icon">📏</span>基本信息</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">昵称</label>
            <input type="text" class="form-input" id="profileName" value="${profile.name}" placeholder="（选填）">
          </div>
          <div class="form-group">
            <label class="form-label">性别</label>
            <select class="form-select" id="profileGender">
              <option value="male" ${profile.gender === 'male' ? 'selected' : ''}>男</option>
              <option value="female" ${profile.gender === 'female' ? 'selected' : ''}>女</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">身高 (cm)</label>
            <input type="number" class="form-input" id="profileHeight" value="${profile.height}" min="100" max="250">
          </div>
          <div class="form-group">
            <label class="form-label">体重 (kg)</label>
            <input type="number" class="form-input" id="profileWeight" value="${profile.weight}" min="30" max="300" step="0.1">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">年龄</label>
            <input type="number" class="form-input" id="profileAge" value="${profile.age}" min="10" max="120">
          </div>
          <div class="form-group">
            <label class="form-label">活动水平</label>
            <select class="form-select" id="profileActivity">
              <option value="sedentary" ${profile.activityLevel === 'sedentary' ? 'selected' : ''}>久坐（基本不运动）</option>
              <option value="light" ${profile.activityLevel === 'light' ? 'selected' : ''}>轻度活动（1-3天/周）</option>
              <option value="moderate" ${profile.activityLevel === 'moderate' ? 'selected' : ''}>中等活动（3-5天/周）</option>
              <option value="active" ${profile.activityLevel === 'active' ? 'selected' : ''}>高度活动（6-7天/周）</option>
              <option value="very_active" ${profile.activityLevel === 'very_active' ? 'selected' : ''}>极高活动（体力劳动）</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">每周减重目标 (kg)</label>
          <select class="form-select" id="profileLossTarget">
            <option value="0.25" ${profile.weeklyLossTarget === 0.25 ? 'selected' : ''}>0.25 kg/周（温和）</option>
            <option value="0.5" ${profile.weeklyLossTarget === 0.5 ? 'selected' : ''}>0.5 kg/周（推荐）</option>
            <option value="0.75" ${profile.weeklyLossTarget === 0.75 ? 'selected' : ''}>0.75 kg/周（较快）</option>
            <option value="1" ${profile.weeklyLossTarget === 1 ? 'selected' : ''}>1 kg/周（激进，需注意健康）</option>
          </select>
          <div class="form-hint">建议每周减重不超过体重的1%</div>
        </div>
      </div>

      <!-- Health Conditions -->
      <div class="card">
        <div class="card-title"><span class="icon">🏥</span>确诊疾病 / 健康状况</div>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">
          添加已确诊的疾病，系统将自动调整食物推荐（如避开高嘌呤食物）
        </p>
        <ul class="condition-list" id="conditionList">
          ${profile.conditions.map(c => `
            <li class="condition-item">
              <span class="tag tag-red">${c}</span>
              <button class="remove-btn" onclick="Profile.removeCondition('${c}')">✕</button>
            </li>
          `).join('')}
        </ul>
        <div class="add-condition">
          <select class="form-select" id="conditionSelect" style="flex:1">
            <option value="">选择常见疾病…</option>
            <option value="高尿酸">高尿酸血症</option>
            <option value="痛风">痛风</option>
            <option value="高血压">高血压</option>
            <option value="糖尿病">糖尿病/糖尿病前期</option>
            <option value="高血脂">高血脂</option>
            <option value="肾病">肾病</option>
          </select>
          <button class="btn btn-primary" onclick="Profile.addConditionFromSelect()">添加</button>
        </div>
        <div style="margin-top:8px">
          <div class="add-condition">
            <input type="text" class="form-input" id="customCondition" placeholder="或输入其他疾病名称…">
            <button class="btn btn-secondary" onclick="Profile.addCustomCondition()">添加</button>
          </div>
        </div>
      </div>

      <!-- Allergies -->
      <div class="card">
        <div class="card-title"><span class="icon">⚠️</span>食物过敏 / 不耐受</div>
        <ul class="condition-list" id="allergyList">
          ${profile.allergies.map(a => `
            <li class="condition-item">
              <span class="tag tag-orange">${a}</span>
              <button class="remove-btn" onclick="Profile.removeAllergy('${a}')">✕</button>
            </li>
          `).join('')}
        </ul>
        <div class="add-condition">
          <input type="text" class="form-input" id="allergyInput" placeholder="如：花生、牛奶、麸质…">
          <button class="btn btn-secondary" onclick="Profile.addAllergy()">添加</button>
        </div>
      </div>

      <!-- Notes -->
      <div class="card">
        <div class="card-title"><span class="icon">📝</span>注意事项 / 备注</div>
        <div class="form-group">
          <textarea class="form-textarea" id="profileNotes" placeholder="如：不喜欢吃芹菜、每天饮水量不足、近期关节不适需要额外注意嘌呤…">${profile.notes}</textarea>
        </div>
      </div>

      <!-- Restrictions from conditions -->
      ${restrictions.avoid.length || restrictions.limit.length ? `
      <div class="card">
        <div class="card-title"><span class="icon">🚫</span>基于病史的饮食限制（自动生成）</div>
        ${restrictions.avoid.length ? `
          <div class="alert alert-red">
            <strong>禁止食用：</strong>${restrictions.avoid.join('、')}
          </div>
        ` : ''}
        ${restrictions.limit.length ? `
          <div class="alert alert-orange">
            <strong>限量摄入：</strong>${restrictions.limit.join('、')}
          </div>
        ` : ''}
        ${restrictions.prefer.length ? `
          <div class="alert alert-green">
            <strong>推荐多吃：</strong>${restrictions.prefer.join('、')}
          </div>
        ` : ''}
        ${restrictions.notes.length ? `
          <div class="alert alert-blue">
            <strong>💡 注意：</strong>${restrictions.notes.join('；')}
          </div>
        ` : ''}
      </div>
      ` : ''}

      <!-- Save button -->
      <div style="text-align:center;margin-top:24px">
        <button class="btn btn-primary" onclick="Profile.saveFromForm()" style="padding:12px 40px;font-size:16px">
          💾 保存个人指标
        </button>
        ${profile.lastUpdated ? `<p style="font-size:12px;color:var(--text-muted);margin-top:8px">上次更新：${new Date(profile.lastUpdated).toLocaleString('zh-CN')}</p>` : ''}
      </div>
    </div>
    `;
  }

  /**
   * Save form data to profile
   */
  function saveFromForm() {
    const profile = load();
    profile.name = document.getElementById('profileName').value.trim();
    profile.height = parseFloat(document.getElementById('profileHeight').value) || 170;
    profile.weight = parseFloat(document.getElementById('profileWeight').value) || 70;
    profile.age = parseInt(document.getElementById('profileAge').value) || 25;
    profile.gender = document.getElementById('profileGender').value;
    profile.activityLevel = document.getElementById('profileActivity').value;
    profile.weeklyLossTarget = parseFloat(document.getElementById('profileLossTarget').value) || 0.5;
    profile.notes = document.getElementById('profileNotes').value.trim();
    save(profile);

    // Re-render to update calculated metrics
    const page = document.getElementById('page-profile');
    page.innerHTML = renderPage();
    showToast('✅ 个人指标已保存');
  }

  function addConditionFromSelect() {
    const select = document.getElementById('conditionSelect');
    const value = select.value;
    if (!value) return;
    const profile = load();
    if (!profile.conditions.includes(value)) {
      profile.conditions.push(value);
      save(profile);
    }
    select.value = '';
    document.getElementById('page-profile').innerHTML = renderPage();
  }

  function addCustomCondition() {
    const input = document.getElementById('customCondition');
    const value = input.value.trim();
    if (!value) return;
    const profile = load();
    if (!profile.conditions.includes(value)) {
      profile.conditions.push(value);
      save(profile);
    }
    input.value = '';
    document.getElementById('page-profile').innerHTML = renderPage();
  }

  function removeCondition(condition) {
    const profile = load();
    profile.conditions = profile.conditions.filter(c => c !== condition);
    save(profile);
    document.getElementById('page-profile').innerHTML = renderPage();
  }

  function addAllergy() {
    const input = document.getElementById('allergyInput');
    const value = input.value.trim();
    if (!value) return;
    const profile = load();
    if (!profile.allergies.includes(value)) {
      profile.allergies.push(value);
      save(profile);
    }
    input.value = '';
    document.getElementById('page-profile').innerHTML = renderPage();
  }

  function removeAllergy(allergy) {
    const profile = load();
    profile.allergies = profile.allergies.filter(a => a !== allergy);
    save(profile);
    document.getElementById('page-profile').innerHTML = renderPage();
  }

  return {
    load,
    save,
    renderPage,
    saveFromForm,
    addConditionFromSelect,
    addCustomCondition,
    removeCondition,
    addAllergy,
    removeAllergy,
  };
})();
