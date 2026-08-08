function HomeTab({
    expiringItems, expiredItems, leftoverItems,
    readyToMakeRecipes, almostThereRecipes, recipes, items, catalogItems,
    manualGroceryListItems, suggestedGroceryListItems,
    groceryListDraftItems,
    openViewRecipeModal, agentPromptCopied, copyAgentPrompt,
    exportFridge, importFridgeFromText,
    fridgeImportError, fridgeImportSuccess,
    addGroceryListItemRow, updateGroceryListDraftItem, removeGroceryListDraftItem,
    addManualGroceryListItems, removeGroceryListItem, addSuggestedItemToGroceryList,
    addGroceryListItemToFridge, addAllGroceryListItemsToFridge,
    isOnManualGroceryList,
    groceryListRecipeId, setGroceryListRecipeId, addRecipeIngredientsToGroceryList
}) {
    const { useRef } = React;
    const {
        formatFridgeItemLabel, getDaysUntilExpiry,
        formatExpiresIn, getExpirationTextColor, countFailingIngredients
    } = window.FB;
    const { GroceryListItemEditor } = window.FBComponents;
    const fridgeImportInputRef = useRef(null);

    const handleFridgeImportFile = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            importFridgeFromText(String(reader.result || ''));
            event.target.value = '';
        };
        reader.onerror = () => {
            importFridgeFromText('');
            event.target.value = '';
        };
        reader.readAsText(file);
    };

    const copyIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h3m9 -9v-5a2 2 0 0 0 -2 -2h-2" />
            <path d="M13 17v-1a1 1 0 0 1 1 -1h1m3 0h1a1 1 0 0 1 1 1v1m0 3v1a1 1 0 0 1 -1 1h-1m-3 0h-1a1 1 0 0 1 -1 -1v-1" />
            <path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
        </svg>
    );

    const checkIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12l5 5l10 -10" />
        </svg>
    );

    const hasFridgeAlerts = expiringItems.length > 0 || expiredItems.length > 0;
    const hasSuggestedMeals = leftoverItems.length > 0
        || readyToMakeRecipes.length > 0
        || almostThereRecipes.length > 0;
    const canAddGroceryListItems = groceryListDraftItems.some(item => item.catalogItemId);

    const groceryMetaClassName = (tone) => (
        `home-grocery-list-item-meta${tone ? ` home-grocery-list-item-meta--${tone}` : ''}`
    );

    const renderManualGroceryListItem = (item) => (
            <li key={item.id} className="home-grocery-list-item">
                <div className="home-grocery-list-item-info">
                    <span className="home-grocery-list-item-name">{item.name}</span>
                    {item.detail && (
                        <span className={groceryMetaClassName(item.detailTone || 'success')}>
                            {item.detail}
                        </span>
                    )}
                </div>
                <div className="home-grocery-list-actions">
                    <button
                        type="button"
                        onClick={() => addGroceryListItemToFridge(item)}
                        className="home-grocery-list-add"
                        aria-label={`Add ${item.name} to fridge`}
                    >
                        +
                    </button>
                    <button
                        type="button"
                        onClick={() => removeGroceryListItem(item)}
                        className="home-grocery-list-remove"
                        aria-label={`Remove ${item.name}`}
                    >
                        −
                    </button>
                </div>
            </li>
        );

    const renderSuggestedGroceryListItem = (item) => {
        const onList = isOnManualGroceryList(item);
        return (
            <li key={item.id} className="home-grocery-list-item">
                <div className="home-grocery-list-item-info">
                    <span className="home-grocery-list-item-name">{item.name}</span>
                    {item.detail && (
                        <span className={groceryMetaClassName(item.detailTone || 'warning')}>
                            {item.detail}
                        </span>
                    )}
                </div>
                <div className="home-grocery-list-actions">
                    <button
                        type="button"
                        onClick={() => addSuggestedItemToGroceryList(item)}
                        disabled={onList}
                        className="home-grocery-list-add"
                        aria-label={`Add ${item.name} to grocery list`}
                    >
                        +
                    </button>
                    <button
                        type="button"
                        onClick={() => removeGroceryListItem(item)}
                        className="home-grocery-list-remove"
                        aria-label={`Remove ${item.name}`}
                    >
                        −
                    </button>
                </div>
            </li>
        );
    };

    const renderRecipeSuggestion = (recipe, variant) => {
        const shortBy = variant === 'almost'
            ? countFailingIngredients(recipe, items, getDaysUntilExpiry, catalogItems)
            : 0;

        return (
            <div key={recipe.id} className="home-suggestion-row">
                <div className="home-suggestion-info">
                    <span className="home-suggestion-name">{recipe.name}</span>
                    {variant === 'almost' && (
                        <span className="home-suggestion-meta">
                            {shortBy} ingredient{shortBy !== 1 ? 's' : ''} short
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    className="home-suggestion-btn"
                    onClick={() => openViewRecipeModal(recipe.id)}
                >
                    View
                </button>
            </div>
        );
    };

    return (
        <div>
            <div className="home-agent-prompt-bar">
                <button
                    type="button"
                    onClick={copyAgentPrompt}
                    className="home-agent-prompt-copy-btn"
                    aria-label="Copy Fridge Buddy agent prompt"
                >
                    {agentPromptCopied ? checkIcon : copyIcon}
                    <span>{agentPromptCopied ? 'Copied! Paste into your agent.' : 'Copy agent prompt'}</span>
                </button>
                <p className="home-agent-prompt-desc">
                    Copy this prompt into your AI agent once (for example Claude project instructions).
                    Re-copy when you add items to your grocery store. It covers grocery hauls, recipes, meals, and expenses.
                </p>
            </div>

            <section className="meals-section home-dashboard-section">
                <div className="meals-section-box">
                    <div className="meals-add-columns home-dashboard-columns">
                        <div className="meals-add-option">
                            <p className="meals-option-label">Fridge items expiring soon</p>
                            <div className="home-column-card">
                                {!hasFridgeAlerts && (
                                    <p className="home-column-empty">Nothing expiring soon.</p>
                                )}

                                {expiringItems.length > 0 && (
                                    <div className="home-alert-group">
                                        <p className="home-alert-group-label">Expiring soon</p>
                                        <ul className="home-alert-list">
                                            {expiringItems.map(item => {
                                                const days = getDaysUntilExpiry(item.expiry);
                                                return (
                                                    <li key={item.id} className="home-alert-item home-alert-item--warning">
                                                        <i className="ti ti-circle-filled" aria-hidden="true" />
                                                        <span>
                                                            <strong>{formatFridgeItemLabel(item, catalogItems)}</strong>
                                                            {' — '}
                                                            {days} day{days !== 1 ? 's' : ''} left
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}

                                {expiredItems.length > 0 && (
                                    <div className="home-alert-group">
                                        <p className="home-alert-group-label">Expired</p>
                                        <ul className="home-alert-list">
                                            {expiredItems.map(item => {
                                                const days = Math.abs(getDaysUntilExpiry(item.expiry));
                                                return (
                                                    <li key={item.id} className="home-alert-item home-alert-item--danger">
                                                        <i className="ti ti-circle-filled" aria-hidden="true" />
                                                        <span>
                                                            {formatFridgeItemLabel(item, catalogItems)}
                                                            {' — expired '}
                                                            {days} day{days !== 1 ? 's' : ''} ago
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="meals-add-option">
                            <div className="home-column-card">
                                <p className="home-grocery-list-section-title">My grocery list</p>
                                {manualGroceryListItems.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={addAllGroceryListItemsToFridge}
                                        className="home-grocery-list-add-all-btn"
                                    >
                                        Add all to fridge
                                    </button>
                                )}
                                {manualGroceryListItems.length === 0 ? (
                                    <p className="home-column-empty">No items yet. Add from your grocery store below.</p>
                                ) : (
                                    <ul className="home-grocery-list">
                                        {manualGroceryListItems.map(renderManualGroceryListItem)}
                                    </ul>
                                )}

                                {catalogItems.length === 0 ? (
                                    <p className="home-column-empty" style={{ marginTop: '0.75rem' }}>
                                        Add items in the Grocery store first.
                                    </p>
                                ) : (
                                    <>
                                        <GroceryListItemEditor
                                            items={groceryListDraftItems}
                                            catalogItems={catalogItems}
                                            updateGroceryListDraftItem={updateGroceryListDraftItem}
                                            removeGroceryListDraftItem={removeGroceryListDraftItem}
                                        />
                                        <button
                                            type="button"
                                            onClick={addGroceryListItemRow}
                                            className="meals-dashed-btn"
                                        >
                                            Add item
                                        </button>
                                        <button
                                            type="button"
                                            onClick={addManualGroceryListItems}
                                            disabled={!canAddGroceryListItems}
                                            className="meals-add-btn"
                                        >
                                            Add to list
                                        </button>

                                        {recipes.length > 0 && (
                                            <div className="home-grocery-recipe-add">
                                                <p className="home-grocery-recipe-add-label">Add from recipe</p>
                                                <div className="home-grocery-recipe-add-row">
                                                    <select
                                                        value={groceryListRecipeId}
                                                        onChange={(e) => setGroceryListRecipeId(e.target.value)}
                                                        className="home-grocery-recipe-select"
                                                        aria-label="Recipe"
                                                    >
                                                        <option value="">Select recipe</option>
                                                        {recipes.map(recipe => (
                                                            <option key={recipe.id} value={String(recipe.id)}>
                                                                {recipe.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={addRecipeIngredientsToGroceryList}
                                                        disabled={!groceryListRecipeId}
                                                        className="home-grocery-recipe-add-btn"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="home-grocery-list-divider" aria-hidden="true" />

                                <p className="home-grocery-list-section-title">Suggested items</p>
                                {suggestedGroceryListItems.length === 0 ? (
                                    <p className="home-column-empty">Nothing to suggest right now.</p>
                                ) : (
                                    <ul className="home-grocery-list">
                                        {suggestedGroceryListItems.map(renderSuggestedGroceryListItem)}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="meals-add-option">
                            <p className="meals-option-label">Suggested meals</p>
                            <div className="home-column-card">
                                {!hasSuggestedMeals && recipes.length === 0 && items.length === 0 && catalogItems.length === 0 && (
                                    <p className="home-column-empty">
                                        Start by adding items in the Grocery store, then stock your fridge and add recipes.
                                    </p>
                                )}

                                {!hasSuggestedMeals && (recipes.length > 0 || items.length > 0 || catalogItems.length > 0) && (
                                    <p className="home-column-empty">
                                        No leftovers or recipes ready yet. Stock up on a few more ingredients!
                                    </p>
                                )}

                                {leftoverItems.length > 0 && (
                                    <div className="home-suggestion-group">
                                        <p className="home-suggestion-group-label">Leftovers</p>
                                        <ul className="home-suggestion-list">
                                            {leftoverItems.map(item => (
                                                <li key={item.id} className="home-suggestion-list-item">
                                                    <i
                                                        className="ti ti-circle-filled"
                                                        style={{ color: getExpirationTextColor(item.expiry) }}
                                                        aria-hidden="true"
                                                    />
                                                    <span>
                                                        <strong>{item.name}</strong>
                                                        <span style={{ color: getExpirationTextColor(item.expiry) }}>
                                                            {' — '}{formatExpiresIn(item.expiry)}
                                                        </span>
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {readyToMakeRecipes.length > 0 && (
                                    <div className="home-suggestion-group">
                                        <p className="home-suggestion-group-label">Ready to make</p>
                                        {readyToMakeRecipes.map(recipe => renderRecipeSuggestion(recipe, 'ready'))}
                                    </div>
                                )}

                                {almostThereRecipes.length > 0 && (
                                    <div className="home-suggestion-group">
                                        <p className="home-suggestion-group-label">Nearly ready</p>
                                        {almostThereRecipes.map(recipe => renderRecipeSuggestion(recipe, 'almost'))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-fridge-backup-section">
                <p className="home-fridge-backup-title">Move your fridge</p>
                <p className="home-fridge-backup-desc">
                    Export from Safari and import on your home screen shortcut, or the other way around.
                    Your data stays on your device.
                </p>
                <div className="home-fridge-backup-actions">
                    <button
                        type="button"
                        onClick={exportFridge}
                        className="home-fridge-backup-btn"
                    >
                        Export fridge
                    </button>
                    <button
                        type="button"
                        onClick={() => fridgeImportInputRef.current?.click()}
                        className="home-fridge-backup-btn home-fridge-backup-btn--secondary"
                    >
                        Import fridge
                    </button>
                    <input
                        ref={fridgeImportInputRef}
                        type="file"
                        accept=".json,application/json"
                        hidden
                        onChange={handleFridgeImportFile}
                    />
                </div>
                {fridgeImportError && (
                    <p className="home-fridge-backup-message home-fridge-backup-message--error" role="alert">
                        {fridgeImportError}
                    </p>
                )}
                {fridgeImportSuccess && (
                    <p className="home-fridge-backup-message home-fridge-backup-message--success" role="status">
                        Fridge imported successfully.
                    </p>
                )}
            </section>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.HomeTab = HomeTab;
