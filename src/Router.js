import React from "react";
import{
    createSwitchNavigator,
    createAppContainer,
}from 'react-navigation'

import Login from './pages/Login';
import Apiclient from './services/Apiclient';
const AppSwitchNavigator =createSwitchNavigator(
    {
        Apiclient:{
            screen : Apiclient
        }

    },
    {
        initialRoutName : 'Apiclient' 
    }
)  

export default createAppContainer(AppSwitchNavigator);