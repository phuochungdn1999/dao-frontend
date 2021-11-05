import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Row, Typography } from 'antd';

import { pages } from '../../../';

import style from './Home.module.scss';

import logoMoon from './background-layout.svg'


const { Title } = Typography;

const Home = ({ t }) => {
  return (
    
    <Row className={style.container} justify="center" align="middle">

          <img className="logoMoon" src={logoMoon} alt="logoMoon"/>

           
           
          
          <h1>   A Cross-Chain DeFi Aggregator Platform </h1>


          
          <h2>  YearnAgnostic Finance is a token-based ecosystem, and the underline token is YFIAG Token. </h2>
          
          
         
          {pages.filter(({ displayOnHome }) => !!displayOnHome).map(({ path, icon, title, visible }) => (
            visible && (
              
         
              <NavLink className={style.item} exact key={path} to={path}>
                  
                  <h3>Go to Vaults</h3>
                  
              </NavLink>
            
           
        )
        
      ))}

      
    </Row>
    


  );
};

Home.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation()(Home);
