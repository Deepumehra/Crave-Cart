import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRestaurantsAction } from "../../../State/Customers/Restaurant/restaurant.action";
import MultipleItemsCarousel from "../../components/MultiItemCarousel/MultiItemCarousel";
import RestaurantCard from "../../components/RestarentCard/RestaurantCard";
import "./HomePage.css";
import WordFlicker from "./WordFlicker";
const HomePage = () => {
  const { auth, restaurant } = useSelector((store) => store);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.user) {
      dispatch(getAllRestaurantsAction(localStorage.getItem("jwt")));
    }
  }, [auth.user]);



  return (
    <div className="">
      <section className="-z-50 banner relative flex flex-col justify-center items-center">
        <div className="w-[50vw] z-10 text-center">
          <WordFlicker/>
          <p className="z-10   text-gray-300 text-xl lg:text-4xl">
            Taste the Convenience: Food, Fast and Delivered.
          </p>
        </div>

        <div className="cover absolute top-0 left-0 right-0"></div>
        <div className="fadout"></div>
      </section>

      <section className="p-10 lg:py-10 lg:px-20">
        <div className="">
          <p className="text-2xl font-semibold text-gray-400 py-3 pb-10">
            Top Meals
          </p>
          <MultipleItemsCarousel />
        </div>
      </section>
      <section className="px-5 lg:px-20">
        <div className="">
          <h1 className="text-2xl font-semibold text-gray-400 py-3 ">
            Order From Our Handpicked Favorites
          </h1>
          <div className="flex flex-wrap items-center justify-around ">
            {restaurant.restaurants.map((item, i) => (
              <RestaurantCard data={item} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
