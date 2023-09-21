/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme, TouchableOpacity,
  View,
  TextInput,
  FlatList,
} from 'react-native';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          username: '',
          password: '',
          isLoggedIn: false,
          showPassword: false,
          list: [],
          task: '',
        }
      };
    async componentDidMount(){
    const list = await AsyncStorage.getItem('list');
    if(list){
      this.setState({list: JSON.parse(list)})}
    };
    handleUserNameChange = (text) => {
      this.setState({ username: text });
    };
    handlePasswordChange = (text) => {
      this.setState({ password: text });
    };
    handleLogin = () => {
      const { username, password } = this.state;
      if (username === 'admin' && password === '1234') {
        this.setState({ isLoggedIn: true });
        this.props.navigation.navigate('Home');
      } else {
        alert('Invalid username or password');
      }
    };
    togglePasswordVisibility = () => {
      this.setState((prevState) => ({
        showPassword: !prevState.showPassword,
      }));
    };
  
  render() {
    
    
    return (
      <SafeAreaView style={styles.container} >
        <View  > 
          <Text style={styles.title} >Login</Text>
        </View>
        <View style={{alignItems:'center'}}>
          <View>
            <Text style={styles.labelInput}>Enter your user name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={this.state.username}
              onChangeText={this.handleUserNameChange}
            />
          </View>
          <View>
            <Text style={styles.labelInput}>Enter your password:</Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={this.state.password}
                onChangeText={this.handlePasswordChange}
                secureTextEntry={!this.state.showPassword} // Ẩn/hiện mật khẩu
              />
            <TouchableOpacity >
              <Text style={styles.labelInput} onPress={this.togglePasswordVisibility}>Click to Show Password</Text> 
            </TouchableOpacity>
          </View>  
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText} onPress={this.handleLogin}>LOGIN</Text>
            </TouchableOpacity>
        </View>


      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  title:{
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: 'black',
    marginBottom: 50,
  },
  labelInput:{
    fontSize: 18,
    marginTop: 10,
    color: 'black',
  },
  input:{
    padding: 10,
    borderRadius: 5, // Border radius
    borderBottomColor: 'black',
    borderWidth: 1, 
    width: 300, 
    height: 40,
  },
  button:{
  
   width: 300, 
   height: 40, 
   borderWidth: 1, 
   borderColor: '#FFA500',
   textAlign: 'center',
   justifyContent: 'center',
   borderRadius: 5, // Border radius
   backgroundColor: '#CD853F', 
   color: 'black'
  },
  buttonText:{
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    
    textAlignVertical: 'center',

  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEFD5'
  },
 
});

export default Login;
