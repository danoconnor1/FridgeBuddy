function RecipesTab({
    catalogItems, recipes, items, recipeName, setRecipeName,
    draftIngredients, setDraftIngredients, addIngredientRow, addRecipe,
    updateIngredientInList, adjustIngredientQuantityInList, removeIngredientRowFromList,
    toggleRecipeShowQuantities, openEditRecipeModal, updateRecipeCalories,
    recipeImportPaste, setRecipeImportPaste,
    recipeImportPreview, recipeImportError,
    recipeImportSuccess,
    previewRecipeImport, confirmRecipeImport, clearRecipeImport
}) {
    const { RecipeIngredientEditor, RecipeCard, ImportRecipeSection } = window.FBComponents;
    const { serializeDraftIngredients } = window.FB;
    const manualRecipeIngredients = serializeDraftIngredients(draftIngredients, catalogItems);
    const canAddRecipe = Boolean(recipeName.trim()) && manualRecipeIngredients.length > 0;

    return (
        <div>
            <section className="meals-section">
                <div className="meals-section-box">
                    <h2 className="meals-section-title">Add recipe</h2>

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
                                    onClick={addRecipe}
                                    disabled={!canAddRecipe}
                                    className="meals-add-btn"
                                >
                                    Add recipe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="meals-section">
                <h2 className="meals-section-title">Your recipes</h2>
                {recipes.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No recipes yet</p>
                ) : (
                    recipes.map(recipe => (
                        <div key={recipe.id} style={{ ...window.FB_STYLES.card, marginBottom: '12px' }}>
                            <RecipeCard
                                recipe={recipe}
                                catalogItems={catalogItems}
                                items={items}
                                toggleRecipeShowQuantities={toggleRecipeShowQuantities}
                                onEdit={openEditRecipeModal}
                                onUpdateCalories={updateRecipeCalories}
                            />
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.RecipesTab = RecipesTab;
