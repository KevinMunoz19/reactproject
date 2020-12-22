import React, { useState, useEffect } from 'react';
import { Actions } from 'react-native-router-flux';
import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	Image,
	ImageBackground,
	ActivityIndicator,
	NativeModules,
	NativeEventEmitter,
}	from 'react-native';

import colorPalette from '../utils/colors';

import environmentVariables from '../utils/envVariables';



const Init = () => {





	function blank(){

	}

	// <TouchableOpacity style={styles.sendButtonP} onPress={nativeComponent}>
	// 	<Text style={{color:'white',textAlign:'center',fontSize:environmentVariables.sunmiApp ? 20:25, fontFamily:'SansationBold'}} allowFontScaling={false}>Android</Text>
	// </TouchableOpacity>

  return (
    <View style={styles.container}>

	      <View style={styles.loaderContainer}>
	        <ActivityIndicator visible={false} size='large' color={colorPalette.color}/>
	        <Text allowFontScaling={false}>Cargando...</Text>
	      </View>



        <View style={styles.textHeaderContainer}>

          <Text style={{ ...styles.textHeader, fontSize:environmentVariables.sunmiApp ? 25:30}} allowFontScaling={false}>¿Ya tienes usuario?</Text>
        </View>


        <React.Fragment>
          <View style={styles.imageContainer}>

          </View>

					<View style={styles.imageContainerArrow}>

          </View>



            <TouchableOpacity style={styles.sendButtonP} >
              <Text style={{color:'white',textAlign:'center',fontSize:environmentVariables.sunmiApp ? 20:25, fontFamily:'SansationBold'}} allowFontScaling={false}>Ingresa tu NIT</Text>
            </TouchableOpacity>



						<TouchableOpacity style={styles.sendButton} >
              <Text style={{color:colorPalette.rgbColorPurple, textAlign:'center', fontSize:environmentVariables.sunmiApp ? 20:25, fontFamily:'SansationBold'}} allowFontScaling={false}>Iniciar Sesion</Text>
            </TouchableOpacity>



        </React.Fragment>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: colorPalette.rgbColorOrange,
		flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
		width: '100%',
    height: '100%',

  },
	imageContainerArrow: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
		width: '100%',
    height: '100%',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',

  },
  image: {
    width:'50%',
		height:'50%',
		resizeMode: 'contain'
  },
  bodyContainer:{
    flex:4,
    justifyContent:'flex-end'
  },
  buttonContainer: {
		backgroundColor:'white',
		height:'5%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  sendButtonP:{
		//backgroundColor:'rgba(119,211,83,0.5)',
		backgroundColor:colorPalette.rgbColorPurple,
		width:'45%',
		height:'9%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
		borderRadius:15,
		borderBottomRightRadius:30,
		marginBottom:20,
	},
	sendButton:{
		//backgroundColor:'rgba(119,211,83,0.5)',
		backgroundColor:'white',
		width:'45%',
		height:'9%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
		borderRadius:15,
		borderBottomRightRadius:30,
		marginBottom:60,
	},
	textHeader:{
    color:'white',
    fontSize:25,
		fontFamily: 'SansationBold',
  },
  textHeaderContainer:{
		backgroundColor:colorPalette.rgbColorOrange,
    width:'70%',
    height:'10%',
    alignItems:'center',
    justifyContent:'center',
		marginTop: 50,
  },
  headerContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
		height:'10%',
  },
});

export default Init;
