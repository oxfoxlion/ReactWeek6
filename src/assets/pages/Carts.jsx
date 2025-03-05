import { useState, useEffect } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;
import ReactLoading from 'react-loading';

export default function Carts() {

    const [cartProducts, setCartProducts] = useState([]);//購物車列表
    const [totalPrice, setTotalPrice] = useState(0);//原價總金額
    const [finalTotalPrice, setFinalTotalPrice] = useState(0);//折扣後總金額
    const [isLoading, setIsLoading] = useState(false);//全畫面Loading狀態

    //初始化
    useEffect(() => {
        getCartProducts();
    }, [])

    //執行計算總價
    useEffect(() => {

        getTotal();

    }, [cartProducts])


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
        } finally {
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
        } finally {
            setIsLoading(false);
        }
    }

    //編輯購物車產品數量
    const editProduct = async (id, num) => {
        setIsLoading(true);
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

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container">
            <div className="text-end">
                <button className="btn btn-outline-danger" type="button" onClick={() => clearCart()}>清空購物車</button>
            </div>

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