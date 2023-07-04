import { useRouter } from "next/router";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
 interface Query {
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
  const query = router.query as Query;

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
        {query.item.enrichment.images.alternate_image_urls.map((p, index) => (
          <div key={index}>
            <img src={p} alt={query.item.product_vendors[0].vendor_name} />
          </div>
        ))}
      </Carousel>
      <div className="info-title">Name</div>
      <div>{query.item.product_vendors[0].vendor_name}</div>
      <div className="info-title">Price</div>
      <div>{query.price.formatted_current_price}</div>
      <div className="info-title">Relationship Type</div>
      <div>{query.item.relationship_type}</div>
      <div className="info-title">Product Description</div>
      <div>
        {query.item.product_description.title}
        <div>
          {query.item.product_description.bullet_descriptions.map(
            (p, index) => (
              <div key={index}>
                <div dangerouslySetInnerHTML={{ __html: p }} />
              </div>
            )
          )}
        </div>
      </div>
      <a
        href={query.item.enrichment.buy_url}
        className="inline-block my-5 px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm"
      >
        BUY
      </a>
    </div>
  );
}