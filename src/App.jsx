import { useEffect, useRef, useState } from "react"
import axios from "axios";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";
import ReactLoading from 'react-loading';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const ProductContent = ({ product, openProductModal, getCartProducts,setIsLoadingProduct,isLoadingProduct }) => {

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

      // console.log(response);
      getCartProducts();
      // alert('加入成功');

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
          <button type="button" className="btn btn-outline-secondary" onClick={() => openProductModal(product)}>
            <i className="fas fa-spinner fa-pulse"></i>
            查看更多
          </button>
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


function App() {

  const [products, setProducts] = useState([]); //產品列表
  const [temProduct, setTemProduct] = useState(''); //被選擇的產品
  const [buyNum, setBuyNum] = useState(1);//設定購買數量
  const [cartProducts, setCartProducts] = useState([]);//購物車列表
  const [totalPrice, setTotalPrice] = useState(0);//原價總金額
  const [finalTotalPrice, setFinalTotalPrice] = useState(0);//折扣後總金額
  const [isLoading, setIsLoading] = useState(false);//全畫面Loading狀態
  const [isLoadingProduct,setIsLoadingProduct] = useState(false);//按鈕Loading狀態

  const productModalRef = useRef(null);

  //初始化
  useEffect(() => {
    getProducts();
    getCartProducts();
  }, [])

  // 建立Modal
  useEffect(() => {
    new Modal(productModalRef.current);
  }, [])

  //執行計算總價
  useEffect(() => {

    getTotal();

  }, [cartProducts])


  // 取得useForm功能
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();


  // 開啟Modal
  const openProductModal = (product) => {
    setTemProduct(product);
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  }

  // 關閉Modal
  const closeProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  }

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
  // 從Modal加入購物車API
  const addToCartByModal = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        "data": {
          "product_id": temProduct.id,
          "qty": buyNum
        }
      })

      setBuyNum(1);
      // console.log(response);
      getCartProducts();
      alert('加入成功');
      closeProductModal();

    }
    catch (error) {
      console.log(`加入購物車失敗: ${error}`);
      console.log(error)
    }
  }
  // 取得購物車列表API
  const getCartProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      setCartProducts(response.data.data.carts);
      console.log(response.data.data.carts);

    } catch (error) {
      console.log(`取得購物車失敗 ${error}`)
    }
  }

  // 清空購物車API
  const clearCart = async () => {
    setIsLoading(true);
    try {

      const response = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      // console.log(response);
      getCartProducts();

    }
    catch (error) {

      console.log(`清空購物車列表失敗 ${error}`)
    }finally{
      setIsLoading(false);
    }
  }

  // 計算總價與折扣價
  const getTotal = () => {
    // 總價
    let total = 0;
    cartProducts.forEach((item) => {
      total = total + item.total;
    })

    setTotalPrice(total);

    // 折扣後總價
    let finalTotal = 0;
    cartProducts.forEach((item) => {
      finalTotal = finalTotal + item.final_total
    })

    setFinalTotalPrice(finalTotal);

  }

  // 刪除單一產品API
  const deleteProduct = async (id) => {
    setIsLoading(true);
    try {

      const response = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${id}`);
      getCartProducts();

    } catch (error) {
      console.log(`執行刪除失敗 ${error}`)
    }finally{
      setIsLoading(false);
    }
  }

  //編輯購物車產品數量
  const editProduct = async (id, num) => {
    try {
      const response = await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${id}`, {
        data: {
          product_id: id,
          qty: num
        }
      })

      getCartProducts();

    } catch (error) {

      console.log(`數量修改失敗 ${error}`)

    }
  }

  // 提交表單
  const onSubmit = handleSubmit((data) => {


    const checkoutData = {
      user: {
        name: data.name,
        email: data.email,
        tel: data.tel,
        address: data.address
      },
      message: data.message
    }

    // console.log(checkoutData);
    checkout(checkoutData);
    reset();

  });

  // 結帳付款API
  const checkout = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, {
        data: data
      })

      // console.log(response);
      getCartProducts(); //重新整理購物車列表
      alert('結帳成功')
    } catch (error) {
      alert('結帳失敗')
    }finally{
      setIsLoading(false);
    }
  }


  return (
    <div id="app">

      <div className="container">

        <div className="mt-4">
          {/* 產品列表 */}
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
              openProductModal={openProductModal} 
              getCartProducts={getCartProducts}
              setIsLoadingProduct={setIsLoadingProduct}
              isLoadingProduct={isLoadingProduct}>
              </ProductContent>)}
            </tbody>
          </table>
          {/* 清空購物車 */}
          <div className="text-end">
            <button className="btn btn-outline-danger" type="button" onClick={() => clearCart()}>清空購物車</button>
          </div>
          {/* 購物車列表 */}
          <table className="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style={{ width: '150px' }}>數量/單位</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>

              {cartProducts.length > 0 ? cartProducts.map((item) => (
                <tr key={item.id}>
                  <th>
                    <button className="btn btn-outline-danger" onClick={() => deleteProduct(item.id)}>刪除</button>
                  </th>
                  <th>{item.product.title}</th>
                  <th>
                    <div className="input-group mb-3">
                      <input
                        type="number"
                        className="form-control"
                        min='1'
                        value={item.qty}
                        onChange={(e) => editProduct(item.id, Number(e.target.value))} />
                      <span className="input-group-text" id="basic-addon1">/{item.product.unit}</span>
                    </div>
                  </th>
                  <th>
                    {item.total}
                  </th>
                </tr>
              )) : <tr><th>這裡還沒有東西，去逛逛吧</th></tr>}


            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end">總計</td>
                <td className="text-end">{totalPrice}</td>
              </tr>

              <tr>
                <td colSpan="3" className="text-end text-success">折扣價</td>
                <td className="text-end text-success">{finalTotalPrice}</td>
              </tr>
            </tfoot>
          </table>

        </div>
        {/* 訂購表單 */}
        <div className="my-5 row justify-content-center">
          <form className="col-md-6" onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" name="email" type="email" className={`form-control ${errors.email && 'is-invalid'}`}
                placeholder="請輸入 Email"
                {...register('email', {
                  required: 'email欄位必填',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'email格式錯誤'
                  }

                })} />
              {errors.email && <p className="text-danger my-3">{errors.email.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">收件人姓名</label>
              <input id="name" name="姓名" type="text" className={`form-control ${errors.name && 'is-invalid'}`} placeholder="請輸入姓名"
                {...register('name', {
                  required: '姓名欄位必填'
                })} />
              {errors.name && <p className="text-danger my-3">{errors.name.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">收件人電話</label>
              <input id="tel" name="電話" type="text" className={`form-control ${errors.tel && 'is-invalid'}`} placeholder="請輸入電話"
                {...register('tel', {
                  required: '電話欄位必填',
                  pattern: {
                    value: /^(0[2-8]\d{7}|09\d{8})$/,
                    message: '電話格式錯誤'
                  }
                })} />
              {errors.tel && <p className="text-danger my-3">{errors.tel.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">收件人地址</label>
              <input id="address" name="地址" type="text" className={`form-control ${errors.address && 'is-invalid'}`} placeholder="請輸入地址"
                {...register('address', {
                  required: '地址欄位必填'
                })} />
              {errors.address && <p className="text-danger my-3">{errors.address.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">留言</label>
              <textarea id="message" className="form-control" cols="30" rows="10" {...register('message')}></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className={`btn btn-danger ${totalPrice ? '' : 'disabled'}`} >送出訂單</button>
            </div>
          </form>
        </div>
      </div>

      <div className="modal fade" ref={productModalRef}  >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">產品名稱：{temProduct.title}</h1>
              <button type="button" className="btn-close" aria-label="Close" onClick={() => closeProductModal()}></button>
            </div>
            <div className="modal-body">
              <img src={temProduct.imageUrl} alt={temProduct.title} className="mb-3"  style={{ maxWidth: "100%", height: "auto" }} />
              <p className="mb-3">產品內容：{temProduct.content}</p>
              <p>產品描述：{temProduct.description}</p>
              <p>價錢： <del>原價：${temProduct.origin_price}</del>，特價：{temProduct.price}</p>
              <div className="d-flex justify-content-center align-items-center">
                <label htmlFor="num">購買數量：</label>
                <div className="input-group w-75">
                  <button className="btn btn-danger p-2" type="button" onClick={() => setBuyNum((pre) => pre + 1)}>+</button>
                  <input type="number" id="num" className="form-control" value={buyNum} onChange={(e) => setBuyNum(Number(e.target.value))} />
                  <button className="btn btn-primary p-2" type="button" onClick={() => setBuyNum((pre) => pre === 1 ? pre : pre - 1)}>-</button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => addToCartByModal()}>加入購物車</button>
            </div>
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

export default App
