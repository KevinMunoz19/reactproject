import React, {Fragment,useState,useEffect} from 'react';
import {
	Text,
	View,
	TextInput,
	Button,
	Alert,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	ImageBackground,
	BackHandler,
	ActivityIndicator,
	Image,
	Dimensions,
}	from 'react-native';
import useClientForm from '../utils/useClientForm'
import Icon from "react-native-vector-icons/MaterialIcons";
import useApi from '../utils/useApi';
import {Actions} from 'react-native-router-flux';
import colorPalette from '../utils/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import environmentVariables from '../utils/envVariables';


const Client = ({id,client,action,onSelect}) =>{

	const window = Dimensions.get("window");
  const screen = Dimensions.get("screen");

  const [dimensions, setDimensions] = useState({ window, screen });

  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });
	// const {Colors} = '../utils/colors';
	const {inputs,setInputs, handleInputChange, handleSubmit} = useClientForm();
	const {validateNit, getRequestor, getInfo} = useApi();
	const [nit,setNit] = useState();
	const [isNit,setIsNit]=useState(false);
	const [loading,setLoading]=useState(false);
	const [kValue,setKValue] = useState(false);
	const [requestor,setRequestor] = useState('');
	const [taxId,setTaxId] = useState('');
	const [calle,setCalle] = useState('');
	const [direccion,setDireccion] = useState('');
	const [colonia,setColonia] = useState('');
	const [zona,setZona] = useState('');
	const [frases,setFrases] = useState('');
	const [afiliacion,setAfiliacion] = useState('');
	const [nn,setNn] = useState('');

	BackHandler.addEventListener('hardwareBackPress', function() {
		Actions.pop();
		return true;
	});

	useEffect(() => {
		if(action == 'edit'){
			client.zipCode = client.zip_code;
			setInputs(client);
		}else if (false){
			handleInputChange('nit',nit);
		}


	}, [])

	const changeNit = (nit) =>{
		handleInputChange('nit',nit);
		setNit(nit);
	}



	const searchNit = ()=>{




		setLoading(true);
		var nitRegex;
		if (nit){
			var regexNit = /[^0-9Kk]/g;
			nitRegex = nit.replace(regexNit,"").replace("k","K");

		} else {
			nitRegex = nit;
		}

		validateNit(nitRegex,(name)=>{
			setLoading(false);
			changeNit(nitRegex);
			handleInputChange('name',name.toString());
			setIsNit(true);
		},(direct)=>{
			handleInputChange('address',direct.toString());
		},
		(muni)=>{
			handleInputChange('municipality',muni.toString());
		},(dep)=>{
			handleInputChange('department',dep.toString());
			handleInputChange('zipCode','01010');
		},
		(err)=>{
			handleInputChange('name',err);
			if(err==200){
				Alert.alert('Error de conexion');
			}else{
				Alert.alert(err);
			}
			setLoading(false);
		});
	}

	const defaultValues = ()=>{
		handleInputChange('address','Ciudad');
		handleInputChange('zipCode','01010');
		handleInputChange('municipality','Guatemala');
		handleInputChange('department','Guatemala');
	};




	return(
		<View style={styles.container}>

			<View style={styles.header}>
				<Image
					source={require('../img/LogoDigifact.png')}
					style={{
            height:dimensions.window.height*0.10,
            width:dimensions.window.width*0.18,

            marginLeft: 10,
            resizeMode: 'contain',
            marginTop:10,
            marginBottom:10,
          }}
				/>

			</View>

			<ScrollView style={{flex:6}}>

				<View style={styles.formContainer}>
				<View style={styles.inputContainerTitle}>
					<Text style={styles.textTitle}>NIT</Text>
				</View>
					<View style={styles.inputContainer}>
						<Icon
							name="library-books"
							color={colorPalette.rgbColorPurple}
							size={environmentVariables.sunmiApp ? 15:20}/>
						<TextInput
							editable={action == 'edit' ? false:true}
							placeholder='NIT'
							style={styles.input}
							onChangeText={(e)=>{changeNit(e)}}
							onBlur={searchNit}
							value={inputs.nit}
							fontSize={environmentVariables.sunmiApp ? 10:15}
							placeholderTextColor={colorPalette.rgbaColorBlack}
						/>
					</View>

					{(loading)&&(
			 			<ActivityIndicator visible={false} size='large' color={colorPalette.color}/>
			 		)}

					<View style={styles.inputContainerTitle}>
						<Text style={styles.textTitle}>Nombre</Text>
					</View>
					<View style={styles.inputContainer}>
						<Icon
							name="person"
							color={colorPalette.rgbColorPurple}
							size={environmentVariables.sunmiApp ? 15:20}/>
						<TextInput
							placeholder='Nombre'
							editable={false}
							onChangeText={(e)=>{handleInputChange('name',e)}}
						 	value={inputs.name}
							style={styles.input}
							fontSize={environmentVariables.sunmiApp ? 10:15}
							placeholderTextColor={colorPalette.rgbaColorBlack}
						/>
					</View>
					<View style={styles.inputContainerTitle}>
						<Text style={styles.textTitle}>E-mail</Text>
					</View>
					<View style={styles.inputContainer}>
						<Icon
							name="email"
							color={colorPalette.rgbColorPurple}
							size={environmentVariables.sunmiApp ? 15:20}/>
						<TextInput
							onChangeText={(e)=>{handleInputChange('email',e)}}
					 		value={inputs.email}
						 	style={styles.input}
						 	keyboardType = 'email-address'
							placeholder='E-mail'
							fontSize={environmentVariables.sunmiApp ? 10:15}
							placeholderTextColor={colorPalette.rgbaColorBlack}
						/>
					</View>

					<View style={styles.inputContainerTitle}>
						<Text style={styles.textTitle}>Direccion</Text>
					</View>
					<View style={styles.inputContainer}>
						<Icon
							name="home"
							color={colorPalette.rgbColorPurple}
							size={environmentVariables.sunmiApp ? 15:20}/>
						<TextInput
							onChangeText={(e)=>{handleInputChange('address',e)}}
			 				value={inputs.address}
			 				style={styles.input}
							editable={true}
							placeholder='Direccion'
							fontSize={environmentVariables.sunmiApp ? 10:15}
							placeholderTextColor={colorPalette.rgbaColorBlack}
						/>
					</View>

					<View style={styles.inputContainerTitle}>
						<Text style={styles.textTitle}>Codigo postal</Text>
					</View>
					<View style={styles.formRow}>
						<View style={styles.inputHalfContainer}>
							<TextInput
								onChangeText={(e)=>{handleInputChange('zipCode',e)}}
				 				value={inputs.zipCode}
				 				style={styles.input}
				 				keyboardType = 'numeric'
								placeholder='Codigo Postal'
								editable={true}
								fontSize={environmentVariables.sunmiApp ? 10:15}
								placeholderTextColor={colorPalette.rgbaColorBlack}
							/>
						</View>
						<View style={styles.inputHalfContainer}>
							<TextInput
								onChangeText={(e)=>{handleInputChange('municipality',e)}}
							 	value={inputs.municipality}
							 	style={styles.input}
								placeholder='Municipio'
								editable={true}
								fontSize={environmentVariables.sunmiApp ? 10:15}
								placeholderTextColor={colorPalette.rgbaColorBlack}
							/>
						</View>
					</View>

					<View style={styles.inputContainerTitle}>
						<Text style={styles.textTitle}>Departamento</Text>
					</View>
					<View style={styles.inputContainer}>
						<TextInput
							onChangeText={(e)=>{handleInputChange('department',e)}}
			 				value={inputs.department}
			 				style={styles.input}
							placeholder='Departamento'
							editable={true}
							fontSize={environmentVariables.sunmiApp ? 10:15}
							placeholderTextColor={colorPalette.rgbaColorBlack}
						/>
					</View>

				</View>



				<View style={styles.buttonContainer}>


					{(action == 'create') && (
						<TouchableOpacity onPress={()=>handleSubmit({action:'create',onSelect:onSelect})} style={styles.createButton}>
							<Text style={{ ...styles.buttonText, fontSize:environmentVariables.sunmiApp ? 17:22}}>Registrar</Text>
						</TouchableOpacity>
					)}

					{(action !== 'create') && (
						<TouchableOpacity onPress={()=>handleSubmit({action:'delete'})} style={styles.createButton}>
							<Text style={{ ...styles.buttonText, fontSize:environmentVariables.sunmiApp ? 17:22}}>Borrar Cliente</Text>
						</TouchableOpacity>
					)}

					{(action !== 'create') && (
						<TouchableOpacity onPress={()=>handleSubmit({action:'edit'})} style={styles.createButton}>
							<Text style={{ ...styles.buttonText, fontSize:environmentVariables.sunmiApp ? 17:22}}>Guardar Cambios</Text>
						</TouchableOpacity>
					)}

				</View>

			</ScrollView>

		</View>
	);
}

