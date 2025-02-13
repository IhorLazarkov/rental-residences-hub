import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './buttons.css';
import { Provider } from 'react-redux';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';
import { Modal, ModalProvider } from './context/Modal';

import configureStore from './store';
import OpenModalButton from './components/OpenModalButton/OpenModalButton';
import Feedback from './components/Feedback';
const store = configureStore();

if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <App />
        <Modal />
        <OpenModalButton
          buttonText="feedback"
          className="secondary"
          style={{
            position: "absolute",
            top: "calc(100vh / 2)",
            left: "-30px",
            transform: "rotate(90deg)",
            padding: "10px",
            border: "1px solid rgb(0, 92, 230)",
            borderRadius: "10px 10px 0 0",
            backgroundColor: "rgb(0, 92, 230)",
            color: "white",
            cursor: "pointer",
            fontWieght: "700"
          }}
          onButtonClick={() => { }}
          modalComponent={<Feedback visible={true} />}
        />
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);
