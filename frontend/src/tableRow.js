import {Button, ButtonGroup, TableCell, TableRow} from "@material-ui/core";
import React from "react";
import PropTypes from 'prop-types';

export default function ProductTableRow (props) {
    return (
        <TableRow>
            <TableCell component="th" scope="row">
                {props.row.productID > 0 ? props.row.productID : '-'}
            </TableCell>
            <TableCell align="right">{props.row.name}</TableCell>
            <TableCell align="right">{props.row.quantity}</TableCell>
            <TableCell align="right">{props.row.price}</TableCell>
            <TableCell align="right">
                <ButtonGroup color="primary" aria-label="outlined primary button group">
                    <Button onClick={() => props.onEdit(props.index)} disabled={props.row.productID === -1}>✏</Button>
                    <Button onClick={() => props.onDelete(props.row.productID)}>🗑</Button>
                </ButtonGroup>
            </TableCell>
        </TableRow>
    );
}

ProductTableRow.propTypes = {
    row: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};
