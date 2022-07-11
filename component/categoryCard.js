import { Config } from '../config/appConfig';
import Image from 'next/image'
import Link from 'next/link'
import * as Utils from "../lib/utils"

export default function CategoryCard({ item }) {
    const BASE_URL = `${Config.BaseURL[Config.Env].web}${Config.FilePath.categoryIcon}`
    return (
        <Link
            passHref
            href={{
                pathname: '/category/[id]/[name]',
                query: { id: item.id, name: Utils.convertToSlug(item.name) },
            }}
        >
            <a>
                <div className="category-box green-box" style={{ backgroundColor: item.bg_color_light, borderColor: item.bg_color_dark }}>
                    <div className="product-img">
                        <Image
                            src={BASE_URL + item.icon}
                            alt={item.name}
                            height={200}
                            width={200}
                            style={{ objectFit: 'contain' }}
                            layout="raw"
                            className={'common-category-image'}
                        />
                    </div>
                    <div className="product-content">
                        <div className="xs-heading category-name">{item.name}</div>
                    </div>
                </div>
            </a>
        </Link>
    )
}
