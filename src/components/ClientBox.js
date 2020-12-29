import React from 'react';
import colorPalette from '../utils/colors';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import environmentVariables from '../utils/envVariables';

const ClientBox = props => {
  const {client, action, onSelect} = props;

  const onAction = client => {
    Actions.client({client: client, action: 'edit'});
  };

  return (
    <View style={styles.clientBox}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => onAction(client)}>
          <Icon
            name="person-outline"
            color="white"
            size={environmentVariables.sunmiApp ? 35 : 45}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.valuesContainer}>
        <View style={styles.valuesColumn}>
          <Text
            style={{
              ...styles.valuesText,
              fontSize: environmentVariables.sunmiApp ? 11 : 16,
            }}
            allowFontScaling={false}>
            {client.name}
          </Text>
        </View>
        <View style={styles.valuesColumn}>
          <Text
            style={{
              ...styles.valuesText,
              fontSize: environmentVariables.sunmiApp ? 11 : 16,
            }}
            allowFontScaling={false}>
            {client.nit}
          </Text>
        </View>
      </View>

      {action !== 'select' && (
        <TouchableOpacity
          onPress={() => onAction(client)}
          style={styles.actionColumn}>
          <Icon
            name="edit"
            color={colorPalette.rgbColor}
            size={environmentVariables.sunmiApp ? 30 : 40}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
      {action == 'select' && (
        <TouchableOpacity
          onPress={() => onSelect(client)}
          style={styles.actionColumn}>
          <Icon
            name="check"
            color={colorPalette.rgbColor}
            size={environmentVariables.sunmiApp ? 30 : 40}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colorPalette.rgbColorPurple,
    marginLeft: 10,
    borderRadius: 60,
  },
  subHeaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientBox: {
    width: '85%',
    backgroundColor: 'white',
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valuesColumn: {
    flex: 2,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  valuesContainer: {
    flex: 2,
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 5,
  },
  actionColumn: {
    flex: 0.5,
    alignSelf: 'center',
  },
  valuesText: {
    fontSize: 11,
    color: colorPalette.rgbaColorBlack,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});

export default ClientBox;
