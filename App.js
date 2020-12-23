import React, { useState, useEffect } from 'react';
import {
SafeAreaView,
StyleSheet,
ScrollView,
View,
Text,
StatusBar,
TouchableOpacity,
} from 'react-native';
import { Scene, Router, Stack, Tabs, Actions, ActionConst } from 'react-native-router-flux';
import Init from './src/views/Init';
import Login from './src/views/Login';


const App = () => {
const [loading,setLoading] = useState(false);
return (
  <Router>
    <Stack>
      <Scene key="init" component={Init} hideNavBar={true} title="Inicio" initial={true}/>
      <Scene key="login" component={Login} hideNavBar={true} title="Login"/>
    </Stack>
  </Router>
);
};

export default App;
