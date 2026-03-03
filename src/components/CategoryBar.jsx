export default function CategoryBar({ categories, activeCategory, onSelect }) {
  return (
    <div className="category-bar">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            className={`category-tab ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(cat.id)}
            style={{
              '--cat-color': cat.color,
            }}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
