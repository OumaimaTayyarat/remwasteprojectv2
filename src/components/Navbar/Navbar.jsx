import React, { useState, useEffect } from 'react';
import { MapPin, Trash2, Truck, Shield, Calendar, CreditCard } from 'lucide-react';

const NavBar = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const steps = [
    {
      id: 0,
      label: 'Postcode',
      icon: MapPin,
      active: true,
      completed: false
    },
    {
      id: 1,
      label: 'Waste Type',
      icon: Trash2,
      active: true,
      completed: false
    },
    {
      id: 2,
      label: 'Select Skip',
      icon: Truck,
      active: true,
      completed: false
    },
    {
      id: 3,
      label: 'Permit Check',
      icon: Shield,
      active: false,
      completed: false
    },
    {
      id: 4,
      label: 'Choose Date',
      icon: Calendar,
      active: false,
      completed: false
    },
    {
      id: 5,
      label: 'Payment',
      icon: CreditCard,
      active: false,
      completed: false
    }
  ];

  const handleStepClick = (stepId) => {
    if (steps[stepId].active) {
      setCurrentStep(stepId);
    }
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getVisibleSteps = () => {
    if (!isMobile) {
      return steps;
    } else {
      const visibleSteps = [];
      visibleSteps.push(steps[currentStep]);
      
      if (currentStep < steps.length - 1) {
        visibleSteps.push(steps[currentStep + 1]);
      } else if (currentStep > 0) {
        visibleSteps.unshift(steps[currentStep - 1]);
        visibleSteps.pop();
      }
      
      return visibleSteps;
    }
  };

  const visibleSteps = getVisibleSteps();

  return (
    <div className="navbar-container">
      <div className="navbar-content">
        {visibleSteps.length > 1 && (
          <div className={`navbar-line ${isMobile ? 'navbar-line-mobile' : 'navbar-line-desktop'}`}></div>
        )}
        
        <div className="navbar-steps">
          {visibleSteps.map((step) => {
            const IconComponent = step.icon;
            
            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`navbar-step ${
                  !step.active ? 'navbar-step-inactive' : 
                  currentStep === step.id ? 'navbar-step-current' : 'navbar-step-active'
                }`}
                disabled={!step.active}
              >
                <div className={`navbar-icon ${
                  !step.active ? 'navbar-icon-inactive' : 
                  currentStep === step.id ? 'navbar-icon-current' : 'navbar-icon-active'
                }`}>
                  <IconComponent size={isMobile ? 12 : 16} />
                </div>
                <span className={`navbar-label ${
                  !step.active ? 'navbar-label-inactive' : 
                  currentStep === step.id ? 'navbar-label-current' : 'navbar-label-active'
                }`}>
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>

        {isMobile && (
          <>
            <div className="navbar-dots">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`navbar-dot ${
                    index === currentStep ? 'navbar-dot-current' : 
                    index < currentStep ? 'navbar-dot-completed' : 'navbar-dot-inactive'
                  }`}
                />
              ))}
            </div>

            <div className="navbar-navigation">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className={`navbar-nav-btn ${currentStep === 0 ? 'navbar-nav-btn-disabled' : ''}`}
                disabled={currentStep === 0}
              >
                ←
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className={`navbar-nav-btn navbar-nav-btn-primary ${
                  currentStep === steps.length - 1 ? 'navbar-nav-btn-disabled' : ''
                }`}
                disabled={currentStep === steps.length - 1}
              >
                →
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .navbar-container {
          padding-top: 0.5rem;
          border-radius: 0.375rem;
          width: 90%;
          max-width: 900px;
          margin: 0 auto;
        }

        @media (min-width: 640px) {
          .navbar-container {
            padding: 1rem;
          }
        }

        .navbar-content {
          position: relative;
        }

        .navbar-line {
          position: absolute;
          top: 50%;
          height: 1px;
          background-color: #4b5563;
          transform: translateY(-50%);
          z-index: 0;
        }

        .navbar-line-mobile {
          left: 25%;
          right: 25%;
        }

        .navbar-line-desktop {
          left: 1.5rem;
          right: 1.5rem;
        }

        .navbar-steps {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }

        .navbar-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.3s ease;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }

        .navbar-step:disabled {
          cursor: not-allowed;
        }

        .navbar-icon {
          padding: 0.375rem;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        @media (min-width: 640px) {
          .navbar-icon {
            padding: 0.5rem;
          }
        }

        .navbar-icon-inactive {
          background-color: #374151;
          color: rgba(255, 255, 255, 0.6);
        }

        .navbar-icon-current {
          background-color: rgb(0 55 193 / 1);
          color: white;
        }

        .navbar-icon-active {
          background-color: #1f2937;
          color: rgb(0 55 193 / 1);
        }

        .navbar-icon-active:hover {
          background-color: #374151;
        }

        .navbar-label {
          margin-top: 0.25rem;
          font-size: 0.625rem;
          font-weight: 500;
          transition: color 0.3s ease;
          text-align: center;
        }

        @media (min-width: 640px) {
          .navbar-label {
            font-size: 0.75rem;
            margin-top: 0.375rem;
          }
        }

        .navbar-label-inactive {
          color: rgba(255, 255, 255, 0.6);
        }

        .navbar-label-current {
          color: white;
        }

        .navbar-label-active {
          color: rgb(0 55 193 / 1);
        }

        .navbar-dots {
          display: flex;
          justify-content: center;
          margin-top: 0.5rem;
          gap: 0.1875rem;
        }

        @media (min-width: 1024px) {
          .navbar-dots {
            display: none;
          }
        }

        .navbar-dot {
          width: 0.375rem;
          height: 0.375rem;
          border-radius: 50%;
          transition: background-color 0.3s ease;
        }

        .navbar-dot-current {
          background-color: rgb(0 55 193 / 1);
        }

        .navbar-dot-completed {
          background-color: #60a5fa;
        }

        .navbar-dot-inactive {
          background-color: #4b5563;
        }

        .navbar-navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
        }

        @media (min-width: 1024px) {
          .navbar-navigation {
            display: none;
          }
        }

        .navbar-nav-btn {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          border-radius: 0.25rem;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          background-color: #374151;
          color: white;
        }

        .navbar-nav-btn:hover:not(.navbar-nav-btn-disabled) {
          background-color: #4b5563;
        }

        .navbar-nav-btn-primary {
          background-color: rgb(0 55 193 / 1);
        }

        .navbar-nav-btn-primary:hover:not(.navbar-nav-btn-disabled) {
          background-color: #1d4ed8;
        }

        .navbar-nav-btn-disabled {
          background-color: #374151;
          color: #6b7280;
          cursor: not-allowed;
          opacity: 0.5;
        }

        @media (max-width: 767px) {
          .navbar-container {
            padding: 0.5rem;
            margin: 0 0.5rem;
          }
          
          .navbar-icon {
            padding: 0.25rem;
          }
          
          .navbar-label {
            font-size: 0.625rem;
          }
        }
      `}</style>
    </div>
  );
};

export default NavBar;