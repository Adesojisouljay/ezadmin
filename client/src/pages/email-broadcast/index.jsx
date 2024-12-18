import React, { useState } from 'react';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';
import { sendEmailBroadcast } from 'api';
import './email.css';

const EmailBroadcast = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleMessageChange = (value) => {
    setMessage(value);
  };

  const handleSendEmail = async () => {
    if (!subject || !message) {
      setStatusMessage('Please fill in both subject and message fields.');
      setStatusType('error');
      return;
    }

    setLoading(true);
    setStatusMessage('');
    
    try {
      await sendEmailBroadcast(subject, message);
      setStatusMessage('Broadcast email sent successfully!');
      setStatusType('success');
      setMessage("")
      setSubject("")
    } catch (error) {
      setStatusMessage('Error sending email. Please try again.');
      setStatusType('error');
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
        <ReactQuill
          value={message}
          onChange={handleMessageChange}
          placeholder="Enter email message"
          className='quill'
          theme="snow"
          modules={{
            toolbar: [
              [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['bold', 'italic', 'underline'],
              [{ 'align': [] }],
              ['link', 'image'],
              ['blockquote', 'code-block'],
              ['clean'],
            ],
          }}
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
        <p className={`status-message ${statusType}`}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default EmailBroadcast;
