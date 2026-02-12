import { Client } from '../models';
import './ClientCard.scss';

const ClientCard = ({ name, email, phone, imageUrl }: Client) => {
  
  return (
    <div>
      <h1>Client Card</h1>
        <div className="client-card">
            <p>{ name }</p>
            <p>{ email }</p>
            <p>{ phone }</p>
            <img src={ imageUrl } alt="Image Logo" />
        </div>
    </div>
  );
};

export default ClientCard;