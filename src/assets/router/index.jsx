import { createHashRouter } from "react-router-dom";
import FrontLayout from "../layouts/Frontlayout";
import HomePage from "../pages/HomePage";
import Products from "../pages/Products";
import Carts from "../pages/Carts";
import ProductDetail from "../pages/ProductDetail";

const router = createHashRouter([
    {
        path:'/',
        element:<FrontLayout />,
        children:[{
            path:'',
            element:<HomePage></HomePage>
        },
        {
            path:'/products',
            element:<Products></Products>
        },
        {
            path:'/carts',
            element:<Carts></Carts>
        },
        {
            path:'/products/:id',
            element:<ProductDetail></ProductDetail>
        }
        ]
    },
])

export default router;