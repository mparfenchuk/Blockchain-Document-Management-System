import decode from 'jwt-decode';
import * as moment from 'moment';

const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    try {
      const { exp } = decode(token);
      if (moment().unix() > exp) {
        return false;
      }
    } catch (err) {
      return false;
    }
  
    return true;
};

export default isAuthenticated
