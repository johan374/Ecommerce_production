// Import necessary dependencies and components
import { BrowserRouter } from 'react-router-dom'  // Provides routing functionality
import { CartProvider } from './context/CartContext'  // Custom context for cart state management
import AppRoute from './AppRoute'  // Component containing route definitions
import Cart from './pages/categories/components/cart'  // Shopping cart component

function App() {
  return (
    // CartProvider wrapper: Makes cart functionality available throughout the app
    <CartProvider>
      {/* BrowserRouter: Enables client-side routing using HTML5 history API */}
      <BrowserRouter>
        {/* AppRoute: Contains all route definitions and page components */}
        <AppRoute />

        {/* Cart component placed outside of AppRoute but inside BrowserRouter */}
        {/* This ensures the cart is accessible across all pages */}
        {/* Since it's after AppRoute, it will overlay on top of page content */}
        <Cart />
      </BrowserRouter>
    </CartProvider>
  )
}

// Export the App component as the default export
export default App