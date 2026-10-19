import { useState } from 'react';
import ReactModal from 'react-modal';
import NumberStepper from './NumberStepper';
import { formatPrice } from '../utils';

const ShoppingCart = ({ cart, onUpdateQuantity, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div>
      <button type="button" className="btn btn-primary my-4" onClick={() => setIsOpen(true)}>
        View Cart ({totalQuantity})
      </button>

      <ReactModal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} contentLabel="Shopping Cart">
        <button type="button" className="btn btn-secondary my-4" onClick={() => setIsOpen(false)}>
          Close Shopping Cart
        </button>
        <div className="shadow rounded-lg overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="table-th">Category</th>
                <th className="table-th">Brand</th>
                <th className="table-th">Product Name</th>
                <th className="table-th text-center">Price</th>
                <th className="table-th">Quantity</th>
                <th className="table-th text-center">SubTotal</th>
                <th className="table-th" />
              </tr>
            </thead>
            <tbody>
              {cart.length === 0 ? (
                <tr>
                  <td className="table-td" colSpan={7}>Your shopping cart is empty.</td>
                </tr>
              ) : (
                <>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td className="table-td">{item.category}</td>
                      <td className="table-td">{item.brand}</td>
                      <td className="table-td">{item.display_name}</td>
                      <td className="table-td text-center">{formatPrice(item.price)}</td>
                      <td className="table-td">
                        <NumberStepper
                          label="quantity"
                          value={item.quantity}
                          onChange={(quantity) => onUpdateQuantity(item.id, quantity)}
                          onBelowMin={() => onRemove(item)}
                        />
                      </td>
                      <td className="table-td text-center">{formatPrice(item.price * item.quantity)}</td>
                      <td className="table-td">
                        <button type="button" className="btn btn-secondary" onClick={() => onRemove(item)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4} />
                    <td className="table-td text-xl">
                      Total Quantity: <span className="font-bold">{totalQuantity}</span>
                    </td>
                    <td className="table-td text-center text-xl">
                      Total Price: <span className="font-bold">{formatPrice(totalPrice)}</span>
                    </td>
                    <td />
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </ReactModal>
    </div>
  );
};

export default ShoppingCart;
