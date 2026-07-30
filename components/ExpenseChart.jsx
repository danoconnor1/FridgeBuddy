function ExpenseChart({ expenses, filter }) {
    const { aggregateExpensesByCategory, formatExpensePrice } = window.FB;
    const slices = aggregateExpensesByCategory(expenses, filter);

    if (slices.length === 0) {
        return <p className="expense-chart-empty">No expenses in this period.</p>;
    }

    const polarToCartesian = (cx, cy, radius, angleDeg) => {
        const angleRad = ((angleDeg - 90) * Math.PI) / 180;
        return {
            x: cx + radius * Math.cos(angleRad),
            y: cy + radius * Math.sin(angleRad)
        };
    };

    const describeSlice = (cx, cy, radius, startAngle, endAngle) => {
        if (endAngle - startAngle >= 359.99) {
            return `M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx + radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx - radius} ${cy} Z`;
        }
        const start = polarToCartesian(cx, cy, radius, endAngle);
        const end = polarToCartesian(cx, cy, radius, startAngle);
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;
        return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
    };

    let currentAngle = 0;
    const chartSlices = slices.map(slice => {
        const sweep = (slice.percent / 100) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sweep;
        currentAngle = endAngle;
        return { ...slice, startAngle, endAngle };
    });

    return (
        <div className="expense-chart-wrap">
            <svg viewBox="0 0 200 200" className="expense-chart-svg" role="img" aria-label="Expense category pie chart">
                {chartSlices.map(slice => (
                    <path
                        key={slice.category}
                        d={describeSlice(100, 100, 90, slice.startAngle, slice.endAngle)}
                        fill={slice.color}
                        stroke="var(--surface-1)"
                        strokeWidth="1.5"
                    />
                ))}
            </svg>
            <ul className="expense-chart-legend">
                {chartSlices.map(slice => (
                    <li key={slice.category} className="expense-chart-legend-item">
                        <span className="expense-chart-legend-swatch" style={{ background: slice.color }} aria-hidden="true" />
                        <span className="expense-chart-legend-label">{slice.label}</span>
                        <span className="expense-chart-legend-value">
                            {formatExpensePrice(slice.total)} ({slice.percent.toFixed(0)}%)
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.ExpenseChart = ExpenseChart;
