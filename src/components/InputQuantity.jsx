import { useState } from 'react';

const InputQuantity = ({ value, updateQuantity, isCart, remove }) => {
    const [quantity, setQuantity] = useState(value ?? 1);

    const increment = () => {
        let i = parseInt(quantity)
        i += 1
        setQuantity(i)
        updateQuantity(i)
    }
    const decrement = () => { 
        let i = parseInt(quantity)
        if(i > 1) { 
            i -= 1
            setQuantity(i)
            updateQuantity(i)
        }
        if(parseInt(quantity) === 1 && isCart) remove()
    }

    return (
        <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
            <button data-action="decrement" className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none" onClick={() => decrement()}>
            <span className="m-auto text-2xl font-thin">−</span>
            </button>
            <input type="number" className="outline-none focus:outline-none text-center w-10 bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none" name="custom-input-number" min="1" value={quantity} onChange={(e) => {
              setQuantity(e.target.value >= 1 ? e.target.value : 1); updateQuantity(e.target.value >= 1 ? e.target.value : 1);
            }} />
            <button data-action="increment" className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer" onClick={() => increment()}>
            <span className="m-auto text-2xl font-thin">+</span>
            </button>
        </div>
    )
}

export default InputQuantity;
