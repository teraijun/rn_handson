/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  NavigatorIOS,
  TouchableWithoutFeedback,
  WebView
} = React;

var EVENT_URL = "http://sf.funcheap.com/toplytics.json";

// ベースのUINavigationControllerに該当するもの
var ReactEventNavigator = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.navigator}
        initialRoute={{
          component: ReactEventList,
          title: 'Most Popular Upcoming Events in SF',
      }}/>
    );
  }
})

// 記事一覧リスト
var ReactEventList = React.createClass({
  getInitialState: function() {
    return {
      items: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.items}
        renderRow={this.renderItem}
        style={styles.listView}/>
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading ...
        </Text>
      </View>
    );
  },

  renderItem: function(item, sectionID, rowID) {
    return (
      <TouchableWithoutFeedback  onPress={() => this.onPressed(item)}>
      <View style={styles.container}>
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.name}>{item.views}</Text>
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  },

  // API呼び出し
  fetchData: function() {
    fetch(EVENT_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          items: this.state.items.cloneWithRows(responseData.2days),
          loaded: true,
        });
      })
      .done();
  },

  //セルのタッチイベント
  onPressed: function(item) {
    this.props.navigator.push({
      title: item.title,
      component: ReactEventItemView,
      passProps: { url: item.permalink }
    })
  },
});

// 記事閲覧用のWebView
var ReactEventItemView = React.createClass({
  render: function() {
    return (
      <WebView
        url={this.props.url}/>
    )
  }
});

// 各種デザイン要素
var styles = StyleSheet.create({
  navigator: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    margin: 8,
    textAlign: 'left',
  },
  name: {
    fontSize: 12,
    margin: 8,
    textAlign: 'left',
  },
  thumbnail: {
    width: 80,
    height: 80,
    margin: 2,
  },
  listView: {
    backgroundColor: '#FFFFFF',
  },
});

AppRegistry.registerComponent('rn_handson', () => ReactEventNavigator);