import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import ShoppingCart from './components/ShoppingCart';
import ProductList from './components/ProductList';
import InputSelect from './components/InputSelect';
import Swal from 'sweetalert2'

const App = () => {
  const [data, setData] = useState([])
  const [products, setProducts] = useState([])
  const [shoppingCart, setShoppingCart] = useState(JSON.parse(window.localStorage.getItem("ShoppingCart")) ?? []) 
  
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const itemsPerPageOptions = [10,20,30,40,50,100]

  const [brand, setBrand] = useState("All")
  const [brands, setBrands] = useState([])

  const [category, setCategory] = useState("All")
  const [categories, setCategories] = useState([])

  const [search, setSearchProduct] = useState("")
   
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  useEffect(() => {
    async function getProducts() {
      const csvProducts = '/assets/Products.csv'
      const response = await fetch(csvProducts)
      const reader = response.body.getReader()
      const result = await reader.read()

      const decoder = new TextDecoder('utf-8')
      const csv = decoder.decode(result.value)
      const results = Papa.parse(csv, { header: true })
      setData(results.data)
      setProducts(results.data)

      const categories = results.data.reduce((a, item) => {
          return a.includes(item.category) ? a : a.concat([item.category]);
      }, [])
      setCategories(categories)
      
      const brands = results.data.reduce((a, item) => {
        return a.includes(item.brand) ? a : a.concat([item.brand]);
      }, []);
      setBrands(brands)
    }

    getProducts()
  }, [])

  const addItem = (product) => {
    const exist = shoppingCart.find((x) => x.id === product.id);
    let cart = [...shoppingCart, {...product, quantity: (product.quantity ?? 1) }]
    if(exist) {
      cart = shoppingCart.map((x) =>
        x.id === product.id ? { ...exist, quantity: parseInt(exist.quantity) + parseInt(product.quantity ?? 1) } : x
      )
    }

    setShoppingCart(cart)
    window.localStorage.setItem('ShoppingCart', JSON.stringify(cart)); // save to session

    Toast.fire({
      icon: 'success',
      title: `${product.display_name} (${product.quantity ?? 1} pc/s) has been added to your cart!`
    })
  }
  const updateItem = (product, quantity) => { 
    const exist = shoppingCart.find((x) => x.id === product.id);
    if(exist) {
      const cart = shoppingCart.map((x) =>
        x.id === product.id ? { ...exist, quantity: quantity } : x
      )
      
      setShoppingCart(cart);
      window.localStorage.setItem('ShoppingCart', JSON.stringify(cart)); // save to session
    }
  }
  const removeItem = (item) => {
    const items = new Set(shoppingCart);
    if(items.has(item)) items.delete(item)
    
    setShoppingCart([...items])
    window.localStorage.setItem('ShoppingCart', JSON.stringify([...items])); // save to session

    Toast.fire({
      icon: 'info',
      title: `${item.display_name} has been removed to your cart!`
    })
  }
  const updateCategory = (select) => {
    setSearchProduct("")
    setCategory(select)
    let products = data.filter( function (item) {
      if(select === "All" && brand !== "All") {
        return item.brand === brand
      } else if(select !== "All" && brand !== "All") {
        return item.category === select && item.brand === brand
      } else if(select !== "All" && brand === "All") {
        return item.category === select
      }
      return true
    });
    setProducts(products)
  }
  const updateBrand = (select) => {
    setSearchProduct("")
    setBrand(select)
    let products = data.filter( function (item) {
      if(select === "All" && category !== "All") {
        return item.category === category
      } else if(select !== "All" && category !== "All") {
        return item.brand === select && item.category === category
      } else if(select !== "All" && category === "All") {
        return item.brand === select
      }
      return true
    });
    setProducts(products)
  }
  const searchProduct = (query) => {
    setBrand("All")
    setCategory("All")
    setSearchProduct(query)
    let products = data.filter( function (item) {
      if(query !== "") {
        query = query.toLowerCase();
        return (item.display_name).toLowerCase().includes(query) || (item.category).toLowerCase().includes(query) || (item.brand).toLowerCase().includes(query)
      }
      return true
    });
    setProducts(products)
  }

  return (
    <div className="app">
      <div className="grid justify-items-center my-4 mx-6">
        <div className="container">
          <h1 className="text-center my-4 text-4xl font-bold">Product List with Shopping Cart</h1>
          <div className='flex my-4 items-center'>
            <div className='flex-1'>
              <ShoppingCart cart={shoppingCart} update={updateItem} remove={removeItem} />
            </div>
            <div className='flex-1'>
              <div className="px-4">
                Page Item: <InputSelect value={itemsPerPage} update={(count) => setItemsPerPage(parseInt(count))} options={itemsPerPageOptions} isNumber={true} />
              </div>
            </div>
            <div className='flex-1'>
              <div className="px-4">
                Categories: <InputSelect value={category} update={(category) => updateCategory(category)} options={categories} />
              </div>
            </div>
            <div className='flex-1'>
              <div className="px-4">
                Brands: <InputSelect value={brand} update={(brand) => updateBrand(brand)} options={brands} />
              </div>
            </div>
            <div className='flex-1'>
              <div className="px-4">
                Search Product: <input type="text" className='px-4 py-3 border border-primary' value={search} onChange={(e) => { searchProduct(e.target.value) }} />
              </div>
            </div>
          </div>
          <ProductList products={products} add={addItem} itemsPerPage={itemsPerPage} />            
        </div>
      </div>
    </div>
  )
}

export default App;


