function ExpenseItemEditor({ items, updateExpenseDraftItem, removeExpenseDraftItem }) {
    if (items.length === 0) return null;

    return (
        <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>Items (optional)</p>
            {items.map((item, index) => (
                <div key={index} className="expense-item-row">
                    <input
                        type="text"
                        placeholder="Item name"
                        value={item.name}
                        onChange={(e) => updateExpenseDraftItem(index, 'name', e.target.value)}
                        className="expense-item-name"
                    />
                    <div className="expense-price-field">
                        <span className="expense-price-prefix" aria-hidden="true">$</span>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            value={item.price}
                            onChange={(e) => updateExpenseDraftItem(index, 'price', e.target.value)}
                            className="expense-item-price"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => removeExpenseDraftItem(index)}
                        className="expense-item-remove"
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
window.FBComponents.ExpenseItemEditor = ExpenseItemEditor;
