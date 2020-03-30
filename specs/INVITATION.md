# Sepcification User Invitation

This specification is describing the process of inviting new users to the system.
The targeted users are

- new core team members (role: `team`)
- new co-administrators (role: `admin`)
- new instructors and teachers (role: `teacher`)

This workflow differes from inviting participants because the above described user groups inhibit
certain privileges and require a stricter authentication than the code-based auth of participants.


## Invitation requirements

- There needs to be a role `inviteUsers` that permits to send invitations to users
- The invitation needs to be entered by a privileged request via
 - Form entry (a privileged user enters the invitation credentials manually via a form)
 - API request (there is a privileged / authorized request to a specific API with the 
   respecitve invitation credentials)
- The invitation schema requires at least
 - `email`, `firstName`, `lastName`, `role`, `institution` and `application` (id)
 - There needs to be a configured redirect url for the respective application id
   in order to redirect the invited user on successfull registration to the right application


## Invitation workflow

- A privileged request creates asks for a new invitation for the given credentials
 - If an account exists by given `email` throw an error
 - If the schema is incomplete or invalid, throw an error
- On acceptance the server generates a default random (32-charatcer long) password
- The server generates an expiration date by a given offset (in days) that it reads from the settings.json file
- The server creates a new user account with given credentials plus the random password
- The server assigns the given role to the new user account but keeps the account in an "invalid" status
- The server sends to enrolment email to the given user

- The user opens the enrolment link and gets directed to the enrollment page
- The user is asked to choose change her password
- On successful password update the user is redirected to the defined application redirect url


