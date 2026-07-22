/**
 * 轻食智配 · NutriPlan
 * Main Application Module
 * Handles navigation, page routing, and shared UI utilities
 */

// ── Page navigation ──
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const page = document.getElementById('page-' + pageId);
  if (page) {
    page.classList.add('active');
  }

  // Highlight nav button
  const btns = document.querySelectorAll('.nav-btn');
  btns.forEach(btn => {
    if (btn.dataset.page === pageId) btn.classList.add('active');
  });

  // Render dynamic pages
  if (pageId === 'profile') {
    page.innerHTML = Profile.renderPage();
    Profile.attachProfileEvents();
  } else if (pageId === 'search') {
    page.innerHTML = FoodPool.renderSearchPage();
  }

  // Save last viewed page
  localStorage.setItem('nutriplan_last_page', pageId);
}

// ── Toast notifications ──
function showToast(message, duration = 2500) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #1f2937;
      color: white;
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 14px;
      z-index: 9999;
      transition: transform 0.3s ease;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, duration);
}

// ── Checklist toggle ──
function toggleCheck(el) {
  el.classList.toggle('checked');
}

// ── Initialize app ──
document.addEventListener('DOMContentLoaded', () => {
  // Restore last page or default to overview
  const lastPage = localStorage.getItem('nutriplan_last_page') || 'overview';
  showPage(lastPage);

  // Update overview with profile data if available
  updateOverviewWithProfile();
});

/**
 * Update overview page metrics with saved profile data
 */
function updateOverviewWithProfile() {
  const profile = Profile.load();
  if (!profile.height || !profile.weight) return;

  const metrics = Calculator.getFullMetrics(profile);
  const overviewMetrics = document.getElementById('overviewMetrics');
  if (overviewMetrics) {
    overviewMetrics.innerHTML = `
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
    `;
  }

  const overviewTargets = document.getElementById('overviewTargets');
  if (overviewTargets) {
    overviewTargets.innerHTML = `
      <div class="alert alert-green">
        <strong>热量缺口策略</strong>
        减${profile.weeklyLossTarget} kg/周 ≈ 每天缺口${metrics.dailyDeficit} kcal → 每日摄入目标 <strong>约${metrics.calorieTarget} kcal</strong>
      </div>
      <div class="stat-grid">
        <div class="stat-item">
          <div class="stat-value">${metrics.calorieTarget}</div>
          <div class="stat-label">每日摄入目标 kcal</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">≥${metrics.macros.protein}g</div>
          <div class="stat-label">蛋白质/天（防掉肌）</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">~${metrics.macros.fat}g</div>
          <div class="stat-label">脂肪/天</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">~${metrics.macros.carbs}g</div>
          <div class="stat-label">碳水/天</div>
        </div>
      </div>
    `;
  }

  // Update subtitle with profile info
  const subtitle = document.getElementById('overviewSubtitle');
  if (subtitle && profile.height && profile.weight && profile.age) {
    const genderText = profile.gender === 'male' ? '男' : '女';
    let info = `${profile.height}cm · ${profile.weight}kg · ${profile.age}岁 · ${genderText}`;
    if (profile.conditions.length > 0) {
      info += ' · ' + profile.conditions.join('、');
    }
    subtitle.textContent = info;
  }
}

// Listen for profile updates
window.addEventListener('profileUpdated', () => {
  updateOverviewWithProfile();
});
