import { Client } from '../models';
import './ClientCard.scss';

const ClientCard = ({ name, email, phone }: Client) => { // typically called props
  // const { name, email, phone } = clients; -> the above destructuring is the same as this
  
  return (
    <div>
      <h1>Client Card</h1>
        <div className="client-card">
            <p>{name}</p>
            <p>{email}</p>
            <p>{phone}</p>
        </div>
    </div>
  );
};

export default ClientCard;