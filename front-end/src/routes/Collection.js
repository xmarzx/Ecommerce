import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";
import ProductCard from "../components/ProductCard";
import styles from "../styles/Collection.module.css";

function Collection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const productsResponse = await axios.get("/products");
        setProducts(productsResponse.data);

        const categoriesResponse = await axios.get("/categories");
        setCategories(categoriesResponse.data);

        const subcategoriesResponse = await axios.get("/subcategories");
        setAllSubCategories(subcategoriesResponse.data);

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
    let newSelectedCategories;

    if (event.target.checked) {
      newSelectedCategories = [...selectedCategories, categoryId];
    } else {
      newSelectedCategories = selectedCategories.filter(
        (id) => id !== categoryId
      );
    }
    setSelectedCategories(newSelectedCategories);

    setSelectedSubCategories((prevSelectedSubCategories) => {
      const relevantSubcategories = allSubCategories.filter((sub) =>
        newSelectedCategories.includes(sub.id_category)
      );
      const relevantSubcategoryIds = new Set(
        relevantSubcategories.map((sub) => sub.id_subcategory)
      );

      return prevSelectedSubCategories.filter((subId) =>
        relevantSubcategoryIds.has(subId)
      );
    });
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

  const subCategoriesToDisplay = allSubCategories.filter((sub) =>
    selectedCategories.includes(sub.id_category)
  );

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

          {selectedCategories.length > 0 && (
            <>
              <h3>Subcategorías</h3>
              <ul>
                {subCategoriesToDisplay.map((subcategory) => (
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
            </>
          )}
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
