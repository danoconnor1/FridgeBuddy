function CollapsibleSection({
    title,
    subtitle,
    meta,
    defaultExpanded = false,
    children,
    className = ''
}) {
    const { useState } = React;
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <section className={`home-collapsible-section ${className}`.trim()}>
            <div className={`home-collapsible-section-shell${expanded ? ' is-expanded' : ''}`}>
                <button
                    type="button"
                    className="home-collapsible-section-toggle"
                    onClick={() => setExpanded(prev => !prev)}
                    aria-expanded={expanded}
                >
                    <span className="home-collapsible-section-chevron" aria-hidden="true">
                        {expanded ? '▾' : '▸'}
                    </span>
                    <span className="home-collapsible-section-heading">
                        <span className="home-collapsible-section-title">{title}</span>
                        {subtitle && (
                            <span className="home-collapsible-section-subtitle">{subtitle}</span>
                        )}
                    </span>
                    {meta != null && meta !== '' && (
                        <span className="home-collapsible-section-meta">{meta}</span>
                    )}
                </button>
                {expanded && (
                    <div className="home-collapsible-section-content">
                        {children}
                    </div>
                )}
            </div>
        </section>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.CollapsibleSection = CollapsibleSection;
