import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  useFetchProducts, 
  useCategories, 
  useFeaturedProducts, 
  useTrendingProducts,
  useFilteredProducts
} from '../hooks/useProducts';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const selectedCategory = searchParams.get('category');
  const section = searchParams.get('section');
  
  const { data, isLoading, error } = useFetchProducts();
  const categories = useCategories(data?.data);
  const featuredProducts = useFeaturedProducts(data?.data);
  const trendingProducts = useTrendingProducts(data?.data);
  const filteredProducts = useFilteredProducts(data?.data, selectedCategory);
  
  useEffect(() => {
    // Scroll to the selected section if the section parameter is present
    if (section) {
      const sectionElement = document.getElementById(section);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [section]);
  
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-12 w-12 text-primary" />
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">
            Failed to load products. Please try again later.
          </span>
        </div>
      )}
      
      {!isLoading && !error && data && (
        <>
          {/* Category Filter Pills */}
          <CategoryFilter 
            categories={categories} 
            selectedCategory={selectedCategory}
          />
          
          {/* Featured Products Section */}
          {(!selectedCategory || section === 'featured') && featuredProducts.length > 0 && (
            <div id="featured">
              <ProductGrid 
                title="Featured Products" 
                products={featuredProducts}
              />
            </div>
          )}
          
          {/* Trending Products Section */}
          {(!selectedCategory || section === 'trending') && trendingProducts.length > 0 && (
            <div id="trending">
              <ProductGrid 
                title="Trending Now" 
                products={trendingProducts}
              />
            </div>
          )}
          
          {/* All Products Section */}
          <ProductGrid 
            title={selectedCategory ? `${selectedCategory} Products` : "All Products"} 
            products={filteredProducts}
            emptyMessage="No products found in this category."
          />
        </>
      )}
    </main>
  );
};

export default Home;
