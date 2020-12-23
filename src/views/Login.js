import React, {Fragment,useState,useEffect} from 'react';

import {
	Text,
	View,
	TextInput,
	Button,
	StyleSheet,
	Image,
	ImageBackground,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	ScrollView,
	Dimensions ,
	BackHandler,
}	from 'react-native';

import {Actions} from 'react-native-router-flux';

import colorPalette from '../utils/colors';


import environmentVariables from '../utils/envVariables';

import useUser from './../utils/useUser';
import useApi from './../utils/useApi';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from "react-native-vector-icons/MaterialIcons";



import DB from '../utils/DB';



const Login = () =>{

	const windowWidth = Dimensions.get('window').width;
		const windowHeight = Dimensions.get('window').height;

	const [nit,setNit] = useState('');
	const [username,setUsername] = useState('');
	const [password,setPassword] = useState('');
	const [vis, setVis] = useState(true);

	const {select,insert} = DB();

	const {setUser,getUser} = useUser();
	const {login, forgotPassword} = useApi();
	const [loading,setLoading] = useState(false);


	function blankF() {

	}
	function changeVisibility(){
			if (!vis) {
				setVis(true);
			}else{
				setVis(false);
			}


	}

	function handlerSend(){
		setLoading(true);
		function PadLeft(value, length) {
			return (value.toString().length < length) ? PadLeft("0" + value, length) : value;
		}



		login({
			"Username":`GT.${PadLeft(nit,12)}.${username}`,
			"Password":`${password}`
		},(response)=>{
			if(response!=null){
				if(response.code == null){

					var user = {
						name:username,
						nit:nit,
						stringNit:response.otorgado_a,
						token:response.Token
					}
					console.log("respuesta ",user);
					setUser(user,(userInfo)=>{
						setLoading(false);

						// if (environmentVariables.gasApp){
							//Actions.loginuser();
						// }else{
						 	Actions.home();
						// }

					});

				}else{
					setLoading(false);
					if(response.code == 2001){
						Alert.alert('Usuario o Clave invalida');
					}else{
						Alert.alert(response.message);
					}

				}
			}
		},(err)=>{
			setLoading(false);

			Alert.alert(`Error de la peticion -> ${err}`);
		});
	}

	function tempPassword(){
		function PadLeft(value, length) {
			return (value.toString().length < length) ? PadLeft("0" + value, length) : value;
		}

		if (nit.trim().length > 0 && username.trim().length > 0){
			var userNameXML = `GT.${PadLeft(nit.trim(),12)}.${username.trim()}`;

		} else {
			Alert.alert('Ingresar Nit y Usuario');
		}
	}

	useEffect(()=>{
		console.log('AAAAAAAAAAAAAAAAA')
      var query = `select * from users`;
      select(query,[],(dtes)=>{
				console.log('Entrada Select')
				console.log('Valores en db ',dtes)
      })
  },[])
	changeVisibility = ()=> {
			if (!vis) {
				setVis(true);
			}else{
				setVis(false);
			}


	}







	return(

			<View style={loginStyles.primaryContainer}>
			<ScrollView style={{flex:1}}>



				<View style={loginStyles.imageContainer}>
				<Image
					style={loginStyles.image}
					source={require('../img/Logo1.png')}
				/>
				</View>


				<View style={loginStyles.headerContainer}>
					<View style={loginStyles.textHeaderContainer}>
          	<Text style={{ ...loginStyles.textHeader, fontSize:environmentVariables.sunmiApp ? 20:25}} allowFontScaling={false}>Bienvenido</Text>
        	</View>
				</View>

				<View style={loginStyles.headerContainerSub}>
					<View style={loginStyles.textHeaderContainerSub}>
          	<Text style={{ ...loginStyles.textHeaderSub, fontSize:environmentVariables.sunmiApp ? 12:17}} allowFontScaling={false}>Ya eres cliente de Digifact, ingresa con NIT,
							usuario y contraseña. Si no la recuerdas haz
							click en recuperar contraseña</Text>
        	</View>
				</View>

				<View style={loginStyles.formContainer}>
					<View style={loginStyles.inputContainer}>
					<Icon
						name="fingerprint"
						color={colorPalette.hexColorWhite}
						size={environmentVariables.sunmiApp ? 20:25}/>
						<TextInput
							placeholder='NIT'
							style={loginStyles.input}
							onChangeText={(e)=>{setNit(e)}}
					    fontSize={environmentVariables.sunmiApp ? 15:20}

							placeholderTextColor={colorPalette.hexColorWhite}
							 allowFontScaling={false}

						/>
					</View>
					<View style={loginStyles.inputContainer}>
					<Icon
						name="person-outline"
						color={colorPalette.hexColorWhite}
						size={environmentVariables.sunmiApp ? 20:25}/>
						<TextInput
							placeholder='Usuario'
							style={loginStyles.input}
							onChangeText={(e)=>{setUsername(e)}}
							fontSize={environmentVariables.sunmiApp ? 15:20}

							placeholderTextColor={colorPalette.hexColorWhite}
							 allowFontScaling={false}

						/>
					</View>


					<View style={loginStyles.inputContainerHalf}>
					<Icon
						name="vpn-key"
						color={colorPalette.hexColorWhite}
						size={environmentVariables.sunmiApp ? 20:25}
					/>
							<TextInput
								placeholder='Contraseña'
								style={loginStyles.inputHalf}
								onChangeText={(e)=>{setPassword(e)}}
								secureTextEntry={vis}
								fontSize={environmentVariables.sunmiApp ? 15:20}

								placeholderTextColor={colorPalette.hexColorWhite}
								 allowFontScaling={false}

							/>
						{/* </View> */}

						<TouchableOpacity
							onPress={changeVisibility}
							style={loginStyles.halfListButton}
						>
						<Icon
								name="visibility"
								color={colorPalette.hexColorWhite}
								size={environmentVariables.sunmiApp ? 15:20}
								style={loginStyles.listIcon}
							/>

						</TouchableOpacity>

					</View>









				</View>

				{(loading)&&(
				<ActivityIndicator visible={false} size='large' color={colorPalette.color}/>
			)}

				<View style={loginStyles.buttonContainer}>
					<TouchableOpacity style={loginStyles.button} onPress={handlerSend}>
						<Text style={{ ...loginStyles.buttonText, fontSize:environmentVariables.sunmiApp ? 20:25}} allowFontScaling={false}>Iniciar Sesion</Text>
					</TouchableOpacity>
				</View>

				<View style={loginStyles.headerContainerPass}>
					<View style={loginStyles.textHeaderContainerPass}>
          	<Text onPress = {tempPassword} style={{ ...loginStyles.textHeaderPass, fontSize:environmentVariables.sunmiApp ? 15:20}} allowFontScaling={false}>Recuperar Contraseña</Text>
        	</View>
				</View>




</ScrollView>
			</View>

	);
}


