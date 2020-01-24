import {GET_PRODUCTS} from "./GQLQueries";

export const addProductUpdate = (cache, {data}) => {
    const {added} = data;
    const {products} = cache.readQuery({query: GET_PRODUCTS});
    cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
            products: products.concat(added)
        },
    });
};

export const editProductUpdate = (cache, {data: {editProduct}}) => {
    const {products} = cache.readQuery({query: GET_PRODUCTS});
    cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
            products: products.map((product) => {
                if (product.productID === editProduct.productID) return editProduct;
                return product;
            })
        },
    });
};

export const deleteProductUpdate = (cache, {data: {deletedID}}) => {
    const {products} = cache.readQuery({query: GET_PRODUCTS});
    cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
            products: products.filter((product) => product.productID !== deletedID)
        },
    });
};