(function () {
    const CATEGORIES = ['meat', 'seafood', 'dairy', 'cheese', 'eggs', 'vegetables', 'fruit', 'grains', 'condiments', 'seasoning', 'drink', 'other'];
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
        { name: 'Chicken breast', category: 'meat', defaultUnit: 'lb', expirationDays: 2 },
        { name: 'Ground beef', category: 'meat', defaultUnit: 'lb', expirationDays: 2 },
        { name: 'Salmon', category: 'seafood', defaultUnit: 'lb', expirationDays: 2 },
        { name: 'Milk', category: 'dairy', defaultUnit: 'gal', expirationDays: 10 },
        { name: 'Eggs', category: 'eggs', defaultUnit: 'eggs', defaultQuantity: 12, expirationDays: 30 },
        { name: 'Cheese', category: 'cheese', defaultUnit: 'lb', expirationDays: 18 },
        { name: 'Yogurt', category: 'dairy', defaultUnit: 'cup', expirationDays: 12 },
        { name: 'Butter', category: 'dairy', defaultUnit: 'lb', expirationDays: 35 },
        { name: 'Bread', category: 'grains', defaultUnit: 'piece', expirationDays: 6 },
        { name: 'Lettuce', category: 'vegetables', defaultUnit: 'head', expirationDays: 6 },
        { name: 'Spinach', category: 'vegetables', defaultUnit: 'oz', expirationDays: 4 },
        { name: 'Broccoli', category: 'vegetables', defaultUnit: 'piece', expirationDays: 4 },
        { name: 'Carrots', category: 'vegetables', defaultUnit: 'lb', expirationDays: 18 },
        { name: 'Tomato', category: 'vegetables', defaultUnit: 'piece', expirationDays: 6 },
        { name: 'Bell pepper', category: 'vegetables', defaultUnit: 'piece', expirationDays: 8 },
        { name: 'Apple', category: 'fruit', defaultUnit: 'piece', expirationDays: 21 },
        { name: 'Orange', category: 'fruit', defaultUnit: 'piece', expirationDays: 21 },
        { name: 'Orange juice', category: 'drink', defaultUnit: 'gal', expirationDays: 10 },
        { name: 'Bacon', category: 'meat', defaultUnit: 'lb', expirationDays: 10 },
        { name: 'Sour cream', category: 'dairy', defaultUnit: 'cup', expirationDays: 12 }
    ];

    window.FB = {
        CATEGORIES,
        UNITS,
        SEASONING_STATUSES,
        DEFAULT_CATALOG,
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
            const merged = parsed.map(item => window.FB.normalizeCatalogItem(item));

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
        isSeasoningCategory(category) {
            return category === 'seasoning';
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
            const name = unit.name.toLowerCase();
            if (unit.abbr.toLowerCase() === name) return unit.abbr;
            return `${unit.abbr} (${name})`;
        },
        normalizeCatalogItem(item) {
            const normalized = { ...item };
            if (normalized.name?.toLowerCase() === 'eggs') {
                if (normalized.defaultUnit === 'dozen') normalized.defaultUnit = 'eggs';
                if (normalized.defaultQuantity == null) normalized.defaultQuantity = 12;
            }
            return normalized;
        },
        getDefaultCatalogQuantity(item) {
            return item.defaultQuantity ?? 1;
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
        }
    };
})();
