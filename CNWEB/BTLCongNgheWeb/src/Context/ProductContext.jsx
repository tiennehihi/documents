import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ProductContext = createContext()

export const ProductContextProvider = (props) => {
    const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://86yfl7-8080.csb.app/books");
        setProduct(response.data);
      } catch (error) {
        console.log("Axios error: ", error);
      }
    };

    fetchData();
  }, []);

  const contextValue = {product}
    return (
        <ProductContext.Provider value={contextValue}>
            {props.children}
        </ProductContext.Provider>
    )
}
