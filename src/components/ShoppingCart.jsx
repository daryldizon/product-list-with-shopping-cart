

import { useState } from 'react';
import InputQuantity from './InputQuantity';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

const ShoppingCart = ({ cart, update, remove }) => {
    const [showModal, setShowModal] = useState(false)
    const totalPrice = cart.reduce((a, item) => a + parseInt(item.quantity) * item.price, 0);
    const totalQuantity = cart.reduce((a, item) => a + parseInt(item.quantity), 0);

    return (
        <div>
            <button className="px-8 py-4 my-4 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-1 md:text-md md:px-4" onClick={() => setShowModal(true)}>
              View Cart
            </button>
            
            <ReactModal isOpen={showModal} contentLabel="Shopping Cart">
                <button className="px-8 py-4 my-4 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 md:py-1 md:text-md md:px-4" onClick={() => setShowModal(false)}>Close Shopping Cart</button>
                <div className="shadow rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal overflow-x-auto">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Brand</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">SubTotal</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>            
                            </tr>
                        </thead>
                        <tbody> 
                            {cart.length === 0 && <tr><td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">Your shopping cart is empty.</td></tr> }
                            {cart.map((item) => 
                                <tr key={item.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{item.category}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{item.brand}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{item.display_name}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-center bg-white text-sm">&#8369; {item.price}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <InputQuantity value={item.quantity} updateQuantity={(quantity) => update(item, quantity)} isCart={true} remove={() => remove(item) } />
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-center text-sm">&#8369; { (item.price * item.quantity).toFixed(2) }</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button className="px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 md:py-1 md:text-md md:px-4" onClick={() => remove(item)}>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            )}
                            {cart.length !== 0 && (
                                <tr>
                                    <td colSpan={4}></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-xl">Total Quantity: <span className='font-bold'>{totalQuantity}</span></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-center text-xl">Total Price: 
                                        <span className='font-bold'> &#8369; {totalPrice.toFixed(2)}</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </ReactModal>
        </div>
    );
}

export default ShoppingCart;