import React from 'react'
import BlogComponent from '@/Components/layouts/blogComponent'
import Breadcrumb from '@/Components/layouts/BreadCrumb'
const Blog = () => {
  return (
    <>
    <h1 className='text-white absolute left-[46vw] top-60 z-20 text-5xl font-bold'>Blog</h1>
    <Breadcrumb/>
    <BlogComponent />
    </>
  )
}

export default Blog