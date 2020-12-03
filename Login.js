import React from 'react';
import {Text, View} from 'react-native';

import { connect } from 'react-redux';

const Login = (props) => {
  props.setName('jhean')
  props.setEmail('jhean@gmail.com')

  return (
      <View>
            <Text>Name: {props.name}</Text>
            <Text>Email: {props.email}</Text> 
      </View>
      
  );
};

const mapStateToProps = (state) => {
  return {
    name: state.userReducer.name,
    email: state.userReducer.email
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setName: (name) => dispatch({type:'SET_NAME', payload:{ name } }),
    setEmail: (email) => dispatch({type:'SET_EMAIL', payload:{ email } })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
