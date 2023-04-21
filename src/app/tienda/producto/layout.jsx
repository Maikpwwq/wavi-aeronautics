// "use client";
// @ts-ignore
// import { useSearchParams } from "next/navigation";

async function ProductPage({ children }) {
  // , params
  // const searchParams = useSearchParams();
  // console.log("searchParams", searchParams.get("id"), searchParams.get("category"));
  // const { id, category } = params;
  return (
    <article>
      {/* TODO: Implement new product layout <p>details layout</p> */}
      {children}
    </article>
  );
}

export default ProductPage;
