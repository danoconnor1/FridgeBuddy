function GroceryStoreTab({
    catalogItems, groupedCatalogItems, groceryStoreSearch, setGroceryStoreSearch,
    catalogAddSuccess, openAddCatalogModal, addedToFridgeItemId,
    getCatalogDraft, updateCatalogDraft, adjustCatalogDraftField,
    isSeasoningCatalogItem, addFromCatalogRow, openEditCatalogModal,
    adjustCatalogItemCalories
}) {
    const { UNITS, formatCategory, formatUnitLabel, SEASONING_STATUSES } = window.FB;
    const { categoryHeading, smallStepBtn, tickerLabel, compactSelect } = window.FB_STYLES;
    const filteredCount = groupedCatalogItems.reduce((sum, g) => sum + g.items.length, 0);

    return (
        <div>
            <h3 style={{ fontSize: '15px', fontWeight: '500', margin: '0 0 1rem 0' }}>Items</h3>

            {catalogAddSuccess ? (
                <p style={{
                    width: '100%', padding: '10px', marginBottom: '1rem', textAlign: 'center',
                    fontSize: '14px', fontWeight: '500', color: 'var(--fill-success)'
                }}>
                    Added to grocery store
                </p>
            ) : (
                <button
                    onClick={openAddCatalogModal}
                    style={{
                        width: '100%', padding: '10px', marginBottom: '1rem', background: 'var(--fill-accent)', color: '#ffffff',
                        border: 'none', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px'
                    }}
                >
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
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No items yet. Add the things you keep in your fridge.</p>
            ) : filteredCount === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No items match your search.</p>
            ) : (
                groupedCatalogItems.map(group => (
                    <div key={group.category} className="grocery-category-group" data-category={group.category} style={{ marginBottom: '1.5rem' }}>
                        <h4 className="food-category-heading" style={categoryHeading}>{formatCategory(group.category)}</h4>
                        {group.items.map(item => {
                            const draft = getCatalogDraft(item);
                            const isSeasoning = isSeasoningCatalogItem(item);
                            return (
                                <div key={item.id} style={{
                                    background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '12px',
                                    padding: '0.75rem 1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px'
                                }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '14px', fontWeight: '500', margin: '0' }}>{item.name}</p>
                                    </div>
                                    <div style={{
                                        display: 'grid', gridTemplateColumns: '24px 22px auto auto 22px',
                                        gap: '4px 6px', alignItems: 'center', flexShrink: 0
                                    }}>
                                        {isSeasoning ? (
                                            <>
                                                <span style={tickerLabel}>Lvl</span>
                                                <select
                                                    value={draft.seasoningStatus}
                                                    onChange={(e) => { e.stopPropagation(); updateCatalogDraft(item, { seasoningStatus: e.target.value }); }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{ ...compactSelect, gridColumn: '2 / 6', width: '100%' }}
                                                    aria-label="Seasoning level"
                                                >
                                                    {SEASONING_STATUSES.map(status => (
                                                        <option key={status.value} value={status.value}>{status.label}</option>
                                                    ))}
                                                </select>
                                                <span style={tickerLabel}>Qt</span>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); adjustCatalogDraftField(item, 'quantity', -1); }} style={smallStepBtn} aria-label="Decrease quantity">−</button>
                                                <span style={{ minWidth: '16px', textAlign: 'center', fontSize: '12px', fontWeight: '500' }}>{draft.quantity}</span>
                                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>piece</span>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); adjustCatalogDraftField(item, 'quantity', 1); }} style={smallStepBtn} aria-label="Increase quantity">+</button>
                                            </>
                                        ) : (
                                            <>
                                                <span style={tickerLabel}>Exp</span>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); adjustCatalogDraftField(item, 'expirationValue', -1); }} style={smallStepBtn} aria-label="Decrease expiration">−</button>
                                                <span style={{ minWidth: '16px', textAlign: 'center', fontSize: '12px', fontWeight: '500' }}>{draft.expirationValue}</span>
                                                <select
                                                    value={draft.expirationUnit}
                                                    onChange={(e) => { e.stopPropagation(); updateCatalogDraft(item, { expirationUnit: e.target.value }); }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{ ...compactSelect, width: '72px' }}
                                                    aria-label="Expiration unit"
                                                >
                                                    <option value="days">days</option>
                                                    <option value="months">months</option>
                                                </select>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); adjustCatalogDraftField(item, 'expirationValue', 1); }} style={smallStepBtn} aria-label="Increase expiration">+</button>
                                                <span style={tickerLabel}>Cal</span>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); adjustCatalogItemCalories(item.id, -10); }} style={smallStepBtn} aria-label="Decrease calories per serving">−</button>
                                                <span style={{ minWidth: '16px', textAlign: 'center', fontSize: '12px', fontWeight: '500' }}>
                                                    {item.caloriesPerDefault != null ? window.FB.formatCalories(item.caloriesPerDefault) : '—'}
                                                </span>
                                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>cal</span>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); adjustCatalogItemCalories(item.id, 10); }} style={smallStepBtn} aria-label="Increase calories per serving">+</button>
                                                <span style={tickerLabel}>Qt</span>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); adjustCatalogDraftField(item, 'quantity', -1); }} style={smallStepBtn} aria-label="Decrease quantity">−</button>
                                                <span style={{ minWidth: '16px', textAlign: 'center', fontSize: '12px', fontWeight: '500' }}>{draft.quantity}</span>
                                                <select
                                                    value={draft.unit}
                                                    onChange={(e) => { e.stopPropagation(); updateCatalogDraft(item, { unit: e.target.value }); }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{ ...compactSelect, width: '88px' }}
                                                    aria-label="Quantity unit"
                                                >
                                                    {UNITS.map(unit => (
                                                        <option key={unit.abbr} value={unit.abbr}>{formatUnitLabel(unit)}</option>
                                                    ))}
                                                </select>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); adjustCatalogDraftField(item, 'quantity', 1); }} style={smallStepBtn} aria-label="Increase quantity">+</button>
                                            </>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                                        {addedToFridgeItemId === item.id ? (
                                            <span style={{ padding: '6px 10px', fontSize: '12px', fontWeight: '500', color: 'var(--fill-success)', whiteSpace: 'nowrap' }}>
                                                Added to fridge
                                            </span>
                                        ) : (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); addFromCatalogRow(item); }}
                                                style={{
                                                    padding: '6px 10px', background: 'var(--fill-lime)', color: '#ffffff', border: 'none',
                                                    borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '12px', whiteSpace: 'nowrap', cursor: 'pointer'
                                                }}
                                            >
                                                Add to fridge
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openEditCatalogModal(item); }}
                                            style={{
                                                width: '32px', height: '32px', background: 'var(--fill-accent)', border: 'none',
                                                borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                padding: 0, flexShrink: 0, color: '#ffffff'
                                            }}
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
