function RecipeIngredientEditor({ ingredients, setIngredients, catalogItems, updateIngredientInList, adjustIngredientQuantityInList, removeIngredientRowFromList }) {
    const { UNITS, formatCategory, formatUnitLabel, parseIngredientQuantity, MIN_INGREDIENT_QTY } = window.FB;
    const { smallStepBtn, compactSelect } = window.FB_STYLES;

    if (ingredients.length === 0) return null;

    return (
        <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>Ingredients</p>
            {ingredients.map((ingredient, index) => {
                const itemQuantity = parseIngredientQuantity(ingredient.quantity);
                const selectedCatalogItemId = ingredient.catalogItemId != null && ingredient.catalogItemId !== ''
                    ? String(ingredient.catalogItemId)
                    : '';
                const selectedCatalogItem = catalogItems.find(item => String(item.id) === selectedCatalogItemId);
                return (
                    <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                        <button
                            type="button"
                            onClick={() => adjustIngredientQuantityInList(setIngredients, index, -1)}
                            disabled={itemQuantity <= MIN_INGREDIENT_QTY}
                            style={{
                                ...smallStepBtn,
                                opacity: itemQuantity <= MIN_INGREDIENT_QTY ? 0.4 : 1,
                                cursor: itemQuantity <= MIN_INGREDIENT_QTY ? 'not-allowed' : 'pointer'
                            }}
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
                            style={{
                                width: '48px',
                                marginBottom: 0,
                                textAlign: 'center',
                                flexShrink: 0,
                                padding: '4px 6px',
                                fontSize: '12px'
                            }}
                            aria-label="Ingredient quantity"
                        />
                        <button
                            type="button"
                            onClick={() => adjustIngredientQuantityInList(setIngredients, index, 1)}
                            style={smallStepBtn}
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                        <select
                            value={ingredient.unit || 'piece'}
                            onChange={(e) => updateIngredientInList(setIngredients, index, 'unit', e.target.value)}
                            style={{ ...compactSelect, width: '88px', flexShrink: 0 }}
                            aria-label="Unit of measurement"
                        >
                            {UNITS.map(unit => (
                                <option key={unit.abbr} value={unit.abbr}>{formatUnitLabel(unit)}</option>
                            ))}
                        </select>
                        <select
                            value={selectedCatalogItemId}
                            onChange={(e) => updateIngredientInList(setIngredients, index, 'catalogItemId', e.target.value)}
                            style={{ flex: 1, marginBottom: 0, minWidth: 0 }}
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
                            style={{
                                width: '32px',
                                height: '32px',
                                background: 'var(--fill-danger)',
                                border: 'none',
                                borderRadius: 'var(--radius)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                                flexShrink: 0
                            }}
                            aria-label="Remove ingredient"
                        >
                            <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: '600', lineHeight: 1 }} aria-hidden="true">−</span>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.RecipeIngredientEditor = RecipeIngredientEditor;
