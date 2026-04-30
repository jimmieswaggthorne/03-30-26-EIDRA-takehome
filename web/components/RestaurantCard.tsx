'use client';
import { getOpenStatus } from "@/lib/services";
import clsx from "clsx";
import { useEffect, useState } from "react";

const RestaurantCard = ({ restaurant }: { restaurant: any }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        getOpenStatus(restaurant.id).then((res) => {
            setIsOpen(res.data.is_open);
        });
    }, [restaurant.id]);

    const cardClass = clsx({ "card restaurant-card px-2": true }, { "restaurant-card-open": isOpen }, { "restaurant-card-closed": !isOpen });
    return (
        <div className={cardClass} style={{ backgroundImage: `url(${restaurant.image_url})` }}>
            <div className="card-body">
                {isOpen ? <div className="d-flex g-3">
                    <span className="badge rounded-pill border border-secondary text-secondary bg-transparent">
                        <i className="bi bi-circle-fill text-success"></i> Open
                    </span>

                </div> : <span className="badge rounded-pill border border-secondary text-dark bg-transparent">
                    <i className="bi bi-circle-fill text-dark"></i> Closed
                </span>}
            </div>
            <div className="card-body d-flex justify-content-between align-items-end">
                <div className="col">
                    <h5 className="card-title mb-0">{restaurant.name}</h5>
                    <div className="card-text d-flex align-items-center fs-7 text-muted">{restaurant.rating} <div style={{ overflowX: 'hidden', maxWidth: `${restaurant.rating}ch`, textWrap: 'nowrap', fontFamily: 'monospace' }} className="fs-5 ms-1 mb-1">★★★★★</div></div>
                </div>
                <div className="col-auto">
                    <span className="btn btn-success rounded-circle square"><i className="bi bi-arrow-right"></i></span>
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;