Redux na prática

Depois de criar um projeto usando npx react-native init logo em seguida instalo o redux usando npm redux react-redux --save.  Antes de começar a escrever códigos vamos organizar nosso projeto com diretórios específicos. Vamos criar o nosso src e dentro dele os seguintes diretórios components, images, navigators, reducers, screens. Não necessariamente precisa  ter esses mesmos diretórios, é apenas um exemplo de organização.

Reducers 

Pronto, agora que já organizamos nosso projeto vamos começar a codar, e como esse projeto é focado em redux vamos direto para criação do nosso primeiro reducer. Reducers são funções puras que retornam sempre um valor previsível e recebem uma action que vai direcionar ao que o reducer fará, podemos criar vários tipos de reducers, cada um específico para controle de um tipo de informação. Por fim os reducers são enviados para store. Na pasta reducers vamos criar nosso primeiro reducer ( userReducer.js )

const initialState = {
    name: '',
    email: ''
};
 
export default (state = initialState, action) => {
    switch(action.type){
        case 'SET_NAME':
            return {...state, name:action.payload.name};
            break;
        case 'SET_EMAIL':
            return {...state, email:action.payload.email};
            break;
    }
    return state;
}

O código cria e exporta uma função que será usada como reducer e como o reducer precisa retornar um dado previsível então foi criado um state inicial, pois caso o reducer não altere nenhum dado, ou receba uma action errada ele pelo menos vai retornar o state inicial e não um undefined.

Pronto, já temos nosso primeiro reducers e podemos ter dezenas de reducers então por causa disso precisamos criar algo que organize melhor esses dados e para isso existe o combine reducer.

Combine Reducers

O combine reducer serve para que a gente possa usar um único arquivo para levar os reducers para store do nosso Redux para não precisar importar dezenas de reducers. Encontramos essa funcionalidade no nosso próprio Redux. 

Então para isso vamos criar um novo arquivo na pasta reducers e chamá-lo de index.js pois assim caso não passamos nenhum nome quando formos importar os reducers, automaticamente o index.js será chamado por padrão.

O arquivo é bem simples, primeiro importamos essa funcionalidade, importamos nossos reducers que serão adicionados ao combine e usamos o combineReducers para retornar um objeto com nossos reducers, podemos passar um nome e um valor como qualquer objeto.

import { combineReducers } from 'redux';
import userReducer from './userReducer';
 
export default combineReducers({
    userReducer: userReducer
});

Agora que já temos nosso reducers e até um combineReducers para organizar as coisas precisamos colocá-los dentro da store que é como se fosse uma caixa onde conecta toda nossa estrutura redux.

Store

Como a store é a “caixa” principal de toda nossa estrutura redux vamos criar um arquivo na raiz de src e criar a store la para ser mais facilmente acessado por qualquer arquivo. No arquivo Store.js tudo que precisamos fazer é importar createStore do redux, importar os Reducers do nosso arquivo de combineRedux, criar uma variável store definindo como createStore e passado como parâmetro nossos Reducers e por fim exportar a store.

import { createStore } from 'redux'; 
import Reducers from './reducers/index.js';
const store = createStore(Reducers);
export default store;
Pronto, agora já criamos nosso reducer, organizamos com combineRedux e enviamos para nossa store. O que precisamos agora é fazer com que todos nossos componentes possam acessar essa store e consequentemente ter acesso ao state da nossa aplicação, para isso vamos precisar de um Provider.

Provider

Provider é um tipo de super componente que engloba todos os outros componentes e todos esses componente terão acesso a store depois de conectados. Então o arquivo onde queremos acessar a store/state vai ter que esta de alguma forma dentro do provider, para isso vamos importá-lo do react-redux e tudo que precisamos é chamá-lo como um um ponente e passar a store como parâmetro.

Normalmente o Provider só precisa englobar o componente principal:

import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
 
import { Provider } from 'react-redux';
import store from './src/Store';
 
const App = () => {
  return (
    <Provider store={store}>
      <Login />
    </Provider>
  );
};
 
