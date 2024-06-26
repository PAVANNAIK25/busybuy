import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.css";
import ProductList from "../../components/Product/ProductList/ProductList";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsAsync, productActions, productSelector } from "../../redux/reducers/productsReducer";
import Loader from "../../components/UI/Loader/Loader";


function HomePage() {
  const [query, setQuery] = useState("");
  const [priceRange, setPriceRange] = useState(75000);
  const [categories, setCategories] = useState({
    mensFashion: false,
    electronics: false,
    jewelery: false,
    womensClothing: false,
  });
  const dispatch = useDispatch();
  const {products, loading, filterProduct} = useSelector(productSelector);

  // Fetch products on app mount
  useEffect(()=>{
    dispatch(fetchProductsAsync());
  }, [])

  // Rerender the products if the search or filter parameters change
  useEffect(()=>{
    dispatch(productActions.filteredProducts({searchQuery: query, priceRange, categories}));
  }, [priceRange, categories, query, dispatch])

  // Display loader while products are fetching using the Loader Component
  if(loading){
    return (
      <Loader/>
    )
  }

  return (
    <div className={styles.homePageContainer}>
      <FilterSidebar
        setPriceRange={setPriceRange}
        setCategories={setCategories}
        priceRange={priceRange}
      />
      <form className={styles.form}>
        <input
          type="search"
          placeholder="Search By Name"
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      
      {products.length ? (
        <ProductList products={products.length ? filterProduct : null} onCart={false}/>
      ) : null}
    </div>
  );
}

export default HomePage;
