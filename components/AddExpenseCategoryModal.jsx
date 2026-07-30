function AddExpenseCategoryModal({
    newExpenseCategoryName, setNewExpenseCategoryName,
    expenseCategoryError,
    closeAddExpenseCategoryModal, addExpenseCategory
}) {
    const { modalOverlay, modalCard } = window.FB_STYLES;

    return (
        <div style={modalOverlay} onClick={closeAddExpenseCategoryModal}>
            <div style={{ ...modalCard, maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontSize: '18px', fontWeight: '500', margin: '0 0 1rem 0' }}>Add expense category</h3>
                <label style={{ display: 'block', marginBottom: '12px' }}>
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Category name</span>
                    <input
                        type="text"
                        placeholder="Category name"
                        value={newExpenseCategoryName}
                        onChange={(e) => setNewExpenseCategoryName(e.target.value)}
                        style={{ marginBottom: 0 }}
                    />
                </label>
                {expenseCategoryError && (
                    <p className="meals-inline-error" role="alert" style={{ marginTop: 0 }}>{expenseCategoryError}</p>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        type="button"
                        onClick={closeAddExpenseCategoryModal}
                        style={{ flex: 1, padding: '10px', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={addExpenseCategory}
                        style={{ flex: 1, padding: '10px', background: 'var(--fill-accent)', color: 'var(--on-accent)', border: 'none', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px' }}
                    >
                        Add category
                    </button>
                </div>
            </div>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.AddExpenseCategoryModal = AddExpenseCategoryModal;
