function HomeTab({
    lowSeasoningItems, expiringItems, expiredItems,
    readyToMakeRecipes, almostThereRecipes, recipes, items, catalogItems,
    openViewRecipeModal
}) {
    const { formatFridgeItemLabel, formatSeasoningStatus, getDaysUntilExpiry } = window.FB;

    const renderRecipeRow = (recipe) => (
        <div
            key={recipe.id}
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 0',
                borderBottom: '1px solid var(--border)'
            }}
        >
            <span style={{ fontSize: '14px', fontWeight: '500', flex: 1, minWidth: 0 }}>
                {recipe.name}
            </span>
            <button
                type="button"
                onClick={() => openViewRecipeModal(recipe.id)}
                style={{
                    padding: '6px 12px',
                    background: 'transparent',
                    color: 'var(--fill-accent)',
                    border: '1px solid var(--fill-accent)',
                    borderRadius: 'var(--radius)',
                    fontWeight: '500',
                    fontSize: '12px',
                    flexShrink: 0,
                    cursor: 'pointer'
                }}
            >
                View recipe
            </button>
        </div>
    );

    const hasRecipeSections = readyToMakeRecipes.length > 0 || almostThereRecipes.length > 0;

    return (
        <div>
            {lowSeasoningItems.length > 0 && (
                <div style={{ background: 'var(--bg-warning)', border: '1px solid var(--border-warning)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-warning)', margin: '0 0 8px 0' }}>
                        <i className="ti ti-alert-circle" style={{ verticalAlign: '-2px', marginRight: '6px' }} aria-hidden="true"></i>
                        Seasonings running low
                    </h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {lowSeasoningItems.map(item => (
                            <div key={item.id} style={{ margin: '6px 0' }}>
                                <strong>{formatFridgeItemLabel(item)}</strong> - {formatSeasoningStatus(item.seasoningStatus)}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {expiringItems.length > 0 && (
                <div style={{ background: 'var(--bg-warning)', border: '1px solid var(--border-warning)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-warning)', margin: '0 0 8px 0' }}>
                        <i className="ti ti-alert-circle" style={{ verticalAlign: '-2px', marginRight: '6px' }} aria-hidden="true"></i>
                        Items expiring soon
                    </h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {expiringItems.map(item => (
                            <div key={item.id} style={{ margin: '6px 0' }}>
                                <strong>{formatFridgeItemLabel(item)}</strong> - expires in {getDaysUntilExpiry(item.expiry)} day{getDaysUntilExpiry(item.expiry) !== 1 ? 's' : ''}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {expiredItems.length > 0 && (
                <div style={{ background: 'var(--bg-danger)', border: '1px solid var(--border-danger)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-danger)', margin: '0 0 8px 0' }}>
                        <i className="ti ti-trash" style={{ verticalAlign: '-2px', marginRight: '6px' }} aria-hidden="true"></i>
                        Expired items
                    </h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {expiredItems.map(item => (
                            <div key={item.id} style={{ margin: '6px 0' }}>
                                {formatFridgeItemLabel(item)} - expired {Math.abs(getDaysUntilExpiry(item.expiry))} day{Math.abs(getDaysUntilExpiry(item.expiry)) !== 1 ? 's' : ''} ago
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {recipes.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '500', margin: '0 0 1rem 0' }}>
                        <i className="ti ti-chef-hat" style={{ verticalAlign: '-2px', marginRight: '8px' }} aria-hidden="true"></i>
                        Recipes
                    </h2>

                    {readyToMakeRecipes.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-success)', margin: '0 0 8px 0' }}>
                                Ready to make
                            </h3>
                            <div style={window.FB_STYLES.card}>
                                {readyToMakeRecipes.map(recipe => renderRecipeRow(recipe))}
                            </div>
                        </div>
                    )}

                    {almostThereRecipes.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-warning)', margin: '0 0 8px 0' }}>
                                Almost there
                            </h3>
                            <div style={window.FB_STYLES.card}>
                                {almostThereRecipes.map(recipe => renderRecipeRow(recipe))}
                            </div>
                        </div>
                    )}

                    {!hasRecipeSections && items.length > 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem 0' }}>
                            <p>No recipes are close to ready yet. Stock up on a few more ingredients!</p>
                        </div>
                    )}

                    {!hasRecipeSections && items.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem 0' }}>
                            <p>Add items to your fridge to see which recipes you can make.</p>
                        </div>
                    )}
                </div>
            )}

            {recipes.length === 0 && items.length === 0 && catalogItems.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>
                    <p>Start by adding items in the Grocery store, then add them to your fridge and favorite recipes.</p>
                </div>
            )}

            {recipes.length === 0 && (items.length > 0 || catalogItems.length > 0) && (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>
                    <p>Add some recipes to get suggestions!</p>
                </div>
            )}
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.HomeTab = HomeTab;
