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
import Home from './src/views/Home';
import Clients from './src/views/Clients';
import Client from './src/views/Client'


import Icon from "react-native-vector-icons/MaterialIcons";
import colorPalette from './src/utils/colors';
import environmentVariables from './src/utils/envVariables';


const App = () => {
  const [loading,setLoading] = useState(false);
  return (
    <Router>
      <Stack>
        <Scene key="init" component={Init} hideNavBar={true} title="Inicio" initial={true}/>
        <Scene key="login" component={Login} hideNavBar={true} title="Login"/>
        <Scene key="client" component={Client} hideNavBar={true} title="Client"/>
        <Scene key="root" hideNavBar>
          <Tabs key='Tabbar' tabs={true}  default='Main' tabBarPosition="bottom" upperCaseLabel={true} showLabel={true}
                    tabBarStyle={styles.tabBar}
                    activeBackgroundColor="white"
                    inactiveBackgroundColor="white"
                    labelStyle={{color: 'black', alignSelf: 'center', fontSize:environmentVariables.sunmiApp ? 8:10}}
                    allowFontScaling={false}
                >
            <Scene key="home" icon={HomeIcon} component={Home} hideNavBar={true} title="Home" lazy={true} />
            <Scene key="clients" icon={ClientsIcon} component={Clients} hideNavBar={true} title="Mis Clientes" lazy={true} />
          </Tabs>
      	</Scene>
      </Stack>
    </Router>
  );


  const HomeIcon = ()  => (

  <Icon
    name="home"
    color={colorPalette.hexColorPurple}
    size={environmentVariables.sunmiApp ? 25:35}/>
  );
  const ClientsIcon = ()  => (
    <Icon
      name="people-outline"
      color={colorPalette.hexColorPurple}
      size={environmentVariables.sunmiApp ? 25:35}/>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 40,
    borderTopWidth: 0,
    opacity: 0.98,

  },
  tabBarText: {
    fontSize:10,
    color:colorPalette.hexColorOrange,
  },

});

export default App;
