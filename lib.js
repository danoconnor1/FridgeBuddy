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
        { abbr: 'slice', name: 'Slice', terms: ['slice', 'slices'] },
        { abbr: 'eggs', name: 'eggs', terms: ['egg', 'eggs', 'dozen', 'dozens', 'dz'] },
        { abbr: 'head', name: 'Head', terms: ['head', 'heads'] },
        { abbr: 'can', name: 'Can', terms: ['can', 'cans'] },
        { abbr: 'clove', name: 'Clove', terms: ['clove', 'cloves'] }
    ];

    const SEASONING_STATUSES = [
        { value: 'full', label: 'Full' },
        { value: 'plenty-left', label: 'Plenty left' },
        { value: 'half', label: 'Half' },
        { value: 'below-half', label: 'Below half' },
        { value: 'almost-empty', label: 'Almost empty' }
    ];

    const SEASONING_STATUS_ORDER = ['almost-empty', 'below-half', 'half', 'plenty-left', 'full'];

    const DEFAULT_CATALOG = [
        { name: 'Ground beef', category: 'meat', defaultUnit: 'lb', defaultQuantity: 1, caloriesPerDefault: 1500, expirationDays: 2 },
        { name: 'Bacon', category: 'meat', defaultUnit: 'lb', defaultQuantity: 1, caloriesPerDefault: 2440, expirationDays: 10 },
        { name: 'Chicken', category: 'meat', defaultUnit: 'lb', defaultQuantity: 1, caloriesPerDefault: 1080, expirationDays: 2 },
        { name: 'Salmon', category: 'seafood', defaultUnit: 'lb', defaultQuantity: 1, caloriesPerDefault: 940, expirationDays: 2 },
        { name: 'Shrimp', category: 'seafood', defaultUnit: 'lb', defaultQuantity: 1, caloriesPerDefault: 450, expirationDays: 2 },
        { name: 'Milk', category: 'dairy', defaultUnit: 'gal', defaultQuantity: 1, caloriesPerDefault: 2400, expirationDays: 10 },
        { name: 'Yogurt', category: 'dairy', defaultUnit: 'cup', defaultQuantity: 1, caloriesPerDefault: 100, expirationDays: 12 },
        { name: 'Heavy whipping cream', category: 'dairy', defaultUnit: 'cup', defaultQuantity: 1, caloriesPerDefault: 820, expirationDays: 14 },
        { name: 'Cheese', category: 'cheese', defaultUnit: 'cup', defaultQuantity: 1, caloriesPerDefault: 440, expirationDays: 18 },
        { name: 'Eggs', category: 'eggs', defaultUnit: 'eggs', defaultQuantity: 12, caloriesPerDefault: 750, expirationDays: 30 },
        { name: 'Lettuce', category: 'vegetables', defaultUnit: 'head', defaultQuantity: 1, caloriesPerDefault: 55, expirationDays: 6 },
        { name: 'Spinach', category: 'vegetables', defaultUnit: 'head', defaultQuantity: 1, caloriesPerDefault: 100, expirationDays: 4 },
        { name: 'Green onion', category: 'vegetables', defaultUnit: 'piece', defaultQuantity: 1, caloriesPerDefault: 5, expirationDays: 7 },
        { name: 'Frozen peas and carrots', category: 'vegetables', defaultUnit: 'cup', defaultQuantity: 1, caloriesPerDefault: 75, expirationDays: 180 },
        { name: 'Garlic', category: 'vegetables', defaultUnit: 'clove', defaultQuantity: 1, caloriesPerDefault: 5, expirationDays: 30 },
        { name: 'Onion', category: 'vegetables', defaultUnit: 'piece', defaultQuantity: 1, caloriesPerDefault: 45, expirationDays: 21 },
        { name: 'Bread', category: 'grains', defaultUnit: 'slice', defaultQuantity: 1, caloriesPerDefault: 75, expirationDays: 6 },
        { name: 'Rice', category: 'grains', defaultUnit: 'cup', defaultQuantity: 1, caloriesPerDefault: 200, expirationDays: 365 },
        { name: 'Tortilla', category: 'grains', defaultUnit: 'piece', defaultQuantity: 1, caloriesPerDefault: 175, expirationDays: 14 },
        { name: 'Hard taco shell', category: 'grains', defaultUnit: 'piece', defaultQuantity: 1, caloriesPerDefault: 55, expirationDays: 90 },
        { name: 'Pasta', category: 'grains', defaultUnit: 'oz', defaultQuantity: 1, caloriesPerDefault: 100, expirationDays: 365 },
        { name: 'Olive oil', category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 1, caloriesPerDefault: 120, expirationDays: 365 },
        { name: 'Canola oil', category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 1, caloriesPerDefault: 120, expirationDays: 365 },
        { name: 'Sesame oil', category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 1, caloriesPerDefault: 120, expirationDays: 365 },
        { name: 'Soy sauce', category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 1, caloriesPerDefault: 10, expirationDays: 365 },
        { name: 'Taco seasoning', category: 'condiments', defaultUnit: 'oz', defaultQuantity: 1, caloriesPerDefault: 100, expirationDays: 365 },
        { name: 'Salt', category: 'seasoning', defaultUnit: 'tsp', defaultQuantity: 1, defaultStatus: 'full' },
        { name: 'Italian seasoning', category: 'seasoning', defaultUnit: 'tsp', defaultQuantity: 1, defaultStatus: 'full' }
    ];

    const DEFAULT_CATALOG_BY_NAME = new Map(
        DEFAULT_CATALOG.map(item => [item.name.toLowerCase(), item])
    );

    const FRIDGE_THEMES = ['classic-light', 'classic-dark', 'neon-kitchen', 'retro-space', 'farmers-market'];

    const FRIDGE_THEME_OPTIONS = [
        { id: 'classic-light', label: 'Classic', group: 'classic' },
        { id: 'neon-kitchen', label: 'Neon Kitchen', group: 'styled' },
        { id: 'retro-space', label: 'Retro Space', group: 'styled' },
        { id: 'farmers-market', label: "Farmer's Market", group: 'styled' }
    ];

    const EXPENSE_CATEGORIES = [
        { id: 'groceries', label: 'Groceries', description: 'food shopping' },
        { id: 'dining', label: 'Dining', description: 'restaurants, coffee, takeout' },
        { id: 'housing', label: 'Housing', description: 'rent, mortgage' },
        { id: 'utilities', label: 'Utilities', description: 'electric, water, internet, phone' },
        { id: 'transportation', label: 'Transportation', description: 'gas, car payment, insurance, transit' },
        { id: 'healthcare', label: 'Healthcare', description: 'gym, doctor, medicine, dental' },
        { id: 'entertainment', label: 'Entertainment', description: 'movies, games, hobbies, streaming' },
        { id: 'shopping', label: 'Shopping', description: 'clothes, household items, personal care' },
        { id: 'subscriptions', label: 'Subscriptions', description: 'apps, memberships, services' },
        { id: 'travel', label: 'Travel', description: 'flights, hotels, vacation' },
        { id: 'pets', label: 'Pets', description: 'food, vet, supplies' },
        { id: 'gifts', label: 'Gifts', description: 'presents, donations' },
        { id: 'insurance', label: 'Insurance', description: 'car, home, health' },
        { id: 'miscellaneous', label: 'Miscellaneous', description: 'other/unclear' }
    ];

    const EXPENSE_CATEGORY_COLORS = {
        groceries: '#4ADE80',
        dining: '#FB7185',
        housing: '#D4A574',
        utilities: '#38BDF8',
        transportation: '#FACC15',
        healthcare: '#34D399',
        entertainment: '#C084FC',
        shopping: '#F472B6',
        subscriptions: '#93C5FD',
        travel: '#22D3EE',
        pets: '#FB923C',
        gifts: '#E879F9',
        insurance: '#94A3B8',
        miscellaneous: '#A78BFA'
    };

    const CUSTOM_EXPENSE_CATEGORY_COLORS = [
        '#60A5FA', '#F87171', '#A3E635', '#EAB308', '#2DD4BF',
        '#818CF8', '#FB7185', '#4ADE80', '#F472B6', '#38BDF8'
    ];

    window.FB = {
        CATEGORIES,
        UNITS,
        SEASONING_STATUSES,
        DEFAULT_CATALOG,
        EXPENSE_CATEGORIES,
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
                'retro-space': '#1a2840',
                'farmers-market': '#c9dce8'
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
                    if (normalized.defaultUnit == null && defaults.defaultUnit != null) {
                        normalized.defaultUnit = defaults.defaultUnit;
                    }
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
        normalizeSeasoningStatus(status) {
            const legacy = {
                healthy: 'plenty-left',
                'running-low': 'below-half'
            };
            const normalized = legacy[status] || status || 'full';
            return SEASONING_STATUS_ORDER.includes(normalized) ? normalized : 'full';
        },
        formatSeasoningStatus(status) {
            const normalized = window.FB.normalizeSeasoningStatus(status);
            const match = SEASONING_STATUSES.find(entry => entry.value === normalized);
            return match ? match.label : 'Full';
        },
        getSeasoningStatusSortOrder(status) {
            const normalized = window.FB.normalizeSeasoningStatus(status);
            return SEASONING_STATUS_ORDER.indexOf(normalized);
        },
        adjustSeasoningStatus(status, delta) {
            const normalized = window.FB.normalizeSeasoningStatus(status);
            const current = SEASONING_STATUS_ORDER.indexOf(normalized);
            const next = Math.max(0, Math.min(SEASONING_STATUS_ORDER.length - 1, current + delta));
            return SEASONING_STATUS_ORDER[next];
        },
        lowerSeasoningStatus(status) {
            const normalized = window.FB.normalizeSeasoningStatus(status);
            const current = SEASONING_STATUS_ORDER.indexOf(normalized);
            const next = (current - 1 + SEASONING_STATUS_ORDER.length) % SEASONING_STATUS_ORDER.length;
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
        estimateCatalogDraftCalories(catalogItem, draft) {
            if (!catalogItem || catalogItem.caloriesPerDefault == null) return null;
            if (window.FB.isSeasoningCategory(catalogItem.category)) return null;

            const unit = (draft?.unit || catalogItem.defaultUnit || 'piece').toLowerCase();
            const catalogUnit = (catalogItem.defaultUnit || 'piece').toLowerCase();
            if (unit !== catalogUnit) return null;

            const qty = draft?.quantity ?? window.FB.getDefaultCatalogQuantity(catalogItem);
            const defaultQty = window.FB.getDefaultCatalogQuantity(catalogItem);
            if (!defaultQty || !qty) return null;

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
        formatFridgeItemLabel(item, catalogItems) {
            if (catalogItems && window.FB.usesFridgeCapacityTracking(item, catalogItems)) {
                return item.name;
            }
            if (item.trackingMode === 'capacity') return item.name;
            if (item.quantity != null && item.quantity !== '' && item.unit) {
                return `${item.quantity} ${item.unit} ${item.name}`;
            }
            return item.name;
        },
        formatFridgeExistingAmount(catalogItemId, fridgeItems, catalogItems) {
            const matches = fridgeItems.filter(item => item.catalogItemId === catalogItemId);
            if (matches.length === 0) return null;

            const catalogItem = catalogItems.find(c => c.id === catalogItemId);
            const isSeasoning = matches.some(item => window.FB.usesFridgeCapacityTracking(item, catalogItems))
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
        getFridgeExistingExpirySummary(catalogItemId, fridgeItems, catalogItems) {
            const matches = fridgeItems.filter(item => item.catalogItemId === catalogItemId);
            if (matches.length === 0) return null;

            const catalogItem = catalogItems.find(c => c.id === catalogItemId);
            const isSeasoning = matches.some(item => window.FB.usesFridgeCapacityTracking(item, catalogItems))
                || window.FB.isSeasoningCategory(catalogItem?.category);

            if (isSeasoning) {
                const item = matches.find(entry => window.FB.usesFridgeCapacityTracking(entry, catalogItems)) || matches[0];
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
        toDraftIngredient(ingredient, catalogItems) {
            const catalogItem = window.FB.findCatalogItemForIngredient(ingredient, catalogItems);
            const catalogItemId = catalogItem
                ? String(catalogItem.id)
                : (ingredient.catalogItemId != null && ingredient.catalogItemId !== ''
                    ? String(ingredient.catalogItemId)
                    : '');
            return {
                catalogItemId,
                name: catalogItem?.name || ingredient.name || '',
                quantity: ingredient.quantity ?? 1,
                unit: ingredient.unit || catalogItem?.defaultUnit || 'piece'
            };
        },
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
        isFridgeItemAvailable(item, getDaysUntilExpiry, catalogItems) {
            if (window.FB.isSeasoningFridgeItem(item, catalogItems)) return true;
            if (!item.expiry) return true;
            return getDaysUntilExpiry(item.expiry) >= 0;
        },
        getFridgeItemQuantityValue(item) {
            if (item.quantity != null && item.quantity !== '') return Number(item.quantity);
            return 1;
        },
        getIngredientFridgeAvailability(ingredient, fridgeItems, getDaysUntilExpiry, catalogItems) {
            const matches = window.FB.getMatchingFridgeItems(ingredient, fridgeItems)
                .filter(item => window.FB.isFridgeItemAvailable(item, getDaysUntilExpiry, catalogItems));

            if (matches.length === 0) {
                return { status: 'missing', inFridgeLabel: null };
            }

            const capacityMatches = matches.filter(item => window.FB.usesFridgeCapacityTracking(item, catalogItems));
            if (capacityMatches.length > 0) {
                const status = window.FB.normalizeSeasoningStatus(capacityMatches[0].seasoningStatus);
                const insufficient = status === 'almost-empty' || status === 'below-half';
                return {
                    status: insufficient ? 'insufficient' : 'enough',
                    inFridgeLabel: window.FB.formatSeasoningStatus(status)
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
        countFailingIngredients(recipe, fridgeItems, getDaysUntilExpiry, catalogItems) {
            if (!recipe.ingredients?.length) return Infinity;
            return recipe.ingredients.filter(ingredient => {
                const availability = window.FB.getIngredientFridgeAvailability(
                    ingredient,
                    fridgeItems,
                    getDaysUntilExpiry,
                    catalogItems
                );
                return availability.status !== 'enough';
            }).length;
        },
        getRecipeIngredientsNotInFridge(recipe, fridgeItems, getDaysUntilExpiry, catalogItems) {
            if (!recipe?.ingredients?.length) return [];
            return recipe.ingredients.filter(ingredient => {
                const availability = window.FB.getIngredientFridgeAvailability(
                    ingredient,
                    fridgeItems,
                    getDaysUntilExpiry,
                    catalogItems
                );
                return availability.status !== 'enough';
            });
        },
        resolveGroceryListCatalogEntry(ingredient, catalogItems) {
            const catalogItem = window.FB.findCatalogItemForIngredient(ingredient, catalogItems);
            if (!catalogItem) return null;
            return {
                catalogItemId: catalogItem.id,
                name: catalogItem.name
            };
        },
        getGroceryListItemQuantityDefaults(groceryItem, catalogItems) {
            const catalogItem = catalogItems?.find(
                entry => String(entry.id) === String(groceryItem.catalogItemId)
            );
            const quantity = groceryItem.quantity != null && groceryItem.quantity !== ''
                ? groceryItem.quantity
                : (catalogItem ? window.FB.getDefaultCatalogQuantity(catalogItem) : 1);
            const unit = groceryItem.unit
                || (catalogItem ? window.FB.getDefaultCatalogUnit(catalogItem) : 'piece');
            return { quantity, unit, catalogItem };
        },
        buildFridgeItemFromGroceryListEntry(groceryItem, catalogItems, id) {
            const { quantity, unit, catalogItem } = window.FB.getGroceryListItemQuantityDefaults(
                groceryItem,
                catalogItems
            );
            if (!catalogItem) return null;

            if (window.FB.isSeasoningCategory(catalogItem.category)) {
                return {
                    id,
                    catalogItemId: catalogItem.id,
                    name: catalogItem.name,
                    seasoningStatus: catalogItem.defaultStatus || 'full'
                };
            }

            const parsedQty = window.FB.parseIngredientQuantity(quantity);
            return {
                id,
                catalogItemId: catalogItem.id,
                name: catalogItem.name,
                expiry: window.FB.addExpirationFromToday(catalogItem.expirationDays ?? 7, 'days'),
                quantity: parsedQty,
                unit
            };
        },
        classifyRecipesForHome(recipes, fridgeItems, getDaysUntilExpiry, catalogItems) {
            const readyToMake = [];
            const almostThere = [];
            recipes.forEach(recipe => {
                if (!recipe.ingredients?.length) return;
                const failing = window.FB.countFailingIngredients(
                    recipe,
                    fridgeItems,
                    getDaysUntilExpiry,
                    catalogItems
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
            const catalogItem = catalogItems.find(entry => entry.id === item.catalogItemId);
            return window.FB.isSeasoningCategory(catalogItem?.category);
        },
        usesFridgeCapacityTracking(item, catalogItems) {
            if (window.FB.isSeasoningFridgeItem(item, catalogItems)) return true;
            return item.trackingMode === 'capacity';
        },
        canToggleFridgeTrackingMode(item, catalogItems) {
            if (window.FB.isLeftoverFridgeItem(item)) return false;
            return !window.FB.isSeasoningFridgeItem(item, catalogItems);
        },
        getFridgeTrackingMode(item, catalogItems) {
            return window.FB.usesFridgeCapacityTracking(item, catalogItems) ? 'capacity' : 'amount';
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
            const normalized = window.FB.normalizeSeasoningStatus(status);
            if (normalized === 'almost-empty' || normalized === 'below-half') return 'var(--fill-danger)';
            if (normalized === 'half') return 'var(--fill-warning)';
            return 'var(--fill-success)';
        },
        getFridgeExpirationBucket(item, catalogItems) {
            if (window.FB.isSeasoningFridgeItem(item, catalogItems)) {
                const status = window.FB.normalizeSeasoningStatus(item.seasoningStatus);
                if (status === 'almost-empty') return 'expired';
                if (status === 'below-half' || status === 'half') return 'expiring-soon';
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
        isFridgeItemExpiringSoon(fridgeItem, catalogItems) {
            if (window.FB.isSeasoningFridgeItem(fridgeItem, catalogItems)) return false;
            if (window.FB.isLeftoverFridgeItem(fridgeItem)) return false;
            const days = window.FB.getDaysUntilExpiry(fridgeItem.expiry);
            return days <= 3 && days >= 0;
        },
        isFridgeItemRunningLow(fridgeItem, catalogItems) {
            if (window.FB.isLeftoverFridgeItem(fridgeItem)) return false;
            if (window.FB.usesFridgeCapacityTracking(fridgeItem, catalogItems)) {
                return window.FB.normalizeSeasoningStatus(fridgeItem.seasoningStatus) === 'almost-empty';
            }
            const catalogItem = catalogItems.find(entry => entry.id === fridgeItem.catalogItemId);
            if (!catalogItem) return false;
            const fridgeUnit = (fridgeItem.unit || catalogItem.defaultUnit || 'piece').toLowerCase();
            const catalogUnit = (catalogItem.defaultUnit || 'piece').toLowerCase();
            if (fridgeUnit !== catalogUnit) return false;
            const qty = window.FB.getFridgeItemQuantityValue(fridgeItem);
            const defaultQty = window.FB.getDefaultCatalogQuantity(catalogItem);
            if (!defaultQty) return false;
            return qty / defaultQty < 0.2;
        },
        formatGroceryListRemainingAmount(fridgeItem, catalogItems) {
            const catalogItem = catalogItems.find(entry => entry.id === fridgeItem.catalogItemId);
            const unit = fridgeItem.unit || catalogItem?.defaultUnit || 'piece';
            const qty = window.FB.getFridgeItemQuantityValue(fridgeItem);
            const formattedQty = Number.isInteger(qty) ? String(qty) : String(parseFloat(qty.toFixed(2)));
            return `${formattedQty} ${unit} remaining`;
        },
        getGroceryListFridgeItemDetail(fridgeItem, catalogItems, kind) {
            if (kind === 'expiring') {
                const days = window.FB.getDaysUntilExpiry(fridgeItem.expiry);
                if (days === 0) return 'expiring today';
                if (days === 1) return 'expiring in 1 day';
                return `expiring in ${days} days`;
            }
            if (kind === 'low') {
                if (window.FB.usesFridgeCapacityTracking(fridgeItem, catalogItems)) {
                    return window.FB.formatSeasoningStatus(fridgeItem.seasoningStatus).toLowerCase();
                }
                return window.FB.formatGroceryListRemainingAmount(fridgeItem, catalogItems);
            }
            return '';
        },
        hashSeed(value) {
            const input = String(value);
            let hash = 0;
            for (let i = 0; i < input.length; i += 1) {
                hash = ((hash << 5) - hash) + input.charCodeAt(i);
                hash |= 0;
            }
            return hash;
        },
        mulberry32(seed) {
            let state = seed;
            return () => {
                state |= 0;
                state = state + 0x6D2B79F5 | 0;
                let t = Math.imul(state ^ state >>> 15, 1 | state);
                t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
                return ((t ^ t >>> 14) >>> 0) / 4294967296;
            };
        },
        pickRandomEntries(items, count, seed) {
            const rng = window.FB.mulberry32(seed);
            const pool = [...items];
            const picks = [];
            while (picks.length < count && pool.length > 0) {
                const index = Math.floor(rng() * pool.length);
                picks.push(pool.splice(index, 1)[0]);
            }
            return picks;
        },
        buildFridgeGrocerySuggestions(fridgeItems, catalogItems, dismissedGroceryListIds = []) {
            const dismissed = new Set(dismissedGroceryListIds);
            const entries = [];

            fridgeItems.forEach(fridgeItem => {
                const entryId = `fridge-${fridgeItem.id}`;
                if (dismissed.has(entryId)) return;

                const details = [];
                if (window.FB.isFridgeItemExpiringSoon(fridgeItem, catalogItems)) {
                    details.push(window.FB.getGroceryListFridgeItemDetail(fridgeItem, catalogItems, 'expiring'));
                }
                if (window.FB.isFridgeItemRunningLow(fridgeItem, catalogItems)) {
                    details.push(window.FB.getGroceryListFridgeItemDetail(fridgeItem, catalogItems, 'low'));
                }
                if (details.length === 0) return;

                entries.push({
                    id: entryId,
                    name: fridgeItem.name,
                    detail: details.join(' · '),
                    detailTone: 'warning',
                    source: 'fridge',
                    fridgeItemId: fridgeItem.id
                });
            });

            return entries;
        },
        generateSessionRandomGroceryItems(catalogItems, excludedNames = [], count = 3, seed = Date.now()) {
            const excluded = new Set(excludedNames.map(name => name.toLowerCase()));
            const candidates = catalogItems.filter(entry => !excluded.has(entry.name.toLowerCase()));
            const randomPicks = window.FB.pickRandomEntries(candidates, count, window.FB.hashSeed(String(seed)));
            return randomPicks.map(catalogItem => ({
                id: `catalog-${catalogItem.id}`,
                name: catalogItem.name,
                detail: '(not in fridge)',
                detailTone: 'danger',
                source: 'random',
                catalogItemId: catalogItem.id
            }));
        },
        buildSuggestedGroceryListItems(fridgeItems, catalogItems, manualGroceryListItems = [], dismissedGroceryListIds = []) {
            return window.FB.buildFridgeGrocerySuggestions(fridgeItems, catalogItems, dismissedGroceryListIds);
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
        getTodayIsoDate() {
            return new Date().toISOString().split('T')[0];
        },
        formatExpenseCategory(categoryId) {
            const match = window.FB.getExpenseCategories().find(entry => entry.id === categoryId);
            return match ? match.label : categoryId;
        },
        normalizeExpenseCategory(raw) {
            if (raw == null || raw === '') return null;
            const query = String(raw).trim().toLowerCase();
            const categories = window.FB.getExpenseCategories();
            const byId = categories.find(entry => entry.id === query);
            if (byId) return byId.id;
            const byLabel = categories.find(entry => entry.label.toLowerCase() === query);
            if (byLabel) return byLabel.id;
            return null;
        },
        loadCustomExpenseCategories() {
            try {
                const saved = localStorage.getItem('fridgeCustomExpenseCategories');
                if (!saved) return [];
                const parsed = JSON.parse(saved);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        },
        saveCustomExpenseCategories(categories) {
            localStorage.setItem('fridgeCustomExpenseCategories', JSON.stringify(categories));
        },
        getExpenseCategories() {
            return [...EXPENSE_CATEGORIES, ...window.FB.loadCustomExpenseCategories()];
        },
        isBuiltInExpenseCategory(categoryId) {
            return EXPENSE_CATEGORIES.some(entry => entry.id === categoryId);
        },
        slugifyExpenseCategoryId(label) {
            const slug = String(label || '').trim().toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            return slug || 'category';
        },
        buildCustomExpenseCategory(label, customCategories = null) {
            const trimmed = String(label || '').trim();
            if (!trimmed) return { error: 'Category name is required' };
            const existing = customCategories
                ? [...EXPENSE_CATEGORIES, ...customCategories]
                : window.FB.getExpenseCategories();
            if (existing.some(entry => entry.label.toLowerCase() === trimmed.toLowerCase())) {
                return { error: 'Category already exists' };
            }
            const baseId = window.FB.slugifyExpenseCategoryId(trimmed);
            let id = baseId;
            let suffix = 2;
            while (existing.some(entry => entry.id === id)) {
                id = `${baseId}-${suffix}`;
                suffix += 1;
            }
            return {
                category: {
                    id,
                    label: trimmed,
                    description: 'custom category',
                    custom: true
                }
            };
        },
        getExpenseCategoryColor(categoryId) {
            if (EXPENSE_CATEGORY_COLORS[categoryId]) return EXPENSE_CATEGORY_COLORS[categoryId];
            let hash = 0;
            for (let i = 0; i < categoryId.length; i += 1) {
                hash = categoryId.charCodeAt(i) + ((hash << 5) - hash);
            }
            return CUSTOM_EXPENSE_CATEGORY_COLORS[Math.abs(hash) % CUSTOM_EXPENSE_CATEGORY_COLORS.length];
        },
        normalizeExpensePrice(value) {
            const parsed = Number(value);
            if (Number.isNaN(parsed) || parsed <= 0) return null;
            return Math.round(parsed * 100) / 100;
        },
        normalizeExpenseDate(value) {
            if (value == null || value === '') return window.FB.getTodayIsoDate();
            const trimmed = String(value).trim();
            if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
            const parsed = new Date(trimmed);
            if (Number.isNaN(parsed.getTime())) return window.FB.getTodayIsoDate();
            return parsed.toISOString().split('T')[0];
        },
        formatExpensePrice(value) {
            const amount = window.FB.normalizeExpensePrice(value);
            if (amount == null) return '$0.00';
            return `$${amount.toFixed(2)}`;
        },
        getExpenseTotal(expense) {
            const items = expense.items || [];
            if (items.length > 0) {
                return items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
            }
            return Number(expense.price) || 0;
        },
        emptyExpenseItem() {
            return { name: '', price: '' };
        },
        serializeExpenseDraftItems(items) {
            return items
                .map(item => {
                    const name = (item.name || '').trim();
                    const price = window.FB.normalizeExpensePrice(item.price);
                    if (!name || price == null) return null;
                    return { name, price };
                })
                .filter(Boolean);
        },
        normalizeStoredExpense(expense) {
            let date = expense.date;
            if (!date && Array.isArray(expense.items)) {
                const datedItem = expense.items.find(item => item.date);
                if (datedItem) date = datedItem.date;
            }
            let category = expense.category;
            if (!category && Array.isArray(expense.items)) {
                const categorizedItem = expense.items.find(item => item.category);
                if (categorizedItem) category = categorizedItem.category;
            }
            category = window.FB.normalizeExpenseCategory(category) || 'miscellaneous';
            const items = (expense.items || []).map(item => ({
                name: item.name,
                price: item.price
            }));
            const hasItemPrices = items.length > 0;
            const price = hasItemPrices
                ? undefined
                : window.FB.normalizeExpensePrice(expense.price);
            return {
                ...expense,
                date: window.FB.normalizeExpenseDate(date),
                category,
                price,
                items
            };
        },
        parseExpenseImportText(text) {
            const result = window.FB.parseClaudeJsonText(text);
            if (result.error) return result;
            let expenses = Array.isArray(result.parsed) ? result.parsed : result.parsed.expenses;
            if (!expenses && result.parsed.title && (
                result.parsed.price != null || Array.isArray(result.parsed.items)
            )) {
                expenses = [result.parsed];
            }
            if (!Array.isArray(expenses) || expenses.length === 0) {
                return { error: 'JSON must contain an "expenses" array with at least one entry.' };
            }
            return { expenses };
        },
        resolveExpenseImportExpenses(rawExpenses) {
            return rawExpenses.map((raw, expenseIndex) => {
                const title = (raw.title || '').trim();
                if (!title) {
                    return {
                        expenseIndex,
                        title: '',
                        items: [],
                        status: 'invalid',
                        error: 'Missing expense title'
                    };
                }
                const category = window.FB.normalizeExpenseCategory(raw.category);
                if (!category) {
                    return {
                        expenseIndex,
                        title,
                        items: [],
                        status: 'invalid',
                        error: `Unknown category "${raw.category || ''}"`
                    };
                }
                const date = window.FB.normalizeExpenseDate(raw.date);
                const expensePrice = window.FB.normalizeExpensePrice(raw.price);
                const rawItems = Array.isArray(raw.items) ? raw.items : [];
                const items = rawItems.map((rawItem, itemIndex) => {
                    const name = (rawItem.name || '').trim();
                    const price = window.FB.normalizeExpensePrice(rawItem.price);
                    if (!name) {
                        return { itemIndex, name: '', price, status: 'invalid', error: 'Missing item name' };
                    }
                    if (price == null) {
                        return { itemIndex, name, price: rawItem.price, status: 'invalid', error: 'Invalid price' };
                    }
                    return { itemIndex, name, price, status: 'ready' };
                });
                const readyItems = items.filter(row => row.status === 'ready');
                if (readyItems.length === 0 && expensePrice == null) {
                    return {
                        expenseIndex,
                        title,
                        date,
                        category,
                        price: null,
                        items,
                        status: 'invalid',
                        error: 'Expense needs a price or at least one item'
                    };
                }
                const hasInvalid = items.some(row => row.status === 'invalid');
                return {
                    expenseIndex,
                    title,
                    date,
                    category,
                    price: readyItems.length === 0 ? expensePrice : undefined,
                    items,
                    status: hasInvalid ? 'partial' : 'ready'
                };
            });
        },
        expenseInFilter(expense, filter, today = new Date()) {
            const anchor = new Date(today);
            anchor.setHours(0, 0, 0, 0);
            const expenseDate = new Date(`${window.FB.normalizeExpenseDate(expense.date)}T00:00:00`);
            if (Number.isNaN(expenseDate.getTime())) return false;
            if (filter === 'all') return true;
            if (filter === 'month') {
                return expenseDate.getFullYear() === anchor.getFullYear()
                    && expenseDate.getMonth() === anchor.getMonth();
            }
            if (filter === '30days') {
                const cutoff = new Date(anchor);
                cutoff.setDate(cutoff.getDate() - 30);
                return expenseDate >= cutoff && expenseDate <= anchor;
            }
            return true;
        },
        aggregateExpensesByCategory(expenses, filter) {
            const today = new Date();
            const categories = window.FB.getExpenseCategories();
            const totals = new Map(categories.map(entry => [entry.id, 0]));

            expenses.forEach(expense => {
                if (!window.FB.expenseInFilter(expense, filter, today)) return;
                const category = window.FB.normalizeExpenseCategory(expense.category);
                if (!category) return;
                totals.set(category, (totals.get(category) || 0) + window.FB.getExpenseTotal(expense));
            });

            const grandTotal = [...totals.values()].reduce((sum, value) => sum + value, 0);
            return categories
                .map(entry => ({
                    category: entry.id,
                    label: entry.label,
                    total: Math.round((totals.get(entry.id) || 0) * 100) / 100,
                    color: window.FB.getExpenseCategoryColor(entry.id)
                }))
                .filter(row => row.total > 0)
                .map(row => ({
                    ...row,
                    percent: grandTotal > 0 ? (row.total / grandTotal) * 100 : 0
                }));
        },
        formatExpenseCategoryLinesForPrompt() {
            return window.FB.getExpenseCategories()
                .map(entry => `- ${entry.id}: ${entry.label} (${entry.description})`)
                .join('\n');
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
            const expenseCategoryLines = window.FB.formatExpenseCategoryLinesForPrompt();

            return `You are the Fridge Buddy assistant. I use Fridge Buddy to track groceries, fridge inventory, recipes, meals, and expenses.

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

4) Expense → log spending:
{
  "expenses": [
    {
      "title": "Whole Foods",
      "date": "2026-07-30",
      "category": "groceries",
      "price": 85.50,
      "items": [
        { "name": "Milk", "price": 4.99 }
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
- For expenses: include one object per receipt or purchase; each expense needs a title, category (expense category id), date (YYYY-MM-DD or omit for today), and either a top-level price in dollars OR an optional items array with name and price per line; all prices are USD.
- If something is NOT in the catalog, include your best name guess, omit catalogItemId, use unit "piece" if unclear, and include a "category" field (one of: meat, seafood, dairy, cheese, eggs, vegetables, fruit, grains, condiments, seasoning, drink, other).
- Unmatched grocery items can be added to the grocery store when I confirm the import in Fridge Buddy.

EXPENSE CATEGORIES:
${expenseCategoryLines}

MY GROCERY CATALOG:
${catalogLines}

After this context is loaded, I will describe a grocery haul, recipe, meal, or expense in plain English (or share receipt details from a screenshot I sent separately). Reply with JSON only, using the matching shape above.`;
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

                if (window.FB.usesFridgeCapacityTracking(matches[0], catalogItems)) {
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
