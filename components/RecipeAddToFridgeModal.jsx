function RecipeAddToFridgeModal({
    recipe, draftIngredients, catalogItems,
    updateDraftItem, adjustDraftQuantity, removeDraftItem,
    closeModal, confirmAddToFridge
}) {
    const {
        UNITS, formatUnitLabel, parseIngredientQuantity, roundIngredientQuantity,
        MIN_INGREDIENT_QTY, isSeasoningCategory, findCatalogItemForIngredient
    } = window.FB;

    const addableCount = draftIngredients.filter(item => item.catalogItemId).length;

    return (
        <div className="fb-modal-overlay" onClick={closeModal}>
            <div className="fb-modal-card" onClick={(e) => e.stopPropagation()}>
                <h3 className="fb-modal-title" style={{ marginBottom: '0.35rem' }}>Add to fridge</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
                    {recipe.name}
                </p>

                {draftIngredients.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 1rem 0' }}>
                        This recipe has no ingredients.
                    </p>
                ) : (
                    <div className="meals-import-preview" style={{ marginBottom: '1rem' }}>
                        <h5 className="import-preview-heading">Preview</h5>
                        {draftIngredients.map((ingredient, index) => {
                            const catalogItem = findCatalogItemForIngredient(ingredient, catalogItems);
                            const isSeasoning = catalogItem ? isSeasoningCategory(catalogItem.category) : false;
                            const itemQuantity = parseIngredientQuantity(ingredient.quantity);
                            const canAdd = Boolean(ingredient.catalogItemId && catalogItem);
                            const displayName = catalogItem?.name || ingredient.name || 'Unknown item';

                            return (
                                <div key={index} className="meals-preview-row recipe-add-fridge-preview-row">
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p className="preview-row-name" style={{ fontSize: '12px' }}>{displayName}</p>
                                        {!canAdd && (
                                            <p style={{ fontSize: '11px', color: 'var(--text-warning)', margin: 0 }}>
                                                Not in grocery store — cannot add
                                            </p>
                                        )}
                                        {canAdd && (
                                            <div className="recipe-add-fridge-qty-row">
                                                <button
                                                    type="button"
                                                    onClick={() => adjustDraftQuantity(index, -1)}
                                                    disabled={itemQuantity <= MIN_INGREDIENT_QTY}
                                                    className="fb-step-btn"
                                                    aria-label={`Decrease quantity for ${displayName}`}
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
                                                            updateDraftItem(index, 'quantity', raw);
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        updateDraftItem(
                                                            index,
                                                            'quantity',
                                                            roundIngredientQuantity(ingredient.quantity)
                                                        );
                                                    }}
                                                    className="ingredient-editor-qty-input"
                                                    aria-label={`Quantity for ${displayName}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => adjustDraftQuantity(index, 1)}
                                                    className="fb-step-btn"
                                                    aria-label={`Increase quantity for ${displayName}`}
                                                >
                                                    +
                                                </button>
                                                {isSeasoning ? (
                                                    <span className="grocery-store-ticker-unit-text">piece</span>
                                                ) : (
                                                    <select
                                                        value={ingredient.unit || 'piece'}
                                                        onChange={(e) => updateDraftItem(index, 'unit', e.target.value)}
                                                        className="ingredient-editor-unit"
                                                        aria-label={`Unit for ${displayName}`}
                                                    >
                                                        {UNITS.map(unit => (
                                                            <option key={unit.abbr} value={unit.abbr}>
                                                                {formatUnitLabel(unit)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeDraftItem(index)}
                                        className="ingredient-editor-remove"
                                        style={{ width: '28px', height: '28px', fontSize: '18px' }}
                                        aria-label={`Remove ${displayName} from preview`}
                                    >
                                        −
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="fb-modal-actions">
                    <button
                        type="button"
                        onClick={closeModal}
                        style={{
                            flex: 1, padding: '10px', background: 'transparent', color: 'var(--text-primary)',
                            border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={confirmAddToFridge}
                        disabled={addableCount === 0}
                        className="grocery-store-fridge-btn"
                        style={{
                            flex: 1, padding: '10px',
                            opacity: addableCount === 0 ? 0.5 : 1,
                            cursor: addableCount === 0 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Add {addableCount} item{addableCount === 1 ? '' : 's'} to fridge
                    </button>
                </div>
            </div>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.RecipeAddToFridgeModal = RecipeAddToFridgeModal;
