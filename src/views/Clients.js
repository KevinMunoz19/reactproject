import React, {Fragment,useState,useEffect} from 'react';
import DB from '../utils/DB';

import {
	Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  ImageBackground,
	Dimensions,
	TextInput,
	Alert,
}	from 'react-native';
import {Actions} from 'react-native-router-flux';
import ClientBox from '../components/ClientBox';
import useClientForm from '../utils/useClientForm';
import Icon from "react-native-vector-icons/MaterialIcons";
import colorPalette from '../utils/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import environmentVariables from '../utils/envVariables';
import useApi from '../utils/useApi';
import useUser from '../utils/useUser';


const Clients = ({action,onSelect}) =>{
	const {select,insert} = DB();
	const {getAllClients,getRequestor} = useApi();

	const window = Dimensions.get("window");
	const screen = Dimensions.get("screen");

	const [dimensions, setDimensions] = useState({ window, screen });

	const [searchC,setSearchC] = useState('');

	const onChange = ({ window, screen }) => {
		setDimensions({ window, screen });
	};

	useEffect(() => {
		Dimensions.addEventListener("change", onChange);
		return () => {
			Dimensions.removeEventListener("change", onChange);
		};
	});

  const [clientList,setClientList] = useState([]);

	const [refreshFlag,setRefreshFlag] = useState(false);

  useEffect(()=>{
    var query = `select * from receiver`;
    select(query,[],(clients)=>{
      setClientList(clients);
    })
		setRefreshFlag(false);
	},[refreshFlag])



  const handleSubmit = (action)=>{
    Actions.client({action:'create'});
  }

	const scDB = ()=>{
		var queryS = `select * from receiver where nit LIKE '%${searchC.trim()}%'`;
		select(queryS,[],(clients)=>{
			setClientList(clients);
		})
	}

	const refreshList = () => {
		var query =`DELETE from receiver`;
    insert(query,[],(result)=>{
    },(err)=>{
    })
		console.log("entrada ue");
		getUser((userInfo)=>{
      getRequestor(
        userInfo.string_nit,
        req => {
				var usernameE = `GT.${userInfo.string_nit}.${userInfo.name}`;
				getAllClients(req, userInfo.string_nit, usernameE, (res) => {
					if (res == 0 || res.length == 0){
						Alert.alert("Atencion","No se encontraron clientes");
					} else {
						for (i = 0; i < res.length; i++) {
							let nit = res[i].nit;
							let name = res[i].name;
							let email = res[i].email;
							let address = res[i].address;
							let municipality = res[i].municipality;
							let department = res[i].department;
							let zipCode = res[i].zipCode;

							var query =`INSERT INTO receiver(nit,name,email,address,zip_code,municipality,department)
							VALUES(?,?,?,?,?,?,?)`;
					    insert(query,[nit,name,email,address,zipCode,municipality,department,],(result)=>{
					    },(err)=>{
					    })
						}
						setClientList([...res]);
					}
				}, (rej) => {
					console.log("error in view ",rej);
				})
			},
			(err)=>{
				if(err==500){
				}else{
				}
			});
		})


		setRefreshFlag(true);
	}

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
			{(action !== 'select') && (
				<View style={{
		          backgroundColor: colorPalette.rgbaColorBlack,
		          alignItems:'center',
		          justifyContent:'center',
		          marginRight:15,
		          borderRadius:90,
		          height:dimensions.window.height*0.08,
		          width:dimensions.window.height*0.08,
		        }}>
					<View style={styles.subHeaderContainer}>
						<TouchableOpacity onPress={()=>Actions.user()}>
							<Icon
								name="person-outline"
								color="white"
								size={environmentVariables.sunmiApp ? 35:45}
								style={styles.headerIcon}
							/>
						 </TouchableOpacity>
					</View>
				</View>
			)}
		</View>

		<View style={styles.buttonContainer}>
				<TextInput
					placeholder='Buscar por NIT'
					style={{
						alignItems:'center',
				    justifyContent:'center',
						flexDirection:'row',
						justifyContent:'center',
						alignItems:'center',
						backgroundColor:colorPalette.rgbColorOrange,
						width:dimensions.window.width*0.40,
						paddingLeft:5,
						marginTop:5,
						marginLeft:25,
						borderRadius:45,
						color:'white',
					}}
					onChangeText={(e)=>{setSearchC(e)}}
					onBlur={scDB}
					value={searchC}
					fontSize={environmentVariables.sunmiApp ? 10:15}
					placeholderTextColor={colorPalette.rgbaColorBlack}
				/>
			</View>


        <ScrollView style={styles.scroll}>
          {(clientList.length>0) &&(
            <View style={styles.clientsContainer}>
            {
		          clientList.map((client)=>{
		            return(
		              <ClientBox key={client.nit} client={client} onSelect={onSelect} action={action}></ClientBox>
		            )
		          })
            }
            </View>
          )}
          {(clientList.length==0 &&
            <View style={styles.textContainer}>
            	<Text style={{ ...styles.buttonText, fontSize:environmentVariables.sunmiApp ? 10:15}}>No existen clientes registrados</Text>
            </View>
          )}

					</ScrollView>

				{(action !== 'select') && (
					<View style={styles.buttonContainer}>
							<TouchableOpacity onPress={()=>handleSubmit({action:'create',onSelect:onSelect})}
							style={{
								flexDirection:'row',
						    justifyContent:'center',
						    alignItems:'center',
								backgroundColor:colorPalette.rgbColorPurple,
								width:dimensions.window.width*0.40,
								height:'100%',
								paddingLeft:5,
								marginTop:5,
								marginLeft:25,
								borderRadius:30,
							}}>
								<Text style={{ ...styles.buttonText, fontSize:environmentVariables.sunmiApp ? 10:15}}>Nuevo Cliente</Text>
								<Icon
									name="add-circle"
									color="white"
									size={environmentVariables.sunmiApp ? 20:25}
									style={styles.icon}
								/>
							</TouchableOpacity>
					</View>
				)}
				{(action !== 'select') && (
					<View style={styles.buttonContainer}>
							<TouchableOpacity onPress={refreshList}
							style={{
								flexDirection:'row',
						    justifyContent:'center',
						    alignItems:'center',
								backgroundColor:colorPalette.rgbColorPurple,
								width:dimensions.window.width*0.45,
								height:'100%',
								paddingLeft:5,
								marginTop:5,
								marginLeft:25,
								borderRadius:45,
							}}>

								<Text style={{ ...styles.buttonText, fontSize:environmentVariables.sunmiApp ? 10:15}}>Sincronizar Clientes</Text>
								<Icon
									name="restore"
									color="white"
									size={environmentVariables.sunmiApp ? 20:25}
									style={styles.icon}
								/>
							</TouchableOpacity>
					</View>
				)}

    </View>
	);
}

