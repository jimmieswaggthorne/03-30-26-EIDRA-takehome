'use client';

import { getFilters, getRestaurants } from "@/lib/services";
import { useEffect, useMemo, useState } from "react";
import RestaurantCard from "./RestaurantCard";

const MainPage = () => {
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const [filter, setFilter] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        setLoading(true);
        Promise.all([getRestaurants(), getFilters()]).then(([restaurants, categories]) => {
            setRestaurants(restaurants.data.restaurants);
            setCategories(categories.data.filters);
            setLoading(false);
        }).catch((err) => {
            console.error(err);
            setError(err.response.data.error);
            setLoading(false);
        });
    }, []);

    const list = useMemo(() => {
        if (!filter) return restaurants;
        return restaurants.filter((restaurant) => restaurant.filter_ids.includes(filter));

    }, [restaurants, filter]);
    const clickHandler = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.stopPropagation();
        if(filter === id) {
            setFilter(null);
        } else {
            setFilter(id);
        }
    }
    return <div className="container py-5">
        <img src="/images/logo.png" alt="Munchies" className="img-fluid mb-4" style={{ maxHeight: '40px' }} />
        {loading ? <div className="h-100 d-flex align-items-center justify-content-center fs-1 card p-3"><i className="bi bi-hourglass-split"></i> Loading...</div> : error ? <div className="h-100 d-flex align-items-center justify-content-center fs-1 card p-3"><i className="bi bi-exclamation-circle-fill text-danger"></i> {error}</div> :
            <div className="row d-flex g-4">
                <div className="col-12 col-md-4 col-lg-3">
                    <div className="card p-3">
                        <h5>Filter</h5>
                        <div className="mt-3 fs-7">
                            <p className="text-muted text-uppercase">Food Category</p>
                            <ul className="list-unstyled filter-list">
                                {categories?.map((category) => {
                                    const className = filter === category.id ? "btn btn-outline-primary bg-white text-dark btn-sm shadow-sm" : "btn btn-outline-light bg-white text-dark btn-sm shadow-sm";
                                    const isActive = filter === category.id;

                                    return (
                                        <li key={category.id} className="mb-1">
                                            <button className={className} onClick={(e) => clickHandler(e, category.id)}>{category.name} {isActive && <span className="btn btn-transparent text-primary btn-sm" ><i className="bi bi-x-circle-fill"></i></span>}   </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        {/* <div className="ms-4">
                            <p className="text-muted text-uppercase">Price Range</p>
                            <ul className="list-unstyled">
                                {categories?.map((category) => {
                                    const className = filter === category.id ? "btn btn-primary btn-sm" : "btn btn-outline-light text-dark btn-sm";
                                    const isActive = filter === category.id;

                                    return (
                                        <li key={category.id} className="mb-1">
                                            <button className={className} onClick={() => setFilter(category.id)}>{category.name} {isActive && <button className="btn btn-transparent text-light mb-1 btn-sm" onClick={(e) => { e.stopPropagation(); setFilter(null) }}><i className="bi bi-x-circle-fill"></i></button>}   </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div> */}
                    </div>
                </div>
                <div className="col-12 col-md-8 col-lg-9">
                    <div className="row d-flex g-4" >
                        <div className="col-12">
                            <div className="row d-flex g-3 category-list">
                                {categories?.map((category) => {
                                    const className = filter === category.id ? "btn btn-outline-primary bg-white text-dark category-card btn-sm shadow-sm" : "btn btn-outline-light bg-white text-dark category-card btn-sm shadow-sm";
                                    return (
                                        <button className={className} key={category.id} onClick={() => setFilter(category.id)}>
                                            <div className="d-flex justify-content-between">
                                                {category.name}
                                                <img src={category.image_url} alt={category.name} className="category-image" />
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="col-12">
                            <h2>Restaurants</h2>
                        </div>
                        {list.map((restaurant) => (
                            <div className="col-12 col-lg-4" key={restaurant.id}>
                                <RestaurantCard restaurant={restaurant} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>}
    </div>;
};

export default MainPage;