function EditExpenseModal({
    expenseCategories,
    editExpenseTitle, setEditExpenseTitle,
    editExpenseDate, setEditExpenseDate,
    editExpenseCategory, setEditExpenseCategory,
    editExpensePrice, setEditExpensePrice,
    editExpenseDraftItems,
    addEditExpenseItemRow, updateEditExpenseDraftItem, removeEditExpenseDraftItem,
    closeEditExpenseModal, saveExpenseEdit
}) {
    const { ExpenseItemEditor } = window.FBComponents;
    const { serializeExpenseDraftItems, normalizeExpenseCategory, normalizeExpensePrice } = window.FB;
    const { compactSelect } = window.FB_STYLES;

    const serializedItems = serializeExpenseDraftItems(editExpenseDraftItems);
    const category = normalizeExpenseCategory(editExpenseCategory);
    const price = normalizeExpensePrice(editExpensePrice);
    const canSave = Boolean(editExpenseTitle.trim()) && Boolean(category)
        && (price != null || serializedItems.length > 0);

    return (
        <div className="fb-modal-overlay" onClick={closeEditExpenseModal}>
            <div className="fb-modal-card" onClick={(e) => e.stopPropagation()}>
                <h3 className="fb-modal-title">Edit expense</h3>
                <div className="expense-manual-header">
                    <input
                        type="text"
                        placeholder="Expense title"
                        value={editExpenseTitle}
                        onChange={(e) => setEditExpenseTitle(e.target.value)}
                        className="expense-title-input"
                    />
                    <input
                        type="date"
                        value={editExpenseDate}
                        onChange={(e) => setEditExpenseDate(e.target.value)}
                        className="expense-date-input"
                        aria-label="Expense date"
                    />
                </div>
                <div className="expense-manual-meta">
                    <select
                        value={editExpenseCategory}
                        onChange={(e) => setEditExpenseCategory(e.target.value)}
                        style={compactSelect}
                        className="expense-category-input"
                        aria-label="Expense category"
                    >
                        <option value="" disabled>Expense category</option>
                        {expenseCategories.map(entry => (
                            <option key={entry.id} value={entry.id}>{entry.label}</option>
                        ))}
                    </select>
                    <div className="expense-price-field expense-price-field--wide">
                        <span className="expense-price-prefix" aria-hidden="true">$</span>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            value={editExpensePrice}
                            onChange={(e) => setEditExpensePrice(e.target.value)}
                            className="expense-total-price-input"
                            aria-label="Expense price in dollars"
                            disabled={editExpenseDraftItems.length > 0}
                        />
                    </div>
                </div>
                <ExpenseItemEditor
                    items={editExpenseDraftItems}
                    updateExpenseDraftItem={updateEditExpenseDraftItem}
                    removeExpenseDraftItem={removeEditExpenseDraftItem}
                />
                <button
                    type="button"
                    onClick={addEditExpenseItemRow}
                    className="meals-dashed-btn"
                    style={{ marginBottom: '1rem' }}
                >
                    Add item
                </button>
                <div className="fb-modal-actions">
                    <button onClick={closeEditExpenseModal} style={{ flex: 1, padding: '10px', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px' }}>Cancel</button>
                    <button onClick={saveExpenseEdit} disabled={!canSave} style={{ flex: 1, padding: '10px', background: 'var(--fill-accent)', color: 'var(--on-accent)', border: 'none', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px', opacity: canSave ? 1 : 0.5, cursor: canSave ? 'pointer' : 'not-allowed' }}>Save</button>
                </div>
            </div>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.EditExpenseModal = EditExpenseModal;
