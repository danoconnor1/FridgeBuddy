function FridgeTab({
    items, filteredFridgeItems, fridgeItemGroups, fridgeSearch, setFridgeSearch,
    fridgeSort, setFridgeSort, isSeasoningFridgeItem,
    adjustFridgeSeasoningStatus, adjustItemQuantity, removeItem
}) {
    const {
        formatExpiresIn, formatSeasoningStatus, getDaysUntilExpiry,
        getFridgeItemQuantity, getItemQuantityDisplay, getSeasoningStatusColor
    } = window.FB;
    const { categoryHeading } = window.FB_STYLES;

    return (
        <div>
            {items.length > 0 && (
                <input
                    type="text"
                    placeholder="Search items..."
                    value={fridgeSearch}
                    onChange={(e) => setFridgeSearch(e.target.value)}
                    style={{ marginBottom: '1.5rem' }}
                    aria-label="Search fridge items"
                />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', margin: '1.5rem 0 1rem 0' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '500', margin: '0' }}>Your items</h3>
                {items.length > 0 && (
                    <select
                        value={fridgeSort}
                        onChange={(e) => setFridgeSort(e.target.value)}
                        style={{ marginBottom: 0, width: 'auto', flexShrink: 0 }}
                        aria-label="Sort fridge items"
                    >
                        <option value="category">Food group</option>
                        <option value="expiration">Expiration</option>
                    </select>
                )}
            </div>

            {items.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No items yet</p>
            ) : filteredFridgeItems.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No items match your search.</p>
            ) : (
                fridgeItemGroups.map(group => (
                    <div key={group.key} style={{ marginBottom: '1.5rem' }}>
                        <h4 style={categoryHeading}>{group.label}</h4>
                        {group.items.map(item => {
                            const isSeasoning = isSeasoningFridgeItem(item);
                            const itemQuantity = getFridgeItemQuantity(item);
                            const days = isSeasoning ? null : getDaysUntilExpiry(item.expiry);
                            let statusColor = isSeasoning
                                ? getSeasoningStatusColor(item.seasoningStatus)
                                : 'var(--fill-success)';
                            let statusText = isSeasoning
                                ? formatSeasoningStatus(item.seasoningStatus)
                                : (days > 3 ? 'Fresh' : days <= 0 ? 'Expired' : 'Expiring soon');
                            if (!isSeasoning) {
                                if (days <= 0) statusColor = 'var(--fill-danger)';
                                else if (days <= 3) statusColor = 'var(--fill-warning)';
                            }

                            return (
                                <div key={item.id} style={{
                                    ...window.FB_STYLES.card,
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px'
                                }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 4px 0' }}>{item.name}</p>
                                        {!isSeasoning && (
                                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0' }}>
                                                {formatExpiresIn(item.expiry)}
                                            </p>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '12px' }}>
                                            <i className="ti ti-circle-filled" style={{ fontSize: '8px', color: statusColor }} aria-hidden="true"></i>
                                            <span style={{ color: statusColor }}>{statusText}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                        {isSeasoning ? (
                                            <>
                                                <button
                                                    onClick={() => adjustFridgeSeasoningStatus(item.id, -1)}
                                                    disabled={(item.seasoningStatus || 'full') === 'almost-empty'}
                                                    style={{
                                                        width: '32px', height: '32px', background: 'var(--surface-0)', border: '1px solid var(--border)',
                                                        borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        padding: 0, color: 'var(--text-primary)', fontSize: '20px', fontWeight: '600', lineHeight: 1,
                                                        opacity: (item.seasoningStatus || 'full') === 'almost-empty' ? 0.4 : 1,
                                                        cursor: (item.seasoningStatus || 'full') === 'almost-empty' ? 'not-allowed' : 'pointer'
                                                    }}
                                                    aria-label={`Decrease ${item.name} status`}
                                                >−</button>
                                                <span style={{ minWidth: '88px', textAlign: 'center', fontSize: '13px', fontWeight: '500', color: statusColor }}>
                                                    {formatSeasoningStatus(item.seasoningStatus)}
                                                </span>
                                                <button
                                                    onClick={() => adjustFridgeSeasoningStatus(item.id, 1)}
                                                    disabled={(item.seasoningStatus || 'full') === 'full'}
                                                    style={{
                                                        width: '32px', height: '32px', background: 'var(--surface-0)', border: '1px solid var(--border)',
                                                        borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        padding: 0, color: 'var(--text-primary)', fontSize: '20px', fontWeight: '600', lineHeight: 1,
                                                        opacity: (item.seasoningStatus || 'full') === 'full' ? 0.4 : 1,
                                                        cursor: (item.seasoningStatus || 'full') === 'full' ? 'not-allowed' : 'pointer'
                                                    }}
                                                    aria-label={`Increase ${item.name} status`}
                                                >+</button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => adjustItemQuantity(item.id, -1)}
                                                    disabled={itemQuantity <= 1}
                                                    style={{
                                                        width: '32px', height: '32px', background: 'var(--surface-0)', border: '1px solid var(--border)',
                                                        borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        padding: 0, color: 'var(--text-primary)', fontSize: '20px', fontWeight: '600', lineHeight: 1,
                                                        opacity: itemQuantity <= 1 ? 0.4 : 1,
                                                        cursor: itemQuantity <= 1 ? 'not-allowed' : 'pointer'
                                                    }}
                                                    aria-label={`Decrease ${item.name} quantity`}
                                                >−</button>
                                                <span style={{ minWidth: '56px', textAlign: 'center', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                                                    {getItemQuantityDisplay(item)}
                                                </span>
                                                <button
                                                    onClick={() => adjustItemQuantity(item.id, 1)}
                                                    style={{
                                                        width: '32px', height: '32px', background: 'var(--surface-0)', border: '1px solid var(--border)',
                                                        borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        padding: 0, color: 'var(--text-primary)', fontSize: '20px', fontWeight: '600', lineHeight: 1
                                                    }}
                                                    aria-label={`Increase ${item.name} quantity`}
                                                >+</button>
                                            </>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        style={{
                                            width: '36px', height: '36px', background: 'var(--fill-danger)', border: 'none',
                                            borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            padding: 0, flexShrink: 0
                                        }}
                                        aria-label={`Remove ${item.name} from fridge`}
                                    >
                                        <span style={{ color: '#ffffff', fontSize: '24px', fontWeight: '600', lineHeight: 1, marginTop: '-1px' }} aria-hidden="true">−</span>
                                    </button>
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
window.FBComponents.FridgeTab = FridgeTab;
