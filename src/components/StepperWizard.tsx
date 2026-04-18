import React from 'react';
import { FileText, Wand2, PenTool } from 'lucide-react';

const steps = [
  { id: 1, label: 'Thiết lập', icon: FileText },
  { id: 2, label: 'Nội dung AI', icon: Wand2 },
  { id: 3, label: 'Tinh chỉnh', icon: PenTool },
];

export default function StepperWizard({ currentStep, onStepChange }) {
  return (
    <div className="stepper-container">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        
        return (
          <React.Fragment key={step.id}>
            <div 
              className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => isCompleted && onStepChange(step.id)}
              style={{ cursor: isCompleted ? 'pointer' : 'default' }}
            >
              <div className="step-number">
                {isCompleted ? '✓' : step.id}
              </div>
              <div className="step-label">{step.label}</div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`step-connector ${isCompleted ? 'active' : ''}`} />
            )}
          </React.Fragment>
        );
      })}

      <style jsx>{`
        .step-connector {
          flex: 1;
          height: 2px;
          background: #e2e8f0;
          max-width: 100px;
          margin-top: -1.25rem;
        }
        .step-connector.active {
          background: #1e3a8a;
        }
        .step-item.completed .step-number {
          background: #10b981;
          color: white;
        }
      `}</style>
    </div>
  );
}
