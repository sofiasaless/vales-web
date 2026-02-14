import { ThemeConfig, theme } from 'antd';

export const antdTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#2db8a4',
    colorBgContainer: '#191d27',
    colorBgElevated: '#1e2330',
    colorBgBase: '#111827',
    colorBgLayout: '#111827',
    colorText: '#f0f4f8',
    colorTextSecondary: '#7a8494',
    colorTextTertiary: '#5a6474',
    colorBorder: '#2b303b',
    colorBorderSecondary: '#232835',
    colorSuccess: '#2db86a',
    colorWarning: '#f2a60d',
    colorError: '#d93636',
    borderRadius: 12,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: 14,
    colorLink: '#2db8a4',
    colorFill: '#272c36',
    colorFillSecondary: '#232835',
    controlHeight: 40,
  },
  components: {
    Button: {
      primaryShadow: '0 0 20px rgba(45, 184, 164, 0.15)',
      borderRadius: 8,
    },
    Card: {
      borderRadiusLG: 12,
    },
    Input: {
      borderRadius: 8,
    },
    Modal: {
      borderRadiusLG: 12,
    },
    Select: {
      borderRadius: 8,
    },
  },
};
