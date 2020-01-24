const {buildSchema} = require('graphql');

module.exports = buildSchema(`

        type Product {
            productID: Int!
            name: String!
            quantity: Int!
            price: Float!
        }    
        type RootQuery {         
            hello: String!
            getProducts: [Product!]! 
        }  
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
        
        type RootMutation {
            batchUpdate(input: BatchUpdateInput!): BatchUpdatePayload! 
            editProduct(input: EditProductInput!): Product!
            addProduct(input: AddProductInput!): Product!
            deleteProduct(id: Int!): Int!
        }
        
        type BatchUpdatePayload {
            created: [Product!]
            edited: [Product!]
            deleted: [Int!]
        }
        
        input BatchUpdateInput {
            toAdd: [AddProductInput!]
            toEdit: [EditProductInput!]
            toDelete: [Int!]
        }
        
        input AddProductInput {
            name: String
            quantity: Int
            price: Float
        }
        
        input EditProductInput {
            productID: Int
            name: String
            quantity: Int
            price: Float
        }

`);