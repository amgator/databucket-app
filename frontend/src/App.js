import React, {useContext} from 'react';
import {ThemeProvider} from '@material-ui/core/styles';
import {LightTheme, DarkTheme} from './utils/Themes'
import AppRouter from './route/AppRouter'
import CssBaseline from "@material-ui/core/CssBaseline";
import CustomThemeContext from "./context/theme/CustomThemeContext";
// import {getProjectId, getProjectName, getRoles, getThemeName, getToken} from "./utils/ConfigurationStorage";
// import DatabucketMainDrawer from './components/DatabucketMainDrower';
// import ConditionsTable from './components/conditionsTable/ConditionsTable';

export default function App() {

    window.apiURL = 'http://localhost:8080/api';
    // window.apiURL = './api';

    // console.log("Theme: " + getThemeName());
    // console.log("Token: " + getToken());
    // console.log("ProjectId: " + getProjectId());
    // console.log("ProjectName: " + getProjectName());
    // console.log("Roles: " + getRoles());

    const [themeName] = useContext(CustomThemeContext);
    return (
        <ThemeProvider theme={getTheme(themeName)}>
            <CssBaseline>
                <AppRouter/>
            </CssBaseline>
        </ThemeProvider>
        // <ConditionsTable />
    );
}

function getTheme(name) {
    switch (name) {
        case 'dark':
            return DarkTheme;
        default:
            return LightTheme;
    }
}
