function EditFridgeItemModal({
    editingFridgeItem,
    isSeasoningFridgeItem, usesFridgeCapacityTracking, isLeftoverFridgeItem,
    editFridgeQuantity, setEditFridgeQuantity,
    editFridgeUnit, setEditFridgeUnit, adjustEditFridgeQuantity,
    editFridgeSeasoningStatus, adjustEditFridgeSeasoningStatus,
    editFridgeLeftoverName, setEditFridgeLeftoverName,
    editFridgeLeftoverDays, setEditFridgeLeftoverDays, adjustEditFridgeLeftoverDays,
    editFridgeExpirationValue, setEditFridgeExpirationValue,
    editFridgeExpirationUnit, setEditFridgeExpirationUnit,
    adjustEditFridgeExpirationValue,
    closeEditFridgeItemModal, saveFridgeItemEdit
}) {
    const {
        UNITS, formatUnitLabel, formatSeasoningStatus, getSeasoningStatusColor,
        roundIngredientQuantity, MIN_INGREDIENT_QTY, parseIngredientQuantity
    } = window.FB;
    const { modalOverlay, modalCard, stepBtn, compactSelect } = window.FB_STYLES;

    if (!editingFridgeItem) return null;

    const isLeftover = isLeftoverFridgeItem(editingFridgeItem);
    const isCatalogSeasoning = isSeasoningFridgeItem(editingFridgeItem);
    const usesCapacity = usesFridgeCapacityTracking(editingFridgeItem);
    const itemQuantity = parseIngredientQuantity(editFridgeQuantity);
    const seasoningColor = getSeasoningStatusColor(editFridgeSeasoningStatus);

    return (
        <div style={modalOverlay} onClick={closeEditFridgeItemModal}>
            <div style={{ ...modalCard, maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontSize: '18px', fontWeight: '500', margin: '0 0 1rem 0' }}>
                    Edit {editingFridgeItem.name}
                </h3>

                {isLeftover ? (
                    <>
                        <label style={{ display: 'block', marginBottom: '12px' }}>
                            <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Name</span>
                            <input
                                type="text"
                                value={editFridgeLeftoverName}
                                onChange={(e) => setEditFridgeLeftoverName(e.target.value)}
                                style={{ marginBottom: 0 }}
                            />
                        </label>
                        <label style={{ display: 'block', marginBottom: '1rem' }}>
                            <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Days until expiration</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button type="button" onClick={() => adjustEditFridgeLeftoverDays(-1)} style={stepBtn} aria-label="Decrease days until expiration">−</button>
                                <input
                                    type="number"
                                    min="1"
                                    value={editFridgeLeftoverDays}
                                    onChange={(e) => {
                                        const raw = e.target.value;
                                        if (raw === '') { setEditFridgeLeftoverDays(''); return; }
                                        const val = Number(raw);
                                        if (!isNaN(val)) setEditFridgeLeftoverDays(val);
                                    }}
                                    onBlur={() => setEditFridgeLeftoverDays(prev => Math.max(1, Number(prev) || 1))}
                                    style={{ width: '64px', marginBottom: 0, textAlign: 'center', flexShrink: 0 }}
                                    aria-label="Days until expiration"
                                />
                                <button type="button" onClick={() => adjustEditFridgeLeftoverDays(1)} style={stepBtn} aria-label="Increase days until expiration">+</button>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>days</span>
                            </div>
                        </label>
                    </>
                ) : usesCapacity ? (
                    <>
                        <label style={{ display: 'block', marginBottom: isCatalogSeasoning ? '1rem' : '12px' }}>
                            <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Amount left</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => adjustEditFridgeSeasoningStatus(-1)}
                                    disabled={editFridgeSeasoningStatus === 'almost-empty'}
                                    style={stepBtn}
                                    aria-label="Decrease amount left"
                                >−</button>
                                <span style={{ minWidth: '100px', textAlign: 'center', fontSize: '14px', fontWeight: '500', color: seasoningColor }}>
                                    {formatSeasoningStatus(editFridgeSeasoningStatus)}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => adjustEditFridgeSeasoningStatus(1)}
                                    disabled={editFridgeSeasoningStatus === 'full'}
                                    style={stepBtn}
                                    aria-label="Increase amount left"
                                >+</button>
                            </div>
                        </label>
                        {!isCatalogSeasoning && (
                            <label style={{ display: 'block', marginBottom: '1rem' }}>
                                <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Expiration</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button type="button" onClick={() => adjustEditFridgeExpirationValue(-1)} style={stepBtn} aria-label="Decrease expiration">−</button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editFridgeExpirationValue}
                                        onChange={(e) => {
                                            const raw = e.target.value;
                                            if (raw === '') { setEditFridgeExpirationValue(''); return; }
                                            const val = Number(raw);
                                            if (!isNaN(val)) setEditFridgeExpirationValue(raw);
                                        }}
                                        onBlur={() => setEditFridgeExpirationValue(prev => String(Math.max(1, Number(prev) || 1)))}
                                        style={{ width: '64px', marginBottom: 0, textAlign: 'center', flexShrink: 0 }}
                                        aria-label="Expiration value"
                                    />
                                    <select
                                        value={editFridgeExpirationUnit}
                                        onChange={(e) => setEditFridgeExpirationUnit(e.target.value)}
                                        style={{ ...compactSelect, width: '88px', marginBottom: 0, flexShrink: 0 }}
                                        aria-label="Expiration unit"
                                    >
                                        <option value="days">days</option>
                                        <option value="months">months</option>
                                    </select>
                                    <button type="button" onClick={() => adjustEditFridgeExpirationValue(1)} style={stepBtn} aria-label="Increase expiration">+</button>
                                </div>
                            </label>
                        )}
                    </>
                ) : (
                    <>
                        <label style={{ display: 'block', marginBottom: '12px' }}>
                            <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Quantity</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => adjustEditFridgeQuantity(-1)}
                                    disabled={itemQuantity <= MIN_INGREDIENT_QTY}
                                    style={{ ...stepBtn, opacity: itemQuantity <= MIN_INGREDIENT_QTY ? 0.4 : 1 }}
                                    aria-label="Decrease quantity"
                                >−</button>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={editFridgeQuantity}
                                    onChange={(e) => {
                                        const raw = e.target.value;
                                        if (raw === '' || /^\d*\.?\d*$/.test(raw)) {
                                            setEditFridgeQuantity(raw);
                                        }
                                    }}
                                    onBlur={() => setEditFridgeQuantity(String(roundIngredientQuantity(editFridgeQuantity)))}
                                    style={{ width: '64px', marginBottom: 0, textAlign: 'center', flexShrink: 0 }}
                                    aria-label="Quantity"
                                />
                                <button type="button" onClick={() => adjustEditFridgeQuantity(1)} style={stepBtn} aria-label="Increase quantity">+</button>
                            </div>
                        </label>
                        <label style={{ display: 'block', marginBottom: '12px' }}>
                            <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Unit</span>
                            <select
                                value={editFridgeUnit}
                                onChange={(e) => setEditFridgeUnit(e.target.value)}
                                style={{ ...compactSelect, width: '100%', marginBottom: 0 }}
                                aria-label="Unit of measurement"
                            >
                                {UNITS.map(unit => (
                                    <option key={unit.abbr} value={unit.abbr}>{formatUnitLabel(unit)}</option>
                                ))}
                            </select>
                        </label>
                        <label style={{ display: 'block', marginBottom: '1rem' }}>
                            <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Expiration</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button type="button" onClick={() => adjustEditFridgeExpirationValue(-1)} style={stepBtn} aria-label="Decrease expiration">−</button>
                                <input
                                    type="number"
                                    min="1"
                                    value={editFridgeExpirationValue}
                                    onChange={(e) => {
                                        const raw = e.target.value;
                                        if (raw === '') { setEditFridgeExpirationValue(''); return; }
                                        const val = Number(raw);
                                        if (!isNaN(val)) setEditFridgeExpirationValue(raw);
                                    }}
                                    onBlur={() => setEditFridgeExpirationValue(prev => String(Math.max(1, Number(prev) || 1)))}
                                    style={{ width: '64px', marginBottom: 0, textAlign: 'center', flexShrink: 0 }}
                                    aria-label="Expiration value"
                                />
                                <select
                                    value={editFridgeExpirationUnit}
                                    onChange={(e) => setEditFridgeExpirationUnit(e.target.value)}
                                    style={{ ...compactSelect, width: '88px', marginBottom: 0, flexShrink: 0 }}
                                    aria-label="Expiration unit"
                                >
                                    <option value="days">days</option>
                                    <option value="months">months</option>
                                </select>
                                <button type="button" onClick={() => adjustEditFridgeExpirationValue(1)} style={stepBtn} aria-label="Increase expiration">+</button>
                            </div>
                        </label>
                    </>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={closeEditFridgeItemModal} style={{ flex: 1, padding: '10px', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px' }}>Cancel</button>
                    <button onClick={saveFridgeItemEdit} style={{ flex: 1, padding: '10px', background: 'var(--fill-accent)', color: 'var(--on-accent)', border: 'none', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px' }}>Save</button>
                </div>
            </div>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.EditFridgeItemModal = EditFridgeItemModal;
