function MealCard({ meal, catalogItems, onRemove, onRemoveIngredient, onUpdateCalories }) {
    const { MealIngredientList, CaloriesField } = window.FBComponents;
    const displayCalories = window.FB.getMealDisplayCalories(meal, catalogItems);
    const loggedTime = meal.loggedAt ? window.FB.formatMealTime(meal.loggedAt) : '';

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 2px 0' }}>{meal.name}</p>
                {loggedTime && (
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>{loggedTime}</p>
                )}
                {onUpdateCalories && (
                    <div style={{ marginBottom: '8px', maxWidth: '240px' }}>
                        <CaloriesField
                            label="Calories"
                            value={displayCalories != null ? String(displayCalories) : ''}
                            onChange={(value) => onUpdateCalories(meal.id, value)}
                            onAdjust={(delta) => {
                                const current = displayCalories ?? 0;
                                onUpdateCalories(meal.id, String(window.FB.adjustCalories(current, delta)));
                            }}
                        />
                    </div>
                )}
                <MealIngredientList
                    ingredients={meal.ingredients}
                    onRemoveIngredient={onRemoveIngredient
                        ? (index) => onRemoveIngredient(meal.id, index)
                        : null}
                />
            </div>
            {onRemove && (
                <button
                    type="button"
                    onClick={() => onRemove(meal.id)}
                    style={{
                        width: '28px', height: '28px', background: 'var(--fill-danger)', border: 'none',
                        borderRadius: 'var(--radius)', color: '#fff', fontSize: '18px', fontWeight: '600',
                        lineHeight: 1, flexShrink: 0, padding: 0
                    }}
                    aria-label={`Remove ${meal.name}`}
                >
                    −
                </button>
            )}
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.MealCard = MealCard;
