import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

class AddPackages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Skill_Id: '',
            package_two_state: false,
            package_three_state: false,
            title_state: '',
            pkg_one_details_state: '',
            pkg_two_details_state: '',
            pkg_three_details_state: '',
            pkg_one_price_state: '',
            pkg_two_price_state: '',
            pkg_three_price_state: '',
        };
    }

    async componentDidMount() {

        var Skill_id = this.props.navigation.getParam('Skill_Id', '0');

        this.setState({ Skill_Id: Skill_id })
        // alert(Skill_id);

    }

    async sendSkills() {

        if (this.state.title_state === '') {
            alert("Please Enter title");

        }
        else if (this.state.pkg_one_details_state === '') {
            alert("Please Enter Details");

        }
        else if (this.state.pkg_one_price_state === '') {
            alert("Please Enter Price");

        }
        else {

            // alert(this.state.pkg_two_details_state)

            this.props.navigation.navigate("AddRequirement"
                ,
                {
                    Skill_Id: this.state.Skill_Id,
                    package_title: this.state.title_state,
                    package_one_details: this.state.pkg_one_details_state,
                    package_one_price: this.state.pkg_one_price_state,
                    package_two_details: this.state.pkg_two_details_state,
                    package_two_price: this.state.pkg_two_price_state,
                    package_three_details: this.state.pkg_three_details_state,
                    package_three_price: this.state.pkg_three_price_state,

                }
            )


        }
        //  else {
        // this.props.navigation.navigate("AddRequirement"
        // )

        // }



    }

    add_package_two = () => {
        this.setState({ package_two_state: true })
    }
    remove_package_two = () => {
        this.setState({ package_two_state: false })
    }
    add_package_three = () => {
        this.setState({ package_three_state: true })
    }
    remove_package_three = () => {
        this.setState({ package_three_state: false })
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={{ marginHorizontal: 15, flex: 1, }}>



                    <View style={{ flex: 4 }}>
                        <ScrollView>


                            <TextInput
                                style={{ backgroundColor: "#fff", height: 50, marginTop: 50, paddingLeft: 10 }}
                                placeholder="Title"
                                onChangeText={text => this.setState({ title_state: text })}
                                value={this.state.title_state}></TextInput>

                            <Text style={{ fontSize: 16, marginTop: 20 }}>Package 1</Text>

                            <TextInput
                                style={{ backgroundColor: "#fff", marginTop: 10, paddingLeft: 10 }}
                                placeholder="Details"
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={text => this.setState({ pkg_one_details_state: text })}
                                value={this.state.pkg_one_details_state}
                            ></TextInput>

                            <TextInput
                                style={{ backgroundColor: "#fff", height: 50, marginTop: 10, paddingLeft: 10, width: "30%" }}
                                placeholder="Price"
                                keyboardType="numeric"
                                onChangeText={text => this.setState({ pkg_one_price_state: text })}
                                value={this.state.pkg_one_price_state}
                            ></TextInput>


                            {this.state.package_two_state ?
                                (
                                    <View>
                                        <Text style={{ fontSize: 16, marginTop: 20 }}>Package 2</Text>
                                        <TextInput
                                            style={{ backgroundColor: "#fff", marginTop: 10, paddingLeft: 10 }}
                                            placeholder="Details"
                                            multiline={true}
                                            numberOfLines={4}
                                            onChangeText={text => this.setState({ pkg_two_details_state: text })}
                                            value={this.state.pkg_two_details_state}
                                        ></TextInput>

                                        <TextInput
                                            style={{ backgroundColor: "#fff", height: 50, marginTop: 10, paddingLeft: 10, width: "30%" }}
                                            placeholder="Price"
                                            keyboardType="numeric"
                                            onChangeText={text => this.setState({ pkg_two_price_state: text })}
                                            value={this.state.pkg_two_price_state}
                                        ></TextInput>
                                    </View>
                                ) : null}


                            {this.state.package_three_state ?
                                (
                                    <View>
                                        <Text style={{ fontSize: 16, marginTop: 20 }}>Package 3</Text>
                                        <TextInput
                                            style={{ backgroundColor: "#fff", marginTop: 10, paddingLeft: 10 }}
                                            placeholder="Details"
                                            multiline={true}
                                            numberOfLines={4}
                                            onChangeText={text => this.setState({ pkg_three_details_state: text })}
                                            value={this.state.pkg_three_details_state}
                                        ></TextInput>

                                        <TextInput
                                            style={{ backgroundColor: "#fff", height: 50, marginTop: 10, paddingLeft: 10, width: "30%", marginBottom: 20 }}
                                            placeholder="Price"
                                            keyboardType="numeric"
                                            onChangeText={text => this.setState({ pkg_three_price_state: text })}
                                            value={this.state.pkg_three_price_state}
                                        ></TextInput>
                                    </View>
                                ) : null}



                        </ScrollView>



                    </View>




                    <View style={{ flex: .6, flexDirection: "row" }}>

                        <View style={{ flex: .7, marginBottom: 5 }}>

                            {this.state.package_two_state === false && this.state.package_three_state === false ?
                                (
                                    <View style={{ alignItems: "flex-start" }}>

                                        <TouchableOpacity style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: 30,
                                            backgroundColor: '#32a84e',
                                            alignItems: "center",
                                            justifyContent: "center",
                                            alignSelf: "flex-start",
                                            marginLeft: 7
                                            // marginBottom: 20

                                        }}
                                            onPress={() => this.add_package_two()}>
                                            <Text style={{ color: "#fff", fontSize: 45, textAlign: "center", alignSelf: "center" }}>+</Text>
                                        </TouchableOpacity>

                                        <Text style={{ fontSize: 12, marginTop: 5, textAlign: "center", marginLeft: 7 }}>Add{"\n"}Package</Text>

                                    </View>


                                ) : null}
                            {this.state.package_three_state === false ?
                                (
                                    <View style={{ alignItems: "flex-start" }}>
                                        <TouchableOpacity style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: 30,
                                            backgroundColor: '#32a84e',
                                            alignItems: "center",
                                            justifyContent: "center",
                                            alignSelf: "flex-start",
                                            marginLeft: 7}}
                                            onPress={() => this.add_package_three()}>
                                            <Text style={{ color: "#fff", fontSize: 45, textAlign: "center", alignSelf: "center" }}>+</Text>
                                        </TouchableOpacity>
                                        <Text style={{ fontSize: 12, marginTop: 5, textAlign: "center", marginLeft: 7 }}>Add{"\n"}Package</Text>

                                    </View>

                                ):null


                            }

                        </View>




                        <View style={{ flex: .7, marginBottom: 5 }}>

                            {this.state.package_two_state === true && this.state.package_three_state === false ?
                                (

                                    <View style={{ alignItems: "flex-start" }}>


                                        <TouchableOpacity style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: 30,
                                            backgroundColor: 'red',
                                            alignItems: "center",
                                            justifyContent: "center",
                                            alignSelf: "flex-start",
                                            // marginBottom: 20

                                        }}
                                            onPress={() => this.remove_package_two()}>
                                            <Text style={{ color: "#fff", fontSize: 45, textAlign: "center", alignSelf: "center", marginBottom: 7 }}>-</Text>
                                        </TouchableOpacity>

                                        <Text style={{ fontSize: 12, marginTop: 5, textAlign: "center", marginLeft: 2 }}>Remove{"\n"}Package</Text>



                                    </View>


                                ) :
                                null}

                            {this.state.package_three_state ?

                                (

                                    <View style={{ alignItems: "flex-start" }}>


                                        <TouchableOpacity style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: 30,
                                            backgroundColor: 'red',
                                            alignItems: "center",
                                            justifyContent: "center",
                                            alignSelf: "flex-start",


                                            // marginLeft: 15,

                                        }}
                                            onPress={() => this.remove_package_three()}>
                                            <Text style={{ color: "#fff", fontSize: 45, textAlign: "center", alignSelf: "center", marginBottom: 7 }}>-</Text>
                                        </TouchableOpacity>

                                        <Text style={{ fontSize: 12, marginTop: 5, textAlign: "center", marginLeft: 2 }}>Remove{"\n"}Package</Text>

                                    </View>


                                ) : null}




                        </View>


                        <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-end" }}>
                            <TouchableOpacity onPress={() => this.sendSkills()}
                                style={{ marginBottom: 10 }}>
                                <View style={{ backgroundColor: '#32a84e', borderRadius: 5, height: 35, width: 150, alignSelf: 'center', marginTop: 7 }}>
                                    <Text style={{ alignSelf: 'center', marginTop: 5, fontSize: 18, color: 'white' }}>
                                        Next
                                </Text>
                                </View>
                            </TouchableOpacity>
                        </View>





                    </View>

















                </View>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F2",

    },
    header: {
        padding: 30,
        alignItems: 'center',
        backgroundColor: "#32a84e",
    },
    headerTitle: {
        fontSize: 30,
        color: "#FFFFFF",
        marginTop: 10,
    },
    name: {
        fontSize: 22,
        color: "#FFFFFF",
        fontWeight: '600',
    },
    postContent: {
        flex: 1,
        padding: 30,
    },
    postTitle: {
        fontSize: 26,
        fontWeight: '600',
    },
    postDescription: {
        fontSize: 16,
        marginTop: 10,
    },
    tags: {
        color: '#00BFFF',
        marginTop: 10,
    },
    date: {
        color: '#696969',
        marginTop: 10,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 35,
        borderWidth: 4,
        borderColor: "#00BFFF",
    },
    profile: {
        flexDirection: 'row',
        marginTop: 20
    },
    name: {
        fontSize: 22,
        color: "#00BFFF",
        fontWeight: '600',
        alignSelf: 'center',
        marginLeft: 10
    },
    shareButton: {
        marginTop: 10,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: "#00BFFF",
    },
    shareButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
    }
});
export default AddPackages;