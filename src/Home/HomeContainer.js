import React, { Component } from 'react';
import {
    View, Text,
    Dimensions,
    Image
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import EarnMoney from './EarnMoney';
import MyTasks from './MyTasks';
import PostTask from './PostTask';
import Messages from './Messages';
import ViewAllGigs from './ViewAllGigs';
import More from './More';
import Tools from './Tools';
const LazyPlaceholder = ({ route }) => (
    <View>
        <Text>Loading {route.title}…</Text>
    </View>
);
class HomeContainer extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        index: 0,
        routes: [

            
            {
                key: 'fifth', title: 'Amazon\nMarketplace', icon: <Image style={{
                    height: 19,
                    width: 19,
                }} source={require('../Logos/search.png')} />
            },
            {
                key: 'second', title: 'My Tasks\n& Offers', icon: <Image style={{
                    height: 19,
                    width: 19,
                }} source={require('../Logos/list.png')} />
            },
            // {
            //     key: 'third', title: 'Post task', icon: <Image style={{
            //         height: 19,
            //         width: 19,
            //     }} source={require('../Logos/addpost.png')} />
            // },
            {
                key: 'first', title: 'Amazon\nExperts', icon: <Image style={{
                    height: 19,
                    width: 19,
                }} source={require('../Logos/tools2.png')} />
            },
            {
                key: 'fourth', title: 'Messages', icon: <Image style={{
                    height: 19,
                    width: 19,
                }} source={require('../Logos/message.png')} />
            },
           
            {
                key: 'sixth', title: 'Store', icon: <Image style={{
                    height: 18,
                    width: 18,
                }} source={require('../Logos/tools2.png')} />
            },
        ],
    }


    componentDidMount = async () => {

        const value = await AsyncStorage.getItem('userID')
        const gig = new ViewAllGigs();
        gig.navigate_data(this.props.navigation, value);
    }
    _renderLazyPlaceholder = ({ route }) => <LazyPlaceholder route={route} />;
    render() {
        return (
            <View style={{ flex: 1 }}>
                <TabView
                    // lazy
                    tabBarPosition='bottom'
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: ViewAllGigs,
                        second: MyTasks,
                        // third: PostTask,
                        fourth: Messages,
                        fifth: EarnMoney,
                        sixth: Tools,
                        
                    })}
                    // renderScene={({route})=>{
                    //     switch (route.key) {
                    //         case 'first':
                    //             return <EarnMoney/>;
                    //         case 'second':
                    //             return <MyTasks/>;
                    //         case 'third':
                    //             return <PostTask/>;
                    //         case 'fourth':
                    //             return <Messages/>;
                    //         case 'fifth':
                    //             return <More/>;
                    //         default:
                    //             return null;
                    //     }
                    // }}
                    // renderLazyPlaceholder={this._renderLazyPlaceholder}
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ width: Dimensions.get('window').width }}
                    renderTabBar={props => (
                        <TabBar
                            {...props}
                            indicatorStyle={{
                                backgroundColor: "#fff",
                                height: 2,
                            }}
                            style={{ backgroundColor: "#32a84e", width: '100%' }}
                            // scrollEnabled={true}
                            renderIcon={({ route, focused, color }) => (
                                //   <Icon name={"images"} color="#fff" />
                                <View style={{ paddingBottom: route.key === 'second' || route.key === 'fourth' || route.key === 'sixth'  ? 6 : 0 }}>{route.icon}</View>
                            )}
                            renderLabel={({ route, focused, color }) => (
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontSize: 8,
                                        width: '100%',
                                        textAlign:"center"
                                    }}
                                >
                                    {route.title}
                                </Text>
                            )}
                        />
                    )}
                />
            </View>
        );
    }
}

export default HomeContainer;
