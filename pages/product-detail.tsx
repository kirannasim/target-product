import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

 export default function ProductDetail() {
  const [product, setProduct] = useState({
    product: {},
    loading: false
  });
  const router = useRouter();
  const query = router.query;
  useEffect(() => {
    const options = {
      method: 'GET',
      url: 'https://target-com-shopping-api.p.rapidapi.com/product_details',
      params: {
        tcin: query.tcin,
        store_id: query.store_id
      },
      headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_API_KEY,
        'X-RapidAPI-Host': 'target-com-shopping-api.p.rapidapi.com'
      }
    };
    
    try {
      axios.request(options).then(p => 
        setProduct({product: p.data.product, loading: false})
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
        setProduct({...product, loading: false})}
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

   const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
   return (
    <div className="container mx-auto">
      {(product.product.tcin !== null && product.product.tcin !== undefined) &&
      <>
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={true}
          responsive={responsive}
          ssr={true}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={1000}
        >
          {product.product.item.enrichment.images.alternate_image_urls.map((p, index) => (
            <div key={index}>
              <img src={p} alt={product.product.item.product_vendors[0].vendor_name} />
            </div>
          ))}
        </Carousel>
        <div className="info-title">Name</div>
        <div>{product.product.item.product_vendors[0].vendor_name}</div>
        <div className="info-title">Price</div>
        <div>{product.product.price.formatted_current_price}</div>
        <div className="info-title">Relationship Type</div>
        <div>{product.product.item.relationship_type}</div>
        <div className="info-title">Product Description</div>
        <div>
          {product.product.item.product_description.title}
          <div>
            {product.product.item.product_description.bullet_descriptions.map(
              (p: any, index) => (
                <div key={index}>
                  <div dangerouslySetInnerHTML={{ __html: p }} />
                </div>
              )
            )}
          </div>
        </div>
        <a
          href={product.product.item.enrichment.buy_url}
          className="inline-block my-5 px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm"
        >
          BUY
        </a>
        <ToastContainer />
      </>
      }
    </div>
  );
}