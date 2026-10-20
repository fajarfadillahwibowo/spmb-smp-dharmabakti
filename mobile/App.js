import React from 'react';
import { StyleSheet, View, Platform, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { registerRootComponent } from 'expo';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const defaultMetrics = initialWindowMetrics || {
  frame: { x: 0, y: 0, width: 440, height: 850 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>⚠️ Terjadi Kendala Render</Text>
          <Text style={styles.errorText}>
            {this.state.error?.message || this.state.error?.toString()}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={defaultMetrics} style={styles.container}>
      <ErrorBoundary>
        <AuthProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </AuthProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0F172A',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0F172A',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 10,
  },
  errorText: {
    color: '#F87171',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
});
