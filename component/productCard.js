import Link from 'next/link'
import Image from 'next/image'
import * as Utils from '../lib/utils'

const ProductCardBusiness = ({ item }) => {
    return (
        <Link
            key={`selected_category_item_${item.id}`}
            passHref
            href={{
                pathname: '/product/[name]/[id]',
                query: { id: item._id, name: Utils.convertToSlug(`${item.name} ${item.size}`) },
            }}
        >
            <a>
                <div className="white-box">
                    <a href="#" className="product-wishlist"></a>
                    <div className="d-flex flex-row mb-3 justify-content-start">
                        <div className='p-2 flex-grow-1'>
                            <div className="product-img">
                                <Image
                                    src={Utils.generateProductImage(item)}
                                    alt={item?.name}
                                    layout="fill" className={'common-product-image img-responsive'}
                                />
                            </div>
                        </div>
                        <div className='p-2 flex-grow-1'>
                            <div className="xs-heading text-ellipsis">{Utils.truncateString(item.name, 20)} {item.size}</div>
                            <div className="xs-heading text-ellipsis">{item.business_caret_size} pieces per case</div>
                        </div>
                    </div>
                    <div className="product-content">
                        <div className="d-flex align-items-center mt-10">
                            <div className="product-price">MRP &#8377;{Number(item.business_gst_amount + item.business_price_without_gst).toLocaleString('en-US', { maximumFractionDigits: 2 })} per case</div>
                            <div className="ml-auto">
                                <a href="#" className="add-product-icon"><img width="40" height="40" src="/img/md_add_button.svg" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    )
}

const ProductCardCustomer = ({ item }) => {
    return (
        <div className="white-box">
            <a href="#" className="product-wishlist selected"></a>
            <div className="product-img">
                <Image
                    src={Utils.generateProductImage(item)}
                    alt={item?.name}
                    layout="fill" className={'common-product-image'}
                />
            </div>
            <div className="product-content">
                <div className="xs-heading text-ellipsis">{Utils.truncateString(item.name, 20)} {item.size}</div>
                <div className="xs-heading text-ellipsis">{item.business_caret_size} pieces per case</div>
                <div className="weight-count mt-1">500 gm(s)</div>
                <div className="d-flex align-items-center mt-10">
                    <div className="product-price">MRP &#8377;{Number(item.business_gst_amount + item.business_price_without_gst).toLocaleString('en-US', { maximumFractionDigits: 2 })} per case</div>
                    <div className="ml-auto">
                        <a href="#" className="add-product-icon"><img width="40" height="40" src="/img/md_add_button.svg" /></a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {
    ProductCardBusiness,
    ProductCardCustomer
};

