function CaloriesField({
    label = 'Calories',
    value,
    onChange,
    onAdjust,
    step = 10,
    min = 0,
    suffix = 'cal',
    hint,
    readOnly = false
}) {
    const { stepBtn } = window.FB_STYLES;
    const displayValue = value === '' || value == null
        ? '—'
        : window.FB.formatCalories(value);

    return (
        <label style={{ display: 'block', marginBottom: '12px' }}>
            <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {label}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {readOnly ? (
                    <>
                        <span style={{ width: '80px', textAlign: 'center', fontSize: '14px', fontWeight: '500', flexShrink: 0 }}>
                            {displayValue}
                        </span>
                        {suffix && (
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{suffix}</span>
                        )}
                    </>
                ) : (
                    <>
                        <button type="button" onClick={() => onAdjust(-step)} style={stepBtn} aria-label={`Decrease ${label.toLowerCase()}`}>−</button>
                        <input
                            type="number"
                            min={min}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onBlur={() => {
                                if (value === '') return;
                                const parsed = window.FB.parseCalories(value);
                                onChange(parsed != null ? String(parsed) : '');
                            }}
                            placeholder="—"
                            style={{ width: '80px', marginBottom: 0, textAlign: 'center', flexShrink: 0 }}
                            aria-label={label}
                        />
                        <button type="button" onClick={() => onAdjust(step)} style={stepBtn} aria-label={`Increase ${label.toLowerCase()}`}>+</button>
                        {suffix && (
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{suffix}</span>
                        )}
                    </>
                )}
            </div>
            {hint && (
                <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    {hint}
                </span>
            )}
        </label>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.CaloriesField = CaloriesField;
