import { Link } from 'wouter';
import { Product } from '../types/product';
import { getImageUrl, formatPrice } from '../lib/utils';
import { useCart } from '../contexts/CartContext';
import { Eye, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300 group">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-ratio-container aspect-ratio-container-4-5">
          <img 
            src={getImageUrl(product.img[0])} 
            alt={product.title} 
            className="aspect-ratio-content group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              className="bg-white bg-opacity-90 text-gray-900 px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1"
            >
              <Eye size={16} />
              View Details
            </button>
            <button 
              onClick={handleAddToCart}
              className="bg-primary text-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 hover:bg-primary/90"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1">{product.title}</h3>
          <p className="text-gray-600 text-sm mb-2">
            {product.categories.map(c => c.title).join(', ')}
          </p>
          <p className="font-bold text-gray-900">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
