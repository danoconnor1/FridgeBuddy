function useFridgeBuddy() {
    const { useState, useEffect, useMemo } = React;
    const FB = window.FB;
    const {
        CATEGORIES, loadCatalogItems, formatCategory, isSeasoningCategory,
        getDefaultCatalogQuantity, adjustSeasoningStatus, addExpirationFromToday,
        emptyIngredient, toDraftIngredient, getDaysUntilExpiry, classifyRecipesForHome, formatFridgeExistingAmount,
        formatFridgeItemLabel,
        getFridgeExistingExpirySummary,
        adjustDays, buildFridgeItemGroups, groupItemsByCategory,
        isSeasoningFridgeItem: isSeasoningFridgeItemLib, usesFridgeCapacityTracking: usesFridgeCapacityTrackingLib,
        canToggleFridgeTrackingMode: canToggleFridgeTrackingModeLib, getDefaultCatalogUnit,
        serializeDraftIngredients, parseIngredientQuantity, roundIngredientQuantity,
        buildClaudeAgentPrompt, parseHaulImportText, resolveHaulImportItems,
        parseRecipeImportText, resolveRecipeImportRecipes,
        parseMealImportText, resolveMealImportMeals,
        parseExpenseImportText, resolveExpenseImportExpenses,
        emptyExpenseItem, serializeExpenseDraftItems, normalizeStoredExpense,
        loadCustomExpenseCategories, saveCustomExpenseCategories, buildCustomExpenseCategory,
        getTodayIsoDate,
        EXPENSE_CATEGORIES,
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
    const [expenses, setExpenses] = useState(() => {
        const saved = localStorage.getItem('fridgeExpenses');
        if (!saved) return [];
        return JSON.parse(saved).map(normalizeStoredExpense);
    });
    const [catalogName, setCatalogName] = useState('');
    const [catalogCategory, setCatalogCategory] = useState('meat');
    const [catalogDefaultUnit, setCatalogDefaultUnit] = useState('piece');
    const [catalogExpirationDays, setCatalogExpirationDays] = useState(1);
    const [catalogCalories, setCatalogCalories] = useState('');
    const [editingCatalogItemId, setEditingCatalogItemId] = useState(null);
    const [editCatalogName, setEditCatalogName] = useState('');
    const [editCatalogCategory, setEditCatalogCategory] = useState('');
    const [editCatalogExpirationDays, setEditCatalogExpirationDays] = useState('');
    const [editCatalogCalories, setEditCatalogCalories] = useState('');
    const [editCatalogDefaultUnit, setEditCatalogDefaultUnit] = useState('piece');
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
    const VALID_TABS = new Set(['home', 'allItems', 'fridge', 'recipes', 'meals', 'money']);
    const [activeTab, setActiveTab] = useState(() => {
        const saved = localStorage.getItem('fridgeActiveTab');
        return saved && VALID_TABS.has(saved) ? saved : 'home';
    });
    const [groceryStoreSearch, setGroceryStoreSearch] = useState('');
    const [fridgeSearch, setFridgeSearch] = useState('');
    const [fridgeSort, setFridgeSort] = useState('category');
    const [viewingRecipeId, setViewingRecipeId] = useState(null);
    const [recipeAddToFridgeRecipe, setRecipeAddToFridgeRecipe] = useState(null);
    const [recipeAddToFridgeDraft, setRecipeAddToFridgeDraft] = useState([]);
    const [duplicateFridgeConfirm, setDuplicateFridgeConfirm] = useState(null);
    const [emptyFridgeConfirmOpen, setEmptyFridgeConfirmOpen] = useState(false);
    const [haulImportPaste, setHaulImportPaste] = useState('');
    const [haulImportPreview, setHaulImportPreview] = useState(null);
    const [haulImportError, setHaulImportError] = useState('');
    const [haulImportSuccess, setHaulImportSuccess] = useState(false);
    const [agentPromptCopied, setAgentPromptCopied] = useState(false);
    const [manualGroceryListItems, setManualGroceryListItems] = useState(() => {
        const saved = localStorage.getItem('fridgeGroceryList');
        return saved ? JSON.parse(saved) : [];
    });
    const [dismissedGroceryListIds, setDismissedGroceryListIds] = useState(() => {
        const saved = localStorage.getItem('fridgeDismissedGroceryList');
        return saved ? JSON.parse(saved) : [];
    });
    const [sessionRandomGroceryItems, setSessionRandomGroceryItems] = useState(() => {
        const catalog = loadCatalogItems();
        const manual = (() => {
            try {
                const saved = localStorage.getItem('fridgeGroceryList');
                return saved ? JSON.parse(saved) : [];
            } catch {
                return [];
            }
        })();
        const excludedNames = manual.map(item => item.name);
        return FB.generateSessionRandomGroceryItems(catalog, excludedNames, 3, Date.now());
    });
    const [groceryListDraftItems, setGroceryListDraftItems] = useState([]);
    const [groceryListRecipeId, setGroceryListRecipeId] = useState('');
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
    const [expenseTitle, setExpenseTitle] = useState('');
    const [expenseDate, setExpenseDate] = useState(() => getTodayIsoDate());
    const [expenseCategory, setExpenseCategory] = useState('');
    const [expensePrice, setExpensePrice] = useState('');
    const [expenseDraftItems, setExpenseDraftItems] = useState([]);
    const [customExpenseCategories, setCustomExpenseCategories] = useState(() => loadCustomExpenseCategories());
    const [addExpenseCategoryModalOpen, setAddExpenseCategoryModalOpen] = useState(false);
    const [deleteExpenseCategoryModalOpen, setDeleteExpenseCategoryModalOpen] = useState(false);
    const [newExpenseCategoryName, setNewExpenseCategoryName] = useState('');
    const [deleteExpenseCategoryId, setDeleteExpenseCategoryId] = useState('');
    const [expenseCategoryError, setExpenseCategoryError] = useState('');
    const [deleteExpenseCategoryError, setDeleteExpenseCategoryError] = useState('');
    const [expenseImportPaste, setExpenseImportPaste] = useState('');
    const [expenseImportPreview, setExpenseImportPreview] = useState(null);
    const [expenseImportError, setExpenseImportError] = useState('');
    const [expenseImportSuccess, setExpenseImportSuccess] = useState(false);
    const [expenseChartFilter, setExpenseChartFilter] = useState('month');
    const [addLeftoverModalOpen, setAddLeftoverModalOpen] = useState(false);
    const [leftoverName, setLeftoverName] = useState('');
    const [leftoverExpirationDays, setLeftoverExpirationDays] = useState(3);
    const [editFridgeItemId, setEditFridgeItemId] = useState(null);
    const [editFridgeQuantity, setEditFridgeQuantity] = useState('');
    const [editFridgeUnit, setEditFridgeUnit] = useState('piece');
    const [editFridgeSeasoningStatus, setEditFridgeSeasoningStatus] = useState('full');
    const [editFridgeLeftoverName, setEditFridgeLeftoverName] = useState('');
    const [editFridgeLeftoverDays, setEditFridgeLeftoverDays] = useState(3);
    const [editFridgeExpirationValue, setEditFridgeExpirationValue] = useState('');
    const [editFridgeExpirationUnit, setEditFridgeExpirationUnit] = useState('days');

    const isSeasoningCatalogItem = (item) => isSeasoningCategory(item?.category);
    const isSeasoningFridgeItem = (item) => isSeasoningFridgeItemLib(item, catalogItems);
    const usesFridgeCapacityTracking = (item) => usesFridgeCapacityTrackingLib(item, catalogItems);
    const canToggleFridgeTrackingMode = (item) => canToggleFridgeTrackingModeLib(item, catalogItems);
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
        if (updates.unit && editingCatalogItemId === item.id) {
            setEditCatalogDefaultUnit(updates.unit);
        }
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
        localStorage.setItem('fridgeExpenses', JSON.stringify(expenses));
    }, [expenses]);
    useEffect(() => {
        saveCustomExpenseCategories(customExpenseCategories);
    }, [customExpenseCategories]);
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
        if (!expenseImportSuccess) return;
        const timer = setTimeout(() => setExpenseImportSuccess(false), 2500);
        return () => clearTimeout(timer);
    }, [expenseImportSuccess]);
    useEffect(() => {
        localStorage.setItem('fridgeGroceryList', JSON.stringify(manualGroceryListItems));
    }, [manualGroceryListItems]);
    useEffect(() => {
        localStorage.setItem('fridgeDismissedGroceryList', JSON.stringify(dismissedGroceryListIds));
    }, [dismissedGroceryListIds]);
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
            const calories = parseCalories(catalogCalories);
            if (calories != null) newItem.caloriesPerDefault = calories;
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
        setCatalogCalories('');
        setAddCatalogModalOpen(true);
    };

    const closeAddCatalogModal = () => {
        setAddCatalogModalOpen(false);
        setCatalogName('');
        setCatalogCategory('meat');
        setCatalogDefaultUnit('piece');
        setCatalogExpirationDays(1);
        setCatalogCalories('');
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
        const draft = catalogDrafts[item.id];
        setEditingCatalogItemId(item.id);
        setEditCatalogName(item.name);
        setEditCatalogCategory(item.category || '');
        setEditCatalogExpirationDays(String(Math.max(1, item.expirationDays || 1)));
        setEditCatalogCalories(item.caloriesPerDefault != null ? String(item.caloriesPerDefault) : '');
        setEditCatalogDefaultUnit(draft?.unit || getDefaultCatalogUnit(item));
        setEditCatalogDefaultStatus(item.defaultStatus || 'full');
    };

    const closeEditCatalogModal = () => {
        setEditingCatalogItemId(null);
        setEditCatalogName('');
        setEditCatalogCategory('');
        setEditCatalogExpirationDays('');
        setEditCatalogCalories('');
        setEditCatalogDefaultUnit('piece');
        setEditCatalogDefaultStatus('full');
    };

    const saveCatalogItemEdit = () => {
        if (!editingCatalogItemId || !editCatalogName.trim() || !editCatalogCategory) return;
        const savedDefaultUnit = editCatalogDefaultUnit || 'piece';
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
                updated.defaultUnit = savedDefaultUnit;
                updated.expirationDays = Math.max(1, Number(editCatalogExpirationDays) || 1);
                updated.defaultQuantity = item.defaultQuantity ?? 1;
                const calories = parseCalories(editCatalogCalories);
                if (calories != null) {
                    updated.caloriesPerDefault = calories;
                } else {
                    delete updated.caloriesPerDefault;
                }
                delete updated.defaultStatus;
            }
            return updated;
        }));
        closeEditCatalogModal();
        setCatalogDrafts(prev => {
            const existing = prev[editingCatalogItemId];
            if (!existing) return prev;
            return {
                ...prev,
                [editingCatalogItemId]: { ...existing, unit: savedDefaultUnit }
            };
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
                expirySummary: getFridgeExistingExpirySummary(item.id, items, catalogItems)
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

    const addExpenseItemRow = () => {
        setExpenseDraftItems(prev => [...prev, emptyExpenseItem()]);
    };

    const updateExpenseDraftItem = (index, field, value) => {
        setExpenseDraftItems(prev => prev.map((item, i) => (
            i === index ? { ...item, [field]: value } : item
        )));
    };

    const removeExpenseDraftItem = (index) => {
        setExpenseDraftItems(prev => prev.filter((_, i) => i !== index));
    };

    const addExpense = () => {
        const items = serializeExpenseDraftItems(expenseDraftItems);
        const category = FB.normalizeExpenseCategory(expenseCategory);
        const price = FB.normalizeExpensePrice(expensePrice);
        if (!expenseTitle.trim() || !category) return;
        if (items.length === 0 && price == null) return;

        const expense = {
            id: Date.now(),
            title: expenseTitle.trim(),
            date: FB.normalizeExpenseDate(expenseDate),
            category,
            items
        };
        if (items.length === 0) expense.price = price;

        setExpenses(prev => [...prev, expense]);
        setExpenseTitle('');
        setExpenseDate(getTodayIsoDate());
        setExpenseCategory('');
        setExpensePrice('');
        setExpenseDraftItems([]);
    };

    const removeExpense = (expenseId) => {
        setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
    };

    const previewExpenseImport = () => {
        const parsed = parseExpenseImportText(expenseImportPaste);
        if (parsed.error) {
            setExpenseImportError(parsed.error);
            setExpenseImportPreview(null);
            return;
        }
        setExpenseImportError('');
        setExpenseImportPreview(resolveExpenseImportExpenses(parsed.expenses));
    };

    const clearExpenseImport = () => {
        setExpenseImportPaste('');
        setExpenseImportPreview(null);
        setExpenseImportError('');
    };

    const executeExpenseImport = (preview) => {
        let nextId = Date.now();
        const newExpenses = [];

        preview.forEach(expensePreview => {
            if (expensePreview.status === 'invalid') return;
            const items = expensePreview.items
                .filter(row => row.status === 'ready')
                .map(row => ({
                    name: row.name,
                    price: row.price
                }));
            if (items.length === 0 && expensePreview.price == null) return;
            const expense = {
                id: nextId++,
                title: expensePreview.title,
                date: expensePreview.date,
                category: expensePreview.category,
                items
            };
            if (items.length === 0) expense.price = expensePreview.price;
            newExpenses.push(expense);
        });

        if (newExpenses.length === 0) return;
        setExpenses(prev => [...prev, ...newExpenses]);
        clearExpenseImport();
        setExpenseImportSuccess(true);
    };

    const confirmExpenseImport = () => {
        if (!expenseImportPreview?.length) return;
        const hasImportable = expenseImportPreview.some(expense =>
            expense.status !== 'invalid' &&
            (expense.price != null || expense.items.some(row => row.status === 'ready'))
        );
        if (!hasImportable) return;
        executeExpenseImport(expenseImportPreview);
    };

    const openAddExpenseCategoryModal = () => {
        setNewExpenseCategoryName('');
        setExpenseCategoryError('');
        setAddExpenseCategoryModalOpen(true);
    };

    const closeAddExpenseCategoryModal = () => {
        setAddExpenseCategoryModalOpen(false);
        setNewExpenseCategoryName('');
        setExpenseCategoryError('');
    };

    const addExpenseCategory = () => {
        const result = buildCustomExpenseCategory(newExpenseCategoryName, customExpenseCategories);
        if (result.error) {
            setExpenseCategoryError(result.error);
            return;
        }
        setCustomExpenseCategories(prev => [...prev, result.category]);
        setExpenseCategory(result.category.id);
        closeAddExpenseCategoryModal();
    };

    const openDeleteExpenseCategoryModal = () => {
        setDeleteExpenseCategoryId('');
        setDeleteExpenseCategoryError('');
        setDeleteExpenseCategoryModalOpen(true);
    };

    const closeDeleteExpenseCategoryModal = () => {
        setDeleteExpenseCategoryModalOpen(false);
        setDeleteExpenseCategoryId('');
        setDeleteExpenseCategoryError('');
    };

    const deleteExpenseCategory = () => {
        const categoryId = deleteExpenseCategoryId;
        if (!categoryId) {
            setDeleteExpenseCategoryError('Select a category to delete');
            return;
        }
        if (FB.isBuiltInExpenseCategory(categoryId)) {
            setDeleteExpenseCategoryError('Built-in categories cannot be deleted');
            return;
        }
        if (!customExpenseCategories.some(entry => entry.id === categoryId)) {
            setDeleteExpenseCategoryError('Category not found');
            return;
        }
        setCustomExpenseCategories(prev => prev.filter(entry => entry.id !== categoryId));
        setExpenses(prev => prev.map(expense => (
            expense.category === categoryId ? { ...expense, category: 'miscellaneous' } : expense
        )));
        if (expenseCategory === categoryId) setExpenseCategory('');
        closeDeleteExpenseCategoryModal();
    };

    const expenseCategories = React.useMemo(
        () => [...EXPENSE_CATEGORIES, ...customExpenseCategories],
        [customExpenseCategories]
    );

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

    const lowerFridgeItemSeasoningStatus = (itemId) => {
        setItems(prev => prev.map(item => {
            if (item.id !== itemId) return item;
            return { ...item, seasoningStatus: FB.lowerSeasoningStatus(item.seasoningStatus) };
        }));
    };

    const openEmptyFridgeConfirm = () => setEmptyFridgeConfirmOpen(true);
    const cancelEmptyFridge = () => setEmptyFridgeConfirmOpen(false);
    const confirmEmptyFridge = () => {
        setItems([]);
        setFridgeSearch('');
        setDuplicateFridgeConfirm(null);
        closeEditFridgeItemModal();
        setEmptyFridgeConfirmOpen(false);
    };

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

    const setFridgeItemTrackingMode = (itemId, mode) => {
        setItems(prev => prev.map(item => {
            if (item.id !== itemId) return item;
            if (!canToggleFridgeTrackingMode(item)) return item;
            const catalogItem = catalogItems.find(entry => entry.id === item.catalogItemId);
            if (mode === 'capacity') {
                return {
                    ...item,
                    trackingMode: 'capacity',
                    seasoningStatus: item.seasoningStatus || 'half'
                };
            }
            return {
                ...item,
                trackingMode: 'amount',
                quantity: item.quantity ?? getDefaultCatalogQuantity(catalogItem) ?? 1,
                unit: item.unit || catalogItem?.defaultUnit || 'piece'
            };
        }));
    };

    const openEditFridgeItemModal = (item) => {
        setEditFridgeItemId(item.id);
        if (isLeftoverFridgeItem(item)) {
            setEditFridgeLeftoverName(item.name);
            setEditFridgeLeftoverDays(Math.max(1, getDaysUntilExpiry(item.expiry)));
            return;
        }
        if (usesFridgeCapacityTracking(item)) {
            setEditFridgeSeasoningStatus(item.seasoningStatus || 'full');
            if (!isSeasoningFridgeItem(item)) {
                const daysUntilExpiry = item.expiry ? getDaysUntilExpiry(item.expiry) : 1;
                setEditFridgeExpirationValue(String(Math.max(1, Number.isFinite(daysUntilExpiry) ? daysUntilExpiry : 1)));
                setEditFridgeExpirationUnit('days');
            }
            return;
        }
        setEditFridgeQuantity(String(item.quantity != null && item.quantity !== '' ? item.quantity : 1));
        setEditFridgeUnit(item.unit || 'piece');
        const daysUntilExpiry = item.expiry ? getDaysUntilExpiry(item.expiry) : 1;
        setEditFridgeExpirationValue(String(Math.max(1, Number.isFinite(daysUntilExpiry) ? daysUntilExpiry : 1)));
        setEditFridgeExpirationUnit('days');
    };

    const closeEditFridgeItemModal = () => {
        setEditFridgeItemId(null);
        setEditFridgeQuantity('');
        setEditFridgeUnit('piece');
        setEditFridgeSeasoningStatus('full');
        setEditFridgeLeftoverName('');
        setEditFridgeLeftoverDays(3);
        setEditFridgeExpirationValue('');
        setEditFridgeExpirationUnit('days');
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

    const adjustEditFridgeExpirationValue = (delta) => {
        setEditFridgeExpirationValue(prev => String(adjustDays(prev === '' ? 1 : prev, delta)));
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
            if (usesFridgeCapacityTracking(item)) {
                if (isSeasoningFridgeItem(item)) {
                    return { ...item, seasoningStatus: editFridgeSeasoningStatus };
                }
                return {
                    ...item,
                    trackingMode: 'capacity',
                    seasoningStatus: editFridgeSeasoningStatus,
                    expiry: addExpirationFromToday(
                        Math.max(1, Number(editFridgeExpirationValue) || 1),
                        editFridgeExpirationUnit
                    )
                };
            }
            return {
                ...item,
                trackingMode: 'amount',
                quantity: roundIngredientQuantity(editFridgeQuantity),
                unit: editFridgeUnit || 'piece',
                expiry: addExpirationFromToday(
                    Math.max(1, Number(editFridgeExpirationValue) || 1),
                    editFridgeExpirationUnit
                )
            };
        }));
        closeEditFridgeItemModal();
    };

    const adjustCatalogExpirationDays = (delta) => {
        setCatalogExpirationDays(prev => adjustDays(prev === '' ? 1 : prev, delta));
    };

    const adjustCatalogCalories = (delta) => {
        setCatalogCalories(prev => String(adjustCalories(parseCalories(prev) ?? 0, delta)));
    };

    const adjustEditExpirationDays = (delta) => {
        setEditCatalogExpirationDays(prev => adjustDays(prev === '' ? 1 : prev, delta));
    };

    const adjustEditCatalogCalories = (delta) => {
        setEditCatalogCalories(prev => String(adjustCalories(parseCalories(prev) ?? 0, delta)));
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
        setEditDraftIngredients(recipe.ingredients.map(ingredient => toDraftIngredient(ingredient, catalogItems)));
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

    const openRecipeAddToFridgePreview = (recipe) => {
        if (!recipe?.ingredients?.length) return;
        setRecipeAddToFridgeRecipe(recipe);
        setRecipeAddToFridgeDraft(
            recipe.ingredients.map(ingredient => toDraftIngredient(ingredient, catalogItems))
        );
    };

    const closeRecipeAddToFridgePreview = () => {
        setRecipeAddToFridgeRecipe(null);
        setRecipeAddToFridgeDraft([]);
    };

    const updateRecipeAddToFridgeDraftItem = (index, field, value) => {
        setRecipeAddToFridgeDraft(prev => prev.map((item, i) => (
            i === index ? { ...item, [field]: value } : item
        )));
    };

    const adjustRecipeAddToFridgeDraftQuantity = (index, delta) => {
        adjustIngredientQuantityInList(setRecipeAddToFridgeDraft, index, delta);
    };

    const removeRecipeAddToFridgeDraftItem = (index) => {
        removeIngredientRowFromList(setRecipeAddToFridgeDraft, index);
    };

    const confirmRecipeAddToFridge = () => {
        if (!recipeAddToFridgeRecipe || recipeAddToFridgeDraft.length === 0) return;
        let nextId = Date.now();
        const newFridgeItems = recipeAddToFridgeDraft
            .filter(row => row.catalogItemId)
            .map(row => FB.buildFridgeItemFromGroceryListEntry({
                catalogItemId: row.catalogItemId,
                quantity: row.quantity,
                unit: row.unit
            }, catalogItems, nextId++))
            .filter(Boolean);
        if (newFridgeItems.length === 0) return;
        setItems(prev => [...prev, ...newFridgeItems]);
        closeRecipeAddToFridgePreview();
    };

    const { readyToMake: readyToMakeRecipes, almostThere: almostThereRecipes } = classifyRecipesForHome(
        recipes,
        items,
        getDaysUntilExpiry,
        catalogItems
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
        usesFridgeCapacityTracking(item) &&
        window.FB.normalizeSeasoningStatus(item.seasoningStatus) === 'almost-empty'
    ).sort((a, b) => FB.getSeasoningStatusSortOrder(a.seasoningStatus) - FB.getSeasoningStatusSortOrder(b.seasoningStatus));

    const fridgeGrocerySuggestions = useMemo(
        () => FB.buildFridgeGrocerySuggestions(items, catalogItems, dismissedGroceryListIds),
        [items, catalogItems, dismissedGroceryListIds]
    );

    const suggestedGroceryListItems = useMemo(
        () => [...fridgeGrocerySuggestions, ...sessionRandomGroceryItems],
        [fridgeGrocerySuggestions, sessionRandomGroceryItems]
    );

    const emptyGroceryListDraftItem = () => ({ catalogItemId: '' });

    const addGroceryListItemRow = () => {
        setGroceryListDraftItems(prev => [...prev, emptyGroceryListDraftItem()]);
    };

    const updateGroceryListDraftItem = (index, field, value) => {
        setGroceryListDraftItems(prev => prev.map((item, i) => (
            i === index ? { ...item, [field]: value } : item
        )));
    };

    const removeGroceryListDraftItem = (index) => {
        setGroceryListDraftItems(prev => prev.filter((_, i) => i !== index));
    };

    const addManualGroceryListItems = () => {
        const draftEntries = groceryListDraftItems
            .map(item => {
                const catalogItem = catalogItems.find(entry => String(entry.id) === String(item.catalogItemId));
                if (!catalogItem) return null;
                return catalogItem;
            })
            .filter(Boolean);
        if (draftEntries.length === 0) return;

        const existingCatalogIds = new Set([
            ...manualGroceryListItems.map(item => String(item.catalogItemId)),
            ...suggestedGroceryListItems
                .filter(item => item.catalogItemId != null)
                .map(item => String(item.catalogItemId))
        ]);
        const existingNames = new Set([
            ...manualGroceryListItems.map(item => item.name.toLowerCase()),
            ...suggestedGroceryListItems.map(item => item.name.toLowerCase())
        ]);
        let nextId = Date.now();
        const newItems = draftEntries
            .filter(catalogItem => (
                !existingCatalogIds.has(String(catalogItem.id))
                && !existingNames.has(catalogItem.name.toLowerCase())
            ))
            .map(catalogItem => {
                existingCatalogIds.add(String(catalogItem.id));
                return {
                    id: nextId++,
                    catalogItemId: catalogItem.id,
                    name: catalogItem.name,
                    quantity: getDefaultCatalogQuantity(catalogItem),
                    unit: getDefaultCatalogUnit(catalogItem),
                    source: 'manual',
                    detail: 'added by you',
                    detailTone: 'success'
                };
            });

        if (newItems.length === 0) return;
        setManualGroceryListItems(prev => [...prev, ...newItems]);
        setGroceryListDraftItems([]);
    };

    const removeGroceryListItem = (item) => {
        if (item.source === 'manual') {
            setManualGroceryListItems(prev => prev.filter(entry => entry.id !== item.id));
            return;
        }
        if (item.source === 'random') {
            setSessionRandomGroceryItems(prev => prev.filter(entry => entry.id !== item.id));
            return;
        }
        setDismissedGroceryListIds(prev => (
            prev.includes(item.id) ? prev : [...prev, item.id]
        ));
    };

    const isOnManualGroceryList = (item) => manualGroceryListItems.some(entry => {
        if (item.catalogItemId != null && entry.catalogItemId != null) {
            return String(entry.catalogItemId) === String(item.catalogItemId);
        }
        return entry.name.toLowerCase() === item.name.toLowerCase();
    });

    const addSuggestedItemToGroceryList = (item) => {
        if (isOnManualGroceryList(item)) return;

        let catalogItemId = item.catalogItemId;
        let name = item.name;

        if (!catalogItemId && item.fridgeItemId) {
            const fridgeItem = items.find(entry => entry.id === item.fridgeItemId);
            catalogItemId = fridgeItem?.catalogItemId;
            name = fridgeItem?.name || name;
        }

        if (!catalogItemId) {
            const catalogMatch = catalogItems.find(entry => entry.name.toLowerCase() === name.toLowerCase());
            catalogItemId = catalogMatch?.id;
            name = catalogMatch?.name || name;
        }

        if (!catalogItemId) return;

        const catalogItem = catalogItems.find(entry => String(entry.id) === String(catalogItemId));
        setManualGroceryListItems(prev => [...prev, {
            id: Date.now(),
            catalogItemId,
            name,
            quantity: catalogItem ? getDefaultCatalogQuantity(catalogItem) : 1,
            unit: catalogItem ? getDefaultCatalogUnit(catalogItem) : 'piece',
            source: 'manual',
            detail: 'added by you',
            detailTone: 'success'
        }]);
    };

    const updateGroceryListItem = (id, field, value) => {
        setManualGroceryListItems(prev => prev.map(item => (
            item.id === id ? { ...item, [field]: value } : item
        )));
    };

    const adjustGroceryListItemQuantity = (id, delta) => {
        setManualGroceryListItems(prev => prev.map(item => {
            if (item.id !== id) return item;
            const current = parseIngredientQuantity(item.quantity);
            return { ...item, quantity: roundIngredientQuantity(current + delta) };
        }));
    };

    const addGroceryListItemToFridge = (groceryItem) => {
        const fridgeItem = FB.buildFridgeItemFromGroceryListEntry(groceryItem, catalogItems, Date.now());
        if (!fridgeItem) return;
        setItems(prev => [...prev, fridgeItem]);
        setManualGroceryListItems(prev => prev.filter(entry => entry.id !== groceryItem.id));
    };

    const addAllGroceryListItemsToFridge = () => {
        if (manualGroceryListItems.length === 0) return;
        let nextId = Date.now();
        const newFridgeItems = manualGroceryListItems
            .map(item => FB.buildFridgeItemFromGroceryListEntry(item, catalogItems, nextId++))
            .filter(Boolean);
        if (newFridgeItems.length === 0) return;
        setItems(prev => [...prev, ...newFridgeItems]);
        setManualGroceryListItems([]);
    };

    const appendManualGroceryListEntries = (entries) => {
        if (!entries.length) return 0;
        const existingCatalogIds = new Set(
            manualGroceryListItems
                .filter(item => item.catalogItemId != null)
                .map(item => String(item.catalogItemId))
        );
        const existingNames = new Set(
            manualGroceryListItems.map(item => item.name.toLowerCase())
        );
        let nextId = Date.now();
        const newItems = entries
            .filter(entry => (
                !existingCatalogIds.has(String(entry.catalogItemId))
                && !existingNames.has(entry.name.toLowerCase())
            ))
            .map(entry => {
                existingCatalogIds.add(String(entry.catalogItemId));
                existingNames.add(entry.name.toLowerCase());
                const catalogItem = catalogItems.find(
                    item => String(item.id) === String(entry.catalogItemId)
                );
                return {
                    id: nextId++,
                    ...entry,
                    quantity: entry.quantity ?? (catalogItem ? getDefaultCatalogQuantity(catalogItem) : 1),
                    unit: entry.unit ?? (catalogItem ? getDefaultCatalogUnit(catalogItem) : 'piece')
                };
            });
        if (newItems.length === 0) return 0;
        setManualGroceryListItems(prev => [...prev, ...newItems]);
        return newItems.length;
    };

    const addRecipeIngredientsToGroceryList = () => {
        if (!groceryListRecipeId) return;
        const recipe = recipes.find(entry => String(entry.id) === String(groceryListRecipeId));
        if (!recipe) return;

        const missingIngredients = FB.getRecipeIngredientsNotInFridge(
            recipe,
            items,
            getDaysUntilExpiry,
            catalogItems
        );
        const entries = missingIngredients
            .map(ingredient => {
                const resolved = FB.resolveGroceryListCatalogEntry(ingredient, catalogItems);
                if (!resolved) return null;
                const catalogItem = catalogItems.find(
                    entry => String(entry.id) === String(resolved.catalogItemId)
                );
                const quantity = ingredient.quantity != null && ingredient.quantity !== ''
                    ? ingredient.quantity
                    : (catalogItem ? getDefaultCatalogQuantity(catalogItem) : 1);
                const unit = ingredient.unit
                    || (catalogItem ? getDefaultCatalogUnit(catalogItem) : 'piece');
                return {
                    catalogItemId: resolved.catalogItemId,
                    name: resolved.name,
                    quantity,
                    unit,
                    source: 'manual',
                    detail: `from ${recipe.name}`,
                    detailTone: 'success'
                };
            })
            .filter(Boolean);

        appendManualGroceryListEntries(entries);
    };

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
        catalogCalories, setCatalogCalories, adjustCatalogCalories,
        editingCatalogItemId,
        editCatalogName, setEditCatalogName,
        editCatalogCategory, setEditCatalogCategory,
        editCatalogExpirationDays, setEditCatalogExpirationDays,
        editCatalogCalories, setEditCatalogCalories, adjustEditCatalogCalories,
        editCatalogDefaultUnit, setEditCatalogDefaultUnit,
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
        suggestedGroceryListItems, manualGroceryListItems, groceryListDraftItems,
        readyToMakeRecipes, almostThereRecipes,
        viewingRecipeId, viewingRecipe,
        duplicateFridgeConfirm,
        emptyFridgeConfirmOpen, cancelEmptyFridge, confirmEmptyFridge,
        importUnmatchedConfirm,
        addedToFridgeItemId,
        agentPromptCopied, copyAgentPrompt,
        addGroceryListItemRow, updateGroceryListDraftItem, removeGroceryListDraftItem,
        addManualGroceryListItems, removeGroceryListItem, addSuggestedItemToGroceryList,
        updateGroceryListItem, adjustGroceryListItemQuantity,
        addGroceryListItemToFridge, addAllGroceryListItemsToFridge,
        isOnManualGroceryList, groceryListRecipeId, setGroceryListRecipeId,
        addRecipeIngredientsToGroceryList,
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
        expenses, expenseTitle, setExpenseTitle,
        expenseDate, setExpenseDate,
        expenseCategory, setExpenseCategory,
        expensePrice, setExpensePrice,
        expenseCategories,
        expenseDraftItems, setExpenseDraftItems,
        customExpenseCategories,
        addExpenseCategoryModalOpen,
        deleteExpenseCategoryModalOpen,
        newExpenseCategoryName, setNewExpenseCategoryName,
        deleteExpenseCategoryId, setDeleteExpenseCategoryId,
        expenseCategoryError,
        deleteExpenseCategoryError,
        openAddExpenseCategoryModal, closeAddExpenseCategoryModal, addExpenseCategory,
        openDeleteExpenseCategoryModal, closeDeleteExpenseCategoryModal, deleteExpenseCategory,
        expenseImportPaste, setExpenseImportPaste,
        expenseImportPreview, expenseImportError,
        expenseImportSuccess,
        expenseChartFilter, setExpenseChartFilter,
        addExpense, addExpenseItemRow, updateExpenseDraftItem, removeExpenseDraftItem,
        previewExpenseImport, confirmExpenseImport, clearExpenseImport,
        removeExpense,
        addMealManual, addMealIngredientRow, addMealFromRecipes, setMealRecipeSelection, removeMeal, removeMealIngredient,
        updateMealCalories,
        getCatalogDraft, updateCatalogDraft, adjustCatalogDraftField,
        isSeasoningCatalogItem, isSeasoningFridgeItem, usesFridgeCapacityTracking,
        canToggleFridgeTrackingMode, setFridgeItemTrackingMode,
        openAddCatalogModal, closeAddCatalogModal, addCatalogItem,
        openEditCatalogModal, closeEditCatalogModal, saveCatalogItemEdit, deleteCatalogItemFromModal,
        addFromCatalogRow, confirmDuplicateFridgeAdd, cancelDuplicateFridgeAdd,
        removeItem, lowerFridgeItemSeasoningStatus,
        openEmptyFridgeConfirm,
        openAddLeftoverModal, closeAddLeftoverModal, addLeftover,
        addLeftoverModalOpen, leftoverName, setLeftoverName,
        leftoverExpirationDays, setLeftoverExpirationDays, adjustLeftoverExpirationDays,
        editFridgeItemId, editingFridgeItem,
        editFridgeQuantity, setEditFridgeQuantity,
        editFridgeUnit, setEditFridgeUnit, adjustEditFridgeQuantity,
        editFridgeSeasoningStatus, adjustEditFridgeSeasoningStatus,
        editFridgeLeftoverName, setEditFridgeLeftoverName,
        editFridgeLeftoverDays, setEditFridgeLeftoverDays, adjustEditFridgeLeftoverDays,
        editFridgeExpirationValue, setEditFridgeExpirationValue,
        editFridgeExpirationUnit, setEditFridgeExpirationUnit,
        adjustEditFridgeExpirationValue,
        openEditFridgeItemModal, closeEditFridgeItemModal, saveFridgeItemEdit,
        isLeftoverFridgeItem,
        adjustCatalogExpirationDays, adjustEditExpirationDays,
        adjustEditCatalogCalories, adjustEditRecipeCalories,
        addRecipe, updateRecipeCalories, addIngredientRow, addIngredientRowToList,
        updateIngredientInList, adjustIngredientQuantityInList, removeIngredientRowFromList,
        openEditRecipeModal, closeEditRecipeModal, saveRecipeEdit, deleteRecipeFromModal,
        toggleRecipeShowQuantities, openViewRecipeModal, closeViewRecipeModal,
        recipeAddToFridgeRecipe, recipeAddToFridgeDraft,
        openRecipeAddToFridgePreview, closeRecipeAddToFridgePreview,
        updateRecipeAddToFridgeDraftItem, adjustRecipeAddToFridgeDraftQuantity,
        removeRecipeAddToFridgeDraftItem, confirmRecipeAddToFridge,
        theme, setThemeId, selectClassicTheme, toggleClassicMode,
        isClassicTheme: FB.isClassicFridgeTheme(theme)
    };
}

window.useFridgeBuddy = useFridgeBuddy;
