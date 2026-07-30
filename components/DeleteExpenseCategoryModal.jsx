function DeleteExpenseCategoryModal({
    customExpenseCategories,
    deleteExpenseCategoryId, setDeleteExpenseCategoryId,
    deleteExpenseCategoryError,
    closeDeleteExpenseCategoryModal, deleteExpenseCategory
}) {
    const { modalOverlay, modalCard } = window.FB_STYLES;
    const hasCustomCategories = customExpenseCategories.length > 0;

    return (
        <div style={modalOverlay} onClick={closeDeleteExpenseCategoryModal}>
            <div style={{ ...modalCard, maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontSize: '18px', fontWeight: '500', margin: '0 0 1rem 0' }}>Delete expense category</h3>
                {hasCustomCategories ? (
                    <label style={{ display: 'block', marginBottom: '12px' }}>
                        <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Category</span>
                        <select
                            value={deleteExpenseCategoryId}
                            onChange={(e) => setDeleteExpenseCategoryId(e.target.value)}
                            style={{ marginBottom: 0 }}
                        >
                            <option value="">Select a category</option>
                            {customExpenseCategories.map(entry => (
                                <option key={entry.id} value={entry.id}>{entry.label}</option>
                            ))}
                        </select>
                    </label>
                ) : (
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
                        No custom categories to delete. Built-in categories cannot be removed.
                    </p>
                )}
                {deleteExpenseCategoryError && (
                    <p className="meals-inline-error" role="alert" style={{ marginTop: 0 }}>{deleteExpenseCategoryError}</p>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        type="button"
                        onClick={closeDeleteExpenseCategoryModal}
                        style={{ flex: 1, padding: '10px', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={deleteExpenseCategory}
                        disabled={!hasCustomCategories}
                        style={{ flex: 1, padding: '10px', background: 'var(--fill-danger)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px' }}
                    >
                        Delete category
                    </button>
                </div>
            </div>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.DeleteExpenseCategoryModal = DeleteExpenseCategoryModal;
