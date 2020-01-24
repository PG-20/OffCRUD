import {gql} from 'apollo-boost';

export const GET_PRODUCTS = gql`
    {
        products: getProducts{
            productID
            name
            quantity
            price
        }
    }
`;

export const ADD_PRODUCT = gql`
    mutation AddProduct($name: String!, $quantity: Int!, $price: Float!) {
        added: addProduct(input: {name: $name,
            quantity: $quantity,
            price: $price}) {
            productID
            name
            quantity
            price
        }
    }
`;

export const EDIT_PRODUCT = gql`
    mutation EditProduct($productID: Int!, $name: String, $quantity: Int, $price: Float) {
        editProduct(input: {productID: $productID,
            name: $name,
            quantity: $quantity,
            price: $price}) {
                productID
                name
                quantity
                price
        }
    }
`;

export const DELETE_PRODUCT = gql`
    mutation DeleteProduct($productID: Int!) {
        deletedID: deleteProduct(id: $productID)
    }
`;


