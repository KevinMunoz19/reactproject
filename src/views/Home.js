import React, {useState, useEffect} from 'react';
import {Actions} from 'react-native-router-flux';
import useUser from './../utils/useUser';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import colorPalette from '../utils/colors';
import environmentVariables from '../utils/envVariables';

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  BackHandler,
  NativeModules,
  Alert,
  ScrollView,
} from 'react-native';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
} from 'react-native-chart-kit';

import useApi from '../utils/useApi';

const Home = () => {
  const window = Dimensions.get('window');
  const screen = Dimensions.get('screen');
  const [dimensions, setDimensions] = useState({window, screen});
  const [user, setUser] = useState();
  const {searchBasic, getDashboard} = useApi();
  const [numeroClientes, setNumeroClientes] = useState('0');
  const [ingresoAnual, setIngresoAnual] = useState('0');
  const [ingresoMensual, setIngresoMensual] = useState('0');
  const [ventasTotal, setVentasTotal] = useState('0');
  const [crossSellTotal, setCrossSellTotal] = useState('0');
  const [porcentajeCross, setPorcentajeCross] = useState(0.5);
  const [porcentajeVentas, setPorcentajeVentas] = useState(0.5);
  const [lablesSemanal, setLablesSemanal] = useState(['Semana', 'Semana', 'Semana', 'Semana', 'Semana']);
  const [totalesSemanal, setTotalesSemanal] = useState([20, 45, 28, 80, 99]);
  const [arrayIngresosA, setArrayIngresosA] = useState([0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]);

  const [nombreTopCliente, setNombreTopCliente] = useState(['Cliente','Cliente','Cliente']);
  const [montoTopCliente, setMontoTopCliente] = useState(['Q 0.0','Q 0.0','Q 0.0']);

  const [promedioTransaccion, setPromedioTransaccion] = useState('Q. 0.0');
  const [nuevosClientes, setNuevosClientes] = useState('0');




  const onChange = ({window, screen}) => {
    setDimensions({window, screen});
  };

  useEffect(() => {
    Dimensions.addEventListener('change', onChange);
    return () => {
      Dimensions.removeEventListener('change', onChange);
    };
  });

  BackHandler.addEventListener('hardwareBackPress', function() {
    Actions.home();
    return true;
  });

  const {getUser} = useUser();

  useEffect(() => {

    getUser(users => {
      getDashboard(
        users.string_nit,
        response => {
          if (response == 0) {
            Alert.alert(
              'Atencion',
              'No se encontraron productos en el rango de fechas',
            );
          } else {
            setNumeroClientes(response[0].totalClientes);
            setIngresoAnual(response[0].ingresoAnual);
            setIngresoMensual(response[0].ingresoMensual);
            setVentasTotal(response[0].numeroVentas);
            setCrossSellTotal(response[0].totalCs);
            setPorcentajeVentas(parseFloat(response[0].pVentas));
            setPorcentajeCross(parseFloat(response[0].pCrossSell));
            setLablesSemanal(response[0].ingresoSemanalLabels)
            setTotalesSemanal(response[0].ingresoSemanalTotales)
            setArrayIngresosA(response[0].ingresosAnuales)
            setPromedioTransaccion(response[0].ventasPorTran.toString())
            setNuevosClientes(response[0].nuevosClientes);


            var arrayM = response[0].topClientesMonto.reverse();
            var arrayN = response[0].topClientesNit.reverse();
            if(response[0].topClientesMonto.length >= 3){
              setNombreTopCliente(arrayN);
              setMontoTopCliente(arrayM);
            }
          }
        },
        rej => {
          console.log('Informacion de dashboard no se pudo recuperar ', rej);
          Alert.alert('Atencion', 'Error obteniendo informacion de dashboard');
        },
      );
      if (users != null) {
      } else {
        Actions.login();
      }

    });
  }, []);


  const {logout} = useUser();
  const [menuVisible, setMenuVisible] = useState(false);
  const handlePress = view => {
    setMenuVisible(false);
    switch (view) {
      case 'clients':
        Actions.clients({action: 'manage'});
        break;
      case 'products':
        Actions.products({action: 'manage'});
        break;
      case 'dte':
        Actions.dte();
        break;
      case 'dtes':
        Actions.dtes();
        break;
      case 'dtessummary':
        Actions.dtessummary();
        break;
      case 'info':
        Actions.infouser();
        break;
      case 'user':
        Actions.user();
        break;
      case 'invaliddigifact':
        Actions.invaliddigifact();
        break;
    }
  };

  const chartConfig = {
    // //backgroundGradientFrom: "#2E317E",
    // backgroundGradientFromOpacity: "#FFFFFF",
    // //backgroundGradientTo: "#2E317E",
    // backgroundGradientToOpacity: "#2E317E",
    backgroundColor: "#2E317E",
    backgroundGradientFrom: '#2E317E',
    backgroundGradientTo: '#2E317E',
    color: (opacity = 1) => `rgba(255, 161, 44, ${opacity})`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };
  const data = {
    labels: ['Cross Sell'], // optional
    data: [porcentajeCross],
  };
  const data1 = {
    labels: ['Ventas'], // optional
    data: [porcentajeVentas],
  };



  const chartConfigLineChart = {
    backgroundGradientFrom: '#2E317E',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#2E317E',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 161, 44, ${opacity})`,
    strokeWidth: 5, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };
  const dataLine = {
    labels: ['En', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ag', 'Sept', 'Oct', 'Nov', 'Dic'],
    datasets: [{
      data: arrayIngresosA,
        color: (opacity = 1) => `rgba(255, 161, 44, ${opacity})`, // optional
        legend: ['Rainy Days', 'Sunny Days', 'Snowy Days'], // optional
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../img/LogoDigifact.png')}
          style={{
            height: dimensions.window.height * 0.1,
            width: dimensions.window.width * 0.18,
            marginLeft: 10,
            resizeMode: 'contain',
            marginTop: 10,
            marginBottom: 10,
          }}
        />
        <View
          style={{
            backgroundColor: colorPalette.rgbaColorBlack,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 15,
            borderRadius: 90,
            height: dimensions.window.height * 0.08,
            width: dimensions.window.height * 0.08,
          }}>
          <View style={styles.subHeaderContainer}>
            <TouchableOpacity onPress={() => handlePress('user')}>
              <Icon
                name="person-outline"
                color="white"
                size={environmentVariables.sunmiApp ? 35 : 45}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>



      <View style={styles.infoContainer}>
        <View style={styles.subDataContainer}>
          {/* Info box anaranjado */}
          <View style={styles.subDataContainerHalfOrange}>
            <View style={styles.textHeaderContainerTitle}>
              <Text style={styles.textHeaderData} allowFontScaling={false}>
                {numeroClientes}
              </Text>
              <Text style={styles.textHeaderTitle} allowFontScaling={false}>
                Clientes
              </Text>
            </View>
            <View style={styles.textHeaderContainerTitle}>
              <Text style={styles.textHeaderData} allowFontScaling={false}>
                {`Q. ${ingresoAnual}`}
              </Text>
              <Text style={styles.textHeaderTitle} allowFontScaling={false}>
                Ingreso Anual
              </Text>
            </View>
            <View style={styles.textHeaderContainerTitle}>
              <Text style={styles.textHeaderData} allowFontScaling={false}>
                {`Q. ${ingresoMensual}`}
              </Text>
              <Text style={styles.textHeaderTitle} allowFontScaling={false}>
                Ingreso Mensual
              </Text>
            </View>
          </View>
          {/* Info crossell ventas */}
          <View style={styles.subDataContainerHalf}>
            <View style={styles.grayHalfContainer}>
              <View style={styles.textHeaderContainerHalfT}>
                <Text style={styles.textHeaderTitle} allowFontScaling={false}>
                  Cross Sell
                </Text>
                <Text style={styles.textHeaderData} allowFontScaling={false}>
                  {crossSellTotal}
                </Text>
              </View>

              <View style={styles.textHeaderContainerHalfG}>
                <ProgressChart
                  data={data}
                  width={75}
                  height={40}
                  strokeWidth={8}
                  radius={16}
                  chartConfig={chartConfig}
                  hideLegend={true}
                />
              </View>
            </View>

            <View style={styles.grayHalfContainer}>
              <View style={styles.textHeaderContainerHalfT}>
                <Text style={styles.textHeaderTitle} allowFontScaling={false}>
                  Ventas
                </Text>
                <Text style={styles.textHeaderData} allowFontScaling={false}>
                  {ventasTotal}
                </Text>
              </View>

              <View style={styles.textHeaderContainerHalfG}>
                <ProgressChart
                  data={data1}
                  width={75}
                  height={40}
                  strokeWidth={8}
                  radius={16}
                  chartConfig={chartConfig}
                  hideLegend={true}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.subDataContainer}>
          {/* Info ventas */}
          <View style={styles.subDataContainerHalf}>
            <View style={styles.grayHalfContainer}>
              <View style={styles.textHeaderContainerHalfT}>
                <Text style={styles.textHeaderTitle} allowFontScaling={false}>
                  Nuevos clientes
                </Text>
                <Text style={styles.textHeaderData} allowFontScaling={false}>
                  {nuevosClientes}
                </Text>
              </View>
            </View>

            <View style={styles.grayHalfContainer}>
              <View style={styles.textHeaderContainerHalfT}>
                <Text style={styles.textHeaderTitle} allowFontScaling={false}>
                  Promedio venta por factura
                </Text>
                <Text style={styles.textHeaderData} allowFontScaling={false}>
                  {promedioTransaccion}
                </Text>
              </View>
            </View>
          </View>
          {/* Info box anaranjado */}
          <View style={styles.subDataContainerHalfOrange}>
            <View style={styles.textHeaderContainerTitle}>
              <Text style={styles.textHeaderData} allowFontScaling={false}>
                {nombreTopCliente[0]}
              </Text>
              <Text style={styles.textHeaderTitle} allowFontScaling={false}>
                {montoTopCliente[0]}
              </Text>
            </View>
            <View style={styles.textHeaderContainerTitle}>
              <Text style={styles.textHeaderData} allowFontScaling={false}>
                {nombreTopCliente[1]}
              </Text>
              <Text style={styles.textHeaderTitle} allowFontScaling={false}>
                {montoTopCliente[1]}
              </Text>
            </View>
            <View style={styles.textHeaderContainerTitle}>
              <Text style={styles.textHeaderData} allowFontScaling={false}>
                {nombreTopCliente[2]}
              </Text>
              <Text style={styles.textHeaderTitle} allowFontScaling={false}>
                {montoTopCliente[2]}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollMain}>

        <View style={styles.textHeaderContainerTitleS}>
          <Text style={styles.textHeaderDataS} allowFontScaling={false}>
            Ingresos Semanales
          </Text>
        </View>
        <BarChart
          style={{ marginVertical: 5, borderRadius: 16,marginHorizontal: 10, fontSize:5 }}
          data={{ labels: lablesSemanal,
            datasets: [{ data: totalesSemanal }]}}
          width={dimensions.window.width*0.95}
          height={300}
          yAxisLabel="Q."
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 161, 44, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16, fontSize:5},
            propsForDots: { r: '1', strokeWidth: '1', stroke: '#ffa726', },
            propsForLabels:{fontSize:8},
          }}
          verticalLabelRotation={30}
          hideLegend={false}
        />

        <View style={styles.textHeaderContainerTitleS}>
          <Text style={styles.textHeaderDataS} allowFontScaling={false}>
            Ingresos Anuales
          </Text>
        </View>
        <LineChart
          data={dataLine}
          width={dimensions.window.width*0.95}
          height={250}
          chartConfig={{
            backgroundColor: "#FFFFFF",
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 161, 44, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16, },
            propsForDots: { r: '1', strokeWidth: '2', stroke: '#ffa726', },
            propsForLabels:{fontSize:8},
          }}
          bezier
          fromZero={true}
          verticalLabelRotation={30}
          yAxisLabel={'Q.'}
          style={{ marginVertical: 5, borderRadius: 16,marginHorizontal: 10 }}
        />


      </ScrollView>


    </View>
  );
};

