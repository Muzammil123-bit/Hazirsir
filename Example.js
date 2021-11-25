import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
} from 'react-native';

// import DB from "../src/DB";
// import Country from "../src/Country_t";
import DB from './src/DB';
import Country from './src/Country_t';
import State from './src/state_t';
import City from './src/City_t';



const db = new DB();
const CountryDB = new Country();
const StateDB = new State();
const CityDB = new City();



import ModalDropdown from 'react-native-modal-dropdown';
// import State_t from './src/state_t';
// import ModalDropdown from './ModalDropdown';

const DEMO_OPTIONS_1 = ['option 1', 'option 2', 'option 3', 'option 4', 'option 5', 'option 6', 'option 7', 'option 8', 'option 9'];
const DEMO_OPTIONS_2 = [
  {"name": "Rex", "age": 30},
  {"name": "Mary", "age": 25},
  {"name": "John", "age": 41},
  {"name": "Jim", "age": 22},
  {"name": "Susan", "age": 52},
  {"name": "Brent", "age": 33},
  {"name": "Alex", "age": 16},
  {"name": "Ian", "age": 20},
  {"name": "Phil", "age": 24},
];


const ss_data = [
  {
    "id": 1,
    "sortname": "AF",
    "name": "Afghanistan",
    "phoneCode": 93
  },
  {
    "id": 2,
    "sortname": "AL",
    "name": "Albania",
    "phoneCode": 355
  },
  {
    "id": 3,
    "sortname": "DZ",
    "name": "Algeria",
    "phoneCode": 213
  },
  {
    "id": 4,
    "sortname": "AS",
    "name": "American Samoa",
    "phoneCode": 1684
  }
];

let s_data = [];




class Example extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          dropdown_4_options: null,
          dropdown_4_defaultValue: 'loading...',
          dropdown_6_icon_heart: true,
        };
      }

      
     componentDidMount= async() =>{
    
      // await db.clearDB();
      // await CountryDB.addCategory();

      this.register();
     

     
  
  }



  
    
   register= async() => {
    console.log(this.state.fcm);
    
    const uname=this.state.username;
    const pass=this.state.password;
    var data=[];

    data=
    [
        'email',
        'fgdadagdadashgkvfgjgfa',
        'other',//usertype
        'fgfdaafkiaadkdkvshgfgkfa',
        'fgdffaadahdagkhkjvsdkgfa',
        'fggdfgdaaaksdhkfvgslkagfa',//fbid
    ];

    // await db.clearDB();


   

   
    const url='https://www.hazirsir.com/web_service/register.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
    // if(uname==='' || pass===''){
    // ToastAndroid.show('Username or Password cannot be empty!', ToastAndroid.SHORT);
    // }
    // else{
    await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            z: data,
            
        })
    })
        .then((response) => response.json())
        .then((responseJson) => {
          

        

          console.log("hhhhhhhhhhhhhh"+JSON.stringify(responseJson[2]));
          
          // alert(JSON.stringify(responseJson[1]));

            
        })
        .catch((error) => {
            // reject(error);
            console.log(error);
            alert(error);
            return error;
    });
    // }
    
}



