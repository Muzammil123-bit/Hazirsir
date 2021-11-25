import React, { Component } from 'react';
import { View, Text } from 'react-native';

class EmailVer extends Component {
    constructor(props) {
        super(props);
        
    }
    state = {

    };
    
    async sendToServer(){
        console.log(uid)
        const url=this.state.url+'get_image.php';//url||||||||||||||||||||||||||||||||||||||||||||||||||
        await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: uid,
            })
        })
            .then((response) => response.json())
            .then(async (responseJson) => {
                // Showing response message coming from server after inserting records.
                // resolve(responseJson);
                console.log(responseJson);
                await this.setState({photouri:responseJson})
                console.log('in server response.then'+this.state.photouri[0].avatar);
                return responseJson;
            })
            .catch((error) => {
                // reject(error);
                console.log(error);
    
                return error;
        });
    }
    render() {
        return (
        <View>
            <Text> EmailVer </Text>
        </View>
        );
    }
}

export default EmailVer;
