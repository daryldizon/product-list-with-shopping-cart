import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import ShoppingCart from './components/ShoppingCart';
import ProductList from './components/ProductList';
import InputSelect from './components/InputSelect';
import useCart from './hooks/useCart';
import { ALL, uniqueSorted } from './utils';

const PRODUCTS_URL = `${import.meta.env.BASE_URL}assets/Products.csv`;
const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 40, 50, 100];
const INITIAL_FILTER = { category: ALL, brand: ALL, search: '' };

const matches = (product, { category, brand }, query) =>
  (category === ALL || product.category === category) &&
  (brand === ALL || product.brand === brand) &&
  (!query || [product.display_name, product.category, product.brand].some((v) => v.toLowerCase().includes(query)));

const App = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(INITIAL_FILTER);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [page, setPage] = useState(1);
  const { cart, addItem, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    const controller = new AbortController();
    fetch(PRODUCTS_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load products (${response.status})`);
        return response.text();
      })
      .then((csv) => setProducts(Papa.parse(csv, { header: true, skipEmptyLines: true }).data))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message);
      });
    return () => controller.abort();
  }, []);

  const categories = useMemo(() => uniqueSorted(products, 'category'), [products]);
  const brands = useMemo(() => uniqueSorted(products, 'brand'), [products]);
  const filteredProducts = useMemo(() => {
    const query = filter.search.trim().toLowerCase();
    return products.filter((p) => matches(p, filter, query));
  }, [products, filter]);

  // Category/brand selection clears the search; searching resets both selects.
  const updateFilter = (next) => {
    setFilter(next);
    setPage(1);
  };

  return (
    <div className="grid justify-items-center my-4 mx-6">
      <div className="container">
        <h1 className="text-center my-4 text-4xl font-bold">Product List with Shopping Cart</h1>
        <div className="flex flex-wrap my-4 items-center gap-y-2">
          <div className="flex-1">
            <ShoppingCart cart={cart} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
          </div>
          <div className="flex-1">
            <InputSelect
              label="Page Item"
              value={itemsPerPage}
              options={ITEMS_PER_PAGE_OPTIONS}
              onChange={(count) => {
                setItemsPerPage(Number(count));
                setPage(1);
              }}
            />
          </div>
          <div className="flex-1">
            <InputSelect
              label="Categories"
              value={filter.category}
              options={categories}
              includeAll
              onChange={(category) => updateFilter({ ...filter, category, search: '' })}
            />
          </div>
          <div className="flex-1">
            <InputSelect
              label="Brands"
              value={filter.brand}
              options={brands}
              includeAll
              onChange={(brand) => updateFilter({ ...filter, brand, search: '' })}
            />
          </div>
          <div className="flex-1">
            <label className="px-4">
              Search Product:{' '}
              <input
                type="search"
                className="px-4 py-3 border border-gray-300"
                value={filter.search}
                onChange={(e) => updateFilter({ ...INITIAL_FILTER, search: e.target.value })}
              />
            </label>
          </div>
        </div>
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <ProductList
            products={filteredProducts}
            itemsPerPage={itemsPerPage}
            page={page}
            onPageChange={setPage}
            onAdd={addItem}
          />
        )}
      </div>
    </div>
  );
};

export default App;
