import React,{ useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Modal, TouchableHighlight, Image, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';


export default function App() {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [state, setState] = useState({
   selected: {}
  })

  

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const scannedBarCode = (isbn) => {
    let headers = {
      "Content-Type": 'application/json',
      "Authorization": '43859_7c0a637a8dd280c044f6c206447551af'
  }
   
  fetch('https://api2.isbndb.com/book/' +isbn, {headers: headers})
      .then(response => {
          return response.json();
      })
      .then(json  => {
        if(json.status !== 200){
        let results = json.book;
          setState(prevState => {
            return{...prevState,selected: results}
          })
        }
        else {
          throw "Object is not in the ISBN"
          
        }
      })
      .catch(error => {
        alert(error)
          console.error('Error:', error)
      });
  }


  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    let isbn = data;
    scannedBarCode(isbn);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }   


  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanningArea}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      <Modal
       animationType="fade"
      transparent={false}
      visible={(typeof state.selected.title != 'undefined')}
      >
        <View>
        <ScrollView>
          <Image
            source={{ uri: state.selected.image}}
            style={{
              width: '100%',
              height: 450
            }}
            resizeMode="cover"
          />
          <Text style={styles.title}>{state.selected.title}</Text>
          <Text style={styles.fonts}>Authors:{state.selected.authors}</Text>
          <Text style={styles.fonts}>Binding Company:{state.selected.binding}</Text>
          <Text style={styles.fonts}>Date Published: {state.selected.date_published}</Text>
          <Text style={styles.fonts}>ISBN 9:{state.selected.isbn}</Text>
          <Text style={styles.fonts}>ISBN 13:{state.selected.isbn13}</Text>
          <Text style={styles.fonts}>Language Written:{state.selected.language}</Text>
          <Text style={styles.fonts}>Total Pages: {state.selected.pages}</Text>
          <Text style={styles.fonts}>Maximum Retail Price :{state.selected.msrp}</Text>


          <TouchableHighlight
      onPress={()=> setState(prevState => {
        return {...prevState, selected:{}}
      })}
      >
      <Text style={styles .closeBtn}>Close</Text>
      </TouchableHighlight>
      </ScrollView>
        </View>
      </Modal>
    </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    color: '#000',
    fontSize: 27,
    fontWeight: '700',
    textAlign: "center",
    marginBottom: 5,
    padding: 5
  },
  closeBtn: {
    padding: 20,
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
    backgroundColor: '#000000',
    textAlign: "center"
  },
  fonts:{
    fontSize: 20,
    textAlign: "left",
    padding: 5

  },
  scanningArea: {
    width: "100%",
    height:"75%",
    alignContent: "center"
  }
});
