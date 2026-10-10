import React from 'react'
import BlogComponent from '@/Components/layouts/blogComponent'
import Breadcrumb from '@/Components/layouts/BreadCrumb'
const Blog = () => {
  return (
    <>
    <Breadcrumb title="Blog" />
    <BlogComponent />
    </>
  )
}

export default Blog