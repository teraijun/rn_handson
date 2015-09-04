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

// var QIITA_URL = "https://qiita.com/api/v2/tags/reactjs/items";
var NIKKEI_URL = "http://mw323.nikkei.com/data/news/webkan?volume=10";
var NIKKEI_BASE_ARTICLE_URL = "http://mw323.nikkei.com/data/article/";

// ベースのUINavigationControllerに該当するもの
var ReactNikkeiNavigator = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.navigator}
        initialRoute={{
          component: ReactNikkeiList,
          title: 'ReactNikkei',
      }}/>
    );
  }
})

// 記事一覧リスト
var ReactNikkeiList = React.createClass({
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
          Loading movies...
        </Text>
      </View>
    );
  },

  renderItem: function(item, sectionID, rowID) {
    var image = item.index_images && item.index_images.length > 0 && item.index_images[0].image_size.PN1.image_path ? item.index_images[0].image_size.PN1.image_path : '';
    if (image.length > 0) {
      return (
        <TouchableWithoutFeedback  onPress={() => this.onPressed(item)}>
        <View style={styles.container}>
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.name}>{item.display_time}</Text>
          </View>
          <Image
            source={{uri: image}}
            style={styles.thumbnail}/>
        </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <TouchableWithoutFeedback  onPress={() => this.onPressed(item)}>
        <View style={styles.container}>
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.name}>{item.display_time}</Text>
          </View>
        </View>
        </TouchableWithoutFeedback>
      );
    }
  },

  // API呼び出し
  fetchData: function() {
    fetch(NIKKEI_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          items: this.state.items.cloneWithRows(responseData.articles),
          loaded: true,
        });
      })
      .done();
  },

  //セルのタッチイベント
  onPressed: function(item) {
    this.props.navigator.push({
      title: item.title,
      component: ReactNikkeiItemView,
      passProps: { 
        kiji_id: item.kiji_id
      }
    })
  }
});

// 記事閲覧用
var ReactNikkeiItemView = React.createClass({
  getInitialState: function() {
    return {
      items: {},
      kiji_id: this.props.kiji_id,
      loaded: false
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
      <View style={styles.container}>
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{this.state.items.title}</Text>
          <Text style={styles.name}>{this.state.items.body}</Text>
        </View>
      </View>
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading movies...
        </Text>
      </View>
    );
  },

  // API呼び出し
  fetchData: function() {
    fetch(NIKKEI_BASE_ARTICLE_URL + this.state.kiji_id)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          items: responseData.article,
          loaded: true,
        });
      })
      .done();
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
  articleView: {

  },
  article_title:{

  }
});

AppRegistry.registerComponent('rn_handson', () => ReactNikkeiNavigator);