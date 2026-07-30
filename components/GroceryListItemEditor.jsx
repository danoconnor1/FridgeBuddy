function GroceryListItemEditor({ items, catalogItems, updateGroceryListDraftItem, removeGroceryListDraftItem }) {
    const { formatCategory } = window.FB;

    if (items.length === 0) return null;

    return (
        <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>Add items</p>
            {items.map((item, index) => (
                <div key={index} className="home-grocery-list-row">
                    <select
                        value={item.catalogItemId != null && item.catalogItemId !== '' ? String(item.catalogItemId) : ''}
                        onChange={(e) => updateGroceryListDraftItem(index, 'catalogItemId', e.target.value)}
                        className="home-grocery-list-input"
                        aria-label="Grocery store item"
                    >
                        <option value="">Select item</option>
                        {catalogItems.map(catalogItem => (
                            <option key={catalogItem.id} value={String(catalogItem.id)}>
                                {catalogItem.name}{catalogItem.category ? ` (${formatCategory(catalogItem.category)})` : ''}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() => removeGroceryListDraftItem(index)}
                        className="home-grocery-list-remove"
                        aria-label="Remove item"
                    >
                        −
                    </button>
                </div>
            ))}
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.GroceryListItemEditor = GroceryListItemEditor;
