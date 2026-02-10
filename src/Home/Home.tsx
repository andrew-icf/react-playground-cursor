import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientCard from './ClientCard/ClientCard';
import clients from '../../assets/data/clients.json';
import './Home.scss';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const numberOfClients = clients.clients.length
  const [count, setCount] = useState<number>(numberOfClients)

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleAddClient = () => { 
    setCount(count + 1);
  }

  return (
    <div className="home-container">
      <header>
        <h1>Welcome Home!</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <main>
        <p>You have successfully logged in.</p>
      </main>
      <div className="cards-container">
      <ClientCard {...clients.clients[0]}/>
      <ClientCard {...clients.clients[1]}/>
      <ClientCard {...clients.clients[2]}/>
      </div>
      <div>
        <button onClick={handleAddClient}>Add a Client</button>
        <p>Client count {count}.</p>
      </div>
    </div>
  );
};

export default Home;
