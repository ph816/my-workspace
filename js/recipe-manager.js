/**
 * 轻食智配 · NutriPlan
 * Recipe Manager Module
 * Handles recipe recommendations, URL import, ingredient USDA lookup,
 * shopping list generation, and prep step management
 */

const RecipeManager = (() => {
  const STORAGE_KEY = 'nutriplan_recipes';
  const RECOMMENDATIONS_KEY = 'nutriplan_recipe_recommendations';

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  /**
   * Built-in healthy recipe database (rotated weekly)
   */
  const RECIPE_DB = [
    {
      id: 'r1',
      name: '地中海烤鸡胸配藜麦沙拉',
      description: '高蛋白低脂，富含不饱和脂肪酸，适合减脂期食用',
      servings: 2,
      prepTime: '15分钟',
      cookTime: '25分钟',
      ingredients: [
        { name: 'chicken breast', nameCn: '鸡胸肉', amount: '300g' },
        { name: 'quinoa', nameCn: '藜麦', amount: '100g' },
        { name: 'cherry tomatoes', nameCn: '小番茄', amount: '150g' },
        { name: 'cucumber', nameCn: '黄瓜', amount: '100g' },
        { name: 'olive oil', nameCn: '橄榄油', amount: '15ml' },
        { name: 'lemon', nameCn: '柠檬', amount: '1个' },
        { name: 'garlic', nameCn: '大蒜', amount: '3瓣' },
      ],
      steps: [
        '藜麦淘洗后加2倍水，大火烧开转小火煮15分钟至水分吸干',
        '鸡胸肉用橄榄油、蒜末、柠檬汁、黑胡椒腌制10分钟',
        '空气炸锅180°C烤鸡胸肉18-20分钟（中途翻面）',
        '小番茄对半切，黄瓜切丁，与冷却的藜麦混合',
        '鸡胸肉切片，摆在藜麦沙拉上，淋上柠檬橄榄油酱汁',
      ],
      tags: ['高蛋白', '低脂', '地中海饮食'],
    },
    {
      id: 'r2',
      name: '日式味噌三文鱼配糙米饭',
      description: 'Omega-3丰富，有助抗炎，搭配低GI糙米',
      servings: 2,
      prepTime: '10分钟',
      cookTime: '20分钟',
      ingredients: [
        { name: 'salmon', nameCn: '三文鱼', amount: '250g' },
        { name: 'brown rice', nameCn: '糙米', amount: '150g' },
        { name: 'broccoli', nameCn: '西兰花', amount: '200g' },
        { name: 'miso paste', nameCn: '味噌酱', amount: '20g' },
        { name: 'soy sauce', nameCn: '生抽', amount: '10ml' },
        { name: 'ginger', nameCn: '生姜', amount: '10g' },
        { name: 'sesame seeds', nameCn: '芝麻', amount: '5g' },
      ],
      steps: [
        '糙米提前浸泡30分钟，加水1.5倍煮熟',
        '味噌酱与少量水调开，加入姜末混合成腌料',
        '三文鱼涂抹腌料，腌制10分钟',
        '烤箱200°C预热，三文鱼烤12-15分钟',
        '西兰花分小朵，沸水焯2分钟捞出',
        '摆盘：糙米饭 + 三文鱼 + 西兰花，撒芝麻',
      ],
      tags: ['Omega-3', '抗炎', '日式'],
    },
    {
      id: 'r3',
      name: '豆腐蔬菜炒饭',
      description: '植物蛋白为主，低嘌呤，痛风友好型食谱',
      servings: 2,
      prepTime: '10分钟',
      cookTime: '15分钟',
      ingredients: [
        { name: 'tofu', nameCn: '老豆腐', amount: '200g' },
        { name: 'brown rice', nameCn: '糙米饭（熟）', amount: '300g' },
        { name: 'egg', nameCn: '鸡蛋', amount: '2个' },
        { name: 'carrot', nameCn: '胡萝卜', amount: '100g' },
        { name: 'bell pepper', nameCn: '彩椒', amount: '100g' },
        { name: 'peas', nameCn: '豌豆', amount: '50g' },
        { name: 'soy sauce', nameCn: '生抽', amount: '10ml' },
        { name: 'olive oil', nameCn: '橄榄油', amount: '10ml' },
      ],
      steps: [
        '豆腐切小丁，用厨房纸吸去多余水分',
        '胡萝卜切丁，彩椒切丁',
        '锅中倒橄榄油，大火煎豆腐至金黄，盛出备用',
        '原锅炒散鸡蛋，加入胡萝卜丁和豌豆翻炒2分钟',
        '加入糙米饭翻炒均匀，加生抽调味',
        '最后加入豆腐丁和彩椒丁，快速翻炒1分钟出锅',
      ],
      tags: ['低嘌呤', '痛风友好', '植物蛋白'],
    },
    {
      id: 'r4',
      name: '希腊式烤蔬菜配鹰嘴豆',
      description: '高纤维素食，富含微量元素，低热量高饱腹感',
      servings: 2,
      prepTime: '15分钟',
      cookTime: '30分钟',
      ingredients: [
        { name: 'chickpeas', nameCn: '鹰嘴豆（熟）', amount: '200g' },
        { name: 'zucchini', nameCn: '西葫芦', amount: '200g' },
        { name: 'bell pepper', nameCn: '红彩椒', amount: '150g' },
        { name: 'red onion', nameCn: '紫洋葱', amount: '100g' },
        { name: 'cherry tomatoes', nameCn: '小番茄', amount: '150g' },
        { name: 'olive oil', nameCn: '橄榄油', amount: '15ml' },
        { name: 'lemon', nameCn: '柠檬', amount: '半个' },
      ],
      steps: [
        '烤箱预热200°C',
        '西葫芦、彩椒切大块，紫洋葱切瓣',
        '所有蔬菜与鹰嘴豆拌入橄榄油、黑胡椒、海盐',
        '铺在烤盘上，烤25-30分钟至边缘微焦',
        '出炉后挤柠檬汁，可搭配少量低脂酸奶酱',
      ],
      tags: ['素食', '高纤维', '地中海饮食'],
    },
    {
      id: 'r5',
      name: '清蒸鲈鱼配蒜蓉西兰花',
      description: '低脂高蛋白，中等嘌呤，蒸制保留最多营养',
      servings: 2,
      prepTime: '10分钟',
      cookTime: '15分钟',
      ingredients: [
        { name: 'sea bass', nameCn: '鲈鱼', amount: '350g' },
        { name: 'broccoli', nameCn: '西兰花', amount: '250g' },
        { name: 'garlic', nameCn: '大蒜', amount: '4瓣' },
        { name: 'ginger', nameCn: '生姜', amount: '15g' },
        { name: 'soy sauce', nameCn: '蒸鱼豉油', amount: '15ml' },
        { name: 'sweet potato', nameCn: '红薯', amount: '200g' },
        { name: 'olive oil', nameCn: '橄榄油', amount: '10ml' },
      ],
      steps: [
        '红薯去皮切块，蒸锅蒸20分钟至软糯',
        '鲈鱼清洗，鱼身划几刀，放姜片葱段',
        '大火蒸10-12分钟至鱼肉变白、筷子能轻松插入',
        '西兰花分小朵焯水2分钟，捞出沥干',
        '蒜末用少量橄榄油爆香，浇在西兰花上',
        '鲈鱼淋蒸鱼豉油，搭配红薯和西兰花上桌',
      ],
      tags: ['低脂', '清蒸', '高蛋白'],
    },
    {
      id: 'r6',
      name: '牛肉西兰花炒面',
      description: '铁锌丰富，适合运动后恢复',
      servings: 2,
      prepTime: '15分钟',
      cookTime: '15分钟',
      ingredients: [
        { name: 'beef tenderloin', nameCn: '牛里脊', amount: '200g' },
        { name: 'broccoli', nameCn: '西兰花', amount: '200g' },
        { name: 'whole wheat noodles', nameCn: '全麦面条', amount: '200g' },
        { name: 'garlic', nameCn: '大蒜', amount: '3瓣' },
        { name: 'soy sauce', nameCn: '生抽', amount: '15ml' },
        { name: 'olive oil', nameCn: '橄榄油', amount: '10ml' },
        { name: 'black pepper', nameCn: '黑胡椒', amount: '适量' },
      ],
      steps: [
        '全麦面条煮至8成熟，捞出过凉水沥干',
        '牛里脊逆纹切薄片，加生抽、黑胡椒腌5分钟',
        '西兰花分小朵，沸水焯1分钟捞出',
        '锅中倒橄榄油，大火快炒牛肉至变色，盛出',
        '原锅爆香蒜末，加入面条和西兰花翻炒',
        '加入牛肉片，调味翻炒均匀出锅',
      ],
      tags: ['高铁', '高蛋白', '运动恢复'],
    },
  ];

  /**
   * Get weekly recommendations based on current week number
   */
  function getWeeklyRecommendations() {
    const weekOfYear = Math.ceil(
      (new Date() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000)
    );
    // Rotate through recipes, pick 3 per week
    const shuffled = [...RECIPE_DB].sort((a, b) => {
      const hashA = (weekOfYear * 31 + a.id.charCodeAt(1)) % 100;
      const hashB = (weekOfYear * 31 + b.id.charCodeAt(1)) % 100;
      return hashA - hashB;
    });
    return shuffled.slice(0, 3);
  }

  /**
   * Fetch and display recipe recommendations
   */
  function fetchRecommendations() {
    const container = document.getElementById('recipeRecommendations');
    container.innerHTML = '<div class="loading-overlay"><div class="spinner"></div>获取推荐食谱…</div>';

    // Simulate network delay for UX
    setTimeout(() => {
      const recipes = getWeeklyRecommendations();
      const profile = Profile.load();
      const conditions = profile.conditions || [];

      container.innerHTML = `
        <div class="alert alert-green" style="margin-bottom:16px">
          <strong>📅 本周推荐</strong>
          根据你的健康状况${conditions.length > 0 ? '（' + conditions.join('、') + '）' : ''}推荐以下食谱
        </div>
        ${recipes.map(r => renderRecipeCard(r)).join('')}
      `;
    }, 500);
  }

  /**
   * Render a recipe card
   */
  function renderRecipeCard(recipe) {
    return `
      <div class="card" style="border-left:4px solid var(--green)">
        <div class="card-title"><span class="icon">🍽️</span>${escapeHtml(recipe.name)}</div>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:8px">${escapeHtml(recipe.description)}</p>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
          <span class="tag tag-green">👥 ${recipe.servings}人份</span>
          <span class="tag tag-blue">⏱ 准备${recipe.prepTime}</span>
          <span class="tag tag-blue">🔥 烹饪${recipe.cookTime}</span>
          ${recipe.tags.map(t => `<span class="tag tag-orange">${escapeHtml(t)}</span>`).join('')}
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="RecipeManager.viewRecipe('${recipe.id}')">查看详情</button>
          <button class="btn btn-secondary" onclick="RecipeManager.generateShoppingList('${recipe.id}')">生成购物清单</button>
          <button class="btn btn-secondary" onclick="RecipeManager.lookupIngredients('${recipe.id}')">🔍 查询食材营养</button>
          <button class="btn btn-secondary" onclick="RecipeManager.saveRecipe('${recipe.id}')">💾 收藏</button>
        </div>
      </div>
    `;
  }

  /**
   * Find a recipe by ID (from DB or saved)
   */
  function findRecipe(recipeId) {
    let recipe = RECIPE_DB.find(r => r.id === recipeId);
    if (!recipe) {
      const saved = loadSavedRecipes();
      recipe = saved.find(r => r.id === recipeId);
    }
    return recipe;
  }

  /**
   * View recipe details with ingredients and steps
   */
  function viewRecipe(recipeId) {
    const recipe = findRecipe(recipeId);
    if (!recipe) return;

    const detailView = document.getElementById('recipeDetailView');
    const titleEl = document.getElementById('recipeDetailTitle');
    const contentEl = document.getElementById('recipeDetailContent');

    titleEl.innerHTML = `<span class="icon">🍽️</span>${escapeHtml(recipe.name)}`;
    contentEl.innerHTML = `
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px">${escapeHtml(recipe.description)}</p>
      
      <h3 style="font-size:15px;font-weight:700;margin-bottom:8px">📋 食材清单</h3>
      <div style="overflow-x:auto;margin-bottom:16px">
        <table class="tbl">
          <thead><tr><th>食材</th><th>英文名</th><th>用量</th></tr></thead>
          <tbody>
            ${recipe.ingredients.map(ing => `
              <tr>
                <td>${escapeHtml(ing.nameCn)}</td>
                <td style="font-size:12px;color:var(--text-muted)">${escapeHtml(ing.name)}</td>
                <td>${escapeHtml(ing.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <h3 style="font-size:15px;font-weight:700;margin-bottom:8px">👨‍🍳 制作步骤</h3>
      <ul class="checklist">
        ${recipe.steps.map((step, i) => `
          <li onclick="toggleCheck(this)">
            <div class="check-box"></div>
            <span><strong>步骤${i + 1}：</strong>${escapeHtml(step)}</span>
          </li>
        `).join('')}
      </ul>

      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="RecipeManager.lookupIngredients('${recipe.id}')">🔍 自动查询USDA营养数据</button>
        <button class="btn btn-secondary" onclick="RecipeManager.generateShoppingList('${recipe.id}')">🛒 生成购物清单</button>
        <button class="btn btn-secondary" onclick="RecipeManager.hideRecipeDetail()">← 返回</button>
      </div>
    `;

    detailView.style.display = 'block';
    detailView.scrollIntoView({ behavior: 'smooth' });
  }

  function hideRecipeDetail() {
    document.getElementById('recipeDetailView').style.display = 'none';
  }

  /**
   * Generate shopping list from a recipe
   */
  function generateShoppingList(recipeId) {
    const recipe = findRecipe(recipeId);
    if (!recipe) return;

    const container = document.getElementById('recipeShoppingList');
    const content = document.getElementById('recipeShoppingContent');

    content.innerHTML = `
      <div class="alert alert-green" style="margin-bottom:12px">
        <strong>${escapeHtml(recipe.name)}</strong> · ${recipe.servings}人份
      </div>
      <div class="shop-grid">
        ${recipe.ingredients.map(ing => `
          <div class="shop-item" onclick="toggleShop(this)">
            <div class="shop-check">✓</div>
            <div class="shop-item-info">
              <div class="shop-item-name">${escapeHtml(ing.nameCn)}</div>
              <div class="shop-item-detail">${escapeHtml(ing.amount)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Lookup ingredients from USDA and optionally add to food pool
   */
  async function lookupIngredients(recipeId) {
    const recipe = findRecipe(recipeId);
    if (!recipe) return;

    const detailView = document.getElementById('recipeDetailView');
    const contentEl = document.getElementById('recipeDetailContent');

    // Show loading state
    const prevContent = contentEl.innerHTML;
    contentEl.innerHTML = '<div class="loading-overlay"><div class="spinner"></div>正在从USDA查询食材营养数据…</div>';
    detailView.style.display = 'block';

    const results = [];
    for (const ing of recipe.ingredients) {
      try {
        const foods = await NutritionAPI.searchAndSimplify(ing.name, 1);
        if (foods.length > 0) {
          results.push({
            ingredient: ing,
            usdaData: foods[0],
            found: true,
          });
        } else {
          results.push({ ingredient: ing, found: false });
        }
      } catch (err) {
        results.push({ ingredient: ing, found: false, error: err.message });
      }
    }

    contentEl.innerHTML = `
      <div class="card-title"><span class="icon">📊</span>USDA营养数据查询结果</div>
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px">
        食谱「${escapeHtml(recipe.name)}」的食材营养信息（每100g）
      </p>
      <div style="overflow-x:auto">
        <table class="tbl">
          <thead>
            <tr>
              <th>食材</th>
              <th>USDA匹配</th>
              <th>热量(kcal)</th>
              <th>蛋白质(g)</th>
              <th>碳水(g)</th>
              <th>脂肪(g)</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${results.map(r => {
              if (r.found) {
                const n = r.usdaData.nutrients;
                return `
                  <tr>
                    <td>${escapeHtml(r.ingredient.nameCn)}</td>
                    <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escapeHtml(r.usdaData.name)}">${escapeHtml(r.usdaData.name)}</td>
                    <td>${(n.calories || 0).toFixed(0)}</td>
                    <td>${(n.protein || 0).toFixed(1)}</td>
                    <td>${(n.carbohydrates || 0).toFixed(1)}</td>
                    <td>${(n.totalFat || 0).toFixed(1)}</td>
                    <td><button class="btn btn-primary" style="padding:4px 10px;font-size:12px" onclick="FoodPool.addToMyPool(${r.usdaData.fdcId}, '${escapeHtml(r.usdaData.name).replace(/'/g, "\\'")}', ${JSON.stringify(n).replace(/"/g, '&quot;')})">+ 添加到食物池</button></td>
                  </tr>
                `;
              } else {
                return `
                  <tr>
                    <td>${escapeHtml(r.ingredient.nameCn)}</td>
                    <td colspan="5" style="color:var(--text-muted)">未找到USDA数据${r.error ? '（' + escapeHtml(r.error) + '）' : ''}</td>
                    <td>-</td>
                  </tr>
                `;
              }
            }).join('')}
          </tbody>
        </table>
      </div>
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="RecipeManager.addAllIngredientsToPool('${recipe.id}')">📦 全部添加到食物池</button>
        <button class="btn btn-secondary" onclick="RecipeManager.viewRecipe('${recipe.id}')">← 返回食谱详情</button>
      </div>
    `;

    // Store results for batch add
    window._lastIngredientResults = results;
  }

  /**
   * Add all found ingredients to food pool
   */
  function addAllIngredientsToPool(recipeId) {
    const results = window._lastIngredientResults || [];
    let added = 0;
    for (const r of results) {
      if (r.found && r.usdaData) {
        FoodPool.addToMyPool(r.usdaData.fdcId, r.usdaData.name, r.usdaData.nutrients);
        added++;
      }
    }
    showToast(`✅ 已将 ${added} 种食材添加到食物池`);
  }

  /**
   * Save recipe to local storage
   */
  function saveRecipe(recipeId) {
    const recipe = findRecipe(recipeId);
    if (!recipe) return;

    let saved = loadSavedRecipes();
    if (!saved.find(r => r.id === recipeId)) {
      saved.push({ ...recipe, savedAt: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      showToast(`💾 已收藏「${recipe.name}」`);
    } else {
      showToast(`ℹ️ 「${recipe.name}」已在收藏中`);
    }
  }

  /**
   * Load saved recipes from localStorage
   */
  function loadSavedRecipes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Remove a saved recipe
   */
  function removeSavedRecipe(recipeId) {
    let saved = loadSavedRecipes();
    saved = saved.filter(r => r.id !== recipeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    showToast('🗑️ 已取消收藏');
    showMyRecipes();
  }

  /**
   * Show user's saved recipes
   */
  function showMyRecipes() {
    const container = document.getElementById('recipeRecommendations');
    const saved = loadSavedRecipes();

    if (saved.length === 0) {
      container.innerHTML = `
        <div class="alert alert-orange">
          还没有收藏的食谱。点击"获取推荐"发现新食谱，或通过URL导入食谱。
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="alert alert-blue" style="margin-bottom:16px">
        <strong>📚 我的食谱收藏</strong> · 共 ${saved.length} 个
      </div>
      ${saved.map(r => `
        <div class="card" style="border-left:4px solid var(--blue)">
          <div class="card-title"><span class="icon">🍽️</span>${escapeHtml(r.name)}</div>
          <p style="font-size:13px;color:var(--text-muted);margin-bottom:8px">${escapeHtml(r.description)}</p>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
            <span class="tag tag-green">👥 ${r.servings}人份</span>
            ${r.tags ? r.tags.map(t => `<span class="tag tag-orange">${escapeHtml(t)}</span>`).join('') : ''}
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn btn-primary" onclick="RecipeManager.viewRecipe('${r.id}')">查看详情</button>
            <button class="btn btn-secondary" onclick="RecipeManager.generateShoppingList('${r.id}')">🛒 购物清单</button>
            <button class="btn btn-secondary" onclick="RecipeManager.lookupIngredients('${r.id}')">🔍 营养查询</button>
            <button class="btn btn-secondary" style="color:var(--red)" onclick="RecipeManager.removeSavedRecipe('${r.id}')">✕ 取消收藏</button>
          </div>
        </div>
      `).join('')}
    `;
  }

  /**
   * Import recipe from URL
   * Parses common recipe formats from web pages
   */
  async function importFromUrl() {
    const urlInput = document.getElementById('recipeUrlInput');
    const statusDiv = document.getElementById('recipeImportStatus');
    const url = urlInput.value.trim();

    if (!url) {
      statusDiv.innerHTML = '<span class="tag tag-orange">请输入食谱URL</span>';
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      statusDiv.innerHTML = '<span class="tag tag-red">❌ URL格式无效</span>';
      return;
    }

    statusDiv.innerHTML = '<div class="loading-overlay" style="padding:8px"><div class="spinner"></div>正在解析食谱…</div>';

    try {
      // Try to fetch and parse the URL
      const response = await fetch(url, {
        mode: 'cors',
        headers: { 'Accept': 'text/html' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const recipe = parseRecipeFromHtml(html, url);

      if (recipe) {
        // Save the imported recipe
        recipe.id = 'url_' + Date.now();
        recipe.sourceUrl = url;
        recipe.importedAt = new Date().toISOString();

        let saved = loadSavedRecipes();
        saved.push(recipe);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

        statusDiv.innerHTML = `<span class="tag tag-green">✅ 成功导入「${escapeHtml(recipe.name)}」</span>`;
        urlInput.value = '';

        // Show the imported recipe
        viewRecipe(recipe.id);
      } else {
        // Offer manual entry as fallback
        statusDiv.innerHTML = `
          <div class="alert alert-orange" style="margin-top:8px">
            <strong>⚠️ 无法自动解析此页面</strong><br>
            可能原因：网站不支持跨域访问或使用了非标准格式。<br>
            请使用手动导入方式添加食谱。
          </div>
          <button class="btn btn-secondary" style="margin-top:8px" onclick="RecipeManager.showManualImport()">✍️ 手动输入食谱</button>
        `;
      }
    } catch (error) {
      // CORS or network error - offer manual entry
      statusDiv.innerHTML = `
        <div class="alert alert-orange" style="margin-top:8px">
          <strong>⚠️ 无法访问此URL</strong><br>
          大部分网站不允许跨域访问。请使用手动输入方式添加食谱。
        </div>
        <button class="btn btn-secondary" style="margin-top:8px" onclick="RecipeManager.showManualImport()">✍️ 手动输入食谱</button>
      `;
    }
  }

  /**
   * Parse recipe from HTML (supports JSON-LD schema.org/Recipe)
   */
  function parseRecipeFromHtml(html, url) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Try JSON-LD (schema.org/Recipe)
      const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
      for (const script of jsonLdScripts) {
        try {
          const data = JSON.parse(script.textContent);
          const recipeData = findRecipeInJsonLd(data);
          if (recipeData) {
            return convertSchemaRecipe(recipeData);
          }
        } catch {}
      }

      // Fallback: try to extract from page title and content
      const title = doc.querySelector('h1')?.textContent?.trim() ||
                    doc.querySelector('title')?.textContent?.trim() || '导入食谱';

      return null;
    } catch {
      return null;
    }
  }

  function findRecipeInJsonLd(data) {
    if (Array.isArray(data)) {
      for (const item of data) {
        const result = findRecipeInJsonLd(item);
        if (result) return result;
      }
    } else if (data && typeof data === 'object') {
      if (data['@type'] === 'Recipe' || data['@type']?.includes?.('Recipe')) {
        return data;
      }
      if (data['@graph']) {
        return findRecipeInJsonLd(data['@graph']);
      }
    }
    return null;
  }

  function convertSchemaRecipe(data) {
    const ingredients = (data.recipeIngredient || []).map((ing, i) => {
      const text = typeof ing === 'string' ? ing : ing.name || '';
      return {
        name: text,
        nameCn: text,
        amount: '',
      };
    });

    const steps = [];
    const instructions = data.recipeInstructions || [];
    if (typeof instructions === 'string') {
      steps.push(instructions);
    } else if (Array.isArray(instructions)) {
      for (const step of instructions) {
        if (typeof step === 'string') {
          steps.push(step);
        } else if (step.text) {
          steps.push(step.text);
        }
      }
    }

    return {
      name: data.name || '导入食谱',
      description: data.description || '',
      servings: parseInt(data.recipeYield) || 2,
      prepTime: data.prepTime || '',
      cookTime: data.cookTime || data.totalTime || '',
      ingredients,
      steps,
      tags: data.recipeCuisine ? [data.recipeCuisine] :
            data.recipeCategory ? [data.recipeCategory] : ['导入'],
    };
  }

  /**
   * Show manual recipe import form
   */
  function showManualImport() {
    const container = document.getElementById('recipeImportStatus');
    container.innerHTML = `
      <div class="card" style="margin-top:12px;border:2px solid var(--green)">
        <div class="card-title"><span class="icon">✍️</span>手动输入食谱</div>
        <div class="form-group">
          <label class="form-label">食谱名称</label>
          <input type="text" class="form-input" id="manualRecipeName" placeholder="如：清蒸鲈鱼">
        </div>
        <div class="form-group">
          <label class="form-label">描述</label>
          <input type="text" class="form-input" id="manualRecipeDesc" placeholder="简要描述">
        </div>
        <div class="form-group">
          <label class="form-label">食材（每行一个，格式：食材名称 - 用量）</label>
          <textarea class="form-textarea" id="manualRecipeIngredients" placeholder="鸡胸肉 - 300g&#10;西兰花 - 200g&#10;橄榄油 - 10ml" style="min-height:120px"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">制作步骤（每行一个步骤）</label>
          <textarea class="form-textarea" id="manualRecipeSteps" placeholder="步骤1: 鸡胸肉切块腌制&#10;步骤2: 西兰花焯水&#10;步骤3: 大火翻炒" style="min-height:120px"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">份数</label>
            <input type="number" class="form-input" id="manualRecipeServings" value="2" min="1">
          </div>
          <div class="form-group">
            <label class="form-label">标签（逗号分隔）</label>
            <input type="text" class="form-input" id="manualRecipeTags" placeholder="高蛋白, 低脂">
          </div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary" onclick="RecipeManager.saveManualRecipe()">💾 保存食谱</button>
          <button class="btn btn-secondary" onclick="document.getElementById('recipeImportStatus').innerHTML=''">取消</button>
        </div>
      </div>
    `;
  }

  /**
   * Save manually entered recipe
   */
  function saveManualRecipe() {
    const name = document.getElementById('manualRecipeName').value.trim();
    if (!name) {
      showToast('⚠️ 请输入食谱名称');
      return;
    }

    const desc = document.getElementById('manualRecipeDesc').value.trim();
    const ingredientsText = document.getElementById('manualRecipeIngredients').value.trim();
    const stepsText = document.getElementById('manualRecipeSteps').value.trim();
    const servings = parseInt(document.getElementById('manualRecipeServings').value) || 2;
    const tagsText = document.getElementById('manualRecipeTags').value.trim();

    const ingredients = ingredientsText.split('\n').filter(l => l.trim()).map(line => {
      const parts = line.split(/\s*[-–—]\s*/);
      return {
        name: parts[0]?.trim() || line.trim(),
        nameCn: parts[0]?.trim() || line.trim(),
        amount: parts[1]?.trim() || '',
      };
    });

    const steps = stepsText.split('\n').filter(l => l.trim()).map(line => {
      return line.replace(/^步骤\s*\d+\s*[:：]\s*/i, '').trim();
    });

    const tags = tagsText ? tagsText.split(/[,，]/).map(t => t.trim()).filter(Boolean) : ['自定义'];

    const recipe = {
      id: 'manual_' + Date.now(),
      name,
      description: desc || '用户自定义食谱',
      servings,
      prepTime: '',
      cookTime: '',
      ingredients,
      steps,
      tags,
      savedAt: new Date().toISOString(),
    };

    let saved = loadSavedRecipes();
    saved.push(recipe);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    showToast(`✅ 食谱「${name}」已保存`);
    document.getElementById('recipeImportStatus').innerHTML = '';
    viewRecipe(recipe.id);
  }

  return {
    fetchRecommendations,
    viewRecipe,
    hideRecipeDetail,
    generateShoppingList,
    lookupIngredients,
    addAllIngredientsToPool,
    saveRecipe,
    showMyRecipes,
    importFromUrl,
    showManualImport,
    saveManualRecipe,
    removeSavedRecipe,
  };
})();
