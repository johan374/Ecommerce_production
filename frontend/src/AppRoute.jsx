// Import necessary routing components from react-router-dom
import { Routes, Route } from 'react-router-dom'

// Import page components
import Landingpage from './landingpage'            // Home/landing page
import About from './pages/preview/About'          // About page
import Register from './pages/Register'            // Registration page 
import Electronics from './pages/categories/Electronics' // Electronics category page
import Food from './pages/categories/Food'         // Food category page
import Shop from './pages/shop'

function AppRoute() {
 return (
   // Routes component wraps all route definitions
   <Routes>
     {/* Base routes */}
     <Route path="/" element={<Landingpage />} />          {/* Home page route*/}
     <Route path="/about" element={<About />} />           {/* About page route*/}
     <Route path="/register" element={<Register />} />     {/* Register page route*/}
     <Route path="/shop" element={<Shop />} /> {/* New Shop route */}

     {/* Electronics section routes */}
     <Route path="/electronics" element={<Electronics />} />   {/* Main electronics page*/}
     <Route path="/electronics/:subcategory" element={<Electronics />} />  
     {/* Dynamic route for electronics subcategories*/}
     {/* :subcategory is a URL parameter that can be accessed in the Electronics component*/}
     {/* Example URLs: /electronics/tv, /electronics/computers*/}
     
     {/* Food section routes */}
     <Route path="/food" element={<Food />} />             {/* Main food page/*/}
     <Route path="/food/:subcategory" element={<Food />} /> 
     {/* Dynamic route for food subcategories*/}
     {/* :subcategory is a URL parameter that can be accessed in the Food component*/}
     {/* Example URLs: /food/groceries, /food/prepared-meals*/}
   </Routes>
 )
}

export default AppRoute