const loginStyles = StyleSheet.create({
	headerContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
		marginBottom:10,
  },
	textHeader:{
    color:colorPalette.hexColorWhite,
    fontSize:20,
		fontFamily: 'SansationBold',
  },
  textHeaderContainer:{
    width:'50%',
    height:'50%',
    alignItems:'center',
    justifyContent:'center'
  },
	headerContainerSub:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
		marginBottom:15,
  },
	textHeaderSub:{
    color:colorPalette.hexColorWhite,
    fontSize:12,
		fontFamily: 'AcuminVariableConcept',
		alignItems:'center',
    justifyContent:'center',
		textAlign: 'center',
  },
  textHeaderContainerSub:{
    width:'65%',
    height:'20%',
    alignItems:'center',
    justifyContent:'center'
  },

	headerContainerPass:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
		marginTop: 15,
  },
	textHeaderPass:{
    color:colorPalette.hexColorWhite,
    fontSize:15,
		fontFamily: 'SansationBold',
		alignItems:'center',
    justifyContent:'center',
		textAlign: 'center',
		textDecorationLine: 'underline',
  },
  textHeaderContainerPass:{
    width:'65%',
    height:'20%',
    alignItems:'center',
    justifyContent:'center',

  },




	primaryContainer:{
		flex:1,
		backgroundColor:colorPalette.rgbColorPurple,
	},

	// imageContainer:{
	// 	flex:2,
	// 	backgroundColor:'blue',
	// 	justifyContent:'center',
	// 	alignItems:'center',
	// 	width:'100%',
	// 	height:'80%',
	// 	alignItems:'center',
	// 	marginTop:40,
	//
	// },
	image: {
		width: (Dimensions.get('window').width*0.45),
		height: (Dimensions.get('window').height*0.22),
		// width: wp('34%'),
		// height: hp('19%'),
		// width: wp('45%'),
		// height: hp('25%'),
		resizeMode: 'contain'
  },
	imageContainer: {

		flex: 1,
    justifyContent:'center',
    alignItems:'center',
		width: '100%',
    height: '100%',
		marginTop:50,
		marginBottom:20,


    // flex: 1,
    // justifyContent:'center',
    // alignItems:'center',
		// marginTop:40,
  },

	formContainer:{
		flex:3,
		alignItems:'center',
		justifyContent:'space-around',
		width: '100%',
	},
	buttonContainer:{
		flex:2,
		alignItems:'center',
	},
	inputContainer:{
		// paddingTop:'2%',
		width:Dimensions.get('window').width*0.7,
		//width: wp('70%'),
		// width:'70%',
		textAlign:'center',
		flexDirection:'row',
		alignItems:'center',
		borderBottomColor:colorPalette.rgbColorOrange,
		borderBottomWidth:1,
	},
	inputContainerHalf:{
		// paddingTop:'2%',
		width:Dimensions.get('window').width*0.7,
		// width: wp('70%'),
		// width:'70%',
		textAlign:'center',
		flexDirection:'row',
		alignItems:'center',
		borderBottomColor:colorPalette.rgbColor,
		borderBottomWidth:1,
	},
	input:{
		// width:'100%',
		width:Dimensions.get('window').width,
		// width: wp('100%'),
		color:colorPalette.hexColorWhite,
    fontSize:20,
		fontFamily: 'SansationBold',
	},
	inputHalf: {
		flex: 3,
		//marginRight: 20,
		borderBottomColor: '#DDDDDD',
		color:colorPalette.hexColorWhite,
    fontSize:20,
		fontFamily: 'SansationBold',
		//borderBottomWidth: 1,
	},
	button:{
		width:'45%',
		height:'70%',
		// width:'60%',
		// height:'30%',
		backgroundColor:colorPalette.rgbColorOrange,
		alignItems:'center',
		justifyContent:'center',
		borderRadius:15,
		borderBottomRightRadius:25,
		 marginTop:25,
		 marginBottom:25,
	},
	buttonText:{
		color:'white',
		fontSize:20,
		fontFamily:'SansationBold'
	},


	imageContainerSub:{
		flex:2,
		backgroundColor:'white',
		justifyContent:'center',
		alignItems:'center'
	},
	logoSub:{
		//width:'50%',
		//height:'20%',
		width: wp('40%'),
		height: hp('10%'),
	},
	halfInput: {
		flex: 3,
		marginRight: 20,
		borderBottomColor: '#DDDDDD',
		borderBottomWidth: 1,
	},
	halfListButton: {
		padding: 10,
		flex: 1.5,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	listIcon: {
		alignSelf: 'center'
	},
	fontSize: {
		fontSize: 15
	},
});

export default Login;
