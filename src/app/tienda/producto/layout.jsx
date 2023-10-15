'use client'
// @ts-ignore
// import { useSearchParams } from "next/navigation";
import ProductosDestacados from '@/app/tienda/components/productosDestacados'

// async
function ProductPage ({ children }) {
  // , params
  // const searchParams = useSearchParams();
  // console.log("searchParams", searchParams.get("id"), searchParams.get("category"));
  // const { id, category } = params;
  return (
    <article>
      {/* TODO: Implement new product layout <p>details layout</p> */}
      {children}
      <ProductosDestacados />
    </article>
  )
}

export default ProductPage
