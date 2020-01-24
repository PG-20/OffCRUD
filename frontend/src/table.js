import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Button,
} from '@material-ui/core';
import {useQuery} from "@apollo/react-hooks";
import {ADD_PRODUCT, DELETE_PRODUCT, EDIT_PRODUCT, GET_PRODUCTS} from "./GQLQueries";
import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ProductTableRow from "./tableRow";
import useNetwork from "./useNetwork";
import useOfflineMutation from "./useOfflineMutation";
import {addProductUpdate, deleteProductUpdate, editProductUpdate} from "./updateFunctions";
import ProductDialog from "./productDialog";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        overflowX: 'auto',
        margin: '10px 0'
    },
    table: {
        minWidth: 650,
    },
}));

const initialProductState = {
    name: '',
    quantity: '',
    price: '',
    productID: 0,
};


export default function Products(props) {
    const classes = useStyles();
    const [productDetails, setProductDetails] = useState(initialProductState);
    const {loading, error, data, refetch} = useQuery(GET_PRODUCTS);
    // eslint-disable-next-line
    const isOnline = useNetwork();
    // TODO: online/offline styling
    const [addProduct, addDetails] = useOfflineMutation(
        ADD_PRODUCT,
        {
            update: addProductUpdate,
            context: {
                serializationKey: 'products'
            }
        }
    );

    const [editProduct, editedDetails] = useOfflineMutation(
        EDIT_PRODUCT,
        {
            update: editProductUpdate,
            context: {
                serializationKey: 'products'
            }
        });

    const [deleteProduct] = useOfflineMutation(
        DELETE_PRODUCT,
        {
            update: deleteProductUpdate,
            context: {
                serializationKey: 'products'
            }
        });

    const [open, setOpen] = useState(false);

    const handleOpen = (idx) => {
        setProductDetails(data.products[idx]);
        setOpen(true);
    };

    const handleClose = () => {
        setProductDetails(initialProductState);
        setOpen(false);
    };

    const handleChange = (event) => {
        event.persist();
        let val = event.target.value;
        // eslint-disable-next-line
        val = parseFloat(val) == val ? parseFloat(val) : parseInt(val) == val ? parseInt(val) : val;
        setProductDetails(prevState => ({...prevState, [event.target.name]: val}));
    };

    const handleSubmit = () => {
        productDetails.productID
            ? editProduct({
                variables: {
                    ...productDetails
                },
                optimisticResponse: {
                    __typename: "Mutation",
                    editProduct: {
                        ...productDetails
                    },
                    __optimistic: true
                }
            })
            : addProduct({
                variables: {
                    ...productDetails
                },
                optimisticResponse: {
                    __typename: "Mutation",
                    added: {
                        ...productDetails,
                        __typename: "Product",
                        productID: -1
                    },
                    __optimistic: true
                }
            });
        handleClose();
    };

    const handleDelete = (id) => {
        deleteProduct({
            variables: {productID: id},
            optimisticResponse: {
                __typename: "Mutation",
                deletedID: id,
                __optimistic: true
            }
        })
    };
    if (loading) return <p>Loading...</p>;
    if (error || addDetails.error || editedDetails.error) return <p>{error.toString() || addDetails.error.toString() || editedDetails.error.toString()}</p>;
    return (
        <>
            <Paper className={classes.root}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Product ID</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.products.map((row, index) => (
                            <ProductTableRow row={row} index={index} onEdit={handleOpen} key={row.productID + index}
                                             onDelete={handleDelete}/>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Add Product
            </Button>
            <Button style={{marginLeft: 5}} variant="contained" color="secondary" onClick={() => refetch()}>
                Refetch
            </Button>
            <ProductDialog open={open} onClose={handleClose} onChange={handleChange} onSubmit={handleSubmit}
                           product={productDetails}/>
        </>
    )
}
