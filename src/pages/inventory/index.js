import Breadcrumb from '@/Components/layouts/BreadCrumb'
import React from 'react'
import Products from '@/Components/layouts/products'
const Inventory = () => {
  return (
    <>
      <h1 className='text-white absolute left-[43vw] top-60 z-20 text-5xl font-bold'>Inventory</h1>
      <Breadcrumb/>
      <div className="results">
        <p className='Card text-2xl font-semibold p-8 border-none rounded-xl mt-5 ml-20 mr-20'>Showing 1-8 of 50 Results</p>
      </div>
      <Products/>
      </>
  )
}

export default Inventory