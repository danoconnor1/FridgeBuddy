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
        serializeDraftIngredients, parseIngredientQuantity, roundIngredientQuantity
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
    const [activeTab, setActiveTab] = useState('home');
    const [groceryStoreSearch, setGroceryStoreSearch] = useState('');
    const [fridgeSearch, setFridgeSearch] = useState('');
    const [fridgeSort, setFridgeSort] = useState('category');
    const [viewingRecipeId, setViewingRecipeId] = useState(null);
    const [duplicateFridgeConfirm, setDuplicateFridgeConfirm] = useState(null);

    const isSeasoningCatalogItem = (item) => isSeasoningCategory(item?.category);
    const isSeasoningFridgeItem = (item) => isSeasoningFridgeItemLib(item, catalogItems);
    const getCatalogItem = (catalogItemId) => catalogItems.find(item => item.id === catalogItemId);
    const getFridgeItemCategory = (item) => getCatalogItem(item.catalogItemId)?.category || 'other';
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
        localStorage.setItem('fridgeCatalog', JSON.stringify(catalogItems));
    }, [catalogItems]);
    useEffect(() => {
        localStorage.setItem('fridgeItems', JSON.stringify(items));
    }, [items]);
    useEffect(() => {
        localStorage.setItem('fridgeRecipes', JSON.stringify(recipes));
    }, [recipes]);
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

    const addCatalogItem = () => {
        if (!catalogName.trim() || !catalogCategory) return;
        const newItem = { id: Date.now(), name: catalogName.trim(), category: catalogCategory, defaultUnit: 'piece' };
        if (isSeasoningCategory(catalogCategory)) {
            newItem.defaultStatus = 'full';
        } else {
            newItem.defaultUnit = catalogDefaultUnit;
            newItem.expirationDays = Math.max(1, Number(catalogExpirationDays) || 1);
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
            } else {
                updated.defaultUnit = item.defaultUnit || 'oz';
                updated.expirationDays = Number(editCatalogExpirationDays);
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

    const removeItem = (id) => setItems(items.filter(item => item.id !== id));

    const adjustItemQuantity = (id, delta) => {
        setItems(items.map(item => {
            if (item.id !== id) return item;
            const current = item.quantity != null && item.quantity !== '' ? Number(item.quantity) : 1;
            return { ...item, quantity: Math.max(1, current + delta), unit: item.unit || 'piece' };
        }));
    };

    const adjustFridgeSeasoningStatus = (id, delta) => {
        setItems(items.map(item => {
            if (item.id !== id) return item;
            return { ...item, seasoningStatus: adjustSeasoningStatus(item.seasoningStatus, delta) };
        }));
    };

    const adjustCatalogExpirationDays = (delta) => {
        setCatalogExpirationDays(prev => adjustDays(prev === '' ? 1 : prev, delta));
    };

    const adjustEditExpirationDays = (delta) => {
        setEditCatalogExpirationDays(prev => adjustDays(prev, delta));
    };

    const addRecipe = () => {
        const ingredients = serializeDraftIngredients(draftIngredients, catalogItems);
        if (recipeName.trim() && ingredients.length > 0) {
            setRecipes([...recipes, { id: Date.now(), name: recipeName.trim(), ingredients }]);
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
        setEditingRecipeId(recipe.id);
        setEditRecipeName(recipe.name);
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
    };

    const saveRecipeEdit = () => {
        if (!editingRecipeId || !editRecipeName.trim()) return;
        const ingredients = serializeDraftIngredients(editDraftIngredients, catalogItems);
        if (ingredients.length === 0) return;
        setRecipes(recipes.map(recipe =>
            recipe.id === editingRecipeId
                ? { ...recipe, name: editRecipeName.trim(), ingredients }
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
        if (isSeasoningFridgeItem(item)) return false;
        const days = getDaysUntilExpiry(item.expiry);
        return days <= 3 && days >= 0;
    }).sort((a, b) => getDaysUntilExpiry(a.expiry) - getDaysUntilExpiry(b.expiry));

    const expiredItems = items.filter(item =>
        !isSeasoningFridgeItem(item) && getDaysUntilExpiry(item.expiry) < 0
    );

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
        groupedCatalogItems, filteredFridgeItems, fridgeItemGroups,
        expiringItems, expiredItems, lowSeasoningItems,
        readyToMakeRecipes, almostThereRecipes,
        viewingRecipeId, viewingRecipe,
        duplicateFridgeConfirm,
        addedToFridgeItemId,
        getCatalogDraft, updateCatalogDraft, adjustCatalogDraftField,
        isSeasoningCatalogItem, isSeasoningFridgeItem,
        openAddCatalogModal, closeAddCatalogModal, addCatalogItem,
        openEditCatalogModal, closeEditCatalogModal, saveCatalogItemEdit, deleteCatalogItemFromModal,
        addFromCatalogRow, confirmDuplicateFridgeAdd, cancelDuplicateFridgeAdd,
        removeItem, adjustItemQuantity, adjustFridgeSeasoningStatus,
        adjustCatalogExpirationDays, adjustEditExpirationDays,
        addRecipe, addIngredientRow, addIngredientRowToList,
        updateIngredientInList, adjustIngredientQuantityInList, removeIngredientRowFromList,
        openEditRecipeModal, closeEditRecipeModal, saveRecipeEdit, deleteRecipeFromModal,
        toggleRecipeShowQuantities, openViewRecipeModal, closeViewRecipeModal
    };
}

window.useFridgeBuddy = useFridgeBuddy;
