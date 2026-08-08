function FridgeBuddy() {
    const fb = useFridgeBuddy();
    const {
        HomeTab, GroceryStoreTab, FridgeTab, RecipesTab, MealsTab, MoneyTab,
        AddCatalogModal, EditCatalogModal, EditRecipeModal, RecipeViewModal, RecipeAddToFridgeModal,
        DuplicateFridgeConfirmModal, ImportUnmatchedConfirmModal, AddLeftoverModal,
        EditFridgeItemModal, EmptyFridgeConfirmModal, AddExpenseCategoryModal, DeleteExpenseCategoryModal,
        EditExpenseModal, FridgeBuddyMascot
    } = window.FBComponents;
    const [themeMenuOpen, setThemeMenuOpen] = React.useState(false);
    const themeMenuRef = React.useRef(null);

    React.useEffect(() => {
        if (!themeMenuOpen) return undefined;
        const closeMenu = (event) => {
            if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
                setThemeMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', closeMenu);
        return () => document.removeEventListener('mousedown', closeMenu);
    }, [themeMenuOpen]);

    const tabs = [
        { id: 'home', label: 'Home', shortLabel: 'Home' },
        { id: 'allItems', label: 'Grocery store', shortLabel: 'Store' },
        { id: 'fridge', label: 'Fridge', shortLabel: 'Fridge' },
        { id: 'recipes', label: 'Recipes', shortLabel: 'Recipes' },
        { id: 'meals', label: 'Meals', shortLabel: 'Meals' },
        { id: 'money', label: 'Money', shortLabel: 'Money' }
    ];

    const isThemeActive = (optionId) => {
        if (optionId === 'classic-light') return fb.isClassicTheme;
        return fb.theme === optionId;
    };

    const hasSceneBackground = fb.theme === 'retro-space' || fb.theme === 'farmers-market' || fb.theme === 'neon-kitchen';

    return (
        <>
            {fb.theme === 'retro-space' && (
                <>
                    <div className="theme-bg-scene--retro-space" aria-hidden="true" />
                    <div className="theme-bg-overlay--retro-space" aria-hidden="true" />
                </>
            )}
            {fb.theme === 'farmers-market' && (
                <>
                    <div className="theme-bg-scene--farmers-market" aria-hidden="true" />
                    <div className="theme-bg-overlay--farmers-market" aria-hidden="true" />
                </>
            )}
            {fb.theme === 'neon-kitchen' && (
                <>
                    <div className="theme-bg-scene--neon-kitchen" aria-hidden="true" />
                    <div className="theme-bg-overlay--neon-kitchen" aria-hidden="true" />
                </>
            )}
        <div className="app-shell" style={{
            fontFamily: 'inherit',
            color: 'var(--text-primary)',
            minHeight: '100vh',
            background: hasSceneBackground ? 'transparent' : 'var(--surface-0)',
            padding: '1rem'
        }}>
            <div className="app-shell-inner">
                <header className="app-header">
                    <div className="app-header-brand">
                        <FridgeBuddyMascot className="app-header-mascot" />
                        <h1 className="app-header-title">Fridge Buddy</h1>
                    </div>
                    <div className="app-header-actions">
                        {fb.isClassicTheme && (
                            <button
                                type="button"
                                className="theme-toggle-btn"
                                onClick={fb.toggleClassicMode}
                                aria-label={fb.theme === 'classic-dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                                title={fb.theme === 'classic-dark' ? 'Light mode' : 'Dark mode'}
                            >
                                <i className={`ti ${fb.theme === 'classic-dark' ? 'ti-sun' : 'ti-moon'}`} aria-hidden="true" />
                            </button>
                        )}
                        <div className="theme-menu-wrap" ref={themeMenuRef}>
                            <button
                                type="button"
                                className="theme-toggle-btn"
                                onClick={() => setThemeMenuOpen(open => !open)}
                                aria-label="Choose theme"
                                aria-expanded={themeMenuOpen}
                                title="Choose theme"
                            >
                                <i className="ti ti-palette" aria-hidden="true" />
                            </button>
                            {themeMenuOpen && (
                                <div className="theme-menu" role="menu">
                                    <p className="theme-menu-label">Theme</p>
                                    {window.FB.FRIDGE_THEME_OPTIONS.map(option => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            role="menuitem"
                                            className={`theme-menu-item${isThemeActive(option.id) ? ' active' : ''}`}
                                            onClick={() => {
                                                if (option.id === 'classic-light') {
                                                    fb.selectClassicTheme();
                                                } else {
                                                    fb.setThemeId(option.id);
                                                }
                                                setThemeMenuOpen(false);
                                            }}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                    {fb.isClassicTheme && (
                                        <>
                                            <div className="theme-menu-divider" />
                                            <p className="theme-menu-label">Classic mode</p>
                                            <div className="theme-menu-classic-row">
                                                <button
                                                    type="button"
                                                    className={`theme-menu-classic-btn${fb.theme === 'classic-light' ? ' active' : ''}`}
                                                    onClick={() => fb.setThemeId('classic-light')}
                                                >
                                                    Light
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`theme-menu-classic-btn${fb.theme === 'classic-dark' ? ' active' : ''}`}
                                                    onClick={() => fb.setThemeId('classic-dark')}
                                                >
                                                    Dark
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <nav className="app-tabs" aria-label="Main navigation">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            className={`app-tab${fb.activeTab === tab.id ? ' active' : ''}`}
                            onClick={() => fb.setActiveTab(tab.id)}
                        >
                            <span className="app-tab-label app-tab-label--full">{tab.label}</span>
                            <span className="app-tab-label app-tab-label--short">{tab.shortLabel}</span>
                        </button>
                    ))}
                </nav>

                {fb.activeTab === 'home' && (
                    <HomeTab
                        expiringItems={fb.expiringItems}
                        expiredItems={fb.expiredItems}
                        leftoverItems={fb.leftoverItems}
                        readyToMakeRecipes={fb.readyToMakeRecipes}
                        almostThereRecipes={fb.almostThereRecipes}
                        items={fb.items}
                        recipes={fb.recipes}
                        catalogItems={fb.catalogItems}
                        manualGroceryListItems={fb.manualGroceryListItems}
                        suggestedGroceryListItems={fb.suggestedGroceryListItems}
                        groceryListDraftItems={fb.groceryListDraftItems}
                        openViewRecipeModal={fb.openViewRecipeModal}
                        agentPromptCopied={fb.agentPromptCopied}
                        copyAgentPrompt={fb.copyAgentPrompt}
                        exportFridge={fb.exportFridge}
                        importFridgeFromText={fb.importFridgeFromText}
                        fridgeImportError={fb.fridgeImportError}
                        fridgeImportSuccess={fb.fridgeImportSuccess}
                        addGroceryListItemRow={fb.addGroceryListItemRow}
                        updateGroceryListDraftItem={fb.updateGroceryListDraftItem}
                        removeGroceryListDraftItem={fb.removeGroceryListDraftItem}
                        addManualGroceryListItems={fb.addManualGroceryListItems}
                        removeGroceryListItem={fb.removeGroceryListItem}
                        addSuggestedItemToGroceryList={fb.addSuggestedItemToGroceryList}
                        addGroceryListItemToFridge={fb.addGroceryListItemToFridge}
                        addAllGroceryListItemsToFridge={fb.addAllGroceryListItemsToFridge}
                        isOnManualGroceryList={fb.isOnManualGroceryList}
                        groceryListRecipeId={fb.groceryListRecipeId}
                        setGroceryListRecipeId={fb.setGroceryListRecipeId}
                        addRecipeIngredientsToGroceryList={fb.addRecipeIngredientsToGroceryList}
                    />
                )}

                {fb.activeTab === 'allItems' && (
                    <GroceryStoreTab
                        catalogItems={fb.catalogItems}
                        groupedCatalogItems={fb.groupedCatalogItems}
                        groceryStoreSearch={fb.groceryStoreSearch}
                        setGroceryStoreSearch={fb.setGroceryStoreSearch}
                        catalogAddSuccess={fb.catalogAddSuccess}
                        openAddCatalogModal={fb.openAddCatalogModal}
                        addedToFridgeItemId={fb.addedToFridgeItemId}
                        getCatalogDraft={fb.getCatalogDraft}
                        updateCatalogDraft={fb.updateCatalogDraft}
                        adjustCatalogDraftField={fb.adjustCatalogDraftField}
                        isSeasoningCatalogItem={fb.isSeasoningCatalogItem}
                        addFromCatalogRow={fb.addFromCatalogRow}
                        openEditCatalogModal={fb.openEditCatalogModal}
                    />
                )}

                {fb.activeTab === 'fridge' && (
                    <FridgeTab
                            items={fb.items}
                            catalogItems={fb.catalogItems}
                            filteredFridgeItems={fb.filteredFridgeItems}
                            fridgeItemGroups={fb.fridgeItemGroups}
                            fridgeSearch={fb.fridgeSearch}
                            setFridgeSearch={fb.setFridgeSearch}
                            fridgeSort={fb.fridgeSort}
                            setFridgeSort={fb.setFridgeSort}
                            isSeasoningFridgeItem={fb.isSeasoningFridgeItem}
                            usesFridgeCapacityTracking={fb.usesFridgeCapacityTracking}
                            canToggleFridgeTrackingMode={fb.canToggleFridgeTrackingMode}
                            setFridgeItemTrackingMode={fb.setFridgeItemTrackingMode}
                            isLeftoverFridgeItem={fb.isLeftoverFridgeItem}
                            removeItem={fb.removeItem}
                            lowerFridgeItemSeasoningStatus={fb.lowerFridgeItemSeasoningStatus}
                            openEmptyFridgeConfirm={fb.openEmptyFridgeConfirm}
                            openEditFridgeItemModal={fb.openEditFridgeItemModal}
                            openAddLeftoverModal={fb.openAddLeftoverModal}
                            setActiveTab={fb.setActiveTab}
                            haulImportPaste={fb.haulImportPaste}
                            setHaulImportPaste={fb.setHaulImportPaste}
                            haulImportPreview={fb.haulImportPreview}
                            haulImportError={fb.haulImportError}
                            haulImportSuccess={fb.haulImportSuccess}
                            previewHaulImport={fb.previewHaulImport}
                            confirmHaulImport={fb.confirmHaulImport}
                            clearHaulImport={fb.clearHaulImport}
                        />
                )}

                {fb.activeTab === 'recipes' && (
                    <RecipesTab
                        catalogItems={fb.catalogItems}
                        recipes={fb.recipes}
                        items={fb.items}
                        recipeName={fb.recipeName}
                        setRecipeName={fb.setRecipeName}
                        draftIngredients={fb.draftIngredients}
                        setDraftIngredients={fb.setDraftIngredients}
                        addIngredientRow={fb.addIngredientRow}
                        addRecipe={fb.addRecipe}
                        updateIngredientInList={fb.updateIngredientInList}
                        adjustIngredientQuantityInList={fb.adjustIngredientQuantityInList}
                        removeIngredientRowFromList={fb.removeIngredientRowFromList}
                        toggleRecipeShowQuantities={fb.toggleRecipeShowQuantities}
                        openEditRecipeModal={fb.openEditRecipeModal}
                        updateRecipeCalories={fb.updateRecipeCalories}
                        openRecipeAddToFridgePreview={fb.openRecipeAddToFridgePreview}
                        recipeImportPaste={fb.recipeImportPaste}
                        setRecipeImportPaste={fb.setRecipeImportPaste}
                        recipeImportPreview={fb.recipeImportPreview}
                        recipeImportError={fb.recipeImportError}
                        recipeImportSuccess={fb.recipeImportSuccess}
                        previewRecipeImport={fb.previewRecipeImport}
                        confirmRecipeImport={fb.confirmRecipeImport}
                        clearRecipeImport={fb.clearRecipeImport}
                    />
                )}

                {fb.activeTab === 'meals' && (
                    <MealsTab
                        catalogItems={fb.catalogItems}
                        recipes={fb.recipes}
                        meals={fb.meals}
                        mealName={fb.mealName}
                        setMealName={fb.setMealName}
                        mealDraftIngredients={fb.mealDraftIngredients}
                        setMealDraftIngredients={fb.setMealDraftIngredients}
                        mealManualRemoveFromFridge={fb.mealManualRemoveFromFridge}
                        setMealManualRemoveFromFridge={fb.setMealManualRemoveFromFridge}
                        addMealManual={fb.addMealManual}
                        addMealIngredientRow={fb.addMealIngredientRow}
                        updateIngredientInList={fb.updateIngredientInList}
                        adjustIngredientQuantityInList={fb.adjustIngredientQuantityInList}
                        removeIngredientRowFromList={fb.removeIngredientRowFromList}
                        mealFromRecipesName={fb.mealFromRecipesName}
                        setMealFromRecipesName={fb.setMealFromRecipesName}
                        selectedMealRecipeIds={fb.selectedMealRecipeIds}
                        setMealRecipeSelection={fb.setMealRecipeSelection}
                        mealFromRecipesRemoveFromFridge={fb.mealFromRecipesRemoveFromFridge}
                        setMealFromRecipesRemoveFromFridge={fb.setMealFromRecipesRemoveFromFridge}
                        addMealFromRecipes={fb.addMealFromRecipes}
                        removeMeal={fb.removeMeal}
                        removeMealIngredient={fb.removeMealIngredient}
                        updateMealCalories={fb.updateMealCalories}
                        mealImportPaste={fb.mealImportPaste}
                        setMealImportPaste={fb.setMealImportPaste}
                        mealImportPreview={fb.mealImportPreview}
                        mealImportError={fb.mealImportError}
                        mealImportSuccess={fb.mealImportSuccess}
                        mealImportRemoveFromFridge={fb.mealImportRemoveFromFridge}
                        setMealImportRemoveFromFridge={fb.setMealImportRemoveFromFridge}
                        mealImportAddToRecipes={fb.mealImportAddToRecipes}
                        setMealImportAddToRecipes={fb.setMealImportAddToRecipes}
                        previewMealImport={fb.previewMealImport}
                        confirmMealImport={fb.confirmMealImport}
                        clearMealImport={fb.clearMealImport}
                    />
                )}

                {fb.activeTab === 'money' && (
                    <MoneyTab
                        expenses={fb.expenses}
                        expenseCategories={fb.expenseCategories}
                        expenseTitle={fb.expenseTitle}
                        setExpenseTitle={fb.setExpenseTitle}
                        expenseDate={fb.expenseDate}
                        setExpenseDate={fb.setExpenseDate}
                        expenseCategory={fb.expenseCategory}
                        setExpenseCategory={fb.setExpenseCategory}
                        expensePrice={fb.expensePrice}
                        setExpensePrice={fb.setExpensePrice}
                        expenseDraftItems={fb.expenseDraftItems}
                        expenseImportPaste={fb.expenseImportPaste}
                        setExpenseImportPaste={fb.setExpenseImportPaste}
                        expenseImportPreview={fb.expenseImportPreview}
                        expenseImportError={fb.expenseImportError}
                        expenseImportSuccess={fb.expenseImportSuccess}
                        expenseChartFilter={fb.expenseChartFilter}
                        setExpenseChartFilter={fb.setExpenseChartFilter}
                        addExpense={fb.addExpense}
                        addExpenseItemRow={fb.addExpenseItemRow}
                        updateExpenseDraftItem={fb.updateExpenseDraftItem}
                        removeExpenseDraftItem={fb.removeExpenseDraftItem}
                        previewExpenseImport={fb.previewExpenseImport}
                        confirmExpenseImport={fb.confirmExpenseImport}
                        clearExpenseImport={fb.clearExpenseImport}
                        removeExpense={fb.removeExpense}
                        openEditExpenseModal={fb.openEditExpenseModal}
                        openAddExpenseCategoryModal={fb.openAddExpenseCategoryModal}
                        openDeleteExpenseCategoryModal={fb.openDeleteExpenseCategoryModal}
                    />
                )}
            </div>

            {fb.editingFridgeItem && (
                <EditFridgeItemModal
                    editingFridgeItem={fb.editingFridgeItem}
                    isSeasoningFridgeItem={fb.isSeasoningFridgeItem}
                    usesFridgeCapacityTracking={fb.usesFridgeCapacityTracking}
                    isLeftoverFridgeItem={fb.isLeftoverFridgeItem}
                    editFridgeQuantity={fb.editFridgeQuantity}
                    setEditFridgeQuantity={fb.setEditFridgeQuantity}
                    editFridgeUnit={fb.editFridgeUnit}
                    setEditFridgeUnit={fb.setEditFridgeUnit}
                    adjustEditFridgeQuantity={fb.adjustEditFridgeQuantity}
                    editFridgeSeasoningStatus={fb.editFridgeSeasoningStatus}
                    adjustEditFridgeSeasoningStatus={fb.adjustEditFridgeSeasoningStatus}
                    editFridgeLeftoverName={fb.editFridgeLeftoverName}
                    setEditFridgeLeftoverName={fb.setEditFridgeLeftoverName}
                    editFridgeLeftoverDays={fb.editFridgeLeftoverDays}
                    setEditFridgeLeftoverDays={fb.setEditFridgeLeftoverDays}
                    adjustEditFridgeLeftoverDays={fb.adjustEditFridgeLeftoverDays}
                    editFridgeExpirationValue={fb.editFridgeExpirationValue}
                    setEditFridgeExpirationValue={fb.setEditFridgeExpirationValue}
                    editFridgeExpirationUnit={fb.editFridgeExpirationUnit}
                    setEditFridgeExpirationUnit={fb.setEditFridgeExpirationUnit}
                    adjustEditFridgeExpirationValue={fb.adjustEditFridgeExpirationValue}
                    closeEditFridgeItemModal={fb.closeEditFridgeItemModal}
                    saveFridgeItemEdit={fb.saveFridgeItemEdit}
                />
            )}

            {fb.addLeftoverModalOpen && (
                <AddLeftoverModal
                    recipes={fb.recipes}
                    leftoverRecipeId={fb.leftoverRecipeId}
                    setLeftoverRecipeSelection={fb.setLeftoverRecipeSelection}
                    leftoverName={fb.leftoverName}
                    setLeftoverName={fb.setLeftoverName}
                    leftoverExpirationDays={fb.leftoverExpirationDays}
                    setLeftoverExpirationDays={fb.setLeftoverExpirationDays}
                    adjustLeftoverExpirationDays={fb.adjustLeftoverExpirationDays}
                    closeAddLeftoverModal={fb.closeAddLeftoverModal}
                    addLeftover={fb.addLeftover}
                />
            )}

            {fb.editingExpenseId !== null && (
                <EditExpenseModal
                    expenseCategories={fb.expenseCategories}
                    editExpenseTitle={fb.editExpenseTitle}
                    setEditExpenseTitle={fb.setEditExpenseTitle}
                    editExpenseDate={fb.editExpenseDate}
                    setEditExpenseDate={fb.setEditExpenseDate}
                    editExpenseCategory={fb.editExpenseCategory}
                    setEditExpenseCategory={fb.setEditExpenseCategory}
                    editExpensePrice={fb.editExpensePrice}
                    setEditExpensePrice={fb.setEditExpensePrice}
                    editExpenseDraftItems={fb.editExpenseDraftItems}
                    addEditExpenseItemRow={fb.addEditExpenseItemRow}
                    updateEditExpenseDraftItem={fb.updateEditExpenseDraftItem}
                    removeEditExpenseDraftItem={fb.removeEditExpenseDraftItem}
                    closeEditExpenseModal={fb.closeEditExpenseModal}
                    saveExpenseEdit={fb.saveExpenseEdit}
                />
            )}

            {fb.deleteExpenseCategoryModalOpen && (
                <DeleteExpenseCategoryModal
                    customExpenseCategories={fb.customExpenseCategories}
                    deleteExpenseCategoryId={fb.deleteExpenseCategoryId}
                    setDeleteExpenseCategoryId={fb.setDeleteExpenseCategoryId}
                    deleteExpenseCategoryError={fb.deleteExpenseCategoryError}
                    closeDeleteExpenseCategoryModal={fb.closeDeleteExpenseCategoryModal}
                    deleteExpenseCategory={fb.deleteExpenseCategory}
                />
            )}

            {fb.addExpenseCategoryModalOpen && (
                <AddExpenseCategoryModal
                    newExpenseCategoryName={fb.newExpenseCategoryName}
                    setNewExpenseCategoryName={fb.setNewExpenseCategoryName}
                    expenseCategoryError={fb.expenseCategoryError}
                    closeAddExpenseCategoryModal={fb.closeAddExpenseCategoryModal}
                    addExpenseCategory={fb.addExpenseCategory}
                />
            )}

            {fb.addCatalogModalOpen && (
                <AddCatalogModal
                    catalogName={fb.catalogName}
                    setCatalogName={fb.setCatalogName}
                    catalogCategory={fb.catalogCategory}
                    setCatalogCategory={fb.setCatalogCategory}
                    catalogDefaultUnit={fb.catalogDefaultUnit}
                    setCatalogDefaultUnit={fb.setCatalogDefaultUnit}
                    catalogExpirationDays={fb.catalogExpirationDays}
                    setCatalogExpirationDays={fb.setCatalogExpirationDays}
                    catalogCalories={fb.catalogCalories}
                    setCatalogCalories={fb.setCatalogCalories}
                    adjustCatalogCalories={fb.adjustCatalogCalories}
                    adjustCatalogExpirationDays={fb.adjustCatalogExpirationDays}
                    closeAddCatalogModal={fb.closeAddCatalogModal}
                    addCatalogItem={fb.addCatalogItem}
                />
            )}

            {fb.editingCatalogItemId !== null && (
                <EditCatalogModal
                    editCatalogName={fb.editCatalogName}
                    setEditCatalogName={fb.setEditCatalogName}
                    editCatalogCategory={fb.editCatalogCategory}
                    setEditCatalogCategory={fb.setEditCatalogCategory}
                    editCatalogExpirationDays={fb.editCatalogExpirationDays}
                    setEditCatalogExpirationDays={fb.setEditCatalogExpirationDays}
                    editCatalogCalories={fb.editCatalogCalories}
                    setEditCatalogCalories={fb.setEditCatalogCalories}
                    adjustEditCatalogCalories={fb.adjustEditCatalogCalories}
                    editCatalogDefaultUnit={fb.editCatalogDefaultUnit}
                    setEditCatalogDefaultUnit={fb.setEditCatalogDefaultUnit}
                    editCatalogDefaultStatus={fb.editCatalogDefaultStatus}
                    setEditCatalogDefaultStatus={fb.setEditCatalogDefaultStatus}
                    adjustEditExpirationDays={fb.adjustEditExpirationDays}
                    closeEditCatalogModal={fb.closeEditCatalogModal}
                    saveCatalogItemEdit={fb.saveCatalogItemEdit}
                    deleteCatalogItemFromModal={fb.deleteCatalogItemFromModal}
                />
            )}

            {fb.editingRecipeId !== null && (
                <EditRecipeModal
                    catalogItems={fb.catalogItems}
                    editRecipeName={fb.editRecipeName}
                    setEditRecipeName={fb.setEditRecipeName}
                    editRecipeCalories={fb.editRecipeCalories}
                    setEditRecipeCalories={fb.setEditRecipeCalories}
                    adjustEditRecipeCalories={fb.adjustEditRecipeCalories}
                    editDraftIngredients={fb.editDraftIngredients}
                    setEditDraftIngredients={fb.setEditDraftIngredients}
                    addIngredientRowToList={fb.addIngredientRowToList}
                    updateIngredientInList={fb.updateIngredientInList}
                    adjustIngredientQuantityInList={fb.adjustIngredientQuantityInList}
                    removeIngredientRowFromList={fb.removeIngredientRowFromList}
                    closeEditRecipeModal={fb.closeEditRecipeModal}
                    saveRecipeEdit={fb.saveRecipeEdit}
                    deleteRecipeFromModal={fb.deleteRecipeFromModal}
                />
            )}

            {fb.importUnmatchedConfirm && (
                <ImportUnmatchedConfirmModal
                    title={fb.importUnmatchedConfirm.title}
                    description={fb.importUnmatchedConfirm.description}
                    items={fb.importUnmatchedConfirm.items}
                    onCancel={fb.cancelImportUnmatchedModal}
                    onConfirm={fb.confirmImportUnmatchedModal}
                />
            )}

            {fb.duplicateFridgeConfirm && (
                <DuplicateFridgeConfirmModal
                    existingAmount={fb.duplicateFridgeConfirm.existingAmount}
                    expirySummary={fb.duplicateFridgeConfirm.expirySummary}
                    onCancel={fb.cancelDuplicateFridgeAdd}
                    onConfirm={fb.confirmDuplicateFridgeAdd}
                />
            )}

            {fb.emptyFridgeConfirmOpen && (
                <EmptyFridgeConfirmModal
                    itemCount={fb.items.length}
                    onCancel={fb.cancelEmptyFridge}
                    onConfirm={fb.confirmEmptyFridge}
                />
            )}

            {fb.viewingRecipeId !== null && (
                <RecipeViewModal
                    recipe={fb.viewingRecipe}
                    catalogItems={fb.catalogItems}
                    items={fb.items}
                    toggleRecipeShowQuantities={fb.toggleRecipeShowQuantities}
                    closeViewRecipeModal={fb.closeViewRecipeModal}
                />
            )}

            {fb.recipeAddToFridgeRecipe && (
                <RecipeAddToFridgeModal
                    recipe={fb.recipeAddToFridgeRecipe}
                    draftIngredients={fb.recipeAddToFridgeDraft}
                    catalogItems={fb.catalogItems}
                    updateDraftItem={fb.updateRecipeAddToFridgeDraftItem}
                    adjustDraftQuantity={fb.adjustRecipeAddToFridgeDraftQuantity}
                    removeDraftItem={fb.removeRecipeAddToFridgeDraftItem}
                    closeModal={fb.closeRecipeAddToFridgePreview}
                    confirmAddToFridge={fb.confirmRecipeAddToFridge}
                />
            )}
        </div>
        </>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<FridgeBuddy />);
