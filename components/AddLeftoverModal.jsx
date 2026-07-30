function AddLeftoverModal({
    leftoverName, setLeftoverName,
    leftoverExpirationDays, setLeftoverExpirationDays,
    adjustLeftoverExpirationDays,
    closeAddLeftoverModal, addLeftover
}) {
    const { modalOverlay, modalCard, stepBtn } = window.FB_STYLES;

    return (
        <div style={modalOverlay} onClick={closeAddLeftoverModal}>
            <div style={{ ...modalCard, maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontSize: '18px', fontWeight: '500', margin: '0 0 1rem 0' }}>Add leftover</h3>
                <label style={{ display: 'block', marginBottom: '12px' }}>
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Name</span>
                    <input
                        type="text"
                        placeholder="e.g. Chicken stir fry"
                        value={leftoverName}
                        onChange={(e) => setLeftoverName(e.target.value)}
                        style={{ marginBottom: 0 }}
                    />
                </label>
                <label style={{ display: 'block', marginBottom: '1rem' }}>
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Days until expiration</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button type="button" onClick={() => adjustLeftoverExpirationDays(-1)} style={stepBtn} aria-label="Decrease days until expiration">−</button>
                        <input
                            type="number"
                            min="1"
                            value={leftoverExpirationDays}
                            onChange={(e) => {
                                const raw = e.target.value;
                                if (raw === '') { setLeftoverExpirationDays(''); return; }
                                const val = Number(raw);
                                if (!isNaN(val)) setLeftoverExpirationDays(val);
                            }}
                            onBlur={() => setLeftoverExpirationDays(prev => Math.max(1, Number(prev) || 1))}
                            style={{ width: '64px', marginBottom: 0, textAlign: 'center', flexShrink: 0 }}
                            aria-label="Days until expiration"
                        />
                        <button type="button" onClick={() => adjustLeftoverExpirationDays(1)} style={stepBtn} aria-label="Increase days until expiration">+</button>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>days</span>
                    </div>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={closeAddLeftoverModal} style={{ flex: 1, padding: '10px', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px' }}>Cancel</button>
                    <button onClick={addLeftover} style={{ flex: 1, padding: '10px', background: 'var(--fill-accent)', color: 'var(--on-accent)', border: 'none', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px' }}>Add leftover</button>
                </div>
            </div>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.AddLeftoverModal = AddLeftoverModal;
