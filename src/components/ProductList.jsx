import { useState } from 'react';
import NumberStepper from './NumberStepper';
import { formatPrice } from '../utils';

const ProductRow = ({ product, onAdd }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <tr>
      <td className="table-td">{product.category}</td>
      <td className="table-td">{product.brand}</td>
      <td className="table-td">{product.display_name}</td>
      <td className="table-td">{formatPrice(product.price)}</td>
      <td className="table-td">
        <NumberStepper label="quantity" value={quantity} onChange={setQuantity} />
      </td>
      <td className="table-td">
        <button type="button" className="btn btn-primary" onClick={() => onAdd(product, quantity)}>
          Add to Cart
        </button>
      </td>
    </tr>
  );
};

const ProductList = ({ products, itemsPerPage, page, onPageChange, onAdd }) => {
  const pageCount = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const offset = (page - 1) * itemsPerPage;
  const currentItems = products.slice(offset, offset + itemsPerPage);

  return (
    <div className="shadow rounded-lg overflow-x-auto">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="table-th">Category</th>
            <th className="table-th">Brand</th>
            <th className="table-th">Product Name</th>
            <th className="table-th">Price</th>
            <th className="table-th">Quantity</th>
            <th className="table-th" />
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td className="table-td" colSpan={6}>No product found!</td>
            </tr>
          ) : (
            <>
              {currentItems.map((product) => (
                <ProductRow key={product.id} product={product} onAdd={onAdd} />
              ))}
              <tr>
                <td className="table-td bg-gray-100">
                  {offset + 1} - {offset + currentItems.length} of {products.length}
                </td>
                <td className="table-td bg-gray-100" colSpan={4}>
                  <NumberStepper
                    label="page"
                    value={page}
                    onChange={onPageChange}
                    max={pageCount}
                    tone="light"
                    symbols={['<', '>']}
                  />
                </td>
                <td className="table-td bg-gray-100">
                  Page {page} of {pageCount}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
