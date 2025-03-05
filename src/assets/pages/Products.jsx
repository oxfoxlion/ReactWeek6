import { useEffect, useState } from "react"
import axios from "axios";
import ReactLoading from 'react-loading';
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const ProductContent = ({ product,setIsLoadingProduct,isLoadingProduct }) => {

  // 新增一個產品到購物車API
  const addToCart = async () => {
    setIsLoadingProduct(true);
    try {
      const response = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        "data": {
          "product_id": product.id,
          "qty": 1
        }
      })

    }
    catch (error) {
      alert(`加入購物車失敗: ${error}`);
      console.log(error)
    }finally{
      setIsLoadingProduct(false);
    }
  }


  return (
    <tr>
      <td style={{ width: '200px' }}>
        <div style={{ height: '100px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${product.imageUrl})` }}>  </div>
      </td>
      <td>{product.title}</td>
      <td>
        <del className="h6">原價:{product.origin_price}</del>
        <div className="h5">特價：{product.price}</div>
      </td>
      <td>
        <div className="btn-group btn-group-sm">
          <Link className="btn btn-outline-secondary" to={`/products/${product.id}`}>
            <i className="fas fa-spinner fa-pulse" ></i>
            查看更多
          </Link>
          <button type="button" className="btn btn-outline-danger" onClick={() => addToCart()}>
            {isLoadingProduct?<ReactLoading
    type={"spin"}
    color={"red"}
    height={"1.5rem"}
    width={"1.5rem"}
  />:'加入購物車'}
          </button>
        </div>
      </td>
    </tr>
  )
}


export default function products(){
    const [products, setProducts] = useState([]); //產品列表
    const [isLoading, setIsLoading] = useState(false);//全畫面Loading狀態
    const [isLoadingProduct,setIsLoadingProduct] = useState(false);//按鈕Loading狀態
  
    //初始化
    useEffect(() => {
      getProducts();
    }, [])
  
  
    // 取得產品列表API
    const getProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
        setProducts(response.data.products);
        // console.log(response.data.products)
  
      } catch (error) {
        console.log(`取得資料失敗 ${error}`)
      } finally {
        setIsLoading(false);
      }
    }

    return(
        <div className="container">
            <table className="table align-middle">
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => <ProductContent 
              key={product.id} 
              product={product} 
              setIsLoadingProduct={setIsLoadingProduct}
              isLoadingProduct={isLoadingProduct}>
              </ProductContent>)}
            </tbody>
          </table>

          {isLoading && <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    zIndex: 999,
                  }}
                >
                  <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
                </div>}
        </div>
    )
}