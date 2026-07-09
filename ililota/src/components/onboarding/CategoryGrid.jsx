import { CATEGORIES } from '../../constants/categories'
import CategoryCard from './CategoryCard'

export default function CategoryGrid({ selected, onToggle }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {CATEGORIES.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          selected={selected.includes(category.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