const styles = StyleSheet.create({
	createButtonRefresh:{
		flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
		backgroundColor:colorPalette.rgbColorPurple,
		width:'40%',
		height:'100%',
		paddingLeft:5,
		marginTop:5,
		marginLeft:25,
		borderRadius:45,
  },
	scroll:{
     flex:6,
		 //backgroundColor:'pink',
		 // height:'80%',
  },
	buttonContainer:{
		//backgroundColor: 'black',
    width: '100%',
    // height: '15%',
    //  height: '25%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'flex-end',
		// marginBottom:20,
		marginTop:5,
		// flex:1,
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
	buttonText:{
		color:'white',
		fontSize:10,
		marginLeft:3,
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
	container:{
    flex:1,
    backgroundColor:'white'
  },
  textContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
		//backgroundColor:'pink',
  },

  createButton:{
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
		backgroundColor:colorPalette.rgbColorPurple,
		width:'30%',
		height:'100%',
		paddingLeft:5,
		marginTop:5,
		marginLeft:25,
		borderRadius:30,
  },
  icon:{
    //marginRight:20
  },
  clientsContainer:{
    width:'100%',
		flex:2,
		//flexDirection:'column',
		height:'100%',
    alignItems:'center',
		//backgroundColor:colorPalette.rgbColorOrange,
  }
});

export default Clients;
