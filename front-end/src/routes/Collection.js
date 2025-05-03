import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import styles from "../styles/Collection.module.css";

function Collection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategoriesByCategory, setSubCategoriesByCategory] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const API_URL = `http://${window.location.hostname}:5000`;

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const productsResponse = await axios.get(`${API_URL}/api/products`);

        setProducts(productsResponse.data);

        const categoriesResponse = await axios.get(`${API_URL}/api/categories`);
        setCategories(categoriesResponse.data);

        const subcategoriesMap = {};
        for (const category of categoriesResponse.data) {
          const subcategoriesResponse = await axios.get(
            `${API_URL}/api/subcategories/by-category?categoryId=${category.id_category}`
          );
          subcategoriesMap[category.id_category] = subcategoriesResponse.data;
        }
        setSubCategoriesByCategory(subcategoriesMap);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleCategoryCheckboxChange = (event) => {
    const categoryId = parseInt(event.target.value);
    if (event.target.checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );

      setSelectedSubCategories(
        selectedSubCategories.filter((subId) => {
          const subcategory = Object.values(subCategoriesByCategory)
            .flat()
            .find((sub) => sub.id_subcategory === subId);
          return subcategory && subcategory.id_category !== categoryId;
        })
      );
    }
  };

  const handleSubCategoryCheckboxChange = (event) => {
    const subcategoryId = parseInt(event.target.value);
    if (event.target.checked) {
      setSelectedSubCategories([...selectedSubCategories, subcategoryId]);
    } else {
      setSelectedSubCategories(
        selectedSubCategories.filter((id) => id !== subcategoryId)
      );
    }
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.id_category);
    const subCategoryMatch =
      selectedSubCategories.length === 0 ||
      selectedSubCategories.includes(product.id_subcategory);
    return categoryMatch && subCategoryMatch;
  });

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div>Error al cargar los datos: {error}</div>;
  }

  return (
    <div className={styles.collectionContainer}>
      <h1>Nuestra Colección</h1>
      <div className={styles.contentContainer}>
        <div className={styles.filterSidebar}>
          <h3>Categorías</h3>
          <ul>
            {categories.map((category) => (
              <li key={category.id_category}>
                <input
                  type="checkbox"
                  value={category.id_category}
                  checked={selectedCategories.includes(category.id_category)}
                  onChange={handleCategoryCheckboxChange}
                />
                <label>{category.name}</label>
              </li>
            ))}
          </ul>

          <h3>Subcategorías</h3>
          <ul>
            {Object.values(subCategoriesByCategory)
              .flat()
              .map((subcategory) => (
                <li key={subcategory.id_subcategory}>
                  <input
                    type="checkbox"
                    value={subcategory.id_subcategory}
                    checked={selectedSubCategories.includes(
                      subcategory.id_subcategory
                    )}
                    onChange={handleSubCategoryCheckboxChange}
                  />
                  <label>{subcategory.name}</label>
                </li>
              ))}
          </ul>
        </div>
        <div className={styles.productListContainer}>
          <div className={styles.productList}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collection;
