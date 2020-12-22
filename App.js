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


const App = () => {
const [loading,setLoading] = useState(false);
return (
  <Router>
    <Stack>
      <Scene key="init" component={Init} hideNavBar={true} title="Inicio" initial={true}/>
    </Stack>
  </Router>
);
};

export default App;
