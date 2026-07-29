function AddCatalogModal({
    catalogName, setCatalogName, catalogCategory, setCatalogCategory,
    catalogDefaultUnit, setCatalogDefaultUnit, catalogExpirationDays, setCatalogExpirationDays,
    adjustCatalogExpirationDays, closeAddCatalogModal, addCatalogItem
}) {
    const { CATEGORIES, UNITS, formatCategory, formatUnitLabel, isSeasoningCategory } = window.FB;
    const { modalOverlay, modalCard, stepBtn } = window.FB_STYLES;

    return (
        <div style={modalOverlay} onClick={closeAddCatalogModal}>
            <div style={{ ...modalCard, maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontSize: '18px', fontWeight: '500', margin: '0 0 1rem 0' }}>Add item to grocery store</h3>
                <label style={{ display: 'block', marginBottom: '12px' }}>
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Item name</span>
                    <input type="text" placeholder="Item name" value={catalogName} onChange={(e) => setCatalogName(e.target.value)} style={{ marginBottom: 0 }} />
                </label>
                <label style={{ display: 'block', marginBottom: '12px' }}>
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Food group</span>
                    <select
                        value={catalogCategory}
                        onChange={(e) => {
                            const category = e.target.value;
                            setCatalogCategory(category);
                            if (isSeasoningCategory(category)) setCatalogDefaultUnit('piece');
                        }}
                        style={{ marginBottom: 0 }}
                    >
                        {CATEGORIES.map(category => (
                            <option key={category} value={category}>{formatCategory(category)}</option>
                        ))}
                    </select>
                </label>
                {!isSeasoningCategory(catalogCategory) && (
                    <label style={{ display: 'block', marginBottom: '12px' }}>
                        <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Unit of measurement</span>
                        <select value={catalogDefaultUnit} onChange={(e) => setCatalogDefaultUnit(e.target.value)} style={{ marginBottom: 0 }}>
                            {UNITS.map(unit => (
                                <option key={unit.abbr} value={unit.abbr}>{formatUnitLabel(unit)}</option>
                            ))}
                        </select>
                    </label>
                )}
                {!isSeasoningCategory(catalogCategory) && (
                    <label style={{ display: 'block', marginBottom: '1rem' }}>
                        <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Days until expiration</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button type="button" onClick={() => adjustCatalogExpirationDays(-1)} style={stepBtn} aria-label="Decrease days until expiration">−</button>
                            <input
                                type="number"
                                min="1"
                                value={catalogExpirationDays}
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    if (raw === '') { setCatalogExpirationDays(''); return; }
                                    const val = Number(raw);
                                    if (!isNaN(val)) setCatalogExpirationDays(val);
                                }}
                                onBlur={() => setCatalogExpirationDays(prev => Math.max(1, Number(prev) || 1))}
                                style={{ width: '64px', marginBottom: 0, textAlign: 'center', flexShrink: 0 }}
                                aria-label="Days until expiration"
                            />
                            <button type="button" onClick={() => adjustCatalogExpirationDays(1)} style={stepBtn} aria-label="Increase days until expiration">+</button>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>days</span>
                        </div>
                    </label>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={closeAddCatalogModal} style={{ flex: 1, padding: '10px', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px' }}>Cancel</button>
                    <button onClick={addCatalogItem} style={{ flex: 1, padding: '10px', background: 'var(--fill-accent)', color: 'var(--on-accent)', border: 'none', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px' }}>Add item</button>
                </div>
            </div>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.AddCatalogModal = AddCatalogModal;
