function MealsTab({
    catalogItems, recipes, meals,
    mealName, setMealName,
    mealDraftIngredients, setMealDraftIngredients,
    mealManualRemoveFromFridge, setMealManualRemoveFromFridge,
    addMealManual, addMealIngredientRow,
    updateIngredientInList, adjustIngredientQuantityInList, removeIngredientRowFromList,
    mealFromRecipesName, setMealFromRecipesName,
    selectedMealRecipeIds, setMealRecipeSelection,
    mealFromRecipesRemoveFromFridge, setMealFromRecipesRemoveFromFridge,
    addMealFromRecipes, removeMeal, removeMealIngredient,
    updateMealCalories,
    mealImportPaste, setMealImportPaste,
    mealImportPreview, mealImportError,
    mealImportSuccess,
    mealImportRemoveFromFridge, setMealImportRemoveFromFridge,
    mealImportAddToRecipes, setMealImportAddToRecipes,
    previewMealImport, confirmMealImport, clearMealImport
}) {
    const { useState, useEffect } = React;
    const { RecipeIngredientEditor, ImportMealSection, MealCard, CollapsibleCard, SectionHeroHeader, AddPanelModal } = window.FBComponents;
    const { formatCalories, groupMealsByDay, serializeDraftIngredients } = window.FB;
    const [addPanelOpen, setAddPanelOpen] = useState(false);
    const mealDayGroups = groupMealsByDay(meals, catalogItems);
    const sortedRecipes = [...recipes].sort((a, b) => a.name.localeCompare(b.name));
    const selectedRecipeId = selectedMealRecipeIds[0] != null ? String(selectedMealRecipeIds[0]) : '';
    const manualMealIngredients = serializeDraftIngredients(mealDraftIngredients, catalogItems);
    const canAddManualMeal = Boolean(mealName.trim()) && manualMealIngredients.length > 0;

    useEffect(() => {
        if (!mealImportSuccess) return;
        setAddPanelOpen(false);
    }, [mealImportSuccess]);

    const handleAddMealManual = () => {
        if (!canAddManualMeal) return;
        addMealManual();
        setAddPanelOpen(false);
    };

    const handleAddMealFromRecipes = () => {
        if (selectedMealRecipeIds.length === 0) return;
        addMealFromRecipes();
        setAddPanelOpen(false);
    };

    const addPanelContent = (
        <div className="meals-section-box">
            <div className="meals-add-columns">
                <div className="meals-add-option">
                    <p className="meals-option-label">Option A: Using AI</p>
                    <ImportMealSection
                        mealImportPaste={mealImportPaste}
                        setMealImportPaste={setMealImportPaste}
                        mealImportPreview={mealImportPreview}
                        mealImportError={mealImportError}
                        mealImportSuccess={mealImportSuccess}
                        mealImportRemoveFromFridge={mealImportRemoveFromFridge}
                        setMealImportRemoveFromFridge={setMealImportRemoveFromFridge}
                        mealImportAddToRecipes={mealImportAddToRecipes}
                        setMealImportAddToRecipes={setMealImportAddToRecipes}
                        previewMealImport={previewMealImport}
                        confirmMealImport={confirmMealImport}
                        clearMealImport={clearMealImport}
                    />
                </div>

                <div className="meals-add-option">
                    <p className="meals-option-label">Option B: Add manually</p>
                    <div className="meals-add-column-card">
                        <input
                            type="text"
                            placeholder="Meal name"
                            value={mealName}
                            onChange={(e) => setMealName(e.target.value)}
                            style={{ marginBottom: '8px', fontSize: '13px', padding: '8px 10px' }}
                        />
                        {catalogItems.length === 0 && (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: '0 0 8px 0' }}>
                                Add items in the Grocery store first.
                            </p>
                        )}
                        <RecipeIngredientEditor
                            ingredients={mealDraftIngredients}
                            setIngredients={setMealDraftIngredients}
                            catalogItems={catalogItems}
                            updateIngredientInList={updateIngredientInList}
                            adjustIngredientQuantityInList={adjustIngredientQuantityInList}
                            removeIngredientRowFromList={removeIngredientRowFromList}
                        />
                        <button
                            type="button"
                            onClick={addMealIngredientRow}
                            disabled={catalogItems.length === 0}
                            className="meals-dashed-btn"
                        >
                            Add item
                        </button>
                        <label className="meals-option-check">
                            <input
                                type="checkbox"
                                checked={mealManualRemoveFromFridge}
                                onChange={(e) => setMealManualRemoveFromFridge(e.target.checked)}
                            />
                            Remove ingredients from fridge
                        </label>
                        <button
                            type="button"
                            onClick={handleAddMealManual}
                            disabled={!canAddManualMeal}
                            className="meals-add-btn"
                        >
                            Add meal
                        </button>
                    </div>
                </div>

                <div className="meals-add-option">
                    <p className="meals-option-label">Option C: Add from recipes</p>
                    <div className="meals-add-column-card">
                        <input
                            type="text"
                            placeholder="Meal name (optional)"
                            value={mealFromRecipesName}
                            onChange={(e) => setMealFromRecipesName(e.target.value)}
                            style={{ marginBottom: '8px', fontSize: '13px', padding: '8px 10px' }}
                        />
                        <select
                            className="meals-recipe-select"
                            value={selectedRecipeId}
                            onChange={(e) => setMealRecipeSelection(e.target.value)}
                            aria-label="Search recipes"
                        >
                            <option value="">Search recipes</option>
                            {sortedRecipes.length === 0 ? (
                                <option value="" disabled>No recipes yet</option>
                            ) : (
                                sortedRecipes.map(recipe => (
                                    <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
                                ))
                            )}
                        </select>
                        <label className="meals-option-check">
                            <input
                                type="checkbox"
                                checked={mealFromRecipesRemoveFromFridge}
                                onChange={(e) => setMealFromRecipesRemoveFromFridge(e.target.checked)}
                            />
                            Remove ingredients from fridge
                        </label>
                        <button
                            type="button"
                            onClick={handleAddMealFromRecipes}
                            disabled={selectedMealRecipeIds.length === 0}
                            className="meals-add-btn"
                        >
                            Add meal
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
                    title="Your meals"
                    addLabel="Add meal"
                    onAdd={() => setAddPanelOpen(true)}
                />
                {meals.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No meals logged yet</p>
                ) : (
                    mealDayGroups.map(group => (
                        <div key={group.key} className="meals-day-group">
                            <div className="meals-day-header">
                                <h3 className="meals-day-title">{group.label}</h3>
                                {group.totalCalories > 0 && (
                                    <span className="meals-day-calories">
                                        {formatCalories(group.totalCalories)} cal
                                    </span>
                                )}
                            </div>
                            {group.meals.map(meal => {
                                const loggedTime = meal.loggedAt ? window.FB.formatMealTime(meal.loggedAt) : '';
                                return (
                                    <div key={meal.id} className="fb-card fb-card--collapsible">
                                        <CollapsibleCard
                                            title={meal.name}
                                            subtitle={loggedTime || undefined}
                                        >
                                            <MealCard
                                                meal={meal}
                                                catalogItems={catalogItems}
                                                hideTitle
                                                onRemove={removeMeal}
                                                onRemoveIngredient={removeMealIngredient}
                                                onUpdateCalories={updateMealCalories}
                                            />
                                        </CollapsibleCard>
                                    </div>
                                );
                            })}
                        </div>
                    ))
                )}
            </section>

            <AddPanelModal
                title="Add meal"
                open={addPanelOpen}
                onClose={() => setAddPanelOpen(false)}
            >
                {addPanelContent}
            </AddPanelModal>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.MealsTab = MealsTab;
