// Import necessary dependencies from React
import React, { createContext, useContext, useReducer } from 'react';

// Create a context for the cart
const CartContext = createContext(); // initially undefine value

// Cart reducer to handle all state updates in a predictable way
const cartReducer = (state, action) => {
    // state = current cart state, e.g., { items: [] }
    // action = what we want to do, e.g., { type: 'ADD_ITEM', payload: {id: 1, name: 'Shirt'} }

    switch (action.type) {
        case 'ADD_ITEM':
            // Checks if product already exists in cart
            // Let's break it down:
            // 1. state.items - accessing the items array in your state
            // 2. action.payload - accessing the payload object in your action
            // 3. item.id - accessing the id property of each item
            // 4. action.payload.id - accessing the id property of the payload

            const existingItem = state.items.find(item => item.id === action.payload.id);

            // Example: state.items = [{id: 1, name: 'Shirt', quantity: 2}]
            // If adding another shirt (id: 1), existingItem will be that shirt object

            // If an item with matching ID was found in the cart
            if (existingItem) {
                // Return a new state object (don't modify original)
                return {
                    ...state,  // Spread operator to copy all existing state properties
                    items: state.items.map(item =>  // Map through all items in cart
                        item.id === action.payload.id  // If this is the item we want to update
                            ? { 
                                ...item,              // Copy all item properties
                                quantity: item.quantity + 1  // But increase quantity by 1
                            } 
                            : item  // For all other items, keep them unchanged
                    )

                };
                // Example result: {items: [{id: 1, name: 'Shirt', quantity: 3}]}
            }

            // If item is new, add it to cart with quantity 1
            return {
                ...state,  // 1. Copies all state properties
                items: [
                    ...state.items,  // 2. Copies all existing items
                    { 
                        ...action.payload,  // 3. Copies all product properties
                        quantity: 1 
                    }
                ]
            };
            // Example: Adding pants (id: 2)
            // Result: {items: [{id: 1, name: 'Shirt', quantity: 2}, {id: 2, name: 'Pants', quantity: 1}]}

        case 'REMOVE_ITEM':
            // action.payload is just the id to remove
            // Example: { type: 'REMOVE_ITEM', payload: 1 }
            //filter method creates a new array with only the items that return true from the condition.
            // If item.id !== action.payload is false, that item is excluded from the new array - effectively deleting it.
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };
            // If removing shirt (id: 1), result: {items: [{id: 2, name: 'Pants', quantity: 1}]}

        case 'UPDATE_QUANTITY':
            // action.payload has id and new quantity
            // Example: { type: 'UPDATE_QUANTITY', payload: { id: 1, quantity: 5 } }
            return {  // Start returning a new state object
                ...state,  // Spread operator: Copy all existing properties from the current state
                items: state.items.map(item =>  // Create a new array by mapping through all cart items
                    item.id === action.payload.id  // Check if current item's ID matches the one we want to update
                        ? {  // If IDs match, this is the item we want to update
                            ...item,  // Copy all existing properties of the item (like name, price, etc.)
                            quantity: action.payload.quantity  // Override only the quantity with the new value
                          } 
                        : item  // If IDs don't match, keep the item unchanged
                )
            };
            // Result: {items: [{id: 1, name: 'Shirt', quantity: 5}, {id: 2, name: 'Pants', quantity: 1}]}

        case 'CLEAR_CART':
            // No payload needed, just empty the cart
            return {
                ...state,
                items: []  // Empty array
            };
            // Result: {items: []}

        default:
            // If action type doesn't match any case, return unchanged state
            return state;
    }
};
//dispatch is a built-in function that comes with useReducer  a built-in function to send actions to our reducer
// CartProvider is a component that wraps your app to share cart functionality
// children is whatever components are wrapped inside CartProvider
export const CartProvider = ({ children }) => {
    // useReducer hook initializes cart state with an empty items array
    // cartState contains the current state, dispatch is the function to update it
    // cartState: the current state value
    // dispatch: function to send actions to the reducer
    const [cartState, dispatch] = useReducer(cartReducer, { items: [] }); // Second argument: { items: [] } - the initial state (empty cart)

    // Calculate total price in cents for Stripe payments
    // Example: If cart has item with price $10.99 and quantity 2
    // Returns: 2198 (10.99 * 100 * 2)
    // Round 1:
    // total = 0
    // item = { price: 10, quantity: 2 }
    // result = 0 + (10 * 2) = 20

    // Round 2:
    // total = 20
    // item = { price: 20, quantity: 1 }
    // result = 20 + (20 * 1) = 40

    // Final total: 40
    const getTotalPriceInCents = () => {
        return cartState.items.reduce((total, item) => {
            return total + (item.price * 100 * item.quantity);
        }, 0);
    };

    // Count total number of items in cart
    // Example: If cart has 2 shirts and 3 pants
    // Returns: 5
    const getTotalItems = () => {
        return cartState.items.reduce((total, item) => total + item.quantity, 0); //Where to start (0 in this case) and go on counting items until the end
    };

    // Format cart items for API requests
    // Example: Converts [{id: 1, price: 10.99, quantity: 2}]
    // To: [{product_id: 1, price_cents: 1099, quantity: 2}]
    const getFormattedItems = () => {
        return cartState.items.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price_cents: Math.round(item.price * 100)
        }));
    };

    // Create an object containing all cart state and functions
    // This will be available to all child components
    const value = {
        // Current cart items array
        items: cartState.items,
        
        // Function to add product to cart
        // Usage: addItem({ id: 1, name: 'Shirt', price: 29.99 })
        addItem: (product) => dispatch({ type: 'ADD_ITEM', payload: product }),
        
        // Function to remove product from cart
        // Usage: removeItem(1) // removes product with id 1
        removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', payload: productId }),
        
        // Function to update quantity of a product
        // Usage: updateQuantity(1, 5) // set product 1 quantity to 5
        updateQuantity: (productId, quantity) => 
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity }}),
        
        // Function to empty the cart
        // Usage: clearCart()
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
        
        // Include helper functions for calculations
        getTotalPriceInCents,
        getTotalItems,
        getFormattedItems
    };

    // Return Context Provider with value object available to all children
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart functionality in any component
// Usage: const { items, addItem, removeItem } = useCart();
export const useCart = () => {
    // Get cart context
    const context = useContext(CartContext);
    
    // If hook is used outside CartProvider, throw helpful error
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    
    // Return all cart functions and state
    return context;
};