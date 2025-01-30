import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import WorldClockScreen from './screens/WorldClockScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App(): JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <WorldClockScreen />
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;