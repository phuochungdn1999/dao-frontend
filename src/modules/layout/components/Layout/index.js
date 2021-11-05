import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { Layout as LayoutContainer } from 'antd';
import cx from 'classnames';
import logoMedium from './medium.svg';
import logoTelegram from './telegram.svg';
import logoTwitter from './twitter.svg';
import logoGithub from './github.svg';


import { Header } from '../../';

import style from './Layout.module.scss';

const { Content } = LayoutContainer;


const Layout = ({ location, children }) => {
  return (
    
    
    <LayoutContainer
      className={style.container}
    >
      
      {location.pathname !== '' && <Header />}
      
      <Content
        className={cx(style.container__content, {
          [style.container__content_inner]: location.pathname !== ''
        })}
      >

        {children}
      </Content>
      
      

      
      <footer>
        
        
      <a class="button" href="https://yearnagnostic.medium.com/">  <img class="img" src={logoMedium}/></a>

      <a class="button" href="https://t.me/yearnagnostic"> <img class="img" src={logoTelegram}/></a>

      <a class="button" href="https://twitter.com/yearnagnostic"> <img class="img" src={logoTwitter}/></a>

      <a class="button" href="https://github.com/Yearn-Agnostic"> <img class="img" src={logoGithub}/> </a>



          
        

      </footer>
      <h2 className="template"> yAgnostic </h2>


    </LayoutContainer>
    


  );
}

Layout.propTypes = {
  location: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default withRouter(Layout);
