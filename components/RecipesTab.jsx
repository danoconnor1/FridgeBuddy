function RecipesTab({
    catalogItems, recipes, items, recipeName, setRecipeName,
    recipeUrl, setRecipeUrl,
    draftIngredients, setDraftIngredients, addIngredientRow, addRecipe,
    updateIngredientInList, adjustIngredientQuantityInList, removeIngredientRowFromList,
    toggleRecipeShowQuantities, openEditRecipeModal, updateRecipeCalories, openRecipeAddToFridgePreview,
    recipeImportPaste, setRecipeImportPaste,
    recipeImportPreview, recipeImportError,
    recipeImportSuccess,
    previewRecipeImport, confirmRecipeImport, clearRecipeImport
}) {
    const { useState, useEffect } = React;
    const { RecipeIngredientEditor, RecipeCard, ImportRecipeSection, SectionHeroHeader, AddPanelModal } = window.FBComponents;
    const { serializeDraftIngredients } = window.FB;
    const [addPanelOpen, setAddPanelOpen] = useState(false);
    const manualRecipeIngredients = serializeDraftIngredients(draftIngredients, catalogItems);
    const canAddRecipe = Boolean(recipeName.trim()) && manualRecipeIngredients.length > 0;

    useEffect(() => {
        if (!recipeImportSuccess) return;
        setAddPanelOpen(false);
    }, [recipeImportSuccess]);

    const handleAddRecipe = () => {
        if (!canAddRecipe) return;
        addRecipe();
        setAddPanelOpen(false);
    };

    const addPanelContent = (
        <div className="meals-section-box">
            <div className="recipes-add-columns">
                <div className="meals-add-option">
                    <p className="meals-option-label">Option A: Using AI</p>
                    <ImportRecipeSection
                        recipeImportPaste={recipeImportPaste}
                        setRecipeImportPaste={setRecipeImportPaste}
                        recipeImportPreview={recipeImportPreview}
                        recipeImportError={recipeImportError}
                        recipeImportSuccess={recipeImportSuccess}
                        previewRecipeImport={previewRecipeImport}
                        confirmRecipeImport={confirmRecipeImport}
                        clearRecipeImport={clearRecipeImport}
                    />
                </div>

                <div className="meals-add-option">
                    <p className="meals-option-label">Option B: Add manually</p>
                    <div className="meals-add-column-card">
                        <input
                            type="text"
                            placeholder="Recipe name"
                            value={recipeName}
                            onChange={(e) => setRecipeName(e.target.value)}
                            style={{ marginBottom: '8px', fontSize: '13px', padding: '8px 10px' }}
                        />
                        <input
                            type="url"
                            placeholder="Recipe link (optional)"
                            value={recipeUrl}
                            onChange={(e) => setRecipeUrl(e.target.value)}
                            style={{ marginBottom: '8px', fontSize: '13px', padding: '8px 10px' }}
                        />
                        {catalogItems.length === 0 && (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: '0 0 8px 0' }}>
                                Add items in the Grocery store first.
                            </p>
                        )}
                        <RecipeIngredientEditor
                            ingredients={draftIngredients}
                            setIngredients={setDraftIngredients}
                            catalogItems={catalogItems}
                            updateIngredientInList={updateIngredientInList}
                            adjustIngredientQuantityInList={adjustIngredientQuantityInList}
                            removeIngredientRowFromList={removeIngredientRowFromList}
                        />
                        <button
                            type="button"
                            onClick={addIngredientRow}
                            disabled={catalogItems.length === 0}
                            className="meals-dashed-btn"
                        >
                            Add item
                        </button>
                        <button
                            type="button"
                            onClick={handleAddRecipe}
                            disabled={!canAddRecipe}
                            className="meals-add-btn"
                        >
                            Add recipe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <section className="meals-section">
                <SectionHeroHeader
                    title="Your recipes"
                    addLabel="Add recipe"
                    onAdd={() => setAddPanelOpen(true)}
                />
                {recipes.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No recipes yet</p>
                ) : (
                    recipes.map(recipe => (
                        <div key={recipe.id} className="fb-card fb-card--collapsible">
                            <RecipeCard
                                recipe={recipe}
                                catalogItems={catalogItems}
                                items={items}
                                toggleRecipeShowQuantities={toggleRecipeShowQuantities}
                                onEdit={openEditRecipeModal}
                                onUpdateCalories={updateRecipeCalories}
                                onAddToFridge={openRecipeAddToFridgePreview}
                            />
                        </div>
                    ))
                )}
            </section>

            <AddPanelModal
                title="Add recipe"
                open={addPanelOpen}
                onClose={() => setAddPanelOpen(false)}
            >
                {addPanelContent}
            </AddPanelModal>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.RecipesTab = RecipesTab;
