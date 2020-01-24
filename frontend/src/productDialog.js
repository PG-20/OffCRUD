import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import PropTypes from 'prop-types';

export default function ProductDialog(props) {
    return (
        <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">
            <DialogTitle
                id="form-dialog-title">{`${props.product.productID ? 'Edit' : 'Add'}`} Product {props.product.productID}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    name="name"
                    value={props.product.name}
                    onChange={props.onChange}
                    label="Name"
                    type="text"
                    fullWidth
                />
                <TextField
                    margin="normal"
                    id="quantity"
                    name="quantity"
                    value={props.product.quantity}
                    onChange={props.onChange}
                    label="Quantity"
                    type="number"
                />
                <TextField
                    margin="normal"
                    id="price"
                    name="price"
                    value={props.product.price}
                    onChange={props.onChange}
                    label="Price"
                    type="number"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={props.onSubmit} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

ProductDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    product: PropTypes.object,
};