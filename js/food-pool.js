/**
 * 轻食智配 · NutriPlan
 * Smart Food Pool Generator
 * Generates personalized food pools based on user profile and nutrition data
 */

const FoodPool = (() => {
  // Module-level state for search results
  let _lastSearchResults = [];
  let _prevSearchResultsHtml = '';

  /**
   * Format a nutrient value safely
   */
  function formatNutrient(value, decimals) {
    const num = Number(value) || 0;
    return num.toFixed(decimals);
  }

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

      // Store search results in module state
      _lastSearchResults = foods;

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
                  <td>${formatNutrient(f.nutrients.calories, 0)}</td>
                  <td>${formatNutrient(f.nutrients.protein, 1)}</td>
                  <td>${formatNutrient(f.nutrients.carbohydrates, 1)}</td>
                  <td>${formatNutrient(f.nutrients.totalFat, 1)}</td>
                  <td>${formatNutrient(f.nutrients.fiber, 1)}</td>
                  <td>
                    <button class="btn btn-secondary" style="padding:4px 10px;font-size:12px" data-action="detail" data-fdcid="${f.fdcId}">详情</button>
                    <button class="btn btn-primary" style="padding:4px 10px;font-size:12px" data-action="add-from-search" data-fdcid="${f.fdcId}">+ 添加</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      // Attach event delegation for buttons
      resultsDiv.addEventListener('click', handleSearchResultClick);
    } catch (error) {
      resultsDiv.innerHTML = `<div class="alert alert-red">❌ 搜索失败：${escapeHtml(error.message)}<br>请检查网络连接和API Key设置。</div>`;
    }
  }

  /**
   * Handle clicks on search result buttons via event delegation
   */
  function handleSearchResultClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const fdcId = parseInt(btn.dataset.fdcid);
    if (action === 'detail') {
      viewDetail(fdcId);
    } else if (action === 'add-from-search') {
      addToMyPoolFromSearch(fdcId);
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
    _prevSearchResultsHtml = resultsDiv.innerHTML;
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
              <div class="stat-value">${formatNutrient(n.calories, 0)}</div>
              <div class="stat-label">热量 (kcal/100g)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${formatNutrient(n.protein, 1)}</div>
              <div class="stat-label">蛋白质 (g)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${formatNutrient(n.carbohydrates, 1)}</div>
              <div class="stat-label">碳水化合物 (g)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${formatNutrient(n.totalFat, 1)}</div>
              <div class="stat-label">脂肪 (g)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${formatNutrient(n.fiber, 1)}</div>
              <div class="stat-label">膳食纤维 (g)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${formatNutrient(n.calcium, 0)}</div>
              <div class="stat-label">钙 (mg)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${formatNutrient(n.iron, 1)}</div>
              <div class="stat-label">铁 (mg)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${formatNutrient(n.potassium, 0)}</div>
              <div class="stat-label">钾 (mg)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${formatNutrient(n.sodium, 0)}</div>
              <div class="stat-label">钠 (mg)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${formatNutrient(n.vitaminC, 1)}</div>
              <div class="stat-label">维生素C (mg)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${formatNutrient(n.magnesium, 0)}</div>
              <div class="stat-label">镁 (mg)</div>
            </div>
          </div>
          <div style="margin-top:16px;text-align:center">
            <button class="btn btn-secondary" data-action="back">← 返回搜索结果</button>
            <button class="btn btn-primary" data-action="add-detail" data-fdcid="${fdcId}" data-name="${escapeHtml(simplified.name)}" data-nutrients='${escapeHtml(JSON.stringify(n))}'>+ 添加到我的食物池</button>
          </div>
        </div>
      `;

      // Attach event delegation for detail view buttons
      resultsDiv.addEventListener('click', function detailHandler(e) {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        if (btn.dataset.action === 'back') {
          backToResults();
        } else if (btn.dataset.action === 'add-detail') {
          const nutrients = JSON.parse(btn.dataset.nutrients);
          addToMyPool(parseInt(btn.dataset.fdcid), btn.dataset.name, nutrients);
        }
        resultsDiv.removeEventListener('click', detailHandler);
      });
    } catch (error) {
      resultsDiv.innerHTML = `<div class="alert alert-red">❌ 加载失败：${escapeHtml(error.message)}</div>` + _prevSearchResultsHtml;
    }
  }

  function backToResults() {
    if (_prevSearchResultsHtml) {
      const resultsDiv = document.getElementById('searchResults');
      resultsDiv.innerHTML = _prevSearchResultsHtml;
      resultsDiv.addEventListener('click', handleSearchResultClick);
    }
  }

  /**
   * Add food to personal pool from search results (with full nutrition data)
   */
  function addToMyPoolFromSearch(fdcId) {
    const food = _lastSearchResults.find(f => f.fdcId === fdcId);
    if (food) {
      addToMyPool(fdcId, food.name, food.nutrients);
    } else {
      showToast('⚠️ 未找到食物数据，请先查看详情再添加');
    }
  }

  /**
   * Add food to personal pool (stored in localStorage with full nutrition data)
   */
  function addToMyPool(fdcId, name, nutrients) {
    const key = 'nutriplan_my_foods';
    let foods = [];
    try { foods = JSON.parse(localStorage.getItem(key) || '[]'); } catch {}
    if (!foods.find(f => f.fdcId === fdcId)) {
      foods.push({ fdcId, name, nutrients: nutrients || {}, addedAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(foods));
      showToast(`✅ "${name}" 已添加到食物池`);
    } else {
      // Update existing entry with latest nutrition data
      const existing = foods.find(f => f.fdcId === fdcId);
      if (nutrients) {
        existing.nutrients = nutrients;
        localStorage.setItem(key, JSON.stringify(foods));
      }
      showToast(`ℹ️ "${name}" 已在食物池中`);
    }
  }

  /**
   * Remove food from personal pool
   */
  function removeFromMyPool(fdcId) {
    const key = 'nutriplan_my_foods';
    let foods = [];
    try { foods = JSON.parse(localStorage.getItem(key) || '[]'); } catch {}
    foods = foods.filter(f => f.fdcId !== fdcId);
    localStorage.setItem(key, JSON.stringify(foods));
    showToast('🗑️ 已从食物池中移除');
    renderMyFoodsPool();
  }

  /**
   * Render "My Foods Pool" in the nutrition pools page
   */
  function renderMyFoodsPool() {
    const container = document.getElementById('myFoodsPoolContent');
    if (!container) return;

    const key = 'nutriplan_my_foods';
    let foods = [];
    try { foods = JSON.parse(localStorage.getItem(key) || '[]'); } catch {}

    if (foods.length === 0) {
      container.innerHTML = `
        <div class="alert alert-orange">
          食物池为空。前往「🔍 食物搜索」页面搜索并添加食物。
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px">
        共 ${foods.length} 种食物（每100g营养数据）
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
            ${foods.map(f => {
              const n = f.nutrients || {};
              return `
                <tr>
                  <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escapeHtml(f.name)}">
                    ${escapeHtml(f.name)}
                  </td>
                  <td>${formatNutrient(n.calories, 0)}</td>
                  <td>${formatNutrient(n.protein, 1)}</td>
                  <td>${formatNutrient(n.carbohydrates, 1)}</td>
                  <td>${formatNutrient(n.totalFat, 1)}</td>
                  <td>${formatNutrient(n.fiber, 1)}</td>
                  <td>
                    <button class="btn btn-secondary" style="padding:4px 10px;font-size:12px;color:var(--red)" data-action="remove" data-fdcid="${f.fdcId}">移除</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Attach event delegation for remove buttons
    container.addEventListener('click', function(e) {
      const btn = e.target.closest('[data-action="remove"]');
      if (btn) {
        removeFromMyPool(parseInt(btn.dataset.fdcid));
      }
    });
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
    addToMyPoolFromSearch,
    removeFromMyPool,
    renderMyFoodsPool,
    saveApiKey,
    testConnection,
  };
})();
