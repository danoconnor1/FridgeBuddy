function RecipeCard({ recipe, catalogItems, items, isSeasoningFridgeItem, toggleRecipeShowQuantities, onEdit, onUpdateCalories }) {
    const { RecipeIngredientList, CaloriesField } = window.FBComponents;
    const displayCalories = window.FB.getRecipeDisplayCalories(recipe, catalogItems);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>{recipe.name}</p>
                    <button
                        type="button"
                        onClick={() => toggleRecipeShowQuantities(recipe.id)}
                        style={{
                            background: 'none', border: 'none', padding: 0, fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                            color: recipe.showQuantities ? 'var(--fill-accent)' : 'var(--text-secondary)'
                        }}
                    >
                        {recipe.showQuantities ? 'Hide fridge quantities' : 'Show fridge quantities'}
                    </button>
                </div>
                {onUpdateCalories ? (
                    <div style={{ marginBottom: '8px', maxWidth: '240px' }}>
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
                    <div style={{ marginBottom: '8px', maxWidth: '240px' }}>
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
                    isSeasoningFridgeItem={isSeasoningFridgeItem}
                />
            </div>
            {onEdit && (
                <button
                    onClick={() => onEdit(recipe)}
                    style={{
                        width: '32px', height: '32px', background: 'var(--fill-accent)', border: 'none',
                        borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 0, flexShrink: 0, color: '#ffffff'
                    }}
                    aria-label={`Edit ${recipe.name}`}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 20h4l10.5-10.5a2.828 2.828 0 1 0-4-4L4 16v4" />
                        <path d="M13.5 6.5l4 4" />
                    </svg>
                </button>
            )}
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.RecipeCard = RecipeCard;