const styles = StyleSheet.create({
  scrollMain:{
     flex:6,
  },
  inputBorder: {
    flex: 1,
    width: '90%',
    textAlign: 'left',
  },
  topContainer: {
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  midContainer: {
    flex: 4,
    backgroundColor: 'blue',
  },
  dteScrollContainer: {
    width: '100%',
    flex: 4,
    height: '100%',
    alignItems: 'center',
  },
  scroll: {
    flex: 4,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 15,
  },
  headerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  textHeader: {
    color: colorPalette.rgbColorPurple,
    fontSize: 45,
    fontFamily: 'SansationBold',
  },
  textHeaderContainer: {
    width: '80%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textHeaderTitle: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'AcuminVariableConcept',
  },
  textHeaderData: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'SansationBold',
  },
  textHeaderDataS: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'SansationBold',
  },
  textHeaderContainerTitle: {
    flex: 0.3,
    width: '90%',
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textHeaderContainerTitleS: {
    height: 50,
    width: '90%',
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  textHeaderContainerHalf: {
    flex: 0.48,
    height: '100%',
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textHeaderContainerHalfT: {
    flex: 0.46,
    height: '100%',
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textHeaderContainerHalfG: {
    flex: 0.58,
    height: '100%',
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  grayHalfContainer: {
    backgroundColor: "#2E317E",
    flexDirection: 'row',
    flex: 0.45,
    justifyContent: 'center',
    borderRadius: 10,
    borderBottomRightRadius: 25,
  },
  subDataContainerHalf: {
    flexDirection: 'column',
    height: '90%',
    flex: 0.48,
    //justifyContent: 'center',
    justifyContent: 'space-between',
  },
  subDataContainerHalfOrange: {
    backgroundColor: colorPalette.rgbColorOrange,
    flexDirection: 'column',
    height: '90%',
    flex: 0.48,
    justifyContent: 'space-between',
    alignContent: 'center',
    borderRadius: 15,
    borderBottomRightRadius: 55,
    paddingLeft: '5%',
  },
  subDataContainer: {
    flexDirection: 'row',
    width: '90%',
    flex: 2,
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flex: 0.85,
  },
  dtesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  graphContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'brown',
    flex: 2,
  },
  subHeaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'white',
    width: '100%',
    height: '16%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    flexDirection: 'column',
  },
  menuContainer: {
    width: '100%',
    height: '25%',
    backgroundColor: 'white',
  },
  menuHeaderContainer: {
    width: '100%',
    height: '25%',
    flexDirection: 'row',
  },
  menuBodyContainer: {
    width: '100%',
    height: '75%',
    flexDirection: 'column',
    backgroundColor: colorPalette.rgbColor,
    justifyContent: 'space-around',
  },
  menuLine: {
    height: '1%',
    backgroundColor: 'white',
  },
  menuLogo: {
    marginLeft: '10%',
    width: '80%',
    height: '100%',
  },
  menuText: {
    fontSize: 20,
    color: 'white',
    marginLeft: '5%',
  },
  primaryGray: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTouch: {
    justifyContent: 'center',
  },
  body: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  logo: {
    marginLeft: '10%',
    width: wp('18%'),
    height: hp('10%'),
    resizeMode: 'contain',
  },
  headerIcon: {
    //marginRight: '2%'
  },
  sectionTouch: {
    marginTop: '3%',
    backgroundColor: colorPalette.homeButtons,
    width: '100%',
    height: '15%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTouchText: {
    marginTop: '3%',
    marginLeft: '5%',
    fontSize: 15,
    color: 'white',
  },
  genContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1.5,
  },
  createButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'orange',
    width: '45%',
    height: '80%',
    marginTop: 5,
    borderRadius: 10,
    borderBottomRightRadius: 20,
    paddingTop: '2%',
    paddingBottom: '10%',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default Home;
