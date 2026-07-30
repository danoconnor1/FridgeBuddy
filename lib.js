(function () {
    const CATEGORIES = ['meat', 'seafood', 'dairy', 'cheese', 'eggs', 'vegetables', 'fruit', 'grains', 'condiments', 'seasoning', 'drink', 'other', 'leftovers'];
    const UNITS = [
        { abbr: 'oz', name: 'Ounce', terms: ['oz', 'ounce', 'ounces'] },
        { abbr: 'lb', name: 'Pound', terms: ['lb', 'pound', 'pounds'] },
        { abbr: 'ml', name: 'Milliliter', terms: ['ml', 'milliliter', 'milliliters', 'millilitre', 'millilitres'] },
        { abbr: 'L', name: 'Liter', terms: ['l', 'liter', 'liters', 'litre', 'litres'] },
        { abbr: 'tsp', name: 'Teaspoon', terms: ['tsp', 'teaspoon', 'teaspoons'] },
        { abbr: 'tbsp', name: 'Tablespoon', terms: ['tbsp', 'tablespoon', 'tablespoons'] },
        { abbr: 'cup', name: 'Cup', terms: ['cup', 'cups'] },
        { abbr: 'pt', name: 'Pint', terms: ['pt', 'pint', 'pints'] },
        { abbr: 'qt', name: 'Quart', terms: ['qt', 'quart', 'quarts'] },
        { abbr: 'gal', name: 'Gallon', terms: ['gal', 'gallon', 'gallons'] },
        { abbr: 'piece', name: 'Piece', terms: ['piece', 'pieces', 'pc', 'pcs'] },
        { abbr: 'eggs', name: 'eggs', terms: ['egg', 'eggs'] },
        { abbr: 'head', name: 'Head', terms: ['head', 'heads'] },
        { abbr: 'can', name: 'Can', terms: ['can', 'cans'] },
        { abbr: 'clove', name: 'Clove', terms: ['clove', 'cloves'] }
    ];

    const SEASONING_STATUSES = [
        { value: 'full', label: 'Full' },
        { value: 'healthy', label: 'Healthy' },
        { value: 'running-low', label: 'Running low' },
        { value: 'almost-empty', label: 'Almost empty' }
    ];

    const SEASONING_STATUS_ORDER = ['almost-empty', 'running-low', 'healthy', 'full'];

    const DEFAULT_CATALOG = [
        { name: 'Chicken breast', category: 'meat', defaultUnit: 'lb', defaultQuantity: 1, caloriesPerDefault: 440, expirationDays: 2 },
        { name: 'Ground beef', category: 'meat', defaultUnit: 'lb', defaultQuantity: 1, caloriesPerDefault: 1100, expirationDays: 2 },
        { name: 'Bacon', category: 'meat', defaultUnit: 'lb', defaultQuantity: 1, caloriesPerDefault: 2300, expirationDays: 10 },
        { name: 'Salmon', category: 'seafood', defaultUnit: 'lb', defaultQuantity: 1, caloriesPerDefault: 860, expirationDays: 2 },
        { name: 'Milk', category: 'dairy', defaultUnit: 'gal', defaultQuantity: 1, caloriesPerDefault: 2400, expirationDays: 10 },
        { name: 'Yogurt', category: 'dairy', defaultUnit: 'cup', defaultQuantity: 1, caloriesPerDefault: 175, expirationDays: 12 },
        { name: 'Butter', category: 'dairy', defaultUnit: 'lb', defaultQuantity: 1, caloriesPerDefault: 3200, expirationDays: 35 },
        { name: 'Sour cream', category: 'dairy', defaultUnit: 'cup', defaultQuantity: 1, caloriesPerDefault: 480, expirationDays: 12 },
        { name: 'Cheese', category: 'cheese', defaultUnit: 'lb', defaultQuantity: 1, caloriesPerDefault: 1800, expirationDays: 18 },
        { name: 'Eggs', category: 'eggs', defaultUnit: 'eggs', defaultQuantity: 12, caloriesPerDefault: 720, expirationDays: 30 },
        { name: 'Bread', category: 'grains', defaultUnit: 'piece', defaultQuantity: 1, caloriesPerDefault: 90, expirationDays: 6 },
        { name: 'Lettuce', category: 'vegetables', defaultUnit: 'head', defaultQuantity: 1, caloriesPerDefault: 75, expirationDays: 6 },
        { name: 'Spinach', category: 'vegetables', defaultUnit: 'oz', defaultQuantity: 1, caloriesPerDefault: 7, expirationDays: 4 },
        { name: 'Broccoli', category: 'vegetables', defaultUnit: 'piece', defaultQuantity: 1, caloriesPerDefault: 55, expirationDays: 4 },
        { name: 'Carrots', category: 'vegetables', defaultUnit: 'lb', defaultQuantity: 1, caloriesPerDefault: 175, expirationDays: 18 },
        { name: 'Tomato', category: 'vegetables', defaultUnit: 'piece', defaultQuantity: 1, caloriesPerDefault: 25, expirationDays: 6 },
        { name: 'Bell pepper', category: 'vegetables', defaultUnit: 'piece', defaultQuantity: 1, caloriesPerDefault: 37, expirationDays: 8 },
        { name: 'Apple', category: 'fruit', defaultUnit: 'piece', defaultQuantity: 1, caloriesPerDefault: 95, expirationDays: 21 },
        { name: 'Orange', category: 'fruit', defaultUnit: 'piece', defaultQuantity: 1, caloriesPerDefault: 62, expirationDays: 21 },
        { name: 'Orange juice', category: 'drink', defaultUnit: 'gal', defaultQuantity: 1, caloriesPerDefault: 1890, expirationDays: 10 }
    ];

    const DEFAULT_CATALOG_BY_NAME = new Map(
        DEFAULT_CATALOG.map(item => [item.name.toLowerCase(), item])
    );

    const FRIDGE_THEMES = ['classic-light', 'classic-dark', 'neon-kitchen', 'retro-space'];

    const FRIDGE_THEME_OPTIONS = [
        { id: 'classic-light', label: 'Classic', group: 'classic' },
        { id: 'neon-kitchen', label: 'Neon Kitchen', group: 'styled' },
        { id: 'retro-space', label: 'Retro Space', group: 'styled' }
    ];

    window.FB = {
        CATEGORIES,
        UNITS,
        SEASONING_STATUSES,
        DEFAULT_CATALOG,
        FRIDGE_THEMES,
        FRIDGE_THEME_OPTIONS,
        normalizeFridgeTheme(saved) {
            if (FRIDGE_THEMES.includes(saved)) return saved;
            if (saved === 'light') return 'classic-light';
            if (saved === 'dark') return 'classic-dark';
            if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
                return 'classic-dark';
            }
            return 'classic-light';
        },
        getFridgeThemeColor(theme) {
            return ({
                'classic-light': '#ffffff',
                'classic-dark': '#1a1a1a',
                'neon-kitchen': '#0f0f1a',
                'retro-space': '#1a2840'
            })[theme] || '#ffffff';
        },
        isClassicFridgeTheme(theme) {
            return theme === 'classic-light' || theme === 'classic-dark';
        },
        createDefaultCatalogItems() {
            return DEFAULT_CATALOG.map((item, index) => window.FB.normalizeCatalogItem({
                id: index + 1,
                ...item
            }));
        },
        loadCatalogItems() {
            const saved = localStorage.getItem('fridgeCatalog');
            if (!saved) return window.FB.createDefaultCatalogItems();

            let parsed;
            try {
                parsed = JSON.parse(saved);
            } catch {
                return window.FB.createDefaultCatalogItems();
            }

            if (!Array.isArray(parsed) || parsed.length === 0) {
                return window.FB.createDefaultCatalogItems();
            }

            const existingNames = new Set(parsed.map(item => item.name.toLowerCase()));
            let nextId = parsed.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
            const merged = parsed.map(item => {
                const normalized = window.FB.normalizeCatalogItem(item);
                const defaults = DEFAULT_CATALOG_BY_NAME.get(normalized.name?.toLowerCase());
                if (defaults) {
                    if (normalized.defaultQuantity == null && defaults.defaultQuantity != null) {
                        normalized.defaultQuantity = defaults.defaultQuantity;
                    }
                    if (normalized.caloriesPerDefault == null && defaults.caloriesPerDefault != null) {
                        normalized.caloriesPerDefault = defaults.caloriesPerDefault;
                    }
                }
                return normalized;
            });

            DEFAULT_CATALOG.forEach(item => {
                if (!existingNames.has(item.name.toLowerCase())) {
                    nextId += 1;
                    merged.push(window.FB.normalizeCatalogItem({ id: nextId, ...item }));
                }
            });

            return merged;
        },
        filterUnits(query) {
            const q = query.toLowerCase().trim();
            if (!q) return UNITS;
            return UNITS.filter(unit => unit.terms.some(term => term.includes(q) || q.includes(term)));
        },
        formatCategory(category) {
            if (!category) return '';
            if (category === 'seasoning') return 'Seasoning/Sauce/Oil';
            return category.charAt(0).toUpperCase() + category.slice(1);
        },
        isFoodCategory(category) {
            return CATEGORIES.includes(category);
        },
        getCategoryColor(category) {
            if (!window.FB.isFoodCategory(category)) return 'var(--text-secondary)';
            return `var(--cat-${category})`;
        },
        isSeasoningCategory(category) {
            return category === 'seasoning';
        },
        isLeftoverCategory(category) {
            return category === 'leftovers';
        },
        isLeftoverFridgeItem(item) {
            return item?.category === 'leftovers';
        },
        formatSeasoningStatus(status) {
            const match = SEASONING_STATUSES.find(entry => entry.value === status);
            return match ? match.label : 'Full';
        },
        getSeasoningStatusSortOrder(status) {
            const order = { 'almost-empty': 0, 'running-low': 1, healthy: 2, full: 3 };
            return order[status] ?? 3;
        },
        adjustSeasoningStatus(status, delta) {
            const current = SEASONING_STATUS_ORDER.indexOf(status || 'full');
            const next = Math.max(0, Math.min(SEASONING_STATUS_ORDER.length - 1, current + delta));
            return SEASONING_STATUS_ORDER[next];
        },
        formatUnitLabel(unit) {
            if (unit == null || unit === '') return '';
            if (typeof unit === 'string') {
                const match = UNITS.find(entry => entry.abbr.toLowerCase() === unit.toLowerCase());
                if (match) return window.FB.formatUnitLabel(match);
                return unit;
            }
            const name = unit.name.toLowerCase();
            if (unit.abbr.toLowerCase() === name) return unit.abbr;
            return `${unit.abbr} (${name})`;
        },
        normalizeCatalogItem(item) {
            const normalized = { ...item };
            const defaults = DEFAULT_CATALOG_BY_NAME.get(normalized.name?.toLowerCase());
            if (normalized.name?.toLowerCase() === 'eggs') {
                if (normalized.defaultUnit === 'dozen') normalized.defaultUnit = 'eggs';
                if (normalized.defaultQuantity == null) normalized.defaultQuantity = 12;
            }
            if (defaults) {
                if (normalized.defaultQuantity == null && defaults.defaultQuantity != null) {
                    normalized.defaultQuantity = defaults.defaultQuantity;
                }
                if (normalized.caloriesPerDefault == null && defaults.caloriesPerDefault != null) {
                    normalized.caloriesPerDefault = defaults.caloriesPerDefault;
                }
            }
            return normalized;
        },
        getDefaultCatalogQuantity(item) {
            return item.defaultQuantity ?? 1;
        },
        parseCalories(value) {
            if (value === '' || value == null) return null;
            const parsed = Number(value);
            if (Number.isNaN(parsed) || parsed < 0) return null;
            return Math.round(parsed);
        },
        formatCalories(value) {
            if (value == null || value === '') return '';
            const parsed = Number(value);
            if (Number.isNaN(parsed)) return '';
            return parsed.toLocaleString();
        },
        adjustCalories(value, delta, min = 0) {
            const current = value === '' || value == null ? 0 : Number(value);
            return Math.max(min, (Number.isNaN(current) ? 0 : current) + delta);
        },
        findCatalogItemForIngredient(ingredient, catalogItems) {
            if (!catalogItems?.length || !ingredient) return null;
            if (ingredient.catalogItemId != null && ingredient.catalogItemId !== '') {
                const byId = catalogItems.find(entry => String(entry.id) === String(ingredient.catalogItemId));
                if (byId) return byId;
            }
            const name = ingredient.name?.trim().toLowerCase();
            if (!name) return null;
            return catalogItems.find(entry => entry.name?.trim().toLowerCase() === name) || null;
        },
        estimateIngredientCalories(ingredient, catalogItems) {
            const catalogItem = window.FB.findCatalogItemForIngredient(ingredient, catalogItems);
            if (!catalogItem || catalogItem.caloriesPerDefault == null) return 0;
            if (window.FB.isSeasoningCategory(catalogItem.category)) return 0;

            const ingredientUnit = (ingredient.unit || 'piece').toLowerCase();
            const catalogUnit = (catalogItem.defaultUnit || 'piece').toLowerCase();
            if (ingredientUnit !== catalogUnit) return 0;

            const defaultQty = window.FB.getDefaultCatalogQuantity(catalogItem);
            const ingredientQty = window.FB.parseIngredientQuantity(ingredient.quantity);
            if (!defaultQty || !ingredientQty) return 0;

            return Math.round(catalogItem.caloriesPerDefault * (ingredientQty / defaultQty));
        },
        estimateCaloriesFromIngredients(ingredients, catalogItems) {
            if (!ingredients?.length) return null;
            const total = ingredients.reduce(
                (sum, ingredient) => sum + window.FB.estimateIngredientCalories(ingredient, catalogItems),
                0
            );
            return total > 0 ? total : null;
        },
        resolveCalories(explicitCalories, ingredients, catalogItems) {
            const parsed = window.FB.parseCalories(explicitCalories);
            if (parsed != null) return parsed;
            return window.FB.estimateCaloriesFromIngredients(ingredients, catalogItems);
        },
        estimateFridgeItemCalories(fridgeItem, catalogItems) {
            const catalogItem = catalogItems.find(entry => entry.id === fridgeItem.catalogItemId);
            if (!catalogItem || catalogItem.caloriesPerDefault == null) return null;
            if (window.FB.isSeasoningCategory(catalogItem.category)) return null;

            const unit = (fridgeItem.unit || catalogItem.defaultUnit || 'piece').toLowerCase();
            const catalogUnit = (catalogItem.defaultUnit || 'piece').toLowerCase();
            if (unit !== catalogUnit) return null;

            const qty = window.FB.getFridgeItemQuantityValue(fridgeItem);
            const defaultQty = window.FB.getDefaultCatalogQuantity(catalogItem);
            if (!defaultQty) return null;

            return Math.round(catalogItem.caloriesPerDefault * (qty / defaultQty));
        },
        getRecipeDisplayCalories(recipe, catalogItems) {
            const parsed = window.FB.parseCalories(recipe?.calories);
            if (parsed != null) return parsed;
            return window.FB.estimateCaloriesFromIngredients(recipe?.ingredients, catalogItems);
        },
        getMealDisplayCalories(meal, catalogItems) {
            const parsed = window.FB.parseCalories(meal?.calories);
            if (parsed != null) return parsed;
            return window.FB.estimateCaloriesFromIngredients(meal?.ingredients, catalogItems);
        },
        getMealDayKey(loggedAt) {
            const date = new Date(loggedAt);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        },
        formatMealDayHeader(loggedAt) {
            const date = new Date(loggedAt);
            const weekday = date.toLocaleDateString(undefined, { weekday: 'long' });
            const monthDay = date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
            return `${weekday} ${monthDay}`;
        },
        formatMealTime(loggedAt) {
            const date = new Date(loggedAt);
            return date.toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit'
            });
        },
        groupMealsByDay(meals, catalogItems) {
            const groups = new Map();
            meals.forEach(meal => {
                const key = meal.loggedAt ? window.FB.getMealDayKey(meal.loggedAt) : 'unknown';
                if (!groups.has(key)) {
                    groups.set(key, {
                        key,
                        dayDate: meal.loggedAt ? new Date(meal.loggedAt) : null,
                        meals: []
                    });
                }
                groups.get(key).meals.push(meal);
            });
            return Array.from(groups.values())
                .sort((a, b) => (b.dayDate?.getTime() || 0) - (a.dayDate?.getTime() || 0))
                .map(group => ({
                    ...group,
                    label: group.dayDate
                        ? window.FB.formatMealDayHeader(group.dayDate)
                        : 'Unknown date',
                    totalCalories: group.meals.reduce((sum, meal) => {
                        const calories = window.FB.getMealDisplayCalories(meal, catalogItems);
                        return sum + (calories || 0);
                    }, 0),
                    meals: [...group.meals].sort(
                        (a, b) => new Date(b.loggedAt || 0) - new Date(a.loggedAt || 0)
                    )
                }));
        },
        formatFridgeItemLabel(item) {
            if (item.seasoningStatus != null) return item.name;
            if (item.quantity != null && item.quantity !== '' && item.unit) {
                return `${item.quantity} ${item.unit} ${item.name}`;
            }
            return item.name;
        },
        formatFridgeExistingAmount(catalogItemId, fridgeItems, catalogItems) {
            const matches = fridgeItems.filter(item => item.catalogItemId === catalogItemId);
            if (matches.length === 0) return null;

            const catalogItem = catalogItems.find(c => c.id === catalogItemId);
            const isSeasoning = matches.some(item => item.seasoningStatus != null)
                || window.FB.isSeasoningCategory(catalogItem?.category);

            if (isSeasoning) {
                return window.FB.formatSeasoningStatus(matches[0].seasoningStatus);
            }

            const totalsByUnit = {};
            matches.forEach(item => {
                const unit = item.unit || 'piece';
                totalsByUnit[unit] = (totalsByUnit[unit] || 0) + window.FB.getFridgeItemQuantityValue(item);
            });

            return Object.entries(totalsByUnit)
                .map(([unit, qty]) => `${qty} ${unit}`)
                .join(', ');
        },
        getFridgeExistingExpirySummary(catalogItemId, fridgeItems, catalogItems, isSeasoningFridgeItem) {
            const matches = fridgeItems.filter(item => item.catalogItemId === catalogItemId);
            if (matches.length === 0) return null;

            const catalogItem = catalogItems.find(c => c.id === catalogItemId);
            const isSeasoning = matches.some(item => isSeasoningFridgeItem(item))
                || window.FB.isSeasoningCategory(catalogItem?.category);

            if (isSeasoning) {
                const item = matches.find(entry => isSeasoningFridgeItem(entry)) || matches[0];
                const status = item.seasoningStatus || 'full';
                return {
                    isSeasoning: true,
                    statusColor: window.FB.getSeasoningStatusColor(status),
                    statusText: window.FB.formatSeasoningStatus(status)
                };
            }

            const sortedByUrgency = [...matches].sort(
                (a, b) => window.FB.getDaysUntilExpiry(a.expiry) - window.FB.getDaysUntilExpiry(b.expiry)
            );
            const item = sortedByUrgency[0];
            const days = window.FB.getDaysUntilExpiry(item.expiry);
            let statusColor = 'var(--fill-success)';
            let statusText = days > 3 ? 'Fresh' : days <= 0 ? 'Expired' : 'Expiring soon';
            if (days <= 0) statusColor = 'var(--fill-danger)';
            else if (days <= 3) statusColor = 'var(--fill-warning)';

            return {
                isSeasoning: false,
                expiresText: window.FB.formatExpiresIn(item.expiry),
                statusColor,
                statusText
            };
        },
        emptyIngredient: () => ({ catalogItemId: '', quantity: 1, unit: 'piece' }),
        getIngredientName(ingredient) {
            if (typeof ingredient === 'string') return ingredient.toLowerCase();
            return (ingredient.name || '').toLowerCase();
        },
        isIngredientAvailable(ingredient, fridgeItems, getDaysUntilExpiry) {
            const available = fridgeItems.filter(item => getDaysUntilExpiry(item.expiry) >= 0);
            if (ingredient.catalogItemId) {
                return available.some(item => item.catalogItemId === ingredient.catalogItemId);
            }
            const name = window.FB.getIngredientName(ingredient);
            return available.some(item => {
                const itemName = item.name.toLowerCase();
                return itemName.includes(name) || name.includes(itemName);
            });
        },
        formatIngredient(ingredient) {
            if (typeof ingredient === 'string') return ingredient;
            const parts = [];
            if (ingredient.quantity !== '' && ingredient.quantity != null) parts.push(ingredient.quantity);
            if (ingredient.unit) parts.push(ingredient.unit);
            if (ingredient.name) parts.push(ingredient.name);
            return parts.join(' ');
        },
        getMatchingFridgeItems(ingredient, fridgeItems) {
            if (ingredient.catalogItemId) {
                return fridgeItems.filter(item => item.catalogItemId === ingredient.catalogItemId);
            }
            const name = window.FB.getIngredientName(ingredient);
            return fridgeItems.filter(item => {
                const itemName = item.name.toLowerCase();
                return itemName.includes(name) || name.includes(itemName);
            });
        },
        isFridgeItemAvailable(item, getDaysUntilExpiry, isSeasoningFridgeItem) {
            if (isSeasoningFridgeItem(item)) return true;
            if (!item.expiry) return true;
            return getDaysUntilExpiry(item.expiry) >= 0;
        },
        getFridgeItemQuantityValue(item) {
            if (item.quantity != null && item.quantity !== '') return Number(item.quantity);
            return 1;
        },
        getIngredientFridgeAvailability(ingredient, fridgeItems, getDaysUntilExpiry, isSeasoningFridgeItem) {
            const matches = window.FB.getMatchingFridgeItems(ingredient, fridgeItems)
                .filter(item => window.FB.isFridgeItemAvailable(item, getDaysUntilExpiry, isSeasoningFridgeItem));

            if (matches.length === 0) {
                return { status: 'missing', inFridgeLabel: null };
            }

            const seasoningMatches = matches.filter(isSeasoningFridgeItem);
            if (seasoningMatches.length > 0) {
                return {
                    status: 'enough',
                    inFridgeLabel: window.FB.formatSeasoningStatus(seasoningMatches[0].seasoningStatus)
                };
            }

            const recipeQty = ingredient.quantity != null && ingredient.quantity !== ''
                ? Number(ingredient.quantity)
                : 1;
            const recipeUnit = ingredient.unit || 'piece';

            let totalInRecipeUnit = 0;
            matches.forEach(item => {
                const unit = item.unit || 'piece';
                if (unit === recipeUnit) {
                    totalInRecipeUnit += window.FB.getFridgeItemQuantityValue(item);
                }
            });

            const formatInFridgeAmount = (quantity) => String(quantity);

            if (totalInRecipeUnit >= recipeQty) {
                return {
                    status: 'enough',
                    inFridgeLabel: formatInFridgeAmount(totalInRecipeUnit)
                };
            }

            if (totalInRecipeUnit > 0) {
                return {
                    status: 'insufficient',
                    inFridgeLabel: formatInFridgeAmount(totalInRecipeUnit)
                };
            }

            const first = matches[0];
            const firstQty = window.FB.getFridgeItemQuantityValue(first);
            return {
                status: 'insufficient',
                inFridgeLabel: formatInFridgeAmount(firstQty)
            };
        },
        formatRecipeIngredientWithFridge(ingredient, availability, showQuantities = false) {
            const base = window.FB.formatIngredient(ingredient);
            if (!showQuantities || availability.status === 'missing' || availability.inFridgeLabel == null) {
                return base;
            }
            return `${base} (Have ${availability.inFridgeLabel})`;
        },
        countFailingIngredients(recipe, fridgeItems, getDaysUntilExpiry, isSeasoningFridgeItem) {
            if (!recipe.ingredients?.length) return Infinity;
            return recipe.ingredients.filter(ingredient => {
                const availability = window.FB.getIngredientFridgeAvailability(
                    ingredient,
                    fridgeItems,
                    getDaysUntilExpiry,
                    isSeasoningFridgeItem
                );
                return availability.status !== 'enough';
            }).length;
        },
        classifyRecipesForHome(recipes, fridgeItems, getDaysUntilExpiry, isSeasoningFridgeItem) {
            const readyToMake = [];
            const almostThere = [];
            recipes.forEach(recipe => {
                if (!recipe.ingredients?.length) return;
                const failing = window.FB.countFailingIngredients(
                    recipe,
                    fridgeItems,
                    getDaysUntilExpiry,
                    isSeasoningFridgeItem
                );
                if (failing === 0) readyToMake.push(recipe);
                else if (failing <= 2) almostThere.push(recipe);
            });
            return { readyToMake, almostThere };
        },
        addDaysFromToday(days) {
            const date = new Date();
            date.setDate(date.getDate() + days);
            return date.toISOString().split('T')[0];
        },
        addExpirationFromToday(value, unit = 'days') {
            const date = new Date();
            if (unit === 'months') {
                date.setMonth(date.getMonth() + Number(value));
            } else {
                date.setDate(date.getDate() + Number(value));
            }
            return date.toISOString().split('T')[0];
        },
        adjustDays(current, delta) {
            return Math.max(1, Number(current) + delta);
        },
        getDaysUntilExpiry(expiryDate) {
            const expiry = new Date(expiryDate);
            const now = new Date();
            return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
        },
        formatExpiresIn(expiryDate) {
            const days = window.FB.getDaysUntilExpiry(expiryDate);
            if (days < 0) {
                const ago = Math.abs(days);
                return `Expired ${ago} day${ago !== 1 ? 's' : ''} ago`;
            }
            if (days === 0) return 'Expires today';
            return `Expires in ${days} day${days !== 1 ? 's' : ''}`;
        },
        getExpirationTextColor(expiryDate) {
            const days = window.FB.getDaysUntilExpiry(expiryDate);
            if (days < 0) return 'var(--text-danger)';
            if (days <= 3) return 'var(--text-warning)';
            return 'var(--text-success)';
        },
        groupItemsByCategory(itemList, getCategory) {
            return window.FB.CATEGORIES
                .map(category => ({
                    category,
                    items: itemList.filter(item => getCategory(item) === category)
                }))
                .filter(group => group.items.length > 0);
        },
        isSeasoningFridgeItem(item, catalogItems) {
            if (item.seasoningStatus != null) return true;
            const catalogItem = catalogItems.find(entry => entry.id === item.catalogItemId);
            return window.FB.isSeasoningCategory(catalogItem?.category);
        },
        getDefaultCatalogUnit(item) {
            return window.FB.isSeasoningCategory(item.category) ? 'piece' : (item.defaultUnit || 'oz');
        },
        getFridgeItemQuantity(item) {
            return item.quantity != null && item.quantity !== '' ? Number(item.quantity) : 1;
        },
        getItemQuantityDisplay(item) {
            const qty = window.FB.getFridgeItemQuantity(item);
            return item.unit ? `${qty} ${item.unit}` : String(qty);
        },
        getSeasoningStatusColor(status) {
            if (status === 'almost-empty') return 'var(--fill-danger)';
            if (status === 'running-low') return 'var(--fill-warning)';
            return 'var(--fill-success)';
        },
        getFridgeExpirationBucket(item, catalogItems) {
            if (window.FB.isSeasoningFridgeItem(item, catalogItems)) {
                const status = item.seasoningStatus || 'full';
                if (status === 'almost-empty') return 'expired';
                if (status === 'running-low') return 'expiring-soon';
                return 'fresh';
            }
            const days = window.FB.getDaysUntilExpiry(item.expiry);
            if (days < 0) return 'expired';
            if (days <= 3) return 'expiring-soon';
            return 'fresh';
        },
        compareFridgeItemsByUrgency(a, b, catalogItems) {
            if (window.FB.isSeasoningFridgeItem(a, catalogItems) && window.FB.isSeasoningFridgeItem(b, catalogItems)) {
                return window.FB.getSeasoningStatusSortOrder(a.seasoningStatus) - window.FB.getSeasoningStatusSortOrder(b.seasoningStatus);
            }
            return window.FB.getDaysUntilExpiry(a.expiry) - window.FB.getDaysUntilExpiry(b.expiry);
        },
        buildFridgeItemGroups(filteredItems, fridgeSort, catalogItems, getFridgeItemCategory) {
            const compare = (a, b) => window.FB.compareFridgeItemsByUrgency(a, b, catalogItems);
            const groupedByCategory = window.FB.groupItemsByCategory(filteredItems, getFridgeItemCategory).map(group => ({
                key: group.category,
                label: window.FB.formatCategory(group.category),
                items: [...group.items].sort(compare)
            }));
            const groupedByExpiration = [
                { key: 'expired', label: 'Expired' },
                { key: 'expiring-soon', label: 'Expiring soon' },
                { key: 'fresh', label: 'Fresh' }
            ]
                .map(group => ({
                    ...group,
                    items: filteredItems
                        .filter(item => window.FB.getFridgeExpirationBucket(item, catalogItems) === group.key)
                        .sort(compare)
                }))
                .filter(group => group.items.length > 0);
            return fridgeSort === 'expiration' ? groupedByExpiration : groupedByCategory;
        },
        MIN_INGREDIENT_QTY: 0.01,
        parseIngredientQuantity(value) {
            if (value === '' || value == null) return 1;
            const parsed = Number(value);
            return Number.isNaN(parsed) ? 1 : parsed;
        },
        normalizeIngredientQuantity(value) {
            return Math.max(window.FB.MIN_INGREDIENT_QTY, window.FB.parseIngredientQuantity(value));
        },
        roundIngredientQuantity(value) {
            return Math.round(window.FB.normalizeIngredientQuantity(value) * 1000) / 1000;
        },
        serializeDraftIngredients(ingredients, catalogItems) {
            return ingredients
                .filter(i => i.catalogItemId)
                .map(i => {
                    const catalogItem = catalogItems.find(c => String(c.id) === String(i.catalogItemId));
                    return {
                        catalogItemId: Number(i.catalogItemId),
                        name: catalogItem ? catalogItem.name : i.name || '',
                        quantity: i.quantity === '' ? null : Number(i.quantity),
                        unit: (i.unit || '').trim()
                    };
                });
        },
        recipeIngredientStatusColors: {
            enough: 'var(--text-success)',
            insufficient: 'var(--text-warning)',
            missing: 'var(--text-danger)'
        },
        getUnitAbbrs() {
            return window.FB.UNITS.map(unit => unit.abbr);
        },
        normalizeImportUnit(unit) {
            if (unit == null || unit === '') return 'piece';
            const query = String(unit).trim().toLowerCase();
            const match = window.FB.UNITS.find(entry =>
                entry.abbr.toLowerCase() === query || entry.terms.includes(query)
            );
            return match ? match.abbr : null;
        },
        findCatalogItemForImport(name, catalogItemId, catalogItems) {
            if (catalogItemId != null && catalogItemId !== '') {
                const byId = catalogItems.find(item => item.id === Number(catalogItemId));
                if (byId) return byId;
            }
            const normalized = (name || '').trim().toLowerCase();
            if (!normalized) return null;
            const exact = catalogItems.find(item => item.name.toLowerCase() === normalized);
            if (exact) return exact;
            return catalogItems.find(item => {
                const catalogName = item.name.toLowerCase();
                return catalogName.includes(normalized) || normalized.includes(catalogName);
            }) || null;
        },
        parseClaudeJsonText(text) {
            const trimmed = (text || '').trim();
            if (!trimmed) {
                return { error: 'Paste Claude\'s JSON response first.' };
            }
            let jsonText = trimmed;
            const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
            if (fenced) jsonText = fenced[1].trim();
            try {
                return { parsed: JSON.parse(jsonText) };
            } catch {
                return { error: 'Could not parse JSON. Ask Claude to reply with JSON only.' };
            }
        },
        parseHaulImportText(text) {
            const result = window.FB.parseClaudeJsonText(text);
            if (result.error) return result;
            const items = Array.isArray(result.parsed) ? result.parsed : result.parsed.items;
            if (!Array.isArray(items) || items.length === 0) {
                return { error: 'JSON must contain an "items" array with at least one entry.' };
            }
            return { items };
        },
        parseRecipeImportText(text) {
            const result = window.FB.parseClaudeJsonText(text);
            if (result.error) return result;
            let recipes = Array.isArray(result.parsed) ? result.parsed : result.parsed.recipes;
            if (!recipes && result.parsed.name && Array.isArray(result.parsed.ingredients)) {
                recipes = [result.parsed];
            }
            if (!Array.isArray(recipes) || recipes.length === 0) {
                return { error: 'JSON must contain a "recipes" array with at least one entry.' };
            }
            return { recipes };
        },
        resolveHaulImportItems(rawItems, catalogItems) {
            return rawItems.map((raw, index) => {
                const name = (raw.name || '').trim();
                const quantity = Number(raw.quantity);
                const unit = window.FB.normalizeImportUnit(raw.unit);
                if (!name) {
                    return { index, name: '', quantity, unit, catalogItem: null, status: 'invalid', error: 'Missing item name', createInCatalog: false };
                }
                if (Number.isNaN(quantity) || quantity <= 0) {
                    return { index, name, quantity, unit, catalogItem: null, status: 'invalid', error: 'Invalid quantity', createInCatalog: false };
                }
                if (!unit) {
                    return { index, name, quantity, unit: raw.unit, catalogItem: null, status: 'invalid', error: `Unknown unit "${raw.unit || ''}"`, createInCatalog: false };
                }
                const catalogItem = window.FB.findCatalogItemForImport(name, raw.catalogItemId, catalogItems);
                if (catalogItem) {
                    return { index, name: catalogItem.name, quantity, unit, catalogItem, status: 'ready', createInCatalog: false };
                }
                return {
                    index,
                    name,
                    quantity,
                    unit,
                    catalogItem: null,
                    status: 'unmatched',
                    createInCatalog: false,
                    suggestedCategory: raw.category || 'other'
                };
            });
        },
        resolveRecipeImportRecipes(rawRecipes, catalogItems) {
            return rawRecipes.map((raw, recipeIndex) => {
                const name = (raw.name || '').trim();
                if (!name) {
                    return {
                        recipeIndex,
                        name: '',
                        ingredients: [],
                        status: 'invalid',
                        error: 'Missing recipe name'
                    };
                }
                if (!Array.isArray(raw.ingredients) || raw.ingredients.length === 0) {
                    return {
                        recipeIndex,
                        name,
                        ingredients: [],
                        status: 'invalid',
                        error: 'Recipe needs at least one ingredient'
                    };
                }
                const ingredients = window.FB.resolveHaulImportItems(raw.ingredients, catalogItems);
                const hasInvalid = ingredients.some(row => row.status === 'invalid');
                return {
                    recipeIndex,
                    name,
                    ingredients,
                    status: hasInvalid ? 'partial' : 'ready'
                };
            });
        },
        buildClaudeImportPrompt(catalogItems) {
            return window.FB.buildClaudeAgentPrompt(catalogItems);
        },
        formatClaudeCatalogLines(catalogItems, { includeExpiration = true } = {}) {
            if (catalogItems.length === 0) {
                return '(empty — add items in the Grocery store first)';
            }
            return catalogItems.map(item => {
                const parts = [`id ${item.id}`, item.name, window.FB.formatCategory(item.category || 'other')];
                if (!window.FB.isSeasoningCategory(item.category)) {
                    parts.push(`default unit ${item.defaultUnit || 'piece'}`);
                    if (includeExpiration && item.expirationDays != null) {
                        parts.push(`expires ${item.expirationDays} days`);
                    }
                }
                return `- ${parts.join(', ')}`;
            }).join('\n');
        },
        buildClaudeAgentPrompt(catalogItems) {
            const unitList = window.FB.getUnitAbbrs().join(', ');
            const catalogLines = window.FB.formatClaudeCatalogLines(catalogItems);

            return `You are the Fridge Buddy assistant. I use Fridge Buddy to track groceries, fridge inventory, recipes, and meals.

Paste this entire prompt into your AI agent once (for example Claude project instructions). Re-copy it from the Home tab when my grocery catalog changes.

When I send a message, infer what I want and respond with ONLY valid JSON (no markdown fences, no explanation). Use one of these shapes:

1) Grocery haul → add items to my fridge:
{
  "items": [
    { "name": "Milk", "quantity": 1, "unit": "gal", "catalogItemId": 4 }
  ]
}

2) Recipe → save a recipe:
{
  "recipes": [
    {
      "name": "Chicken Tacos",
      "ingredients": [
        { "name": "Chicken", "quantity": 1, "unit": "lb", "catalogItemId": 4 }
      ]
    }
  ]
}

3) Meal → log a meal I ate:
{
  "meals": [
    {
      "name": "Tuesday dinner",
      "ingredients": [
        { "name": "Chicken", "quantity": 1, "unit": "lb", "catalogItemId": 4 }
      ]
    }
  ]
}

Rules for all responses:
- Match names to MY GROCERY CATALOG below when possible. Use the exact catalog name and include catalogItemId when matched.
- quantity must be a positive number.
- unit must be one of: ${unitList}.
- For recipes: include one object per recipe; each recipe needs a name and at least one ingredient.
- For meals: include one object per meal; each meal needs a name and at least one ingredient; quantities reflect what was consumed.
- For hauls: only include items I explicitly mention buying.
- If something is NOT in the catalog, include your best name guess, omit catalogItemId, use unit "piece" if unclear, and include a "category" field (one of: meat, seafood, dairy, cheese, eggs, vegetables, fruit, grains, condiments, seasoning, drink, other).
- Unmatched items can be added to the grocery store when I confirm the import in Fridge Buddy.

MY GROCERY CATALOG:
${catalogLines}

After this context is loaded, I will describe a grocery haul, recipe, or meal in plain English. Reply with JSON only, using the matching shape above.`;
        },
        buildClaudeRecipeImportPrompt(catalogItems) {
            const unitList = window.FB.getUnitAbbrs().join(', ');
            const catalogLines = catalogItems.length === 0
                ? '(empty — add items in the Grocery store first)'
                : catalogItems.map(item => {
                    const parts = [`id ${item.id}`, item.name, window.FB.formatCategory(item.category || 'other')];
                    if (!window.FB.isSeasoningCategory(item.category)) {
                        parts.push(`default unit ${item.defaultUnit || 'piece'}`);
                    }
                    return `- ${parts.join(', ')}`;
                }).join('\n');

            return `You are helping import recipes into Fridge Buddy.

When I describe a recipe in natural language, respond with ONLY valid JSON (no markdown fences, no explanation), in this exact shape:

{
  "recipes": [
    {
      "name": "Chicken Tacos",
      "ingredients": [
        { "name": "Chicken", "quantity": 1, "unit": "lb", "catalogItemId": 4 },
        { "name": "Tortillas", "quantity": 8, "unit": "piece", "catalogItemId": 12 }
      ]
    }
  ]
}

Rules:
- Match ingredient names to MY GROCERY CATALOG below when possible. Use the exact catalog name and include catalogItemId when matched.
- quantity must be a positive number.
- unit must be one of: ${unitList}.
- Include one object per recipe in the "recipes" array.
- Each recipe must have a name and at least one ingredient.
- If an ingredient is NOT in the catalog, include your best name guess, omit catalogItemId, use unit "piece" if unclear, and include a "category" field (one of: meat, seafood, dairy, cheese, eggs, vegetables, fruit, grains, condiments, seasoning, drink, other).
- Only include recipes and ingredients I explicitly describe.
- Unmatched ingredients can be added to the grocery store when you confirm the import.

MY GROCERY CATALOG:
${catalogLines}

After I paste this context, I will send my recipe in plain English. Reply with JSON only.`;
        },
        mergeIngredients(ingredientLists) {
            const map = new Map();
            ingredientLists.flat().forEach(ingredient => {
                if (!ingredient?.catalogItemId) return;
                const unit = ingredient.unit || 'piece';
                const key = `${ingredient.catalogItemId}-${unit}`;
                const quantity = ingredient.quantity != null && ingredient.quantity !== ''
                    ? Number(ingredient.quantity)
                    : 1;
                if (map.has(key)) {
                    const existing = map.get(key);
                    existing.quantity = (Number(existing.quantity) || 0) + quantity;
                } else {
                    map.set(key, {
                        catalogItemId: ingredient.catalogItemId,
                        name: ingredient.name,
                        quantity,
                        unit
                    });
                }
            });
            return Array.from(map.values());
        },
        deductMealFromFridge(fridgeItems, ingredients, catalogItems) {
            let items = fridgeItems.map(item => ({ ...item }));
            ingredients.forEach(ingredient => {
                if (!ingredient?.catalogItemId) return;
                const qtyNeeded = Number(ingredient.quantity) || 1;
                const unit = ingredient.unit || 'piece';
                const matches = items.filter(item => item.catalogItemId === ingredient.catalogItemId);
                if (matches.length === 0) return;

                if (window.FB.isSeasoningFridgeItem(matches[0], catalogItems)) {
                    const targetId = matches[0].id;
                    items = items.map(item => item.id === targetId
                        ? { ...item, seasoningStatus: window.FB.adjustSeasoningStatus(item.seasoningStatus, -1) }
                        : item);
                    return;
                }

                const sameUnit = matches
                    .filter(item => (item.unit || 'piece') === unit)
                    .sort((a, b) => window.FB.getDaysUntilExpiry(a.expiry) - window.FB.getDaysUntilExpiry(b.expiry));

                let remaining = qtyNeeded;
                sameUnit.forEach(match => {
                    if (remaining <= 0) return;
                    const idx = items.findIndex(item => item.id === match.id);
                    if (idx === -1) return;
                    const current = window.FB.getFridgeItemQuantityValue(items[idx]);
                    if (current <= remaining) {
                        remaining -= current;
                        items.splice(idx, 1);
                    } else {
                        items[idx] = { ...items[idx], quantity: current - remaining };
                        remaining = 0;
                    }
                });
            });
            return items;
        },
        parseMealImportText(text) {
            const result = window.FB.parseClaudeJsonText(text);
            if (result.error) return result;
            let meals = Array.isArray(result.parsed) ? result.parsed : result.parsed.meals;
            if (!meals && result.parsed.name && Array.isArray(result.parsed.ingredients)) {
                meals = [result.parsed];
            }
            if (!Array.isArray(meals) || meals.length === 0) {
                return { error: 'JSON must contain a "meals" array with at least one entry.' };
            }
            return { meals };
        },
        resolveMealImportMeals(rawMeals, catalogItems) {
            return window.FB.resolveRecipeImportRecipes(rawMeals, catalogItems);
        },
        buildClaudeMealImportPrompt(catalogItems) {
            const unitList = window.FB.getUnitAbbrs().join(', ');
            const catalogLines = catalogItems.length === 0
                ? '(empty — add items in the Grocery store first)'
                : catalogItems.map(item => {
                    const parts = [`id ${item.id}`, item.name, window.FB.formatCategory(item.category || 'other')];
                    if (!window.FB.isSeasoningCategory(item.category)) {
                        parts.push(`default unit ${item.defaultUnit || 'piece'}`);
                    }
                    return `- ${parts.join(', ')}`;
                }).join('\n');

            return `You are helping log meals in Fridge Buddy.

When I describe a meal I ate in natural language, respond with ONLY valid JSON (no markdown fences, no explanation), in this exact shape:

{
  "meals": [
    {
      "name": "Tuesday dinner",
      "ingredients": [
        { "name": "Chicken", "quantity": 1, "unit": "lb", "catalogItemId": 4 },
        { "name": "Rice", "quantity": 2, "unit": "cup", "catalogItemId": 12 }
      ]
    }
  ]
}

Rules:
- Match ingredient names to MY GROCERY CATALOG below when possible. Use the exact catalog name and include catalogItemId when matched.
- quantity must be a positive number reflecting what was consumed.
- unit must be one of: ${unitList}.
- Include one object per meal in the "meals" array.
- Each meal must have a name and at least one ingredient.
- If an ingredient is NOT in the catalog, include your best name guess, omit catalogItemId, use unit "piece" if unclear, and include a "category" field (one of: meat, seafood, dairy, cheese, eggs, vegetables, fruit, grains, condiments, seasoning, drink, other).
- Only include meals and ingredients I explicitly describe.
- Unmatched ingredients can be added to the grocery store when I confirm the import.

MY GROCERY CATALOG:
${catalogLines}

After I paste this context, I will send my meal in plain English. Reply with JSON only.`;
        }
    };
})();
