import React from 'react';
import { useActionState } from 'react'; // Adjust the import based on your actual hook location

export function UsernamePasswordForm ({ onSubmit }) {
    const [result, submitAction, isPending] = useActionState(
        async (previousState, formData) => {
            const username = formData.get("username");
            const password = formData.get("password");

            if (!username || !password) {
                return {
                    type: "error",
                    message: "Please fill in your username and password.",
                };
            }

            console.log('Username:', username);
            console.log('Password:', password);
            // Here you would typically call your API to submit the data

            // Call the onSubmit prop with the form data
            const submitResult = await onSubmit({ username, password });
            return submitResult;
        },
        null
    );

    return (
        <>
            {result && <p className={`message ${result.type}`}>{result.message}</p>}
            {isPending && <p className="message loading">Loading ...</p>}
            <form action={submitAction}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" />
                </div>
                <div>
                    <button type="submit" disabled={isPending}>Submit</button>
                </div>
            </form>
        </>
    );
};

export default UsernamePasswordForm;

