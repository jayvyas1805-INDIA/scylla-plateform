import React, { useState, useEffect } from 'react';
import NavBar from '../../components/team/MarketPlaceNavbar';
import FilterDrawer from '../../components/team/FilterDrawer';
import ProductForm from '../../components/team/ProductForm';
import ProductCard from '../../components/team/ProductCard';
import '../../styles/marketplace.css';
import '../../index.css'
import '../../../globle.css'
import { getMarketPlace, addProduct, getMarketplaceFilters } from "../../api/product.api"

const Marketplace = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [products, setProducts] = useState([]);

    const [filters, setFilters] = useState({
        categories: [],
        brands: [],
        conditions: [],
        maxPrice: 0
    });

    const [filterOptions, setFilterOptions] = useState({
        categories: [],
        brands: [],
        conditions: [],
        maxPrice: 0
    });


    const [filteredProducts, setFilteredProducts] = useState(products);



    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await getMarketplaceFilters();
                if (res.data.success) {
                    setFilterOptions(res.data.data);
                    setFilters(prev => ({
                        ...prev,
                        maxPrice: res.data.data.maxPrice
                    }));
                }
            } catch (err) {
                console.error("Filter fetch error", err);
            }
        };

        fetchFilters();
    }, []);


    useEffect(() => {
        let filtered = products;

        if (filters.categories.length) {
            filtered = filtered.filter(p =>
                filters.categories.includes(p.category)
            );
        }

        if (filters.conditions.length) {
            filtered = filtered.filter(p =>
                filters.conditions.includes(p.condition)
            );
        }

        if (filters.brands.length) {
            filtered = filtered.filter(p =>
                filters.brands.includes(p.brand)
            );
        }

        if (filters.maxPrice > 0) {
            filtered = filtered.filter(p => p.price <= filters.maxPrice);
        }

        setFilteredProducts(filtered);
    }, [filters, products]);



    const handleAddProduct = async (formData) => {
        try {
            const res = await addProduct(formData);

            if (res.data.success) {
                // Optional: optimistic UI update (admin approval may hide it later)
                setProducts(prev => [res.data.data, ...prev]);

                setIsFormOpen(false);
            }
        } catch (error) {
            console.error("Add product error:", error);
            alert("Failed to add product");
        }
    };


    useEffect(() => {
        const fetchMarketplace = async () => {
            try {
                const res = await getMarketPlace();

                if (res.data.success) {
                    setProducts(res.data.data); // 👈 important
                }
            } catch (err) {
                console.error("Marketplace fetch error", err);
            }
        };

        fetchMarketplace();
    }, []);




    return (
        <div className="marketplace-container">
            <NavBar />

            <div className="marketplace-main">

                <div className="marketplace-controls">
                    <button
                        className="filter-toggle-btn"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        title="Toggle filters"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                        Filters
                    </button>

                    <button
                        className="add-product-btn"
                        onClick={() => setIsFormOpen(true)}
                        title="Add new product"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Product
                    </button>
                </div>

                {filteredProducts.length > 0 ? (
                    <>
                        <p className="products-count">
                            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                        </p>
                        <div className="products-grid">
                            {filteredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="no-products">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <h3>No products found</h3>
                        <p>Try adjusting your filters or add a new product!</p>
                    </div>
                )}
            </div>

            <FilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                setFilters={setFilters}
                filterOptions={filterOptions}
            />


            {isFormOpen && (
                <ProductForm
                    onSubmit={handleAddProduct}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </div>

    );
};

export default Marketplace;
