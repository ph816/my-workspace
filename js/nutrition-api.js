/**
 * 轻食智配 · NutriPlan
 * USDA FoodData Central API Integration
 * API Documentation: https://fdc.nal.usda.gov/api-guide/
 */

const NutritionAPI = (() => {
  // USDA FoodData Central - free public API
  const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
  // Demo API key (public, rate-limited). Users can replace with their own.
  const API_KEY = 'DEMO_KEY';

  /**
   * Search foods by keyword
   * @param {string} query - Search term
   * @param {number} pageSize - Results per page (default 25)
   * @param {string} dataType - Filter: Foundation, SR Legacy, Survey (FNDDS), Branded
   * @returns {Promise<Object>} Search results
   */
  async function searchFoods(query, pageSize = 25, dataType = 'Foundation,SR Legacy') {
    const params = new URLSearchParams({
      api_key: getApiKey(),
      query: query,
      pageSize: pageSize,
      dataType: dataType,
    });

    const response = await fetch(`${USDA_BASE_URL}/foods/search?${params}`);
    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Get detailed food info by FDC ID
   * @param {number} fdcId - FoodData Central ID
   * @returns {Promise<Object>} Food details with full nutrient profile
   */
  async function getFoodDetails(fdcId) {
    const params = new URLSearchParams({ api_key: getApiKey() });
    const response = await fetch(`${USDA_BASE_URL}/food/${fdcId}?${params}`);
    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Get multiple foods by FDC IDs
   * @param {number[]} fdcIds - Array of FoodData Central IDs
   * @returns {Promise<Object[]>} Array of food details
   */
  async function getMultipleFoods(fdcIds) {
    const response = await fetch(`${USDA_BASE_URL}/foods?api_key=${getApiKey()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fdcIds }),
    });
    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Extract key nutrients from a food item
   * @param {Object} food - Food object from USDA API
   * @returns {Object} Simplified nutrient profile per 100g
   */
  function extractNutrients(food) {
    const nutrients = {};
    const nutrientMap = {
      1008: 'calories',      // Energy (kcal)
      1003: 'protein',       // Protein (g)
      1004: 'totalFat',      // Total fat (g)
      1005: 'carbohydrates', // Carbohydrates (g)
      1079: 'fiber',         // Fiber (g)
      1087: 'calcium',       // Calcium (mg)
      1089: 'iron',          // Iron (mg)
      1090: 'magnesium',     // Magnesium (mg)
      1092: 'potassium',     // Potassium (mg)
      1093: 'sodium',        // Sodium (mg)
      1162: 'vitaminC',      // Vitamin C (mg)
      1114: 'vitaminD',      // Vitamin D (IU)
    };

    const foodNutrients = food.foodNutrients || [];
    for (const fn of foodNutrients) {
      const nutrientId = fn.nutrient?.id || fn.nutrientId;
      const key = nutrientMap[nutrientId];
      if (key) {
        nutrients[key] = fn.amount || fn.value || 0;
      }
    }

    return {
      fdcId: food.fdcId,
      name: food.description || food.lowercaseDescription || '',
      category: food.foodCategory?.description || food.foodCategoryId || '',
      nutrients,
      servingSize: food.servingSize || 100,
      servingUnit: food.servingSizeUnit || 'g',
    };
  }

  /**
   * Search and return simplified food results
   * @param {string} query - Search term
   * @param {number} limit - Max results
   * @returns {Promise<Object[]>} Simplified food items
   */
  async function searchAndSimplify(query, limit = 20) {
    const data = await searchFoods(query, limit);
    if (!data.foods || data.foods.length === 0) return [];
    return data.foods.map(extractNutrients);
  }

  /**
   * Get or set API key (stored in localStorage)
   */
  function getApiKey() {
    return localStorage.getItem('usda_api_key') || API_KEY;
  }

  function setApiKey(key) {
    localStorage.setItem('usda_api_key', key);
  }

  /**
   * Check if the API is reachable
   * @returns {Promise<boolean>}
   */
  async function checkConnection() {
    try {
      const params = new URLSearchParams({
        api_key: getApiKey(),
        query: 'chicken breast',
        pageSize: 1,
      });
      const response = await fetch(`${USDA_BASE_URL}/foods/search?${params}`);
      return response.ok;
    } catch {
      return false;
    }
  }

  return {
    searchFoods,
    getFoodDetails,
    getMultipleFoods,
    extractNutrients,
    searchAndSimplify,
    getApiKey,
    setApiKey,
    checkConnection,
    USDA_BASE_URL,
  };
})();
