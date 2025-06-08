import React, { useState, useEffect } from 'react';

const SkipCard = ({ size, price, period, roadAllowed, imageUrl, heavyWaste, transportCost, costPerTonne, colors, onSelect }) => {
  return (
    <div className="card">
      <div className="content">
        <div className="back">
          <div className="tools">
            <div className="circleTop">
              <span className="red box"></span>
            </div>
            <div className="circleTop">
              <span className="yellow box"></span>
            </div>
            <div className="circleTop">
              <span className="green box"></span>
            </div>
          </div>
          <div className="back-content">
            <span className="ribbon-badge">
              <span className="ribbon-text">{size} Yards Skip</span>
            </span>
            <img
              src={imageUrl}
              alt={`${size} skip`}
              style={{
                width: '360px',
                height: '240px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginTop: '2px',
                marginBottom: '15px',
                maxWidth: '95%',
                maxHeight: '65%'
              }}
            />
            <div className="back-details">
              <p className='price-info'>£{price}</p>
              <p className='hire-info'>Hire period: {period} days</p>
              <p className='road-info'>Road allowed: {roadAllowed ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
        <div className="front">
          <div className="img">
            <div className="circle"></div>
            <div className="circle" id="bottom"></div>
          </div>
          <div className="front-content">
            <small className="badge">{size} Yards Skip</small>
            <div className="descriptions">
              <div className="skip-info">
                <p className="info-item">Heavy waste allowed: {heavyWaste ? 'Yes' : 'No'}</p>
                <p className="info-item">Transport cost: {transportCost ? `£${transportCost}` : 'N/A'}</p>
                <p className="info-item">Cost per tonne: {costPerTonne ? `£${costPerTonne}` : 'N/A'}</p>
              </div>
              <button className="select-button" onClick={() => onSelect({ size, price, period })}>
                Select This Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkipCards = () => {
  const [skips, setSkips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkip, setSelectedSkip] = useState(null);

  const colors = [
    {
      primary: "#ffbb66",
      secondary: "#ff2233",
      accent: "#ff8866"
    },
    {
      primary: "#66bbff",
      secondary: "#3322ff",
      accent: "#6688ff"
    },
    {
      primary: "#66ff88",
      secondary: "#22ff33",
      accent: "#88ff66"
    }
  ];

  const handleSkipSelect = (skip) => {
    setSelectedSkip(skip);
  };

  const handleBack = () => {
    setSelectedSkip(null);
  };

  const handleContinue = () => {
    console.log('Continue with selected skip:', selectedSkip);
    // Ici vous pouvez ajouter la logique pour continuer avec le skip sélectionné
  };

  useEffect(() => {
    const fetchSkips = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transformer les données de l'API vers le format attendu par les cartes
        const transformedSkips = data.map((skip, index) => {
          const totalPrice = skip.price_before_vat + (skip.price_before_vat * skip.vat / 100);
          
          return {
            size: skip.size,
            price: totalPrice.toFixed(2),
            period: skip.hire_period_days,
            roadAllowed: skip.allowed_on_road,
            imageUrl: `https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/${skip.size}-yarder-skip.jpg`,
            heavyWaste: skip.allows_heavy_waste,
            transportCost: skip.transport_cost,
            costPerTonne: skip.per_tonne_cost,
            colors: colors[index % colors.length]
          };
        });
        
        setSkips(transformedSkips);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching skips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkips();
  }, []);

  if (loading) {
    return (
      <div className="skip-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          color: 'white',
          fontSize: '18px'
        }}>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="skip-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          color: 'red',
          fontSize: '18px'
        }}>
          Error loading skips: {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="skip-container">
        <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Roboto+Slab:wght@700&display=swap');

          .skip-container {
            font-family: 'Montserrat', sans-serif;
            display: flex;
            flex-wrap: wrap;
            gap: 2rem;
            justify-content: center;
            padding: 2rem;
            margin-bottom:  2rem;
            min-height: 100vh;
          }

          .card {
            overflow: visible;
            width: 280px;
            height: 350px;
            cursor: grab;
          }

          .content {
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transition: transform 300ms;
            box-shadow: 0px 0px 15px 2px #000000ee;
            border-radius: 8px;
          }

          .front, .back {
            background-color: #151515;
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            border-radius: 8px;
            overflow: hidden;
          }

          .back {
            width: 100%;
            height: 100%;
            justify-content: center;
            display: flex;
            align-items: center;
            overflow: hidden;
          }

          .back::before {
            position: absolute;
            content: ' ';
            display: block;
            width: 200px;
            height: 160%;
            background: linear-gradient(90deg, transparent, rgba(255,222,89,0.2), rgba(255,222,89,0.2), rgba(255,222,89,0.2), rgba(255,222,89,0.2), transparent);
            animation: rotation_481 5000ms infinite linear;
          }

          .back-content {
            position: absolute;
            width: 99%;
            height: 99%;
            background-color: #151515;
            border-radius: 8px;
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
            padding: 20px;
            box-sizing: border-box;
          }

          /* Ribbon Badge Styles */
          .ribbon-badge {
            position: absolute;
            overflow: hidden;
            width: 150px;
            height: 150px;
            top: -10px;
            right: -10px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
          }

          .ribbon-badge::before {
            content: '';
            position: absolute;
            width: 150%;
            height: 40px;
            background-image: linear-gradient(90deg, transparent, rgba(255,222,89,0.5), rgba(255,222,89,0.5), rgba(255,222,89,0.5), rgba(255,222,89,0.5), transparent);
            transform: rotate(45deg) translateY(-20px);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 5px 10px rgba(0,0,0,0.23);
          }
         .back-details {
            text-align: left;
            padding: 0 8px;
            width: 100%;
            box-sizing: border-box;
          }

          .price-info {
            color: rgb(0 55 193 / 1);
            font-weight: 1000;
            font-size: 20px;
            padding-bottom: 5px;
          }

           .hire-info {
            color: #888;
            font-weight: normal;
            font-size: 12px;
            margin: 4px 0;
            color: white;
          }
            .road-info {
            color: #888;
            font-weight: normal;
            font-size: 10px;
            margin: 4px 0;
          }
          .ribbon-badge::after {
            content: '';
            position: absolute;
            width: 10px;
            bottom: 0;
            right: 0;
            height: 10px;
            z-index: -1;
            background-image: linear-gradient(90deg, transparent, rgba(255,222,89,0.5), rgba(255,222,89,0.5), rgba(255,222,89,0.5), rgba(255,222,89,0.5), transparent);
          }

          .ribbon-text {
            position: absolute;
            width: 150%;
            height: 40px;
            background-image: linear-gradient(90deg, transparent, rgba(255,222,89,0.5), rgba(255,222,89,0.5), rgba(255,222,89,0.5), rgba(255,222,89,0.5), transparent);
            transform: rotate(45deg) translateY(-20px);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
            font-weight: 800;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            box-shadow: 0 5px 10px rgba(0,0,0,0.23);
            font-size: 12px;
          }

          .card:hover .content {
            transform: rotateY(180deg);
          }

          @keyframes rotation_481 {
            0% {
              transform: rotateZ(0deg);
            }
            100% {
              transform: rotateZ(360deg);
            }
          }

          .front {
            transform: rotateY(180deg);
            color: white;
          }

          .front .front-content {
            position: absolute;
            width: 100%;
            height: 100%;
            padding: 15px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-sizing: border-box;
          }

          .front-content .badge {
            background-color: #00000055;
            padding: 4px 12px;
            border-radius: 12px;
            backdrop-filter: blur(2px);
            width: fit-content;
            font-size: 13px;
          }

          .tools {
            display: flex;
            align-items: center;
            padding-left: 15px;
            padding-top: 4px;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
          }

          .circleTop {
            padding: 0 10px;
          }

           .box {
            display: inline-block;
            align-items: center;
            width: 6px;
            height: 6px;
            padding: 1px;
            border-radius: 50%;
          }

          .red {
            background-color: rgb(0 55 193 / 1);
          }

          .yellow {
            background-color: #ffde59;
          }

          .green {
            background-color: #d9594c;
          }

          .descriptions {
            box-shadow: 0px 0px 15px 5px #00000088;
            width: 100%;
            padding: 15px;
            background-color: #00000099;
            backdrop-filter: blur(5px);
            border-radius: 8px;
            box-sizing: border-box;
          }

          .title {
            font-size: 14px;
            max-width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
          }

          .title-text {
            margin: 0;
            text-align: center;
          }

          .skip-info {
            margin: 10px 0;
          }

          .info-item {
            color: #ffffff88;
            margin: 4px 0;
            font-size: 11px;
            line-height: 1.3;
          }

          .select-button {
            width: 100%;
            padding: 8px 16px;
            background: linear-gradient(90deg, transparent, rgba(255, 222, 89, 0.5), rgba(255, 222, 89, 0.5), rgba(255, 222, 89, 0.5), rgba(255, 222, 89, 0.5), transparent);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 10px;
            transition: all 0.3s ease;
          }

          .select-button:hover {
            color: black;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          }

          .front .img {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }

          .circle {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background-color: rgb(0 55 193 / 1);
            position: absolute;
            filter: blur(15px);
            animation: floating 2600ms infinite linear;
          }

          #bottom {
            background-color: #d9594c;
            left: 50px;
            bottom: 20px;
            width: 150px;
            height: 150px;
            animation-delay: -800ms;
          }

          @keyframes floating {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(12px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          /* Selection Footer Styles */
          .selection-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #151515;
            color: white;
            padding: 20px;
            box-shadow: 0 -10px 20px rgba(0,0,0,0.3);
            z-index: 1000;
            border-top: 2px solid rgba(255,222,89,0.3);
          }

          .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .disclaimer {
            font-size: 20px;
            color: #888;
            line-height: 1.4;
          }

       .selected-skip-info {
          display: flex;
          align-items: center;   
          justify-content: center; 
          gap: 20px;
          text-align: center;  
        }

          .skip-title {
            font-size: 18px;
            font-weight: bold;
            color: white;
          }

          .skip-price {
            font-size: 18px;
            font-weight: bold;
            color: rgb(0 55 193 / 1);
          }

          .skip-period {
            font-size: 18px;
            color: #ccc;
            font-weight: bold;

          }

          .footer-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
          }

          .footer-btn {
            padding: 12px 30px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .back-btn {
            background-color: #374151;
            color: white;
          }

          .back-btn:hover {
            background-color: #4b5563;
          }

          .continue-btn {
            background: linear-gradient(90deg, transparent, rgba(255, 222, 89, 0.5), rgba(255, 222, 89, 0.5), rgba(255, 222, 89, 0.5), rgba(255, 222, 89, 0.5), transparent);
            color: white;
          }

          .continue-btn:hover {
            color: black;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          }

          /* Responsive Design */
          @media (max-width: 992px) {
            .skip-container {
              gap: 1.5rem;
            }
            
            .card {
              width: 260px;
              height: 330px;
            }
          }

          @media (max-width: 768px) {
            .skip-container {
              padding: 1rem;
              gap: 1rem;
            }
            
            .card {
              width: 240px;
              height: 310px;
            }
            
            .front-content {
              padding: 12px;
            }
            
            .descriptions {
              padding: 12px;
            }
            
            .title {
              font-size: 13px;
            }
            
            .badge {
              font-size: 11.5px;
              padding: 3px 10px;
            }

            .ribbon-text {
              font-size: 10px;
            }

            .selected-skip-info {
              flex-direction: column;
              text-align: center;
              gap: 10px;
            }

            .footer-buttons {
              flex-direction: column;
            }

            .footer-btn {
              width: 100%;
            }
          }

          @media (max-width: 480px) {
            .skip-container {
              flex-direction: column;
              align-items: center;
            }
            
            .card {
              width: min(280px, 90vw);
              height: 330px;
            }

            .selection-footer {
              padding: 15px;
            }
          }

          @media (max-width: 360px) {
            .card {
              width: min(240px, 85vw);
              height: 310px;
            }
            
            .circle {
              width: 100px;
              height: 100px;
            }
            
            .circle-bottom {
              width: 150px;
              height: 150px;
              left: 50px;
            }

            .ribbon-badge {
              width: 120px;
              height: 120px;
            }

            .ribbon-text {
              font-size: 9px;
            }
          }
        `}</style>

        {skips.map((skip, index) => (
          <SkipCard
            key={index}
            size={skip.size}
            price={skip.price}
            period={skip.period}
            roadAllowed={skip.roadAllowed}
            imageUrl={skip.imageUrl}
            heavyWaste={skip.heavyWaste}
            transportCost={skip.transportCost}
            costPerTonne={skip.costPerTonne}
            colors={skip.colors}
            onSelect={handleSkipSelect}
          />
        ))}
      </div>

      {selectedSkip && (
        <div className="selection-footer">
          <div className="footer-content">
            <p className="disclaimer">
              Imagery and information shown throughout this website may not reflect the exact shape or size specification, colours may vary, options and/or accessories may be featured at additional cost.
            </p>
            <div className="selected-skip-info">
              <span className="skip-title">{selectedSkip.size} Yard Skip</span>
              <span className="skip-price">£{selectedSkip.price}</span>
              <span className="skip-period">{selectedSkip.period} day hire</span>
            </div>
            <div className="footer-buttons">
              <button className="footer-btn back-btn" onClick={handleBack}>
                Back
              </button>
              <button className="footer-btn continue-btn" onClick={handleContinue}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SkipCards;