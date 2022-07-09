import Link from 'next/link'
import Image from 'next/image'
import * as Utils from '../lib/utils'

export default function ProductCard({ item }) {
    return (

        <div className="white-box">
            <a href="#" className="product-wishlist selected"></a>
            <Link
                key={`selected_category_item_${item.id}`}
                passHref
                href={{
                    pathname: '/product/[name]/[id]',
                    query: { id: item._id, name: Utils.convertToSlug(item.name) },
                }}
            >
                <a>
                    <div className="product-img">
                        <Image
                            src={Utils.generateProductImage(item)}
                            alt={item?.name}
                            layout="fill" className={'common-product-image'}
                        />
                    </div>

                </a>
            </Link>
            <div className="product-content">
                <div className="xs-heading text-ellipsis">{item.name}</div>
                <div className="weight-count mt-1">{item.size}</div>
                <div className="d-flex align-items-center mt-10">
                    <div className="product-price">&#8377;{Number(item.gst_amount + item.price_without_gst).toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                    <div className="ml-auto">
                        <a href="#" className="add-product-icon">
                            <Image
                                width={40}
                                alt={"add button"}
                                height={40}
                                src={"/img/md_add_button.svg"} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}