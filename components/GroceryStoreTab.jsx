function GroceryStoreTab({
    catalogItems, groupedCatalogItems, groceryStoreSearch, setGroceryStoreSearch,
    catalogAddSuccess, openAddCatalogModal, addedToFridgeItemId,
    getCatalogDraft, updateCatalogDraft, adjustCatalogDraftField,
    isSeasoningCatalogItem, addFromCatalogRow, openEditCatalogModal
}) {
    const { UNITS, formatCategory, formatUnitLabel, formatCalories, estimateCatalogDraftCalories, SEASONING_STATUSES } = window.FB;
    const { categoryHeading } = window.FB_STYLES;
    const filteredCount = groupedCatalogItems.reduce((sum, g) => sum + g.items.length, 0);

    return (
        <div>
            <h3 className="grocery-store-heading">Items</h3>

            {catalogAddSuccess ? (
                <p className="grocery-store-success">Added to grocery store</p>
            ) : (
                <button type="button" onClick={openAddCatalogModal} className="grocery-store-add-btn">
                    Add new item to the grocery store
                </button>
            )}

            {catalogItems.length > 0 && (
                <input
                    type="text"
                    placeholder="Search items..."
                    value={groceryStoreSearch}
                    onChange={(e) => setGroceryStoreSearch(e.target.value)}
                    style={{ marginBottom: '1rem' }}
                    aria-label="Search grocery store items"
                />
            )}
            {catalogItems.length === 0 ? (
                <p className="grocery-store-empty">No items yet. Add the things you keep in your fridge.</p>
            ) : filteredCount === 0 ? (
                <p className="grocery-store-empty">No items match your search.</p>
            ) : (
                groupedCatalogItems.map(group => (
                    <div key={group.category} className="grocery-category-group" data-category={group.category} style={{ marginBottom: '1.5rem' }}>
                        <h4 className="food-category-heading" style={categoryHeading}>{formatCategory(group.category)}</h4>
                        {group.items.map(item => {
                            const draft = getCatalogDraft(item);
                            const isSeasoning = isSeasoningCatalogItem(item);
                            const draftCalories = estimateCatalogDraftCalories(item, draft);
                            return (
                                <div key={item.id} className="grocery-store-item">
                                    <div className="grocery-store-item-info">
                                        <p className="grocery-store-item-name">{item.name}</p>
                                        {!isSeasoning && (
                                            <p className="grocery-store-item-cal">
                                                {draftCalories != null ? `${formatCalories(draftCalories)} cal` : '— cal'}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grocery-store-item-ticker">
                                        {isSeasoning ? (
                                            <>
                                                <span className="grocery-store-ticker-label">Lvl</span>
                                                <select
                                                    value={draft.seasoningStatus}
                                                    onChange={(e) => { e.stopPropagation(); updateCatalogDraft(item, { seasoningStatus: e.target.value }); }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="grocery-store-ticker-select grocery-store-ticker-select--wide"
                                                    aria-label="Seasoning level"
                                                >
                                                    {SEASONING_STATUSES.map(status => (
                                                        <option key={status.value} value={status.value}>{status.label}</option>
                                                    ))}
                                                </select>
                                                <span className="grocery-store-ticker-label">Qt</span>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); adjustCatalogDraftField(item, 'quantity', -1); }} className="grocery-store-ticker-step" aria-label="Decrease quantity">−</button>
                                                <span className="grocery-store-ticker-value">{draft.quantity}</span>
                                                <span className="grocery-store-ticker-unit-text">piece</span>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); adjustCatalogDraftField(item, 'quantity', 1); }} className="grocery-store-ticker-step" aria-label="Increase quantity">+</button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="grocery-store-ticker-label">Exp</span>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); adjustCatalogDraftField(item, 'expirationValue', -1); }} className="grocery-store-ticker-step" aria-label="Decrease expiration">−</button>
                                                <span className="grocery-store-ticker-value">{draft.expirationValue}</span>
                                                <select
                                                    value={draft.expirationUnit}
                                                    onChange={(e) => { e.stopPropagation(); updateCatalogDraft(item, { expirationUnit: e.target.value }); }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="grocery-store-ticker-select grocery-store-ticker-select--exp-unit"
                                                    aria-label="Expiration unit"
                                                >
                                                    <option value="days">days</option>
                                                    <option value="months">months</option>
                                                </select>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); adjustCatalogDraftField(item, 'expirationValue', 1); }} className="grocery-store-ticker-step" aria-label="Increase expiration">+</button>
                                                <span className="grocery-store-ticker-label">Qt</span>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); adjustCatalogDraftField(item, 'quantity', -1); }} className="grocery-store-ticker-step" aria-label="Decrease quantity">−</button>
                                                <span className="grocery-store-ticker-value">{draft.quantity}</span>
                                                <select
                                                    value={draft.unit}
                                                    onChange={(e) => { e.stopPropagation(); updateCatalogDraft(item, { unit: e.target.value }); }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="grocery-store-ticker-select grocery-store-ticker-select--qty-unit"
                                                    aria-label="Quantity unit"
                                                >
                                                    {UNITS.map(unit => (
                                                        <option key={unit.abbr} value={unit.abbr}>{formatUnitLabel(unit)}</option>
                                                    ))}
                                                </select>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); adjustCatalogDraftField(item, 'quantity', 1); }} className="grocery-store-ticker-step" aria-label="Increase quantity">+</button>
                                            </>
                                        )}
                                    </div>
                                    <div className="grocery-store-item-actions">
                                        {addedToFridgeItemId === item.id ? (
                                            <span className="grocery-store-fridge-added">Added to fridge</span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); addFromCatalogRow(item); }}
                                                className="grocery-store-fridge-btn"
                                            >
                                                Add to fridge
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); openEditCatalogModal(item); }}
                                            className="grocery-store-edit-btn"
                                            aria-label={`Edit ${item.name}`}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <path d="M4 20h4l10.5-10.5a2.828 2.828 0 1 0-4-4L4 16v4" />
                                                <path d="M13.5 6.5l4 4" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))
            )}
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.GroceryStoreTab = GroceryStoreTab;
