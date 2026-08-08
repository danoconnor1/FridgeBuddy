function ExpenseCard({ expense, onEdit, onRemove }) {
    const { formatExpenseCategory, formatExpensePrice, getExpenseTotal } = window.FB;
    const total = getExpenseTotal(expense);
    const items = expense.items || [];

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>{expense.title}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                            {[formatExpenseCategory(expense.category), expense.date].filter(Boolean).join(' · ')}
                        </p>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', flexShrink: 0 }}>
                        {formatExpensePrice(total)}
                    </span>
                </div>
                {items.length > 0 && (
                    <ul className="expense-card-items">
                        {items.map((item, index) => (
                            <li key={index} className="expense-card-item">
                                <span className="expense-card-item-name">{item.name}</span>
                                <span className="expense-card-item-price">{formatExpensePrice(item.price)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                {onEdit && (
                    <button
                        type="button"
                        onClick={() => onEdit(expense)}
                        className="grocery-store-edit-btn"
                        aria-label={`Edit ${expense.title}`}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M4 20h4l10.5-10.5a2.828 2.828 0 1 0-4-4L4 16v4" />
                            <path d="M13.5 6.5l4 4" />
                        </svg>
                    </button>
                )}
                {onRemove && (
                    <button
                        type="button"
                        onClick={() => onRemove(expense.id)}
                        style={{
                            width: '28px', height: '28px', background: 'var(--fill-danger)', border: 'none',
                            borderRadius: 'var(--radius)', color: '#fff', fontSize: '18px', fontWeight: '600',
                            lineHeight: 1, flexShrink: 0, padding: 0
                        }}
                        aria-label={`Remove ${expense.title}`}
                    >
                        −
                    </button>
                )}
            </div>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.ExpenseCard = ExpenseCard;
