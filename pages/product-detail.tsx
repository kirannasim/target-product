import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "react-toastify/dist/ReactToastify.css";
 interface Product {
  tcin: string;
  item: {
    enrichment: {
      images: {
        alternate_image_urls: string[];
      };
      buy_url: string;
    };
    product_vendors: {
      vendor_name: string;
    }[];
    relationship_type: string;
    product_description: {
      title: string;
      bullet_descriptions: string[];
    };
  };
  price: {
    formatted_current_price: string;
  };
}
 export default function ProductDetail() {
  const router = useRouter();
  const query = router.query;
  const [products, setProducts] = useState<Product | undefined>();
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
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = localStorage?.getItem("products"); //filter((p) => p.tcin === query.tcin)[0];
        if (products) {
          const productData = await JSON.parse(products).data.data.search.products
          setProducts(productData);
        }
      } catch (error) {
        console.log(error);
      }
    };
     fetchProduct();
  }, []);
  return (
    <div className="container mx-auto mt-10">
      {products !== undefined && products !== null && (
        <>
          {products.filter((p: Product) => p.tcin === query.tcin).map((product: Product, index: Number) => 
          <div key={index}>
            {product.item.enrichment.images.alternate_image_urls.length > 2 ?
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
              {product.item.enrichment.images.alternate_image_urls.map(
                (p: string, index: number) => (
                  <div key={index}>
                    <img src={p} alt={product.item.product_vendors[0].vendor_name} />
                  </div>
                )
              )}
            </Carousel>
            :
            <div className="flex justify-around">
              {product.item.enrichment.images.alternate_image_urls.map(
                (p: string, index: number) => (
                  <div key={index}>
                    <img src={p} alt={product.item.product_vendors[0].vendor_name} />
                  </div>
                )
              )}
            </div>
            }
            <div className="product-name mt-2">{product.item.product_vendors[0].vendor_name}</div>
            <div className="price mt-4">{product.price.formatted_current_price}</div>
            <div className="relationship-type mt-2">{product.item.relationship_type}</div>
            <div className="description mt-3">
              {product.item.product_description.title}
              <div className="mt-4">
                {product.item.product_description.bullet_descriptions.map(
                  (p: string, index: number) => (
                    <div key={index}>
                      <div dangerouslySetInnerHTML={{ __html: p }} />
                    </div>
                  )
                )}
              </div>
            </div>
            <a
              href={product.item.enrichment.buy_url}
              className="inline-block my-5 px-12 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm"
            >
              BUY
            </a>
          </div>
          )}
        </>
      )}
    </div>
  );
}
