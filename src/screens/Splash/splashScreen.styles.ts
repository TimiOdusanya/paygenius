import { StyleSheet } from 'react-native';
import { GAP_LOGO_TO_TEXT } from './constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgSvg: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: GAP_LOGO_TO_TEXT,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontSize: 28,
    color: '#FFFFFF',
  },
});
