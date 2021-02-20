import React, {createRef, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Done';
import Typography from '@material-ui/core/Typography';
import MoreHoriz from "@material-ui/icons/MoreHoriz";
import Tooltip from "@material-ui/core/Tooltip";
import {
    getPageSizeOptionsOnDialog,
    getTableHeaderBackgroundColor,
    getTableIcons, getTableRowBackgroundColorWithSelection
} from "../../utils/MaterialTableHelper";
import MaterialTable from "material-table";
import {
    getLastPageSizeOnDialog,
    setLastPageSizeOnDialog
} from "../../utils/ConfigurationStorage";
import {useTheme} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const {children, classes, onClose, ...other} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(0),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);


SelectSingleDialog.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    id: PropTypes.number.isRequired,
    tooltipTitle: PropTypes.string.isRequired,
    dialogTitle: PropTypes.string.isRequired,
    tableTitle: PropTypes.string.isRequired,
    maxWidth: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}

export default function SelectSingleDialog(props) {

    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [data] = useState(props.data);
    const tableRef = createRef();
    const [pageSize, setPageSize] = useState(getLastPageSizeOnDialog);
    const [selection, setSelection] = useState(props.id);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleSave = () => {
        setOpen(false);
        props.onChange(selection);
    }

    const onChangeRowsPerPage = (pageSize) => {
        setPageSize(pageSize);
        setLastPageSizeOnDialog(pageSize);
    }

    const getSelectionName = () => {
        if (selection > 0)
            return data.find(item => item.id === selection).name;
        else
            return '';
    }

    return (
        <div>
            <Tooltip title={props.tooltipTitle}>
                <Button
                    startIcon={<MoreHoriz/>}
                    onClick={handleClickOpen}
                >
                    {getSelectionName()}
                </Button>
            </Tooltip>
            <Dialog
                onClose={handleSave}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth={props.maxWidth}
            >
                <DialogTitle id="customized-dialog-title" onClose={handleSave}>
                    {props.dialogTitle}
                </DialogTitle>
                <DialogContent dividers>
                    <MaterialTable
                        icons={getTableIcons()}
                        title={props.tableTitle}
                        tableRef={tableRef}
                        columns={props.columns}
                        data={data}
                        onChangeRowsPerPage={onChangeRowsPerPage}
                        onRowClick={(event, rowData) => setSelection(rowData.id)}
                        options={{
                            paging: true,
                            pageSize: pageSize,
                            paginationType: 'stepped',
                            pageSizeOptions: getPageSizeOptionsOnDialog(),
                            actionsColumnIndex: -1,
                            sorting: false,
                            selection: false,
                            filtering: false,
                            padding: 'dense',
                            headerStyle: {backgroundColor: getTableHeaderBackgroundColor(theme)},
                            rowStyle: rowData => ({backgroundColor: getTableRowBackgroundColorWithSelection(rowData, theme, selection)})
                        }}
                        components={{
                            Container: props => <div {...props} />
                        }}
                    />
                </DialogContent>
                <DialogActions/>
            </Dialog>
        </div>
    );
}