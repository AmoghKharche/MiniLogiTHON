import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import './Upload.css';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [shipmentsByDestination, setShipmentsByDestination] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: '.csv' });

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Shipments by destination:', response.data);
      setShipmentsByDestination(response.data);
      window.alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <header className="header">
        <h1 className="logo">LogiTHON</h1>
        <nav className="navbar">
          <ul className="nav-menu">
            <li className="nav-item"><a href="#">Home</a></li>
            <li className="nav-item"><a href="#">About</a></li>
            <li className="nav-item"><a href="#">Contact</a></li>
          </ul>
        </nav>
      </header>
      <div className="upload-container">
        <h1 className="upload-heading">Upload CSV File</h1>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag and drop a CSV file here, or click to select</p>
        </div>
        <p>{fileName}</p>
        <button className="upload-button" onClick={handleFileUpload}>Upload</button>
      </div>

      {shipmentsByDestination && (
        <div className="shipment-tables">
          {Object.entries(shipmentsByDestination).map(([destination, shipments]) => (
            <div key={destination}>
              <h2>Destination: {destination}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Shipment ID</th>
                    
                    <th>Weight</th>
                    <th>Length</th>
                    <th>Height</th>
                    <th>Width</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((shipment, index) => (
                    <tr key={index}>
                      <td>{shipment['ShipmentID']}</td>
                      
                      <td>{shipment.Weight}</td>
                      <td>{shipment.Length}</td>
                      <td>{shipment.Height}</td>
                      <td>{shipment.Width}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UploadPage;
