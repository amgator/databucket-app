import React, {useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import DatabucketLogo from "../../images/databucket-logo.png";
import SpringBootLogo from "../../images/spring-boot-logo.png";
import PostgresqlLogo from "../../images/postgresql-logo.png";
import ReactLogo from "../../images/react-js-logo.png";
import MaterialLogo from "../../images/material-ui-logo.png";
import MaterialTableLogo from "../../images/material-table-logo.png";
import GithubLogoDark from "../../images/github-logo-white.png";
import GithubLogoLight from "../../images/github-logo.png";
import JsonLogicLight from "../../images/jsonlogic-black.png";
import JsonLogicDark from "../../images/jsonlogic-white.png";
import ReactDiffViewerLogo from "../../images/react-diff-viewer-logo.png";
import DockerLogo from "../../images/docker-logo.png";
import TravisLogo from "../../images/travis-ci-logo.png";
import Link from "@material-ui/core/Link";
import {useTheme} from "@material-ui/core/styles";
import {Tooltip, withStyles} from "@material-ui/core";


const styles = {
    tooltip: {
        backgroundColor: "silver"
    }
};

const CustomTooltip = withStyles(styles)(Tooltip);

export default function InfoDialog() {

    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <ListItem button onClick={handleClickOpen}>
                <ListItemIcon><InfoIcon/></ListItemIcon>
                <ListItemText primary={'Info'}/>
            </ListItem>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
            >
                <img src={DatabucketLogo} alt=''/>
                <div style={{margin: '20px'}}>
                    <Typography color='secondary'>Version: <b>3.0.3</b></Typography>
                    <Link target='_blank' href='https://www.databucket.pl' color="primary">www.databucket.pl</Link><br/>
                    <Link target='_blank' href='https://github.com/databucket/databucket-app' color="textSecondary">Source code</Link><br/>
                    <Link target='_blank' href='https://github.com/databucket/databucket-app/issues' color="textSecondary">Report a bug, propose a new feature, ask a question...</Link><br/>
                    <Link target='_blank' href='https://github.com/databucket/databucket-app/blob/master/LICENSE' color="textSecondary">Licence: MIT License</Link><br/>
                </div>

                <div style={{marginLeft: '5px', marginBottom: '5px'}}>
                    <CustomTooltip
                        interactive
                        title={<Link rel="noopener noreferrer" href="https://spring.io/projects/spring-boot" target="_blank">Spring Boot</Link>}
                    >
                        <img src={SpringBootLogo} alt='Spring Boot' width='45' style={{margin: '5px', marginRight: '15px'}}/>
                    </CustomTooltip>

                    <CustomTooltip
                        interactive
                        title={<Link rel="noopener noreferrer" href="https://www.postgresql.org/" target="_blank">PostgreSQL</Link>}
                    >
                        <img src={PostgresqlLogo} alt='PostgreSQL' width='45' style={{marginLeft: '5px', margin: '0px'}}/>
                    </CustomTooltip>

                    <CustomTooltip
                        interactive
                        title={<Link rel="noopener noreferrer" href="https://reactjs.org/" target="_blank">React</Link>}
                    >
                        <img src={ReactLogo} alt='React' width='75' style={{margin: '0px'}}/>
                    </CustomTooltip>

                    <CustomTooltip
                        interactive
                        title={<Link rel="noopener noreferrer" href="https://material-ui.com/" target="_blank">Material-UI</Link>}
                    >
                        <img src={MaterialLogo} alt='Material-UI' width='50' style={{margin: '0px'}}/>
                    </CustomTooltip>

                    <CustomTooltip
                        interactive
                        title={<Link rel="noopener noreferrer" href="https://material-table.com/#/" target="_blank">material-table</Link>}
                    >
                        <img src={MaterialTableLogo} alt='material-table' width='50' style={{marginLeft: '10px'}}/>
                    </CustomTooltip>

                    <CustomTooltip
                        interactive
                        title={<Link rel="noopener noreferrer" href="https://jsonlogic.com/" target="_blank">JsonLogic</Link>}
                    >
                        <img src={theme.palette.type === 'light' ? JsonLogicLight : JsonLogicDark} alt='JsonLogic' width='50' style={{marginLeft: '10px'}}/>
                    </CustomTooltip>

                    <CustomTooltip
                        interactive
                        title={<Link rel="noopener noreferrer" href="https://praneshravi.in/react-diff-viewer/" target="_blank">React Diff Viewer</Link>}
                    >
                        <img src={ReactDiffViewerLogo} alt='React Diff Viewer' width='40' style={{marginLeft: '10px', marginBottom: '5px'}}/>
                    </CustomTooltip>

                    <CustomTooltip
                        interactive
                        title={<Link rel="noopener noreferrer" href="https://github.com/" target="_blank">Github</Link>}
                    >
                        <img src={theme.palette.type === 'light' ? GithubLogoLight : GithubLogoDark} alt='Github' width='70' style={{margin: '0px'}}/>
                    </CustomTooltip>

                    <CustomTooltip
                        interactive
                        title={<Link rel="noopener noreferrer" href="https://www.docker.com/" target="_blank">Docker</Link>}
                    >
                        <img src={DockerLogo} alt='Docker' width='50' style={{marginLeft: '2px'}}/>
                    </CustomTooltip>

                    <CustomTooltip
                        interactive
                        title={<Link rel="noopener noreferrer" href="https://www.travis-ci.com/" target="_blank">Travis CI</Link>}
                    >
                        <img src={TravisLogo} alt='Travis CI' width='42' style={{marginLeft: '10px', marginBottom: '3px'}}/>
                    </CustomTooltip>

                </div>

            </Dialog>
        </div>
    );
}