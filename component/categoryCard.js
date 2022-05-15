import { Config } from '../config/appConfig';
import Image from 'next/image'

export default function CategoryCard({ item }) {
    const BASE_URL = `${Config.BaseURL[Config.Env].web}${Config.FilePath.categoryIcon}`
    return (
        <div className="category-box green-box" style={{ backgroundColor: item.bg_color_light, borderColor: item.bg_color_dark }}>
            <div className="product-img">
                <Image
                    src={BASE_URL + item.icon}
                    alt={item.name}
                    layout="fill" className={'common-category-image'}
                />
            </div>
            <div className="product-content">
                <div className="xs-heading category-name">{item.name}</div>
            </div>
        </div>
    )
}
