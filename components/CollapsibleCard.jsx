function CollapsibleCard({
    title,
    subtitle,
    meta,
    defaultExpanded = false,
    children
}) {
    const { useState } = React;
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <div className={`fb-collapsible-card${expanded ? ' is-expanded' : ''}`}>
            <button
                type="button"
                className="fb-collapsible-card-header"
                onClick={() => setExpanded(prev => !prev)}
                aria-expanded={expanded}
            >
                <span className="fb-collapsible-card-chevron" aria-hidden="true">
                    {expanded ? '▾' : '▸'}
                </span>
                <span className="fb-collapsible-card-heading">
                    <span className="fb-collapsible-card-title">{title}</span>
                    {subtitle && (
                        <span className="fb-collapsible-card-subtitle">{subtitle}</span>
                    )}
                </span>
                {meta && (
                    <span className="fb-collapsible-card-meta">{meta}</span>
                )}
            </button>
            {expanded && (
                <div className="fb-collapsible-card-body">
                    {children}
                </div>
            )}
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.CollapsibleCard = CollapsibleCard;
