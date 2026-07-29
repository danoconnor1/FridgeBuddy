function EditCatalogModal({
    editCatalogName, setEditCatalogName, editCatalogCategory, setEditCatalogCategory,
    editCatalogExpirationDays, editCatalogDefaultStatus, setEditCatalogDefaultStatus,
    adjustEditExpirationDays, closeEditCatalogModal, saveCatalogItemEdit, deleteCatalogItemFromModal
}) {
    const { CATEGORIES, SEASONING_STATUSES, formatCategory, isSeasoningCategory } = window.FB;
    const { modalOverlay, modalCard, stepBtn } = window.FB_STYLES;

    return (
        <div style={modalOverlay} onClick={closeEditCatalogModal}>
            <div style={{ ...modalCard, maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontSize: '18px', fontWeight: '500', margin: '0 0 1rem 0' }}>Edit item</h3>
                <label style={{ display: 'block', marginBottom: '12px' }}>
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Item name</span>
                    <input type="text" placeholder="Item name" value={editCatalogName} onChange={(e) => setEditCatalogName(e.target.value)} style={{ marginBottom: 0 }} />
                </label>
                <label style={{ display: 'block', marginBottom: '12px' }}>
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Food group</span>
                    <select
                        value={editCatalogCategory}
                        onChange={(e) => {
                            const category = e.target.value;
                            setEditCatalogCategory(category);
                            if (isSeasoningCategory(category)) setEditCatalogDefaultStatus('full');
                        }}
                        style={{ marginBottom: 0 }}
                    >
                        <option value="">Select food group</option>
                        {CATEGORIES.map(category => (
                            <option key={category} value={category}>{formatCategory(category)}</option>
                        ))}
                    </select>
                </label>
                {isSeasoningCategory(editCatalogCategory) ? (
                    <label style={{ display: 'block', marginBottom: '1rem' }}>
                        <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Default level</span>
                        <select value={editCatalogDefaultStatus} onChange={(e) => setEditCatalogDefaultStatus(e.target.value)} style={{ marginBottom: 0 }}>
                            {SEASONING_STATUSES.map(status => (
                                <option key={status.value} value={status.value}>{status.label}</option>
                            ))}
                        </select>
                    </label>
                ) : (
                    <label style={{ display: 'block', marginBottom: '1rem' }}>
                        <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Expiration</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button type="button" onClick={() => adjustEditExpirationDays(-1)} style={stepBtn} aria-label="Decrease days until expiration">−</button>
                            <span style={{ minWidth: '56px', textAlign: 'center', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                                {editCatalogExpirationDays}
                            </span>
                            <button type="button" onClick={() => adjustEditExpirationDays(1)} style={stepBtn} aria-label="Increase days until expiration">+</button>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px', flexShrink: 0 }}>days</span>
                        </div>
                    </label>
                )}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <button onClick={closeEditCatalogModal} style={{ flex: 1, padding: '10px', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px' }}>Cancel</button>
                    <button onClick={saveCatalogItemEdit} style={{ flex: 1, padding: '10px', background: 'var(--fill-accent)', color: 'var(--on-accent)', border: 'none', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px' }}>Save</button>
                </div>
                <button onClick={deleteCatalogItemFromModal} style={{ width: '100%', padding: '10px', background: 'var(--fill-danger)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px' }}>Delete</button>
            </div>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.EditCatalogModal = EditCatalogModal;
