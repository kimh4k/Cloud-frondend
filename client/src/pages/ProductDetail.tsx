import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useFetchProduct } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import { getImageUrl, formatPrice } from '../lib/utils';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const ProductDetail = () => {
  const [, params] = useRoute('/product/:id');
  const productId = params?.id || '';
  
  const { data, isLoading, error } = useFetchProduct(productId);
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [showBackView, setShowBackView] = useState(false);
  
  const product = data?.data?.[0];
  
  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, value));
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setQuantity(1);
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">
            Product not found or failed to load product details.
          </span>
        </div>
        <Link href="/" className="text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
      </div>
    );
  }
  
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="relative h-96 md:h-[600px]">
            <img 
              className={`w-full h-full object-cover ${showBackView ? 'hidden' : 'block'}`}
              src={getImageUrl(product.img[0])} 
              alt={`${product.title} - Front View`} 
            />
            <img 
              className={`w-full h-full object-cover ${showBackView ? 'block' : 'hidden'}`}
              src={getImageUrl(product.img2[0])} 
              alt={`${product.title} - Back View`} 
            />
            
            {/* Thumbnail Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <button 
                onClick={() => setShowBackView(false)} 
                className={`w-16 h-16 rounded-md overflow-hidden hover:opacity-100 transition-opacity ${
                  !showBackView ? 'ring-2 ring-primary' : 'opacity-70'
                }`}
              >
                <img 
                  src={getImageUrl(product.img[0])} 
                  alt="Front View Thumbnail" 
                  className="w-full h-full object-cover" 
                />
              </button>
              <button 
                onClick={() => setShowBackView(true)} 
                className={`w-16 h-16 rounded-md overflow-hidden hover:opacity-100 transition-opacity ${
                  showBackView ? 'ring-2 ring-primary' : 'opacity-70'
                }`}
              >
                <img 
                  src={getImageUrl(product.img2[0])} 
                  alt="Back View Thumbnail" 
                  className="w-full h-full object-cover" 
                />
              </button>
            </div>
          </div>
        </div>
        
        {/* Product Details */}
        <div className="flex flex-col space-y-6">
          <Link href="/" className="self-start flex items-center text-gray-600 hover:text-primary">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to products
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
          
          <div className="flex items-center space-x-3">
            {product.isNew && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                New Arrival
              </span>
            )}
            {product.type === 'featured' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Featured
              </span>
            )}
            {product.type === 'trending' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Trending
              </span>
            )}
          </div>
          
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </p>
          
          <div className="py-4 border-t border-b border-gray-200">
            <p className="text-gray-700">{product.desc}</p>
          </div>
          
          {/* Size Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-900">Size</h3>
            <div className="mt-2 flex space-x-2">
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <button 
                  key={size}
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
            <div className="mt-2 flex items-center space-x-3">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)} 
                className="rounded-md bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-gray-900 w-8 text-center">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(quantity + 1)} 
                className="rounded-md bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <Button 
              onClick={handleAddToCart} 
              className="mt-6 w-full bg-primary text-white py-3 px-4 rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            >
              Add to Cart
            </Button>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-900">Categories</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.categories.map((category) => (
                <span 
                  key={category.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {category.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
