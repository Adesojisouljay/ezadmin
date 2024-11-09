import React, { useState } from 'react';
import { sendEmailBroadcast } from 'api';
import './email.css';

const EmailBroadcast = () => {

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendEmail = async () => {
    if (!subject || !message) {
      setStatusMessage('Please fill in both subject and message fields.');
      return;
    }

    setLoading(true);
    setStatusMessage('');
    
    try {
      await sendEmailBroadcast(subject, message);
      setStatusMessage('Broadcast email sent successfully!');
    } catch (error) {
      setStatusMessage('Error sending email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-broadcast-container">
      <h2>Send Broadcast Email</h2>
      
      <div className="input-group">
        <label htmlFor="subject">Email Subject</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={handleSubjectChange}
          placeholder="Enter email subject"
        />
      </div>

      <div className="input-group">
        <label htmlFor="message">Email Message</label>
        <textarea
          id="message"
          value={message}
          onChange={handleMessageChange}
          placeholder="Enter email message"
          rows="8"
        />
      </div>

      <button
        className="send-button"
        onClick={handleSendEmail}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Broadcast Email'}
      </button>

      {statusMessage && (
        <p className="status-message">
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default EmailBroadcast;
