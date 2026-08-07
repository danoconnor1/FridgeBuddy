function RecipeCard({
    recipe, catalogItems, items, toggleRecipeShowQuantities,
    onEdit, onUpdateCalories, onAddToFridge
}) {
    const { RecipeIngredientList, CaloriesField } = window.FBComponents;
    const displayCalories = window.FB.getRecipeDisplayCalories(recipe, catalogItems);

    return (
        <div className="recipe-card">
            <div className="recipe-card-body">
                <div className="recipe-card-header">
                    <p className="recipe-card-name">{recipe.name}</p>
                    <button
                        type="button"
                        onClick={() => toggleRecipeShowQuantities(recipe.id)}
                        className={`recipe-card-toggle-qty${recipe.showQuantities ? ' is-active' : ''}`}
                    >
                        {recipe.showQuantities ? 'Hide fridge quantities' : 'Show fridge quantities'}
                    </button>
                </div>
                {onUpdateCalories ? (
                    <div className="recipe-card-calories">
                        <CaloriesField
                            label="Calories"
                            value={displayCalories != null ? String(displayCalories) : ''}
                            onChange={(value) => onUpdateCalories(recipe.id, value)}
                            onAdjust={(delta) => {
                                const current = displayCalories ?? 0;
                                onUpdateCalories(recipe.id, String(window.FB.adjustCalories(current, delta)));
                            }}
                        />
                    </div>
                ) : displayCalories != null && (
                    <div className="recipe-card-calories">
                        <CaloriesField
                            label="Calories"
                            value={String(displayCalories)}
                            readOnly
                        />
                    </div>
                )}
                <RecipeIngredientList
                    ingredients={recipe.ingredients}
                    showQuantities={recipe.showQuantities}
                    fridgeItems={items}
                    catalogItems={catalogItems}
                />
            </div>
            {(onAddToFridge || onEdit) && (
                <div className="recipe-card-actions">
                    {onAddToFridge && (
                        <button
                            type="button"
                            onClick={() => onAddToFridge(recipe)}
                            disabled={!recipe.ingredients?.length}
                            className="recipe-card-add-fridge-btn"
                        >
                            Add to fridge
                        </button>
                    )}
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(recipe)}
                            className="recipe-card-edit-btn"
                            aria-label={`Edit ${recipe.name}`}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M4 20h4l10.5-10.5a2.828 2.828 0 1 0-4-4L4 16v4" />
                                <path d="M13.5 6.5l4 4" />
                            </svg>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.RecipeCard = RecipeCard;
