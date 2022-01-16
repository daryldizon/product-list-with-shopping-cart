import { useState, useEffect } from 'react';
import InputQuantity from './InputQuantity';

const ProductList = ({ products, add, itemsPerPage }) => {

    const [currentItems, setCurrentItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [itemCount, setItemCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(products.slice(itemOffset, endOffset));
        setItemCount(products.length)
        setPageCount(Math.ceil(products.length / itemsPerPage));
        if(currentPage > Math.ceil(products.length / itemsPerPage)) {
            setItemOffset(0)
            setCurrentPage(1)
        }

      }, [products, itemOffset, itemsPerPage, currentPage]);

    const paginate = (page) => {
        setCurrentPage(page > pageCount ? pageCount : page)
        if(page > 0 && page <= pageCount) {
            const itemOffset = (itemsPerPage*page) - itemsPerPage;
            setItemOffset(itemOffset)
        }
        if(page > pageCount) {
            page = pageCount
            const itemOffset = (itemsPerPage*page) - itemsPerPage;
            setItemOffset(itemOffset)
        }
    }
    const next = () => {
        let page = currentPage
        if(page < pageCount) {
            page++;
            const itemOffset = (itemsPerPage*page) - itemsPerPage;
            setItemOffset(itemOffset)
            setCurrentPage(page)
        }
    }
    const previous = () => { 
        let page = currentPage
        if(page > 1) {
            page--;
            const itemOffset = (itemsPerPage*page) - itemsPerPage;
            setItemOffset(itemOffset)
            setCurrentPage(page)
        }
    }

    return (
        <div className="shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal overflow-x-auto">
                <thead>
                    <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Brand</th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>            
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length === 0 && <tr><td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">No product found!</td></tr> }
                    {currentItems.map((product) => 
                        <tr key={product.id}>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{product.category}</td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{product.brand}</td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{product.display_name}</td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">&#8369; {product.price}</td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <InputQuantity value={1} updateQuantity={(quantity) => product.quantity = quantity } />
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <button className="px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-1 md:text-md md:px-4" onClick={() => add(product) }>
                                Add to Cart
                                </button>
                            </td>
                        </tr>
                    )}
                    {currentItems.length > 0 && (
                        <tr>
                            <td className="px-5 py-5 border-b border-gray-200 bg-gray-100 text-sm">{itemOffset+1} - {(itemOffset + itemsPerPage) > itemCount ? itemCount : (itemOffset + itemsPerPage)} of {itemCount}</td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-gray-100 text-sm" colSpan={4}>
                                <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                                    <button className=" bg-gray-100 text-gray-600 hover:text-gray-700 hover:bg-gray-300 h-full w-20 rounded-l cursor-pointer outline-none" onClick={() => previous()}>
                                    <span className="m-auto text-2xl font-thin">{'<'}</span>
                                    </button>
                                    <input type="number" className="outline-none focus:outline-none text-center w-10 bg-gray-100 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700 outline-none" min="1" max={pageCount} value={currentPage} onChange={(e) => paginate(e.target.value) } />
                                    <button className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:bg-gray-300 h-full w-20 rounded-r cursor-pointer" onClick={() => next()}>
                                    <span className="m-auto text-2xl font-thin">{'>'}</span>
                                    </button>
                                </div>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-gray-100 text-sm">Page {currentPage > 0 && currentPage <= pageCount ? currentPage : 1} of 1 - {pageCount}</td>
                        </tr>
                    )}                    
                </tbody>
            </table>
        </div>
    );
}

export default ProductList;