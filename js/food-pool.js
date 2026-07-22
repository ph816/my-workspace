/**
 * 轻食智配 · NutriPlan
 * Smart Food Pool Generator
 * Generates personalized food pools based on user profile and nutrition data
 */

const FoodPool = (() => {

  /**
   * Render the food search page with USDA API integration
   */
  function renderSearchPage() {
    return `
    <div class="page-wrap">
      <div class="page-header">
        <h1>🔍 食物搜索</h1>
        <p>搜索USDA食品数据库，获取实时营养成分数据</p>
      </div>

      <div class="card">
        <div class="card-title"><span class="icon">🌐</span>数据源：USDA FoodData Central</div>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px">
          数据来自美国农业部食品数据中心（USDA FoodData Central），包含超过30万种食物的详细营养成分。
          搜索结果为每100g的营养数据。
        </p>
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" class="search-input" id="foodSearchInput" 
                 placeholder="输入食物名称（英文效果更好，如 chicken breast, brown rice, broccoli）"
                 onkeyup="if(event.key==='Enter')FoodPool.searchFood()">
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
          <button class="btn btn-primary" onclick="FoodPool.searchFood()">搜索</button>
          <button class="btn btn-secondary" onclick="FoodPool.quickSearch('chicken breast')">🍗 鸡胸肉</button>
          <button class="btn btn-secondary" onclick="FoodPool.quickSearch('brown rice')">🍚 糙米</button>
          <button class="btn btn-secondary" onclick="FoodPool.quickSearch('broccoli')">🥦 西兰花</button>
          <button class="btn btn-secondary" onclick="FoodPool.quickSearch('salmon')">🐟 三文鱼</button>
          <button class="btn btn-secondary" onclick="FoodPool.quickSearch('egg')">🥚 鸡蛋</button>
          <button class="btn btn-secondary" onclick="FoodPool.quickSearch('tofu')">🧈 豆腐</button>
          <button class="btn btn-secondary" onclick="FoodPool.quickSearch('sweet potato')">🍠 红薯</button>
        </div>
        <div id="searchResults"></div>
      </div>

      <!-- API connection status -->
      <div class="card">
        <div class="card-title"><span class="icon">⚙️</span>API 设置</div>
        <div class="form-group">
          <label class="form-label">USDA API Key</label>
          <input type="text" class="form-input" id="apiKeyInput" 
                 value="${NutritionAPI.getApiKey()}" placeholder="DEMO_KEY">
          <div class="form-hint">
            默认使用 DEMO_KEY（有速率限制）。可前往
            <a href="https://fdc.nal.usda.gov/api-key-signup.html" target="_blank" style="color:var(--blue)">USDA官网</a>
            免费申请专属API Key获得更高请求配额。
          </div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-secondary" onclick="FoodPool.saveApiKey()">保存Key</button>
          <button class="btn btn-secondary" onclick="FoodPool.testConnection()">测试连接</button>
        </div>
        <div id="connectionStatus" style="margin-top:8px"></div>
      </div>
    </div>
    `;
  }

  /**
   * Search food from USDA API
   */
  async function searchFood() {
    const query = document.getElementById('foodSearchInput').value.trim();
    if (!query) return;

    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<div class="loading-overlay"><div class="spinner"></div>正在搜索…</div>';

    try {
      const foods = await NutritionAPI.searchAndSimplify(query, 15);
      if (foods.length === 0) {
        resultsDiv.innerHTML = '<div class="alert alert-orange">未找到结果，试试换个关键词（建议使用英文）</div>';
        return;
      }

      resultsDiv.innerHTML = `
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px">
          找到 ${foods.length} 个结果（每100g营养数据）
        </div>
        <div style="overflow-x:auto">
          <table class="tbl">
            <thead>
              <tr>
                <th>食物名称</th>
                <th>热量(kcal)</th>
                <th>蛋白质(g)</th>
                <th>碳水(g)</th>
                <th>脂肪(g)</th>
                <th>纤维(g)</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${foods.map(f => `
                <tr>
                  <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escapeHtml(f.name)}">
                    ${escapeHtml(f.name)}
                  </td>
                  <td>${(f.nutrients.calories || 0).toFixed(0)}</td>
                  <td>${(f.nutrients.protein || 0).toFixed(1)}</td>
                  <td>${(f.nutrients.carbohydrates || 0).toFixed(1)}</td>
                  <td>${(f.nutrients.totalFat || 0).toFixed(1)}</td>
                  <td>${(f.nutrients.fiber || 0).toFixed(1)}</td>
                  <td><button class="btn btn-secondary" style="padding:4px 10px;font-size:12px" onclick="FoodPool.viewDetail(${f.fdcId})">详情</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (error) {
      resultsDiv.innerHTML = `<div class="alert alert-red">❌ 搜索失败：${escapeHtml(error.message)}<br>请检查网络连接和API Key设置。</div>`;
    }
  }

  function quickSearch(term) {
    document.getElementById('foodSearchInput').value = term;
    searchFood();
  }

  /**
   * View detailed nutrition info for a food
   */
  async function viewDetail(fdcId) {
    const resultsDiv = document.getElementById('searchResults');
    const prevContent = resultsDiv.innerHTML;
    resultsDiv.innerHTML = '<div class="loading-overlay"><div class="spinner"></div>加载详细营养信息…</div>';

    try {
      const food = await NutritionAPI.getFoodDetails(fdcId);
      const simplified = NutritionAPI.extractNutrients(food);
      const n = simplified.nutrients;

      resultsDiv.innerHTML = `
        <div class="card" style="border:2px solid var(--green);margin:0">
          <div class="card-title"><span class="icon">📋</span>${escapeHtml(simplified.name)}</div>
          <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px">
            分类：${escapeHtml(simplified.category)} | FDC ID: ${fdcId} | 数据来源：USDA FoodData Central
          </p>
          <div class="stat-grid">
            <div class="stat-item">
              <div class="stat-value">${(n.calories || 0).toFixed(0)}</div>
              <div class="stat-label">热量 (kcal/100g)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${(n.protein || 0).toFixed(1)}</div>
              <div class="stat-label">蛋白质 (g)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${(n.carbohydrates || 0).toFixed(1)}</div>
              <div class="stat-label">碳水化合物 (g)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${(n.totalFat || 0).toFixed(1)}</div>
              <div class="stat-label">脂肪 (g)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${(n.fiber || 0).toFixed(1)}</div>
              <div class="stat-label">膳食纤维 (g)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${(n.calcium || 0).toFixed(0)}</div>
              <div class="stat-label">钙 (mg)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${(n.iron || 0).toFixed(1)}</div>
              <div class="stat-label">铁 (mg)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${(n.potassium || 0).toFixed(0)}</div>
              <div class="stat-label">钾 (mg)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${(n.sodium || 0).toFixed(0)}</div>
              <div class="stat-label">钠 (mg)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${(n.vitaminC || 0).toFixed(1)}</div>
              <div class="stat-label">维生素C (mg)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${(n.magnesium || 0).toFixed(0)}</div>
              <div class="stat-label">镁 (mg)</div>
            </div>
          </div>
          <div style="margin-top:16px;text-align:center">
            <button class="btn btn-secondary" onclick="FoodPool.backToResults()">← 返回搜索结果</button>
            <button class="btn btn-primary" onclick="FoodPool.addToMyPool(${fdcId}, '${escapeHtml(simplified.name)}')">+ 添加到我的食物池</button>
          </div>
        </div>
      `;

      // Store previous results for back button
      window._prevSearchResults = prevContent;
    } catch (error) {
      resultsDiv.innerHTML = `<div class="alert alert-red">❌ 加载失败：${escapeHtml(error.message)}</div>` + prevContent;
    }
  }

  function backToResults() {
    if (window._prevSearchResults) {
      document.getElementById('searchResults').innerHTML = window._prevSearchResults;
    }
  }

  /**
   * Add food to personal pool (stored in localStorage)
   */
  function addToMyPool(fdcId, name) {
    const key = 'nutriplan_my_foods';
    let foods = [];
    try { foods = JSON.parse(localStorage.getItem(key) || '[]'); } catch {}
    if (!foods.find(f => f.fdcId === fdcId)) {
      foods.push({ fdcId, name, addedAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(foods));
      showToast(`✅ "${name}" 已添加到食物池`);
    } else {
      showToast(`ℹ️ "${name}" 已在食物池中`);
    }
  }

  function saveApiKey() {
    const key = document.getElementById('apiKeyInput').value.trim();
    if (key) {
      NutritionAPI.setApiKey(key);
      showToast('✅ API Key 已保存');
    }
  }

  async function testConnection() {
    const statusDiv = document.getElementById('connectionStatus');
    statusDiv.innerHTML = '<span class="spinner" style="width:14px;height:14px"></span> 正在测试…';
    const ok = await NutritionAPI.checkConnection();
    statusDiv.innerHTML = ok
      ? '<span class="tag tag-green">✅ 连接正常</span>'
      : '<span class="tag tag-red">❌ 连接失败，请检查网络或API Key</span>';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  return {
    renderSearchPage,
    searchFood,
    quickSearch,
    viewDetail,
    backToResults,
    addToMyPool,
    saveApiKey,
    testConnection,
  };
})();
