import React from 'react';
import './index.css';

export const KycImageModal = ({ idDocumentUrl, selfieUrl, onClose, userProfile }) => {

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>×</button>
        <div className="modal-user-profile">
          <h3>User Profile</h3>
          <p><strong>Name:</strong> {userProfile?.firstName} {userProfile?.lastName}</p>
          <p><strong>Username:</strong> {userProfile?.username}</p>
          <p><strong>Email:</strong> {userProfile?.email}</p>
        </div>
        <div className="modal-images">
          <img src={idDocumentUrl} alt="ID Document" className="modal-image" />
          <img src={selfieUrl} alt="Selfie" className="modal-image" />
        </div>
      </div>
    </div>
  );
};