const styles = StyleSheet.create({
 
});
 
export default App;


Ok, agora já temos reducers organizados, inseridos na store fornecido a um provider, tudo que precisamos fazer agora é conectar os componentes que estão dentro de provider e pronto. Neste caso apenas o componente de Login.

Connect

O Connect vai fazer com que todos componentes dentro do Provider tenham acesso ao state/store podendo ler ou alterar seus valores. Para fazer isso precisamos importar connect de react-redux. 

Quando um componente é conectado à store ele não pode ser exportado diretamente, a partir desse momento quem tem que ser exportado é o connect e ele recebe o componente que será exportado junto. Então se você está exportando algum componente remova a exportação e faça o seguinte: export default connect()(componente); . Isso mesmo, não estranhe, o connect recebe duas funções e a segunda é nosso componente, se o nome dele é Álbum (por exemplo) então use esse nome como parâmetro da segunda função.

A primeira função receber vários parâmetros mas as principais são as duas primeiras, que são mapStateToProps e mapDispatchToProps, a primeira é responsável por ler os dados do state e a segunda para alterar os dados. Lembre-se que como desse parâmetros já informam o connect vai deixar todos esses dados disponíveis através das props do componente passando como parâmetro da segunda função do connect. 

export default connect(mapStateToProps, mapDispatchToProps)(Login);

No exemplo acima o componente Login receberá em suas props funções e propriedades desses dois parâmetros do connect, mas antes disso vamos criar o “corpo” desses dois parâmetros. 

Vamos começar por mapStateToProps, é uma função que retorna um objeto, essa função recebe o state da estrutura redux como parâmetro e pode acessar seus dados, então quer dizer que podemos retornar um objeto que retorna alguma informação do state. Um código de exemplo seria: 

const mapStateToProps = (state) => {
  return {
    name: state.userReducer.name,
    email: state.userReducer.email
  }
}

No código acima temos uma função que recebe o state do redux como parâmetro, retorna um objeto acessando o state, dentro do state podemos acessar os reducers da store e neste caso acessamos userReducer e depois seus valores nome e email armazenando nas chaves name e email que podem ser acessados como props no componente passado no connect.
mapDispatchToProps

Esse parâmetro do connect é um pouco mais complicado, entretanto é com ele que vamos poder alterar dados do state do redux, então vamos prestar bem atenção.

mapDispatchToProps é uma função que recebe dispatch como parâmetro que também é uma função e retorna um objeto, o itens deste objeto serão outras funções, cada uma com propósito. As funções do objeto de mapStateToProps retornam um dispatch que como já informei é outra função que retorna um objeto, nesse objeto temos um type e um payload, o type é uma string que deve ser igual ao type esperado no reducer e dependendo do type passado o reducer vai fazer algo específico, o payload é um objeto com informações que podemos passar para o reducers fazer alguma coisa.

const mapDispatchToProps = (dispatch) => {
  return {
    setName: (name) => dispatch({type:'SET_NAME', payload:{ name } }),
    setEmail: (email) => dispatch({type:'SET_EMAIL', payload:{ email } })
  };
}

No código acima podemos ver que temos um mapStateToProps que recebe um dispatch e retorna um objeto com duas chaves setName e setEmail as chaves são funções que retornam o dispatch com objetos que têm chaves type e payload.

Como mapDispatchToProps é um parâmetro do connect então podemos acessá-lo no componente conectado através das props, neste caso as props serão as chaves dos objetos retornados setName e setEmail, como são duas funções que recebem parâmetro então podemos usá-los da seguinte maneira:

const Login = (props) => {
  props.setName(Dhenyson)
  props.setEmail('dhenysonjhean@gmail.com')
 
  return (
      <View>
            <Text>Name: {props.name}</Text>
            <Text>Email: {props.email}</Text> 
      </View>   
  );
};
O código completo do App conectado é assim: 

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
 

Mas lembre-se que isso só vai funcionar se esse componente já estiver dentro de provider que neste exemplo já o colocamos no arquivo App.js