const styles = StyleSheet.create({
	inputHalfContainer: {
		//backgroundColor:'red',
		alignContent:'flex-start',
    flex: 0.45,
		borderBottomColor:colorPalette.rgbaColorBlack,
		borderBottomWidth:1,
  },
	inputContainerTitle:{
		width: wp('70%'),
		textAlign:'center',
		flexDirection:'row',
		alignItems:'center',
	},

	formRow: {
		justifyContent:'space-between',
		width: wp('70%'),
		//textAlign:'center',
    flexDirection: 'row',
		//backgroundColor:'blue',
    //alignItems: 'center',
  },
	textTitle:{
		// width:'100%',
		color:colorPalette.hexColorBlack,
    fontSize:12,
	},
	icon:{
    //marginRight:20
  },
	buttonText:{
		color:'white',
		fontSize:17,
		marginLeft:3,
	},
	buttonContainer:{
		alignSelf:'center',
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
		marginBottom:10,
		marginBottom:65,
		//backgroundColor:'blue',
		height:'30%',
		paddingTop:10,
		paddingBottom:10,
		//flex:1,
  },
	createButton:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
		backgroundColor:colorPalette.rgbColorOrange,
		width:'35%',
		height:'40%',
		//paddingLeft:5,
		marginTop:5,
		//marginLeft:25,
		borderRadius:10,
		borderBottomRightRadius:25,
  },
	input:{
		// width:'100%',
		width: wp('100%'),
		color:colorPalette.hexColorBlack,
    fontSize:15,
	},
	inputContainer:{
		width: wp('70%'),
		textAlign:'center',
		flexDirection:'row',
		alignItems:'center',
		borderBottomColor:colorPalette.rgbaColorBlack,
		borderBottomWidth:1,
	},
	formContainer:{
		flex:1,
		alignItems:'center',
		justifyContent:'space-around',
		//backgroundColor:'gray',
		//height:'60%',
	},
	subHeaderContainer:{
    // width:'20%',
    // height:'40%',
    alignItems:'center',
    justifyContent:'center'
  },
	header:{
    backgroundColor: 'white',
    width: '100%',
    height: '16%',
    //  height: '25%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
		marginBottom:20,
  },
	logo:{
    // width: '20%',
    // height: '20%',
    marginLeft: '10%',
    width: wp('18%'),
    height: hp('10%'),
  },
	headerContainer:{
    backgroundColor: colorPalette.rgbaColorBlack,
    alignItems:'center',
    justifyContent:'center',
    marginRight:15,
    borderRadius:90,
    width:'12%',
    height:'50%',
  },
	container:{
		flex:1,
		backgroundColor:'white',
	},

});
export default Client;
