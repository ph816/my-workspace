/**
 * 轻食智配 · NutriPlan
 * Meal Plan Rendering Module
 * Renders overview, shopping, and prep pages using WEEK_DATA
 */

const MealPlan = (() => {
  let TOTAL_STEPS = 0;
  let currentStep = 1;

  function toggleShop(el) {
    el.classList.toggle('got');
  }

  // Make toggleShop available globally
  window.toggleShop = toggleShop;

  function renderOverviewPage(week) {
    if (week < 1 || week > WEEK_DATA.length) return;
    const { nutrition, label } = WEEK_DATA[week - 1];
    const rowHtml = nutrition.rows.map(r =>
      `<tr><td>${r.name}</td><td>${r.weight}</td><td>${r.kcal}</td><td>${r.protein}</td><td>${r.carb}</td><td>${r.fat}</td></tr>`
    ).join('');
    const t = nutrition.total;
    document.getElementById('overview-nutrition-content').innerHTML =
      `<div class="card">
        <div class="card-title"><span class="icon">🍱</span>每份营养成分（${nutrition.portionDesc}）<span style="font-size:13px;font-weight:normal;color:var(--text-muted);margin-left:8px">第${week}周 · ${label}</span></div>
        <div style="overflow-x:auto">
          <table class="tbl">
            <thead>
              <tr><th>食材</th><th>熟重</th><th>热量</th><th>蛋白质</th><th>碳水</th><th>脂肪</th></tr>
            </thead>
            <tbody>
              ${rowHtml}
              <tr class="total"><td>合计</td><td>${t.weight}</td><td>${t.kcal}</td><td>${t.protein}</td><td>${t.carb}</td><td>${t.fat}</td></tr>
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function renderShoppingPage(week) {
    const data = WEEK_DATA[week - 1];
    const shopItem = ({ name, detail, price }) =>
      `<div class="shop-item" onclick="toggleShop(this)">
        <div class="shop-check">✓</div>
        <div class="shop-item-info">
          <div class="shop-item-name">${name}</div>
          <div class="shop-item-detail">${detail}</div>
        </div>
        <div class="shop-item-price">${price}</div>
      </div>`;
    const section = (icon, title, items) =>
      `<div class="card">
        <div class="card-title"><span class="icon">${icon}</span>${title}</div>
        <div class="shop-grid">${items.map(shopItem).join('')}</div>
      </div>`;

    let html = '';
    if (data.freshNote) {
      html += `<div class="alert alert-blue" style="margin-bottom:8px">${data.freshNote}</div>`;
    }
    html += section('🥩', '蛋白质来源', data.shopping.protein);
    html += section('🌾', '主食', data.shopping.grain);
    html += section('🥦', '蔬菜', data.shopping.veg);
    html += `<div class="card">
      <div class="card-title"><span class="icon">🫒</span>辅料（每周通用）</div>
      <div class="shop-grid">
        ${shopItem({ name: '橄榄油', detail: '少量（约20ml）', price: '已有即可' })}
        ${shopItem({ name: '大蒜', detail: '5瓣', price: '¥1' })}
        ${shopItem({ name: '生姜', detail: '少量（蒸鱼用，第2/4周）', price: '¥1' })}
        ${shopItem({ name: '生抽', detail: '少量（腌肉/调味用）', price: '已有即可' })}
        ${shopItem({ name: '黑胡椒', detail: '适量', price: '已有即可' })}
      </div>
    </div>`;

    document.getElementById('shopping-content').innerHTML = html;
    document.getElementById('shopping-week-label').textContent =
      `第${week}周 · ${data.label}`;
  }

  function renderPrepPage(week) {
    const { steps, label } = WEEK_DATA[week - 1];
    TOTAL_STEPS = steps.length;
    currentStep = 1;

    document.getElementById('prep-content').innerHTML = steps.map((s, i) =>
      `<div class="step-panel${i === 0 ? ' active' : ''}" id="step-${i + 1}">
        <div class="card">
          <div class="step-header">
            <div class="step-number">${i + 1}</div>
            <div class="step-title-block">
              <h2>${s.title}</h2>
              <div class="step-time"><span class="tag">⏱ ${s.time}</span></div>
            </div>
          </div>
          <ul class="checklist" id="chk-${i + 1}">
            ${s.items.map(item =>
              `<li onclick="toggleCheck(this)"><div class="check-box"></div><span>${item}</span></li>`
            ).join('')}
          </ul>
          <div class="alert ${s.tipClass} step-tip">${s.tip}</div>
        </div>
      </div>`
    ).join('');

    // Rebuild progress dots
    const dotsContainer = document.getElementById('stepDots');
    dotsContainer.innerHTML = '';
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      const dot = document.createElement('div');
      dot.className = 'step-dot' + (i === 1 ? ' current' : '');
      dot.dataset.step = i;
      dot.onclick = () => goToStep(i);
      dotsContainer.appendChild(dot);
    }

    document.getElementById('prep-week-label').textContent =
      `第${week}周 · ${label}`;
    updateStepUI();
  }

  function updateStepUI() {
    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('step-' + currentStep);
    if (panel) panel.classList.add('active');

    const txt = `第 ${currentStep} 步 / 共 ${TOTAL_STEPS} 步`;
    document.getElementById('stepCounter').textContent = txt;
    document.getElementById('stepCounter2').textContent = txt;

    const disablePrev = currentStep === 1;
    const disableNext = currentStep === TOTAL_STEPS;
    ['btnPrev','btnPrev2'].forEach(id => document.getElementById(id).disabled = disablePrev);
    ['btnNext','btnNext2'].forEach(id => {
      const btn = document.getElementById(id);
      btn.disabled = disableNext;
      btn.textContent = disableNext ? '✅ 备餐完成！' : '下一步 →';
    });

    document.querySelectorAll('.step-dot').forEach(d => {
      const s = parseInt(d.dataset.step);
      d.className = 'step-dot' + (s < currentStep ? ' done' : s === currentStep ? ' current' : '');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function changeStep(delta) {
    const next = currentStep + delta;
    if (next >= 1 && next <= TOTAL_STEPS) goToStep(next);
  }

  function goToStep(n) {
    currentStep = n;
    updateStepUI();
  }

  // ── Nutrition pool tabs ──
  const POOL_IDS = ['carb', 'protein', 'fat', 'micro'];
  function showPool(id) {
    document.querySelectorAll('.pool-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('pool-' + id).classList.add('active');
    document.querySelectorAll('.pool-tab').forEach((t, i) => {
      t.classList.toggle('active', POOL_IDS[i] === id);
    });
  }

  // ── Week selector ──
  function changeWeek(delta) {
    let week = parseInt(document.getElementById('navWeekNum').textContent) || CURRENT_WEEK;
    week += delta;
    if (week < 1) week = WEEK_DATA.length;
    if (week > WEEK_DATA.length) week = 1;
    document.getElementById('navWeekNum').textContent = week;
    renderOverviewPage(week);
    renderShoppingPage(week);
    renderPrepPage(week);
  }

  function init() {
    document.getElementById('navWeekNum').textContent = CURRENT_WEEK;
    renderOverviewPage(CURRENT_WEEK);
    renderShoppingPage(CURRENT_WEEK);
    renderPrepPage(CURRENT_WEEK);
  }

  // Expose globally needed functions
  window.changeStep = changeStep;
  window.goToStep = goToStep;
  window.showPool = showPool;
  window.changeWeek = changeWeek;

  return {
    init,
    renderOverviewPage,
    renderShoppingPage,
    renderPrepPage,
    changeStep,
    changeWeek,
    showPool,
  };
})();
