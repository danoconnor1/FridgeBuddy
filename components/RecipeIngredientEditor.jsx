function RecipeIngredientEditor({ ingredients, setIngredients, catalogItems, updateIngredientInList, adjustIngredientQuantityInList, removeIngredientRowFromList }) {
    const { UNITS, formatCategory, formatUnitLabel, parseIngredientQuantity, MIN_INGREDIENT_QTY } = window.FB;

    if (ingredients.length === 0) return null;

    return (
        <div className="ingredient-editor">
            <p className="ingredient-editor-label">Ingredients</p>
            {ingredients.map((ingredient, index) => {
                const itemQuantity = parseIngredientQuantity(ingredient.quantity);
                const selectedCatalogItemId = ingredient.catalogItemId != null && ingredient.catalogItemId !== ''
                    ? String(ingredient.catalogItemId)
                    : '';
                const selectedCatalogItem = catalogItems.find(item => String(item.id) === selectedCatalogItemId);
                return (
                    <div key={index} className="ingredient-editor-row">
                        <button
                            type="button"
                            onClick={() => adjustIngredientQuantityInList(setIngredients, index, -1)}
                            disabled={itemQuantity <= MIN_INGREDIENT_QTY}
                            className="fb-step-btn ingredient-editor-dec"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={ingredient.quantity === '' ? '' : ingredient.quantity}
                            onChange={(e) => {
                                const raw = e.target.value;
                                if (raw === '' || /^\d*\.?\d*$/.test(raw)) {
                                    updateIngredientInList(setIngredients, index, 'quantity', raw);
                                }
                            }}
                            onBlur={() => {
                                updateIngredientInList(
                                    setIngredients,
                                    index,
                                    'quantity',
                                    window.FB.roundIngredientQuantity(ingredient.quantity)
                                );
                            }}
                            className="ingredient-editor-qty-input"
                            aria-label="Ingredient quantity"
                        />
                        <button
                            type="button"
                            onClick={() => adjustIngredientQuantityInList(setIngredients, index, 1)}
                            className="fb-step-btn ingredient-editor-inc"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                        <select
                            value={ingredient.unit || 'piece'}
                            onChange={(e) => updateIngredientInList(setIngredients, index, 'unit', e.target.value)}
                            className="ingredient-editor-unit"
                            aria-label="Unit of measurement"
                        >
                            {UNITS.map(unit => (
                                <option key={unit.abbr} value={unit.abbr}>{formatUnitLabel(unit)}</option>
                            ))}
                        </select>
                        <select
                            value={selectedCatalogItemId}
                            onChange={(e) => updateIngredientInList(setIngredients, index, 'catalogItemId', e.target.value)}
                            className="ingredient-editor-catalog"
                        >
                            <option value="">Select item</option>
                            {selectedCatalogItemId && !selectedCatalogItem && ingredient.name && (
                                <option value={selectedCatalogItemId}>{ingredient.name}</option>
                            )}
                            {catalogItems.map(item => (
                                <option key={item.id} value={String(item.id)}>
                                    {item.name}{item.category ? ` (${formatCategory(item.category)})` : ''}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => removeIngredientRowFromList(setIngredients, index)}
                            className="ingredient-editor-remove"
                            aria-label="Remove ingredient"
                        >
                            <span aria-hidden="true">−</span>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.RecipeIngredientEditor = RecipeIngredientEditor;
