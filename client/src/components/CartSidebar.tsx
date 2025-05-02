import { useCart } from '../contexts/CartContext';
import { getImageUrl, formatPrice } from '../lib/utils';
import { X, Plus, Minus } from 'lucide-react';

const CartSidebar = () => {
  const { 
    cartItems, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal 
  } = useCart();
  
  return (
    <div 
      className="fixed inset-0 overflow-hidden z-40"
      onClick={closeCart}
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div 
            className="w-screen max-w-md" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col bg-white shadow-xl">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6 scrollbar-hide">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button 
                      onClick={closeCart}
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {cartItems.length === 0 ? (
                        <li className="py-6">
                          <div className="text-center py-4">
                            <p className="text-gray-500">Your cart is empty</p>
                          </div>
                        </li>
                      ) : (
                        cartItems.map((item) => (
                          <li key={item.id} className="py-6 flex">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img 
                                src={getImageUrl(item.img)} 
                                alt={item.title} 
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.title}</h3>
                                  <p className="ml-4">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center">
                                  <p className="text-gray-500 mr-2">Qty</p>
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                                    className="text-gray-600 hover:text-gray-900 p-1"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="mx-1 text-gray-900">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                                    className="text-gray-600 hover:text-gray-900 p-1"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>

                                <div className="flex">
                                  <button 
                                    onClick={() => removeFromCart(item.id)} 
                                    type="button" 
                                    className="font-medium text-primary hover:text-primary/80"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {cartItems.length > 0 && (
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>{formatPrice(getCartTotal())}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6">
                    <button className="flex w-full justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90">
                      Checkout
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                    <p>
                      or
                      <button 
                        onClick={closeCart} 
                        type="button" 
                        className="text-primary font-medium hover:text-primary/80 ml-1"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
