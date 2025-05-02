import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart } from '../contexts/CartContext';
import { 
  Menu, 
  ShoppingCart, 
  ChevronDown,
  X 
} from 'lucide-react';
import { useFetchProducts, useCategories } from '../hooks/useProducts';

const Header = () => {
  const [location, setLocation] = useLocation();
  const { toggleCart, getCartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  
  const { data } = useFetchProducts();
  const categories = useCategories(data?.data);
  
  const cartCount = getCartCount();
  
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  
  const handleCategorySelect = (category: string | null) => {
    const searchParams = new URLSearchParams(window.location.search);
    
    if (category) {
      searchParams.set('category', category);
    } else {
      searchParams.delete('category');
    }
    
    setLocation(`/?${searchParams.toString()}`);
    setCategoryMenuOpen(false);
    closeMobileMenu();
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-primary font-bold text-xl">StyleHub</Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <div className="relative">
              <button 
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                className="text-gray-700 hover:text-primary font-medium transition-colors flex items-center"
              >
                Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {categoryMenuOpen && (
                <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
                  {categories.map((category) => (
                    <a 
                      key={category}
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategorySelect(category);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      {category}
                    </a>
                  ))}
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategorySelect(null);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    All Products
                  </a>
                </div>
              )}
            </div>
            <Link href="/?section=featured" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Featured
            </Link>
            <Link href="/?section=trending" className="text-gray-700 hover:text-primary font-medium transition-colors">
              New Arrivals
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          {/* Shopping Cart */}
          <div className="flex items-center">
            <button 
              onClick={toggleCart}
              className="group p-2 flex items-center text-gray-700 hover:text-primary transition-colors relative"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg z-20">
            <Link 
              href="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <div className="relative">
              <button 
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)} 
                className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              >
                Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {categoryMenuOpen && (
                <div className="pl-4">
                  {categories.map((category) => (
                    <a 
                      key={category}
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategorySelect(category);
                      }}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                    >
                      {category}
                    </a>
                  ))}
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategorySelect(null);
                    }}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                  >
                    All Products
                  </a>
                </div>
              )}
            </div>
            <Link 
              href="/?section=featured" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={closeMobileMenu}
            >
              Featured
            </Link>
            <Link 
              href="/?section=trending" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={closeMobileMenu}
            >
              New Arrivals
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
