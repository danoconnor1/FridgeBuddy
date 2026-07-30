function useFridgeBuddy() {
    const { useState, useEffect } = React;
    const FB = window.FB;
    const {
        CATEGORIES, loadCatalogItems, formatCategory, isSeasoningCategory,
        getDefaultCatalogQuantity, adjustSeasoningStatus, addExpirationFromToday,
        emptyIngredient, getDaysUntilExpiry, classifyRecipesForHome, formatFridgeExistingAmount,
        getFridgeExistingExpirySummary,
        adjustDays, buildFridgeItemGroups, groupItemsByCategory,
        isSeasoningFridgeItem: isSeasoningFridgeItemLib, getDefaultCatalogUnit,
        serializeDraftIngredients, parseIngredientQuantity, roundIngredientQuantity,
        buildClaudeAgentPrompt, parseHaulImportText, resolveHaulImportItems,
        parseRecipeImportText, resolveRecipeImportRecipes,
        parseMealImportText, resolveMealImportMeals,
        mergeIngredients, deductMealFromFridge,
        estimateCaloriesFromIngredients, parseCalories, resolveCalories, adjustCalories,
        getRecipeDisplayCalories
    } = FB;

    const [catalogItems, setCatalogItems] = useState(() => loadCatalogItems());
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem('fridgeItems');
        return saved ? JSON.parse(saved) : [];
    });
    const [recipes, setRecipes] = useState(() => {
        const saved = localStorage.getItem('fridgeRecipes');
        return saved ? JSON.parse(saved) : [];
    });
    const [meals, setMeals] = useState(() => {
        const saved = localStorage.getItem('fridgeMeals');
        return saved ? JSON.parse(saved) : [];
    });
    const [catalogName, setCatalogName] = useState('');
    const [catalogCategory, setCatalogCategory] = useState('meat');
    const [catalogDefaultUnit, setCatalogDefaultUnit] = useState('piece');
    const [catalogExpirationDays, setCatalogExpirationDays] = useState(1);
    const [editingCatalogItemId, setEditingCatalogItemId] = useState(null);
    const [editCatalogName, setEditCatalogName] = useState('');
    const [editCatalogCategory, setEditCatalogCategory] = useState('');
    const [editCatalogExpirationDays, setEditCatalogExpirationDays] = useState('');
    const [editCatalogDefaultStatus, setEditCatalogDefaultStatus] = useState('full');
    const [catalogDrafts, setCatalogDrafts] = useState({});
    const [addedToFridgeItemId, setAddedToFridgeItemId] = useState(null);
    const [catalogAddSuccess, setCatalogAddSuccess] = useState(false);
    const [addCatalogModalOpen, setAddCatalogModalOpen] = useState(false);
    const [recipeName, setRecipeName] = useState('');
    const [draftIngredients, setDraftIngredients] = useState([]);
    const [editingRecipeId, setEditingRecipeId] = useState(null);
    const [editRecipeName, setEditRecipeName] = useState('');
    const [editDraftIngredients, setEditDraftIngredients] = useState([]);
    const [editRecipeCalories, setEditRecipeCalories] = useState('');
    const [editRecipeCaloriesTouched, setEditRecipeCaloriesTouched] = useState(false);
    const VALID_TABS = new Set(['home', 'allItems', 'fridge', 'recipes', 'meals']);
    const [activeTab, setActiveTab] = useState(() => {
        const saved = localStorage.getItem('fridgeActiveTab');
        return saved && VALID_TABS.has(saved) ? saved : 'home';
    });
    const [groceryStoreSearch, setGroceryStoreSearch] = useState('');
    const [fridgeSearch, setFridgeSearch] = useState('');
    const [fridgeSort, setFridgeSort] = useState('category');
    const [viewingRecipeId, setViewingRecipeId] = useState(null);
    const [duplicateFridgeConfirm, setDuplicateFridgeConfirm] = useState(null);
    const [haulImportPaste, setHaulImportPaste] = useState('');
    const [haulImportPreview, setHaulImportPreview] = useState(null);
    const [haulImportError, setHaulImportError] = useState('');
    const [haulImportSuccess, setHaulImportSuccess] = useState(false);
    const [agentPromptCopied, setAgentPromptCopied] = useState(false);
    const [theme, setTheme] = useState(() =>
        FB.normalizeFridgeTheme(
            document.documentElement.getAttribute('data-theme') || localStorage.getItem('fridgeTheme')
        )
    );
    const [recipeImportPaste, setRecipeImportPaste] = useState('');
    const [recipeImportPreview, setRecipeImportPreview] = useState(null);
    const [recipeImportError, setRecipeImportError] = useState('');
    const [recipeImportSuccess, setRecipeImportSuccess] = useState(false);
    const [importUnmatchedConfirm, setImportUnmatchedConfirm] = useState(null);
    const [mealName, setMealName] = useState('');
    const [mealDraftIngredients, setMealDraftIngredients] = useState([]);
    const [mealManualRemoveFromFridge, setMealManualRemoveFromFridge] = useState(true);
    const [mealFromRecipesName, setMealFromRecipesName] = useState('');
    const [selectedMealRecipeIds, setSelectedMealRecipeIds] = useState([]);
    const [mealFromRecipesRemoveFromFridge, setMealFromRecipesRemoveFromFridge] = useState(true);
    const [mealImportPaste, setMealImportPaste] = useState('');
    const [mealImportPreview, setMealImportPreview] = useState(null);
    const [mealImportError, setMealImportError] = useState('');
    const [mealImportSuccess, setMealImportSuccess] = useState(false);
    const [mealImportRemoveFromFridge, setMealImportRemoveFromFridge] = useState(true);
    const [mealImportAddToRecipes, setMealImportAddToRecipes] = useState(false);
    const [addLeftoverModalOpen, setAddLeftoverModalOpen] = useState(false);
    const [leftoverName, setLeftoverName] = useState('');
    const [leftoverExpirationDays, setLeftoverExpirationDays] = useState(3);
    const [editFridgeItemId, setEditFridgeItemId] = useState(null);
    const [editFridgeQuantity, setEditFridgeQuantity] = useState('');
    const [editFridgeUnit, setEditFridgeUnit] = useState('piece');
    const [editFridgeSeasoningStatus, setEditFridgeSeasoningStatus] = useState('full');
    const [editFridgeLeftoverName, setEditFridgeLeftoverName] = useState('');
    const [editFridgeLeftoverDays, setEditFridgeLeftoverDays] = useState(3);

    const isSeasoningCatalogItem = (item) => isSeasoningCategory(item?.category);
    const isSeasoningFridgeItem = (item) => isSeasoningFridgeItemLib(item, catalogItems);
    const isLeftoverFridgeItem = (item) => FB.isLeftoverFridgeItem(item);
    const getCatalogItem = (catalogItemId) => catalogItems.find(item => item.id === catalogItemId);
    const getFridgeItemCategory = (item) => {
        if (isLeftoverFridgeItem(item)) return 'leftovers';
        return getCatalogItem(item.catalogItemId)?.category || 'other';
    };
    const getCatalogItemCategory = (item) => item.category || 'other';

    const getSeasoningDraftDefaults = (item) => ({
        quantity: 1, unit: 'piece', seasoningStatus: item.defaultStatus || 'full'
    });
    const getExpirationDraftDefaults = (item) => ({
        quantity: getDefaultCatalogQuantity(item),
        unit: getDefaultCatalogUnit(item),
        expirationValue: item.expirationDays,
        expirationUnit: 'days'
    });

    const filteredCatalogItems = catalogItems.filter(item => {
        const query = groceryStoreSearch.trim().toLowerCase();
        if (!query) return true;
        const name = item.name.toLowerCase();
        const category = (item.category ? formatCategory(item.category) : 'uncategorized').toLowerCase();
        return name.includes(query) || category.includes(query);
    });

    const filteredFridgeItems = items.filter(item => {
        const query = fridgeSearch.trim().toLowerCase();
        if (!query) return true;
        const name = item.name.toLowerCase();
        const category = formatCategory(getFridgeItemCategory(item)).toLowerCase();
        return name.includes(query) || category.includes(query);
    });

    const groupedCatalogItems = groupItemsByCategory(filteredCatalogItems, getCatalogItemCategory);
    const fridgeItemGroups = buildFridgeItemGroups(filteredFridgeItems, fridgeSort, catalogItems, getFridgeItemCategory);
    const editingFridgeItem = editFridgeItemId != null
        ? items.find(item => item.id === editFridgeItemId) ?? null
        : null;

    const getCatalogDraft = (item) => catalogDrafts[item.id] || (
        isSeasoningCatalogItem(item) ? getSeasoningDraftDefaults(item) : getExpirationDraftDefaults(item)
    );

    const updateCatalogDraft = (item, updates) => {
        setCatalogDrafts(prev => ({
            ...prev,
            [item.id]: {
                ...(prev[item.id] || (isSeasoningCatalogItem(item)
                    ? getSeasoningDraftDefaults(item)
                    : getExpirationDraftDefaults(item))),
                ...updates
            }
        }));
    };

    const adjustCatalogDraftField = (item, field, delta) => {
        setCatalogDrafts(prev => {
            const current = prev[item.id] || (isSeasoningCatalogItem(item)
                ? getSeasoningDraftDefaults(item)
                : getExpirationDraftDefaults(item));
            return {
                ...prev,
                [item.id]: { ...current, [field]: adjustDays(current[field], delta) }
            };
        });
    };

    useEffect(() => {
        if (editRecipeCaloriesTouched || editingRecipeId === null) return;
        const ingredients = serializeDraftIngredients(editDraftIngredients, catalogItems);
        const estimate = estimateCaloriesFromIngredients(ingredients, catalogItems);
        setEditRecipeCalories(estimate != null ? String(estimate) : '');
    }, [editDraftIngredients, catalogItems, editRecipeCaloriesTouched, editingRecipeId]);

    useEffect(() => {
        localStorage.setItem('fridgeCatalog', JSON.stringify(catalogItems));
    }, [catalogItems]);
    useEffect(() => {
        localStorage.setItem('fridgeItems', JSON.stringify(items));
    }, [items]);
    useEffect(() => {
        localStorage.setItem('fridgeRecipes', JSON.stringify(recipes));
    }, [recipes]);
    useEffect(() => {
        localStorage.setItem('fridgeMeals', JSON.stringify(meals));
    }, [meals]);
    useEffect(() => {
        if (!addedToFridgeItemId) return;
        const timer = setTimeout(() => setAddedToFridgeItemId(null), 2500);
        return () => clearTimeout(timer);
    }, [addedToFridgeItemId]);
    useEffect(() => {
        if (!catalogAddSuccess) return;
        const timer = setTimeout(() => setCatalogAddSuccess(false), 2500);
        return () => clearTimeout(timer);
    }, [catalogAddSuccess]);
    useEffect(() => {
        if (!agentPromptCopied) return;
        const timer = setTimeout(() => setAgentPromptCopied(false), 2500);
        return () => clearTimeout(timer);
    }, [agentPromptCopied]);
    useEffect(() => {
        if (!haulImportSuccess) return;
        const timer = setTimeout(() => setHaulImportSuccess(false), 2500);
        return () => clearTimeout(timer);
    }, [haulImportSuccess]);
    useEffect(() => {
        if (!recipeImportSuccess) return;
        const timer = setTimeout(() => setRecipeImportSuccess(false), 2500);
        return () => clearTimeout(timer);
    }, [recipeImportSuccess]);
    useEffect(() => {
        if (!mealImportSuccess) return;
        const timer = setTimeout(() => setMealImportSuccess(false), 2500);
        return () => clearTimeout(timer);
    }, [mealImportSuccess]);
    useEffect(() => {
        localStorage.setItem('fridgeActiveTab', activeTab);
    }, [activeTab]);
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('fridgeTheme', theme);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', FB.getFridgeThemeColor(theme));
    }, [theme]);

    const setThemeId = (themeId) => {
        if (FB.FRIDGE_THEMES.includes(themeId)) setTheme(themeId);
    };

    const selectClassicTheme = () => {
        setTheme(prev => FB.isClassicFridgeTheme(prev) ? prev : 'classic-light');
    };

    const toggleClassicMode = () => {
        setTheme(prev => (prev === 'classic-dark' ? 'classic-light' : 'classic-dark'));
    };

    const addCatalogItem = () => {
        if (!catalogName.trim() || !catalogCategory) return;
        const newItem = { id: Date.now(), name: catalogName.trim(), category: catalogCategory, defaultUnit: 'piece' };
        if (isSeasoningCategory(catalogCategory)) {
            newItem.defaultStatus = 'full';
        } else {
            newItem.defaultUnit = catalogDefaultUnit;
            newItem.expirationDays = Math.max(1, Number(catalogExpirationDays) || 1);
            newItem.defaultQuantity = 1;
        }
        setCatalogItems([...catalogItems, newItem]);
        closeAddCatalogModal();
        setCatalogAddSuccess(true);
    };

    const openAddCatalogModal = () => {
        setCatalogName('');
        setCatalogCategory('meat');
        setCatalogDefaultUnit('piece');
        setCatalogExpirationDays(1);
        setAddCatalogModalOpen(true);
    };

    const closeAddCatalogModal = () => {
        setAddCatalogModalOpen(false);
        setCatalogName('');
        setCatalogCategory('meat');
        setCatalogDefaultUnit('piece');
        setCatalogExpirationDays(1);
    };

    const removeCatalogItem = (id) => {
        setCatalogItems(catalogItems.filter(item => item.id !== id));
        setCatalogDrafts(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const openEditCatalogModal = (item) => {
        setEditingCatalogItemId(item.id);
        setEditCatalogName(item.name);
        setEditCatalogCategory(item.category || '');
        setEditCatalogExpirationDays(String(Math.max(1, item.expirationDays || 1)));
        setEditCatalogDefaultStatus(item.defaultStatus || 'full');
    };

    const closeEditCatalogModal = () => {
        setEditingCatalogItemId(null);
        setEditCatalogName('');
        setEditCatalogCategory('');
        setEditCatalogExpirationDays('');
        setEditCatalogDefaultStatus('full');
    };

    const saveCatalogItemEdit = () => {
        if (!editingCatalogItemId || !editCatalogName.trim() || !editCatalogCategory) return;
        setCatalogItems(catalogItems.map(item => {
            if (item.id !== editingCatalogItemId) return item;
            const updated = {
                ...item,
                name: editCatalogName.trim(),
                category: editCatalogCategory,
                defaultUnit: 'piece'
            };
            if (isSeasoningCategory(editCatalogCategory)) {
                updated.defaultStatus = editCatalogDefaultStatus;
                delete updated.expirationDays;
                delete updated.caloriesPerDefault;
            } else {
                updated.defaultUnit = item.defaultUnit || 'oz';
                updated.expirationDays = Number(editCatalogExpirationDays);
                updated.defaultQuantity = item.defaultQuantity ?? 1;
                delete updated.defaultStatus;
            }
            return updated;
        }));
        closeEditCatalogModal();
        setCatalogDrafts(prev => {
            const next = { ...prev };
            delete next[editingCatalogItemId];
            return next;
        });
    };

    const deleteCatalogItemFromModal = () => {
        if (!editingCatalogItemId) return;
        removeCatalogItem(editingCatalogItemId);
        closeEditCatalogModal();
        setCatalogDrafts(prev => {
            const next = { ...prev };
            delete next[editingCatalogItemId];
            return next;
        });
    };

    const addCatalogItemToFridge = (catalogItem, quantity = null, unit = '', expirationValue = null, expirationUnit = 'days', seasoningStatus = null) => {
        if (!catalogItem) return;
        if (isSeasoningCatalogItem(catalogItem)) {
            setItems([...items, {
                id: Date.now(),
                catalogItemId: catalogItem.id,
                name: catalogItem.name,
                seasoningStatus: seasoningStatus || catalogItem.defaultStatus || 'full'
            }]);
            return;
        }
        setItems([...items, {
            id: Date.now(),
            catalogItemId: catalogItem.id,
            name: catalogItem.name,
            expiry: addExpirationFromToday(expirationValue ?? catalogItem.expirationDays, expirationUnit),
            ...(quantity != null && quantity !== '' && unit ? { quantity: Number(quantity), unit } : {})
        }]);
    };

    const performAddFromCatalogRow = (item) => {
        const draft = getCatalogDraft(item);
        if (!draft.unit && !isSeasoningCatalogItem(item)) return;
        if (isSeasoningCatalogItem(item)) {
            addCatalogItemToFridge(item, draft.quantity, 'piece', null, 'days', draft.seasoningStatus);
        } else {
            addCatalogItemToFridge(item, draft.quantity, draft.unit, draft.expirationValue, draft.expirationUnit);
        }
        setAddedToFridgeItemId(item.id);
    };

    const addFromCatalogRow = (item) => {
        const draft = getCatalogDraft(item);
        if (!draft.unit && !isSeasoningCatalogItem(item)) return;

        const existingAmount = formatFridgeExistingAmount(item.id, items, catalogItems);
        if (existingAmount != null) {
            setDuplicateFridgeConfirm({
                catalogItem: item,
                existingAmount,
                expirySummary: getFridgeExistingExpirySummary(item.id, items, catalogItems, isSeasoningFridgeItem)
            });
            return;
        }
        performAddFromCatalogRow(item);
    };

    const confirmDuplicateFridgeAdd = () => {
        if (!duplicateFridgeConfirm) return;
        performAddFromCatalogRow(duplicateFridgeConfirm.catalogItem);
        setDuplicateFridgeConfirm(null);
    };

    const cancelDuplicateFridgeAdd = () => setDuplicateFridgeConfirm(null);

    const copyAgentPrompt = async () => {
        const prompt = buildClaudeAgentPrompt(catalogItems);
        try {
            await navigator.clipboard.writeText(prompt);
            setAgentPromptCopied(true);
        } catch {
            setAgentPromptCopied(false);
        }
    };

    const previewHaulImport = () => {
        const parsed = parseHaulImportText(haulImportPaste);
        if (parsed.error) {
            setHaulImportError(parsed.error);
            setHaulImportPreview(null);
            return;
        }
        setHaulImportError('');
        setHaulImportPreview(resolveHaulImportItems(parsed.items, catalogItems));
    };

    const createCatalogItemFromImportRow = (row, nextId) => {
        const category = CATEGORIES.includes(row.suggestedCategory) ? row.suggestedCategory : 'other';
        const catalogItem = {
            id: nextId,
            name: row.name,
            category,
            defaultUnit: row.unit || 'piece'
        };
        if (isSeasoningCategory(category)) {
            catalogItem.defaultStatus = 'full';
        } else {
            catalogItem.expirationDays = 7;
        }
        return catalogItem;
    };

    const executeHaulImport = (preview) => {
        const toImport = preview.filter(row =>
            row.status === 'ready' || (row.status === 'unmatched' && row.createInCatalog)
        );
        if (toImport.length === 0) return;

        let nextCatalog = [...catalogItems];
        const newFridgeItems = [];
        const catalogByName = new Map();
        let nextId = Date.now();

        toImport.forEach(row => {
            let catalogItem = row.catalogItem;
            if (!catalogItem && row.createInCatalog) {
                const normalizedName = row.name.toLowerCase();
                if (catalogByName.has(normalizedName)) {
                    catalogItem = catalogByName.get(normalizedName);
                } else {
                    catalogItem = createCatalogItemFromImportRow(row, nextId++);
                    catalogByName.set(normalizedName, catalogItem);
                    nextCatalog = [...nextCatalog, catalogItem];
                }
            }
            if (!catalogItem) return;

            if (isSeasoningCatalogItem(catalogItem)) {
                newFridgeItems.push({
                    id: nextId++,
                    catalogItemId: catalogItem.id,
                    name: catalogItem.name,
                    seasoningStatus: catalogItem.defaultStatus || 'full'
                });
            } else {
                newFridgeItems.push({
                    id: nextId++,
                    catalogItemId: catalogItem.id,
                    name: catalogItem.name,
                    expiry: addExpirationFromToday(catalogItem.expirationDays, 'days'),
                    quantity: row.quantity,
                    unit: row.unit
                });
            }
        });

        if (newFridgeItems.length === 0) return;
        setCatalogItems(nextCatalog);
        setItems(prev => [...prev, ...newFridgeItems]);
        clearHaulImport();
        setHaulImportSuccess(true);
    };

    const clearHaulImport = () => {
        setHaulImportPaste('');
        setHaulImportPreview(null);
        setHaulImportError('');
    };

    const confirmHaulImport = () => {
        if (!haulImportPreview?.length) return;
        const hasImportable = haulImportPreview.some(row => row.status === 'ready' || row.status === 'unmatched');
        if (!hasImportable) return;

        const unmatched = haulImportPreview.filter(row => row.status === 'unmatched');
        if (unmatched.length > 0) {
            setImportUnmatchedConfirm({
                type: 'haul',
                title: 'Add items to grocery store?',
                description: 'Some items from Claude are not in your grocery store yet. Choose which to add before importing to the fridge.',
                items: unmatched.map(row => ({
                    key: String(row.index),
                    name: row.name,
                    quantity: row.quantity,
                    unit: row.unit,
                    addToCatalog: true,
                    category: CATEGORIES.includes(row.suggestedCategory) ? row.suggestedCategory : 'other'
                }))
            });
            return;
        }
        executeHaulImport(haulImportPreview);
    };

    const applyUnmatchedChoicesToHaulPreview = (choices) => {
        const choicesByKey = Object.fromEntries(choices.map(choice => [choice.key, choice]));
        return haulImportPreview.map(row => {
            if (row.status !== 'unmatched') return row;
            const choice = choicesByKey[String(row.index)];
            if (!choice) return row;
            return {
                ...row,
                createInCatalog: choice.addToCatalog,
                suggestedCategory: choice.category
            };
        });
    };

    const applyUnmatchedChoicesToRecipePreview = (choices) => {
        const choicesByKey = Object.fromEntries(choices.map(choice => [choice.key, choice]));
        return recipeImportPreview.map(recipe => ({
            ...recipe,
            ingredients: recipe.ingredients.map(row => {
                if (row.status !== 'unmatched') return row;
                const choice = choicesByKey[row.name.toLowerCase()];
                if (!choice) return row;
                return {
                    ...row,
                    createInCatalog: choice.addToCatalog,
                    suggestedCategory: choice.category
                };
            })
        }));
    };

    const applyUnmatchedChoicesToMealPreview = (choices) => {
        const choicesByKey = Object.fromEntries(choices.map(choice => [choice.key, choice]));
        return mealImportPreview.map(meal => ({
            ...meal,
            ingredients: meal.ingredients.map(row => {
                if (row.status !== 'unmatched') return row;
                const choice = choicesByKey[row.name.toLowerCase()];
                if (!choice) return row;
                return {
                    ...row,
                    createInCatalog: choice.addToCatalog,
                    suggestedCategory: choice.category
                };
            })
        }));
    };

    const confirmImportUnmatchedModal = (choices) => {
        if (!importUnmatchedConfirm) return;
        if (importUnmatchedConfirm.type === 'haul') {
            const updatedPreview = applyUnmatchedChoicesToHaulPreview(choices);
            setHaulImportPreview(updatedPreview);
            executeHaulImport(updatedPreview);
        } else if (importUnmatchedConfirm.type === 'recipe') {
            const updatedPreview = applyUnmatchedChoicesToRecipePreview(choices);
            setRecipeImportPreview(updatedPreview);
            executeRecipeImport(updatedPreview);
        } else if (importUnmatchedConfirm.type === 'meal') {
            const updatedPreview = applyUnmatchedChoicesToMealPreview(choices);
            setMealImportPreview(updatedPreview);
            executeMealImport(updatedPreview);
        }
        setImportUnmatchedConfirm(null);
    };

    const cancelImportUnmatchedModal = () => setImportUnmatchedConfirm(null);

    const previewRecipeImport = () => {
        const parsed = parseRecipeImportText(recipeImportPaste);
        if (parsed.error) {
            setRecipeImportError(parsed.error);
            setRecipeImportPreview(null);
            return;
        }
        setRecipeImportError('');
        setRecipeImportPreview(resolveRecipeImportRecipes(parsed.recipes, catalogItems));
    };

    const clearRecipeImport = () => {
        setRecipeImportPaste('');
        setRecipeImportPreview(null);
        setRecipeImportError('');
    };

    const executeRecipeImport = (preview) => {
        let nextCatalog = [...catalogItems];
        const newRecipes = [];
        const catalogByName = new Map();
        let nextId = Date.now();

        preview.forEach(recipePreview => {
            if (recipePreview.status === 'invalid') return;

            const resolvedIngredients = [];
            recipePreview.ingredients.forEach(row => {
                if (row.status === 'invalid') return;
                if (row.status === 'unmatched' && !row.createInCatalog) return;

                let catalogItem = row.catalogItem;
                if (!catalogItem && row.createInCatalog) {
                    const normalizedName = row.name.toLowerCase();
                    if (catalogByName.has(normalizedName)) {
                        catalogItem = catalogByName.get(normalizedName);
                    } else {
                        catalogItem = createCatalogItemFromImportRow(row, nextId++);
                        catalogByName.set(normalizedName, catalogItem);
                        nextCatalog = [...nextCatalog, catalogItem];
                    }
                }
                if (!catalogItem) return;

                resolvedIngredients.push({
                    catalogItemId: catalogItem.id,
                    name: catalogItem.name,
                    quantity: row.quantity,
                    unit: row.unit
                });
            });

            if (resolvedIngredients.length > 0) {
                newRecipes.push({
                    id: nextId++,
                    name: recipePreview.name,
                    ingredients: resolvedIngredients
                });
            }
        });

        if (newRecipes.length === 0) return;
        setCatalogItems(nextCatalog);
        setRecipes(prev => [...prev, ...newRecipes]);
        clearRecipeImport();
        setRecipeImportSuccess(true);
    };

    const confirmRecipeImport = () => {
        if (!recipeImportPreview?.length) return;

        const unmatched = [];
        recipeImportPreview.forEach(recipe => {
            if (recipe.status === 'invalid') return;
            recipe.ingredients.forEach(row => {
                if (row.status === 'unmatched') {
                    unmatched.push({
                        key: `${recipe.recipeIndex}-${row.index}`,
                        name: row.name,
                        quantity: row.quantity,
                        unit: row.unit,
                        recipeName: recipe.name,
                        addToCatalog: true,
                        category: CATEGORIES.includes(row.suggestedCategory) ? row.suggestedCategory : 'other'
                    });
                }
            });
        });

        const hasImportable = recipeImportPreview.some(recipe =>
            recipe.status !== 'invalid' &&
            recipe.ingredients.some(row => row.status === 'ready' || row.status === 'unmatched')
        );
        if (!hasImportable) return;

        if (unmatched.length > 0) {
            const deduped = new Map();
            unmatched.forEach(item => {
                const key = item.name.toLowerCase();
                if (!deduped.has(key)) {
                    deduped.set(key, { ...item, key });
                } else {
                    const existing = deduped.get(key);
                    if (item.recipeName && !existing.recipeName.includes(item.recipeName)) {
                        existing.recipeName = existing.recipeName
                            ? `${existing.recipeName}, ${item.recipeName}`
                            : item.recipeName;
                    }
                }
            });
            setImportUnmatchedConfirm({
                type: 'recipe',
                title: 'Add ingredients to grocery store?',
                description: 'Some ingredients from Claude are not in your grocery store yet. Choose which to add before importing the recipes.',
                items: Array.from(deduped.values())
            });
            return;
        }
        executeRecipeImport(recipeImportPreview);
    };

    const finalizeMeals = (mealEntries, { removeFromFridge, addToRecipes }, catalogSnapshot = catalogItems) => {
        if (!mealEntries.length) return;
        let nextId = Date.now();
        const newMeals = mealEntries.map(entry => ({
            id: nextId++,
            name: entry.name,
            ingredients: entry.ingredients,
            loggedAt: new Date().toISOString()
        }));
        setMeals(prev => [...prev, ...newMeals]);
        if (addToRecipes) {
            setRecipes(prev => [
                ...prev,
                ...mealEntries.map(entry => ({
                    id: nextId++,
                    name: entry.name,
                    ingredients: entry.ingredients
                }))
            ]);
        }
        if (removeFromFridge) {
            const allIngredients = mergeIngredients(mealEntries.map(entry => entry.ingredients));
            setItems(prev => deductMealFromFridge(prev, allIngredients, catalogSnapshot));
        }
    };

    const resolveMealPreviewEntry = (mealPreview, nextCatalogRef, catalogByName, nextIdRef) => {
        if (mealPreview.status === 'invalid') return null;
        const resolvedIngredients = [];
        mealPreview.ingredients.forEach(row => {
            if (row.status === 'invalid') return;
            if (row.status === 'unmatched' && !row.createInCatalog) return;

            let catalogItem = row.catalogItem;
            if (!catalogItem && row.createInCatalog) {
                const normalizedName = row.name.toLowerCase();
                if (catalogByName.has(normalizedName)) {
                    catalogItem = catalogByName.get(normalizedName);
                } else {
                    catalogItem = createCatalogItemFromImportRow(row, nextIdRef.value++);
                    catalogByName.set(normalizedName, catalogItem);
                    nextCatalogRef.current = [...nextCatalogRef.current, catalogItem];
                }
            }
            if (!catalogItem) return;

            resolvedIngredients.push({
                catalogItemId: catalogItem.id,
                name: catalogItem.name,
                quantity: row.quantity,
                unit: row.unit
            });
        });
        if (resolvedIngredients.length === 0) return null;
        return { name: mealPreview.name, ingredients: resolvedIngredients };
    };

    const executeMealImport = (preview) => {
        const nextCatalogRef = { current: [...catalogItems] };
        const catalogByName = new Map();
        const nextIdRef = { value: Date.now() };
        const mealEntries = [];

        preview.forEach(mealPreview => {
            const entry = resolveMealPreviewEntry(mealPreview, nextCatalogRef, catalogByName, nextIdRef);
            if (entry) mealEntries.push(entry);
        });

        if (mealEntries.length === 0) return;
        setCatalogItems(nextCatalogRef.current);
        finalizeMeals(mealEntries, {
            removeFromFridge: mealImportRemoveFromFridge,
            addToRecipes: mealImportAddToRecipes
        }, nextCatalogRef.current);
        clearMealImport();
        setMealImportSuccess(true);
    };

    const previewMealImport = () => {
        const parsed = parseMealImportText(mealImportPaste);
        if (parsed.error) {
            setMealImportError(parsed.error);
            setMealImportPreview(null);
            return;
        }
        setMealImportError('');
        setMealImportPreview(resolveMealImportMeals(parsed.meals, catalogItems));
    };

    const clearMealImport = () => {
        setMealImportPaste('');
        setMealImportPreview(null);
        setMealImportError('');
    };

    const confirmMealImport = () => {
        if (!mealImportPreview?.length) return;

        const unmatched = [];
        mealImportPreview.forEach(meal => {
            if (meal.status === 'invalid') return;
            meal.ingredients.forEach(row => {
                if (row.status === 'unmatched') {
                    unmatched.push({
                        key: `${meal.recipeIndex}-${row.index}`,
                        name: row.name,
                        quantity: row.quantity,
                        unit: row.unit,
                        recipeName: meal.name,
                        addToCatalog: true,
                        category: CATEGORIES.includes(row.suggestedCategory) ? row.suggestedCategory : 'other'
                    });
                }
            });
        });

        const hasImportable = mealImportPreview.some(meal =>
            meal.status !== 'invalid' &&
            meal.ingredients.some(row => row.status === 'ready' || row.status === 'unmatched')
        );
        if (!hasImportable) return;

        if (unmatched.length > 0) {
            const deduped = new Map();
            unmatched.forEach(item => {
                const key = item.name.toLowerCase();
                if (!deduped.has(key)) {
                    deduped.set(key, { ...item, key });
                } else {
                    const existing = deduped.get(key);
                    if (item.recipeName && !existing.recipeName?.includes(item.recipeName)) {
                        existing.recipeName = existing.recipeName
                            ? `${existing.recipeName}, ${item.recipeName}`
                            : item.recipeName;
                    }
                }
            });
            setImportUnmatchedConfirm({
                type: 'meal',
                title: 'Add ingredients to grocery store?',
                description: 'Some ingredients from Claude are not in your grocery store yet. Choose which to add before logging the meal.',
                items: Array.from(deduped.values())
            });
            return;
        }
        executeMealImport(mealImportPreview);
    };

    const addMealManual = () => {
        const ingredients = serializeDraftIngredients(mealDraftIngredients, catalogItems);
        if (!mealName.trim() || ingredients.length === 0) return;
        finalizeMeals([{
            name: mealName.trim(),
            ingredients
        }], {
            removeFromFridge: mealManualRemoveFromFridge,
            addToRecipes: false
        });
        setMealName('');
        setMealDraftIngredients([]);
    };

    const addMealIngredientRow = () => addIngredientRowToList(setMealDraftIngredients);

    const setMealRecipeSelection = (recipeId) => {
        if (!recipeId) {
            setSelectedMealRecipeIds([]);
            return;
        }
        setSelectedMealRecipeIds([Number(recipeId)]);
    };

    const addMealFromRecipes = () => {
        const selectedRecipes = recipes.filter(recipe => selectedMealRecipeIds.includes(recipe.id));
        if (selectedRecipes.length === 0) return;
        const ingredients = mergeIngredients(selectedRecipes.map(recipe => recipe.ingredients || []));
        if (ingredients.length === 0) return;
        const defaultName = selectedRecipes.length === 1
            ? selectedRecipes[0].name
            : selectedRecipes.map(recipe => recipe.name).join(' + ');
        const name = mealFromRecipesName.trim() || defaultName;
        finalizeMeals([{
            name,
            ingredients
        }], {
            removeFromFridge: mealFromRecipesRemoveFromFridge,
            addToRecipes: false
        });
        setMealFromRecipesName('');
        setSelectedMealRecipeIds([]);
    };

    const removeMeal = (id) => setMeals(meals.filter(meal => meal.id !== id));

    const removeMealIngredient = (mealId, ingredientIndex) => {
        setMeals(prev => prev.flatMap(meal => {
            if (meal.id !== mealId) return [meal];
            const nextIngredients = meal.ingredients.filter((_, index) => index !== ingredientIndex);
            if (nextIngredients.length === 0) return [];
            return [{ ...meal, ingredients: nextIngredients }];
        }));
    };

    const updateMealCalories = (mealId, value) => {
        setMeals(prev => prev.map(meal => {
            if (meal.id !== mealId) return meal;
            if (value === '') {
                const next = { ...meal };
                delete next.calories;
                return next;
            }
            const calories = parseCalories(value);
            return calories != null ? { ...meal, calories } : meal;
        }));
    };

    const updateRecipeCalories = (recipeId, value) => {
        setRecipes(prev => prev.map(recipe => {
            if (recipe.id !== recipeId) return recipe;
            if (value === '') {
                const next = { ...recipe };
                delete next.calories;
                return next;
            }
            const calories = parseCalories(value);
            return calories != null ? { ...recipe, calories } : recipe;
        }));
    };

    const removeItem = (id) => setItems(items.filter(item => item.id !== id));

    const openAddLeftoverModal = () => {
        setLeftoverName('');
        setLeftoverExpirationDays(3);
        setAddLeftoverModalOpen(true);
    };

    const closeAddLeftoverModal = () => {
        setAddLeftoverModalOpen(false);
        setLeftoverName('');
        setLeftoverExpirationDays(3);
    };

    const adjustLeftoverExpirationDays = (delta) => {
        setLeftoverExpirationDays(prev => adjustDays(prev === '' ? 1 : prev, delta));
    };

    const addLeftover = () => {
        if (!leftoverName.trim()) return;
        setItems([...items, {
            id: Date.now(),
            name: leftoverName.trim(),
            category: 'leftovers',
            expiry: addExpirationFromToday(Math.max(1, Number(leftoverExpirationDays) || 1), 'days')
        }]);
        closeAddLeftoverModal();
    };

    const openEditFridgeItemModal = (item) => {
        setEditFridgeItemId(item.id);
        if (isLeftoverFridgeItem(item)) {
            setEditFridgeLeftoverName(item.name);
            setEditFridgeLeftoverDays(Math.max(1, getDaysUntilExpiry(item.expiry)));
            return;
        }
        if (isSeasoningFridgeItem(item)) {
            setEditFridgeSeasoningStatus(item.seasoningStatus || 'full');
            return;
        }
        setEditFridgeQuantity(String(item.quantity != null && item.quantity !== '' ? item.quantity : 1));
        setEditFridgeUnit(item.unit || 'piece');
    };

    const closeEditFridgeItemModal = () => {
        setEditFridgeItemId(null);
        setEditFridgeQuantity('');
        setEditFridgeUnit('piece');
        setEditFridgeSeasoningStatus('full');
        setEditFridgeLeftoverName('');
        setEditFridgeLeftoverDays(3);
    };

    const adjustEditFridgeQuantity = (delta) => {
        setEditFridgeQuantity(prev => String(roundIngredientQuantity(parseIngredientQuantity(prev) + delta)));
    };

    const adjustEditFridgeSeasoningStatus = (delta) => {
        setEditFridgeSeasoningStatus(prev => adjustSeasoningStatus(prev, delta));
    };

    const adjustEditFridgeLeftoverDays = (delta) => {
        setEditFridgeLeftoverDays(prev => adjustDays(prev === '' ? 1 : prev, delta));
    };

    const saveFridgeItemEdit = () => {
        if (editFridgeItemId == null) return;
        setItems(prev => prev.map(item => {
            if (item.id !== editFridgeItemId) return item;
            if (isLeftoverFridgeItem(item)) {
                if (!editFridgeLeftoverName.trim()) return item;
                return {
                    ...item,
                    name: editFridgeLeftoverName.trim(),
                    expiry: addExpirationFromToday(Math.max(1, Number(editFridgeLeftoverDays) || 1), 'days')
                };
            }
            if (isSeasoningFridgeItem(item)) {
                return { ...item, seasoningStatus: editFridgeSeasoningStatus };
            }
            return {
                ...item,
                quantity: roundIngredientQuantity(editFridgeQuantity),
                unit: editFridgeUnit || 'piece'
            };
        }));
        closeEditFridgeItemModal();
    };

    const adjustCatalogExpirationDays = (delta) => {
        setCatalogExpirationDays(prev => adjustDays(prev === '' ? 1 : prev, delta));
    };

    const adjustEditExpirationDays = (delta) => {
        setEditCatalogExpirationDays(prev => adjustDays(prev, delta));
    };

    const adjustCatalogItemCalories = (catalogItemId, delta) => {
        setCatalogItems(prev => prev.map(item => {
            if (item.id !== catalogItemId) return item;
            const current = item.caloriesPerDefault ?? 0;
            return { ...item, caloriesPerDefault: adjustCalories(current, delta) };
        }));
    };

    const adjustEditRecipeCalories = (delta) => {
        setEditRecipeCaloriesTouched(true);
        setEditRecipeCalories(prev => String(adjustCalories(prev, delta)));
    };

    const addRecipe = () => {
        const ingredients = serializeDraftIngredients(draftIngredients, catalogItems);
        if (recipeName.trim() && ingredients.length > 0) {
            setRecipes([...recipes, {
                id: Date.now(),
                name: recipeName.trim(),
                ingredients
            }]);
            setRecipeName('');
            setDraftIngredients([]);
        }
    };

    const addIngredientRowToList = (setIngredients) => {
        setIngredients(prev => [...prev, emptyIngredient()]);
    };

    const updateIngredientInList = (setIngredients, index, field, value) => {
        setIngredients(prev => prev.map((ingredient, i) => {
            if (i !== index) return ingredient;
            if (field === 'catalogItemId') {
                const catalogItem = value ? catalogItems.find(c => String(c.id) === value) : null;
                if (!catalogItem) {
                    return { ...ingredient, catalogItemId: value, name: '' };
                }
                const isFirstSelection = !ingredient.catalogItemId;
                const isPristineRow = parseIngredientQuantity(ingredient.quantity) === 1
                    && (ingredient.unit || 'piece') === 'piece';
                return {
                    ...ingredient,
                    catalogItemId: value,
                    name: catalogItem.name,
                    ...(isFirstSelection && isPristineRow ? {
                        unit: catalogItem.defaultUnit || 'piece',
                        quantity: getDefaultCatalogQuantity(catalogItem)
                    } : {})
                };
            }
            return { ...ingredient, [field]: value };
        }));
    };

    const adjustIngredientQuantityInList = (setIngredients, index, delta) => {
        setIngredients(prev => prev.map((ingredient, i) => {
            if (i !== index) return ingredient;
            const current = parseIngredientQuantity(ingredient.quantity);
            return { ...ingredient, quantity: roundIngredientQuantity(current + delta) };
        }));
    };

    const removeIngredientRowFromList = (setIngredients, index) => {
        setIngredients(prev => prev.filter((_, i) => i !== index));
    };

    const addIngredientRow = () => addIngredientRowToList(setDraftIngredients);

    const openEditRecipeModal = (recipe) => {
        const displayCalories = FB.getRecipeDisplayCalories(recipe, catalogItems);
        setEditingRecipeId(recipe.id);
        setEditRecipeName(recipe.name);
        setEditRecipeCalories(displayCalories != null ? String(displayCalories) : '');
        setEditRecipeCaloriesTouched(parseCalories(recipe.calories) != null);
        setEditDraftIngredients(recipe.ingredients.map(ingredient => ({
            catalogItemId: ingredient.catalogItemId ? String(ingredient.catalogItemId) : '',
            name: ingredient.name || '',
            quantity: ingredient.quantity ?? 1,
            unit: ingredient.unit || 'piece'
        })));
    };

    const closeEditRecipeModal = () => {
        setEditingRecipeId(null);
        setEditRecipeName('');
        setEditDraftIngredients([]);
        setEditRecipeCalories('');
        setEditRecipeCaloriesTouched(false);
    };

    const saveRecipeEdit = () => {
        if (!editingRecipeId || !editRecipeName.trim()) return;
        const ingredients = serializeDraftIngredients(editDraftIngredients, catalogItems);
        if (ingredients.length === 0) return;
        const calories = resolveCalories(editRecipeCalories, ingredients, catalogItems);
        setRecipes(recipes.map(recipe =>
            recipe.id === editingRecipeId
                ? {
                    ...recipe,
                    name: editRecipeName.trim(),
                    ingredients,
                    ...(calories != null ? { calories } : { calories: undefined })
                }
                : recipe
        ));
        closeEditRecipeModal();
    };

    const deleteRecipeFromModal = () => {
        if (!editingRecipeId) return;
        setRecipes(recipes.filter(recipe => recipe.id !== editingRecipeId));
        closeEditRecipeModal();
    };

    const toggleRecipeShowQuantities = (recipeId) => {
        setRecipes(recipes.map(recipe =>
            recipe.id === recipeId ? { ...recipe, showQuantities: !recipe.showQuantities } : recipe
        ));
    };

    const openViewRecipeModal = (recipeId) => setViewingRecipeId(recipeId);
    const closeViewRecipeModal = () => setViewingRecipeId(null);
    const viewingRecipe = viewingRecipeId != null
        ? recipes.find(recipe => recipe.id === viewingRecipeId) || null
        : null;

    const { readyToMake: readyToMakeRecipes, almostThere: almostThereRecipes } = classifyRecipesForHome(
        recipes,
        items,
        getDaysUntilExpiry,
        isSeasoningFridgeItem
    );

    const expiringItems = items.filter(item => {
        if (isSeasoningFridgeItem(item) || isLeftoverFridgeItem(item)) return false;
        const days = getDaysUntilExpiry(item.expiry);
        return days <= 3 && days >= 0;
    }).sort((a, b) => getDaysUntilExpiry(a.expiry) - getDaysUntilExpiry(b.expiry));

    const expiredItems = items.filter(item =>
        !isSeasoningFridgeItem(item) &&
        !isLeftoverFridgeItem(item) &&
        getDaysUntilExpiry(item.expiry) < 0
    );

    const leftoverItems = items.filter(isLeftoverFridgeItem)
        .sort((a, b) => getDaysUntilExpiry(a.expiry) - getDaysUntilExpiry(b.expiry));

    const lowSeasoningItems = items.filter(item =>
        isSeasoningFridgeItem(item) &&
        (item.seasoningStatus === 'running-low' || item.seasoningStatus === 'almost-empty')
    ).sort((a, b) => FB.getSeasoningStatusSortOrder(a.seasoningStatus) - FB.getSeasoningStatusSortOrder(b.seasoningStatus));

    return {
        catalogItems, items, recipes, activeTab, setActiveTab,
        groceryStoreSearch, setGroceryStoreSearch,
        fridgeSearch, setFridgeSearch,
        fridgeSort, setFridgeSort,
        catalogAddSuccess, addCatalogModalOpen,
        catalogName, setCatalogName,
        catalogCategory, setCatalogCategory,
        catalogDefaultUnit, setCatalogDefaultUnit,
        catalogExpirationDays, setCatalogExpirationDays,
        editingCatalogItemId,
        editCatalogName, setEditCatalogName,
        editCatalogCategory, setEditCatalogCategory,
        editCatalogExpirationDays,
        editCatalogDefaultStatus, setEditCatalogDefaultStatus,
        recipeName, setRecipeName,
        draftIngredients, setDraftIngredients,
        editingRecipeId,
        editRecipeName, setEditRecipeName,
        editDraftIngredients, setEditDraftIngredients,
        editRecipeCalories, setEditRecipeCalories: (value) => {
            setEditRecipeCaloriesTouched(true);
            setEditRecipeCalories(value);
        },
        groupedCatalogItems, filteredFridgeItems, fridgeItemGroups,
        expiringItems, expiredItems, leftoverItems, lowSeasoningItems,
        readyToMakeRecipes, almostThereRecipes,
        viewingRecipeId, viewingRecipe,
        duplicateFridgeConfirm,
        importUnmatchedConfirm,
        addedToFridgeItemId,
        agentPromptCopied, copyAgentPrompt,
        haulImportPaste, setHaulImportPaste,
        haulImportPreview, haulImportError,
        haulImportSuccess,
        previewHaulImport, confirmHaulImport, clearHaulImport,
        recipeImportPaste, setRecipeImportPaste,
        recipeImportPreview, recipeImportError,
        recipeImportSuccess,
        previewRecipeImport, confirmRecipeImport, clearRecipeImport,
        confirmImportUnmatchedModal, cancelImportUnmatchedModal,
        meals, mealName, setMealName,
        mealDraftIngredients, setMealDraftIngredients,
        mealManualRemoveFromFridge, setMealManualRemoveFromFridge,
        mealFromRecipesName, setMealFromRecipesName,
        selectedMealRecipeIds, setMealRecipeSelection,
        mealFromRecipesRemoveFromFridge, setMealFromRecipesRemoveFromFridge,
        mealImportPaste, setMealImportPaste,
        mealImportPreview, mealImportError,
        mealImportSuccess,
        mealImportRemoveFromFridge, setMealImportRemoveFromFridge,
        mealImportAddToRecipes, setMealImportAddToRecipes,
        previewMealImport, confirmMealImport, clearMealImport,
        addMealManual, addMealIngredientRow, addMealFromRecipes, setMealRecipeSelection, removeMeal, removeMealIngredient,
        updateMealCalories,
        getCatalogDraft, updateCatalogDraft, adjustCatalogDraftField,
        isSeasoningCatalogItem, isSeasoningFridgeItem,
        openAddCatalogModal, closeAddCatalogModal, addCatalogItem,
        openEditCatalogModal, closeEditCatalogModal, saveCatalogItemEdit, deleteCatalogItemFromModal,
        addFromCatalogRow, confirmDuplicateFridgeAdd, cancelDuplicateFridgeAdd,
        removeItem,
        openAddLeftoverModal, closeAddLeftoverModal, addLeftover,
        addLeftoverModalOpen, leftoverName, setLeftoverName,
        leftoverExpirationDays, setLeftoverExpirationDays, adjustLeftoverExpirationDays,
        editFridgeItemId, editingFridgeItem,
        editFridgeQuantity, setEditFridgeQuantity,
        editFridgeUnit, setEditFridgeUnit, adjustEditFridgeQuantity,
        editFridgeSeasoningStatus, adjustEditFridgeSeasoningStatus,
        editFridgeLeftoverName, setEditFridgeLeftoverName,
        editFridgeLeftoverDays, setEditFridgeLeftoverDays, adjustEditFridgeLeftoverDays,
        openEditFridgeItemModal, closeEditFridgeItemModal, saveFridgeItemEdit,
        isLeftoverFridgeItem,
        adjustCatalogExpirationDays, adjustEditExpirationDays,
        adjustCatalogItemCalories, adjustEditRecipeCalories,
        addRecipe, updateRecipeCalories, addIngredientRow, addIngredientRowToList,
        updateIngredientInList, adjustIngredientQuantityInList, removeIngredientRowFromList,
        openEditRecipeModal, closeEditRecipeModal, saveRecipeEdit, deleteRecipeFromModal,
        toggleRecipeShowQuantities, openViewRecipeModal, closeViewRecipeModal,
        theme, setThemeId, selectClassicTheme, toggleClassicMode,
        isClassicTheme: FB.isClassicFridgeTheme(theme)
    };
}

window.useFridgeBuddy = useFridgeBuddy;
