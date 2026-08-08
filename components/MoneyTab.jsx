function MoneyTab({
    expenses,
    expenseCategories,
    expenseTitle, setExpenseTitle,
    expenseDate, setExpenseDate,
    expenseCategory, setExpenseCategory,
    expensePrice, setExpensePrice,
    expenseDraftItems,
    expenseImportPaste, setExpenseImportPaste,
    expenseImportPreview, expenseImportError,
    expenseImportSuccess,
    expenseChartFilter, setExpenseChartFilter,
    addExpense, addExpenseItemRow, updateExpenseDraftItem, removeExpenseDraftItem,
    previewExpenseImport, confirmExpenseImport, clearExpenseImport,
    removeExpense, openEditExpenseModal,
    openAddExpenseCategoryModal,
    openDeleteExpenseCategoryModal
}) {
    const { ImportExpenseSection, ExpenseItemEditor, ExpenseChart, ExpenseCard } = window.FBComponents;
    const { serializeExpenseDraftItems, normalizeExpenseCategory, normalizeExpensePrice } = window.FB;
    const { compactSelect } = window.FB_STYLES;

    const serializedItems = serializeExpenseDraftItems(expenseDraftItems);
    const category = normalizeExpenseCategory(expenseCategory);
    const price = normalizeExpensePrice(expensePrice);
    const canAddExpense = Boolean(expenseTitle.trim()) && Boolean(category)
        && (price != null || serializedItems.length > 0);

    const chartFilters = [
        { id: 'month', label: 'This month' },
        { id: '30days', label: 'Last 30 days' },
        { id: 'all', label: 'All time' }
    ];

    return (
        <div>
            <section className="meals-section">
                <div className="meals-section-box">
                    <h2 className="meals-section-title">Add expense</h2>

                    <div className="recipes-add-columns">
                        <div className="meals-add-option">
                            <p className="meals-option-label">Option A: Using AI</p>
                            <ImportExpenseSection
                                expenseImportPaste={expenseImportPaste}
                                setExpenseImportPaste={setExpenseImportPaste}
                                expenseImportPreview={expenseImportPreview}
                                expenseImportError={expenseImportError}
                                expenseImportSuccess={expenseImportSuccess}
                                previewExpenseImport={previewExpenseImport}
                                confirmExpenseImport={confirmExpenseImport}
                                clearExpenseImport={clearExpenseImport}
                            />
                        </div>

                        <div className="meals-add-option">
                            <p className="meals-option-label">Option B: Add manually</p>
                            <div className="meals-add-column-card">
                                <div className="expense-manual-header">
                                    <input
                                        type="text"
                                        placeholder="Expense title"
                                        value={expenseTitle}
                                        onChange={(e) => setExpenseTitle(e.target.value)}
                                        className="expense-title-input"
                                    />
                                    <input
                                        type="date"
                                        value={expenseDate}
                                        onChange={(e) => setExpenseDate(e.target.value)}
                                        className="expense-date-input"
                                        aria-label="Expense date"
                                    />
                                </div>
                                <div className="expense-manual-meta">
                                    <select
                                        value={expenseCategory}
                                        onChange={(e) => setExpenseCategory(e.target.value)}
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
                                            value={expensePrice}
                                            onChange={(e) => setExpensePrice(e.target.value)}
                                            className="expense-total-price-input"
                                            aria-label="Expense price in dollars"
                                        />
                                    </div>
                                </div>
                                <ExpenseItemEditor
                                    items={expenseDraftItems}
                                    updateExpenseDraftItem={updateExpenseDraftItem}
                                    removeExpenseDraftItem={removeExpenseDraftItem}
                                />
                                <button
                                    type="button"
                                    onClick={addExpenseItemRow}
                                    className="meals-dashed-btn"
                                >
                                    Add item
                                </button>
                                <button
                                    type="button"
                                    onClick={addExpense}
                                    disabled={!canAddExpense}
                                    className="meals-add-btn"
                                >
                                    Add expense
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="meals-section expense-category-action">
                <button
                    type="button"
                    onClick={openAddExpenseCategoryModal}
                    className="expense-add-category-btn"
                >
                    Add expense category
                </button>
                <button
                    type="button"
                    onClick={openDeleteExpenseCategoryModal}
                    className="expense-delete-category-btn"
                >
                    Delete expense category
                </button>
            </section>

            <section className="meals-section">
                <div className="meals-section-box">
                    <h2 className="meals-section-title">Expense chart</h2>
                    <div className="expense-chart-filters" role="group" aria-label="Chart time range">
                        {chartFilters.map(option => (
                            <button
                                key={option.id}
                                type="button"
                                className={`expense-chart-filter${expenseChartFilter === option.id ? ' active' : ''}`}
                                onClick={() => setExpenseChartFilter(option.id)}
                                aria-pressed={expenseChartFilter === option.id}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    <ExpenseChart expenses={expenses} filter={expenseChartFilter} />
                </div>
            </section>

            <section className="meals-section">
                <h2 className="meals-section-title">Your expenses</h2>
                {expenses.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No expenses logged yet</p>
                ) : (
                    [...expenses].reverse().map(expense => (
                        <div key={expense.id} className="fb-card">
                            <ExpenseCard expense={expense} onEdit={openEditExpenseModal} onRemove={removeExpense} />
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.MoneyTab = MoneyTab;
