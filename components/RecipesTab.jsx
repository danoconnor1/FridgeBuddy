function RecipesTab({
    catalogItems, recipes, items, recipeName, setRecipeName,
    draftIngredients, setDraftIngredients, addIngredientRow, addRecipe,
    updateIngredientInList, adjustIngredientQuantityInList, removeIngredientRowFromList,
    toggleRecipeShowQuantities, openEditRecipeModal, isSeasoningFridgeItem
}) {
    const { RecipeIngredientEditor, RecipeCard } = window.FBComponents;

    return (
        <div>
            <div style={{ ...window.FB_STYLES.card, marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 12px 0' }}>Add recipe</h3>
                <input
                    type="text"
                    placeholder="Recipe name"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    style={{ marginBottom: '12px' }}
                />
                {catalogItems.length === 0 && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 12px 0' }}>
                        Add items in the Grocery store before adding ingredients.
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
                    onClick={addIngredientRow}
                    disabled={catalogItems.length === 0}
                    style={{
                        width: '100%', padding: '10px', background: 'transparent',
                        color: catalogItems.length === 0 ? 'var(--text-muted)' : 'var(--fill-accent)',
                        border: `1px dashed ${catalogItems.length === 0 ? 'var(--border)' : 'var(--fill-accent)'}`,
                        borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px', marginBottom: '12px',
                        cursor: catalogItems.length === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    Add item
                </button>
                <button
                    onClick={addRecipe}
                    style={{
                        width: '100%', padding: '10px', background: 'var(--fill-accent)', color: 'var(--on-accent)',
                        border: 'none', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px'
                    }}
                >
                    Add recipe
                </button>
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: '500', margin: '1.5rem 0 1rem 0' }}>Your recipes</h3>
            {recipes.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No recipes yet</p>
            ) : (
                recipes.map(recipe => (
                    <div key={recipe.id} style={window.FB_STYLES.card}>
                        <RecipeCard
                            recipe={recipe}
                            items={items}
                            isSeasoningFridgeItem={isSeasoningFridgeItem}
                            toggleRecipeShowQuantities={toggleRecipeShowQuantities}
                            onEdit={openEditRecipeModal}
                        />
                    </div>
                ))
            )}
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.RecipesTab = RecipesTab;
