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
    const { RecipeIngredientEditor, ImportMealSection, MealCard } = window.FBComponents;
    const { formatCalories, groupMealsByDay, serializeDraftIngredients } = window.FB;
    const mealDayGroups = groupMealsByDay(meals, catalogItems);
    const sortedRecipes = [...recipes].sort((a, b) => a.name.localeCompare(b.name));
    const selectedRecipeId = selectedMealRecipeIds[0] != null ? String(selectedMealRecipeIds[0]) : '';
    const manualMealIngredients = serializeDraftIngredients(mealDraftIngredients, catalogItems);
    const canAddManualMeal = Boolean(mealName.trim()) && manualMealIngredients.length > 0;

    return (
        <div>
            <section className="meals-section">
                <div className="meals-section-box">
                    <h2 className="meals-section-title">Add a meal</h2>

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
                                onClick={addMealManual}
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
                                onClick={addMealFromRecipes}
                                disabled={selectedMealRecipeIds.length === 0}
                                className="meals-add-btn"
                            >
                                Add meal
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            </section>

            <section className="meals-section">
                <h2 className="meals-section-title">Your meals</h2>
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
                            {group.meals.map(meal => (
                                <div key={meal.id} style={{ ...window.FB_STYLES.card, marginBottom: '12px' }}>
                                    <MealCard
                                        meal={meal}
                                        catalogItems={catalogItems}
                                        onRemove={removeMeal}
                                        onRemoveIngredient={removeMealIngredient}
                                        onUpdateCalories={updateMealCalories}
                                    />
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.MealsTab = MealsTab;
