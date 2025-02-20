import React, {useCallback, useContext, useEffect, useState} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import PropTypes from "prop-types";
import {Tabs} from "@material-ui/core";
import {getDeleteOptions, getPostOptions, getPutOptions, getSettingsTabHooverBackgroundColor, getSettingsTabSelectedColor} from "../../utils/MaterialTableHelper";
import Tab from "@material-ui/core/Tab";
import {MessageBox} from "../utils/MessageBox";
import TaskActions from "../utils/TaskActions";
import PropertiesTable from "../utils/PropertiesTable";
import {getBucketTags, getBucketTasks} from "../data/BucketDataTableHelper";
import EnumsProvider from "../../context/enums/EnumsProvider";
import Button from "@material-ui/core/Button";
import TaskMenuSelector from "../data/TaskMenuSelector";
import {handleErrors} from "../../utils/FetchHelper";
import {getDataUrl} from "../../utils/UrlBuilder";
import {getClassById, getPropertyByUuid} from "../../utils/JsonHelper";
import {Query, Utils as QbUtils} from "react-awesome-query-builder";
import {createConfig, getInitialTree, renderBuilder, renderResult} from "../utils/QueryBuilderHelper";
import AccessContext from "../../context/access/AccessContext";

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1)
    }
});

const DialogTitle = withStyles(styles)(props => {
    const {children, classes, onClose} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(0),
    },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const debounce = (func, wait, immediate) => {
    let timeout;

    return (...args) => {
        let context = this;
        let later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

TaskExecutionDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    bucket: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired
};

const initialActions = {properties: []};

export default function TaskExecutionDialog(props) {

    const classes = useStyles();
    const accessContext = useContext(AccessContext);
    const bucketTags = getBucketTags(props.bucket, accessContext.tags);
    const [activeTab, setActiveTab] = useState(0);
    const [messageBox, setMessageBox] = useState({open: false, severity: 'error', title: '', message: ''});
    const [appliesCount, setAppliesCount] = useState(0);
    const [state, setState] = useState({actions: initialActions, properties: [], logic: null, tree: null, config: null});

    useEffect(() => {
        if (props.open) {
            setActiveTab(0);
            const properties = getClassProperties();
            const config = createConfig(properties, bucketTags, accessContext.users, accessContext.enums);
            const tree = QbUtils.checkTree(getInitialTree(null, null, config), config);
            setState({...state, properties: getClassProperties(), actions: initialActions, logic: null, tree: tree, config: config});
        }
    }, [props.open]);


    const onTaskSelected = (task) => {
        if (task.filterId != null) {
            const filter = accessContext.filters.filter(f => f.id === task.filterId)[0];
            const properties = getMergedProperties(getClassProperties(), task.configuration.properties, filter.configuration.properties);
            const config = createConfig(properties, bucketTags, accessContext.users, accessContext.enums);
            const tree = QbUtils.checkTree(getInitialTree(filter.configuration.logic, filter.configuration.tree, config), config);
            setState({
                ...state,
                actions: task.configuration.actions,
                logic: filter.configuration.logic,
                tree: tree,
                properties: properties,
                config: config
            });
        } else {
            const properties = getMergedProperties(getClassProperties(), task.configuration.properties, []);
            const config = createConfig(properties, bucketTags, accessContext.users, accessContext.enums);
            const tree = QbUtils.checkTree(getInitialTree(null, null, config), config);
            setState({
                ...state,
                actions: task.configuration.actions,
                logic: null,
                tree: tree,
                properties: properties,
                config: config
            });
        }
    }

    useEffect(() => {
        refreshAppliesCount({open: props.open, bucket: props.bucket, logic: state.logic});
    }, [props.open, state.logic]);

    const refreshAppliesCount = useCallback(
        debounce(({open, bucket, logic}) => {
            if (open) {
                let resultOk = true;
                fetch(getDataUrl(bucket) + '/get?limit=0', getPostOptions({logic}))
                    .then(handleErrors)
                    .catch(error => {
                        setMessageBox({open: true, severity: 'error', title: 'Error', message: error});
                        resultOk = false;
                    })
                    .then(result => {
                        if (resultOk)
                            setAppliesCount(result.total);
                    });
            }
        }, 1000),
        []
    );

    const onTaskExecute = () => {
        let resultOk = true;
        if (state.actions.type === 'remove') {
            fetch(getDataUrl(props.bucket), getDeleteOptions({logic: state.logic}))
                .then(handleErrors)
                .catch(error => {
                    setMessageBox({open: true, severity: 'error', title: 'Error', message: error});
                    resultOk = false;
                })
                .then(result => {
                    if (resultOk) {
                        setMessageBox({open: true, severity: 'success', title: result.message, message: null});
                        refreshAppliesCount({open: props.open, bucket: props.bucket, logic: state.logic});
                        props.reload();
                    }
                });
        } else {
            let change = false;
            let payload = {logic: state.logic};

            if (state.actions.setTag != null && state.actions.setTag === true) {
                payload.tagId = state.actions.tagId;
                change = true;
            }

            if (state.actions.setReserved != null && state.actions.setReserved === true) {
                payload.reserved = state.actions.reserved;
                change = true;
            }

            if (state.actions.properties != null && state.actions.properties.length > 0) {
                let propertiesToSet = {};
                let propertiesToRemove = [];
                state.actions.properties.forEach(property => {
                    const propertyDef = getPropertyByUuid(state.properties, property.uuid);
                    if (['setValue', 'setNull'].includes(property.action))
                        propertiesToSet[propertyDef.path] = property.value;
                    else
                        propertiesToRemove.push(propertyDef.path);
                });
                if (Object.keys(propertiesToSet).length) {
                    payload.propertiesToSet = propertiesToSet;
                    change = true;
                }

                if (propertiesToRemove.length > 0) {
                    payload.propertiesToRemove = propertiesToRemove;
                    change = true;
                }
            }

            if (change) {
                fetch(getDataUrl(props.bucket), getPutOptions(payload))
                    .then(handleErrors)
                    .catch(error => {
                        setMessageBox({open: true, severity: 'error', title: 'Error', message: error});
                        resultOk = false;
                    })
                    .then(result => {
                        if (resultOk) {
                            setMessageBox({open: true, severity: 'success', title: result.message, message: null});
                            refreshAppliesCount({open: props.open, bucket: props.bucket, logic: state.logic});
                            props.reload();
                        }
                    });
            } else
                setMessageBox({open: true, severity: 'info', title: "No modifications has been defined!", message: null});
        }
    }

    const handleChangedTab = (event, newActiveTab) => {
        setActiveTab(newActiveTab);
    }

    const handleClose = () => {
        props.onClose();
    };

    const getClassProperties = () => {
        if (props.bucket.classId != null) {
            const dataClass = getClassById(accessContext.classes, props.bucket.classId);
            return dataClass.configuration;
        } else
            return [];
    }

    const getMergedProperties = (classProperties, taskProperties, filterProperties) => {
        let mergedProperties = [];

        classProperties.forEach(property => {
            if (!mergedProperties.find(f => f.path === property.path)) {
                mergedProperties = [...mergedProperties, property];
            }
        });

        taskProperties.forEach(property => {
            if (!mergedProperties.find(f => f.path === property.path)) {
                mergedProperties = [...mergedProperties, property];
            }
        });

        filterProperties.forEach(property => {
            if (!mergedProperties.find(f => f.path === property.path)) {
                mergedProperties = [...mergedProperties, property];
            }
        });

        return mergedProperties;
    }

    const getUsedUuids = () => {
        return [];
    }

    const setActions = (actions) => {
        setState({...state, actions: actions});
    }

    const setProperties = (properties) => {
        setState({...state, properties: properties});
    }

    const onRulesChange = (tree, config) => {
        const logic = QbUtils.jsonLogicFormat(tree, config).logic;
        setState({...state, logic: logic, tree: tree, config: config});
    }

    return (
        <Dialog
            onClose={handleClose} // Enable this to close editor by clicking outside the dialog
            aria-labelledby="task-execution-dialog-title"
            open={props.open}
            fullWidth={true}
            maxWidth='lg'  //'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
        >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                <div className={classes.oneLine}>
                    <Typography variant="h6">{'Task execution'}</Typography>
                    <TaskMenuSelector tasks={getBucketTasks(props.bucket, accessContext.tasks)} onTaskSelected={onTaskSelected}/>
                    <Tabs
                        className={classes.tabs}
                        value={activeTab}
                        onChange={handleChangedTab}
                        centered
                    >
                        <StyledTab label="Action"/>
                        <StyledTab label="Rules"/>
                        <StyledTab label="Properties"/>
                    </Tabs>
                    <div className={classes.devGrabSpace}/>
                </div>
            </DialogTitle>
            <EnumsProvider>
                <DialogContent dividers style={{height: '62vh'}}>
                    {props.open && activeTab === 0 &&
                    <TaskActions
                        actions={state.actions}
                        properties={state.properties}
                        tags={getBucketTags(props.bucket, accessContext.tags)}
                        onChange={setActions}
                        pageSize={null}
                        customHeight={31}
                    />}

                    {props.open && activeTab === 1 &&
                    <div>
                        <Query
                            {...state.config}
                            value={state.tree}
                            onChange={onRulesChange}
                            renderBuilder={renderBuilder}
                        />
                        {renderResult({tree: state.tree, config: state.config})}
                    </div>
                    }

                    {props.open && activeTab === 2 &&
                    <PropertiesTable
                        used={getUsedUuids()}
                        data={state.properties}
                        onChange={setProperties}
                        title={'Class origin and defined properties:'}
                        pageSize={null}
                        customTableWidth={16}
                    />}

                </DialogContent>
            </EnumsProvider>
            <DialogActions>
                <Typography color={'primary'}>{`${appliesCount} data ${appliesCount > 1 ? 'rows' : 'row'} ${appliesCount > 1 ? 'match' : 'matches'} the rules`}</Typography>
                <div className={classes.divActionGrabSpace}/>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onTaskExecute}
                    disabled={state.actions.type == null}
                >
                    Execute
                </Button>
            </DialogActions>
            <MessageBox
                config={messageBox}
                onClose={() => setMessageBox({...messageBox, open: false})}
            />
        </Dialog>
    );
}


const useStyles = makeStyles(() => ({
    dialogPaper: {
        minHeight: '80vh',
    },
    oneLine: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    tabs: {
        flexGrow: 1
    },
    devGrabSpace: {
        width: '270px'
    },
    divActionGrabSpace: {
        width: '900px'
    }
}));

const tabStyles = theme => ({
    root: {
        "&:hover": {
            backgroundColor: getSettingsTabHooverBackgroundColor(theme),
            opacity: 1
        },
        "&$selected": {
            // backgroundColor: getSettingsTabSelectedBackgroundColor(theme),
            color: getSettingsTabSelectedColor(theme),
        },
        textTransform: "initial"
    },
    selected: {}
});

const StyledTab = withStyles(tabStyles)(Tab)
