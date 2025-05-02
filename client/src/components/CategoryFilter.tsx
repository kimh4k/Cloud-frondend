import { useLocation } from 'wouter';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
}

const CategoryFilter = ({ categories, selectedCategory }: CategoryFilterProps) => {
  const [, setLocation] = useLocation();
  
  const handleCategoryChange = (category: string | null) => {
    const searchParams = new URLSearchParams(window.location.search);
    
    if (category) {
      searchParams.set('category', category);
    } else {
      searchParams.delete('category');
    }
    
    setLocation(`/?${searchParams.toString()}`);
  };
  
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-2">
        <button 
          onClick={() => handleCategoryChange(null)} 
          className={`px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-90 transition-colors ${
            selectedCategory === null 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button 
            key={category}
            onClick={() => handleCategoryChange(category)} 
            className={`px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-90 transition-colors ${
              selectedCategory === category 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