inser_country = async(res) =>
{


  alert(JSON.stringify(res[0]));

    await db.clearDB();




  //   for (let index = 0; index < res.length; index++) {
  //     const elementt = res[index];
  
  //   s_data.push({
  //     c_id: elementt.id,
  //     name: elementt.name,
  //   });
  // }
  
  
  //   alert(JSON.stringify(s_data));
  
  
  //   for (let index = 0; index < s_data.length; index++) {
  //     const elementt = s_data[index];
  
  //     await CountryDB.addCategory(elementt);
  //   }




  for (let index = 0; index < res.length; index++) {
    const elementt = res[index];

  s_data.push({
    c_id: elementt.id,
    name: elementt.name,
    state_id: elementt.state_id,
  });
}


  // alert(JSON.stringify(s_data));


  for (let index = 0; index < s_data.length; index++) {
    const elementt = s_data[index];

    await CityDB.addCategory(elementt);
  }


//   for (let index = 0; index < res.length; index++) {
//     const elementt = res[index];

//   s_data.push({
//     c_id: elementt.id,
//     name: elementt.name,
//     country_id: elementt.country_id,
//   });
// }


//   alert(JSON.stringify(s_data));


//   for (let index = 0; index < s_data.length; index++) {
//     const elementt = s_data[index];

//     await StateDB.addCategory(elementt);
//   }



  // for (let index = 0; index < res.length; index++) {
  //   const elementt = res[index];
  //   // if(index =res.length-2)
  //   // {
  //   //   alert("2nd Last");
  //   // }

  //   await CountryDB.addCategory(elementt);
  // }


}










  getdata = async() =>
  {

    // const categories_Show = await CountryDB.listCategory();
    // const categories_Show = await StateDB.listCategory();
    const categories_Show = await CityDB.listCategory();

    alert(JSON.stringify(categories_Show));
    // console.log("countryyyyyyy "+ categories_Show);
  }


    
      render() {
       return (
          <View style={styles.container}>
          


          <TouchableOpacity 
                  onPress={()=>this.getdata()}
                  >
         
                  
                  <Text >get data</Text>
            
              </TouchableOpacity>

           
             
              <View style={styles.cell}>
                <ModalDropdown ref="dropdown_2"
                               style={styles.dropdown_2}
                               textStyle={styles.dropdown_2_text}
                               dropdownStyle={styles.dropdown_2_dropdown}
                               options={DEMO_OPTIONS_2}
                               renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
                               renderRow={this._dropdown_2_renderRow.bind(this)}
                               renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                />



<ModalDropdown ref="dropdown_2"
                               style={styles.dropdown_2}
                               textStyle={styles.dropdown_2_text}
                               dropdownStyle={styles.dropdown_2_dropdown}
                               options={DEMO_OPTIONS_2}
                               renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
                               renderRow={this._dropdown_2_renderRow.bind(this)}
                            //    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                />
                
              </View>
        
          
         
               </View>
        );
      }
    
      _dropdown_2_renderButtonText(rowData) {
        const {name, age} = rowData;
        return `${name} - ${age}`;
      }
    
      _dropdown_2_renderRow(rowData, rowID, highlighted) {
        let icon = highlighted ? require('./images/heart.png') : require('./images/flower.png');
        let evenRow = rowID % 2;
        return (
          <TouchableHighlight underlayColor='cornflowerblue'>
            <View style={[styles.dropdown_2_row, {backgroundColor: evenRow ? 'lemonchiffon' : 'white'}]}>
              <Image style={styles.dropdown_2_image}
                     mode='stretch'
                     source={icon}
              />
              <Text style={[styles.dropdown_2_row_text, highlighted && {color: 'mediumaquamarine'}]}>
                {`${rowData.name} (${rowData.age})`}
              </Text>
            </View>
          </TouchableHighlight>
        );
      }
    
      _dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        if (rowID == DEMO_OPTIONS_1.length - 1) return;
        let key = `spr_${rowID}`;
        return (<View style={styles.dropdown_2_separator}
                      key={key}
        />);
      }
    
      }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
      },
      row: {
        flex: 1,
        flexDirection: 'row',
      },
      cell: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
      },
      scrollView: {
        flex: 1,
      },
      contentContainer: {
        height: 500,
        paddingVertical: 100,
        paddingLeft: 20,
      },
      textButton: {
        color: 'deepskyblue',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'deepskyblue',
        margin: 2,
      },
    
      dropdown_1: {
        flex: 1,
        top: 32,
        left: 8,
      },
      dropdown_2: {
        alignSelf: 'center',
        width: 350,
        marginTop: 32,
        
        borderWidth: 2,
        borderRadius: 8,
        borderTopColor: '#000000',
        backgroundColor: '#dfdfdf',
      },
      dropdown_2_text: {
        marginVertical: 10,
        marginHorizontal: 6,
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
      },
      dropdown_2_dropdown: {
        width: 350,
        height: 300,
        borderWidth: 3,
        borderRadius: 3,
      },
      dropdown_2_row: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
      },
      dropdown_2_image: {
        marginLeft: 4,
        width: 30,
        height: 30,
      },
      dropdown_2_row_text: {
        marginHorizontal: 4,
        fontSize: 16,
        color: 'navy',
        textAlignVertical: 'center',
      },
      dropdown_2_separator: {
        height: 1,
        backgroundColor: 'cornflowerblue',
      },
     
    });
export default Example;