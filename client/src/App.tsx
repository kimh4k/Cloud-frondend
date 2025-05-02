import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import Header from "./components/Header";
import { CartProvider, useCart } from "./contexts/CartContext";
import CartSidebar from "./components/CartSidebar";
import Notification from "./components/Notification";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/checkout" component={Checkout} />
      <Route component={NotFound} />
    </Switch>
  );
}

function MainContent() {
  const { cartOpen, notification } = useCart();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        <Router />
      </div>
      {cartOpen && <CartSidebar />}
      <Notification 
        show={notification.show} 
        message={notification.message} 
      />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <MainContent />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
