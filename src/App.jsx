// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';

const App = () => {
  // State variables to hold form inputs
  const [groupName, setGroupName] = useState('');
  const [otherPhoneNumbers, setOtherPhoneNumbers] = useState(''); // For multiple phone numbers entered as text
  const [secretCode, setSecretCode] = useState(''); // Secret code field
  const [error, setError] = useState(''); // Error message state

  // Function to validate phone numbers format (without @c.us)
  const validatePhoneNumbers = (numbers) => {
    const numberArray = numbers.split('\n').map((num) => num.trim());
    for (const number of numberArray) {
      // Validate the format: only digits and length between 10 to 15 characters
      if (!/^\d{10,15}$/.test(number)) {
        return false;
      }
    }
    return true;
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    // Check if all required fields are filled
    if (!groupName || !otherPhoneNumbers || !secretCode) {
      setError('Please fill in all fields including Secret Code and enter phone numbers in the correct format.');
      return;
    }

    // Validate the format of the phone numbers entered in the text area
    if (!validatePhoneNumbers(otherPhoneNumbers)) {
      setError('One or more phone numbers are in an incorrect format. Please ensure they follow <country code><number> without "+" at the start.');
      return;
    }

    // Format phone numbers by adding @c.us suffix
    const formattedPhoneNumbers = otherPhoneNumbers
      .split('\n') // Split by new line
      .map((number) => `${number.trim()}@c.us`)
      .filter((number) => number.trim() !== ''); // Remove any empty lines

    // Create a request payload
    const payload = {
      groupName: groupName,
      phoneNumbers: formattedPhoneNumbers,
      SecretCode: secretCode
    };

    // Send the payload to the backend API
    try {
      const response = await fetch('139.59.35.157:3000/create-group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Group created successfully with ID: ${result.groupId}`);
        setError(''); // Clear error message on successful submission
        setGroupName('');
        setOtherPhoneNumbers('');
        setSecretCode('');
      } else {
        alert(`Error: ${result.error}`);
        setError(result.error);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      setError('Failed to create group. Please check the server logs.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        <div className="Intro mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome!</h2>
          <p className="text-gray-600 leading-relaxed">
            If you want to add people into a group, then you have come to the best place.
            Fill in the details below and I will create a group and add all the people to it.
            In case of any errors, they will be notified to you.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Each phone number should be in the format &lt;country code&gt;&lt;number&gt; without `+` at the start.
            For example, 919876543210 for an Indian number. Enter one number per line.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Group Name</label>
            <input
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Secret Code</label>
            <input
              type="text"
              placeholder="Enter Secret Code"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Numbers (One Per Line)</label>
            <textarea
              placeholder="Enter phone numbers, one per line, e.g., 912134567890"
              value={otherPhoneNumbers}
              onChange={(e) => setOtherPhoneNumbers(e.target.value)}
              rows="6" // Set more rows for better visibility
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Submit
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By submitting, you agree to our <a href="#" className="text-blue-600 underline">Terms and Conditions</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
