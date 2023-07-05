'use client'

import { useState, useEffect } from "react"
import axios from "axios";
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState({
    products:[],
    loading: false
  });
  const [store_id, setStore_id] = useState('3330')

  const handleKeyword = (e: any) => {
    setKeyword(e.target.value);
  }
  
  const getProduct = (e: Event) => {
    e.preventDefault();
    setProducts({...products, loading: true});
    const options = {
      method: 'GET',
      url: 'https://target-com-shopping-api.p.rapidapi.com/product_search',
      params: {
        store_id: store_id,
        keyword: keyword,
        offset: '0',
        count: '9'
      },
      headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_API_KEY,
        'X-RapidAPI-Host': 'target-com-shopping-api.p.rapidapi.com'
      }
    };
    
    try {
      axios.request(options).then((p: any) => {

        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('products', JSON.stringify(p));
        }
        setProducts({products: p.data.data.search.products, loading: false})
      }
      ).catch(err => {
        err.response.request.status ? toast.error('You need to purchase API key.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        :
        toast.error('Error.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setProducts({...products, loading: false})}
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = localStorage?.getItem("products"); //filter((p) => p.tcin === query.tcin)[0];
        if (products) {
          const productData = await JSON.parse(products).data.data.search.products
          setProducts({products: productData, loading: false});
        }
      } catch (error) {
        console.log(error);
      }
    };
     fetchProduct();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container mx-auto">
        <form className="flex">
          <input onChange={handleKeyword} value={keyword} className="px-3 mr-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:shadow-none" />
          <button type="submit" className="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm" onClick={getProduct} >Search</button>
        </form>
        {products.loading &&
        <div className="spinner-container">
          <div className="loading-spinner"></div>
        </div>
        }
        {(products.products && products.products.length > 0) && 
        <>
          <h1 className="search-result">Search Result</h1>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
            {products.products.map((p: any, index: Number) => 
              <Link key={index} className="mb-3 card"
                href={{
                  pathname: '/product-detail',
                  query: {tcin: p.tcin, store_id: store_id}
                }}
                target="_blank"
              >
                <div className="overflow-hidden image-container">
                  <img src={ p.item.enrichment.images.primary_image_url } alt={p.item.product_vendors[0].vendor_name} />
                </div>
                <div className="p-3">
                  <div className="product-name">{p.item.product_vendors[0].vendor_name}</div>
                  <div>{p.price.formatted_current_price}</div>
                </div>
              </Link>
            )}
          </div>
        </>
        }
      </div>
      <ToastContainer />
    </main>
  )
}
