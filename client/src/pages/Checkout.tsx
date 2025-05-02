import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '../lib/utils';
import { apiRequest } from '../lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validate form
  const validateForm = () => {
    let valid = true;
    const newErrors: Record<string, string> = {
      fullName: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      phone: ''
    };
    
    // Validate fullName
    if (formData.fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
      valid = false;
    }
    
    // Validate email
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }
    
    // Validate address
    if (formData.address.length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
      valid = false;
    }
    
    // Validate city
    if (formData.city.length < 2) {
      newErrors.city = 'City is required';
      valid = false;
    }
    
    // Validate postal code
    if (formData.postalCode.length < 3) {
      newErrors.postalCode = 'Postal code is required';
      valid = false;
    }
    
    // Validate country
    if (formData.country.length < 2) {
      newErrors.country = 'Country is required';
      valid = false;
    }
    
    // Validate phone
    if (formData.phone.length < 5) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    if (cartItems.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Please add items to your cart before checking out.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerInfo: formData,
        orderItems: cartItems,
        totalAmount: getCartTotal()
      };

      // Send the order to our backend API
      const response = await apiRequest('POST', '/api/orders', orderData);
      const result = await response.json();
      
      // Order success
      clearCart();
      toast({
        title: 'Order placed successfully!',
        description: `Thank you for your purchase. Order ID: ${result.orderId}`,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Failed to place order',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper component for form fields
  const FormField = ({ label, name, type = 'text', placeholder }: { label: string; name: string; type?: string; placeholder: string }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={formData[name as keyof typeof formData]}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Form */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
            <CardDescription>Please enter your shipping details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Full Name"
                name="fullName"
                placeholder="John Doe"
              />
              
              <FormField
                label="Email"
                name="email"
                type="email"
                placeholder="john@example.com"
              />
              
              <FormField
                label="Address"
                name="address"
                placeholder="123 Main St"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="City"
                  name="city"
                  placeholder="New York"
                />
                
                <FormField
                  label="Postal Code"
                  name="postalCode"
                  placeholder="10001"
                />
              </div>
              
              <FormField
                label="Country"
                name="country"
                placeholder="United States"
              />
              
              <FormField
                label="Phone"
                name="phone"
                placeholder="+1 (555) 123-4567"
              />
              
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {cartItems.length > 0 ? (
                  <>
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-3 flex justify-between">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="py-3 text-muted-foreground">Your cart is empty</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="w-full py-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-xl">{formatPrice(getCartTotal())}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;