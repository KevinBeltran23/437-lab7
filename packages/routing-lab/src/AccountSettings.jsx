import { useState } from "react";

export function AccountSettings({ userName, setUserName }) {
    const [newUserName, setNewUserName] = useState(userName); // Local state for the input

    const handleChange = (event) => {
        setNewUserName(event.target.value); // Update local state
    };

    const handleSave = () => {
        setUserName(newUserName); // Update the username in the parent component
    };

    return (
        <div>
            <h2>Account settings</h2>
            <label>
                Username: 
                <input 
                    type="text" 
                    value={newUserName} 
                    onChange={handleChange} 
                />
            </label>
            <button onClick={handleSave}>Save</button>
            <p><i>Changes are auto-saved.</i></p>
        </div>
    );
}
