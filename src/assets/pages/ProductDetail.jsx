import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import ReactLoading from 'react-loading';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductDetail() {
    const [product,setProduct]=useState({});
    const [qtySelect,setQtySelect]=useState(1);
    const [isLoading, setIsLoading] = useState(false);//全畫面Loading狀態
    const params = useParams();

    useEffect(()=>{
        getProduct();
    },[])


    const getProduct = async ()=>{
        setIsLoading(true);
        try{
            const response = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/product/${params.id}`)
            console.log(response.data.product)
            setProduct(response.data.product);

        }catch(error){
            console.log(`取得產品失敗`)
        }finally{
            setIsLoading(false);
        }
    }

    const addToCart = async () => {
        setIsLoading(true);
        try {
          const response = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
            "data": {
              "product_id": product.id,
              "qty": Number(qtySelect)
            }
          })
    
        }
        catch (error) {
          alert(`加入購物車失敗: ${error}`);
          console.log(error)
        }finally{
            setIsLoading(false);
        }
      }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-6">
                    <img className="img-fluid" src={product.imageUrl} alt={product.title} />
                </div>
                <div className="col-6">
                    <div className="d-flex align-items-center gap-2">
                        <h2>{product.title}</h2>
                        <span className="badge text-bg-success">{product.category}</span>
                    </div>
                    <p className="mb-3">{product.description}</p>
                    <p className="mb-3">{product.content}</p>
                    <h5 className="mb-3">NT$ {product.price}</h5>
                    <div className="input-group align-items-center w-75">
                        <select
                            value={qtySelect}
                            onChange={(e) => setQtySelect(e.target.value)}
                            id="qtySelect"
                            className="form-select"
                        >
                            {Array.from({ length: 10 }).map((_, index) => (
                                <option key={index} value={index + 1}>
                                    {index + 1}
                                </option>
                            ))}
                        </select>
                        <button type="button" className="btn btn-primary" onClick={()=>addToCart()}>
                            加入購物車
                        </button>
                    </div>
                </div>
            </div>

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