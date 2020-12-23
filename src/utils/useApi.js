import React, {useState} from 'react';
import base64 from 'react-native-base64';
import {PermissionsAndroid, Alert} from 'react-native';

import {Global} from '@jest/types';

import environmentVariables from './envVariables';
const DOMParser = require('xmldom').DOMParser;

//delete Global.XMLHttpRequest;
const useApi = () => {
  const login = (body, res, rej) => {
    console.log('Entrada fetch login get token', body);
    loginOld(body, () => {
      fetch(environmentVariables.apiURL + 'login/get_token', {
        // fetch('https://felgttestaws.digifact.com.gt/felapi/api/login/get_token',{
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          return response.json();

        })
        .then(response => {
          res(response);
      }).catch(err => {
        console.log("catch login ",err)
        rej(err)
      })
    })




  }

  const loginOld = (body, res) => {
    // return fetch('https://felgtaws.digifact.com.gt/felapi/api/login/get_token',{
    return fetch('https://felgttest.digifact.com.gt/gt.com.fact.felapi/api/login/get_token', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => {
      return response.json();
    }).then(response => {
      res();
    }).catch(err => {
      res();
    })
  }

  const getXMLTransformation = (body, res, rej) => {

      //fetch('http://190.111.3.98:5500/api/XmlJsonTransformation', {
      fetch('http://190.111.3.98:5500/api/XmlJsonTransformation', {
        method: 'POST',
        body: body,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then(response => {
        return response.json();
      }).then(response => {
        if (response.Respuesta == 1){
          res(response);

        } else {
          console.log("Error REJ", response)
          rej('Ocurrio un error obteniendo el xml')
        }
      }).catch(err => {
          console.log("catch Error ", err)
        rej(err);
      })

  }

  const sendBill = (body, nit, token, res, rej) => {

    // loginOld({
    //   username: null,
    //   password: null
    // }, () => {

      console.log('Token');
      console.log(token);

      fetch(environmentVariables.apiURL+`FelRequest?NIT=${nit}&TIPO=CERTIFICATE_DTE_XML_TOSIGN&FORMAT=XML`, {
        // fetch(`https://felgttestaws.digifact.com.gt/felapi/api/FELRequest?NIT=${nit}&TIPO=CERTIFICATE_DTE_XML_TOSIGN&FORMAT=PDF XML`,{
        method: 'POST',
        body: body,
        headers: {
          'Content-Type': 'application/xml;charset=UTF-8',
          'Authorization': token,
          'Accept': 'application/json;charset=UTF-8'
        }
      }).then(response => {

        return response.json();
      }).then(response => {
        if (response.Codigo == 1){
          res(response);

        } else {

          rej('Ocurrio un error generando el documento')
        }
      }).catch(err => {
          console.log("catch Error ", err)
        rej(err);
      })
    //})
  }

  const cancelBill = (token, nit, id, body, res, rej) => {
    console.log("Entrada llamada cancelBill");
    console.log("XML a cancelar");
    console.log(body);
    console.log("Entrada cancelar factura");
    console.log("Entrada cancelar nit");
      fetch(environmentVariables.apiURL+`FELRequest?NIT=${nit}&TIPO=ANULAR_FEL_TOSIGN&FORMAT=PDF`, {
        // fetch(`https://felgttestaws.digifact.com.gt/felapi/api/FELRequest?NIT=${nit}&TIPO=ANULAR_FEL_TOSIGN&FORMAT=PDF`,{
        method: 'POST',
        body: body,
        headers: {
          'Content-Type': 'application/xml',
          'Authorization': token,
          'Accept': 'application/json'
        }
      }).then(response => {
        console.log("salida cancelar factura");
        return response.json();
      }).then(response => {
        console.log("Salida error cancelar factura");
        console.log(response);
        if (response.Codigo == 1) res(response);
        else rej('Ocurrio un error anulando el documento')
      }).catch(err => {

        rej(err);
      })
    //})
  }

  const getBill = (token, nit, id, res, rej) => {

    loginOld({
      username: null,
      password: null
    }, () => {
    console.log("Entrada api getBill");
    console.log("nit ",nit);
    console.log("guid ",id);

      fetch(environmentVariables.apiURL+`FELRequest?NIT=${nit}&TIPO=GET_DOCUMENT&FORMAT=PDF&GUID=${id}`, {
        // fetch(`https://felgttestaws.digifact.com.gt/guestapi/api/FELRequest?NIT=${nit}&TIPO=GET_DOCUMENT&FORMAT=PDF&GUID=${id}`,{
        method: 'GET',
        headers: {
          'Authorization': token
        }
      }).then(response => {
        return response.json()
      }).then(response => {
        console.log("respuesta ",response);

        if (response.Codigo == 1) {
          res(response.ResponseDATA3)

        } else {
          rej('Documento No Valido');
        }
      }).catch(err => {

        rej('Error obteniendo documento')
      })
    })
  }

  const getBillXML = (token, nit, id, cant, desc, prec, res, rej) => {
    // const getBillXML = (token,nit,id,cant,prec,desc,res,rej)=>{

    loginOld({
      //username: null,
      //password: null
    }, () => {
      fetch(environmentVariables.apiURL+`FELRequest?NIT=${nit}&TIPO=GET_DOCUMENT&FORMAT=XML&GUID=${id}`, {
          // fetch(`https://felgttestaws.digifact.com.gt/guestapi/api/FELRequest?NIT=${nit}&TIPO=GET_DOCUMENT&FORMAT=PDF&GUID=${id}`,{
          method: 'GET',
          headers: {
            'Authorization': token
          }
        })
        //.then(res => res.text())
        .then(res => {
          console.log(res);
          return res.json()
        })
        .then(response => {
          if (response.Codigo == 1) {
            res(response.ResponseDATA1)
            var xmlRep = (response.ResponseDATA1).replace(/(\r\n|\n|\r)/gm,"");
            console.log("Xml getbillxml ",xmlRep);
            var xmlString = base64.decode(xmlRep);
            let domparser = new DOMParser();
            let xmlStringF = domparser.parseFromString(xmlString, "text/xml");
            let x = xmlStringF.getElementsByTagName("dte:Item");
            var cantidades = '';
            var precios = '';
            var descripciones = '';
            let y = x[0].getElementsByTagName("dte:Cantidad")[0].childNodes[0].nodeValue;
            for (i = 0; i < x.length; i++) {
              let canti = x[i].getElementsByTagName("dte:Cantidad")[0].childNodes[0].nodeValue;
              let preci = x[i].getElementsByTagName("dte:PrecioUnitario")[0].childNodes[0].nodeValue;
              let descri = x[i].getElementsByTagName("dte:Descripcion")[0].childNodes[0].nodeValue;
              cantidades = cantidades + `${canti},`;
              precios = precios + `${preci},`;
              descripciones = descripciones + `${descri},`;
            }

            cant(cantidades.substring(0, cantidades.length - 1));
            desc(precios.substring(0, precios.length - 1));
            prec(descripciones.substring(0, descripciones.length - 1));
          } else {
            rej('Documento No Valido Items');
          }
        })
        .catch(err => {
          console.log(err);
          rej('Error obteniendo informacion de factura')
        })
    })
  }

  const getBillSave = (token, nit, id, res, rej) => {

    loginOld({
      username: null,
      password: null
    }, () => {
      fetch(environmentVariables.apiURL+`FELRequest?NIT=${nit}&TIPO=GET_DOCUMENT&FORMAT=PDF&GUID=${id}`, {
        // fetch(`https://felgttestaws.digifact.com.gt/guestapi/api/FELRequest?NIT=${nit}&TIPO=GET_DOCUMENT&FORMAT=PDF&GUID=${id}`,{
        method: 'GET',
        headers: {
          'Authorization': token
        }
      }).then(response => {
        return response.json()
      }).then(response => {

        if (response.Codigo == 1) {
          res(response.ResponseDATA3)
        } else {
          rej('Documento No Valido');
        }
      }).catch(err => {

        rej('Error obteniendo documento')
      })
    })
  }

  const getBillBack = (id, res, rej) => {
    loginOld({
      username: null,
      password: null
    }, () => {
      fetch(environmentVariables.asmxURL, {
          // fetch(`https://felgttestaws.digifact.com.gt/mx.com.fact.wsfront/factwsfront.asmx`,{
          method: 'POST',
          body: `<?xml version="1.0" encoding="utf-8"?>
              <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <RequestTransaction xmlns="http://www.fact.com.mx/schema/ws">
                    <Requestor>D06A8F37-2D87-43D2-B977-04D503532786</Requestor>
                    <Transaction>FEL_GET_DOCUMENT</Transaction>
                    <Country>GT</Country>
                    <Entity>000000123456</Entity>
                    <User>D06A8F37-2D87-43D2-B977-04D503532786</User>
                    <UserName>GT.000000123456.admon</UserName>
                    <Data1>${id}</Data1>
                    <Data2></Data2>
                    <Data3>PDF</Data3>
                  </RequestTransaction>
                </soap:Body>
              </soap:Envelope>`,
          headers: {
            'Content-Type': 'text/xml',
          }
        }).then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, "text/xml").documentElement)
        .then(data => {

          if (data.getElementsByTagName("Result")[0].firstChild.data === 'true') {
            res(data.getElementsByTagName("ResponseData3")[0].firstChild.data);
          } else {
            rej('Documento invalido');
          }
        })
        .catch(err => {

          rej('Error recuperando documento')
        })
    })
  }

  const sendemailBill = (body, res, rej) => {

    loginOld({
      username: null,
      password: null
    }, () => {
      fetch(environmentVariables.asmxURL, {
        // fetch(`https://felgttestaws.digifact.com.gt/felapi/api/FELRequest?NIT=${nit}&TIPO=CERTIFICATE_DTE_XML_TOSIGN&FORMAT=PDF XML`,{
        method: 'POST',
        body: body,
        headers: {
          'Content-Type': 'text/xml',
        }
      }).then(response => {

      }).catch(err => {

        rej(err);
      })
    })
  }

  const validateNit = (nit, cb, dir,mun,dep, rej) => {

    loginOld({
      username: null,
      password: null
    }, () => {
      fetch(environmentVariables.asmxURL, {
          // fetch(`https://felgttestaws.digifact.com.gt/mx.com.fact.wsfront/factwsfront.asmx`,{
          method: 'POST',
          body: `<?xml version="1.0" encoding="utf-8"?>
              <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <RequestTransaction xmlns="http://www.fact.com.mx/schema/ws">
                  <Requestor>D06A8F37-2D87-43D2-B977-04D503532786</Requestor>
                  <Transaction>EXEC_STORED_PROC</Transaction>
                  <Country>GT</Country>
                  <Entity>000000123456</Entity>
                  <User>D06A8F37-2D87-43D2-B977-04D503532786</User>
                  <UserName>GT.000000123456.admon</UserName>
                  <Data1>PLANILLACC_GetInfoNIT</Data1>
                  <Data2>NIT|${nit}</Data2>
                  <Data3></Data3>
                  </RequestTransaction>
                </soap:Body>
              </soap:Envelope>`,
          headers: {
            'Content-Type': 'text/xml',
          }
        }).then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, "text/xml").documentElement)
        .then(data => {
          if (data.getElementsByTagName("ResponseData1")[0].firstChild.data == 1) {
            cb(data.getElementsByTagName("N")[0].firstChild.data);
            dir(data.getElementsByTagName("Direccion")[0].firstChild.data);
            mun(data.getElementsByTagName("Cm")[0].firstChild.data);
            dep(data.getElementsByTagName("Cd")[0].firstChild.data);
          } else {
            rej('NIT INVALIDO');
          }
        })
        .catch(err => {
          rej(500);
        })
    })
  }

  const validateExistingUserDigifact = (nit, result, rej) => {

    loginOld({
      username: null,
      password: null
    }, () => {
      fetch(environmentVariables.asmxURL, {
          // fetch(`https://felgttestaws.digifact.com.gt/mx.com.fact.wsfront/factwsfront.asmx`,{
          method: 'POST',
          body: `<?xml version="1.0" encoding="utf-8"?>
              <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <RequestTransaction xmlns="http://www.fact.com.mx/schema/ws">
                  <Requestor>D06A8F37-2D87-43D2-B977-04D503532786</Requestor>
                  <Transaction>EXEC_STORED_PROC</Transaction>
                  <Country>GT</Country>
                  <Entity>000000123456</Entity>
                  <User>D06A8F37-2D87-43D2-B977-04D503532786</User>
                  <UserName>GT.000000123456.admon</UserName>
                  <Data1>Account_Status_1</Data1>
                  <Data2>${nit}</Data2>
                  <Data3></Data3>
                  </RequestTransaction>
                </soap:Body>
              </soap:Envelope>`,
          headers: {
            'Content-Type': 'text/xml',
          }
        }).then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, "text/xml").documentElement)
        .then(data => {
          if (data.getElementsByTagName("ResponseData1")[0].firstChild.data == 1) {
            result(data.getElementsByTagName("BundleExpired")[0].firstChild.data);

          } else {
            rej('NIT INVALIDO');
          }
        })
        .catch(err => {

          rej(500);
        })
    })
  }

  const getRequestor = (nit, requestor, rej) => {

    loginOld({
      username: null,
      password: null
    }, () => {
      fetch(environmentVariables.asmxURL, {
          // fetch(`https://felgttestaws.digifact.com.gt/mx.com.fact.wsfront/factwsfront.asmx`,{
          method: 'POST',
          body: `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xmlns:xsd="http://www.w3.org/2001/XMLSchema"
              xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <RequestTransaction xmlns="http://www.fact.com.mx/schema/ws">
                    <Requestor>D06A8F37-2D87-43D2-B977-04D503532786</Requestor>
                    <Transaction>EXEC_STORED_PROC</Transaction>
                    <Country>GT</Country>
                    <Entity>000000123456</Entity>
                    <User>D06A8F37-2D87-43D2-B977-04D503532786</User>
                    <UserName>GT.0000001234565.RESTLET</UserName>
                    <Data1>Account_Status_1</Data1>
                    <Data2>${nit}</Data2>
                    <Data3></Data3>
                  </RequestTransaction>
                </soap:Body>
              </soap:Envelope>`,
          headers: {
            'Content-Type': 'text/xml',
          }
        }).then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, "text/xml").documentElement)
        .then(data => {
          if (data.getElementsByTagName("ResponseData1")[0].firstChild.data == 1) {
            requestor(data.getElementsByTagName("RequestorGUID")[0].firstChild.data);
          } else {
            rej('No se Puede Obtener el Requestor');
          }
        })
        .catch(err => {

          rej(500);
        })
    })
  }

  const getSharedInfo = (nit, requestor,name,paquete,creada,expira,estado, rej) => {

    //console.log("Entrada geet shared info");

    // loginOld({
    //   username: null,
    //   password: null
    // }, () => {
      fetch(environmentVariables.asmxURL, {
          // fetch(`https://felgttestaws.digifact.com.gt/mx.com.fact.wsfront/factwsfront.asmx`,{
          method: 'POST',
          body: `<?xml version="1.0" encoding="utf-8"?>
              <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <RequestTransaction xmlns="http://www.fact.com.mx/schema/ws">
                  <Requestor>${requestor}</Requestor>
                  <Transaction>SHARED_INFO_EFACE</Transaction>
                  <Country>GT</Country>
                  <Entity>${nit}</Entity>
                  <User>${requestor}</User>
                  <UserName>GT.${nit}.admon</UserName>
                  <Data1>SHARED_NFRONT_GETACC</Data1>
                  <Data2>SCountryCode|GT</Data2>
                  <Data3></Data3>
                  </RequestTransaction>
                </soap:Body>
              </soap:Envelope>`,
          headers: {
            'Content-Type': 'text/xml',
          }
        }).then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, "text/xml").documentElement)
        .then(data => {
            //console.log("Salida exitosa geet shared info");
          if (data.getElementsByTagName("Code")[0].firstChild.data == 1) {
            name(data.getElementsByTagName("Name")[0].firstChild.data);
            paquete(data.getElementsByTagName("Paquete")[0].firstChild.data);
            creada(data.getElementsByTagName("CreationDate")[0].firstChild.data);
            expira(data.getElementsByTagName("Expira")[0].firstChild.data);
            estado(data.getElementsByTagName("BundleExpired")[0].firstChild.data);
          } else {
            rej('No se Puede Obtener Informacion de la Cuenta');
          }
        })
        .catch(err => {
          //console.log("Salida error geet shared info");
          rej(500);
        })
    //})
  }

  const getInfo = (nit, name, calle, direccion, zona, frases, afiliacion, zipcode, nombreComercial, direccionComercial,direccionMun, rej) => {

    loginOld({
      username: null,
      password: null
    }, () => {
      fetch(environmentVariables.asmxURL, {
          // fetch(`https://felgttestaws.digifact.com.gt/mx.com.fact.wsfront/factwsfront.asmx`,{
          method: 'POST',
          body: `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                      <RequestTransaction xmlns="http://www.fact.com.mx/schema/ws">
                        <Requestor>D06A8F37-2D87-43D2-B977-04D503532786</Requestor>
                        <Transaction>EXEC_STORED_PROC</Transaction>
                        <Country>GT</Country>
                        <Entity>000000123456</Entity>
                        <User>D06A8F37-2D87-43D2-B977-04D503532786</User>
                        <UserName>GT.000000123456.RESTLET</UserName>
                        <Data1>PLANILLACC_GetInfoFiscalFELFORM</Data1>
                        <Data2>NIT|${nit}</Data2>
                        <Data3></Data3>
                      </RequestTransaction>
                    </soap:Body>
                </soap:Envelope>`,
          headers: {
            'Content-Type': 'text/xml',
          }
        }).then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, "text/xml").documentElement)
        .then(data => {

          if (data.getElementsByTagName("ResponseData1")[0].firstChild.data == 1) {
            //console.log("data getinfo "+data);
            name(data.getElementsByTagName("Nom")[0].firstChild.data);
            calle(data.getElementsByTagName("Ca")[0].firstChild.data);
            direccion(data.getElementsByTagName("cd")[0].firstChild.data);
            zona(data.getElementsByTagName("zon")[0].firstChild.data);
            frases(data.getElementsByTagName("FRASES")[0].firstChild.data);
            //frases(data.getElementsByTagName("FRASES")[0].firstChild.data);
            afiliacion(data.getElementsByTagName("AfiliacionIVA")[0].firstChild.data);
            zipcode(data.getElementsByTagName("ESTCODPOSTAL")[0].firstChild.data);
            nombreComercial(data.getElementsByTagName("EST")[0].firstChild.data);
            direccionComercial(data.getElementsByTagName("ESTDIR")[0].firstChild.data);
            direccionMun(data.getElementsByTagName("cm")[0].firstChild.data);
          } else {
            rej(200);
          }
        })
        .catch(err => {
          rej(200);

        })
    })
  }

  const addProduct = (nit, name, price, type, ean, res, rej) => {

    if (type == "BIEN") {
      var fullType = "BIEN";
    } else if (type == "SERVICIO") {
      var fullType = "SERVICIO";
    } else {
      var fullType = "BIEN";
    }

    loginOld({
      username: null,
      password: null
    }, () => {
      fetch(environmentVariables.asmxURL, {
          // fetch(`https://felgttestaws.digifact.com.gt/mx.com.fact.wsfront/factwsfront.asmx`,{
          method: 'POST',
          body: `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <RequestTransaction xmlns="http://www.fact.com.mx/schema/ws">
                    <Requestor>D06A8F37-2D87-43D2-B977-04D503532786</Requestor>
                    <Transaction>EXEC_STORED_PROC</Transaction>
                    <Country>GT</Country>
                    <Entity>000000123456</Entity>
                    <User>D06A8F37-2D87-43D2-B977-04D503532786</User>
                    <UserName>GT.000000123456.MARIESLOSPOSTMAS</UserName>
                     <Data1>UpsertProductsAndServices</Data1>
                    <Data2>GT|${nit}|${name}|${price}|0|UNI|5|${ean}|00000|app|0|0|${fullType}</Data2>
                    <Data3></Data3>
                  </RequestTransaction>
                </soap:Body>
              </soap:Envelope>`,
          headers: {
            'Content-Type': 'text/xml',
          }
        }).then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, "text/xml").documentElement)
        .then(data => {

          if (data.getElementsByTagName("Result")[0].firstChild.data === 'true') {
            res("Producto agregado con exito");
          } else {
            rej('No se pudo agregar el producto');
          }
        })
        .catch(err => {

          rej('Error agregando productos')
        })
    })
  }

  const deleteProduct = (nit, name, res, rej) => {
    loginOld({
      username: null,
      password: null
    }, () => {
      fetch(environmentVariables.asmxURL, {
          // fetch(`https://felgttestaws.digifact.com.gt/mx.com.fact.wsfront/factwsfront.asmx`,{
          method: 'POST',
          body: `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <RequestTransaction xmlns="http://www.fact.com.mx/schema/ws">
                    <Requestor>D06A8F37-2D87-43D2-B977-04D503532786</Requestor>
                    <Transaction>EXEC_STORED_PROC</Transaction>
                    <Country>GT</Country>
                    <Entity>000000123456</Entity>
                    <User>D06A8F37-2D87-43D2-B977-04D503532786</User>
                    <UserName>GT.000000123456.MARIESLOSPOSTMAS</UserName>
                     <Data1>DeleteProductsAndServices</Data1>
                    <Data2>GT|${nit}|${name}</Data2>
                    <Data3></Data3>
                  </RequestTransaction>
                </soap:Body>
              </soap:Envelope>`,
          headers: {
            'Content-Type': 'text/xml',
          }
        }).then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, "text/xml").documentElement)
        .then(data => {

          if (data.getElementsByTagName("Result")[0].firstChild.data === 'true') {
            res("Producto borrado con exito");
          } else {
            rej('No se pudo borrar el producto');
          }
        })
        .catch(err => {

          rej('Error borrando productos')
        })
    })
  }

  const getAllProducts = (nit, name, price, type,ean, rej) => {
    loginOld({
      username: null,
      password: null
    }, () => {
      fetch(environmentVariables.asmxURL, {
          // fetch(`https://felgttestaws.digifact.com.gt/mx.com.fact.wsfront/factwsfront.asmx`,{
          method: 'POST',
          body: `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <RequestTransaction xmlns="http://www.fact.com.mx/schema/ws">
                    <Requestor>D06A8F37-2D87-43D2-B977-04D503532786</Requestor>
                    <Transaction>EXEC_STORED_PROC</Transaction>
                    <Country>GT</Country>
                    <Entity>000000123456</Entity>
                    <User>D06A8F37-2D87-43D2-B977-04D503532786</User>
                    <UserName>GT.000000123456.MARIESLOSPOSTMAS</UserName>
                    <Data1>GetAllProductsAndServices</Data1>
                    <Data2>GT|${nit}</Data2>
                    <Data3></Data3>
                  </RequestTransaction>
                </soap:Body>
              </soap:Envelope>`,
          headers: {
            'Content-Type': 'text/xml',
          }
        }).then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, "text/xml").documentElement)
        .then(data => {
          if (data.getElementsByTagName("ResponseData1")[0].firstChild.data > 0) {
            //res("Se Encontraron Productos Registrados");
            var nombres = '';
            var precios = '';
            var tipos = '';
            var eans = '';
            let x = data.getElementsByTagName("T");

            for (i = 0; i < x.length; i++) {
              let nom = x[i].getElementsByTagName("D")[0].childNodes[0].nodeValue;
              let pre = x[i].getElementsByTagName("LP")[0].childNodes[0].nodeValue;
              let tip = x[i].getElementsByTagName("CTG")[0].childNodes[0].nodeValue;
              let ea = x[i].getElementsByTagName("EAN")[0].childNodes[0].nodeValue;
              nombres = nombres + `${nom}|`;
              precios = precios + `${pre}|`;
              tipos = tipos + `${tip}|`;
              eans = eans + `${ea}|`;
            }


            name(nombres.substring(0, nombres.length - 1));
            type(tipos.substring(0, tipos.length - 1));
            price(precios.substring(0, precios.length - 1));
            ean(eans.substring(0, eans.length - 1));
          } else {
            // rej('No se encuentran productos registrados');
          }
        })
        .catch(err => {
          rej(err);
        })
    })
  }

  const forgotPassword = (username, res, rej) => {

    loginOld({
      username: null,
      password: null
    }, () => {
      fetch(environmentVariables.asmxURL, {
          method: 'POST',
          body: `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <RequestTransaction xmlns="http://www.fact.com.mx/schema/ws">
                    <Requestor>D06A8F37-2D87-43D2-B977-04D503532786</Requestor>
                    <Transaction>PASSWORD_FORGOT</Transaction>
                    <Country>GT</Country>
                    <Entity>000000123456</Entity>
                    <User>D06A8F37-2D87-43D2-B977-04D503532786</User>
                    <UserName>${username}</UserName>
                     <Data1></Data1>
                    <Data2></Data2>
                    <Data3></Data3>
                  </RequestTransaction>
                </soap:Body>
              </soap:Envelope>`,
          headers: {
            'Content-Type': 'text/xml',
          }
        }).then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, "text/xml").documentElement)
        .then(data => {
          if (data.getElementsByTagName("Result")[0].firstChild.data === 'true') {
            res("La clave temporal ha sido enviada por correo electronico");
          } else {
            rej('Verifique el usuario y nit ingresado');
          }
        })
        .catch(err => {

          rej('Error recuperando clave')
        })
    })
  }

  const searchBasic = (taxid, requestor,dateSup, username, res, rej) => {
    var bodySearchBasic = `<?xml version="1.0" encoding="utf-8"?><SearchCriteria xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><ApplySearchCriteria>true</ApplySearchCriteria><SCountryCode>GT</SCountryCode><STaxIdOrName>${taxid}</STaxIdOrName><Branch></Branch><CurrencyCode>GTQ</CurrencyCode><RCountryCode>GT</RCountryCode><RTaxIdOrName /><SKind>0</SKind><ReturnBatchAsLike>false</ReturnBatchAsLike><Batch></Batch><UseSerialFrom>false</UseSerialFrom><UseSerialTo>false</UseSerialTo><SerialFrom>0</SerialFrom><SerialTo>0</SerialTo><UseInternalIDFrom>false</UseInternalIDFrom><UseInternalIDTo>false</UseInternalIDTo><InternalIDFrom>0</InternalIDFrom><InternalIDTo>0</InternalIDTo><UseDateFrom>false</UseDateFrom><UseDateTo>false</UseDateTo><DateFrom>2019-10-01T00:00:00</DateFrom><DateTo>${dateSup}</DateTo><UseAmountFrom>false</UseAmountFrom><UseAmountTo>false</UseAmountTo><AmountFrom>0</AmountFrom><AmountTo>0</AmountTo><Paid>2</Paid><Cancelled>0</Cancelled><Distributed>2</Distributed><QueryTop>10</QueryTop><OrderBy>0</OrderBy><Descending>true</Descending></SearchCriteria>`;

    var xml = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><RequestTransaction xmlns="http://www.fact.com.mx/schema/ws"><Requestor>${requestor}</Requestor><Transaction>SEARCH_BASIC</Transaction><Country>GT</Country><Entity>${taxid}</Entity><User>${requestor}</User><UserName>${username}</UserName><Data1><![CDATA[${bodySearchBasic}]]></Data1><Data2></Data2><Data3></Data3></RequestTransaction></soap:Body></soap:Envelope>`;
    loginOld({
      username: null,
      password: null
    }, () => {
      fetch(environmentVariables.asmxURL, {

          method: 'POST',
          body: xml,
          headers: {
            'Content-Type': 'text/xml',
          }

        }).then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, "text/xml").documentElement)
        .then(data => {
          if (data.getElementsByTagName("ResponseData1")[0].firstChild.data > 0) {
            var x = data.getElementsByTagName("NewDataSet");
            var y = data.getElementsByTagName("NewDataSet")[0].childNodes;
            var arrayResponse = [];
            for (i = 0; i < y.length; i++) {
              let singleObject = {};
              singleObject.tipoDTE = y[i].getElementsByTagName("A")[0].childNodes[0].nodeValue;
              singleObject.nitReceptor = y[i].getElementsByTagName("B")[0].childNodes[0].nodeValue;
              singleObject.total = y[i].getElementsByTagName("G")[0].childNodes[0].nodeValue;
              singleObject.razonSocialReceptor = y[i].getElementsByTagName("C")[0].childNodes[0].nodeValue;
              singleObject.numeroAutorizacion = y[i].getElementsByTagName("DG")[0].childNodes[0].nodeValue.toUpperCase();
              arrayResponse.push(singleObject);
            }
            res(arrayResponse);
          } else {
            res(0);
          }
        })
        .catch(err => {
          rej(err);
        })
      })
  }

  const sendProductDB = (taxid, guid, fechaEmision, codigoProducto, cantidadProducto, descripcionProducto,precioUnitarioProducto,ivaProducto,idpProducto, res, rej) => {
    var xmlProdDB = `<?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                    <RequestTransaction xmlns="http://www.fact.com.mx/schema/ws">
                        <Requestor>D06A8F37-2D87-43D2-B977-04D503532786</Requestor>
                        <Transaction>SHARED_INFO_EFACE</Transaction>
                        <Country>GT</Country>
                        <Entity>000000123456</Entity>
                        <User>D06A8F37-2D87-43D2-B977-04D503532786</User>
                        <UserName>GT.000000123456.admon</UserName>
                        <Data1>SHARED_INSERT_PRODUCTOSBYGUID</Data1>
                        <Data2>STAXID|${taxid}|UUID|${guid}|FECHAEMISION|${fechaEmision}|CODIGO|${codigoProducto}|CANTIDAD|${cantidadProducto}|DESCRIPCION|${descripcionProducto}|PU|${precioUnitarioProducto}|IVA|${ivaProducto}|IDP|${idpProducto}</Data2>
                        <Data3></Data3>
                    </RequestTransaction>
                </soap:Body>
            </soap:Envelope>`;
            console.log("xml to send ",xmlProdDB)
    loginOld({
      username: null,
      password: null
    }, () => {
      fetch(environmentVariables.asmxURL, {
          // fetch(`https://felgttestaws.digifact.com.gt/mx.com.fact.wsfront/factwsfront.asmx`,{
          method: 'POST',
          body: xmlProdDB,
          headers: {
            'Content-Type': 'text/xml',
          }
        }).then(response => response.text())

        .catch(err => {

          rej('Error agregando productos')
        })
    })
  }

  const getProductDB = (taxid, fechaInicial, fechaFinal, res, rej) => {
    console.log("taxid ",taxid);
    var xmlProdDB = `<?xml version="1.0" encoding="utf-8"?>
          <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
              <soap:Body>
                  <RequestTransaction xmlns="http://www.fact.com.mx/schema/ws">
                      <Requestor>D06A8F37-2D87-43D2-B977-04D503532786</Requestor>
                      <Transaction>SHARED_INFO_EFACE</Transaction>
                      <Country>GT</Country>
                      <Entity>000000123456</Entity>
                      <User>D06A8F37-2D87-43D2-B977-04D503532786</User>
                      <UserName>GT.000000123456.admon</UserName>
                      <Data1>SHARED_NFRONT_GETPRODUCTOSBYDATE</Data1>
                      <Data2>STAXID|${taxid}|FECHAINICIAL|${fechaInicial}|FECHAFINAL|${fechaFinal}</Data2>
                      <Data3></Data3>
                  </RequestTransaction>
              </soap:Body>
          </soap:Envelope>`;
    loginOld({
      username: null,
      password: null
    }, () => {
      fetch(environmentVariables.asmxURL, {
          // fetch(`https://felgttestaws.digifact.com.gt/mx.com.fact.wsfront/factwsfront.asmx`,{
          method: 'POST',
          body: xmlProdDB,
          headers: {
            'Content-Type': 'text/xml',
          }
        }).then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, "text/xml").documentElement)
        .then(data => {
          if (data.getElementsByTagName("ResponseData1")[0].firstChild.data > 0) {
            var x = data.getElementsByTagName("T");
            var arrayResponse = [];
            for (i = 0; i < x.length; i++) {
              let singleObject = {};
              singleObject.codigo = x[i].getElementsByTagName("codigo")[0].childNodes[0].nodeValue;
              singleObject.cantidad = x[i].getElementsByTagName("CANTIDAD")[0].childNodes[0].nodeValue;
              singleObject.total = x[i].getElementsByTagName("TOTAL")[0].childNodes[0].nodeValue;
              singleObject.descripcion = x[i].getElementsByTagName("DESCRIPCION")[0].childNodes[0].nodeValue;
              singleObject.iva = x[i].getElementsByTagName("IVA")[0].childNodes[0].nodeValue;
              singleObject.idp = x[i].getElementsByTagName("IDP")[0].childNodes[0].nodeValue;
              arrayResponse.push(singleObject);
            }
            res(arrayResponse);
          } else {
            res(0);

          }
        })

        .catch(err => {

          rej(err)
        })
    })
  }

  const getXML = (id, un, requ, taxid, res, rej) => {
    loginOld({
      username: null,
      password: null
    }, () => {
      fetch(environmentVariables.asmxURL, {
          // fetch(`https://felgttestaws.digifact.com.gt/mx.com.fact.wsfront/factwsfront.asmx`,{
          method: 'POST',
          body: `<?xml version="1.0" encoding="utf-8"?>
              <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <RequestTransaction xmlns="http://www.fact.com.mx/schema/ws">
                    <Requestor>${requ}</Requestor>
                    <Transaction>FEL_GET_DOCUMENT</Transaction>
                    <Country>GT</Country>
                    <Entity>${taxid}</Entity>
                    <User>${requ}</User>
                    <UserName>${un}</UserName>
                    <Data1>${id}</Data1>
                    <Data2></Data2>
                    <Data3>XML</Data3>
                  </RequestTransaction>
                </soap:Body>
              </soap:Envelope>`,
          headers: {
            'Content-Type': 'text/xml;charset=UTF-8',
          }
        }).then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, "text/xml").documentElement)
        .then(data => {

          if (data.getElementsByTagName("Result")[0].firstChild.data === 'true') {
            res(data.getElementsByTagName("ResponseData1")[0].firstChild.data);
          } else {
            rej('Documento invalido');
          }
        })
        .catch(err => {
          rej(err)
        })
    })
  }

  const addCliente = (taxid, requestor, username, pais, tipoCliente, nit, razonSocial, cargo, telefono, correo, res, rej) => {
    var xml2send = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <RequestTransaction xmlns="http://www.fact.com.mx/schema/ws">
              <Requestor>${requestor}</Requestor>
              <Transaction>SHARED_INFO_EFACE</Transaction>
              <Country>GT</Country>
              <Entity>${taxid}</Entity>
              <User>${requestor}</User>
              <UserName>${username}</UserName>
               <Data1>SHARED_NFRONT_ADDCUSTOMER</Data1>
              <Data2>SCountryCode|${pais}|TipoCliente|${tipoCliente}|NIT|${nit}|NombreOrganizacion|${razonSocial}|NombreContacto|${razonSocial}|Cargo|${cargo}|Telefono|${telefono}|Correo|${correo}</Data2>
              <Data3></Data3>
            </RequestTransaction>
          </soap:Body>
        </soap:Envelope>`;
      console.log("xml2send ",xml2send);
    loginOld({
      username: null,
      password: null
    }, () => {
      fetch(environmentVariables.asmxURL, {
          // fetch(`https://felgttestaws.digifact.com.gt/mx.com.fact.wsfront/factwsfront.asmx`,{
          method: 'POST',
          body: xml2send,
          headers: {
            'Content-Type': 'text/xml;charset=UTF-8',
          }
        }).then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, "text/xml").documentElement)
        .then(data => {
          console.log("data respo ",data.toString())
          if (data.getElementsByTagName("Result")[0].firstChild.data == "true") {
            res("Cliente agregado con exito");
          } else {
            rej('No se pudo agregar el Cliente');
          }
        })
        .catch(err => {
          rej('Error agregando Cliente')
        })
    })
  }

  const getAllClients = (requestor, taxid, username, res, rej) => {
    loginOld({
      username: null,
      password: null
    }, () => {
      fetch(environmentVariables.asmxURL, {
          // fetch(`https://felgttestaws.digifact.com.gt/mx.com.fact.wsfront/factwsfront.asmx`,{
          method: 'POST',
          body: `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <RequestTransaction xmlns="http://www.fact.com.mx/schema/ws">
                    <Requestor>${requestor}</Requestor>
                    <Transaction>SHARED_INFO_EFACE</Transaction>
                    <Country>GT</Country>
                    <Entity>${taxid}</Entity>
                    <User>${requestor}</User>
                    <UserName>${username}</UserName>
                    <Data1>SHARED_NFRONT_GETCUSTOMERBYSTAXID</Data1>
                    <Data2>SCountryCode|GT</Data2>
                    <Data3></Data3>
                  </RequestTransaction>
                </soap:Body>
              </soap:Envelope>`,
          headers: {
            'Content-Type': 'text/xml;charset=UTF-8',
          }
        }).then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, "text/xml").documentElement)
        .then(data => {
          if (data.getElementsByTagName("ResponseData1")[0].firstChild.data > 0) {
            var x = data.getElementsByTagName("T");
            var arrayResponse = [];
            for (i = 0; i < x.length; i++) {
              let singleObject = {};
              singleObject.nit = x[i].getElementsByTagName("NIT")[0].childNodes[0].nodeValue;
              singleObject.name = x[i].getElementsByTagName("NombreOrganizacion")[0].childNodes[0].nodeValue;
              singleObject.email = x[i].getElementsByTagName("Correo")[0].childNodes[0].nodeValue;
              singleObject.address = "CIUDAD";
              singleObject.municipality = "GUATEMALA";
              singleObject.department = "GUATEMALA";
              singleObject.zipCode = "01010";
              if(x[i].getElementsByTagName("status")[0].childNodes[0].nodeValue !== "BAJA"){
                arrayResponse.push(singleObject);
              }
            }
            res(arrayResponse);
          } else {
            // rej('No se encuentran productos registrados');
          }
        })
        .catch(err => {
          rej(err);
        })
    })
  }

  const getDashboard = (taxid, res, rej) => {
    var xmlDash = `<?xml version="1.0" encoding="utf-8"?>
          <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
              <soap:Body>
                  <RequestTransaction xmlns="http://www.fact.com.mx/schema/ws">
                      <Requestor>D06A8F37-2D87-43D2-B977-04D503532786</Requestor>
                      <Transaction>SHARED_INFO_EFACE</Transaction>
                      <Country>GT</Country>
                      <Entity>000000123456</Entity>
                      <User>D06A8F37-2D87-43D2-B977-04D503532786</User>
                      <UserName>GT.000000123456.DIGIFACT</UserName>
                      <Data1>SHARED_NFRONT_DASHBOARD</Data1>
                      <Data2>STAXID|${taxid}</Data2>
                      <Data3></Data3>
                  </RequestTransaction>
              </soap:Body>
          </soap:Envelope>`;
    loginOld(
      {
        username: null,
        password: null,
      },
      () => {
        fetch(environmentVariables.asmxURL, {
          method: 'POST',
          body: xmlDash,
          headers: {
            'Content-Type': 'text/xml',
          },
        })
          .then(response => response.text())
          .then(
            str =>
              new DOMParser().parseFromString(str, 'text/xml').documentElement,
          )
          .then(data => {
            var arrayResponse = [];
            if (
              data.getElementsByTagName('ResponseData1')[0].firstChild.data > 0
            ) {
              var today = new Date();
              var yyyy = today.getFullYear();
              var x = data.getElementsByTagName('T');
              var singleObject = {};
              var todayDate = new Date();
              var todayMonth = todayDate.getMonth();
              todayMonth = todayMonth + 1;
              var todayYear = todayDate.getFullYear();
              var ventasActuales = 0;
              var ventasAnteriores = 0;
              var csActuales = 0;
              var csAnteriores = 0;
              var arrayTotalesSemanal = [];
              var arrayLabelsSemanal = [];
              var arrayTotalesAnual = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0];
              var arrayMontoTopClientes = [];
              var arrayNitTopClientes = [];
              var ventasActualCalculo = 0.0;
              var cantidadVentasCalculo = 0;
              for (var i = 0; i < x.length; i++) {
                if (
                  x[i].getElementsByTagName('tipoInfo')[0].childNodes[0]
                    .nodeValue == 'ANUAL'
                ) {
                  var monto = x[i].getElementsByTagName('total')[0]
                    .childNodes[0].nodeValue;
                  console.log('monto', monto);
                  singleObject.ingresoAnual = monto;
                }
                if (
                  x[i].getElementsByTagName('tipoInfo')[0].childNodes[0]
                    .nodeValue == 'CLIENTES_TOTAL'
                ) {
                  var totalClientes = x[i].getElementsByTagName('numCliente')[0]
                    .childNodes[0].nodeValue;
                  singleObject.totalClientes = totalClientes;
                }

                if (
                  x[i].getElementsByTagName('tipoInfo')[0].childNodes[0]
                    .nodeValue == 'MENSUAL'
                ) {
                  var monthXml = x[i].getElementsByTagName('mes')[0]
                    .childNodes[0].nodeValue;
                  var yearXml = x[i].getElementsByTagName('anio')[0]
                    .childNodes[0].nodeValue;

                  if (todayMonth == monthXml && todayYear == yearXml) {
                    var monthRev = x[i].getElementsByTagName('total')[0]
                      .childNodes[0].nodeValue;
                    singleObject.ingresoMensual = monthRev;
                    ventasActualCalculo = parseFloat(monthRev);
                  }
                }

                if (
                  x[i].getElementsByTagName('tipoInfo')[0].childNodes[0]
                    .nodeValue == 'VENTAS'
                ) {

                  var totalVentas = x[i].getElementsByTagName('numVentas')[0]
                    .childNodes[0].nodeValue;
                    ventasActuales = totalVentas;
                  console.log('valor en total ventas node ', totalVentas);
                  singleObject.numeroVentas = totalVentas;
                  cantidadVentasCalculo = parseInt(totalVentas);
                }
                if (
                  x[i].getElementsByTagName('tipoInfo')[0].childNodes[0]
                    .nodeValue == 'VENTAS_PASADO'
                ) {

                  var totalVentasAnterior = x[i].getElementsByTagName('numVentas')[0]
                    .childNodes[0].nodeValue;
                    ventasAnteriores = totalVentasAnterior;
                }
                if(ventasActuales != 0 && ventasAnteriores != 0){
                  console.log("Entrada calculo porcentaje ventas");
                  console.log("valor actual ",ventasActuales);
                  console.log("valor anterior ",ventasAnteriores);
                  var porcentajeVentas = (ventasActuales/ventasAnteriores).toFixed(1);
                  console.log("valor porcentaje ",porcentajeVentas);
                  singleObject.pVentas = porcentajeVentas;
                }
                if (
                  x[i].getElementsByTagName('tipoInfo')[0].childNodes[0]
                    .nodeValue == 'CROSS_SELL'
                ) {

                  var totalCrossSell = x[i].getElementsByTagName('total')[0]
                    .childNodes[0].nodeValue;
                    csActuales = totalCrossSell;
                  singleObject.totalCs = totalCrossSell;
                }
                if (
                  x[i].getElementsByTagName('tipoInfo')[0].childNodes[0]
                    .nodeValue == 'CROSS_SELL_TOTAL'
                ) {

                  var totalCrossSellAnterior = x[i].getElementsByTagName('total')[0]
                    .childNodes[0].nodeValue;
                    csAnteriores = totalCrossSellAnterior;
                }
                if(csActuales != 0 && csAnteriores != 0){
                  var porcentajeCs = (csActuales/csAnteriores).toFixed(1);
                  singleObject.pCrossSell = porcentajeCs;
                }
                if(ventasActualCalculo != 0.0 && cantidadVentasCalculo != 0){
                  var porcentajeV = (ventasActualCalculo/cantidadVentasCalculo).toFixed(1);
                  singleObject.ventasPorTran = porcentajeV;
                }
                if (
                  x[i].getElementsByTagName('tipoInfo')[0].childNodes[0]
                    .nodeValue == 'SEMANAL'
                ) {
                  var totalSemana = x[i].getElementsByTagName('total')[0]
                    .childNodes[0].nodeValue;
                  var fechaInicial = x[i].getElementsByTagName('fechaInicio')[0]
                    .childNodes[0].nodeValue;
                  var fechaFinal = x[i].getElementsByTagName('fechaFin')[0]
                    .childNodes[0].nodeValue;
                  var fechaHoraInicialArray = fechaInicial.split("T");
                  var fechaInicialArray = fechaHoraInicialArray[0].split("-");
                  var fechaHoraFinalArray = fechaFinal.split("T");
                  var fechaFinalArray = fechaHoraFinalArray[0].split("-");
                  var singleSemana = {};
                  arrayTotalesSemanal.push(totalSemana);
                  arrayLabelsSemanal.push(`${fechaInicialArray[2]}-${fechaInicialArray[1]} a ${fechaFinalArray[2]}-${fechaFinalArray[1]}`);
                }
                if (
                  x[i].getElementsByTagName('tipoInfo')[0].childNodes[0]
                    .nodeValue == 'MENSUAL'
                ) {
                  if(x[i].getElementsByTagName('anio')[0]
                    .childNodes[0].nodeValue == yyyy){
                      var monthNumberString =  x[i].getElementsByTagName('mes')[0]
                        .childNodes[0].nodeValue;
                      var monthNumber = parseInt(monthNumberString) -1;
                    var totalMes = x[i].getElementsByTagName('total')[0]
                      .childNodes[0].nodeValue;

                    arrayTotalesAnual[monthNumber] = totalMes;
                  }
                }

                if (
                  x[i].getElementsByTagName('tipoInfo')[0].childNodes[0]
                    .nodeValue == 'TOP_CLIENTES'
                ) {
                  var topClientesNit = x[i].getElementsByTagName('nit')[0]
                    .childNodes[0].nodeValue;
                  var topClientesMonto = x[i].getElementsByTagName('total')[0]
                    .childNodes[0].nodeValue;
                  singleObject.totalClientes = totalClientes;
                  arrayMontoTopClientes.push(`Q. ${topClientesMonto}`);
                  arrayNitTopClientes.push(topClientesNit);
                }
                if (
                  x[i].getElementsByTagName('tipoInfo')[0].childNodes[0]
                    .nodeValue == 'CLIENTES_NUEVOS'
                ) {
                  var totalClientesN = x[i].getElementsByTagName('numCliente')[0]
                    .childNodes[0].nodeValue;
                  singleObject.nuevosClientes = totalClientesN;
                }
              }
              var arrayRevMonto = arrayMontoTopClientes.reverse();
              var arrayRevNit = arrayNitTopClientes.reverse();

              singleObject.ingresoSemanalTotales = arrayTotalesSemanal;
              singleObject.ingresoSemanalLabels = arrayLabelsSemanal;
              singleObject.ingresosAnuales = arrayTotalesAnual;
              singleObject.topClientesMonto = arrayRevMonto;
              singleObject.topClientesNit = arrayRevNit;
              arrayResponse.push(singleObject);
              res(arrayResponse);
            } else {
              res(0);
            }
          })
          .catch(err => {
            rej(err);
          });
      },
    );
  };

  function PadLeft(value, length) {
    return (value.toString().length < length) ? PadLeft("0" + value, length) :
      value;
  }

  return {
    login,
    sendBill,
    getBill,
    getBillXML,
    getBillSave,
    validateNit,
    getRequestor,
    cancelBill,
    getInfo,
    sendemailBill,
    addProduct,
    deleteProduct,
    getAllProducts,
    forgotPassword,
    validateExistingUserDigifact,
    getSharedInfo,
    getXMLTransformation,
    searchBasic,
    sendProductDB,
    getProductDB,
    getXML,
    addCliente,
    getAllClients,
    getDashboard,
  };
}

export default useApi;
