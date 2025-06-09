import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
// Importa tu instancia de Axios configurada
import axios from "../utils/axiosConfig";
import styles from "../styles/AddProductForm.module.css";

const AddProductForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [images, setImages] = useState([]);
  const [bestseller, setBestseller] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubcategoryDisabled, setIsSubcategoryDisabled] = useState(true);
  const [uploadedImageId, setUploadedImageId] = useState(null);
  const [availableSizesForSubcategory, setAvailableSizesForSubcategory] =
    useState([]);

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const categoriesResponse = await axios.get("/categories");
        setCategories(categoriesResponse.data);

        const subcategoriesResponse = await axios.get("/subcategories");
        setSubcategories(subcategoriesResponse.data);
      } catch (error) {
        console.error("Error fetching categories and subcategories:", error);
        toast.error(
          "Failed to load categories and subcategories. Please check your network connection."
        );
      }
    };

    fetchCategoriesAndSubcategories();
  }, []);

  useEffect(() => {
    setIsSubcategoryDisabled(!categoryId);
    if (!categoryId) {
      setSubcategoryId("");
      setAvailableSizesForSubcategory([]);
      setSizes([]);
    }
  }, [categoryId]);

  useEffect(() => {
    if (subcategoryId) {
      const selectedSubcategory = subcategories.find(
        (sub) => sub.id_subcategory === parseInt(subcategoryId, 10)
      );
      if (selectedSubcategory && selectedSubcategory.available_sizes) {
        try {
          const parsedSizes = JSON.parse(selectedSubcategory.available_sizes);
          setAvailableSizesForSubcategory(parsedSizes);
        } catch (e) {
          console.error("Error parsing available_sizes from subcategory:", e);
          setAvailableSizesForSubcategory([]);
        }
      } else {
        setAvailableSizesForSubcategory([]);
      }
      setSizes([]);
    } else {
      setAvailableSizesForSubcategory([]);
      setSizes([]);
    }
  }, [subcategoryId, subcategories]);

  const handleSizeChange = (size) => {
    setSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setBestseller(checked);
    } else if (type === "file") {
      if (files && files.length <= 4) {
        const filesArray = Array.from(files);
        setImages(filesArray);
      } else if (files && files.length > 4) {
        e.target.value = "";
        toast.error("Máximo 4 imágenes permitidas.");
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          images: "Máximo 4 imágenes permitidas.",
        }));
      } else {
        setImages([]);
      }
    } else if (name === "price") {
      setPrice(value);
    } else if (name === "date") {
      setDate(value);
    } else if (name === "description") {
      setDescription(value);
    } else {
      if (name === "categoryId") {
        setCategoryId(value);
        setSubcategoryId("");
      } else if (name === "subcategoryId") {
        setSubcategoryId(value);
      } else {
        setName(value);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({});

    const errors = {};
    if (!name.trim()) errors.name = "El nombre es requerido";
    if (!description.trim()) errors.description = "La descripción es requerida";
    if (!price.trim()) {
      errors.price = "El precio es requerido";
    } else if (!/^\d+(\.\d{1,2})?$/.test(price)) {
      errors.price = "El precio debe ser un número válido (ej: 19.99)";
    }
    if (sizes.length === 0)
      errors.sizes = "Debe seleccionar al menos una talla";
    if (!date) errors.date = "La fecha es requerida";
    if (!categoryId) errors.categoryId = "Debe seleccionar una categoría";
    if (!subcategoryId)
      errors.subcategoryId = "Debe seleccionar una subcategoría";
    if (!images || images.length === 0)
      errors.images = "La imagen es requerida";
    else if (images.length > 1)
      errors.images = "Solo se permite una imagen para el producto.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category_id", categoryId);
      formData.append("subcategory_id", subcategoryId);
      formData.append("bestseller", bestseller ? "1" : "0");
      sizes.forEach((size) => formData.append("sizes[]", size));
      formData.append("date", date);
      if (images && images.length > 0) {
        formData.append("image", images[0]);
      } else {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          images: "La imagen es requerida",
        }));
        setLoading(false);
        return;
      }

      console.log(
        "Datos del formulario a enviar:",
        Object.fromEntries(formData.entries())
      );

      const productResponse = await axios.post("/products", formData);

      console.log("Respuesta de la creación del producto:", productResponse);
      const responseData = productResponse.data;
      console.log("Datos de respuesta del producto:", responseData);

      setName("");
      setDescription("");
      setPrice("");
      setSizes([]);
      setDate("");
      setCategoryId("");
      setSubcategoryId("");
      setImages([]);
      setBestseller(false);
      setFormErrors({});
      setUploadedImageId(null);
      setAvailableSizesForSubcategory([]);

      toast.success("Producto agregado exitosamente");
    } catch (error) {
      console.error("Error al agregar producto:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setFormErrors({ server: error.response.data.message });
        toast.error(error.response.data.message);
      } else {
        setFormErrors({ server: error.message });
        toast.error("Error al agregar producto");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.addProductFormContainer}>
      <h1 className={styles.addProductFormTitle}>Agregar Nuevo Producto</h1>
      <form onSubmit={handleSubmit} className={styles.addProductForm}>
        {/* Nombre */}
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.formLabel}>
            Nombre <span className={styles.required}>*</span>
          </label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={handleInputChange}
            className={`${styles.formInput} ${
              formErrors.name ? styles.inputError : ""
            }`}
            placeholder="Ingrese el nombre del producto"
            disabled={loading}
          />
          {formErrors.name && (
            <p className={styles.errorText}>{formErrors.name}</p>
          )}
        </div>

        {/* Descripción */}
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.formLabel}>
            Descripción <span className={styles.required}>*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleInputChange}
            className={`${styles.formInput} ${
              formErrors.description ? styles.inputError : ""
            }`}
            placeholder="Ingrese la descripción del producto"
            rows="4"
            disabled={loading}
          />
          {formErrors.description && (
            <p className={styles.errorText}>{formErrors.description}</p>
          )}
        </div>

        {/* Precio */}
        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.formLabel}>
            Precio <span className={styles.required}>*</span>
          </label>
          <input
            id="price"
            type="text"
            name="price"
            value={price}
            onChange={handleInputChange}
            className={`${styles.formInput} ${
              formErrors.price ? styles.inputError : ""
            }`}
            placeholder="Ingrese el precio del producto"
            disabled={loading}
          />
          {formErrors.price && (
            <p className={styles.errorText}>{formErrors.price}</p>
          )}
        </div>

        {/* Fecha */}
        <div className={styles.formGroup}>
          <label htmlFor="date" className={styles.formLabel}>
            Fecha <span className={styles.required}>*</span>
          </label>
          <input
            id="date"
            type="date"
            name="date"
            value={date}
            onChange={handleInputChange}
            className={`${styles.formInput} ${
              formErrors.date ? styles.inputError : ""
            }`}
            disabled={loading}
          />
          {formErrors.date && (
            <p className={styles.errorText}>{formErrors.date}</p>
          )}
        </div>

        {/* Categoría */}
        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.formLabel}>
            Categoría <span className={styles.required}>*</span>
          </label>
          <select
            id="category"
            name="categoryId"
            value={categoryId}
            onChange={handleInputChange}
            className={`${styles.formSelect} ${
              formErrors.categoryId ? styles.inputError : ""
            }`}
            disabled={loading}
          >
            <option key="" value="">
              Seleccione una categoría
            </option>
            {categories &&
              categories.map((category) => (
                <option key={category.id_category} value={category.id_category}>
                  {category.name}
                </option>
              ))}
          </select>
          {formErrors.categoryId && (
            <p className={styles.errorText}>{formErrors.categoryId}</p>
          )}
        </div>

        {/* Subcategoría */}
        <div className={styles.formGroup}>
          <label htmlFor="subcategory" className={styles.formLabel}>
            Subcategoría <span className={styles.required}>*</span>
          </label>
          <select
            id="subcategory"
            name="subcategoryId"
            value={subcategoryId}
            onChange={handleInputChange}
            className={`${styles.formSelect} ${
              formErrors.subcategoryId ? styles.inputError : ""
            }`}
            disabled={loading || isSubcategoryDisabled}
          >
            <option key="" value="">
              {isSubcategoryDisabled
                ? "Seleccione una categoría primero"
                : "Seleccione una subcategoría"}
            </option>
            {subcategories &&
              subcategories
                .filter((sub) => sub.id_category === parseInt(categoryId, 10))
                .map((subcategory) => (
                  <option
                    key={subcategory.id_subcategory}
                    value={subcategory.id_subcategory}
                  >
                    {subcategory.name}
                  </option>
                ))}
          </select>
          {formErrors.subcategoryId && (
            <p className={styles.errorText}>{formErrors.subcategoryId}</p>
          )}
        </div>

        {/* Tallas */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Tallas <span className={styles.required}>*</span>
          </label>
          <div className={styles.sizeButtons}>
            {availableSizesForSubcategory.length > 0 ? (
              availableSizesForSubcategory.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeChange(size)}
                  className={`${styles.sizeButton} ${
                    sizes.includes(size) ? styles.selected : ""
                  }`}
                  disabled={loading || !subcategoryId}
                >
                  {size}
                </button>
              ))
            ) : (
              <p className={styles.noSizesMessage}>
                Seleccione una subcategoría para ver las tallas disponibles.
              </p>
            )}
          </div>
          {formErrors.sizes && (
            <p className={styles.errorText}>{formErrors.sizes}</p>
          )}
        </div>

        {/* Imagen */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Imagen del Producto <span className={styles.required}>*</span>
          </label>
          <input
            type="file"
            name="image"
            onChange={handleInputChange}
            className={`${styles.formInput} ${
              formErrors.images ? styles.inputError : ""
            }`}
            disabled={loading}
            accept="image/*"
            multiple={false}
          />
          {formErrors.images && (
            <p className={styles.errorText}>{formErrors.images}</p>
          )}
          {images && images.length > 0 && (
            <div className={styles.imagePreviews}>
              <div key={0} className={styles.imageContainer}>
                <img
                  src={URL.createObjectURL(images[0])}
                  alt={`Preview Producto`}
                  className={styles.imagePreview}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bestseller */}
        <div className={styles.formGroup}>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="bestseller"
              name="bestseller"
              checked={bestseller}
              onChange={handleInputChange}
              className={styles.checkboxInput}
              disabled={loading}
            />
            <label htmlFor="bestseller" className={styles.checkboxLabel}>
              Agregar a los más vendidos
            </label>
          </div>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className={styles.loadingIcon}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className={styles.loadingCircle}
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className={styles.loadingPath}
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Subiendo...
            </>
          ) : (
            "Agregar Producto"
          )}
        </button>
        {formErrors.server && (
          <p className={styles.serverError}>{formErrors.server}</p>
        )}
      </form>
    </div>
  );
};

export default AddProductForm;
