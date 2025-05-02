import ProductCard from './ProductCard';
import { Product } from '../types/product';

interface ProductGridProps {
  title: string;
  products: Product[];
  emptyMessage?: string;
}

const ProductGrid = ({ title, products, emptyMessage = "No products found" }: ProductGridProps) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      
      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
