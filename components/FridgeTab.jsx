function FridgeTab({
    items, catalogItems, filteredFridgeItems, fridgeItemGroups, fridgeSearch, setFridgeSearch,
    fridgeSort, setFridgeSort, isSeasoningFridgeItem, usesFridgeCapacityTracking,
    canToggleFridgeTrackingMode, setFridgeItemTrackingMode, isLeftoverFridgeItem,
    removeItem, lowerFridgeItemSeasoningStatus, openEmptyFridgeConfirm, openEditFridgeItemModal, openAddLeftoverModal, setActiveTab,
    haulImportPaste, setHaulImportPaste,
    haulImportPreview, haulImportError,
    haulImportSuccess,
    previewHaulImport, confirmHaulImport, clearHaulImport
}) {
    const {
        formatExpiresIn, formatSeasoningStatus, getDaysUntilExpiry, normalizeSeasoningStatus,
        getSeasoningStatusColor, getItemQuantityDisplay, getFridgeTrackingMode,
        estimateFridgeItemCalories, formatCalories, isFoodCategory
    } = window.FB;
    const { ImportHaulSection } = window.FBComponents;

    const getItemCategory = (item) => {
        if (isLeftoverFridgeItem(item)) return 'leftovers';
        return catalogItems.find(entry => entry.id === item.catalogItemId)?.category || 'other';
    };

    const renderFridgeItemCard = (item) => {
        const isCatalogSeasoning = isSeasoningFridgeItem(item);
        const isLeftover = isLeftoverFridgeItem(item);
        const usesCapacity = usesFridgeCapacityTracking(item);
        const canToggle = canToggleFridgeTrackingMode(item);
        const trackingMode = getFridgeTrackingMode(item, catalogItems);
        const itemCategory = getItemCategory(item);
        const days = isCatalogSeasoning ? null : getDaysUntilExpiry(item.expiry);
        let statusColor = 'var(--fill-success)';
        let statusText = 'Fresh';

        if (isCatalogSeasoning) {
            statusColor = getSeasoningStatusColor(item.seasoningStatus);
            statusText = formatSeasoningStatus(item.seasoningStatus);
        } else if (days != null) {
            statusText = days > 3 ? 'Fresh' : days <= 0 ? 'Expired' : 'Expiring soon';
            if (days <= 0) statusColor = 'var(--fill-danger)';
            else if (days <= 3) statusColor = 'var(--fill-warning)';
        }

        const capacityStatus = normalizeSeasoningStatus(item.seasoningStatus);
        const itemCalories = !usesCapacity && !isLeftover ? estimateFridgeItemCalories(item, catalogItems) : null;
        const quantityLabel = isLeftover
            ? 'Leftover'
            : usesCapacity
                ? formatSeasoningStatus(capacityStatus)
                : getItemQuantityDisplay(item);
        const quantityColor = usesCapacity
            ? getSeasoningStatusColor(capacityStatus)
            : 'var(--text-secondary)';

        const renderCapacityStatusControl = (className) => (
            <button
                type="button"
                className={className}
                onClick={() => lowerFridgeItemSeasoningStatus(item.id)}
                style={{ color: quantityColor }}
                aria-label={`Amount left for ${item.name}: ${quantityLabel}. Click to lower.`}
            >
                {quantityLabel}
            </button>
        );

        return (
            <div
                key={item.id}
                className="fridge-column-card"
                data-category={isFoodCategory(itemCategory) ? itemCategory : undefined}
            >
                <div className="fridge-column-card-header">
                    <p className="fridge-column-card-name">{item.name}</p>
                    {canToggle && (
                        <div className="fridge-tracking-toggle" role="group" aria-label="Tracking mode">
                            <button
                                type="button"
                                className={trackingMode === 'amount' ? 'active' : ''}
                                onClick={() => setFridgeItemTrackingMode(item.id, 'amount')}
                                aria-pressed={trackingMode === 'amount'}
                            >
                                Amt
                            </button>
                            <button
                                type="button"
                                className={trackingMode === 'capacity' ? 'active' : ''}
                                onClick={() => setFridgeItemTrackingMode(item.id, 'capacity')}
                                aria-pressed={trackingMode === 'capacity'}
                            >
                                %
                            </button>
                        </div>
                    )}
                </div>
                {!isCatalogSeasoning && (
                    <p className="fridge-column-card-meta">{formatExpiresIn(item.expiry)}</p>
                )}
                {!usesCapacity && itemCalories != null && (
                    <p className="fridge-column-card-meta">{formatCalories(itemCalories)} cal</p>
                )}
                <div className="fridge-column-card-status">
                    <i className="ti ti-circle-filled" style={{ fontSize: '7px', color: statusColor }} aria-hidden="true"></i>
                    {isCatalogSeasoning ? (
                        renderCapacityStatusControl('fridge-column-status-btn fridge-column-status-btn--status-row')
                    ) : (
                        <span style={{ color: statusColor }}>{statusText}</span>
                    )}
                </div>
                <div className="fridge-column-card-controls">
                    {usesCapacity && !isCatalogSeasoning ? (
                        renderCapacityStatusControl('fridge-column-status-btn')
                    ) : !usesCapacity ? (
                        <span
                            className="fridge-column-qty-label"
                            style={{ color: quantityColor }}
                        >
                            {quantityLabel}
                        </span>
                    ) : (
                        <span className="fridge-column-qty-label" aria-hidden="true" />
                    )}
                    <div className="fridge-column-card-actions">
                        <button
                            type="button"
                            className="fridge-column-edit-btn"
                            onClick={() => openEditFridgeItemModal(item)}
                            aria-label={`Edit ${item.name}`}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M4 20h4l10.5-10.5a2.828 2.828 0 1 0-4-4L4 16v4" />
                                <path d="M13.5 6.5l4 4" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="fridge-column-remove-btn"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name} from fridge`}
                        >
                            <span aria-hidden="true">−</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <section className="meals-section fridge-add-section">
                <div className="meals-section-box">
                    <h2 className="meals-section-title">Add to fridge</h2>

                    <div className="meals-add-columns">
                        <div className="meals-add-option">
                            <p className="meals-option-label">Option A: Using AI</p>
                            <ImportHaulSection
                                haulImportPaste={haulImportPaste}
                                setHaulImportPaste={setHaulImportPaste}
                                haulImportPreview={haulImportPreview}
                                haulImportError={haulImportError}
                                haulImportSuccess={haulImportSuccess}
                                previewHaulImport={previewHaulImport}
                                confirmHaulImport={confirmHaulImport}
                                clearHaulImport={clearHaulImport}
                            />
                        </div>

                        <div className="meals-add-option">
                            <p className="meals-option-label">Option B: Add leftover</p>
                            <div className="meals-add-column-card">
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
                                    Log a leftover meal with a name and expiration date.
                                </p>
                                <button
                                    type="button"
                                    onClick={openAddLeftoverModal}
                                    className="meals-add-btn"
                                    style={{ marginTop: 0 }}
                                >
                                    Add leftover
                                </button>
                            </div>
                        </div>

                        <div className="meals-add-option">
                            <p className="meals-option-label">Option C: Add from grocery store</p>
                            <div className="meals-add-column-card">
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
                                    Add items from your grocery store catalog to the fridge.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('allItems')}
                                    className="meals-add-btn"
                                    style={{ marginTop: 0 }}
                                >
                                    Go to grocery store
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="meals-section fridge-my-section">
                <div className="fridge-my-header">
                    <h2 className="meals-section-title">My fridge</h2>
                    {items.length > 0 && (
                        <button
                            type="button"
                            className="fridge-empty-btn"
                            onClick={openEmptyFridgeConfirm}
                        >
                            Empty fridge
                        </button>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="fridge-my-controls">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={fridgeSearch}
                            onChange={(e) => setFridgeSearch(e.target.value)}
                            aria-label="Search fridge items"
                        />
                        <select
                            value={fridgeSort}
                            onChange={(e) => setFridgeSort(e.target.value)}
                            style={{ marginBottom: 0, width: 'auto', flexShrink: 0 }}
                            aria-label="Sort fridge items"
                        >
                            <option value="category">Food group</option>
                            <option value="expiration">Expiration</option>
                        </select>
                    </div>
                )}

                {items.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No items yet</p>
                ) : filteredFridgeItems.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No items match your search.</p>
                ) : (
                    <div className="fridge-columns-scroll">
                        <div
                            className={`fridge-columns${fridgeSort === 'expiration' ? ' fridge-columns-expiration' : ''}`}
                            role="region"
                            aria-label="Fridge items"
                        >
                            {fridgeItemGroups.map(group => (
                                <section
                                    key={group.key}
                                    className="fridge-column"
                                    data-category={fridgeSort === 'category' && isFoodCategory(group.key) ? group.key : undefined}
                                    aria-label={group.label}
                                >
                                    <h4 className="fridge-column-heading">{group.label}</h4>
                                    <div className="fridge-column-items">
                                        {group.items.map(renderFridgeItemCard)}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.FridgeTab = FridgeTab;
