function FridgeBuddy() {
    const fb = useFridgeBuddy();
    const {
        HomeTab, GroceryStoreTab, FridgeTab, RecipesTab,
        AddCatalogModal, EditCatalogModal, EditRecipeModal, RecipeViewModal,
        DuplicateFridgeConfirmModal
    } = window.FBComponents;

    const tabBtnStyle = (tab) => ({
        flex: 1,
        minWidth: '64px',
        padding: '12px 8px',
        border: 'none',
        background: fb.activeTab === tab ? 'var(--surface-1)' : 'transparent',
        borderBottom: fb.activeTab === tab ? '2px solid var(--fill-accent)' : 'none',
        fontSize: '13px',
        fontWeight: '500',
        color: fb.activeTab === tab ? 'var(--fill-accent)' : 'var(--text-secondary)'
    });

    return (
        <div style={{ fontFamily: 'inherit', color: 'var(--text-primary)', minHeight: '100vh', background: 'var(--surface-0)', padding: '1rem' }}>
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <i className="ti ti-fridge" style={{ fontSize: '28px', color: 'var(--fill-accent)' }} aria-hidden="true"></i>
                    <h1 style={{ fontSize: '24px', fontWeight: '500', margin: '0' }}>Fridge Buddy</h1>
                </div>

                <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
                    <button onClick={() => fb.setActiveTab('home')} style={tabBtnStyle('home')}>Home</button>
                    <button onClick={() => fb.setActiveTab('allItems')} style={tabBtnStyle('allItems')}>Grocery store</button>
                    <button onClick={() => fb.setActiveTab('fridge')} style={tabBtnStyle('fridge')}>Fridge</button>
                    <button onClick={() => fb.setActiveTab('recipes')} style={tabBtnStyle('recipes')}>Recipes</button>
                </div>

                {fb.activeTab === 'home' && (
                    <HomeTab
                        lowSeasoningItems={fb.lowSeasoningItems}
                        expiringItems={fb.expiringItems}
                        expiredItems={fb.expiredItems}
                        readyToMakeRecipes={fb.readyToMakeRecipes}
                        almostThereRecipes={fb.almostThereRecipes}
                        items={fb.items}
                        recipes={fb.recipes}
                        catalogItems={fb.catalogItems}
                        openViewRecipeModal={fb.openViewRecipeModal}
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
                        filteredFridgeItems={fb.filteredFridgeItems}
                        fridgeItemGroups={fb.fridgeItemGroups}
                        fridgeSearch={fb.fridgeSearch}
                        setFridgeSearch={fb.setFridgeSearch}
                        fridgeSort={fb.fridgeSort}
                        setFridgeSort={fb.setFridgeSort}
                        isSeasoningFridgeItem={fb.isSeasoningFridgeItem}
                        adjustFridgeSeasoningStatus={fb.adjustFridgeSeasoningStatus}
                        adjustItemQuantity={fb.adjustItemQuantity}
                        removeItem={fb.removeItem}
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
                        isSeasoningFridgeItem={fb.isSeasoningFridgeItem}
                    />
                )}
            </div>

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

            {fb.duplicateFridgeConfirm && (
                <DuplicateFridgeConfirmModal
                    existingAmount={fb.duplicateFridgeConfirm.existingAmount}
                    expirySummary={fb.duplicateFridgeConfirm.expirySummary}
                    onCancel={fb.cancelDuplicateFridgeAdd}
                    onConfirm={fb.confirmDuplicateFridgeAdd}
                />
            )}

            {fb.viewingRecipeId !== null && (
                <RecipeViewModal
                    recipe={fb.viewingRecipe}
                    items={fb.items}
                    isSeasoningFridgeItem={fb.isSeasoningFridgeItem}
                    toggleRecipeShowQuantities={fb.toggleRecipeShowQuantities}
                    closeViewRecipeModal={fb.closeViewRecipeModal}
                />
            )}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<FridgeBuddy />);
