import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import './styles/fonts.css';
import "./styles/index.css";
import './styles/bootstrap.theme.css';
import "./styles/Palette.css";
import "bootstrap/dist/css/bootstrap.css";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

ReactDOM.render(
    <I18nextProvider
       i18n={ i18n }
       initialI18nStore={window.initialI18nStore}
       initialLanguage={window.initialLanguage}
     >
      <App />
    </I18nextProvider>,
    document.getElementById('root')
);
