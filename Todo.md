## Todos:

### Backend:
- Error handling: Catch sql errors and send to client
- Research about CORS policy -> maybe remove wildcard origin
- Expand database.js and api to the growing database

### Security:
- JWT Tokens for authorization (! this might make the whole remebered_user thing useless!)
    - Set up different server for jwt stuff (https://www.youtube.com/watch?v=mbsmsi7l3r4&list=PLLxAP2lAZj4Ns6QW9fFDvWPyNGGUS0Ufm&index=3&t=137s  16:00)
    - check if refreshing tokens and acces tokens work (take care of sql errors)!
    - finish video (min 25:00)
    - move whole authentication process to auth.js
    - authorize user when sending requests to server
    - reconsider localStorage session-management
- mail verification
- password reset option
- rate limiter for post request on login/signup
- recaptcha on sign up

### Frontend:
- Home-page with map of trains and form for searching train connections
    - prevent from routing to home page when user didn't login before!
    - dialogue for user profile modifications
    - confirm dialogue for log out

### Database:
- Plan further tables
    - Sold tickets
- Start with implementing a table for a test-train


### Backlog:
- Learn about SSL encryption, so data can be safely transferred through http requests